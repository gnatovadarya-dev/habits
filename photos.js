"use strict";
/* Фото зберігаються лише на телефоні: файли в IndexedDB, опис (дата, тип, звичка) — разом з іншими даними. */
window.PhotoStore=(function(){
  let dbp=null;const urls=new Map();
  function db(){if(!dbp)dbp=new Promise((res,rej)=>{const r=indexedDB.open("habits-photos",1);
    r.onupgradeneeded=()=>{r.result.createObjectStore("photos")};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});return dbp}
  async function tx(mode,fn){const d=await db();return new Promise((res,rej)=>{const t=d.transaction("photos",mode);const s=t.objectStore("photos");const out=fn(s);
    t.oncomplete=()=>res(out&&out.result!==undefined?out.result:undefined);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error)})}
  async function put(id,blob){await tx("readwrite",s=>s.put(blob,id))}
  async function get(id){const d=await db();return new Promise((res,rej)=>{const r=d.transaction("photos").objectStore("photos").get(id);r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error)})}
  async function del(id){await tx("readwrite",s=>s.delete(id));const u=urls.get(id);if(u){URL.revokeObjectURL(u);urls.delete(id)}}
  async function url(id){if(urls.has(id))return urls.get(id);const b=await get(id);if(!b)return null;const u=URL.createObjectURL(b);urls.set(id,u);return u}
  function loadImage(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file);const im=new Image();im.onload=()=>{res({im,u})};im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error("img"))};im.src=u})}
  async function compress(file,max=1400,q=0.82){
    const {im,u}=await loadImage(file);const k=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));
    const w=Math.round(im.naturalWidth*k),h=Math.round(im.naturalHeight*k);const c=document.createElement("canvas");c.width=w;c.height=h;
    c.getContext("2d").drawImage(im,0,0,w,h);URL.revokeObjectURL(u);
    const blob=await new Promise(r=>c.toBlob(r,"image/jpeg",q));if(!blob)throw new Error("blob");return {blob,w,h}}
  /* <img data-pid="..."> отримують src після рендера */
  async function hydrate(root){for(const el of root.querySelectorAll("[data-pid]")){const id=el.dataset.pid;try{const u=await url(id);if(!u)continue;
    if(el.tagName==="IMG")el.src=u;else el.style.backgroundImage=`url("${u}")`}catch(e){}}}
  return {put,get,del,url,compress,hydrate};
})();
