/**
 * スクール・資格サイト用 A8.net アフィリエイトリンク自動取得スクリプト
 *
 * A8_JSESSIONID 環境変数が必要。
 * school-navi/data/schools.json と shikaku-navi/data/courses.json を更新する。
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// プログラム名（小文字）→ { site, slug } マッピング
// A8.netのプログラム名に含まれるキーワードでマッチ
const SCHOOL_PROGRAM_MAP: Record<string, { site: 'school' | 'shikaku'; slug: string }> = {
  // school-navi
  'tech camp': { site: 'school', slug: 'techcamp' },
  'テックキャンプ': { site: 'school', slug: 'techcamp' },
  'techcamp': { site: 'school', slug: 'techcamp' },
  'dmm webcamp': { site: 'school', slug: 'dmm-webcamp' },
  'dmm web camp': { site: 'school', slug: 'dmm-webcamp' },
  'webcamp': { site: 'school', slug: 'dmm-webcamp' },
  'techacademy': { site: 'school', slug: 'techacademy' },
  'テックアカデミー': { site: 'school', slug: 'techacademy' },
  'runteq': { site: 'school', slug: 'runteq' },
  'ランテック': { site: 'school', slug: 'runteq' },
  'codecamp': { site: 'school', slug: 'codecamp' },
  'コードキャンプ': { site: 'school', slug: 'codecamp' },
  'coachtech': { site: 'school', slug: 'coachtech' },
  'コーチテック': { site: 'school', slug: 'coachtech' },
  'zero plus': { site: 'school', slug: 'zero-plus' },
  'ゼロプラス': { site: 'school', slug: 'zero-plus' },
  '侍エンジニア': { site: 'school', slug: 'samurai-engineer' },
  'samurai': { site: 'school', slug: 'samurai-engineer' },
  'sejuku': { site: 'school', slug: 'samurai-engineer' },
  'techbooth': { site: 'school', slug: 'techbooth' },
  'テックブース': { site: 'school', slug: 'techbooth' },
  'geekjob': { site: 'school', slug: 'geekjob' },
  'ギークジョブ': { site: 'school', slug: 'geekjob' },
  'dive into code': { site: 'school', slug: 'dive-into-code' },
  'diveintocode': { site: 'school', slug: 'dive-into-code' },
  'raise tech': { site: 'school', slug: 'raise-tech' },
  'レイズテック': { site: 'school', slug: 'raise-tech' },
  'tech train': { site: 'school', slug: 'tech-train' },
  'techtrain': { site: 'school', slug: 'tech-train' },
  'progate': { site: 'school', slug: 'progate' },
  'プロゲート': { site: 'school', slug: 'progate' },
  // shikaku-navi
  'スタディング': { site: 'shikaku', slug: 'studying' },
  'studying': { site: 'shikaku', slug: 'studying' },
  'フォーサイト': { site: 'shikaku', slug: 'foresight' },
  'foresight': { site: 'shikaku', slug: 'foresight' },
  'アガルート': { site: 'shikaku', slug: 'agaroot' },
  'agaroot': { site: 'shikaku', slug: 'agaroot' },
  'クレアール': { site: 'shikaku', slug: 'crecer' },
  'crecer': { site: 'shikaku', slug: 'crecer' },
  'クレア': { site: 'shikaku', slug: 'crecer' },
  'tac': { site: 'shikaku', slug: 'tac' },
  'タック': { site: 'shikaku', slug: 'tac' },
  'lec': { site: 'shikaku', slug: 'lec' },
  'レック': { site: 'shikaku', slug: 'lec' },
  'ユーキャン': { site: 'shikaku', slug: 'yukiyukan' },
  'u-can': { site: 'shikaku', slug: 'yukiyukan' },
  'うかる': { site: 'shikaku', slug: 'kenteishiken' },
  'fp学校': { site: 'shikaku', slug: 'fp-school' },
  'itパスポート': { site: 'shikaku', slug: 'itpassport-school' },
};

interface AffiliateLink {
  slug: string;
  site: 'school' | 'shikaku';
  affiliateUrl: string;
  programName: string;
}

async function fetchLinks(jsessionId: string): Promise<AffiliateLink[]> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'ja-JP',
  });

  await context.addCookies([
    {
      name: 'JSESSIONID',
      value: jsessionId,
      domain: 'media-console.a8.net',
      path: '/',
      httpOnly: true,
      secure: true,
    },
  ]);

  const results: AffiliateLink[] = [];

  try {
    const page = await context.newPage();
    console.log('A8.net 参加中プログラム一覧を取得中...');

    await page.goto(
      'https://media-console.a8.net/program/list/partnered?pageNo=1&pageSize=100&sortKey=APPROVED_DATE&sortOrder=DESC',
      { waitUntil: 'networkidle', timeout: 30000 },
    );

    if (page.url().includes('login') || page.url().includes('signin')) {
      console.error('❌ 認証失敗: JSESSIONIDが無効または期限切れ');
      return [];
    }

    const programIds = await page.evaluate(() => {
      const ids: string[] = [];
      document.querySelectorAll('a[href*="create-link"]').forEach((el) => {
        const m = (el as HTMLAnchorElement).href.match(/programId=([^&\s]+)/);
        if (m && !ids.includes(m[1])) ids.push(m[1]);
      });
      return ids;
    });

    console.log(`${programIds.length}件のプログラムを検出`);
    await page.close();

    for (const programId of programIds) {
      const linkPage = await context.newPage();
      try {
        await linkPage.goto(
          `https://media-console.a8.net/program/create-link?programId=${programId}`,
          { waitUntil: 'networkidle', timeout: 20000 },
        );

        const { programName, a8Url } = await linkPage.evaluate(() => {
          const titleEl = document.querySelector('h1, h2, [class*="title"], [class*="program-name"]');
          const programName = titleEl?.textContent?.trim() ?? document.title ?? '';
          let a8Url: string | null = null;
          for (const a of Array.from(document.querySelectorAll('a[href*="px.a8.net"]'))) {
            a8Url = (a as HTMLAnchorElement).href;
            break;
          }
          if (!a8Url) {
            const m = document.body.innerText.match(/(https:\/\/px\.a8\.net[^\s"'<>\n]+)/);
            if (m) a8Url = m[1];
          }
          return { programName: programName as string, a8Url: a8Url as string | null };
        });

        if (!a8Url) {
          await linkPage.close();
          continue;
        }

        const lowerName = programName.toLowerCase();
        for (const [keyword, target] of Object.entries(SCHOOL_PROGRAM_MAP)) {
          if (lowerName.includes(keyword.toLowerCase())) {
            const baseUrl = a8Url.split('&a8ejpredirect')[0];
            if (!results.find((r) => r.slug === target.slug)) {
              results.push({
                slug: target.slug,
                site: target.site,
                affiliateUrl: baseUrl,
                programName,
              });
              console.log(`  ✅ ${target.site}/${target.slug}: ${baseUrl.slice(0, 60)}`);
            }
            break;
          }
        }
      } catch (e) {
        console.warn(`  [${programId}] ⚠ ${(e as Error).message?.slice(0, 60)}`);
      } finally {
        await linkPage.close();
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

function updateSchoolsJson(links: AffiliateLink[]): void {
  const schoolLinks = links.filter((l) => l.site === 'school');
  if (schoolLinks.length === 0) return;

  const filePath = path.join(process.cwd(), 'school-navi', 'data', 'schools.json');
  const data: Array<{ slug: string; affiliate_url: string }> = JSON.parse(
    fs.readFileSync(filePath, 'utf-8'),
  );

  for (const school of data) {
    const found = schoolLinks.find((l) => l.slug === school.slug);
    if (found) {
      school.affiliate_url = found.affiliateUrl;
      console.log(`  school-navi/${school.slug} 更新`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('✅ school-navi/data/schools.json 更新完了');
}

function updateCoursesJson(links: AffiliateLink[]): void {
  const shikakuLinks = links.filter((l) => l.site === 'shikaku');
  if (shikakuLinks.length === 0) return;

  const filePath = path.join(process.cwd(), 'shikaku-navi', 'data', 'courses.json');
  const data: Array<{ slug: string; affiliate_url: string }> = JSON.parse(
    fs.readFileSync(filePath, 'utf-8'),
  );

  for (const course of data) {
    const found = shikakuLinks.find((l) => l.slug === course.slug);
    if (found) {
      course.affiliate_url = found.affiliateUrl;
      console.log(`  shikaku-navi/${course.slug} 更新`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('✅ shikaku-navi/data/courses.json 更新完了');
}

(async () => {
  const jsessionId = process.env.A8_JSESSIONID;
  if (!jsessionId) {
    console.error('環境変数 A8_JSESSIONID が必要です');
    process.exit(1);
  }

  console.log('=== スクール・資格 A8 アフィリエイトリンク取得 ===\n');
  const links = await fetchLinks(jsessionId);
  console.log(`\n取得: ${links.length}件\n`);

  if (links.length > 0) {
    updateSchoolsJson(links);
    updateCoursesJson(links);
  } else {
    console.log('更新対象なし（A8.netでのプログラム参加確認が必要）');
  }
})().catch((e) => { console.error(e); process.exit(1); });
