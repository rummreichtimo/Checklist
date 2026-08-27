import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
p.on('console',m=>{ if(m.type()==='error') errs.push('CONSOLE: '+m.text()); });
await p.goto('file:///home/user/Checklist/index.html');
await p.waitForTimeout(400);
const log=[];
const t=async(n,f)=>{ try{ await f(); log.push('✔ '+n);}catch(e){ log.push('✘ '+n+' → '+e.message);} };

await t('Dashboard-Stats sichtbar', async()=>{ const n=await p.locator('.stat').count(); if(n<10) throw new Error('nur '+n+' Stats'); });
await t('Nav 8 Einträge', async()=>{ const n=await p.locator('.nav-item').count(); if(n!==7) throw new Error('nav items '+n); });

// Unternehmen
await t('Unternehmen: 13 Seeds', async()=>{ await p.click('[data-view="unternehmen"]'); await p.waitForTimeout(200);
  const n=await p.locator('#coList .row').count(); if(n!==13) throw new Error('rows '+n); });
await t('Suche filtert', async()=>{ await p.fill('#coSearch','würth'); await p.waitForTimeout(150);
  const n=await p.locator('#coList .row').count(); if(n!==1) throw new Error('rows '+n); await p.fill('#coSearch',''); });
await t('Bereichsfilter', async()=>{ await p.selectOption('[data-key="track"][data-change="cofilter"]','tech'); await p.waitForTimeout(150);
  const n=await p.locator('#coList .row').count(); if(n!==4) throw new Error('rows '+n);
  await p.selectOption('[data-key="track"][data-change="cofilter"]',''); await p.waitForTimeout(150); });
await t('Unternehmen anlegen', async()=>{ await p.click('[data-action="co-new"]'); await p.waitForTimeout(200);
  await p.fill('#f_name','Testfirma GmbH'); await p.fill('#f_city','Gifhorn');
  await p.click('#modalForm button[type=submit]'); await p.waitForTimeout(250);
  const n=await p.locator('#coList .row').count(); if(n!==14) throw new Error('rows '+n); });
await t('Status ändern', async()=>{ const sel=p.locator('#coList select').first(); await sel.selectOption('yes'); await p.waitForTimeout(200);
  const v=await p.locator('#coList select').first().inputValue(); if(v!=='yes') throw new Error('status '+v); });
await t('Bewerbung aus Unternehmen', async()=>{ await p.locator('[data-action="co-apply"]').first().click(); await p.waitForTimeout(250);
  await p.click('#modalForm button[type=submit]'); await p.waitForTimeout(300);
  const n=await p.locator('#appList .row').count(); if(n!==1) throw new Error('apps '+n); });
await t('Bewerbung löschen', async()=>{ await p.locator('[data-action="app-del"]').first().click(); await p.waitForTimeout(200);
  await p.click('#modalForm button[type=submit]'); await p.waitForTimeout(250);
  const n=await p.locator('#appList .row').count(); if(n!==0) throw new Error('apps '+n); });

// Checkliste
await t('Checkbox speichert', async()=>{ await p.click('[data-view="checkliste"]'); await p.waitForTimeout(200);
  await p.locator('.check').first().click(); await p.waitForTimeout(200);
  const on=await p.locator('.check.on').count(); if(on!==1) throw new Error('on '+on);
  const ls=await p.evaluate(()=>JSON.parse(localStorage.getItem('orientierungsjahr.v1')).checklist.filter(c=>c.done).length);
  if(ls!==1) throw new Error('gespeichert '+ls); });
await t('Punkt hinzufügen', async()=>{ const f=p.locator('form[data-submit="check-add"]').first();
  await f.locator('input').fill('Neuer Testpunkt'); await f.locator('button').click(); await p.waitForTimeout(200);
  if(!(await p.locator('text=Neuer Testpunkt').count())) throw new Error('nicht gefunden'); });

