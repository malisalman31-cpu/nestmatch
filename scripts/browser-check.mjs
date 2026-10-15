// CI browser regression suite. Uses isolated contexts and fictional data only.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {feedFixture} from '../tests/feed-fixture.js';
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'4181'},stdio:['ignore','pipe','inherit']});
let browser;
try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Preview did not start')),10000);server.stdout.on('data',d=>{if(d.toString().includes('Local:')){clearTimeout(timer);resolve();}});server.on('error',reject);});
  browser=await chromium.launch();
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const context=await browser.newContext({viewport,hasTouch:viewport.width<500,isMobile:viewport.width<500});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:4181/?demo=1');await page.locator('#app').waitFor({state:'visible'});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal page overflow');
    await page.getByRole('button',{name:'Save this place →',exact:true}).click();
    await page.locator('#saved-tab').click();
    const note=page.getByRole('textbox',{name:'Notes for Room in a shared bungalow'});
    await note.fill('Confirm parking');
    await page.getByRole('combobox',{name:'Progress for Room in a shared bungalow'}).selectOption('Contacted');
    await page.reload();await page.locator('#app').waitFor({state:'visible'});await page.locator('#saved-tab').click();
    assert.equal(await note.inputValue(),'Confirm parking');
    assert.equal(await page.getByRole('combobox',{name:'Progress for Room in a shared bungalow'}).inputValue(),'Contacted');
    await page.getByRole('button',{name:'Compare costs',exact:true}).click();assert.ok(await page.getByRole('table').isVisible());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Comparison scroll stays inside region');
    await page.getByRole('combobox',{name:'Show status',exact:true}).selectOption('Applied');assert.ok(await page.locator('#stage-empty').isVisible());
    await page.getByRole('combobox',{name:'Show status',exact:true}).selectOption('all');
    await page.getByRole('button',{name:'Remove from saved',exact:true}).click();assert.ok(await page.locator('#saved-empty').isVisible());
    await page.getByRole('button',{name:'Undo last decision',exact:true}).click();assert.equal(await note.inputValue(),'Confirm parking');
    await page.locator('#browse-tab').click();await page.getByRole('textbox',{name:'City or neighborhood'}).fill('Boston');
    await page.getByRole('button',{name:'Update my deck',exact:true}).click();assert.ok(await page.getByText('No sample homes match.',{exact:true}).isVisible());assert.equal(await page.locator('#saved-count').textContent(),'1');
    await page.getByRole('button',{name:'Reset preferences',exact:true}).click();
    for(let i=0;i<6;i++)await page.getByRole('button',{name:'← Pass',exact:true}).click();
    assert.ok(await page.getByRole('heading',{name:'Your shortlist',exact:true}).isVisible());
    await page.getByRole('button',{name:'Clear shortlist data',exact:true}).click();await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.locator('#saved-count').textContent(),'1');
    await page.getByRole('button',{name:'Clear shortlist data',exact:true}).click();await page.getByRole('button',{name:'Clear shortlist',exact:true}).click();assert.equal(await page.locator('#saved-count').textContent(),'0');
    await page.locator('#listing-card').press('ArrowRight');assert.equal(await page.locator('#saved-count').textContent(),'1');
    await page.getByRole('button',{name:'Undo last decision',exact:true}).click();
    const photo=page.locator('#listing-card .home-photo');await photo.scrollIntoViewIfNeeded();const box=await photo.boundingBox();
    await page.mouse.move(box.x+25,box.y+60);await page.mouse.down();await page.mouse.move(box.x+140,box.y+62,{steps:5});await page.mouse.up();assert.equal(await page.locator('#saved-count').textContent(),'1');
    assert.deepEqual(errors,[]);console.log(`Passed save, reload, notes, stage filter, costs, undo, empty search, deck completion, reset, keyboard, swipe and overflow at ${viewport.width}px`);await context.close();
  }
  const failure=await browser.newPage();await failure.route('**/data/listings.json',route=>route.fulfill({status:500,body:'error'}));await failure.goto('http://127.0.0.1:4181/?demo=1');await failure.getByText('The sample inventory could not be loaded.',{exact:false}).waitFor();assert.ok(await failure.locator('#app').isHidden());console.log('Passed inventory failure state');
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const context=await browser.newContext({viewport}),page=await context.newPage();
    await page.route('https://www.micasa.rentals/api/v1/units?limit=100',route=>route.fulfill({json:feedFixture(),headers:{'access-control-allow-origin':'*'}}));
    await page.goto('http://127.0.0.1:4181');await page.locator('#app').waitFor({state:'visible'});
    assert.ok(await page.getByText('1 real property listings',{exact:false}).isVisible());
    const original=page.getByRole('link',{name:'View original listing for Test contract home on Mi Casa Rentals',exact:true});
    assert.equal(await original.getAttribute('href'),'https://www.micasa.rentals/test-only/test-only');
    assert.equal(await original.getAttribute('rel'),'noopener noreferrer');
    await page.getByRole('button',{name:'Save this place →',exact:true}).click();
    await page.getByRole('textbox',{name:'Notes for Test contract home'}).fill('Ask source about deposit');
    await page.reload();await page.locator('#app').waitFor({state:'visible'});await page.locator('#saved-tab').click();
    assert.equal(await page.getByRole('textbox',{name:'Notes for Test contract home'}).inputValue(),'Ask source about deposit');
    assert.ok(await original.isVisible());
    await page.getByRole('button',{name:'Compare costs',exact:true}).click();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.goto('http://127.0.0.1:4181/?demo=1');await page.locator('#app').waitFor({state:'visible'});
    assert.equal(await page.locator('#saved-count').textContent(),'0');
    await context.close();console.log(`Passed real-source dashboard, outbound links, notes, persistence, demo separation and overflow at ${viewport.width}px`);
  }
  const offline=await browser.newPage();await offline.route('https://www.micasa.rentals/api/v1/units?limit=100',route=>route.fulfill({status:503,body:'unavailable'}));await offline.goto('http://127.0.0.1:4181');await offline.getByText('The rental source is unavailable or out of date.',{exact:false}).waitFor();assert.ok(await offline.locator('#app').isHidden());console.log('Passed source failure without demo substitution');
}finally{await browser?.close();server.kill();}
