// Runs in CI with synthetic bookmarks only; never fetches source listing pages.
import assert from 'node:assert/strict';
export async function checkOrganizer(browser){
  for(const width of [1280,390]){
    const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[],external=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4181/'))external.push(r.url());});
    await page.goto('http://127.0.0.1:4181/organizer');await page.locator('#organizer-app').waitFor({state:'visible'});
    const form=page.locator('#link-form');
    await form.getByLabel('Public listing link',{exact:true}).fill('https://example.com/test-one?utm_source=qa');
    await form.getByLabel('Your nickname for this place').fill('Test Berkeley studio');
    await form.getByLabel('City or area',{exact:true}).fill('Berkeley');
    await form.getByLabel('Your notes',{exact:true}).fill('<img src=x onerror=alert(1)>');
    await form.locator('summary').click();
    for(const [name,value]of [['rent','2200'],['utilities','100'],['fees','0']])await form.locator(`[name=${name}]`).fill(value);
    await page.locator('#submit-link').click();assert.equal(await page.locator('.personal-card .price').innerText(),'$2,300.00\nyour entered monthly total');
    assert.equal(await page.locator('.personal-card img').count(),0);assert.equal(await page.locator('.source-link').getAttribute('href'),'https://example.com/test-one');
    await page.locator('.personal-card').press('ArrowRight');assert.equal(await page.locator('#view-saved').getAttribute('aria-pressed'),'true');
    await page.getByLabel('Progress for Test Berkeley studio').selectOption('Contacted');
    await page.reload();await page.locator('#view-saved').click();assert.equal(await page.getByLabel('Progress for Test Berkeley studio').inputValue(),'Contacted');
    await page.locator('#compare-links').click();assert.ok(await page.locator('#personal-comparison table').isVisible());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Organizer mobile/desktop overflow');
    await page.getByRole('button',{name:'Edit details & notes',exact:true}).click();await form.getByLabel('Your notes',{exact:true}).fill('Updated note');await page.locator('#submit-link').click();assert.equal(await page.locator('.notes').textContent(),'Updated note');
    await form.getByLabel('Public listing link',{exact:true}).fill('https://example.com/test-one');await form.getByLabel('Your nickname for this place').fill('Duplicate');await page.locator('#submit-link').click();assert.match(await page.locator('#link-error').textContent(),/already/);
    await form.getByLabel('Public listing link',{exact:true}).fill('https://example.com/test-two');await form.getByLabel('Your nickname for this place').fill('Test Oakland room');await page.locator('#submit-link').click();assert.equal(await page.locator('#link-count').textContent(),'2 links · 1 saved');
    await page.getByRole('button',{name:'← Pass',exact:true}).click();await page.locator('#organizer-undo').click();assert.ok(await page.getByRole('heading',{name:'Test Oakland room'}).isVisible());
    await page.locator('#view-all').click();assert.equal(await page.locator('.personal-card').count(),2);
    await page.locator('#organizer-filter [name=city]').fill('Boston');await page.getByRole('button',{name:'Apply filters',exact:true}).click();assert.match(await page.locator('#organizer-empty').textContent(),/No links match/);await page.locator('#reset-filter').click();
    const saved=await page.evaluate(()=>localStorage.getItem('nestmatch-personal-links-v1'));
    await page.locator('#backup-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{bad')});await page.getByText('Backup is invalid or too large. No links were changed.',{exact:true}).waitFor();assert.equal(await page.locator('#link-count').textContent(),'2 links · 1 saved');
    await page.locator('#backup-file').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(saved)});await page.locator('#confirm-cancel').click();assert.equal(await page.locator('#link-count').textContent(),'2 links · 1 saved');
    await page.locator('#clear-links').click();await page.locator('#confirm-cancel').click();assert.equal(await page.locator('.personal-card').count(),2);
    await page.locator('#clear-links').click();await page.locator('#confirm-action').click();assert.equal(await page.locator('#link-count').textContent(),'0 links · 0 saved');
    await page.locator('#backup-file').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(saved)});await page.locator('#confirm-action').click();assert.equal(await page.locator('#link-count').textContent(),'2 links · 1 saved');
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await context.close();console.log(`Passed organizer add/edit/swipe/undo/reload/compare/filter/backup/restore/privacy at ${width}px`);
  }
  const context=await browser.newContext();await context.addInitScript(()=>localStorage.setItem('nestmatch-personal-links-v1','broken-data'));
  const page=await context.newPage();await page.goto('http://127.0.0.1:4181/organizer');await page.locator('#organizer-app').waitFor({state:'visible'});
  assert.ok(await page.locator('#submit-link').isDisabled());assert.equal(await page.evaluate(()=>localStorage.getItem('nestmatch-personal-links-v1')),'broken-data');await context.close();console.log('Passed corrupt organizer storage preservation');
}
