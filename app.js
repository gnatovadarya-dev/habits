"use strict";
const C=window.CONTENT;
/* ================= constants ================= */
const MOODS=[
  {v:1,e:"😢",l:"Погано",c:"var(--m1)",hex:"#C9CFEA"},{v:2,e:"😕",l:"Так собі",c:"var(--m2)",hex:"#D8C8F2"},{v:3,e:"😐",l:"Нормально",c:"var(--m3)",hex:"#FDE3A7"},
  {v:4,e:"🙂",l:"Добре",c:"var(--m4)",hex:"#FFC4DD"},{v:5,e:"😍",l:"Чудово",c:"var(--m5)",hex:"#FF97C6"}];
const BASE_TAGS=["😴 Сон","💼 Робота","💞 Люди","🏃‍♀️ Спорт","☁️ Погода","🩺 Самопочуття","🍰 Їжа","📚 Навчання","🏡 Дім","💸 Гроші"];
const EMOJIS=["💧","🚶‍♀️","📖","🇬🇧","🧘‍♀️","😴","📵","🍎","🏋️‍♀️","🥗","☕","🧴","🪥","💊","✍️","🎨","🎧","🌿","🧹","💸","🙏","❤️","🌞","⭐"];
const COLORS=["#FF8FC1","#C3AEF2","#8EDDC3","#FFC8A8","#A9D8FF","#FFE48A","#F7A1A1","#B9E58C"];
const SUGG=[
  {name:"Вода",emoji:"💧",type:"count",target:8,unit:"склянок",color:"#A9D8FF"},
  {name:"Прогулянка",emoji:"🚶‍♀️",type:"check",color:"#8EDDC3"},
  {name:"Читання",emoji:"📖",type:"count",target:20,unit:"хв",color:"#C3AEF2",step:5},
  {name:"Англійська",emoji:"🇬🇧",type:"check",color:"#FF8FC1"},
  {name:"Розтяжка",emoji:"🧘‍♀️",type:"check",color:"#FFC8A8"},
  {name:"Сон до 23:00",emoji:"😴",type:"check",color:"#C3AEF2"},
  {name:"Без телефону перед сном",emoji:"📵",type:"check",color:"#F7A1A1"},
  {name:"Фрукти",emoji:"🍎",type:"check",color:"#B9E58C"}];
const WD=["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];
const WD_FULL=["понеділок","вівторок","середа","четвер","п'ятниця","субота","неділя"];
const WD_ACC=["понеділок","вівторок","середу","четвер","п'ятницю","суботу","неділю"];
const MONTHS=["січень","лютий","березень","квітень","травень","червень","липень","серпень","вересень","жовтень","листопад","грудень"];
const MONTHS_G=["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"];
const REST_PER_MONTH=2;

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
function toast(m){const t=document.getElementById("toast");t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2600)}

/* ================= state ================= */
const KEY="habits-v1";
const DEFAULT_SETTINGS={tags:[],lastBackup:null,rest:{},seen:{},factDay:null,factIdx:null,candies:[],lastOpen:null,summarySeen:{}};
const state={tab:"today",sel:todayISO(),calMonth:todayISO().slice(0,7),calMode:"mood",welcome:false,dismissed:{},
  data:{habits:[],log:{},ts:{},mood:{},settings:{...DEFAULT_SETTINGS}}};
function load(){try{const r=JSON.parse(localStorage.getItem(KEY)||"null");if(r){state.data={...state.data,...r,settings:{...DEFAULT_SETTINGS,...(r.settings||{})}};state.data.ts=state.data.ts||{}}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.data))}catch(e){toast("Не вдалося зберегти: пам'ять браузера недоступна")}}
const S=()=>state.data.settings;

/* ================= habit logic ================= */
const active=()=>state.data.habits.filter(h=>!h.archived);
const findH=id=>state.data.habits.find(x=>x.id===id);
const val=(h,d)=>Number((state.data.log[d]||{})[h.id]||0);
const isDone=(h,d)=>h.type==="count"?val(h,d)>=h.target:val(h,d)>=1;
const isRest=d=>!!S().rest[d];
const isWeekly=h=>h.schedule?.kind==="weekly";
function planned(h,d){ // planned by schedule, ignoring rest days
  if(d<h.created)return false;const s=h.schedule||{kind:"daily"};
  if(s.kind==="days")return (s.days||[]).includes(dow(d));return true}
const scheduled=(h,d)=>planned(h,d)&&!isRest(d);
function weekCount(h,d){let n=0;const w=weekStart(d);for(let i=0;i<7;i++){const x=addDays(w,i);if(x>todayISO())break;if(isDone(h,x))n++}return n}
function streak(h){
  const t=todayISO();
  if(isWeekly(h)){let n=0,w=weekStart(t);if(weekCount(h,w)>=h.schedule.times)n++;w=addDays(w,-7);
    while(w>=weekStart(h.created)&&weekCount(h,w)>=h.schedule.times){n++;w=addDays(w,-7)}return {n,unit:plural(n,"тиждень","тижні","тижнів")}}
  let d=t,n=0;if(scheduled(h,d)&&!isDone(h,d))d=addDays(d,-1);
  while(d>=h.created){if(scheduled(h,d)){if(isDone(h,d))n++;else break}d=addDays(d,-1)}
  return {n,unit:plural(n,"день","дні","днів")};
}
function bestStreak(h){
  if(isWeekly(h))return streak(h).n;
  let best=0,cur=0;for(let d=h.created;d<=todayISO();d=addDays(d,1)){if(!scheduled(h,d))continue;if(isDone(h,d)){cur++;best=Math.max(best,cur)}else if(d<todayISO())cur=0}
  return best}
function rateRange(h,s,e){ // share of planned days done in [s,e]
  if(isWeekly(h)){let ok=0,tot=0;for(let w=weekStart(s);w<=e;w=addDays(w,7)){if(addDays(w,6)<h.created)continue;tot++;if(weekCount(h,w)>=h.schedule.times)ok++}return tot?ok/tot:null}
  let sch=0,dn=0;for(let d=s;d<=e;d=addDays(d,1)){if(!scheduled(h,d))continue;if(d===todayISO()&&!isDone(h,d))continue;sch++;if(isDone(h,d))dn++}
  return sch?dn/sch:null}
const dueOn=d=>active().filter(h=>scheduled(h,d)&&!(isWeekly(h)&&weekCount(h,d)>=h.schedule.times&&!isDone(h,d)));
function dayProgress(d){const list=dueOn(d);return {done:list.filter(h=>isDone(h,d)).length,total:list.length}}
const perfect=d=>{const p=dayProgress(d);return p.total>0&&p.done===p.total};
function schedText(h){const s=h.schedule||{kind:"daily"};if(s.kind==="days")return s.days.map(x=>WD[x-1]).join(", ");if(s.kind==="weekly")return s.times+" р. на тиждень";return "щодня"}
const restUsed=m=>Object.keys(S().rest).filter(d=>d.startsWith(m)).length;
const firstDate=()=>{const c=[...state.data.habits.map(h=>h.created),...Object.keys(state.data.mood),...Object.keys(state.data.log)].sort();return c[0]||todayISO()};

/* ================= engagement ================= */
function pickFresh(pool,key){ // no repeat within 14 days
  const seen=S().seen;const t=todayISO();
  const fresh=pool.map((x,i)=>i).filter(i=>{const k=key+":"+i;return !seen[k]||diffDays(seen[k],t)>14});
  const arr=fresh.length?fresh:pool.map((x,i)=>i);const i=arr[Math.floor(Math.random()*arr.length)];seen[key+":"+i]=t;return pool[i]}
function factOfDay(){const st=S();if(st.factDay===todayISO()&&st.factIdx!=null)return C.FACTS[st.factIdx];return null}
function unlockFact(){const st=S();if(st.factDay===todayISO())return factOfDay();
  const f=pickFresh(C.FACTS,"fact");st.factDay=todayISO();st.factIdx=C.FACTS.indexOf(f);return f}
function bannerFor(d){
  const t=todayISO();if(d!==t)return null;
  if(state.welcome&&!state.dismissed.welcome)return {id:"welcome",e:"💕",text:pickStable(C.WELCOME,t)};
  const sum=pendingSummary();if(sum&&!state.dismissed.sum)return {id:"sum",e:"📖",text:sum.label+" готовий! Погортайте свої досягнення",action:"Відкрити",open:sum};
  const y=addDays(t,-1);
  const missed=active().filter(h=>!isWeekly(h)&&h.created<=addDays(y,-1)&&scheduled(h,y)&&!isDone(h,y)&&scheduled(h,t)&&!isDone(h,t));
  if(missed.length&&!state.dismissed.never)return {id:"never",e:"🌱",text:pickStable(C.NEVER_TWICE,t+missed[0].id).replace("{h}",missed[0].name)};
  return null}
