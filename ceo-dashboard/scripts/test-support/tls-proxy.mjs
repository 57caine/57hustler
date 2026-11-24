// TEST TOOL ONLY. Terminates TLS (self-signed cert, trusted explicitly by the test client — certificate
// verification is NEVER disabled) and forwards to `next start`, marking the request as HTTPS like a CDN would.
//   usage: node tls-proxy.mjs <tlsPort> <targetPort> <key.pem> <cert.pem>
import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
const [tlsPort, target, key, cert] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4], process.argv[5]];
https.createServer({ key: fs.readFileSync(key), cert: fs.readFileSync(cert) }, (req, res) => {
  const headers = { ...req.headers, 'x-forwarded-proto': 'https', 'x-forwarded-host': req.headers.host, 'x-forwarded-for': req.socket.remoteAddress };
  const up = http.request({ host: '127.0.0.1', port: target, path: req.url, method: req.method, headers }, r => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  up.on('error', () => { res.writeHead(502); res.end(); });
  req.pipe(up);
}).listen(tlsPort, '127.0.0.1', () => console.log('tls-proxy on ' + tlsPort));
