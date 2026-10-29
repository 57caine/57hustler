export function validMeasurementId(id) {
  return typeof id === 'string' && /^G-[A-Z0-9]{6,}$/.test(id);
}

// Production only: previews and local checks must not pollute live analytics.
export function buildGa4Init(id) {
  if (!validMeasurementId(id)) throw new Error('Invalid Rakutabi GA4 measurement ID');
  return `(function(){if(location.hostname!=='rakutabi-nine.vercel.app')return;window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}');var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${id}';document.head.appendChild(s);})();`;
}