function checkMilestone(h,d){
  if(d!==todayISO()||isWeekly(h))return;const n=streak(h).n;if(!C.MILESTONES.includes(n))return;
  const st=S();if(st.candies.some(c=>c.h===h.id&&c.n===n))return;
  const idx=C.MILESTONES.indexOf(n);st.candies.push({h:h.id,n,d,e:C.CANDY[idx]});save();
  setTimeout(()=>{confetti();openSheet("Нова цукерка!",`<div class="celebrate" style="display:grid;gap:10px"><div class="ce">${C.CANDY[idx]}</div>
    <h2>${h.emoji} ${esc(h.name)}: ${n} ${plural(n,"день","дні","днів")} поспіль</h2><div style="font-weight:700">${esc(C.MILESTONE_TEXT[n]||"")}</div>
    <div class="muted small">Цукерка додана в колекцію на вкладці «Статистика» 🍬</div><button class="btn" id="celOk">Ура! 🎉</button></div>`,()=>{document.getElementById("celOk").onclick=closeSheet})},450);
}
function pendingSummary(){
  const t=todayISO(),d=dow(t),st=S().summarySeen;
  const dd=parse(t).getDate();
  if(dd<=3){const pm=iso(new Date(parse(t).getFullYear(),parse(t).getMonth()-1,1)).slice(0,7);const key="m"+pm;
    if(!st[key]&&daysWithData(pm+"-01",addDays(t,-dd))>=7)return {...periodMonth(pm),key}}
  if(d===7&&new Date().getHours()>=17){const ws=weekStart(t);const key="w"+ws;if(!st[key]&&daysWithData(ws,t)>=3)return {...periodWeek(ws),key}}
  if(d<=2){const ws=addDays(weekStart(t),-7);const key="w"+ws;if(!st[key]&&daysWithData(ws,addDays(ws,6))>=3)return {...periodWeek(ws),key}}
  return null}
function daysWithData(s,e){let n=0;for(let d=s;d<=e;d=addDays(d,1)){if(state.data.mood[d]||state.data.log[d])n++}return n}
function periodWeek(ws){const we=addDays(ws,6);const e=we>todayISO()?todayISO():we;return {label:"Ваш тиждень",title:`${human(ws)} – ${human(we)}`,s:ws,e,ps:addDays(ws,-7),pe:addDays(ws,-1),unit:"тиждень",unitG:"минулого тижня"}}
function periodMonth(m){const [y,mo]=m.split("-").map(Number);const s=m+"-01";const last=iso(new Date(y,mo,0));const e=last>todayISO()?todayISO():last;
  const pm=iso(new Date(y,mo-2,1));const pl=iso(new Date(y,mo-1,0));return {label:"Ваш місяць",title:MONTHS[mo-1]+" "+y,s,e,ps:pm,pe:pl,unit:"місяць",unitG:"минулого місяця"}}

/* ================= analysis ================= */
function cohen(a,b){if(a.length<2||b.length<2)return 0;const ma=mean(a),mb=mean(b);
  const va=a.reduce((s,x)=>s+(x-ma)**2,0)/(a.length-1),vb=b.reduce((s,x)=>s+(x-mb)**2,0)/(b.length-1);
  const sd=Math.sqrt(((a.length-1)*va+(b.length-1)*vb)/(a.length+b.length-2));return sd?(ma-mb)/sd:(ma===mb?0:Math.sign(ma-mb)*2)}
function strength(d){const x=Math.abs(d);if(x<0.2)return {l:"дуже слабкий",k:0};if(x<0.5)return {l:"слабкий",k:1};if(x<0.8)return {l:"помітний",k:2};return {l:"сильний",k:3}}
function strengthPP(pp){const x=Math.abs(pp);if(x<0.15)return {l:"слабкий",k:1};if(x<0.3)return {l:"помітний",k:2};return {l:"сильний",k:3}}
function habitMood(h,lag){ // lag 0: same day; 1: next day mood
  const yes=[],no=[];const t=todayISO();
  for(const [d0,m] of Object.entries(state.data.mood)){const d=lag?addDays(d0,-lag):d0;
    if(d<h.created||!(isWeekly(h)||scheduled(h,d)))continue;if(d===t&&!isDone(h,d))continue;(isDone(h,d)?yes:no).push(m.level)}
  return {yes,no,ok:yes.length>=5&&no.length>=3,d:cohen(yes,no),ay:mean(yes),an:mean(no)}}
function chains(){
  const hs=active().filter(h=>!isWeekly(h));const out=[];const t=todayISO();
  for(const A of hs)for(const B of hs){if(A===B)continue;let aY=0,aYB=0,aN=0,aNB=0;
    const s=A.created>B.created?A.created:B.created;
    for(let d=s;d<t;d=addDays(d,1)){if(!scheduled(A,d)||!scheduled(B,d))continue;if(isDone(A,d)){aY++;if(isDone(B,d))aYB++}else{aN++;if(isDone(B,d))aNB++}}
    if(aY>=7&&aN>=4){const p1=aYB/aY,p0=aNB/aN;if(p1-p0>=0.2)out.push({A,B,p1,p0,pp:p1-p0,n:aY+aN})}}
  return out.sort((a,b)=>b.pp-a.pp)}
function weekdayStats(){
  const mood=Array.from({length:7},()=>[]),comp=Array.from({length:7},()=>({s:0,d:0}));const t=todayISO();
  for(const [d,m] of Object.entries(state.data.mood))mood[dow(d)-1].push(m.level);
  const f=firstDate();for(let d=f;d<t;d=addDays(d,1)){const p=dayProgress(d);comp[dow(d)-1].s+=p.total;comp[dow(d)-1].d+=p.done}
  return mood.map((a,i)=>({m:a.length?mean(a):null,n:a.length,c:comp[i].s?comp[i].d/comp[i].s:null}))}
function tagStats(){const ts={};for(const m of Object.values(state.data.mood))for(const tg of (m.tags||[]))(ts[tg]=ts[tg]||[]).push(m.level);
  const all=mean(Object.values(state.data.mood).map(m=>m.level));
  return Object.entries(ts).filter(([,a])=>a.length>=3).map(([t,a])=>({t,a:mean(a),n:a.length,diff:mean(a)-all})).sort((x,y)=>y.a-x.a)}
function findings(){
  const F=[];const hs=active();
  for(const h of hs){
    const r=habitMood(h,0);if(r.ok&&Math.abs(r.d)>=0.3){const s=strength(r.d);F.push({score:Math.abs(r.d),k:s.k,s:s.l,e:h.emoji,
      text:r.d>0?`У дні з «${esc(h.name)}» настрій вищий: <b>${fmt(r.ay)}</b> проти <b>${fmt(r.an)}</b>`:`Цікаво: у дні з «${esc(h.name)}» настрій нижчий (${fmt(r.ay)} проти ${fmt(r.an)}). Можливо, вона забирає сили?`})}
    const l=habitMood(h,1);if(l.ok&&l.d>=0.3){const s=strength(l.d);F.push({score:Math.abs(l.d)*0.95,k:s.k,s:s.l,e:"⏭️",
      text:`Після «${esc(h.name)}» <b>наступний</b> день кращий: ${fmt(l.ay)} проти ${fmt(l.an)}`})}
  }
  for(const c of chains().slice(0,3)){const s=strengthPP(c.pp);F.push({score:c.pp*1.6,k:s.k,s:s.l,e:"🔗",
    text:`Коли виконуєте «${esc(c.A.name)}», «${esc(c.B.name)}» вдається у <b>${Math.round(c.p1*100)}%</b> днів (без неї — ${Math.round(c.p0*100)}%). Спробуйте робити їх разом`})}
  const wd=weekdayStats();const moodDays=Object.keys(state.data.mood).length;
  if(moodDays>=14){const v=wd.map((x,i)=>({...x,i})).filter(x=>x.n>=2&&x.m!=null);if(v.length>=4){v.sort((a,b)=>a.m-b.m);const lo=v[0],hi=v[v.length-1];
    if(hi.m-lo.m>=0.5)F.push({score:(hi.m-lo.m)*0.7,k:hi.m-lo.m>=1?3:2,s:hi.m-lo.m>=1?"сильний":"помітний",e:"📅",
      text:`Найважчий день тижня — <b>${WD_FULL[lo.i]}</b> (${fmt(lo.m)}), найлегший — <b>${WD_FULL[hi.i]}</b> (${fmt(hi.m)}). Заплануйте на ${WD_ACC[lo.i]} щось приємне`})}}
  const wc=wd.map((x,i)=>({...x,i})).filter(x=>x.c!=null);if(wc.length>=5){wc.sort((a,b)=>a.c-b.c);const lo=wc[0],hi=wc[wc.length-1];
    if(hi.c-lo.c>=0.2)F.push({score:(hi.c-lo.c)*1.2,k:hi.c-lo.c>=0.35?3:2,s:hi.c-lo.c>=0.35?"сильний":"помітний",e:"🗓️",
      text:`Звички найчастіше «злітають» у <b>${WD_ACC[lo.i]}</b> (${Math.round(lo.c*100)}%), а найкраще виходять у ${WD_ACC[hi.i]} (${Math.round(hi.c*100)}%)`})}
  const tg=tagStats();if(tg.length>=2){const lo=tg[tg.length-1],hi=tg[0];
    if(lo.diff<=-0.4)F.push({score:Math.abs(lo.diff)*0.8,k:lo.diff<=-0.8?3:2,s:lo.diff<=-0.8?"сильний":"помітний",e:"🏷️",text:`Дні з міткою «${esc(lo.t)}» найважчі: настрій ${fmt(lo.a)}`});
    if(hi.diff>=0.4)F.push({score:hi.diff*0.8,k:hi.diff>=0.8?3:2,s:hi.diff>=0.8?"сильний":"помітний",e:"🏷️",text:`«${esc(hi.t)}» — Ваш генератор гарного настрою: ${fmt(hi.a)}`})}
  const t=todayISO();const cur=avgCompletion(addDays(t,-6),t),prev=avgCompletion(addDays(t,-13),addDays(t,-7));
  if(cur!=null&&prev!=null&&Math.abs(cur-prev)>=0.1)F.push({score:Math.abs(cur-prev),k:Math.abs(cur-prev)>=0.25?3:2,s:Math.abs(cur-prev)>=0.25?"сильний":"помітний",e:cur>prev?"📈":"📉",
    text:cur>prev?`Останні 7 днів Ви виконуєте звички на <b>${Math.round((cur-prev)*100)} п.п.</b> частіше, ніж тиждень до того`:`Останні 7 днів звички виконуються на ${Math.round((prev-cur)*100)} п.п. рідше. Може, ціль завелика? Спробуйте мінімальну версію`});
  return F.sort((a,b)=>b.score-a.score)}
