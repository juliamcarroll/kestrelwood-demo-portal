// Pixelyard (fictional demo site). Signed-in pages decrypt only after sign-in.
const KW_CHECK='bb27503d8cc49ad5e78d1d39593df161bbfffa4d4e70428960c6b2788f467573';const DOMAIN='@juniperlanedental.example.com';const ST='pixelyard_step',SK='pixelyard_k';
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha=x=>crypto.subtle.digest('SHA-256',new TextEncoder().encode(x));const b64=x=>Uint8Array.from(atob(x),c=>c.charCodeAt(0));
async function kwSignIn(e,p){if(!e.trim().toLowerCase().endsWith(DOMAIN))return false;if(hex(await sha('check:'+p))!==KW_CHECK)return false;
sessionStorage.setItem(SK,hex(await sha(p)));sessionStorage.setItem(ST,'in');return true;}
async function kwRender(blob){const k=sessionStorage.getItem(SK);if(sessionStorage.getItem(ST)!=='in'||!k){location.href='index.html';return;}
const [iv,ct]=blob.split('.');const key=await crypto.subtle.importKey('raw',Uint8Array.from(k.match(/../g).map(h=>parseInt(h,16))),'AES-GCM',false,['decrypt']);
document.getElementById('app').innerHTML=new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(iv)},key,b64(ct)));}
