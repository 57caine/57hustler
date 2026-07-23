/**
 * 雑草おじさん ストックデータ → Google Sheets 同期スクリプト
 *
 * data/zassou-stock.json の内容を Google Sheets に書き込む（JSON→Sheet 一方向）
 *
 * 実行: npx ts-node scripts/sync-zassou-to-sheets.ts
 * 環境変数:
 *   GA4_SERVICE_ACCOUNT_KEY  - サービスアカウントJSONキー（文字列）
 *   ZASSOU_SHEET_ID          - 書き込み先スプレッドシートID
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();
const STOCK_PATH = path.join(ROOT, 'data/zassou-stock.json');

const SHEET_NAME  = 'Stock';
const HEADER_ROW  = ['ID', 'ジャンル', '作品名', '出演者', '内部メモ', '画像URL', 'サンプル動画URL', 'アフィリリンク', '親投稿本文', 'リプライ本文', '投稿済み'];

interface StockItem {
  zId: string;
  genre: string;
  title: string;
  actressName: string;
  comment: string;
  imageUrl: string;
  sampleUrl: string;
  affiliateUrl: string;
  parentPost: string;
  replyPost: string;
  posted: boolean;
}

interface StockFile {
  updatedAt: string;
  totalCount: number;
  items: StockItem[];
}

async function main() {
  const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('GA4_SERVICE_ACCOUNT_KEY が設定されていません');

  const sheetId = process.env.ZASSOU_SHEET_ID;
  if (!sheetId) throw new Error('ZASSOU_SHEET_ID が設定されていません');

  const credentials = JSON.parse(keyJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // ── ストックデータ読み込み ─────────────────────────────────────
  if (!fs.existsSync(STOCK_PATH)) throw new Error(`${STOCK_PATH} が存在しません`);
  const stock: StockFile = JSON.parse(fs.readFileSync(STOCK_PATH, 'utf-8'));
  const items = stock.items;
  console.log(`ストックデータ読み込み: ${items.length}件`);

  // ── シートの確認・作成 ────────────────────────────────────────
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const existingSheets = spreadsheet.data.sheets ?? [];
  const stockSheet = existingSheets.find(s => s.properties?.title === SHEET_NAME);
  let sheetGid: number;

  if (!stockSheet) {
    console.log(`シート「${SHEET_NAME}」が存在しないため作成します`);
    const addResp = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: { title: SHEET_NAME },
          },
        }],
      },
    });
    sheetGid = addResp.data.replies?.[0]?.addSheet?.properties?.sheetId ?? 0;
  } else {
    sheetGid = stockSheet.properties?.sheetId ?? 0;
    console.log(`シート「${SHEET_NAME}」に書き込み (gid=${sheetGid})`);
  }

  // ── データ行生成（親投稿・リプライ本文は改行を \\n に変換してセル内に収める） ──
  const dataRows = items.map(item => [
    item.zId,
    item.genre,
    item.title,
    item.actressName,
    item.comment,
    item.imageUrl,
    item.sampleUrl,
    item.affiliateUrl,
    item.parentPost,
    item.replyPost,
    item.posted,           // boolean: TRUEでチェックボックスON
  ]);

  const allRows = [HEADER_ROW, ...dataRows];
  const lastRow = allRows.length;
  const lastCol = 'K';  // 11列
  const range = `${SHEET_NAME}!A1:${lastCol}${lastRow}`;

  // ── シートをクリアして書き込み ─────────────────────────────────
  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range: `${SHEET_NAME}!A:K`,
  });
  console.log('既存データをクリア');

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: allRows },
  });
  console.log(`データ書き込み完了: ${items.length}行`);

  // ── 書式設定リクエストをまとめて実行 ─────────────────────────
  const formatRequests: object[] = [
    // ヘッダー行: 太字・背景色（薄いグレー）・テキスト折り返しなし
    {
      repeatCell: {
        range: { sheetId: sheetGid, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 11 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.85, green: 0.85, blue: 0.85 },
            textFormat: { bold: true },
            wrapStrategy: 'CLIP',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,wrapStrategy)',
      },
    },
    // データ行: 折り返し（WRAP）
    {
      repeatCell: {
        range: { sheetId: sheetGid, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 0, endColumnIndex: 10 },
        cell: {
          userEnteredFormat: { wrapStrategy: 'WRAP' },
        },
        fields: 'userEnteredFormat(wrapStrategy)',
      },
    },
    // 「投稿済み」列（K列=index10）をチェックボックスにする
    {
      setDataValidation: {
        range: { sheetId: sheetGid, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 10, endColumnIndex: 11 },
        rule: {
          condition: { type: 'BOOLEAN' },
          showCustomUi: true,
        },
      },
    },
    // 列幅設定（ピクセル）
    ...[
      { col: 0,  width: 70  },  // ID
      { col: 1,  width: 80  },  // ジャンル
      { col: 2,  width: 250 },  // 作品名
      { col: 3,  width: 120 },  // 出演者
      { col: 4,  width: 180 },  // 内部メモ
      { col: 5,  width: 80  },  // 画像URL
      { col: 6,  width: 80  },  // サンプル動画URL
      { col: 7,  width: 80  },  // アフィリリンク
      { col: 8,  width: 280 },  // 親投稿本文
      { col: 9,  width: 280 },  // リプライ本文
      { col: 10, width: 80  },  // 投稿済み
    ].map(({ col, width }) => ({
      updateDimensionProperties: {
        range: { sheetId: sheetGid, dimension: 'COLUMNS', startIndex: col, endIndex: col + 1 },
        properties: { pixelSize: width },
        fields: 'pixelSize',
      },
    })),
    // 先頭行を固定
    {
      updateSheetProperties: {
        properties: {
          sheetId: sheetGid,
          gridProperties: { frozenRowCount: 1 },
        },
        fields: 'gridProperties.frozenRowCount',
      },
    },
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: { requests: formatRequests },
  });
  console.log('書式設定完了（ヘッダー太字・チェックボックス・列幅・行固定）');

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}`;
  console.log(`\n✅ 同期完了`);
  console.log(`   件数: ${items.length}件`);
  console.log(`   更新日時: ${stock.updatedAt}`);
  console.log(`   シートURL: ${url}`);
}

main().catch(e => { console.error(e); process.exit(1); });
