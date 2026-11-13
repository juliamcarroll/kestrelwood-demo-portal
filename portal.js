// Kestrelwood demo portal (fictional). Page data is encrypted and only
// readable after signing in and entering a verification code.
const KW_CHECK = '070056bc8175c62be5cb8c75e841e16f439d719423018739b57d12834a036c97';
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const sha = (s) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function kwSignIn(email, password) {
  if (!email.trim().toLowerCase().endsWith('@juniperlanedental.example.com')) return false;
  if (hex(await sha('check:' + password)) !== KW_CHECK) return false;
  sessionStorage.setItem('kw_k', hex(await sha(password)));
  sessionStorage.setItem('kw_step', 'code');
  return true;
}

async function kwRender(blob) {
  const k = sessionStorage.getItem('kw_k');
  if (sessionStorage.getItem('kw_step') !== 'in' || !k) { location.href = 'index.html'; return; }
  const [iv, ct] = blob.split('.');
  const key = await crypto.subtle.importKey('raw', Uint8Array.from(k.match(/../g).map((h) => parseInt(h, 16))), 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(iv) }, key, b64(ct));
  document.getElementById('app').innerHTML = new TextDecoder().decode(plain);
}
