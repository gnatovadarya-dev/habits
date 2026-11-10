"use strict";
const C=window.CONTENT;
const clean=s=>String(s).replace(/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}☀-➿️‍]/gu,"").replace(/\s{2,}/g," ").trim();

/* ================= icons ================= */
const IC={
  drop:"M12 3c3 4 6 7 6 10a6 6 0 0 1-12 0c0-3 3-6 6-10z",
  leaf:"M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l7-7",
  book:"M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z",
  moon:"M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z",
  sun:"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  heart:"M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  yoga:"M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM6 20l6-4 6 4M4 13l8-2 8 2M12 11v5",
  dumbbell:"M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12",
  apple:"M12 8c0-2 1-4 3-5M7.5 8.5C4 10 5 18 8.5 20c1.2.7 2.3 0 3.5 0s2.3.7 3.5 0C19 18 20 10 16.5 8.5c-1.8-.8-3.4.5-4.5.5s-2.7-1.3-4.5-.5z",
  cup:"M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2",
  pen:"M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
  music:"M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z",
  phoneoff:"M8 3h8v18H8zM4 4l16 16",
  pill:"M8.5 15.5l7-7a3.5 3.5 0 0 0-5-5l-7 7a3.5 3.5 0 0 0 5 5zM7 7l5 5",
  globe:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  brush:"M14 4l6 6-8 8H6v-6z",
  star:"M12 3l2.6 5.6 6 .6-4.5 4 1.3 6-5.4-3-5.4 3 1.3-6-4.5-4 6-.6z",
  home:"M4 11l8-7 8 7v9H4z",
  coin:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v10M14.5 9.5h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4",
  spark:"M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z",
  cam:"M4 8h3l2-3h6l2 3h3v11H4zM12 10.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  check:"M5 12l5 5 9-10",
  link:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  cal:"M4 6h16v14H4zM4 10h16M9 3v4M15 3v4",
  up:"M4 17l6-6 4 4 6-7M14 8h6v6",
  down:"M4 7l6 6 4-4 6 7M14 16h6v-6",
  tag:"M3 12V4h8l10 10-8 8zM7.5 7.5h.01",
  bulb:"M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z",
  next:"M5 12h12M13 6l6 6-6 6"};