function avgCompletion(s,e){let tot=0,dn=0;for(let d=s;d<=e;d=addDays(d,1)){if(d===todayISO())continue;const p=dayProgress(d);tot+=p.total;dn+=p.done}return tot?dn/tot:null}
function checkins(s,e){let n=0;for(let d=s;d<=e;d=addDays(d,1))for(const h of state.data.habits)if(isDone(h,d))n++;return n}
function periodStats(P){
  const moods=[],pm=[],tags={};let perfectN=0,best=null;
  for(let d=P.s;d<=P.e;d=addDays(d,1)){const m=state.data.mood[d];if(m){moods.push(m.level);for(const t of (m.tags||[]))tags[t]=(tags[t]||0)+1}
    if(perfect(d))perfectN++;const p=dayProgress(d);const sc=p.done+(m?m.level/10:0);if(p.done&&(!best||sc>best.sc))best={d,sc,done:p.done,m}}
  for(let d=P.ps;d<=P.pe;d=addDays(d,1)){const m=state.data.mood[d];if(m)pm.push(m.level)}
  const topTag=Object.entries(tags).sort((a,b)=>b[1]-a[1])[0];
  const hr=active().map(h=>({h,r:rateRange(h,P.s<h.created?h.created:P.s,P.e)})).filter(x=>x.r!=null).sort((a,b)=>b.r-a.r);
  const candies=S().candies.filter(c=>c.d>=P.s&&c.d<=P.e);
  return {ci:checkins(P.s,P.e),pci:checkins(P.ps,P.pe),perfectN,best,mood:moods.length?mean(moods):null,pmood:pm.length?mean(pm):null,moodN:moods.length,topTag,top:hr[0],candies}}

/* ================= views ================= */
function greet(){const h=new Date().getHours();if(h<5)return "Доброї ночі";if(h<12)return "Доброго ранку";if(h<18)return "Доброго дня";return "Доброго вечора"}
function ringSVG(p){const R=32,Cc=2*Math.PI*R;return `<svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="${R}" fill="none" stroke="var(--sunk)" stroke-width="9"/>
  <circle cx="38" cy="38" r="${R}" fill="none" stroke="url(#gr)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${Cc*p} ${Cc}"/>
  <defs><linearGradient id="gr" x1="0" x2="1"><stop offset="0" stop-color="#FF8FC1"/><stop offset="1" stop-color="#8A6CD6"/></linearGradient></defs></svg>`}

function vToday(){
  const d=state.sel,t=todayISO(),isToday=d===t;const pr=dayProgress(d);const p=pr.total?pr.done/pr.total:0;const rest=isRest(d);
  const strip=[];for(let i=6;i>=0;i--){const x=addDays(t,-i);const m=state.data.mood[x];
    strip.push(`<button class="day" data-day="${x}" aria-pressed="${x===d}"><small>${WD[dow(x)-1]}</small>${parse(x).getDate()}<i>${m?MOODS[m.level-1].e:isRest(x)?"🛌":perfect(x)?"✨":""}</i></button>`)}
  const sub=rest?"День відпочинку 🛌":pr.total?(pr.done===pr.total?"Усе виконано! 🎉":`${pr.done} з ${pr.total} ${plural(pr.total,"звички","звичок","звичок")}`):"Звичок на цей день немає";
  let html=`<header class="hello"><div><div class="sub">${isToday?esc(greet())+", Дар'є 💕":human(d)}</div><h1>${isToday?"Як минає день?":"Редагуєте "+human(d)}</h1><div class="sub small">${sub}</div></div>
    <div class="ring" aria-label="Виконано ${Math.round(p*100)}%">${ringSVG(rest?1:p)}<b>${rest?"🛌":Math.round(p*100)+"%"}</b></div></header>
    <div class="days" role="group" aria-label="Останні 7 днів">${strip.join("")}</div>`;
  const bn=bannerFor(d);
  if(bn)html+=`<div class="banner"><span class="be">${bn.e}</span><span>${esc(bn.text)}${bn.action?` <button class="lnk" data-opensum="1">${bn.action} →</button>`:""}</span><button class="x" data-dismiss="${bn.id}" aria-label="Закрити">✕</button></div>`;
  if(!state.data.habits.length){
    html+=`<div class="card"><div class="empty"><div class="big-emo">🍭</div><h2>Почнімо з 1–3 звичок</h2><div class="muted small">Торкніться, щоб додати. Краще менше, але щодня.</div>
      <div class="sugg">${SUGG.map((s,i)=>`<button class="chip" data-sugg="${i}">${s.emoji} ${esc(s.name)}${s.type==="count"?" · "+s.target+" "+s.unit:""}</button>`).join("")}</div>
      <button class="btn sm soft" data-newhabit="1">＋ Своя звичка</button></div></div>`;
  }else{
    const list=active().filter(h=>planned(h,d));
    if(rest)html+=`<div class="card"><div class="row"><div><b>🛌 День відпочинку</b><div class="muted small">Серії в безпеці. Виконане сьогодні все одно зарахується.</div></div><button class="btn sm soft" data-unrest="1">Скасувати</button></div></div>`;
    html+=`<div class="habits">${list.map(h=>habitCard(h,d)).join("")||`<div class="card empty"><div class="big-emo">☁️</div><div class="muted">На цей день звичок не заплановано. Відпочивайте!</div></div>`}</div>`;
  }
  const f=isToday?factOfDay():null;
  if(f)html+=`<div class="card fact"><b>✨ Факт дня</b><div style="font-weight:600">${esc(f.t)}</div><div class="src">Джерело: ${esc(f.s)}</div></div>`;
  else if(isToday&&pr.total&&!rest)html+=`<div class="muted small" style="text-align:center;font-weight:700">🔒 Виконайте всі звички, щоб відкрити факт дня</div>`;
  const m=state.data.mood[d]||{};const tags=[...BASE_TAGS,...(S().tags||[])];const prompt=pickStable(C.PROMPTS,"p"+d);
  html+=`<div class="card" id="moodCard"><h2>${isToday?"Як Ви сьогодні?":"Настрій "+human(d)}</h2>
    <div class="moods" role="group" aria-label="Настрій">${MOODS.map(x=>`<button class="mood" style="--mc:${x.c}" data-mood="${x.v}" aria-pressed="${m.level===x.v}" aria-label="${x.l}">${x.e}<small>${x.l}</small></button>`).join("")}</div>
    <div class="muted small" style="font-weight:700">Що вплинуло?</div>
    <div class="chips">${tags.map(tg=>`<button class="chip" data-tag="${esc(tg)}" aria-pressed="${(m.tags||[]).includes(tg)}">${esc(tg)}</button>`).join("")}<button class="chip add" data-addtag="1">＋ своя</button></div>
    <label class="f" for="moodNote">💭 ${esc(prompt)}<textarea id="moodNote" maxlength="800" placeholder="Кілька слів — уже достатньо">${esc(m.note||"")}</textarea></label>
    <div class="row"><span class="muted small">${m.level?"Збережено ✓":"Оберіть смайлик, щоб зберегти"}</span><button class="btn sm" id="saveNote" ${m.level?"":"disabled"}>Зберегти запис</button></div></div>`;
  if(state.data.habits.length&&!rest&&pr.total&&pr.done<pr.total){const left=REST_PER_MONTH-restUsed(d.slice(0,7));
    html+=`<div class="restline"><button class="lnk" data-rest="1" ${left>0?"":"disabled"}>🛌 Взяти день відпочинку (${left>0?"лишилось "+left:"цього місяця вже використано"})</button></div>`}
  return html;
}
function habitCard(h,d){
  const done=isDone(h,d);const st=streak(h);const v=val(h,d);
  const fill=h.type==="count"?Math.min(1,v/h.target):(done?1:0);
  const wk=isWeekly(h)?` · ${weekCount(h,d)}/${h.schedule.times} цього тижня`:"";
  const next=C.MILESTONES.find(x=>x>st.n);
  const meta=(st.n?`🔥 ${st.n} ${st.unit}`:"почніть серію")+wk+(!isWeekly(h)&&st.n&&next&&next-st.n<=2?` · ще ${next-st.n} до 🍬`:"");
  const ctrl=h.type==="count"
    ?`<div class="cnt"><button data-dec="${h.id}" aria-label="Мінус">−</button><span>${v}/${h.target}</span><button data-inc="${h.id}" aria-label="Плюс">＋</button></div>`
    :`<button class="chk ${done?"on":""}" data-toggle="${h.id}" aria-pressed="${done}" aria-label="Виконано">${done?"✓":""}</button>`;
  return `<div class="habit ${done?"done":""}" id="h-${h.id}" style="--hc:${h.color}"><div class="fill" style="width:${fill*100}%"></div>
    <div class="emo">${h.emoji}</div><div class="t"><b>${esc(h.name)}</b><small>${h.type==="count"?esc(h.unit)+" · ":""}${meta}</small></div>${ctrl}</div>`;
}

