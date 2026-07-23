/**
 * 雑草おじさん ストックデータ → Google Sheets 同期スクリプト
 *
 * data/zassou-stock.json の内容を Google Sheets に書き込む（JSON→Sheet 一方向）
 *
 * 実行: npx ts-node scripts/sync-zassou-to-sheets.ts
 * 環境変数:
 *   GA4_SERVICE_ACCOUNT_KEY  - サービスアカウントJSONキー（文字列）
 *   ZASSOU_SHEET_ID          - 書き込み先スプレッドシートID
 *
 * 列構成: ID / ジャンル / 作品名 / 出演者 / アフィリリンク / 親投稿本文 / リプライ本文 / 投稿済み
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();
const STOCK_PATH = path.join(ROOT, 'data/zassou-stock.json');

const SHEET_NAME = 'Stock';
const HEADER_ROW = ['ID', 'ジャンル', '作品名', '出演者', 'アフィリリンク', '親投稿本文', 'リプライ本文', '投稿済み'];
const COL_COUNT  = HEADER_ROW.length; // 8
const LAST_COL   = 'H';

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

/**
 * parentPost を「キャッチコピー本文 + sampleUrl 1本」に正規化する。
 * - テキスト部分（非URL行）を抽出
 * - 既存のURLをすべて除去し、sampleUrl のみ末尾に付与
 * - sampleUrl が空の場合はテキストのみ
 */
function normalizeParentPost(parentPost: string, sampleUrl: string): string {
  const lines = parentPost.split('\n');
  const textLines = lines.filter(l => !l.trim().match(/^https?:\/\//));
  const text = textLines.join('\n').trim();
  return sampleUrl ? `${text}\n${sampleUrl}` : text;
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
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      },
    });
    sheetGid = addResp.data.replies?.[0]?.addSheet?.properties?.sheetId ?? 0;
  } else {
    sheetGid = stockSheet.properties?.sheetId ?? 0;
    console.log(`シート「${SHEET_NAME}」に書き込み (gid=${sheetGid})`);
  }

  // ── データ行生成 ──────────────────────────────────────────────
  const dataRows = items.map(item => [
    item.zId,
    item.genre,
    item.title,
    item.actressName,
    item.affiliateUrl,
    normalizeParentPost(item.parentPost, item.sampleUrl),
    item.replyPost,
    item.posted,  // boolean → チェックボックス
  ]);

  const allRows = [HEADER_ROW, ...dataRows];
  const lastRow = allRows.length;
  const range = `${SHEET_NAME}!A1:${LAST_COL}${lastRow}`;

  // ── クリア → 書き込み ─────────────────────────────────────────
  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range: `${SHEET_NAME}!A:${LAST_COL}`,
  });
  console.log('既存データをクリア');

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: allRows },
  });
  console.log(`データ書き込み完了: ${items.length}行`);

  // ── 書式設定 ─────────────────────────────────────────────────
  const formatRequests: object[] = [
    // ヘッダー: 太字・灰色背景
    {
      repeatCell: {
        range: { sheetId: sheetGid, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: COL_COUNT },
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
    // データ行: 折り返し（投稿済み列除く）
    {
      repeatCell: {
        range: { sheetId: sheetGid, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 0, endColumnIndex: COL_COUNT - 1 },
        cell: { userEnteredFormat: { wrapStrategy: 'WRAP' } },
        fields: 'userEnteredFormat(wrapStrategy)',
      },
    },
    // 「投稿済み」列（H列=index7）をチェックボックスにする
    {
      setDataValidation: {
        range: { sheetId: sheetGid, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 7, endColumnIndex: 8 },
        rule: {
          condition: { type: 'BOOLEAN' },
          showCustomUi: true,
        },
      },
    },
    // 列幅設定
    ...[
      { col: 0, width: 70  },  // ID
      { col: 1, width: 80  },  // ジャンル
      { col: 2, width: 260 },  // 作品名
      { col: 3, width: 120 },  // 出演者
      { col: 4, width: 80  },  // アフィリリンク
      { col: 5, width: 300 },  // 親投稿本文
      { col: 6, width: 300 },  // リプライ本文
      { col: 7, width: 80  },  // 投稿済み
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
  console.log('\n✅ 同期完了');
  console.log(`   件数: ${items.length}件`);
  console.log(`   更新日時: ${stock.updatedAt}`);
  console.log(`   シートURL: ${url}`);
  console.log(`   列構成: ${HEADER_ROW.join(' / ')}`);
  console.log(`   A1セル: ${HEADER_ROW[0]}`);
}

main().catch(e => { console.error(e); process.exit(1); });
