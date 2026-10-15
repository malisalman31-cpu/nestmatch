export const STORAGE_KEY = 'nestmatch-shortlist-v1';
export const FEATURES = Object.freeze({electricity:'Electricity included',water:'Water included',gas:'Gas included',internet:'Internet included',furnished:'Furnished',pets:'Pets allowed',parking:'Reserved parking',laundry:'Laundry on site',step_free:'Step-free entry',workspace:'Workspace',private_bath:'Private bathroom'});
export const STAGES = ['Saved','Contacted','Viewing scheduled','Applied','No longer interested'];
export const DEFAULTS = Object.freeze({city:'Los Angeles',budget:3500,deposit:4000,bedrooms:0,start:'',end:'',destination:'',notes:'',hideUnknown:false,features:{}});
export const initialState = () => ({version:1,preferences:{...DEFAULTS,features:{}},decisions:{},details:{},history:[]});
const money = x => typeof x === 'number' && Number.isFinite(x) && x >= 0;
const validDate = x => /^\d{4}-\d{2}-\d{2}$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().slice(0,10) === x;
export function preferences(input={}) {
  const p={...DEFAULTS,...input,features:{...input.features}};
  if(typeof p.city !== 'string' || p.city.length>100) throw Error('Enter a city or neighborhood of up to 100 characters.');
  p.city=p.city.trim();
  for(const key of ['budget','deposit','bedrooms']) {p[key]=Number(p[key]); if(!money(p[key]) || p[key]>1000000) throw Error('Enter valid nonnegative costs and bedroom counts.');}
  if(!Number.isInteger(p.bedrooms) || p.bedrooms>10) throw Error('Choose 0–10 bedrooms.');
  if((p.start && !validDate(p.start)) || (p.end && !validDate(p.end)) || Boolean(p.start)!==Boolean(p.end) || (p.start && p.start>=p.end)) throw Error('Choose both dates, with move-out after move-in.');
  for(const key of ['destination','notes']) if(typeof p[key]!=='string' || p[key].length>1000) throw Error('Keep notes and destination under 1,000 characters.');
  p.hideUnknown=Boolean(p.hideUnknown);
  for(const [key,value] of Object.entries(p.features)) if(!Object.hasOwn(FEATURES,key) || !['any','want','need','avoid'].includes(value)) throw Error('Invalid housing preference.');
  return p;
}
export function validateInventory(payload) {
  if(payload?.schema_version!==1 || payload.demo!==true || !Array.isArray(payload.records) || payload.records.length>1000) throw Error('Invalid sample inventory.');
  const ids=new Set();
  for(const r of payload.records) {
    if(!/^[a-z0-9-]+$/.test(r.id) || ids.has(r.id) || r.demo!==true || r.source_url!==null || r.permission!=='original_fictional_sample') throw Error('Inventory is not approved for this demo.');
    ids.add(r.id);
    for(const key of ['title','area','city','source','description','updated']) if(typeof r[key]!=='string' || r[key].length>2000) throw Error('Invalid listing text.');
    for(const key of ['rent','fees','known_monthly_minimum','bedrooms']) if(!money(r[key])) throw Error('Invalid listing cost.');
    for(const key of ['utilities','deposit','monthly_total']) if(r[key]!==null && !money(r[key])) throw Error('Invalid optional cost.');
    if(r.monthly_total!==(r.utilities===null?null:r.rent+r.utilities+r.fees) || r.known_monthly_minimum!==r.rent+r.fees) throw Error('Cost output mismatch.');
    if(!validDate(r.available_from) || !validDate(r.available_to) || r.available_from>=r.available_to) throw Error('Invalid dates.');
    if(!Number.isFinite(r.latitude)||Math.abs(r.latitude)>90||!Number.isFinite(r.longitude)||Math.abs(r.longitude)>180||![0,1,2].includes(r.image_panel)) throw Error('Invalid location or image.');
    for(const key of Object.keys(FEATURES)) if(![true,false,null].includes(r.features?.[key])) throw Error('Invalid feature.');
  }
  return payload.records;
}
export function assess(row,input) {
  const p=preferences(input), missing=[],reasons=[],matched=[];
  if(p.city && !`${row.city} ${row.area} ${row.state}`.toLowerCase().includes(p.city.toLowerCase())) reasons.push('Outside your search area');
  if(row.bedrooms<p.bedrooms) reasons.push('Too few bedrooms');
  const cost=row.monthly_total??row.known_monthly_minimum;
  if(cost>p.budget) reasons.push('Over monthly budget');
  if(row.monthly_total===null) missing.push('Monthly utilities cost');
  if(row.demo===false && row.fees===null) missing.push('Additional fees');
  if(row.deposit===null) missing.push('Deposit'); else if(row.deposit>p.deposit) reasons.push('Over deposit limit');
  if(p.start) {
    if(!row.available_from || !row.available_to) missing.push('Full-stay availability');
    if((row.available_from && row.available_from>p.start) || (row.available_to && row.available_to<p.end)) reasons.push('Dates not covered');
  }
  let score=0;
  for(const [key,label] of Object.entries(FEATURES)) {
    const choice=p.features[key]??'any'; if(choice==='any') continue;
    const actual=row.features[key],desired=choice!=='avoid';
    if(actual===null) {missing.push(label);continue;}
    if(actual===desired) {matched.push(label+(desired?'':' · not required/present'));score+=choice==='want'?1:2;}
    else if(choice!=='want') reasons.push(label+(desired?' · not offered':' · must be absent'));
  }
  return {eligible:reasons.length===0 && (!p.hideUnknown || missing.length===0),missing:[...new Set(missing)],reasons,matched,score};
}
export function deck(records,state) {
  return records.map(row=>({row,fit:assess(row,state.preferences)})).filter(x=>x.fit.eligible && !state.decisions[x.row.id])
    .sort((a,b)=>b.fit.score-a.fit.score || (a.row.monthly_total??Infinity)-(b.row.monthly_total??Infinity) || a.row.id.localeCompare(b.row.id));
}
export function decide(state,id,decision,records) {
  if(!records.some(r=>r.id===id)||!['save','pass'].includes(decision)) throw Error('Invalid listing decision.');
  const next=structuredClone(state);
  next.history.push({id,previous:next.decisions[id]??null});next.history=next.history.slice(-100);
  next.decisions[id]=decision;
  return next;
}
export function undo(state) {
  const next=structuredClone(state),last=next.history.pop();
  if(last) {if(last.previous===null) delete next.decisions[last.id];else next.decisions[last.id]=last.previous;}
  return next;
}
export function hydrate(raw,records) {
  const base=initialState();
  if(raw?.version!==1) return base;
  try{base.preferences=preferences(raw.preferences);}catch{}
  const ids=new Set(records.map(r=>r.id));
  for(const [id,value] of Object.entries(raw.decisions??{})) if(ids.has(id)&&['save','pass'].includes(value)) base.decisions[id]=value;
  for(const [id,value] of Object.entries(raw.details??{})) if(ids.has(id)&&value&&STAGES.includes(value.stage)&&typeof value.notes==='string') base.details[id]={stage:value.stage,notes:value.notes.slice(0,1000)};
  base.history=Array.isArray(raw.history)?raw.history.filter(x=>x&&ids.has(x.id)&&[null,'save','pass'].includes(x.previous)).slice(-100):[];
  return base;
}
export function stayEstimate(row,p) {
  if(!p.start||!p.end||row.monthly_total===null||row.demo===false) return null;
  const days=(Date.parse(p.end)-Date.parse(p.start))/86400000;
  return {days,amount:row.monthly_total*days/30};
}
export function mapUrl(row) {
  const x=row.longitude,y=row.latitude;
  return 'https://www.openstreetmap.org/export/embed.html?bbox='+encodeURIComponent([x-.025,y-.018,x+.025,y+.018].join(','))+'&layer=mapnik&marker='+encodeURIComponent(y+','+x);
}