const ICON_KEYS=["drop","leaf","book","moon","sun","heart","yoga","dumbbell","apple","cup","pen","music","phoneoff","pill","globe","brush","star","home","coin","spark"];
const EMOJI_TO_ICON={"💧":"drop","🚶‍♀️":"leaf","📖":"book","🇬🇧":"globe","🧘‍♀️":"yoga","😴":"moon","📵":"phoneoff","🍎":"apple","🏋️‍♀️":"dumbbell","🥗":"apple","☕":"cup","💊":"pill","✍️":"pen","🎨":"brush","🎧":"music","🌿":"leaf","🧹":"home","💸":"coin","❤️":"heart","🌞":"sun","⭐":"star"};
const svg=(k,extra="")=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}><path d="${IC[k]||IC.spark}"/></svg>`;
const hIcon=h=>h.icon||EMOJI_TO_ICON[h.emoji]||"spark";

/* ================= mood scale 1–10 ================= */
const MOOD_L=["Ридаю","Сумно","Пригнічено","Так собі","Нейтрально","Непогано","Добре","Радісно","Чудово","До сліз від щастя"];
function faceSVG(v,sw=1.2){const c=Math.round(-7+(v-1)*14/9);
  const eyes=v>=9?"M10 15 q2.5 -3 5 0 M21 15 q2.5 -3 5 0":v<=2?"M10 13.5 q2.5 2 5 0 M21 13.5 q2.5 2 5 0":"M12.5 14.5 v1 M23.5 14.5 v1";
  const mouth=v===10?"M11 21 Q18 30 25 21 Z":v===5?"M12 23 H24":"M11 23 Q18 "+(23+c)+" 25 23";
  const tear=(v<=2||v===10)?'<path d="M10.5 18 q-1.5 2.5 0 3.5 q1.5 -1 0 -3.5"/>':"";
  return `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="18" r="15"/><path d="${eyes}"/><path d="${mouth}"/>${tear}</svg>`}
const moodVar=v=>`var(--m${v})`;
const moodPool=v=>C.MOOD[Math.ceil(v/2)];

/* ================= constants ================= */
const BASE_TAGS=["Сон","Робота","Люди","Спорт","Погода","Самопочуття","Їжа","Навчання","Дім","Гроші"];
const SUGG=[
  {name:"Вода",icon:"drop",type:"count",target:8,unit:"склянок"},
  {name:"Прогулянка",icon:"leaf",type:"check"},
  {name:"Читання",icon:"book",type:"count",target:20,unit:"хв",step:5},
  {name:"Англійська",icon:"globe",type:"check"},
  {name:"Розтяжка",icon:"yoga",type:"check"},
  {name:"Сон до 23:00",icon:"moon",type:"check"},
  {name:"Без телефону перед сном",icon:"phoneoff",type:"check"},
  {name:"Фрукти",icon:"apple",type:"check"}];
const WD=["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];
const WD_FULL=["понеділок","вівторок","середа","четвер","п'ятниця","субота","неділя"];
const WD_ACC=["понеділок","вівторок","середу","четвер","п'ятницю","суботу","неділю"];
const MONTHS=["січень","лютий","березень","квітень","травень","червень","липень","серпень","вересень","жовтень","листопад","грудень"];
const MONTHS_G=["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"];
const REST_PER_MONTH=2;
const KIND_L={proof:"доказ",day:"день",selfie:"усмішка"};

/* ================= helpers ================= */
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const todayISO=()=>iso(new Date());
const dow=s=>{const g=parse(s).getDay();return g===0?7:g};
const weekStart=s=>addDays(s,1-dow(s));
const human=s=>{const d=parse(s);return d.getDate()+" "+MONTHS_G[d.getMonth()]};
const diffDays=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const fmt=(n,dig=1)=>n.toFixed(dig).replace(".",",");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
function hash(str){let h=0;for(const ch of str)h=(h*31+ch.codePointAt(0))|0;return Math.abs(h)}
const pickStable=(pool,seed)=>pool[hash(seed)%pool.length];
function plural(n,one,few,many){const a=Math.abs(n)%100,b=a%10;if(a>10&&a<20)return many;if(b===1)return one;if(b>=2&&b<=4)return few;return many}
function toast(m){const t=document.getElementById("toast");t.textContent=clean(m);t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2600)}

/* ================= state ================= */
const KEY="habits-v1";
const DEFAULT_SETTINGS={tags:[],lastBackup:null,rest:{},seen:{},factDay:null,factIdx:null,candies:[],lastOpen:null,summarySeen:{},moodScale:10,theme:"auto"};
const state={tab:"today",sel:todayISO(),calMonth:todayISO().slice(0,7),calMode:"mood",welcome:false,dismissed:{},pending:null,
  data:{habits:[],log:{},ts:{},mood:{},photos:[],settings:{...DEFAULT_SETTINGS}}};
function load(){try{const r=JSON.parse(localStorage.getItem(KEY)||"null");
  if(r){const hadScale=r.settings&&r.settings.moodScale;state.data={...state.data,...r,settings:{...DEFAULT_SETTINGS,...(r.settings||{})}};
    state.data.ts=state.data.ts||{};state.data.photos=state.data.photos||[];
    if(hadScale!==10){for(const m of Object.values(state.data.mood||{}))m.level=Math.min(10,Math.max(1,Math.round(m.level*2)));state.data.settings.moodScale=10}
    for(const h of state.data.habits){if(!h.icon)h.icon=EMOJI_TO_ICON[h.emoji]||"spark"}
    state.data.settings.tags=(state.data.settings.tags||[]).map(clean).filter(Boolean);
    for(const m of Object.values(state.data.mood||{}))if(m.tags)m.tags=m.tags.map(clean)}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.data))}catch(e){toast("Не вдалося зберегти: пам'ять браузера недоступна")}}
const S=()=>state.data.settings;
function applyTheme(){const t=S().theme;if(t==="auto")document.documentElement.removeAttribute("data-theme");else document.documentElement.setAttribute("data-theme",t)}

/* ================= habit logic ================= */
const active=()=>state.data.habits.filter(h=>!h.archived);
const findH=id=>state.data.habits.find(x=>x.id===id);
const val=(h,d)=>Number((state.data.log[d]||{})[h.id]||0);
const isDone=(h,d)=>h.type==="count"?val(h,d)>=h.target:val(h,d)>=1;
const isRest=d=>!!S().rest[d];
const isWeekly=h=>h.schedule?.kind==="weekly";
function planned(h,d){if(d<h.created)return false;const s=h.schedule||{kind:"daily"};if(s.kind==="days")return (s.days||[]).includes(dow(d));return true}
const scheduled=(h,d)=>planned(h,d)&&!isRest(d);
function weekCount(h,d){let n=0;const w=weekStart(d);for(let i=0;i<7;i++){const x=addDays(w,i);if(x>todayISO())break;if(isDone(h,x))n++}return n}
function streak(h){
  const t=todayISO();
  if(isWeekly(h)){let n=0,w=weekStart(t);if(weekCount(h,w)>=h.schedule.times)n++;w=addDays(w,-7);
    while(w>=weekStart(h.created)&&weekCount(h,w)>=h.schedule.times){n++;w=addDays(w,-7)}return {n,unit:plural(n,"тиждень","тижні","тижнів")}}
  let d=t,n=0;if(scheduled(h,d)&&!isDone(h,d))d=addDays(d,-1);
  while(d>=h.created){if(scheduled(h,d)){if(isDone(h,d))n++;else break}d=addDays(d,-1)}
  return {n,unit:plural(n,"день","дні","днів")}}
function bestStreak(h){if(isWeekly(h))return streak(h).n;let best=0,cur=0;
  for(let d=h.created;d<=todayISO();d=addDays(d,1)){if(!scheduled(h,d))continue;if(isDone(h,d)){cur++;best=Math.max(best,cur)}else if(d<todayISO())cur=0}return best}
function rateRange(h,s,e){
  if(isWeekly(h)){let ok=0,tot=0;for(let w=weekStart(s);w<=e;w=addDays(w,7)){if(addDays(w,6)<h.created)continue;tot++;if(weekCount(h,w)>=h.schedule.times)ok++}return tot?ok/tot:null}
  let sch=0,dn=0;for(let d=s;d<=e;d=addDays(d,1)){if(!scheduled(h,d))continue;if(d===todayISO()&&!isDone(h,d))continue;sch++;if(isDone(h,d))dn++}return sch?dn/sch:null}
const dueOn=d=>active().filter(h=>scheduled(h,d)&&!(isWeekly(h)&&weekCount(h,d)>=h.schedule.times&&!isDone(h,d)));
function dayProgress(d){const list=dueOn(d);return {done:list.filter(h=>isDone(h,d)).length,total:list.length}}
const perfect=d=>{const p=dayProgress(d);return p.total>0&&p.done===p.total};
function schedText(h){const s=h.schedule||{kind:"daily"};if(s.kind==="days")return s.days.map(x=>WD[x-1]).join(", ");if(s.kind==="weekly")return s.times+" р. на тиждень";return "щодня"}
const restUsed=m=>Object.keys(S().rest).filter(d=>d.startsWith(m)).length;
const firstDate=()=>{const c=[...state.data.habits.map(h=>h.created),...Object.keys(state.data.mood),...Object.keys(state.data.log)].sort();return c[0]||todayISO()};
const photosOn=d=>state.data.photos.filter(p=>p.d===d);
const proofOf=(h,d)=>state.data.photos.find(p=>p.d===d&&p.k==="proof"&&p.h===h.id);

/* ================= engagement ================= */
function pickFresh(pool,key){const seen=S().seen;const t=todayISO();
  const fresh=pool.map((x,i)=>i).filter(i=>{const k=key+":"+i;return !seen[k]||diffDays(seen[k],t)>14});
  const arr=fresh.length?fresh:pool.map((x,i)=>i);const i=arr[Math.floor(Math.random()*arr.length)];seen[key+":"+i]=t;return pool[i]}
function factOfDay(){const st=S();if(st.factDay===todayISO()&&st.factIdx!=null)return C.FACTS[st.factIdx];return null}
function unlockFact(){const st=S();if(st.factDay===todayISO())return factOfDay();const f=pickFresh(C.FACTS,"fact");st.factDay=todayISO();st.factIdx=C.FACTS.indexOf(f);return f}
function bannerFor(d){
  const t=todayISO();if(d!==t)return null;
  if(state.welcome&&!state.dismissed.welcome)return {id:"welcome",text:pickStable(C.WELCOME,t)};
  const sum=pendingSummary();if(sum&&!state.dismissed.sum)return {id:"sum",text:sum.label+" готовий. Погортайте свої досягнення",action:"Відкрити"};
  const y=addDays(t,-1);
  const missed=active().filter(h=>!isWeekly(h)&&h.created<=addDays(y,-1)&&scheduled(h,y)&&!isDone(h,y)&&scheduled(h,t)&&!isDone(h,t));
  if(missed.length&&!state.dismissed.never)return {id:"never",text:pickStable(C.NEVER_TWICE,t+missed[0].id).replace("{h}",missed[0].name)};
  return null}
function checkMilestone(h,d){
  if(d!==todayISO()||isWeekly(h))return;const n=streak(h).n;if(!C.MILESTONES.includes(n))return;
  const st=S();if(st.candies.some(c=>c.h===h.id&&c.n===n))return;
  st.candies.push({h:h.id,n,d});save();
  setTimeout(()=>{confetti();openSheet("Нова віха",`<div class="celebrate"><div class="ce">${n}</div>
    <h2>${esc(h.name)}: ${n} ${plural(n,"день","дні","днів")} поспіль</h2><div>${esc(clean(C.MILESTONE_TEXT[n]||""))}</div>
    <div class="muted small">Віха додана в колекцію на вкладці «Аналіз»</div><button class="btn" id="celOk">Чудово</button></div>`,()=>{document.getElementById("celOk").onclick=closeSheet})},450);
}
function daysWithData(s,e){let n=0;for(let d=s;d<=e;d=addDays(d,1)){if(state.data.mood[d]||state.data.log[d])n++}return n}
function pendingSummary(){
  const t=todayISO(),d=dow(t),st=S().summarySeen,dd=parse(t).getDate();
  if(dd<=3){const pm=iso(new Date(parse(t).getFullYear(),parse(t).getMonth()-1,1)).slice(0,7);const key="m"+pm;if(!st[key]&&daysWithData(pm+"-01",addDays(t,-dd))>=7)return {...periodMonth(pm),key}}
  if(d===7&&new Date().getHours()>=17){const ws=weekStart(t);const key="w"+ws;if(!st[key]&&daysWithData(ws,t)>=3)return {...periodWeek(ws),key}}
  if(d<=2){const ws=addDays(weekStart(t),-7);const key="w"+ws;if(!st[key]&&daysWithData(ws,addDays(ws,6))>=3)return {...periodWeek(ws),key}}
  return null}
function periodWeek(ws){const we=addDays(ws,6);const e=we>todayISO()?todayISO():we;return {label:"Ваш тиждень",title:`${human(ws)} – ${human(we)}`,s:ws,e,ps:addDays(ws,-7),pe:addDays(ws,-1),unit:"тиждень",unitG:"минулого тижня"}}
function periodMonth(m){const [y,mo]=m.split("-").map(Number);const s=m+"-01";const last=iso(new Date(y,mo,0));const e=last>todayISO()?todayISO():last;
  return {label:"Ваш місяць",title:MONTHS[mo-1]+" "+y,s,e,ps:iso(new Date(y,mo-2,1)),pe:iso(new Date(y,mo-1,0)),unit:"місяць",unitG:"минулого місяця"}}

/* ================= analysis ================= */
function cohen(a,b){if(a.length<2||b.length<2)return 0;const ma=mean(a),mb=mean(b);
  const va=a.reduce((s,x)=>s+(x-ma)**2,0)/(a.length-1),vb=b.reduce((s,x)=>s+(x-mb)**2,0)/(b.length-1);
  const sd=Math.sqrt(((a.length-1)*va+(b.length-1)*vb)/(a.length+b.length-2));return sd?(ma-mb)/sd:(ma===mb?0:Math.sign(ma-mb)*2)}
function strength(d){const x=Math.abs(d);if(x<0.2)return {l:"дуже слабкий",k:0};if(x<0.5)return {l:"слабкий",k:1};if(x<0.8)return {l:"помітний",k:2};return {l:"сильний",k:3}}
function strengthPP(pp){const x=Math.abs(pp);if(x<0.15)return {l:"слабкий",k:1};if(x<0.3)return {l:"помітний",k:2};return {l:"сильний",k:3}}
function habitMood(h,lag){const yes=[],no=[];const t=todayISO();
  for(const [d0,m] of Object.entries(state.data.mood)){const d=lag?addDays(d0,-lag):d0;
    if(d<h.created||!(isWeekly(h)||scheduled(h,d)))continue;if(d===t&&!isDone(h,d))continue;(isDone(h,d)?yes:no).push(m.level)}
  return {yes,no,ok:yes.length>=5&&no.length>=3,d:cohen(yes,no),ay:mean(yes),an:mean(no)}}
function chains(){const hs=active().filter(h=>!isWeekly(h));const out=[];const t=todayISO();
  for(const A of hs)for(const B of hs){if(A===B)continue;let aY=0,aYB=0,aN=0,aNB=0;const s=A.created>B.created?A.created:B.created;
    for(let d=s;d<t;d=addDays(d,1)){if(!scheduled(A,d)||!scheduled(B,d))continue;if(isDone(A,d)){aY++;if(isDone(B,d))aYB++}else{aN++;if(isDone(B,d))aNB++}}
    if(aY>=7&&aN>=4){const p1=aYB/aY,p0=aNB/aN;if(p1-p0>=0.2)out.push({A,B,p1,p0,pp:p1-p0})}}
  return out.sort((a,b)=>b.pp-a.pp)}
function weekdayStats(){const mood=Array.from({length:7},()=>[]),comp=Array.from({length:7},()=>({s:0,d:0}));const t=todayISO();
  for(const [d,m] of Object.entries(state.data.mood))mood[dow(d)-1].push(m.level);
  for(let d=firstDate();d<t;d=addDays(d,1)){const p=dayProgress(d);comp[dow(d)-1].s+=p.total;comp[dow(d)-1].d+=p.done}
  return mood.map((a,i)=>({m:a.length?mean(a):null,n:a.length,c:comp[i].s?comp[i].d/comp[i].s:null}))}
function tagStats(){const ts={};for(const m of Object.values(state.data.mood))for(const tg of (m.tags||[]))(ts[tg]=ts[tg]||[]).push(m.level);
  const all=mean(Object.values(state.data.mood).map(m=>m.level));
  return Object.entries(ts).filter(([,a])=>a.length>=3).map(([t,a])=>({t,a:mean(a),n:a.length,diff:mean(a)-all})).sort((x,y)=>y.a-x.a)}
function avgCompletion(s,e){let tot=0,dn=0;for(let d=s;d<=e;d=addDays(d,1)){if(d===todayISO())continue;const p=dayProgress(d);tot+=p.total;dn+=p.done}return tot?dn/tot:null}
function findings(){const F=[];const hs=active();
  for(const h of hs){
    const r=habitMood(h,0);if(r.ok&&Math.abs(r.d)>=0.3){const s=strength(r.d);F.push({score:Math.abs(r.d),k:s.k,s:s.l,i:hIcon(h),
      text:r.d>0?`У дні з «${esc(h.name)}» настрій вищий: <b>${fmt(r.ay)}</b> проти <b>${fmt(r.an)}</b> з 10`:`Цікаво: у дні з «${esc(h.name)}» настрій нижчий (${fmt(r.ay)} проти ${fmt(r.an)}). Можливо, вона забирає сили?`})}
    const l=habitMood(h,1);if(l.ok&&l.d>=0.3){const s=strength(l.d);F.push({score:Math.abs(l.d)*0.95,k:s.k,s:s.l,i:"next",text:`Після «${esc(h.name)}» <b>наступний</b> день кращий: ${fmt(l.ay)} проти ${fmt(l.an)}`})}}
  for(const c of chains().slice(0,3)){const s=strengthPP(c.pp);F.push({score:c.pp*1.6,k:s.k,s:s.l,i:"link",
    text:`Коли виконуєте «${esc(c.A.name)}», «${esc(c.B.name)}» вдається у <b>${Math.round(c.p1*100)}%</b> днів (без неї — ${Math.round(c.p0*100)}%). Спробуйте робити їх разом`})}
  const wd=weekdayStats();if(Object.keys(state.data.mood).length>=14){const v=wd.map((x,i)=>({...x,i})).filter(x=>x.n>=2&&x.m!=null);
    if(v.length>=4){v.sort((a,b)=>a.m-b.m);const lo=v[0],hi=v[v.length-1];const g=hi.m-lo.m;
      if(g>=1)F.push({score:g*0.35,k:g>=2?3:2,s:g>=2?"сильний":"помітний",i:"cal",text:`Найважчий день тижня — <b>${WD_FULL[lo.i]}</b> (${fmt(lo.m)}), найлегший — <b>${WD_FULL[hi.i]}</b> (${fmt(hi.m)}). Заплануйте на ${WD_ACC[lo.i]} щось приємне`})}}
  const wc=wd.map((x,i)=>({...x,i})).filter(x=>x.c!=null);if(wc.length>=5){wc.sort((a,b)=>a.c-b.c);const lo=wc[0],hi=wc[wc.length-1];
    if(hi.c-lo.c>=0.2)F.push({score:(hi.c-lo.c)*1.2,k:hi.c-lo.c>=0.35?3:2,s:hi.c-lo.c>=0.35?"сильний":"помітний",i:"cal",text:`Звички найчастіше «злітають» у <b>${WD_ACC[lo.i]}</b> (${Math.round(lo.c*100)}%), а найкраще виходять у ${WD_ACC[hi.i]} (${Math.round(hi.c*100)}%)`})}
  const tg=tagStats();if(tg.length>=2){const lo=tg[tg.length-1],hi=tg[0];
    if(lo.diff<=-0.8)F.push({score:Math.abs(lo.diff)*0.4,k:lo.diff<=-1.6?3:2,s:lo.diff<=-1.6?"сильний":"помітний",i:"tag",text:`Дні з міткою «${esc(lo.t)}» найважчі: настрій ${fmt(lo.a)}`});
    if(hi.diff>=0.8)F.push({score:hi.diff*0.4,k:hi.diff>=1.6?3:2,s:hi.diff>=1.6?"сильний":"помітний",i:"tag",text:`«${esc(hi.t)}» — Ваш генератор гарного настрою: ${fmt(hi.a)}`})}
  const t=todayISO();const cur=avgCompletion(addDays(t,-6),t),prev=avgCompletion(addDays(t,-13),addDays(t,-7));
  if(cur!=null&&prev!=null&&Math.abs(cur-prev)>=0.1)F.push({score:Math.abs(cur-prev),k:Math.abs(cur-prev)>=0.25?3:2,s:Math.abs(cur-prev)>=0.25?"сильний":"помітний",i:cur>prev?"up":"down",
    text:cur>prev?`Останні 7 днів Ви виконуєте звички на <b>${Math.round((cur-prev)*100)} п.п.</b> частіше, ніж тиждень до того`:`Останні 7 днів звички виконуються на ${Math.round((prev-cur)*100)} п.п. рідше. Може, ціль завелика? Спробуйте мінімальну версію`});
  return F.sort((a,b)=>b.score-a.score)}
function checkins(s,e){let n=0;for(let d=s;d<=e;d=addDays(d,1))for(const h of state.data.habits)if(isDone(h,d))n++;return n}
function periodStats(P){const moods=[],pm=[],tags={};let perfectN=0,best=null;
  for(let d=P.s;d<=P.e;d=addDays(d,1)){const m=state.data.mood[d];if(m){moods.push(m.level);for(const t of (m.tags||[]))tags[t]=(tags[t]||0)+1}
    if(perfect(d))perfectN++;const p=dayProgress(d);const sc=p.done+(m?m.level/20:0);if(p.done&&(!best||sc>best.sc))best={d,sc,done:p.done,m}}
  for(let d=P.ps;d<=P.pe;d=addDays(d,1)){const m=state.data.mood[d];if(m)pm.push(m.level)}
  const topTag=Object.entries(tags).sort((a,b)=>b[1]-a[1])[0];
  const hr=active().map(h=>({h,r:rateRange(h,P.s<h.created?h.created:P.s,P.e)})).filter(x=>x.r!=null).sort((a,b)=>b.r-a.r);
  const ms=S().candies.filter(c=>c.d>=P.s&&c.d<=P.e);const ph=state.data.photos.filter(p=>p.d>=P.s&&p.d<=P.e);
  return {ci:checkins(P.s,P.e),pci:checkins(P.ps,P.pe),perfectN,best,mood:moods.length?mean(moods):null,pmood:pm.length?mean(pm):null,topTag,top:hr[0],ms,ph}}

/* ================= views ================= */
function greet(){const h=new Date().getHours();if(h<5)return "Доброї ночі";if(h<12)return "Доброго ранку";if(h<18)return "Доброго дня";return "Доброго вечора"}
function ringSVG(p){const R=84,Cc=2*Math.PI*R;return `<svg viewBox="0 0 176 176" aria-hidden="true"><defs><linearGradient id="rg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--acc1)"/><stop offset="1" style="stop-color:var(--acc2)"/></linearGradient></defs>
  <circle cx="88" cy="88" r="${R}" fill="none" style="stroke:var(--hair)" stroke-width="1"/><circle cx="88" cy="88" r="${R}" fill="none" stroke="url(#rg)" stroke-width="2" stroke-linecap="round" stroke-dasharray="${(Cc*p).toFixed(1)} ${Cc.toFixed(1)}" transform="rotate(-90 88 88)"/></svg>`}

function vToday(){
  const d=state.sel,t=todayISO(),isToday=d===t;const pr=dayProgress(d);const p=pr.total?pr.done/pr.total:0;const rest=isRest(d);
  const strip=[];for(let i=6;i>=0;i--){const x=addDays(t,-i);const has=!!state.data.mood[x]||perfect(x);
    strip.push(`<button class="day" data-day="${x}" aria-pressed="${x===d}" aria-label="${human(x)}"><small>${WD[dow(x)-1]}</small>${parse(x).getDate()}<i class="${has?"on":""}"></i></button>`)}
  const sub=rest?"день відпочинку":pr.total?(pr.done===pr.total?"усе виконано":`виконано ${pr.done} з ${pr.total}`):"вільний день";
  let html=`<header class="hero"><div class="ring">${ringSVG(rest?1:p)}<div class="c"><b>${rest?"—":Math.round(p*100)}${rest?"":"<small>%</small>"}</b><span class="cap">${WD_FULL[dow(d)-1]}</span></div></div>
    <div class="greet"><span class="h">${isToday?esc(greet())+", Дар'є":"Редагуєте "+human(d)}</span><span class="muted small">${human(d)} · ${sub}</span></div></header>
    <div class="days" role="group" aria-label="Останні 7 днів">${strip.join("")}</div>`;
  const bn=bannerFor(d);
  if(bn)html+=`<div class="glass banner"><span>${esc(clean(bn.text))}${bn.action?` <button class="lnk" data-opensum="1">${bn.action}</button>`:""}</span><button class="x" data-dismiss="${bn.id}" aria-label="Закрити">✕</button></div>`;
  if(!state.data.habits.length){
    html+=`<div class="card"><div class="empty"><h2>Почнімо з 1–3 звичок</h2><div class="muted small">Торкніться, щоб додати. Краще менше, але щодня.</div>
      <div class="sugg">${SUGG.map((s,i)=>`<button class="chip" data-sugg="${i}">${esc(s.name)}${s.type==="count"?" · "+s.target+" "+s.unit:""}</button>`).join("")}</div>
      <button class="btn sm soft" data-newhabit="1">Своя звичка</button></div></div>`;
  }else{
    const list=active().filter(h=>planned(h,d));
    if(rest)html+=`<div class="glass banner"><span>День відпочинку. Серії в безпеці, а виконане все одно зарахується</span><button class="lnk" data-unrest="1">Скасувати</button></div>`;
    html+=list.length?`<div class="tiles">${list.map(h=>habitTile(h,d)).join("")}</div>`:`<div class="card empty"><div class="muted">На цей день звичок не заплановано. Відпочивайте</div></div>`;
  }
  const f=isToday?factOfDay():null;
  if(f)html+=`<div class="card fact"><span class="cap">факт дня</span><div style="font-size:16px;font-weight:400">${esc(f.t)}</div><div class="src">${esc(f.s)}</div></div>`;
  else if(isToday&&pr.total&&!rest)html+=`<div class="muted small" style="text-align:center">Виконайте всі звички, щоб відкрити факт дня</div>`;
  const m=state.data.mood[d]||{};const tags=[...BASE_TAGS,...(S().tags||[])];const prompt=clean(pickStable(C.PROMPTS,"p"+d));
  if(m.level&&!state.moodOpen){
    const sub=[(m.tags||[]).join(" · "),m.note?"«"+m.note.slice(0,60)+(m.note.length>60?"…":"")+"»":""].filter(Boolean).join(" — ");
    html+=`<button class="glass moodsum" data-moodopen="1" aria-label="Змінити настрій"><span class="mf">${faceSVG(m.level)}</span>
      <span class="mt2"><span class="mh">${m.level} · ${MOOD_L[m.level-1].toLowerCase()}</span>${sub?`<span class="ms">${esc(sub)}</span>`:`<span class="ms">${isToday?"настрій сьогодні":"настрій"}</span>`}</span><span class="cap">змінити</span></button>`;
  }else{
  html+=`<div class="card" id="moodCard"><div class="row"><span class="cap">${isToday?"як Ви сьогодні":"настрій"}</span><span style="font-size:15px;font-weight:400">${m.level?m.level+" · "+MOOD_L[m.level-1].toLowerCase():""}</span></div>
    <div class="faces" role="group" aria-label="Настрій від 1 до 10">${MOOD_L.map((l,i)=>`<button class="face" data-mood="${i+1}" aria-pressed="${m.level===i+1}" aria-label="${i+1}: ${l}">${faceSVG(i+1)}<small>${i+1}</small></button>`).join("")}</div>
    <div class="chips">${tags.map(tg=>`<button class="chip" data-tag="${esc(tg)}" aria-pressed="${(m.tags||[]).includes(tg)}">${esc(tg)}</button>`).join("")}<button class="chip add" data-addtag="1">+ своя</button></div>
    <label class="f" for="moodNote"><span class="muted">${esc(prompt)}</span><textarea id="moodNote" maxlength="800" placeholder="Кілька слів — уже достатньо">${esc(m.note||state.draftNote||"")}</textarea></label>
    <div class="row"><span class="muted small" id="noteStatus" aria-live="polite">${m.level?"Усе зберігається автоматично":"Оберіть обличчя — і запис збережеться сам"}</span>${m.level?`<button class="lnk" data-moodclose="1">Згорнути</button>`:""}</div></div>`;
  }
  const selfies=state.data.photos.filter(x=>x.k==="selfie");
  if(m.level>=9&&!selfies.some(x=>x.d===d))html+=`<div class="glass selfie"><button class="sp" data-photo="selfie" aria-label="Зробити селфі">СЕЛФІ</button><div class="sx"><span style="font-size:16px;font-weight:400">День на ${m.level}! Збережіть цю усмішку</span><span class="muted small">Вона потрапить у галерею «Мої найкращі дні», щоб гортати у важкі.</span><button class="btn sm" data-photo="selfie">Зробити фото</button></div></div>`;
  if(m.level&&m.level<=3&&selfies.length){const s=pickStable(selfies,"c"+d);const sm=state.data.mood[s.d];
    html+=`<div class="glass selfie"><button class="sp" data-view="${s.id}" aria-label="Відкрити фото"><img data-pid="${s.id}" alt="Ваша усмішка ${human(s.d)}"></button><div class="sx"><span style="font-size:16px;font-weight:400">Згадайте цей день</span><span class="muted small">${human(s.d)}${sm?", настрій "+sm.level+" з 10":""}${sm&&sm.note?": «"+esc(sm.note.slice(0,80))+"»":""}. Важкі дні минають, а такі повертаються.</span></div></div>`}
  const ph=photosOn(d);
  html+=`<div class="card"><div class="row"><span class="cap">мій день у фото</span>${ph.length?`<span class="muted small">${ph.length}</span>`:""}</div>
    <div class="board">${ph.map(x=>`<button class="ph" data-view="${x.id}" aria-label="Фото: ${KIND_L[x.k]}"><img data-pid="${x.id}" alt="">${x.k!=="day"?`<span class="tag">${x.k==="proof"?esc(findH(x.h)?.name||"доказ"):"усмішка"}</span>`:""}</button>`).join("")}
    <button class="addph" data-photo="day"><span>+</span>Додати фото</button></div></div>`;
  if(state.data.habits.length&&!rest&&pr.total&&pr.done<pr.total){const left=REST_PER_MONTH-restUsed(d.slice(0,7));
    html+=`<div class="restline"><button class="lnk" data-rest="1" ${left>0?"":"disabled"}>Взяти день відпочинку (${left>0?"лишилось "+left:"цього місяця вже використано"})</button></div>`}
  return html;
}
function habitTile(h,d){
  const done=isDone(h,d);const st=streak(h);const v=val(h,d);const pr=proofOf(h,d);
  const fill=h.type==="count"?Math.min(1,v/h.target):(done?1:0);
  const next=C.MILESTONES.find(x=>x>st.n);
  let meta=st.n?`${st.n} ${st.unit} поспіль`:"почніть серію";
  if(isWeekly(h))meta=`${weekCount(h,d)} з ${h.schedule.times} цього тижня`;
  else if(st.n&&next&&next-st.n<=2)meta+=` · ще ${next-st.n} до віхи`;
  const ic=pr?`<button class="ic ph" data-view="${pr.id}" aria-label="Фото-доказ"><img data-pid="${pr.id}" alt=""></button>`:`<span class="ic">${svg(hIcon(h))}</span>`;
  const top=`<div class="top">${ic}<button class="cam" data-proof="${h.id}" aria-label="Додати фото-доказ">${svg("cam")}</button></div><span class="nm">${esc(h.name)}</span>`;
  if(h.type==="count")return `<div class="tile ${done?"done":""}" id="h-${h.id}">${top}<span class="mt">${esc(h.unit)} · ${esc(meta)}</span>
    <div class="cnt"><button data-dec="${h.id}" aria-label="Мінус">−</button><span>${v}/${h.target}</span><button data-inc="${h.id}" aria-label="Плюс">+</button></div>
    <div class="bar"><i style="width:${fill*100}%"></i></div></div>`;
  return `<div class="tile ${done?"done":""}" id="h-${h.id}"><button class="hit" data-toggle="${h.id}" aria-pressed="${done}" aria-label="${esc(h.name)}: ${done?"виконано":"позначити"}"></button>${top}<span class="mt">${esc(meta)}</span>
    <div class="bar"><i style="width:${fill*100}%"></i></div><span class="chk"><svg viewBox="0 0 24 24" fill="none" stroke="#3A2E3A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${IC.check}"/></svg></span></div>`;
}

function vCal(){
  const [y,mo]=state.calMonth.split("-").map(Number);const first=new Date(y,mo-1,1);const dim=new Date(y,mo,0).getDate();
  const off=(first.getDay()+6)%7;const t=todayISO();const mode=state.calMode;const h=findH(mode);
  let cells=WD.map(w=>`<div class="wd">${w}</div>`).join("")+"<div></div>".repeat(off);
  for(let i=1;i<=dim;i++){const d=`${y}-${pad(mo)}-${pad(i)}`;let st="",cls="",extra="",pid="";
    if(mode==="mood"){const m=state.data.mood[d];if(m)st=`background:${moodVar(m.level)}`;if(d<=t&&perfect(d))extra='<span class="dot"></span>'}
    else if(mode==="photo"){const p=photosOn(d)[0];if(p){pid=` data-pid="${p.id}"`;cls="photo"}}
    else if(h){if(isDone(h,d))st="background:linear-gradient(135deg,var(--acc1),var(--acc2));color:#3A2E3A";else if(scheduled(h,d)&&d<t&&!isWeekly(h))st="background:var(--hair)"}
    cells+=`<button class="cell ${cls} ${d===t?"today":""} ${d>t?"future":""}" style="${st}"${pid} data-cell="${d}" ${d>t?"disabled":""} aria-label="${human(d)}">${i}${extra}</button>`}
  const modes=`<div class="chips"><button class="chip" data-calmode="mood" aria-pressed="${mode==="mood"}">Настрій</button><button class="chip" data-calmode="photo" aria-pressed="${mode==="photo"}">Фото</button>${active().map(x=>`<button class="chip" data-calmode="${x.id}" aria-pressed="${mode===x.id}">${esc(x.name)}</button>`).join("")}</div>`;
  const legend=mode==="mood"?`<div class="legend"><span><i style="background:var(--m1)"></i>1</span><span><i style="background:var(--m4)"></i>4</span><span><i style="background:var(--m7)"></i>7</span><span><i style="background:var(--m10)"></i>10</span><span>· крапка — ідеальний день</span></div>`
    :mode==="photo"?`<div class="legend"><span>Перше фото кожного дня</span></div>`:`<div class="legend"><span><i style="background:linear-gradient(135deg,var(--acc1),var(--acc2))"></i>виконано</span><span><i style="background:var(--hair)"></i>пропущено</span></div>`;
  const ms=state.calMonth+"-01",me=iso(new Date(y,mo,0))>t?t:iso(new Date(y,mo,0));
  let monthLine="";if(ms<=t){const st=periodStats({s:ms,e:me,ps:ms,pe:ms});
    monthLine=`<div class="nums"><span><b>${st.ci}</b> виконань</span><span><b>${st.perfectN}</b> ідеальних днів</span>${st.mood!=null?`<span>настрій <b>${fmt(st.mood)}</b></span>`:""}<span><b>${st.ph.length}</b> фото</span></div>`}
  return `<header style="display:grid;gap:4px"><span class="cap">календар</span><h1>${MONTHS[mo-1]} ${y}</h1></header>${modes}
  <div class="card"><div class="cal-head"><button class="ibtn" id="cPrev" aria-label="Попередній місяць">‹</button><span class="cap">${MONTHS[mo-1]}</span><button class="ibtn" id="cNext" aria-label="Наступний місяць">›</button></div>
  <div class="cal">${cells}</div>${legend}${monthLine}<div class="muted small">Торкніться дня, щоб переглянути записи й фото.</div></div>`;
}

function moodChart(){
  const pts=[];for(let i=29;i>=0;i--){const d=addDays(todayISO(),-i);const m=state.data.mood[d];pts.push({i:29-i,d,v:m?m.level:null})}
  const have=pts.filter(p=>p.v);if(have.length<2)return `<div class="note">Відмітьте настрій хоча б 2 дні — і тут з'явиться графік</div>`;
  const W=320,H=150,L=22,R=8,T=10,B=22;const x=i=>L+(W-L-R)*i/29;const y=v=>T+(H-T-B)*(10-v)/9;
  let g="";for(const v of [1,4,7,10])g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--hair)"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end" font-size="10" style="fill:var(--muted)">${v}</text>`;
  const path=have.map((p,k)=>(k?"L":"M")+x(p.i).toFixed(1)+" "+y(p.v).toFixed(1)).join(" ");
  const area=path+` L${x(have[have.length-1].i).toFixed(1)} ${H-B} L${x(have[0].i).toFixed(1)} ${H-B} Z`;const last=have[have.length-1];
  const dots=have.map(p=>`<circle cx="${x(p.i)}" cy="${y(p.v)}" r="${p===last?4.5:2.6}" style="fill:${p===last?"var(--fg)":"var(--acc1)"}"/>`).join("");
  const lab=[0,14,29].map(i=>`<text x="${x(i)}" y="${H-5}" text-anchor="${i===0?"start":i===29?"end":"middle"}" font-size="10" style="fill:var(--muted)">${human(pts[i].d)}</text>`).join("");
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Настрій за 30 днів" font-family="Raleway,sans-serif">
    <defs><linearGradient id="ar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--acc1);stop-opacity:.45"/><stop offset="1" style="stop-color:var(--acc2);stop-opacity:0"/></linearGradient></defs>
    ${g}<path d="${area}" fill="url(#ar)"/><path d="${path}" fill="none" style="stroke:var(--acc1)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>${dots}${lab}</svg></div>`}
