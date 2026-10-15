// Personal bookmarks only. No source requests, scraping, report uploads or cloud sync.
export const KEY='nestmatch-personal-links-v1';
export const LIMIT=200;
export const STAGES=['Saved','Contacted','Viewing scheduled','Applied','No longer interested'];
export const empty=()=>({version:1,items:[],history:[]});
const bounded=(value,max,label,required=false)=>{
  if(typeof value!=='string'||value.length>max)throw Error(`${label} must be text under ${max+1} characters.`);
  const text=value.trim();if(required&&!text)throw Error(`Enter ${label.toLowerCase()}.`);return text;
};
export function listingURL(value){
  const raw=bounded(value,2048,'Listing link',true);let url;
  try{url=new URL(raw);}catch{throw Error('Paste a complete public listing link beginning with https://.');}
  const host=url.hostname.toLowerCase();
  if(url.protocol!=='https:'||url.username||url.password||url.port||!host.includes('.')||host.includes(':')||/^\d+(\.\d+)*$/.test(host)||/\.(localhost|local|internal|lan)$/.test(host)||host.endsWith('.'))throw Error('Use a public HTTPS listing link, without a login, password or custom port.');
  for(const key of url.searchParams.keys())if(/^(token|access_token|auth|authorization|password|secret|signature|email|code)$/i.test(key))throw Error('Use the public listing page, not a private invitation or signed-in sharing link.');
  url.hash='';for(const key of [...url.searchParams.keys()])if(/^utm_/i.test(key)||/^(fbclid|gclid|msclkid)$/i.test(key))url.searchParams.delete(key);
  return url.href;
}
const cost=(value,label)=>{
  if(value===null||value===undefined||value==='')return null;
  if(typeof value==='boolean'||!['string','number'].includes(typeof value))throw Error(`Enter a valid ${label}.`);
  if(typeof value==='string'&&!/^\d+(\.\d{1,2})?$/.test(value))throw Error(`Enter ${label} as dollars, or leave it blank.`);
  const n=Number(value);if(!Number.isFinite(n)||n<0||n>1000000)throw Error(`Enter ${label} between 0 and 1,000,000.`);return n;
};
const date=value=>{if(!value)return '';if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)throw Error('Enter valid planned dates.');return value;};
export function normalize(input){
  if(!input||typeof input!=='object')throw Error('Invalid bookmark.');
  const url=listingURL(input.url),row={url,title:bounded(input.title??'',120,'A nickname',true),city:bounded(input.city??'',100,'City or area'),notes:bounded(input.notes??'',2000,'Notes')};
  for(const k of ['rent','utilities','fees','deposit'])row[k]=cost(input[k],k);
  row.bedrooms=cost(input.bedrooms,'bedroom count');if(row.bedrooms!==null&&(!Number.isInteger(row.bedrooms)||row.bedrooms>20))throw Error('Bedrooms must be a whole number from 0 to 20, or blank.');
  for(const k of ['furnished','utilitiesIncluded']){row[k]=input[k]??'unknown';if(!['unknown','yes','no'].includes(row[k]))throw Error('Choose Yes, No or Unknown.');}
  row.start=date(input.start);row.end=date(input.end);if(Boolean(row.start)!==Boolean(row.end)||(row.start&&row.start>=row.end))throw Error('Enter both planned dates, with move-out after move-in.');
  return row;
}
export function upsert(state,input,id=null){
  const row=normalize(input),index=id===null?-1:state.items.findIndex(r=>r.id===id);
  if(id!==null&&index<0)throw Error('That bookmark no longer exists.');
  if(state.items.some(r=>r.url===row.url&&r.id!==id))throw Error('That link is already in your organizer. Edit the existing bookmark instead.');
  if(index<0&&state.items.length>=LIMIT)throw Error(`Your organizer holds up to ${LIMIT} links. Remove a link before adding another.`);
  const next=structuredClone(state),previous=next.items[index];
  const item={...row,id:previous?.id??'link-'+crypto.randomUUID(),decision:previous?.decision??null,stage:previous?.stage??'Saved',updated:new Date().toISOString()};
  if(index<0)next.items.push(item);else next.items[index]=item;return next;
}
export function decision(state,id,choice){
  if(![null,'save','pass'].includes(choice))throw Error('Invalid choice.');
  const next=structuredClone(state),row=next.items.find(r=>r.id===id);if(!row)throw Error('Bookmark not found.');
  next.history.push({id,previous:row.decision});next.history=next.history.slice(-100);row.decision=choice;return next;
}
export function undo(state){const next=structuredClone(state),last=next.history.pop(),row=last&&next.items.find(r=>r.id===last.id);if(row)row.decision=last.previous;return next;}
export function remove(state,id){const next=structuredClone(state);next.items=next.items.filter(r=>r.id!==id);next.history=next.history.filter(r=>r.id!==id);return next;}
export function monthly(row){return [row.rent,row.utilities,row.fees].some(v=>v===null)?null:Math.round((row.rent+row.utilities+row.fees)*100)/100;}
export function visible(items,{city='',budget=''}={}){const cap=cost(budget,'budget');return items.filter(r=>(!city||r.city.toLowerCase().includes(city.trim().toLowerCase()))&&(cap===null||(monthly(r)??((r.rent??0)+(r.utilities??0)+(r.fees??0)))<=cap));}
export function hydrate(raw){
  if(!raw||raw.version!==1||!Array.isArray(raw.items)||raw.items.length>LIMIT)throw Error('Saved organizer data is invalid.');
  const result=empty(),ids=new Set(),urls=new Set();
  for(const item of raw.items){const row=normalize(item);
    if(typeof item.id!=='string'||!/^link-[a-zA-Z0-9-]{1,80}$/.test(item.id)||ids.has(item.id)||urls.has(row.url)||![null,'save','pass'].includes(item.decision)||!STAGES.includes(item.stage)||typeof item.updated!=='string'||!Number.isFinite(Date.parse(item.updated)))throw Error('Saved bookmark data is invalid.');
    ids.add(item.id);urls.add(row.url);result.items.push({...row,id:item.id,decision:item.decision,stage:item.stage,updated:item.updated});
  }
  result.history=Array.isArray(raw.history)?raw.history.filter(x=>x&&ids.has(x.id)&&[null,'save','pass'].includes(x.previous)).slice(-100):[];return result;
}
