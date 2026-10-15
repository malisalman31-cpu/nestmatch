// Synthetic contract fixture, never shipped as real inventory.
export function feedFixture(now=Date.now()) {
  return {meta:{api:'micasa-rentals',schemaVersion:'2.0.0',generatedAt:new Date(now).toISOString(),license:'Public listing data, free to use, cache and republish with attribution to Mi Casa Rentals.',availability:{stale:false,refreshedAt:new Date(now).toISOString()}},data:{truncated:false,units:[{
    id:'test-only',name:'Test contract home',summary:'Synthetic feed contract fixture',address:{city:'Pensacola',state:'FL',country:'US',coordinates:{latitude:30.4,longitude:-87.2}},propertyName:'Test area',
    rent:{currency:'USD',period:'month',amount:1600,includesUtilities:false},utilityBundle:{price:300,includes:['Power','Water','Internet']},bedrooms:2,
    links:{unit:'https://www.micasa.rentals/test-only/test-only'},amenities:['Fully furnished'],fees:{securityDeposit:{disclosed:true,amount:750}},
    availability:{availableDate:'2027-03-07',live:true,label:'Available March 7, 2027'},screening:{ratesPricedForMonths:6}
  }]}};
}
