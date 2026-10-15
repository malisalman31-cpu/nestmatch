import {FEATURES} from './shortlist.js';

// Source's explicit republication license: https://www.micasa.rentals/api.php
export const FEED_URL = 'https://www.micasa.rentals/api/v1/units?limit=100';
export const LIVE_STORAGE_KEY = 'nestmatch-live-shortlist-v1';
const license = 'Public listing data, free to use, cache and republish with attribution to Mi Casa Rentals.';
const cost = n => typeof n === 'number' && Number.isFinite(n) && n >= 0;
const date = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
const text = (s, max=2000) => {if(typeof s !== 'string' || !s.trim() || s.length > max) throw Error('Invalid source text'); return s;};
export function sourceUrl(value) {
  const u = new URL(value);
  if(u.origin !== 'https://www.micasa.rentals' || u.username || u.password || u.search || u.hash || !/^\/[a-z0-9-]+\/[a-z0-9-]+$/.test(u.pathname)) throw Error('Unapproved listing destination');
  return u.href;
}
export function normalizeFeed(payload, now=Date.now()) {
  const meta=payload?.meta, units=payload?.data?.units;
  if(meta?.api !== 'micasa-rentals' || meta.schemaVersion !== '2.0.0' || meta.license !== license || !Array.isArray(units) || units.length > 100 || payload.data.truncated !== false) throw Error('Unapproved or incomplete feed');
  const generated=Date.parse(meta.generatedAt);
  if(!Number.isFinite(generated) || generated > now+300000 || now-generated > 86400000) throw Error('Feed is out of date');
  const refreshed=Date.parse(meta.availability?.refreshedAt);
  const fresh=meta.availability?.stale === false && Number.isFinite(refreshed) && refreshed <= now+300000 && now-refreshed <= 3600000;
  const ids=new Set();
  return units.map(u=>{
    if(!/^[a-z0-9-]+$/.test(u.id) || ids.has(u.id)) throw Error('Invalid source ID'); ids.add(u.id);
    if(u.rent?.currency !== 'USD' || u.rent.period !== 'month' || !cost(u.rent.amount) || !Number.isInteger(u.bedrooms) || u.bedrooms < 0 || u.bedrooms > 20) throw Error('Invalid source price');
    if(u.address?.country !== 'US') throw Error('Unsupported country');
    const coord=u.address.coordinates;
    if(!Number.isFinite(coord?.latitude) || Math.abs(coord.latitude)>90 || !Number.isFinite(coord.longitude) || Math.abs(coord.longitude)>180) throw Error('Invalid coordinates');
    const included=u.rent.includesUtilities===true;
    const utilities=included ? 0 : cost(u.utilityBundle?.price) ? u.utilityBundle.price : null;
    const features=Object.fromEntries(Object.keys(FEATURES).map(k=>[k,null]));
    for(const [key,label] of Object.entries({electricity:'Power',water:'Water',internet:'Internet'})) if(u.utilityBundle?.includes?.includes(label)) features[key]=included;
    if(u.amenities?.includes('Fully furnished')) features.furnished=true;
    // Do not infer pet approval, accessibility, or reserved parking from prose.
    const available=fresh && u.availability?.live===true;
    const availableFrom=available && date(u.availability?.availableDate) ? u.availability.availableDate : null;
    const deposit=u.fees?.securityDeposit;
    return {
      id:'micasa-'+u.id,demo:false,permission:'micasa_attribution',source:'Mi Casa Rentals',source_url:sourceUrl(u.links?.unit),
      title:text(u.name,250),description:u.summary == null ? 'See the original listing for property details.' : text(u.summary),city:text(u.address.city,100),state:text(u.address.state,100),area:text(u.propertyName,250),
      latitude:coord.latitude,longitude:coord.longitude,image_panel:null,
      rent:u.rent.amount,utilities,fees:null,known_monthly_minimum:u.rent.amount,monthly_total:utilities===null?null:u.rent.amount+utilities,
      deposit:deposit?.disclosed===true && cost(deposit.amount) ? deposit.amount : null,bedrooms:u.bedrooms,features,
      available_from:availableFrom,available_to:null,updated:meta.generatedAt,
      availability_label:available ? text(u.availability.label,200) : 'Availability unconfirmed — check original listing',
      availability_checked:available ? meta.availability.refreshedAt : null,
      lease_months:Number.isInteger(u.screening?.ratesPricedForMonths) && u.screening.ratesPricedForMonths>0 ? u.screening.ratesPricedForMonths : null,
      fee_note:'Base rent + listed utilities only. Application, cleaning, pet and other charges may apply. Confirm the full quote with the source.',
    };
  });
}
export async function loadRentals(fetcher=fetch) {
  const response=await fetcher(FEED_URL,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw Error('Rental source unavailable');
  return normalizeFeed(await response.json());
}
