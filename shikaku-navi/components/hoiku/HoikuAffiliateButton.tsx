import type { HoikuService } from '@/lib/hoiku/services';

// 保育士転職サービスへの登録導線ボタン
// - rel は CLAUDE.md の必須ルールどおり "noopener noreferrer nofollow sponsored"
// - 骨格段階では affiliateUrl が '#'（ダミー）。ダミーの間は新規タブを開かない
export default function HoikuAffiliateButton({
  service,
  label,
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  service: HoikuService;
  label?: string;
  variant?: 'primary' | 'secondary' | 'inverse';
  size?: 'md' | 'sm';
  className?: string;
}) {
  const isDummy = service.affiliateUrl === '#';
  const base = {
    primary: 'bg-sky-600 text-white hover:bg-sky-500',
    secondary: 'border border-sky-600 text-sky-700 hover:bg-sky-50',
    // ヒーロー等、濃い背景の上に置く用
    inverse: 'bg-white text-sky-700 hover:bg-sky-50',
  }[variant];
  const sizing = size === 'md' ? 'px-6 py-3 text-sm' : 'px-3 py-2 text-xs';

  return (
    <a
      href={service.affiliateUrl}
      rel="noopener noreferrer nofollow sponsored"
      {...(isDummy ? {} : { target: '_blank' })}
      data-service={service.slug}
      className={`inline-flex items-center justify-center gap-1 font-bold rounded-lg transition-colors ${sizing} ${base} ${className}`}
    >
      {label ?? `${service.name}に無料登録する`}
    </a>
  );
}
