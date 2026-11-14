// Diagnostic text only. Never include a request URL, form, token, or raw response.
export function threadsApiError(stage, status, error, token) {
 const number = value => Number.isSafeInteger(value) ? value : 'unknown';
 let message = typeof error?.message === 'string' ? error.message : 'unavailable';
 // Redact known credentials before limiting output (including encoded variants).
 if (token) {
  for (const secret of new Set([token, encodeURIComponent(token), new URLSearchParams({t:token}).toString().slice(2)])) {
   message = message.split(secret).join('[redacted]');
  }
 }
 message = message
  .replace(/https?:\/\/[^\s<>"']+/gi, '[url redacted]')
  .replace(/Bearer\s+[^\s,;"']+/gi, 'Bearer [redacted]')
  .replace(/((?:access_token|app_secret|client_secret|authorization)["']?\s*[:=]\s*["']?)[^\s,;"']+/gi, '$1[redacted]')
  .replace(/[A-Za-z0-9_+%/=-]{40,}/g, '[redacted]')
  .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')
  .slice(0, 512);
 const transient = typeof error?.is_transient === 'boolean' ? String(error.is_transient) : 'unknown';
 return `${stage} failed (HTTP ${number(status)}, code ${number(error?.code)}, subcode ${number(error?.error_subcode)}, transient ${transient}): ${message}`;
}