function vCal(){
  const [y,mo]=state.calMonth.split("-").map(Number);const first=new Date(y,mo-1,1);const dim=new Date(y,mo,0).getDate();
  const off=(first.getDay()+6)%7;const t=todayISO();const mode=state.calMode;const h=findH(mode);
  let cells=WD.map(w=>`<div class="wd">${w}</div>`).join("")+"<div></div>".repeat(off);
  for(let i=1;i<=dim;i++){const d=`${y}-${pad(mo)}-${pad(i)}`;let bg="var(--bg)",e="";
    if(mode==="mood"){const m=state.data.mood[d];if(m){bg=MOODS[m.level-1].c;e=MOODS[m.level-1].e}else if(isRest(d))e="🛌";else if(d<=t&&perfect(d))e="✨"}
    else if(h){if(isDone(h,d)){bg=h.color;e=h.emoji}else if(isRest(d))e="🛌";else if(scheduled(h,d)&&d<t&&!isWeekly(h))bg="var(--sunk)"}
    cells+=`<button class="cell ${d===t?"today":""} ${d>t?"future":""}" style="background:${bg}" data-cell="${d}" ${d>t?"disabled":""} aria-label="${human(d)}">${i}<span class="e">${e}</span></button>`}
  const modes=`<div class="chips"><button class="chip" data-calmode="mood" aria-pressed="${mode==="mood"}">💗 Настрій</button>${active().map(x=>`<button class="chip" data-calmode="${x.id}" aria-pressed="${mode===x.id}">${x.emoji} ${esc(x.name)}</button>`).join("")}</div>`;
  const legend=mode==="mood"?`<div class="legend">${MOODS.map(x=>`<span><i style="background:${x.c}"></i>${x.l}</span>`).join("")}<span>✨ ідеальний день</span><span>🛌 відпочинок</span></div>`
    :`<div class="legend"><span><i style="background:${h?.color}"></i>виконано</span><span><i style="background:var(--sunk)"></i>пропущено</span></div>`;
  // month summary
  const ms=state.calMonth+"-01",me=iso(new Date(y,mo,0))>t?t:iso(new Date(y,mo,0));
  let monthLine="";if(ms<=t){const P={s:ms,e:me,ps:ms,pe:ms};const st=periodStats(P);
    monthLine=`<div class="nums"><span>✅ <b>${st.ci}</b> виконань</span><span>✨ <b>${st.perfectN}</b> ідеальних днів</span>${st.mood!=null?`<span>${MOODS[Math.round(st.mood)-1].e} настрій <b>${fmt(st.mood)}</b></span>`:""}</div>`}
  return `<header class="hello" style="grid-template-columns:1fr"><h1>Календар</h1></header>${modes}
  <div class="card"><div class="cal-head"><button class="ibtn" id="cPrev" aria-label="Попередній місяць">‹</button><h2>${MONTHS[mo-1]} ${y}</h2><button class="ibtn" id="cNext" aria-label="Наступний місяць">›</button></div>
  <div class="cal">${cells}</div>${legend}${monthLine}<div class="muted small">Торкніться дня, щоб переглянути або змінити записи.</div></div>`;
}

