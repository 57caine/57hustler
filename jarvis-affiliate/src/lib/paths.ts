import path from 'node:path';

/** プロジェクトのルート。npm scripts / astro build はプロジェクト直下から実行される前提 */
export const ROOT = process.env.JARVIS_ROOT ?? process.cwd();
export const p = (...segments: string[]) => path.join(ROOT, ...segments);