function yearMap(){const t=todayISO();const start=addDays(weekStart(t),-7*25);const cols=26,cs=11,gap=3;const W=24+cols*(cs+gap),H=7*(cs+gap)+16;let r="";
  for(let c=0;c<cols;c++)for(let k=0;k<7;k++){const d=addDays(start,c*7+k);if(d>t)continue;const p=dayProgress(d);
    let f="var(--y0)";if(isRest(d))f="var(--yr)";else if(p.total){const q=p.done/p.total;f=q===0?"var(--y0)":q<0.5?"var(--y1)":q<1?"var(--y2)":"var(--y3)"}
    r+=`<rect x="${24+c*(cs+gap)}" y="${k*(cs+gap)}" width="${cs}" height="${cs}" rx="3" style="fill:${f}"><title>${human(d)}: ${p.done}/${p.total}</title></rect>`}
  const ml=[];for(let c=0;c<cols;c+=4){const d=addDays(start,c*7);ml.push(`<text x="${24+c*(cs+gap)}" y="${H-2}" font-size="10" style="fill:var(--muted)">${MONTHS_G[parse(d).getMonth()].slice(0,3)}</text>`)}
  const wl=[0,2,4].map(k=>`<text x="0" y="${k*(cs+gap)+cs-1}" font-size="9" style="fill:var(--muted)">${WD[k]}</text>`).join("");
  return `<div class="year"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Raleway,sans-serif" role="img" aria-label="Карта виконання за пів року">${wl}${r}${ml.join("")}</svg></div>
   <div class="legend"><span><i style="background:var(--y0)"></i>0%</span><span><i style="background:var(--y1)"></i>до 50%</span><span><i style="background:var(--y2)"></i>50–99%</span><span><i style="background:var(--y3)"></i>100%</span><span><i style="background:var(--yr)"></i>відпочинок</span></div>`}