function moodChart(){
  const pts=[];for(let i=29;i>=0;i--){const d=addDays(todayISO(),-i);const m=state.data.mood[d];pts.push({i:29-i,d,v:m?m.level:null})}
  const have=pts.filter(p=>p.v);if(have.length<2)return `<div class="note">Відмітьте настрій хоча б 2 дні — і тут з'явиться графік 🌈</div>`;
  const W=320,H=150,L=28,R=8,T=10,B=22;const x=i=>L+(W-L-R)*i/29;const y=v=>T+(H-T-B)*(5-v)/4;
  let g="";for(let v=1;v<=5;v++)g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#F6D7E7" stroke-dasharray="3 4"/><text x="${L-6}" y="${y(v)+5}" text-anchor="end" font-size="13">${MOODS[v-1].e}</text>`;
  const path=have.map((p,k)=>(k?"L":"M")+x(p.i).toFixed(1)+" "+y(p.v).toFixed(1)).join(" ");
  const area=path+` L${x(have[have.length-1].i).toFixed(1)} ${H-B} L${x(have[0].i).toFixed(1)} ${H-B} Z`;
  const last=have[have.length-1];
  const dots=have.map(p=>`<circle cx="${x(p.i)}" cy="${y(p.v)}" r="${p===last?5:3.5}" fill="${p===last?"#D9478A":"#FF8FC1"}" stroke="#fff" stroke-width="1.5"/>`).join("");
  const lab=[0,14,29].map(i=>`<text x="${x(i)}" y="${H-5}" text-anchor="${i===0?"start":i===29?"end":"middle"}" font-size="10" fill="#9A7290" font-weight="700">${human(pts[i].d)}</text>`).join("");
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Настрій за 30 днів" font-family="Nunito,sans-serif">
    <defs><linearGradient id="ar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FF8FC1" stop-opacity=".35"/><stop offset="1" stop-color="#C3AEF2" stop-opacity="0"/></linearGradient></defs>
    ${g}<path d="${area}" fill="url(#ar)"/><path d="${path}" fill="none" stroke="#FF8FC1" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${lab}</svg></div>`;
}
function yearMap(){
  const t=todayISO();const end=t;const start=addDays(weekStart(t),-7*25);const cols=26;const cs=11,gap=3;
  const W=24+cols*(cs+gap),H=7*(cs+gap)+16;let r="";
  for(let c=0;c<cols;c++)for(let k=0;k<7;k++){const d=addDays(start,c*7+k);if(d>end)continue;const p=dayProgress(d);
    let fill="#FCE8F2";if(isRest(d))fill="#E9E2F5";else if(p.total){const q=p.done/p.total;fill=q===0?"#FCE8F2":q<0.5?"#FFD1E6":q<1?"#FFA6CE":"#E8559A"}
    r+=`<rect x="${24+c*(cs+gap)}" y="${k*(cs+gap)}" width="${cs}" height="${cs}" rx="3" fill="${fill}"><title>${human(d)}: ${p.done}/${p.total}</title></rect>`}
  const ml=[];for(let c=0;c<cols;c+=4){const d=addDays(start,c*7);ml.push(`<text x="${24+c*(cs+gap)}" y="${H-2}" font-size="10" fill="#9A7290" font-weight="700">${MONTHS_G[parse(d).getMonth()].slice(0,3)}</text>`)}
  const wl=[0,2,4].map(k=>`<text x="0" y="${k*(cs+gap)+cs-1}" font-size="9" fill="#9A7290" font-weight="700">${WD[k]}</text>`).join("");
  return `<div class="year"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Nunito,sans-serif" role="img" aria-label="Карта виконання за пів року">${wl}${r}${ml.join("")}</svg></div>
   <div class="legend"><span><i style="background:#FCE8F2"></i>0%</span><span><i style="background:#FFD1E6"></i>&lt;50%</span><span><i style="background:#FFA6CE"></i>50–99%</span><span><i style="background:#E8559A"></i>100%</span><span><i style="background:#E9E2F5"></i>відпочинок</span></div>`}

function vStats(){
  const hs=active();const t=todayISO();const F=findings();const moodN=Object.keys(state.data.mood).length;
  const startD=firstDate();const tracked=diffDays(startD,t)+1;
  let html=`<header class="hello" style="grid-template-columns:1fr"><h1>Статистика</h1><div class="sub">Ви з трекером уже ${tracked} ${plural(tracked,"день","дні","днів")} 🌸</div></header>
  <div class="sumchips"><button class="chip" data-story="wcur">📖 Цей тиждень</button><button class="chip" data-story="wprev">Минулий тиждень</button><button class="chip" data-story="mcur">🗓️ Цей місяць</button><button class="chip" data-story="mprev">Минулий місяць</button></div>`;
  // insights
  html+=`<div class="card"><h2>💡 Інсайти</h2>${F.length?F.slice(0,4).map(f=>`<div class="insight"><div class="ie">${f.e}</div><div><span class="pill s${f.k}">зв'язок: ${f.s}</span><p>${f.text}</p></div></div>`).join("")+
    `<div class="note">Це збіги в часі, а не докази причини. Але вони добре підказують, що варто спробувати.</div>`
    :`<div class="note">🔮 Тут з'являться знахідки: що піднімає настрій, які звички тягнуть за собою інші, які дні найважчі. Потрібно приблизно 2 тижні записів. Зараз днів з настроєм: <b>${moodN}</b>${moodN<14?`, ще ~${14-moodN}`:""}.</div>`}</div>`;
  // records
  let bestS={n:0,h:null};for(const h of state.data.habits){const b=bestStreak(h);if(!isWeekly(h)&&b>bestS.n)bestS={n:b,h}}
  let perfectN=0;for(let d=startD;d<=t;d=addDays(d,1))if(perfect(d))perfectN++;
  const total=checkins(startD,t);const happy=Object.values(state.data.mood).filter(m=>m.level===5).length;
  html+=`<div class="card"><h2>🏆 Особисті рекорди</h2><div class="tiles">
    <div class="tile"><b>${total}</b><span>виконань загалом</span></div>
    <div class="tile"><b>${bestS.n}${bestS.h?" "+bestS.h.emoji:""}</b><span>найдовша серія, ${plural(bestS.n,"день","дні","днів")}</span></div>
    <div class="tile"><b>${perfectN} ✨</b><span>ідеальних днів</span></div>
    <div class="tile"><b>${happy} 😍</b><span>${plural(happy,"день","дні","днів")} з настроєм «чудово»</span></div></div></div>`;
  // mood
  const md=Object.entries(state.data.mood).filter(([d])=>d>addDays(t,-30)).map(([,m])=>m.level);const avg=mean(md);
  html+=`<div class="card"><div class="row"><h2>💗 Настрій за 30 днів</h2>${md.length?`<b style="font-size:20px">${MOODS[Math.round(avg)-1].e} ${fmt(avg)}</b>`:""}</div>${moodChart()}</div>`;
  // weekdays
  const wd=weekdayStats();if(moodN>=7||wd.some(x=>x.c!=null)){
    html+=`<div class="card"><h2>📅 Дні тижня</h2><div class="muted small" style="font-weight:700">Настрій (рожеве) і виконання звичок (лавандове)</div><div style="display:grid;gap:6px">${wd.map((x,i)=>`
      <div class="wk"><span>${WD[i]}</span><div style="display:grid;gap:3px"><div class="cmp"><div class="track"><i style="width:${x.m?x.m/5*100:0}%;background:var(--pink)"></i></div></div><div class="cmp"><div class="track" style="height:8px"><i style="width:${x.c!=null?x.c*100:0}%;background:var(--lav)"></i></div></div></div>
      <span style="text-align:right">${x.m?MOODS[Math.round(x.m)-1].e:"–"}</span></div>`).join("")}</div></div>`}
  // habits
  html+=`<div class="card"><h2>🌸 Звички</h2>${hs.length?hs.map(h=>{const st=streak(h);const r=rateRange(h,addDays(t,-29)<h.created?h.created:addDays(t,-29),t);
    const cells=[];for(let i=29;i>=0;i--){const d=addDays(t,-i);cells.push(`<i style="background:${isDone(h,d)?h.color:(scheduled(h,d)&&!isWeekly(h)&&d<t?"var(--sunk)":"transparent")}" title="${human(d)}"></i>`)}
    const tod=timeOfDay(h);
    return `<div class="hstat"><div class="emo" style="background:color-mix(in srgb,${h.color} 30%,white)">${h.emoji}</div><div style="min-width:0"><b>${esc(h.name)}</b>
    <div class="nums"><span>🔥 <b>${st.n}</b> ${st.unit}</span><span>🏆 рекорд <b>${bestStreak(h)}</b></span>${r!=null?`<span>✅ <b>${Math.round(r*100)}%</b> за 30 днів</span>`:""}${tod?`<span>⏰ ${tod}</span>`:""}</div>
    <div class="strip">${cells.join("")}</div></div></div>`}).join(""):`<div class="note">Додайте звичку на вкладці «Сьогодні» 🌸</div>`}</div>`;
  // habit -> mood
  const rows=hs.map(h=>({h,a:habitMood(h,0),b:habitMood(h,1)}));const ready=rows.filter(r=>r.a.ok||r.b.ok);
  html+=`<div class="card"><h2>🔍 Звички й настрій</h2>${ready.length?`<div class="cmp">${ready.map(({h,a,b})=>`
      <div style="font-weight:800;margin-top:4px">${h.emoji} ${esc(h.name)} ${a.ok?`<span class="pill s${strength(a.d).k}">${strength(a.d).l}</span>`:""}</div>
      ${a.ok?`<div class="bar"><span>✓ цього дня</span><div class="track"><i style="width:${a.ay/5*100}%;background:${h.color}"></i></div><b>${fmt(a.ay)}</b></div>
      <div class="bar"><span>✗ цього дня</span><div class="track"><i style="width:${a.an/5*100}%;background:var(--m1)"></i></div><b>${fmt(a.an)}</b></div>`:""}
      ${b.ok?`<div class="bar"><span>✓ наступного</span><div class="track"><i style="width:${b.ay/5*100}%;background:${h.color}"></i></div><b>${fmt(b.ay)}</b></div>
      <div class="bar"><span>✗ наступного</span><div class="track"><i style="width:${b.an/5*100}%;background:var(--m1)"></i></div><b>${fmt(b.an)}</b></div>`:""}`).join("")}</div>
      <div class="note">✓ — звичку виконано, ✗ — пропущено. Середній настрій від 1 до 5. «Наступного» показує відкладений ефект: наприклад, як ранній сон впливає на завтра.</div>`
    :`<div class="note">Потрібно щонайменше 5 днів, коли звичку виконано, і 3, коли пропущено, з відміченим настроєм.</div>`}</div>`;
  // chains
  const ch=chains();if(hs.filter(h=>!isWeekly(h)).length>=2)html+=`<div class="card"><h2>🔗 Ланцюжки звичок</h2>${ch.length?ch.slice(0,4).map(c=>`<div class="insight"><div class="ie">${c.A.emoji}→${c.B.emoji}</div><div><span class="pill s${strengthPP(c.pp).k}">${strengthPP(c.pp).l}</span>
      <p>Після «${esc(c.A.name)}» «${esc(c.B.name)}» вдається у ${Math.round(c.p1*100)}% днів, без неї — у ${Math.round(c.p0*100)}%</p></div></div>`).join("")+`<div class="note">💡 Прив'яжіть другу звичку до першої: «після прогулянки — склянка води». Це називають нанизуванням звичок.</div>`
    :`<div class="note">Коли накопичиться ~2 тижні даних, тут з'явиться, які звички «тягнуть» за собою інші.</div>`}</div>`;
  // tags
  const tg=tagStats();if(tg.length)html+=`<div class="card"><h2>🏷️ Що впливає на настрій</h2><div class="cmp">${tg.slice(0,8).map(x=>`<div class="bar"><span>${esc(x.t)}</span><div class="track"><i style="width:${x.a/5*100}%;background:${MOODS[Math.round(x.a)-1].c}"></i></div><b>${fmt(x.a)}</b></div>`).join("")}</div><div class="note">Середній настрій у дні з цією міткою (мітки, що трапилися 3+ рази).</div></div>`;
  // year
  html+=`<div class="card"><h2>🗺️ Пів року одним поглядом</h2>${yearMap()}</div>`;
  // candies
  const got=S().candies;
  html+=`<div class="card"><h2>🍬 Колекція цукерок</h2><div class="muted small" style="font-weight:700">Віхи серій: ${C.MILESTONES.join(", ")} днів поспіль</div><div class="candies">${C.MILESTONES.map((n,i)=>{const c=got.filter(x=>x.n===n);
    return `<div class="candy ${c.length?"":"locked"}"><span>${C.CANDY[i]}</span>${n} ${plural(n,"день","дні","днів")}${c.length?`<br>${c.map(x=>findH(x.h)?.emoji||"").join("")}`:""}</div>`}).join("")}</div></div>`;
  return html;
}
function timeOfDay(h){const hrs=[];for(const [d,m] of Object.entries(state.data.ts))if(m[h.id]!=null)hrs.push(m[h.id]);if(hrs.length<5)return "";
  const b={"вранці":0,"вдень":0,"ввечері":0,"вночі":0};for(const x of hrs){if(x>=5&&x<12)b["вранці"]++;else if(x<17&&x>=12)b["вдень"]++;else if(x>=17&&x<23)b["ввечері"]++;else b["вночі"]++}
  const top=Object.entries(b).sort((a,c)=>c[1]-a[1])[0];return "найчастіше "+top[0]}

function vSet(){
  const hs=state.data.habits;const act=active();
  return `<header class="hello" style="grid-template-columns:1fr"><h1>Налаштування</h1></header>
  <div class="card"><div class="row"><h2>Мої звички</h2><button class="btn sm" data-newhabit="1">＋ Додати</button></div>
    ${act.length>5?`<div class="note">💡 У Вас ${act.length} активних звичок. Найчастіше трекери кидають через перевантаження. Можливо, щось варто поставити на паузу?</div>`:""}
    ${hs.length?hs.map(h=>`<div class="list-item" style="${h.archived?"opacity:.55":""}"><div class="emo" style="background:color-mix(in srgb,${h.color} 30%,white)">${h.emoji}</div>
      <div style="min-width:0"><b style="overflow-wrap:anywhere">${esc(h.name)}</b><div class="muted small">${h.type==="count"?h.target+" "+esc(h.unit)+" · ":""}${schedText(h)}${h.archived?" · на паузі":""}</div></div>
      <div style="display:grid;justify-items:end"><button class="lnk" data-edit="${h.id}">Змінити</button><button class="lnk" data-arch="${h.id}">${h.archived?"Відновити":"Пауза"}</button><button class="lnk danger" data-delh="${h.id}">Видалити</button></div></div>`).join("")
    :`<div class="muted">Звичок ще немає.</div>`}</div>
  <div class="card"><h2>⏰ Нагадування</h2><div class="muted small">Застосунок без сервера не може сам надсилати сповіщення. Але iPhone уміє відкривати його за розкладом:</div>
    <ol class="steps"><li>Відкрийте програму <b>«Команди»</b> → вкладка <b>«Автоматизація»</b> → <b>＋</b>.</li><li>Виберіть <b>«Час доби»</b>, наприклад 21:00, <b>Щодня</b>, і <b>«Запускати одразу»</b>.</li>
    <li>Дія: <b>«Відкрити URL»</b> → <b>gnatovadarya-dev.github.io/habits/</b> → <b>Готово</b>.</li></ol></div>
  <div class="card"><h2>🛌 Дні відпочинку</h2><div class="muted small">${REST_PER_MONTH} дні на місяць, які не обривають серії. Беріть їх, коли хворієте, подорожуєте чи просто видихаєте. Кнопка — внизу вкладки «Сьогодні».</div>
    <div class="small">Цього місяця використано: <b>${restUsed(todayISO().slice(0,7))} з ${REST_PER_MONTH}</b></div></div>
  <div class="card"><h2>💾 Резервна копія</h2><div class="note">Записи живуть лише на цьому телефоні. Раз на 1–2 тижні зберігайте копію у «Файли» або iCloud.</div>
    <div class="small">Остання копія: <b>${S().lastBackup?new Date(S().lastBackup).toLocaleDateString("uk-UA"):"ще не робили"}</b></div>
    <div class="grid2"><button class="btn" id="bkSave">Зберегти</button><label class="btn soft" for="bkFile" style="text-align:center">Відновити</label></div>
    <input id="bkFile" type="file" accept=".json,application/json" hidden></div>
  <div class="card"><h2>📚 Звідки факти</h2><div class="muted small">Усі ${C.FACTS.length} фактів у застосунку взяті з наукових досліджень. Джерело вказане під кожним фактом дня.</div></div>`;
}

/* ================= story (weekly / monthly summary) ================= */
function buildStory(P){
  const st=periodStats(P);const cards=[];const F=findings();
  cards.push({e:"📖",t:P.label,p:P.title,s:"Торкайтеся праворуч, щоб гортати 👉"});
  const dlt=st.ci-st.pci;
  cards.push({e:"✅",n:st.ci,t:plural(st.ci,"виконання звички","виконання звичок","виконань звичок"),
    p:st.pci?(dlt>0?`На ${dlt} більше, ніж ${P.unitG}! Ви ростете 📈`:dlt<0?`На ${-dlt} менше, ніж ${P.unitG}. Буває. Головне — не зупинятися 🌱`:`Стабільно, як і ${P.unitG}. Стабільність — суперсила 💪`):"Перший підсумок — точка відліку для наступних 🌱"});
  if(st.perfectN)cards.push({e:"✨",n:st.perfectN,t:plural(st.perfectN,"ідеальний день","ідеальні дні","ідеальних днів"),p:"Дні, коли виконано все заплановане"});
  if(st.top&&st.top.r>0)cards.push({e:st.top.h.emoji,n:Math.round(st.top.r*100)+"%",t:"Зірка "+(P.unit==="тиждень"?"тижня":"місяця")+": "+st.top.h.name,p:st.top.r>=1?"Без жодного пропуску. Ця звичка вже Ваша 💖":st.top.r>=0.9?"Майже без пропусків 💖":"Найстабільніша з Ваших звичок"});
  if(st.best)cards.push({e:st.best.m?MOODS[st.best.m.level-1].e:"🌟",t:"Найкращий день: "+human(st.best.d),p:`${st.best.done} ${plural(st.best.done,"звичка","звички","звичок")}${st.best.m?" і настрій «"+MOODS[st.best.m.level-1].l.toLowerCase()+"»":""}`+(st.best.m&&st.best.m.note?`. Ви записали: «${st.best.m.note.slice(0,90)}${st.best.m.note.length>90?"…":""}»`:"")});
  if(st.mood!=null){const dm=st.pmood!=null?st.mood-st.pmood:null;
    cards.push({e:MOODS[Math.round(st.mood)-1].e,n:fmt(st.mood),t:"середній настрій",p:(dm!=null&&Math.abs(dm)>=0.2?(dm>0?`На ${fmt(dm)} вище, ніж ${P.unitG} 🌷`:`На ${fmt(-dm)} нижче, ніж ${P.unitG}. Будьте до себе лагідні 🤍`):"")+(st.topTag?` Найчастіша мітка: ${st.topTag[0]}`:"")})}
  if(st.candies.length)cards.push({e:st.candies.map(c=>c.e).join(""),n:st.candies.length,t:plural(st.candies.length,"нова цукерка","нові цукерки","нових цукерок"),p:st.candies.map(c=>(findH(c.h)?.emoji||"")+" "+c.n+" "+plural(c.n,"день","дні","днів")).join(" · ")});
  if(F[0])cards.push({e:"💡",t:"Головна знахідка",p:F[0].text.replace(/<[^>]+>/g,""),s:"Зв'язок: "+F[0].s});
  const f=C.FACTS[hash(P.s)%C.FACTS.length];
  cards.push({e:"🌱",t:"Новий "+(P.unit==="тиждень"?"тиждень":"місяць")+" — новий старт",p:f.t,s:f.s});
  return cards}
function openStory(P,key){
  const cards=buildStory(P);let i=0;const root=document.getElementById("storyRoot");
  const draw=()=>{const c=cards[i];root.innerHTML=`<div class="story" role="dialog" aria-modal="true" aria-label="${esc(P.label)}">
    <div class="top"><div class="bars">${cards.map((x,k)=>`<i class="${k<=i?"on":""}"></i>`).join("")}</div><button class="close" id="stClose" aria-label="Закрити">✕</button></div>
    <div class="body" key="${i}">${c.e?`<div class="se">${c.e}</div>`:""}${c.n!=null?`<div class="sn">${esc(c.n)}</div>`:""}<div class="st">${esc(c.t)}</div>${c.p?`<div class="sp">${esc(c.p)}</div>`:""}${c.s?`<div class="ss">${esc(c.s)}</div>`:""}</div>
    <div class="hint">${i+1} / ${cards.length}${i===cards.length-1?" · торкніться, щоб закрити":""}</div>
    <button class="tapl" aria-label="Назад"></button><button class="tapr" aria-label="Далі"></button></div>`;
    root.querySelector("#stClose").onclick=close;root.querySelector(".tapl").onclick=()=>{if(i>0){i--;draw()}};
    root.querySelector(".tapr").onclick=()=>{if(i<cards.length-1){i++;draw()}else close()}};
  const close=()=>{root.innerHTML="";if(key){S().summarySeen[key]=todayISO();save()}render()};
  draw();
}

/* ================= render ================= */
function render(){
  const app=document.getElementById("app");const sc=window.scrollY;
  app.innerHTML={today:vToday,cal:vCal,stats:vStats,set:vSet}[state.tab]();
  document.querySelectorAll("nav.tabs button").forEach(b=>b.dataset.tab===state.tab?b.setAttribute("aria-current","page"):b.removeAttribute("aria-current"));
  window.scrollTo(0,sc);
}

/* ================= sheet ================= */
const sheet=document.getElementById("sheet");
function openSheet(title,html,mount){document.getElementById("sheetTitle").textContent=title;document.getElementById("sheetBody").innerHTML=html;sheet.hidden=false;mount&&mount()}
const closeSheet=()=>{sheet.hidden=true};
document.getElementById("sheetClose").onclick=closeSheet;
sheet.onclick=e=>{if(e.target===sheet)closeSheet()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSheet();const r=document.getElementById("storyRoot");if(r.innerHTML){r.innerHTML="";render()}}});

function habitForm(h){
  const isNew=!h;h=h?structuredClone(h):{name:"",emoji:"💧",color:COLORS[0],type:"check",target:8,unit:"склянок",step:1,schedule:{kind:"daily",days:[1,2,3,4,5],times:3}};
  h.schedule={kind:"daily",days:[1,2,3,4,5],times:3,...h.schedule};
  const draw=()=>{
    const body=document.getElementById("sheetBody");
    body.innerHTML=`
    <label class="f" for="hName">Назва<input id="hName" maxlength="40" value="${esc(h.name)}" placeholder="Наприклад: Вода, Розтяжка"></label>
    <div class="f">Смайлик<div class="emojis">${EMOJIS.map(e=>`<button type="button" data-emo="${e}" aria-pressed="${e===h.emoji}">${e}</button>`).join("")}</div></div>
    <div class="f">Колір<div class="colors">${COLORS.map(c=>`<button type="button" style="--c:${c}" data-col="${c}" aria-pressed="${c===h.color}" aria-label="Колір ${c}"></button>`).join("")}</div></div>
    <div class="f">Тип<div class="seg"><button type="button" data-type="check" aria-pressed="${h.type==="check"}">✓ Так / ні</button><button type="button" data-type="count" aria-pressed="${h.type==="count"}">🔢 Кількість</button></div></div>
    ${h.type==="count"?`<div class="grid2"><label class="f" for="hTarget">Ціль на день<input id="hTarget" type="number" inputmode="numeric" min="1" value="${h.target}"></label><label class="f" for="hUnit">Одиниця<input id="hUnit" maxlength="15" value="${esc(h.unit)}"></label></div>
      <label class="f" for="hStep">Крок кнопки «＋»<input id="hStep" type="number" inputmode="numeric" min="1" value="${h.step||1}"></label>`:""}
    <div class="f">Коли<div class="seg"><button type="button" data-kind="daily" aria-pressed="${h.schedule.kind==="daily"}">Щодня</button><button type="button" data-kind="days" aria-pressed="${h.schedule.kind==="days"}">Дні тижня</button><button type="button" data-kind="weekly" aria-pressed="${h.schedule.kind==="weekly"}">N разів/тиж</button></div></div>
    ${h.schedule.kind==="days"?`<div class="wdays">${WD.map((w,i)=>`<button type="button" data-wd="${i+1}" aria-pressed="${h.schedule.days.includes(i+1)}">${w}</button>`).join("")}</div>`:""}
    ${h.schedule.kind==="weekly"?`<label class="f" for="hTimes">Скільки разів на тиждень<input id="hTimes" type="number" inputmode="numeric" min="1" max="7" value="${h.schedule.times}"></label>`:""}
    <div class="note">💡 Порада з досліджень: план «якщо… то…» допомагає. Наприклад: «Якщо 21:00 — то розтяжка».</div>
    <button class="btn" id="hSave">${isNew?"Додати звичку":"Зберегти"}</button>`;
    const keep=()=>{const g=id=>document.getElementById(id);if(g("hName"))h.name=g("hName").value;if(g("hTarget"))h.target=Math.max(1,parseInt(g("hTarget").value)||1);
      if(g("hUnit"))h.unit=g("hUnit").value;if(g("hStep"))h.step=Math.max(1,parseInt(g("hStep").value)||1);if(g("hTimes"))h.schedule.times=Math.min(7,Math.max(1,parseInt(g("hTimes").value)||1))};
    body.onclick=e=>{const b=e.target.closest("button");if(!b)return;keep();
      if(b.dataset.emo){h.emoji=b.dataset.emo;draw()}
      else if(b.dataset.col){h.color=b.dataset.col;draw()}
      else if(b.dataset.type){h.type=b.dataset.type;draw()}
      else if(b.dataset.kind){h.schedule.kind=b.dataset.kind;draw()}
      else if(b.dataset.wd){const n=+b.dataset.wd;const s=new Set(h.schedule.days);s.has(n)?s.delete(n):s.add(n);h.schedule.days=[...s].sort();draw()}
      else if(b.id==="hSave"){
        h.name=h.name.trim();if(!h.name){toast("Дайте звичці назву ✍️");return}
        if(h.schedule.kind==="days"&&!h.schedule.days.length){toast("Оберіть хоча б один день");return}
        if(isNew){h.id=uid();h.created=todayISO();state.data.habits.push(h);toast(`${h.emoji} «${h.name}» додано!`)}
        else{const i=state.data.habits.findIndex(x=>x.id===h.id);state.data.habits[i]=h;toast("Збережено 💖")}
        save();closeSheet();render()}};
  };
  openSheet(isNew?"Нова звичка":"Змінити звичку","",draw);
}
function dayDetails(d){
  const m=state.data.mood[d];const hs=state.data.habits.filter(h=>planned(h,d)||isDone(h,d));
  openSheet(human(d)+", "+WD_FULL[dow(d)-1],`
    ${m?`<div style="display:flex;gap:12px;align-items:center"><span style="font-size:40px">${MOODS[m.level-1].e}</span><div><b>${MOODS[m.level-1].l}</b><div class="muted small">${(m.tags||[]).map(esc).join(" · ")||"без міток"}</div></div></div>${m.note?`<div class="note" style="color:var(--fg);white-space:pre-wrap">${esc(m.note)}</div>`:""}`:`<div class="muted">Настрій не відмічено.</div>`}
    ${isRest(d)?`<div class="note">🛌 День відпочинку</div>`:""}
    ${hs.length?`<div class="chips">${hs.map(h=>`<span class="chip" style="background:${isDone(h,d)?h.color:"var(--sunk)"};${isDone(h,d)?"":"opacity:.6"}">${h.emoji} ${esc(h.name)}${h.type==="count"?" "+val(h,d)+"/"+h.target:""}</span>`).join("")}</div>`:""}
    <button class="btn" id="goEdit">Змінити цей день</button>`,()=>{
      document.getElementById("goEdit").onclick=()=>{state.sel=d;state.tab="today";closeSheet();render();window.scrollTo(0,0)}});
}

/* ================= confetti ================= */
function confetti(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const c=document.getElementById("confetti");c.hidden=false;const ctx=c.getContext("2d");const dpr=devicePixelRatio||1;
  c.width=innerWidth*dpr;c.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const cols=["#FF8FC1","#C3AEF2","#8EDDC3","#FFE48A","#A9D8FF","#FFC8A8"];
  const ps=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight*.35,vx:(Math.random()-.5)*9,vy:-Math.random()*10-3,s:Math.random()*7+4,c:cols[Math.random()*cols.length|0],r:Math.random()*6,vr:(Math.random()-.5)*.3,h:Math.random()<.2}));
  let f=0;(function tick(){ctx.clearRect(0,0,innerWidth,innerHeight);
    for(const p of ps){p.vy+=.28;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;
      if(p.h){ctx.font=p.s*2.2+"px serif";ctx.fillText("💖",0,0)}else ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);ctx.restore()}
    if(++f<150)requestAnimationFrame(tick);else{ctx.clearRect(0,0,innerWidth,innerHeight);c.hidden=true}})();
}

/* ================= actions ================= */
function setVal(h,d,v){const L=state.data.log;L[d]={...(L[d]||{})};if(v>0)L[d][h.id]=v;else delete L[d][h.id];if(!Object.keys(L[d]).length)delete L[d]}
function afterHabitChange(h,d,wasDone){
  const nowDone=isDone(h,d);
  if(d===todayISO()){const T=state.data.ts;T[d]={...(T[d]||{})};if(nowDone&&!wasDone)T[d][h.id]=new Date().getHours();if(!nowDone)delete T[d][h.id];if(!Object.keys(T[d]).length)delete T[d]}
  let allDoneNow=false;if(!wasDone&&nowDone){const p=dayProgress(d);allDoneNow=p.total>0&&p.done===p.total;if(allDoneNow&&d===todayISO())unlockFact()}
  save();render();
  const el=document.getElementById("h-"+h.id);
  if(!wasDone&&nowDone){el?.querySelector(".chk,.cnt span")?.classList.add("pop");try{navigator.vibrate&&navigator.vibrate(15)}catch(e){}
    if(allDoneNow){confetti();toast(pickFresh(C.ALL_DONE,"all")+(d===todayISO()?" Факт дня відкрито ✨":""))}
    else{const st=streak(h);toast(st.n>=3?`🔥 ${st.n} ${st.unit} поспіль! `+pickFresh(C.PRAISE,"pr"):pickFresh(C.PRAISE,"pr"))}
    checkMilestone(h,d);save()}
}
function setMood(level){const d=state.sel;const m=state.data.mood[d]||{tags:[],note:""};const n=document.getElementById("moodNote");
  const first=!state.data.mood[d];
  state.data.mood[d]={...m,level,note:n?n.value:m.note,at:new Date().toISOString()};save();render();
  if(first||m.level!==level)toast(pickFresh(C.MOOD[level],"m"+level));
  if(first)setTimeout(()=>document.getElementById("moodCard")?.scrollIntoView({behavior:"smooth",block:"center"}),50)}

document.getElementById("app").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;const d=state.sel;
  if(b.dataset.day){state.sel=b.dataset.day;render();return}
  if(b.dataset.toggle){const h=findH(b.dataset.toggle);const was=isDone(h,d);setVal(h,d,was?0:1);afterHabitChange(h,d,was);return}
  if(b.dataset.inc||b.dataset.dec){const h=findH(b.dataset.inc||b.dataset.dec);const was=isDone(h,d);
    setVal(h,d,Math.max(0,val(h,d)+(b.dataset.inc?1:-1)*(h.step||1)));afterHabitChange(h,d,was);return}
  if(b.dataset.mood){setMood(+b.dataset.mood);return}
  if(b.dataset.tag){const m=state.data.mood[d];if(!m){toast("Спершу оберіть смайлик настрою 🙂");return}
    const s=new Set(m.tags||[]);s.has(b.dataset.tag)?s.delete(b.dataset.tag):s.add(b.dataset.tag);m.tags=[...s];const n=document.getElementById("moodNote");if(n)m.note=n.value;save();render();return}
  if(b.dataset.addtag){openSheet("Своя мітка",`<label class="f" for="tagIn">Назва (можна зі смайликом)<input id="tagIn" maxlength="24" placeholder="🐱 Кіт"></label><button class="btn" id="tagOk">Додати</button>`,()=>{
    document.getElementById("tagOk").onclick=()=>{const v=document.getElementById("tagIn").value.trim();if(!v)return;const t=S().tags||[];if(!t.includes(v)&&!BASE_TAGS.includes(v))t.push(v);S().tags=t;save();closeSheet();render()}});return}
  if(b.id==="saveNote"){const m=state.data.mood[d];if(!m)return;m.note=document.getElementById("moodNote").value.trim();save();render();toast(m.note?"Запис збережено 📝 Дякую, що приділили собі час":"Збережено");return}
  if(b.dataset.sugg){const s=SUGG[+b.dataset.sugg];state.data.habits.push({id:uid(),created:todayISO(),schedule:{kind:"daily",days:[1,2,3,4,5],times:3},step:1,unit:"",target:1,...s});save();render();toast(`${s.emoji} «${s.name}» додано! Можна ще 1–2 або почати`);return}
  if(b.dataset.newhabit){habitForm();return}
  if(b.dataset.edit){habitForm(findH(b.dataset.edit));return}
  if(b.dataset.arch){const h=findH(b.dataset.arch);h.archived=!h.archived;save();render();toast(h.archived?"Поставлено на паузу. Історія збережена":"Звичка знову активна");return}
  if(b.dataset.delh){if(!b.classList.contains("armed")){b.classList.add("armed");b.textContent="Точно? Історія зникне";setTimeout(()=>{if(b.isConnected){b.classList.remove("armed");b.textContent="Видалити"}},3500);return}
    const id=b.dataset.delh;state.data.habits=state.data.habits.filter(x=>x.id!==id);for(const k in state.data.log){delete state.data.log[k][id]}S().candies=S().candies.filter(c=>c.h!==id);save();render();toast("Звичку видалено");return}
  if(b.dataset.rest){const left=REST_PER_MONTH-restUsed(d.slice(0,7));if(left<=0)return;S().rest[d]=true;save();render();toast("Відпочинок — теж частина системи 🛌 Серії в безпеці");return}
  if(b.dataset.unrest){delete S().rest[d];save();render();return}
  if(b.dataset.dismiss){state.dismissed[b.dataset.dismiss]=true;render();return}
  if(b.dataset.opensum){const p=pendingSummary();if(p)openStory(p,p.key);return}
  if(b.dataset.story){const t=todayISO();const k=b.dataset.story;
    const P=k==="wcur"?periodWeek(weekStart(t)):k==="wprev"?periodWeek(addDays(weekStart(t),-7)):k==="mcur"?periodMonth(t.slice(0,7)):periodMonth(iso(new Date(parse(t).getFullYear(),parse(t).getMonth()-1,1)).slice(0,7));
    openStory(P,null);return}
  if(b.dataset.calmode){state.calMode=b.dataset.calmode;render();return}
  if(b.id==="cPrev"||b.id==="cNext"){const [y,m]=state.calMonth.split("-").map(Number);const dt=new Date(y,m-1+(b.id==="cNext"?1:-1),1);state.calMonth=dt.getFullYear()+"-"+pad(dt.getMonth()+1);render();return}
  if(b.dataset.cell){dayDetails(b.dataset.cell);return}
  if(b.id==="bkSave"){exportBackup();return}
});
document.getElementById("app").addEventListener("change",e=>{if(e.target.id==="bkFile"&&e.target.files[0]){importBackup(e.target.files[0]);e.target.value=""}});
document.querySelectorAll("nav.tabs button").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;if(b.dataset.tab==="today")state.sel=todayISO();render();window.scrollTo(0,0)});

/* ================= backup ================= */
async function exportBackup(){
  const name="zvychky-"+todayISO()+".json";const file=new File([JSON.stringify({app:"habits",version:2,exported:new Date().toISOString(),...state.data},null,1)],name,{type:"application/json"});
  try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:name})}
    else{const a=document.createElement("a");a.href=URL.createObjectURL(file);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}}
  catch(e){if(e&&e.name==="AbortError"){toast("Копію не збережено");return}}
  S().lastBackup=new Date().toISOString();save();render();toast("Копію створено. Збережіть її у «Файли» 💾");
}
async function importBackup(f){
  try{const d=JSON.parse(await f.text());if(d.app!=="habits"||!Array.isArray(d.habits))throw 0;
    const ids=new Set(state.data.habits.map(h=>h.id));for(const h of d.habits)if(!ids.has(h.id))state.data.habits.push(h);
    for(const [k,v] of Object.entries(d.log||{}))state.data.log[k]={...v,...(state.data.log[k]||{})};
    for(const [k,v] of Object.entries(d.ts||{}))state.data.ts[k]={...v,...(state.data.ts[k]||{})};
    for(const [k,v] of Object.entries(d.mood||{}))if(!state.data.mood[k])state.data.mood[k]=v;
    const ds=d.settings||{};S().tags=[...new Set([...(S().tags||[]),...(ds.tags||[])])];S().rest={...(ds.rest||{}),...S().rest};
    const ck=new Set(S().candies.map(c=>c.h+":"+c.n));for(const c of (ds.candies||[]))if(!ck.has(c.h+":"+c.n))S().candies.push(c);
    save();render();toast("Дані відновлено 💖");
  }catch(e){toast("Це не файл копії трекера звичок")}
}

/* ================= boot ================= */
load();
(function(){const st=S();const t=todayISO();if(st.lastOpen&&diffDays(st.lastOpen,t)>=3&&state.data.habits.length)state.welcome=true;st.lastOpen=t;save()})();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
render();
let lastDay=todayISO();
document.addEventListener("visibilitychange",()=>{if(document.hidden)return;const t=todayISO();if(t!==lastDay){lastDay=t;state.sel=t;S().lastOpen=t;save();render()}});
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
