// Tidepool (fictional demo portal). Pages decrypt only after sign-in and code.
const KW_CHECK='8cdd8a15f1dcb18d6f4379c6e547c45fd382b3f8470066b1556120c06b1887bc';const DOMAIN='@juniperlanedental.example.com';
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha=s=>crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function kwSignIn(email,pw){if(!email.trim().toLowerCase().endsWith(DOMAIN))return false;if(hex(await sha('check:'+pw))!==KW_CHECK)return false;
sessionStorage.setItem('jl_k',hex(await sha(pw)));sessionStorage.setItem('jl_step','code');return true;}
async function kwRender(blob){const k=sessionStorage.getItem('jl_k');if(sessionStorage.getItem('jl_step')!=='in'||!k){location.href='index.html';return;}
const [iv,ct]=blob.split('.');const key=await crypto.subtle.importKey('raw',Uint8Array.from(k.match(/../g).map(h=>parseInt(h,16))),'AES-GCM',false,['decrypt']);
document.getElementById('app').innerHTML=new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(iv)},key,b64(ct)));}