// Bewertung
await t('Bewertung anlegen', async()=>{ await p.click('[data-view="bewertung"]'); await p.waitForTimeout(200);
  await p.click('[data-action="rev-new"]'); await p.waitForTimeout(250);
  await p.fill('#f_company','IAV');
  for(const c of ['interest','fun','fit','env','wlb','career']) await p.click(`[data-crit="${c}"][data-val="4"]`);
  await p.click('[data-action="study"][data-val="ja"]');
  await p.click('#modalForm button[type=submit]'); await p.waitForTimeout(300);
  const n=await p.locator('.row').count(); if(n<1) throw new Error('keine Bewertung'); });
await t('Vergleich zeigt Ø', async()=>{ await p.click('[data-view="vergleich"]'); await p.waitForTimeout(250);
  const v=await p.locator('input[data-track="vfx"][data-crit="interest"]').inputValue(); if(v!=='4') throw new Error('wert '+v); });
await t('Vergleich manuell überschreiben', async()=>{ const i=p.locator('input[data-track="bwl"][data-crit="fun"]');
  await i.fill('3.5'); await i.dispatchEvent('change'); await p.waitForTimeout(250);
  const v=await p.locator('input[data-track="bwl"][data-crit="fun"]').inputValue(); if(v!=='3.5') throw new Error('wert '+v); });

// Timeline
await t('Zeitplan Monate ändern', async()=>{ await p.click('[data-view="timeline"]'); await p.waitForTimeout(250);
  const i=p.locator('input[data-change="phase-months"]').first(); await i.fill('5'); await i.dispatchEvent('change'); await p.waitForTimeout(250);
  const v=await p.evaluate(()=>JSON.parse(localStorage.getItem('orientierungsjahr.v1')).timeline.phases[0].months);
  if(v!==5) throw new Error('months '+v); });

// Theme
await t('Theme wechseln', async()=>{ await p.click('.side [data-action="toggle-theme"]'); await p.waitForTimeout(150);
  const a=await p.evaluate(()=>document.documentElement.getAttribute('data-theme')); if(!a) throw new Error('kein data-theme'); });

// Export/Import/Reset
await t('Export enthält Daten', async()=>{ await p.click('[data-view="daten"]'); await p.waitForTimeout(250);
  const v=await p.locator('#exportBox').inputValue(); JSON.parse(v); if(v.length<500) throw new Error('zu kurz'); });
await t('Reset mit Abfrage', async()=>{ await p.click('[data-action="reset-ask"]'); await p.waitForTimeout(200);
  if(!(await p.locator('.modal').count())) throw new Error('keine Sicherheitsabfrage');
  await p.click('#modalForm button[type=submit]'); await p.waitForTimeout(300);
  const n=await p.evaluate(()=>JSON.parse(localStorage.getItem('orientierungsjahr.v1')).companies.length);
  if(n!==13) throw new Error('nach reset '+n); });
await t('Import stellt wieder her', async()=>{
  await p.click('[data-view="daten"]'); await p.waitForTimeout(250);
  await p.evaluate(()=>{ window.__d=JSON.stringify({companies:[{id:'x',name:'Import AG',city:'Celle',track:'bwl',status:'sent'}],applications:[],checklist:[],reviews:[]}); });
  await p.fill('#importBox', await p.evaluate(()=>window.__d));
  await p.click('[data-action="import-run"]'); await p.waitForTimeout(200);
  await p.click('#modalForm button[type=submit]'); await p.waitForTimeout(300);
  await p.click('[data-view="unternehmen"]'); await p.waitForTimeout(250);
  const n=await p.locator('#coList .row').count(); if(n!==1) throw new Error('rows '+n); });
await t('Persistenz nach Reload', async()=>{ await p.reload(); await p.waitForTimeout(400);
  const n=await p.evaluate(()=>JSON.parse(localStorage.getItem('orientierungsjahr.v1')).companies[0].name);
  if(n!=='Import AG') throw new Error(n); });

console.log(log.join('\n'));
console.log(errs.length? '\nFEHLER:\n'+errs.join('\n') : '\nkeine JS-Fehler');
await b.close();
