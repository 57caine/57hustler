// Server Actionsの入力検証ヘルパー（手書き・追加依存なし）。
// 既存のpackage.jsonにはzod等のvalidation libraryが入っていないため、
// 新規依存を追加せず素のTypeScriptで実装している（STEP4要件：
// 新依存が必要な場合は勝手に追加せず報告すること、に基づく判断）。
//
// 例外(ActionError)のmessageは常にユーザーにそのまま表示してよい安全な文言のみを使う。
// Supabaseの生エラー・SQL文・内部構造は一切含めない。

export class ActionError extends Error {}

function asString(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

export function requireString(v: FormDataEntryValue | null, field: string, maxLen = 200): string {
  const s = asString(v);
  if (!s) throw new ActionError(`${field}は必須です`);
  if (s.length > maxLen) throw new ActionError(`${field}が長すぎます`);
  return s;
}

export function optionalString(v: FormDataEntryValue | null, field: string, maxLen = 500): string | null {
  const s = asString(v);
  if (!s) return null;
  if (s.length > maxLen) throw new ActionError(`${field}が長すぎます`);
  return s;
}

export function requireNumber(v: FormDataEntryValue | null, field: string): number {
  const s = asString(v);
  const n = Number(s);
  if (!s || !Number.isFinite(n)) throw new ActionError(`${field}は数値で入力してください`);
  return n;
}

export function optionalNumber(v: FormDataEntryValue | null, field: string): number | null {
  const s = asString(v);
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) throw new ActionError(`${field}は数値で入力してください`);
  return n;
}

export function requireInt(v: FormDataEntryValue | null, field: string): number {
  const n = requireNumber(v, field);
  if (!Number.isInteger(n)) throw new ActionError(`${field}は整数で入力してください`);
  return n;
}

export function optionalInt(v: FormDataEntryValue | null, field: string): number | null {
  const n = optionalNumber(v, field);
  if (n !== null && !Number.isInteger(n)) throw new ActionError(`${field}は整数で入力してください`);
  return n;
}

export function requireEnum<T extends string>(v: FormDataEntryValue | null, field: string, allowed: readonly T[]): T {
  const s = asString(v);
  if (!allowed.includes(s as T)) throw new ActionError(`${field}の値が不正です`);
  return s as T;
}

export function optionalEnum<T extends string>(v: FormDataEntryValue | null, field: string, allowed: readonly T[]): T | null {
  const s = asString(v);
  if (!s) return null;
  if (!allowed.includes(s as T)) throw new ActionError(`${field}の値が不正です`);
  return s as T;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function requireDate(v: FormDataEntryValue | null, field: string): string {
  const s = asString(v);
  if (!DATE_RE.test(s) || Number.isNaN(new Date(`${s}T00:00:00Z`).getTime())) {
    throw new ActionError(`${field}はYYYY-MM-DD形式の正しい日付で入力してください`);
  }
  return s;
}

export function optionalDate(v: FormDataEntryValue | null, field: string): string | null {
  const s = asString(v);
  if (!s) return null;
  if (!DATE_RE.test(s) || Number.isNaN(new Date(`${s}T00:00:00Z`).getTime())) {
    throw new ActionError(`${field}はYYYY-MM-DD形式の正しい日付で入力してください`);
  }
  return s;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function requireUuid(v: FormDataEntryValue | null, field: string): string {
  const s = asString(v);
  if (!UUID_RE.test(s)) throw new ActionError(`${field}が不正です`);
  return s;
}
