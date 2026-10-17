import type { CSSProperties } from 'react';
import type { NetWorthItem } from '@/lib/supabase/home-data';
import { CATEGORY_OPTIONS } from './_labels';

// /assets/new・/assets/[id]/editで共用するフォーム本体(JSXのみ、データ取得なし)。
// 表示するフィールドは実DB schema(net_worth_items)に存在する列だけ。
// owner_idは絶対にフォームへ含めない(常にサーバー側で固定)。

const inputStyle: CSSProperties = {
  background: 'var(--bg)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '9px 10px',
  fontSize: 14,
  width: '100%',
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--muted)',
  marginBottom: 4,
  display: 'block',
};

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export default function AssetForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Partial<NetWorthItem>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-3">
      {defaultValues?.id && <input type="hidden" name="id" value={defaultValues.id} />}

      <Field label="資産名" required>
        <input
          name="label"
          required
          maxLength={200}
          defaultValue={defaultValues?.label ?? ''}
          placeholder="例：三菱UFJ銀行 普通預金"
          style={inputStyle}
        />
      </Field>

      <Field label="分類" required>
        <select name="category" defaultValue={defaultValues?.category ?? CATEGORY_OPTIONS[0].value} style={inputStyle}>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="資産 / 負債" required>
        <select name="kind" defaultValue={defaultValues?.kind ?? 'asset'} style={inputStyle}>
          <option value="asset">資産</option>
          <option value="liability">負債</option>
        </select>
      </Field>

      <Field label="現在の金額（円）" required>
        <input
          name="value_jpy"
          type="number"
          inputMode="numeric"
          required
          defaultValue={defaultValues?.value_jpy ?? ''}
          placeholder="例：1000000"
          style={inputStyle}
        />
      </Field>

      <Field label="基準日" required>
        <input
          name="as_of_date"
          type="date"
          required
          defaultValue={defaultValues?.as_of_date ?? ''}
          style={inputStyle}
        />
      </Field>

      <Field label="入力方法" required>
        <select name="source" defaultValue={defaultValues?.source ?? 'user_input'} style={inputStyle}>
          <option value="user_input">実際に確認した金額</option>
          <option value="assumption">おおよその推定</option>
        </select>
      </Field>

      <Field label="使途（任意）">
        <select name="earmark" defaultValue={defaultValues?.earmark ?? ''} style={inputStyle}>
          <option value="">指定なし</option>
          <option value="education">教育費</option>
        </select>
      </Field>

      <Field label="メモ（任意）">
        <textarea
          name="note"
          maxLength={500}
          rows={2}
          defaultValue={defaultValues?.note ?? ''}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </Field>

      <button
        type="submit"
        className="w-full text-sm px-3 py-2.5 rounded-md font-bold mt-2"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {submitLabel}
      </button>
    </form>
  );
}
