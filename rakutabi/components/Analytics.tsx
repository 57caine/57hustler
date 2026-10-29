import Script from 'next/script';
import { buildGa4Init, validMeasurementId } from '../lib/ga4.mjs';

export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_RAKUTABI_GA4_ID ?? 'G-VX6B8VJHC4';
  if (!validMeasurementId(id)) return null;
  return <Script id="rakutabi-ga4" strategy="afterInteractive">{buildGa4Init(id)}</Script>;
}