function timeOfDay(h){const hrs=[];for(const m of Object.values(state.data.ts))if(m[h.id]!=null)hrs.push(m[h.id]);if(hrs.length<5)return "";
  const b={"вранці":0,"вдень":0,"ввечері":0,"вночі":0};for(const x of hrs){if(x>=5&&x<12)b["вранці"]++;else if(x>=12&&x<17)b["вдень"]++;else if(x>=17&&x<23)b["ввечері"]++;else b["вночі"]++}
  return "найчастіше "+Object.entries(b).sort((a,c)=>c[1]-a[1])[0][0]}

function vStats(){
  const hs=active();const t=todayISO();const F=findings();const moodN=Object.keys(state.data.mood).length;const startD=firstDate();const tracked=diffDays(startD,t)+1;
  let html=`<header style="display:grid;gap:4px"><span class="cap">аналіз</span><h1>Ви з трекером ${tracked} ${plural(tracked,"день","дні","днів")}</h1></header>
  <div class="sumchips"><button class="chip" data-story="wcur">Цей тиждень</button><button class="chip" data-story="wprev">Минулий тиждень</button><button class="chip" data-story="mcur">Цей місяць</button><button class="chip" data-story="mprev">Минулий місяць</button></div>`;
  html+=`<div class="card"><span class="cap">інсайти</span>${F.length?F.slice(0,4).map(f=>`<div class="insight"><span class="ie">${svg(f.i)}</span><div><span class="badge s${f.k}">зв'язок: ${f.s}</span><p>${f.text}</p></div></div>`).join("")+
    `<div class="note">Це збіги в часі, а не докази причини. Але вони добре підказують, що варто спробувати.</div>`
    :`<div class="note">Тут з'являться знахідки: що піднімає настрій, які звички тягнуть за собою інші, які дні найважчі. Потрібно приблизно 2 тижні записів. Днів з настроєм зараз: <b>${moodN}</b>${moodN<14?`, ще ~${14-moodN}`:""}.</div>`}</div>`;
  let bestS={n:0,h:null};for(const h of state.data.habits){const b=bestStreak(h);if(!isWeekly(h)&&b>bestS.n)bestS={n:b,h}}
  let perfectN=0;for(let d=startD;d<=t;d=addDays(d,1))if(perfect(d))perfectN++;
  const total=checkins(startD,t);const happy=Object.values(state.data.mood).filter(m=>m.level>=9).length;
  html+=`<div class="card"><span class="cap">особисті рекорди</span><div class="recs">
    <div class="rec"><b>${total}</b><span>виконань загалом</span></div><div class="rec"><b>${bestS.n}</b><span>найдовша серія${bestS.h?" · "+esc(bestS.h.name):""}</span></div>
    <div class="rec"><b>${perfectN}</b><span>ідеальних днів</span></div><div class="rec"><b>${happy}</b><span>днів на 9–10</span></div></div></div>`;
  const md=Object.entries(state.data.mood).filter(([d])=>d>addDays(t,-30)).map(([,m])=>m.level);const avg=mean(md);
  html+=`<div class="card"><div class="row"><span class="cap">настрій за 30 днів</span>${md.length?`<span style="display:flex;align-items:center;gap:6px;font-size:18px;font-weight:300"><span style="width:26px;height:26px;display:inline-block">${faceSVG(Math.round(avg))}</span>${fmt(avg)}</span>`:""}</div>${moodChart()}</div>`;
  const wd=weekdayStats();if(moodN>=7||wd.some(x=>x.c!=null)){
    html+=`<div class="card"><span class="cap">дні тижня</span><div class="muted small">Верхня смужка — настрій, нижня — виконання звичок</div><div style="display:grid;gap:7px">${wd.map((x,i)=>`
      <div class="wk"><span>${WD[i]}</span><div style="display:grid;gap:3px"><div class="track"><i style="width:${x.m?x.m/10*100:0}%"></i></div><div class="track" style="height:3px"><i class="low" style="width:${x.c!=null?x.c*100:0}%"></i></div></div><span style="text-align:right">${x.m?fmt(x.m):"–"}</span></div>`).join("")}</div></div>`}
  html+=`<div class="card"><span class="cap">звички</span>${hs.length?hs.map(h=>{const st=streak(h);const r=rateRange(h,addDays(t,-29)<h.created?h.created:addDays(t,-29),t);
    const cells=[];for(let i=29;i>=0;i--){const d=addDays(t,-i);cells.push(`<i style="background:${isDone(h,d)?"linear-gradient(180deg,var(--acc1),var(--acc2))":(scheduled(h,d)&&!isWeekly(h)&&d<t?"var(--hair)":"transparent")}"></i>`)}
    const tod=timeOfDay(h);const nPh=state.data.photos.filter(p=>p.k==="proof"&&p.h===h.id).length;
    return `<div class="hstat"><span class="ic">${svg(hIcon(h))}</span><div style="min-width:0"><span style="font-size:16px;font-weight:400">${esc(h.name)}</span>
    <div class="nums"><span><b>${st.n}</b> ${st.unit}</span><span>рекорд <b>${bestStreak(h)}</b></span>${r!=null?`<span><b>${Math.round(r*100)}%</b> за 30 днів</span>`:""}${tod?`<span>${tod}</span>`:""}${nPh?`<span><b>${nPh}</b> фото</span>`:""}</div>
    <div class="strip">${cells.join("")}</div></div></div>`}).join(""):`<div class="note">Додайте звичку на головному екрані</div>`}</div>`;
  const rows=hs.map(h=>({h,a:habitMood(h,0),b:habitMood(h,1)}));const ready=rows.filter(r=>r.a.ok||r.b.ok);
  html+=`<div class="card"><span class="cap">звички й настрій</span>${ready.length?`<div class="cmp">${ready.map(({h,a,b})=>`
      <div style="font-weight:400;margin-top:4px">${esc(h.name)} ${a.ok?`<span class="badge s${strength(a.d).k}">${strength(a.d).l}</span>`:""}</div>
      ${a.ok?`<div class="bar"><span>✓ цього дня</span><div class="track"><i style="width:${a.ay*10}%"></i></div><b>${fmt(a.ay)}</b></div>
      <div class="bar"><span>✗ цього дня</span><div class="track"><i class="low" style="width:${a.an*10}%"></i></div><b>${fmt(a.an)}</b></div>`:""}
      ${b.ok?`<div class="bar"><span>✓ наступного</span><div class="track"><i style="width:${b.ay*10}%"></i></div><b>${fmt(b.ay)}</b></div>
      <div class="bar"><span>✗ наступного</span><div class="track"><i class="low" style="width:${b.an*10}%"></i></div><b>${fmt(b.an)}</b></div>`:""}`).join("")}</div>
      <div class="note">✓ — звичку виконано, ✗ — пропущено. Середній настрій від 1 до 10. «Наступного» показує відкладений ефект: наприклад, як ранній сон впливає на завтра.</div>`
    :`<div class="note">Потрібно щонайменше 5 днів, коли звичку виконано, і 3, коли пропущено, з відміченим настроєм.</div>`}</div>`;
  const ch=chains();if(hs.filter(h=>!isWeekly(h)).length>=2)html+=`<div class="card"><span class="cap">ланцюжки звичок</span>${ch.length?ch.slice(0,4).map(c=>`<div class="insight"><span class="ie">${svg("link")}</span><div><span class="badge s${strengthPP(c.pp).k}">${strengthPP(c.pp).l}</span>
      <p>Після «${esc(c.A.name)}» «${esc(c.B.name)}» вдається у ${Math.round(c.p1*100)}% днів, без неї — у ${Math.round(c.p0*100)}%</p></div></div>`).join("")+`<div class="note">Прив'яжіть другу звичку до першої: «після прогулянки — склянка води». Це називають нанизуванням звичок.</div>`
    :`<div class="note">Коли накопичиться ~2 тижні даних, тут з'явиться, які звички «тягнуть» за собою інші.</div>`}</div>`;
  const tg=tagStats();if(tg.length)html+=`<div class="card"><span class="cap">що впливає на настрій</span><div class="cmp">${tg.slice(0,8).map(x=>`<div class="bar"><span>${esc(x.t)}</span><div class="track"><i style="width:${x.a*10}%"></i></div><b>${fmt(x.a)}</b></div>`).join("")}</div><div class="note">Середній настрій у дні з цією міткою (мітки, що трапилися 3+ рази).</div></div>`;
  const selfies=state.data.photos.filter(p=>p.k==="selfie").sort((a,b)=>b.d.localeCompare(a.d));
  html+=`<div class="card"><span class="cap">мої найкращі дні</span>${selfies.length?`<div class="gallery">${selfies.map(p=>`<button data-view="${p.id}" aria-label="Фото ${human(p.d)}"><img data-pid="${p.id}" alt=""><small>${human(p.d)}</small></button>`).join("")}</div>`
    :`<div class="note">Коли оціните день на 9 або 10, застосунок запропонує селфі. Тут збереться галерея усмішок для важких днів.</div>`}</div>`;
  html+=`<div class="card"><span class="cap">пів року одним поглядом</span>${yearMap()}</div>`;
  const got=S().candies;
  html+=`<div class="card"><span class="cap">віхи серій</span><div class="medals">${C.MILESTONES.map(n=>{const c=got.filter(x=>x.n===n);
    return `<div class="medal ${c.length?"on":"off"}"><span>${n}</span>${c.length?c.map(x=>esc(findH(x.h)?.name||"")).join(", "):plural(n,"день","дні","днів")}</div>`}).join("")}</div></div>`;
  return html}

function vSet(){const hs=state.data.habits;const act=active();const th=S().theme;
  return `<header style="display:grid;gap:4px"><span class="cap">налаштування</span><h1>Ще</h1></header>
  <div class="card"><div class="row"><span class="cap">мої звички</span><button class="btn sm" data-newhabit="1">Додати</button></div>
    ${act.length>5?`<div class="note">У Вас ${act.length} активних звичок. Найчастіше трекери кидають через перевантаження. Можливо, щось варто поставити на паузу?</div>`:""}
    ${hs.length?hs.map(h=>`<div class="list-item" style="${h.archived?"opacity:.55":""}"><span class="ic">${svg(hIcon(h))}</span>
      <div style="min-width:0"><span style="font-weight:400;overflow-wrap:anywhere">${esc(h.name)}</span><div class="muted small">${h.type==="count"?h.target+" "+esc(h.unit)+" · ":""}${schedText(h)}${h.archived?" · на паузі":""}</div></div>
      <div style="display:grid;justify-items:end"><button class="lnk" data-edit="${h.id}">Змінити</button><button class="lnk" data-arch="${h.id}">${h.archived?"Відновити":"Пауза"}</button><button class="lnk danger" data-delh="${h.id}">Видалити</button></div></div>`).join("")
    :`<div class="muted">Звичок ще немає.</div>`}</div>
  <div class="card"><span class="cap">оформлення</span><div class="seg" role="group" aria-label="Тема"><button data-theme="auto" aria-pressed="${th==="auto"}">Як в iPhone</button><button data-theme="light" aria-pressed="${th==="light"}">Туман</button><button data-theme="dark" aria-pressed="${th==="dark"}">Сутінки</button></div></div>
  <div class="card"><span class="cap">нагадування</span><div class="muted small">Застосунок без сервера не може сам надсилати сповіщення. Але iPhone уміє відкривати його за розкладом:</div>
    <ol class="steps"><li>Програма <b>«Команди»</b> → <b>«Автоматизація»</b> → <b>+</b>.</li><li><b>«Час доби»</b>, наприклад 21:00, <b>Щодня</b>, <b>«Запускати одразу»</b>.</li><li>Дія <b>«Відкрити URL»</b> → <b>gnatovadarya-dev.github.io/habits/</b> → <b>Готово</b>.</li></ol></div>
  <div class="card"><span class="cap">дні відпочинку</span><div class="muted small">${REST_PER_MONTH} дні на місяць, які не обривають серії. Беріть їх, коли хворієте, подорожуєте чи просто видихаєте. Кнопка — внизу головного екрана.</div>
    <div class="small">Цього місяця використано: <b>${restUsed(todayISO().slice(0,7))} з ${REST_PER_MONTH}</b></div></div>
  <div class="card"><span class="cap">резервна копія записів</span><div class="note">Записи живуть лише на цьому телефоні. Раз на 1–2 тижні зберігайте копію у «Файли» або iCloud.</div>
    <div class="small">Остання копія: <b>${S().lastBackup?new Date(S().lastBackup).toLocaleDateString("uk-UA"):"ще не робили"}</b></div>
    <div class="grid2"><button class="btn" id="bkSave">Зберегти</button><label class="btn soft" for="bkFile" style="text-align:center">Відновити</label></div>
    <input id="bkFile" type="file" accept=".json,application/json" hidden></div>
  <div class="card"><span class="cap">фото</span><div class="note">Фото: <b>${state.data.photos.length}</b>. Вони зберігаються окремо від записів, тож копіюйте їх окремо: кнопка нижче передасть усі фото в «Поділитися», звідти — «Зберегти у Файли».</div>
    <div class="small" id="storageLine">Пам'ять застосунку: рахую…</div>
    <div class="grid2"><button class="btn" id="phExport" ${state.data.photos.length?"":"disabled"}>Зберегти фото</button><button class="btn soft" id="phImportBtn">Відновити фото</button></div></div>
  <div class="card"><span class="cap">звідки факти</span><div class="muted small">Усі ${C.FACTS.length} фактів у застосунку взяті з наукових досліджень. Джерело вказане під кожним фактом дня.</div></div>`}

/* ================= story ================= */
function buildStory(P){const st=periodStats(P);const cards=[];const F=findings();
  cards.push({i:"spark",t:P.label,p:P.title,s:"Торкайтеся праворуч, щоб гортати"});
  const dlt=st.ci-st.pci;
  cards.push({n:st.ci,t:plural(st.ci,"виконання звички","виконання звичок","виконань звичок"),p:st.pci?(dlt>0?`На ${dlt} більше, ніж ${P.unitG}. Ви ростете`:dlt<0?`На ${-dlt} менше, ніж ${P.unitG}. Буває. Головне — не зупинятися`:`Стабільно, як і ${P.unitG}. Стабільність — суперсила`):"Перший підсумок — точка відліку для наступних"});
  if(st.perfectN)cards.push({n:st.perfectN,t:plural(st.perfectN,"ідеальний день","ідеальні дні","ідеальних днів"),p:"Дні, коли виконано все заплановане"});
  if(st.top&&st.top.r>0)cards.push({i:hIcon(st.top.h),n:Math.round(st.top.r*100)+"%",t:"Зірка "+(P.unit==="тиждень"?"тижня":"місяця"),p:st.top.h.name+". "+(st.top.r>=1?"Без жодного пропуску. Ця звичка вже Ваша":st.top.r>=0.9?"Майже без пропусків":"Найстабільніша з Ваших звичок")});
  if(st.best)cards.push({face:st.best.m?st.best.m.level:null,i:st.best.m?null:"star",t:"Найкращий день",p:`${human(st.best.d)}: ${st.best.done} ${plural(st.best.done,"звичка","звички","звичок")}${st.best.m?", настрій "+st.best.m.level+" з 10":""}`+(st.best.m&&st.best.m.note?`. Ви записали: «${st.best.m.note.slice(0,90)}${st.best.m.note.length>90?"…":""}»`:"")});
  if(st.mood!=null){const dm=st.pmood!=null?st.mood-st.pmood:null;
    cards.push({face:Math.round(st.mood),n:fmt(st.mood),t:"середній настрій",p:(dm!=null&&Math.abs(dm)>=0.4?(dm>0?`На ${fmt(dm)} вище, ніж ${P.unitG}.`:`На ${fmt(-dm)} нижче, ніж ${P.unitG}. Будьте до себе лагідні.`):"")+(st.topTag?` Найчастіша мітка: ${st.topTag[0]}`:"")})}
  if(st.ph.length)cards.push({i:"cam",n:st.ph.length,t:"фото",p:"Ваш "+(P.unit==="тиждень"?"тиждень":"місяць")+" у кадрах. Перегляньте їх у календарі в режимі «Фото»"});
  if(st.ms.length)cards.push({i:"star",n:st.ms.length,t:plural(st.ms.length,"нова віха","нові віхи","нових віх"),p:st.ms.map(c=>(findH(c.h)?.name||"")+" · "+c.n+" "+plural(c.n,"день","дні","днів")).join(", ")});
  if(F[0])cards.push({i:"bulb",t:"Головна знахідка",p:F[0].text.replace(/<[^>]+>/g,""),s:"Зв'язок: "+F[0].s});
  const f=C.FACTS[hash(P.s)%C.FACTS.length];cards.push({i:"leaf",t:"Новий "+(P.unit==="тиждень"?"тиждень":"місяць")+" — новий старт",p:f.t,s:f.s});
  return cards}
function openStory(P,key){const cards=buildStory(P);let i=0;const root=document.getElementById("storyRoot");
  const draw=()=>{const c=cards[i];const vis=c.face?`<div class="se">${faceSVG(c.face,1)}</div>`:c.i?`<div class="se">${svg(c.i,'stroke-width="1"')}</div>`:"";
    root.innerHTML=`<div class="story" role="dialog" aria-modal="true" aria-label="${esc(P.label)}"><div class="blobs" aria-hidden="true" style="position:absolute;z-index:0"><i></i><i></i><i></i></div>
    <div class="top"><div class="bars">${cards.map((x,k)=>`<i class="${k<=i?"on":""}"></i>`).join("")}</div><button class="close" id="stClose" aria-label="Закрити">✕</button></div>
    <div class="body">${vis}${c.n!=null?`<div class="sn">${esc(c.n)}</div>`:""}<div class="st">${esc(c.t)}</div>${c.p?`<div class="sp">${esc(clean(c.p))}</div>`:""}${c.s?`<div class="ss">${esc(c.s)}</div>`:""}</div>
    <div class="hint">${i+1} / ${cards.length}${i===cards.length-1?" · торкніться, щоб закрити":""}</div>
    <button class="tapl" aria-label="Назад"></button><button class="tapr" aria-label="Далі"></button></div>`;
    root.querySelector("#stClose").onclick=close;root.querySelector(".tapl").onclick=()=>{if(i>0){i--;draw()}};root.querySelector(".tapr").onclick=()=>{if(i<cards.length-1){i++;draw()}else close()}};
  const close=()=>{root.innerHTML="";if(key){S().summarySeen[key]=todayISO();save()}render()};draw()}

/* ================= render ================= */
function render(){const app=document.getElementById("app");const sc=window.scrollY;
  app.innerHTML={today:vToday,cal:vCal,stats:vStats,set:vSet}[state.tab]();
  document.querySelectorAll("nav.tabs button").forEach(b=>b.dataset.tab===state.tab?b.setAttribute("aria-current","page"):b.removeAttribute("aria-current"));
  window.scrollTo(0,sc);PhotoStore.hydrate(app);
  if(state.tab==="set")storageLine()}
async function storageLine(){const el=document.getElementById("storageLine");if(!el)return;
  try{const e=await navigator.storage.estimate();el.textContent="Пам'ять застосунку: ~"+Math.round((e.usage||0)/1048576)+" МБ"}catch(err){el.textContent=""}}

/* ================= sheet ================= */
const sheet=document.getElementById("sheet");
function openSheet(title,html,mount){document.getElementById("sheetTitle").textContent=title;const b=document.getElementById("sheetBody");b.innerHTML=html;b.onclick=null;sheet.hidden=false;mount&&mount();PhotoStore.hydrate(b)}
const closeSheet=()=>{sheet.hidden=true};
document.getElementById("sheetClose").onclick=closeSheet;
sheet.onclick=e=>{if(e.target===sheet)closeSheet()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSheet();const r=document.getElementById("storyRoot");if(r.innerHTML){r.innerHTML="";render()}}});

function habitForm(h){
  const isNew=!h;h=h?structuredClone(h):{name:"",icon:"drop",type:"check",target:8,unit:"склянок",step:1,schedule:{kind:"daily",days:[1,2,3,4,5],times:3}};
  h.schedule={kind:"daily",days:[1,2,3,4,5],times:3,...h.schedule};h.icon=hIcon(h);
  const draw=()=>{const body=document.getElementById("sheetBody");
    body.innerHTML=`<label class="f" for="hName">Назва<input id="hName" maxlength="40" value="${esc(h.name)}" placeholder="Наприклад: Вода, Розтяжка"></label>
    <div class="f">Іконка<div class="icons">${ICON_KEYS.map(k=>`<button type="button" data-ico="${k}" aria-pressed="${k===h.icon}" aria-label="${k}">${svg(k)}</button>`).join("")}</div></div>
    <div class="f">Тип<div class="seg"><button type="button" data-type="check" aria-pressed="${h.type==="check"}">Так / ні</button><button type="button" data-type="count" aria-pressed="${h.type==="count"}">Кількість</button></div></div>
    ${h.type==="count"?`<div class="grid2"><label class="f" for="hTarget">Ціль на день<input id="hTarget" type="number" inputmode="numeric" min="1" value="${h.target}"></label><label class="f" for="hUnit">Одиниця<input id="hUnit" maxlength="15" value="${esc(h.unit)}"></label></div>
      <label class="f" for="hStep">Крок кнопки «+»<input id="hStep" type="number" inputmode="numeric" min="1" value="${h.step||1}"></label>`:""}
    <div class="f">Коли<div class="seg"><button type="button" data-kind="daily" aria-pressed="${h.schedule.kind==="daily"}">Щодня</button><button type="button" data-kind="days" aria-pressed="${h.schedule.kind==="days"}">Дні тижня</button><button type="button" data-kind="weekly" aria-pressed="${h.schedule.kind==="weekly"}">N разів/тиж</button></div></div>
    ${h.schedule.kind==="days"?`<div class="wdays">${WD.map((w,i)=>`<button type="button" data-wd="${i+1}" aria-pressed="${h.schedule.days.includes(i+1)}">${w}</button>`).join("")}</div>`:""}
    ${h.schedule.kind==="weekly"?`<label class="f" for="hTimes">Скільки разів на тиждень<input id="hTimes" type="number" inputmode="numeric" min="1" max="7" value="${h.schedule.times}"></label>`:""}
    <div class="note">Порада з досліджень: план «якщо… то…» допомагає. Наприклад: «Якщо 21:00 — то розтяжка».</div>
    <button class="btn" id="hSave">${isNew?"Додати звичку":"Зберегти"}</button>`;
    const keep=()=>{const g=id=>document.getElementById(id);if(g("hName"))h.name=g("hName").value;if(g("hTarget"))h.target=Math.max(1,parseInt(g("hTarget").value)||1);
      if(g("hUnit"))h.unit=g("hUnit").value;if(g("hStep"))h.step=Math.max(1,parseInt(g("hStep").value)||1);if(g("hTimes"))h.schedule.times=Math.min(7,Math.max(1,parseInt(g("hTimes").value)||1))};
    body.onclick=e=>{const b=e.target.closest("button");if(!b)return;keep();
      if(b.dataset.ico){h.icon=b.dataset.ico;draw()}else if(b.dataset.type){h.type=b.dataset.type;draw()}else if(b.dataset.kind){h.schedule.kind=b.dataset.kind;draw()}
      else if(b.dataset.wd){const n=+b.dataset.wd;const s=new Set(h.schedule.days);s.has(n)?s.delete(n):s.add(n);h.schedule.days=[...s].sort();draw()}
      else if(b.id==="hSave"){h.name=h.name.trim();if(!h.name){toast("Дайте звичці назву");return}
        if(h.schedule.kind==="days"&&!h.schedule.days.length){toast("Оберіть хоча б один день");return}
        if(isNew){h.id=uid();h.created=todayISO();state.data.habits.push(h);toast(`«${h.name}» додано`)}else{const i=state.data.habits.findIndex(x=>x.id===h.id);state.data.habits[i]=h;toast("Збережено")}
        save();closeSheet();render()}}};
  openSheet(isNew?"Нова звичка":"Змінити звичку","",draw)}
function dayDetails(d){const m=state.data.mood[d];const hs=state.data.habits.filter(h=>planned(h,d)||isDone(h,d));const ph=photosOn(d);
  openSheet(human(d)+", "+WD_FULL[dow(d)-1],`
    ${m?`<div style="display:flex;gap:12px;align-items:center"><span style="width:44px;height:44px;display:inline-block">${faceSVG(m.level)}</span><div><span style="font-size:17px;font-weight:400">${m.level} з 10 · ${MOOD_L[m.level-1].toLowerCase()}</span><div class="muted small">${(m.tags||[]).map(esc).join(" · ")||"без міток"}</div></div></div>${m.note?`<div class="note" style="color:var(--fg);white-space:pre-wrap">${esc(m.note)}</div>`:""}`:`<div class="muted">Настрій не відмічено.</div>`}
    ${isRest(d)?`<div class="note">День відпочинку</div>`:""}
    ${hs.length?`<div class="chips">${hs.map(h=>`<span class="chip" ${isDone(h,d)?'aria-pressed="true"':'style="opacity:.6"'}>${esc(h.name)}${h.type==="count"?" "+val(h,d)+"/"+h.target:""}</span>`).join("")}</div>`:""}
    ${ph.length?`<div class="board">${ph.map(x=>`<button class="ph" data-view="${x.id}"><img data-pid="${x.id}" alt=""></button>`).join("")}</div>`:""}
    <button class="btn" id="goEdit">Змінити цей день</button>`,()=>{
      document.getElementById("goEdit").onclick=()=>{state.sel=d;state.tab="today";closeSheet();render();window.scrollTo(0,0)};
      document.getElementById("sheetBody").onclick=e=>{const b=e.target.closest("[data-view]");if(b)viewPhoto(b.dataset.view)}})}
function viewPhoto(id){const p=state.data.photos.find(x=>x.id===id);if(!p)return;const h=p.h?findH(p.h):null;const m=state.data.mood[p.d];
  openSheet(human(p.d),`<div class="viewer"><img data-pid="${p.id}" alt="Фото ${human(p.d)}"></div>
    <div class="muted small">${p.k==="proof"?"Фото-доказ: "+esc(h?.name||"звичка"):p.k==="selfie"?"Усмішка дня"+(m?", настрій "+m.level+" з 10":""):"Фото дня"}</div>
    <button class="lnk danger" id="phDel" style="justify-self:start">Видалити фото</button>`,()=>{
      const b=document.getElementById("phDel");b.onclick=async()=>{if(!b.dataset.armed){b.dataset.armed=1;b.textContent="Точно видалити? Торкніться ще раз";return}
        await PhotoStore.del(p.id).catch(()=>{});state.data.photos=state.data.photos.filter(x=>x.id!==p.id);save();closeSheet();render();toast("Фото видалено")}})}

/* ================= photos ================= */
const photoIn=document.getElementById("photoIn");
function askPhoto(kind,habitId){state.pending={kind,h:habitId||null,d:state.sel};photoIn.value="";photoIn.click()}
photoIn.addEventListener("change",async()=>{const f=photoIn.files[0];const pend=state.pending;state.pending=null;if(!f||!pend)return;
  toast("Зберігаю фото…");
  try{const {blob,w,h}=await PhotoStore.compress(f);const id=uid();await PhotoStore.put(id,blob);
    state.data.photos.push({id,d:pend.d,k:pend.kind,h:pend.h,w,hgt:h,at:new Date().toISOString()});
    if(pend.kind==="proof"){const hb=findH(pend.h);if(hb&&hb.type==="check"&&!isDone(hb,pend.d)){setVal(hb,pend.d,1);afterHabitChange(hb,pend.d,false);toast("Доказ прийнято, звичку зараховано");return}}
    save();render();toast(pend.kind==="selfie"?"Усмішку збережено в «Мої найкращі дні»":"Фото збережено")}
  catch(e){toast("Не вдалося зберегти фото. Можливо, бракує пам'яті")}});
async function exportPhotos(){const files=[];
  for(const p of state.data.photos){const b=await PhotoStore.get(p.id).catch(()=>null);if(b)files.push(new File([b],`${p.d}_${p.k}${p.h?"_"+p.h:""}_${p.id}.jpg`,{type:"image/jpeg"}))}
  if(!files.length){toast("Фото не знайдено");return}
  try{if(navigator.canShare&&navigator.canShare({files})){await navigator.share({files});toast("Готово. Оберіть «Зберегти у Файли»")}else toast("Цей браузер не дає поділитися файлами. Відкрийте застосунок з іконки на iPhone")}
  catch(e){if(e&&e.name!=="AbortError")toast("Фото забагато для одного разу. Видаліть зайві або спробуйте пізніше")}}
const photoImport=document.getElementById("photoImport");
photoImport.addEventListener("change",async()=>{const fs=[...photoImport.files];photoImport.value="";if(!fs.length)return;let n=0;
  for(const f of fs){const m=f.name.match(/^(\d{4}-\d{2}-\d{2})_(proof|day|selfie)(?:_([a-z0-9]+))?_([a-z0-9]+)\.jpe?g$/i);
    const id=m?m[4]:uid();if(state.data.photos.some(p=>p.id===id))continue;
    try{const {blob,w,h}=m?{blob:f,w:0,h:0}:await PhotoStore.compress(f);await PhotoStore.put(id,blob);
      state.data.photos.push({id,d:m?m[1]:todayISO(),k:m?m[2]:"day",h:m&&m[3]?m[3]:null,w,hgt:h,at:new Date().toISOString()});n++}catch(e){}}
  save();render();toast(n?`Відновлено ${n} фото`:"Нових фото не знайдено")});

/* ================= confetti ================= */
function confetti(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const c=document.getElementById("confetti");c.hidden=false;const ctx=c.getContext("2d");const dpr=devicePixelRatio||1;c.width=innerWidth*dpr;c.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const cs=getComputedStyle(document.documentElement);const cols=[cs.getPropertyValue("--acc1").trim(),cs.getPropertyValue("--acc2").trim(),cs.getPropertyValue("--blob3").trim(),"#FFFFFF"];
  const ps=Array.from({length:90},()=>({x:innerWidth/2,y:innerHeight*.3,vx:(Math.random()-.5)*8,vy:-Math.random()*9-3,s:Math.random()*5+3,c:cols[Math.random()*cols.length|0]}));
  let f=0;(function tick(){ctx.clearRect(0,0,innerWidth,innerHeight);
    for(const p of ps){p.vy+=.22;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;ctx.globalAlpha=Math.max(0,1-f/140);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill()}
    ctx.globalAlpha=1;if(++f<140)requestAnimationFrame(tick);else{ctx.clearRect(0,0,innerWidth,innerHeight);c.hidden=true}})()}

/* ================= actions ================= */
function setVal(h,d,v){const L=state.data.log;L[d]={...(L[d]||{})};if(v>0)L[d][h.id]=v;else delete L[d][h.id];if(!Object.keys(L[d]).length)delete L[d]}
function afterHabitChange(h,d,wasDone){const nowDone=isDone(h,d);
  if(d===todayISO()){const T=state.data.ts;T[d]={...(T[d]||{})};if(nowDone&&!wasDone)T[d][h.id]=new Date().getHours();if(!nowDone)delete T[d][h.id];if(!Object.keys(T[d]).length)delete T[d]}
  let allDoneNow=false;if(!wasDone&&nowDone){const p=dayProgress(d);allDoneNow=p.total>0&&p.done===p.total;if(allDoneNow&&d===todayISO())unlockFact()}
  save();render();
  if(!wasDone&&nowDone){document.getElementById("h-"+h.id)?.classList.add("pop");try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}
    if(allDoneNow){confetti();toast(pickFresh(C.ALL_DONE,"all")+(d===todayISO()?" Факт дня відкрито":""))}
    else{const st=streak(h);toast(st.n>=3?`${st.n} ${st.unit} поспіль. `+pickFresh(C.PRAISE,"pr"):pickFresh(C.PRAISE,"pr"))}
    checkMilestone(h,d);save()}}
function setMood(level){const d=state.sel;const m=state.data.mood[d]||{tags:[],note:""};const n=document.getElementById("moodNote");const first=!state.data.mood[d];
  state.moodOpen=true;state.data.mood[d]={...m,level,note:(n?n.value:m.note||"").trim(),at:new Date().toISOString()};state.draftNote="";save();render();
  if(first||m.level!==level)toast(pickFresh(moodPool(level),"m"+Math.ceil(level/2)))}

document.getElementById("app").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const d=state.sel;
  if(b.dataset.day){flushNote();state.sel=b.dataset.day;state.moodOpen=false;render();return}
  if(b.dataset.moodopen){state.moodOpen=true;render();document.getElementById("moodCard")?.scrollIntoView({behavior:"smooth",block:"center"});return}
  if(b.dataset.moodclose){flushNote();state.moodOpen=false;render();return}
  if(b.dataset.toggle){const h=findH(b.dataset.toggle);const was=isDone(h,d);setVal(h,d,was?0:1);afterHabitChange(h,d,was);return}
  if(b.dataset.inc||b.dataset.dec){const h=findH(b.dataset.inc||b.dataset.dec);const was=isDone(h,d);setVal(h,d,Math.max(0,val(h,d)+(b.dataset.inc?1:-1)*(h.step||1)));afterHabitChange(h,d,was);return}
  if(b.dataset.proof){askPhoto("proof",b.dataset.proof);return}
  if(b.dataset.photo){askPhoto(b.dataset.photo);return}
  if(b.dataset.view){viewPhoto(b.dataset.view);return}
  if(b.dataset.mood){setMood(+b.dataset.mood);return}
  if(b.dataset.tag){const m=state.data.mood[d];if(!m){toast("Спершу оберіть настрій");return}
    const s=new Set(m.tags||[]);s.has(b.dataset.tag)?s.delete(b.dataset.tag):s.add(b.dataset.tag);m.tags=[...s];const n=document.getElementById("moodNote");if(n)m.note=n.value.trim();state.moodOpen=true;save();render();return}
  if(b.dataset.addtag){openSheet("Своя мітка",`<label class="f" for="tagIn">Назва<input id="tagIn" maxlength="24" placeholder="Наприклад: Кіт"></label><button class="btn" id="tagOk">Додати</button>`,()=>{
    document.getElementById("tagOk").onclick=()=>{const v=clean(document.getElementById("tagIn").value);if(!v)return;const t=S().tags||[];if(!t.includes(v)&&!BASE_TAGS.includes(v))t.push(v);S().tags=t;save();closeSheet();render()}});return}
  if(b.id==="saveNote"){const m=state.data.mood[d];if(!m)return;m.note=document.getElementById("moodNote").value.trim();save();render();toast(m.note?"Запис збережено. Дякую, що приділили собі час":"Збережено");return}
  if(b.dataset.sugg){const s=SUGG[+b.dataset.sugg];state.data.habits.push({id:uid(),created:todayISO(),schedule:{kind:"daily",days:[1,2,3,4,5],times:3},step:1,unit:"",target:1,...s});save();render();toast(`«${s.name}» додано. Можна ще 1–2 або почати`);return}
  if(b.dataset.newhabit){habitForm();return}
  if(b.dataset.edit){habitForm(findH(b.dataset.edit));return}
  if(b.dataset.arch){const h=findH(b.dataset.arch);h.archived=!h.archived;save();render();toast(h.archived?"Поставлено на паузу. Історія збережена":"Звичка знову активна");return}
  if(b.dataset.delh){if(!b.classList.contains("armed")){b.classList.add("armed");b.textContent="Точно? Історія зникне";setTimeout(()=>{if(b.isConnected){b.classList.remove("armed");b.textContent="Видалити"}},3500);return}
    const id=b.dataset.delh;state.data.habits=state.data.habits.filter(x=>x.id!==id);for(const k in state.data.log)delete state.data.log[k][id];
    for(const p of state.data.photos.filter(p=>p.h===id))PhotoStore.del(p.id).catch(()=>{});state.data.photos=state.data.photos.filter(p=>p.h!==id);
    S().candies=S().candies.filter(c=>c.h!==id);save();render();toast("Звичку видалено");return}
  if(b.dataset.rest){if(REST_PER_MONTH-restUsed(d.slice(0,7))<=0)return;S().rest[d]=true;save();render();toast("Відпочинок — теж частина системи. Серії в безпеці");return}
  if(b.dataset.unrest){delete S().rest[d];save();render();return}
  if(b.dataset.dismiss){state.dismissed[b.dataset.dismiss]=true;render();return}
  if(b.dataset.opensum){const p=pendingSummary();if(p)openStory(p,p.key);return}
  if(b.dataset.story){const t=todayISO();const k=b.dataset.story;
    const P=k==="wcur"?periodWeek(weekStart(t)):k==="wprev"?periodWeek(addDays(weekStart(t),-7)):k==="mcur"?periodMonth(t.slice(0,7)):periodMonth(iso(new Date(parse(t).getFullYear(),parse(t).getMonth()-1,1)).slice(0,7));
    openStory(P,null);return}
  if(b.dataset.theme){S().theme=b.dataset.theme;applyTheme();save();render();return}
  if(b.dataset.calmode){state.calMode=b.dataset.calmode;render();return}
  if(b.id==="cPrev"||b.id==="cNext"){const [y,m]=state.calMonth.split("-").map(Number);const dt=new Date(y,m-1+(b.id==="cNext"?1:-1),1);state.calMonth=dt.getFullYear()+"-"+pad(dt.getMonth()+1);render();return}
  if(b.dataset.cell){dayDetails(b.dataset.cell);return}
  if(b.id==="bkSave"){exportBackup();return}
  if(b.id==="phExport"){exportPhotos();return}
  if(b.id==="phImportBtn"){photoImport.click();return}
});
document.getElementById("app").addEventListener("change",e=>{if(e.target.id==="bkFile"&&e.target.files[0]){importBackup(e.target.files[0]);e.target.value=""}});
document.querySelectorAll("nav.tabs button").forEach(b=>b.onclick=()=>{flushNote();state.moodOpen=false;state.tab=b.dataset.tab;if(b.dataset.tab==="today")state.sel=todayISO();render();window.scrollTo(0,0)});

/* ================= note autosave ================= */
let noteTimer=null;
function flushNote(){clearTimeout(noteTimer);const n=document.getElementById("moodNote");if(!n)return;const d=state.sel;const m=state.data.mood[d];const v=n.value.trim();
  if(!m){state.draftNote=n.value;return}if((m.note||"")!==v){m.note=v;save();const st=document.getElementById("noteStatus");if(st)st.textContent="Збережено"}}
document.getElementById("app").addEventListener("input",e=>{if(e.target.id!=="moodNote")return;const st=document.getElementById("noteStatus");
  if(st&&state.data.mood[state.sel])st.textContent="Зберігаю…";clearTimeout(noteTimer);noteTimer=setTimeout(flushNote,600)});
document.getElementById("app").addEventListener("focusout",e=>{if(e.target.id==="moodNote")flushNote()});
addEventListener("pagehide",flushNote);

/* ================= backup ================= */
async function exportBackup(){const name="zvychky-"+todayISO()+".json";const file=new File([JSON.stringify({app:"habits",version:3,exported:new Date().toISOString(),...state.data},null,1)],name,{type:"application/json"});
  try{if(navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({files:[file],title:name});
    else{const a=document.createElement("a");a.href=URL.createObjectURL(file);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}}
  catch(e){if(e&&e.name==="AbortError"){toast("Копію не збережено");return}}
  S().lastBackup=new Date().toISOString();save();render();toast("Копію створено. Збережіть її у «Файли»")}
async function importBackup(f){
  try{const d=JSON.parse(await f.text());if(d.app!=="habits"||!Array.isArray(d.habits))throw 0;
    const scale=(d.settings&&d.settings.moodScale)===10?1:2;
    const ids=new Set(state.data.habits.map(h=>h.id));for(const h of d.habits)if(!ids.has(h.id)){if(!h.icon)h.icon=EMOJI_TO_ICON[h.emoji]||"spark";state.data.habits.push(h)}
    for(const [k,v] of Object.entries(d.log||{}))state.data.log[k]={...v,...(state.data.log[k]||{})};
    for(const [k,v] of Object.entries(d.ts||{}))state.data.ts[k]={...v,...(state.data.ts[k]||{})};
    for(const [k,v] of Object.entries(d.mood||{}))if(!state.data.mood[k])state.data.mood[k]={...v,level:Math.min(10,Math.round(v.level*scale)),tags:(v.tags||[]).map(clean)};
    const pids=new Set(state.data.photos.map(p=>p.id));for(const p of (d.photos||[]))if(!pids.has(p.id))state.data.photos.push(p);
    const ds=d.settings||{};S().tags=[...new Set([...(S().tags||[]),...(ds.tags||[]).map(clean)])];S().rest={...(ds.rest||{}),...S().rest};
    const ck=new Set(S().candies.map(c=>c.h+":"+c.n));for(const c of (ds.candies||[]))if(!ck.has(c.h+":"+c.n))S().candies.push(c);
    save();render();toast("Дані відновлено. Фото відновіть окремо, якщо потрібно")}catch(e){toast("Це не файл копії трекера звичок")}}

/* ================= boot ================= */
load();applyTheme();save();
(function(){const st=S();const t=todayISO();if(st.lastOpen&&diffDays(st.lastOpen,t)>=3&&state.data.habits.length)state.welcome=true;st.lastOpen=t;save()})();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
render();
let lastDay=todayISO();
document.addEventListener("visibilitychange",()=>{if(document.hidden){flushNote();if(state.tab==="today"&&state.data.mood[state.sel]){state.moodOpen=false;render()}return}const t=todayISO();if(t!==lastDay){lastDay=t;state.sel=t;S().lastOpen=t;save();render()}});
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
