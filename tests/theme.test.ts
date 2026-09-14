import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { readFileSync } from 'node:fs';
import { createThemePreferenceRepository, themeStorageKey, themeInitializationScript } from '../src/repositories/theme-preference-repository.ts';

test('first visit and invalid preference default to dark without a system-theme lookup', () => {
  for(const value of [null,'','system','LIGHT','garbage']) {
    const repository=createThemePreferenceRepository(()=>({getItem:()=>value,setItem:()=>{throw Error('Unexpected write');}}));
    assert.equal(repository.load(),'dark');
  }
});
test('both theme choices persist across repository recreation without touching collection data', () => {
  const saved=new Map([['boxscout:collection:v1','untouched collection']]);
  const storage={getItem:(key:string)=>saved.get(key)??null,setItem:(key:string,value:string)=>{saved.set(key,value);}};
  for(const theme of ['light','dark'] as const) {
    assert.equal(createThemePreferenceRepository(()=>storage).save(theme),true);
    assert.equal(createThemePreferenceRepository(()=>storage).load(),theme);
    assert.equal(saved.get('boxscout:collection:v1'),'untouched collection');
  }
  assert.equal(themeStorageKey,'boxscout:theme:v1');
});
test('storage denial falls back safely and never claims a successful save', () => {
  const denied=createThemePreferenceRepository(()=>{throw Error('Storage denied');});
  assert.equal(denied.load(),'dark');assert.equal(denied.save('light'),false);
  const quota=createThemePreferenceRepository(()=>({getItem:()=> 'light',setItem:()=>{throw Error('Quota exceeded');}}));
  assert.equal(quota.load(),'light');assert.equal(quota.save('dark'),false);
});
test('head initializer applies the same validated preference synchronously before hydration', () => {
  for(const value of [null,'light','dark','system','invalid']) {
    const document={documentElement:{dataset:{theme:'dark'}}};
    const localStorage={getItem:(key:string)=>{assert.equal(key,themeStorageKey);return value;}};
    runInNewContext(themeInitializationScript,{document,localStorage});
    assert.equal(document.documentElement.dataset.theme,value==='light'?'light':'dark');
  }
  const document={documentElement:{dataset:{theme:'light'}}};
  runInNewContext(themeInitializationScript,{document});
  assert.equal(document.documentElement.dataset.theme,'dark');
});
const luminance=(hex:string) => {
  const rgb=hex.match(/[a-f\d]{2}/gi)!.map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;
};
const contrast=(a:string,b:string)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
test('both token palettes meet readable text and meaningful-control contrast thresholds', () => {
  const css=readFileSync('src/app/globals.css','utf8');
  const palettes=[...css.matchAll(/:root(?:\[data-theme='light'\])?\s*\{([^}]+)\}/g)].map(m=>Object.fromEntries([...m[1].matchAll(/--([\w-]+):\s*(#[a-f\d]{6})/g)].map(v=>[v[1],v[2]])));
  assert.equal(palettes.length,2);
  const textPairs=[['ink','bg'],['ink','surface'],['muted','bg'],['muted','surface'],['muted','price-bg'],['green','bg'],['green','surface'],['image-ink','image-bg'],['image-ink','image-stripe'],['art-ink','art-bg'],['pitch-ink','pitch-bg'],['badge-ink','badge-bg'],['notice-ink','notice-bg'],['callout-ink','callout-bg'],['callout-muted','callout-bg'],['button-ink','accent'],['toggle-ink','toggle-bg'],['owned-ink','owned-bg'],['watching-ink','watching-bg']];
  for(const p of palettes) {
    for(const [fg,bg] of textPairs) assert.ok(contrast(p[fg],p[bg])>=4.5,`${fg}/${bg}: ${contrast(p[fg],p[bg]).toFixed(2)}`);
    for(const [fg,bg] of [['focus','bg'],['focus','surface'],['focus','image-bg'],['toggle-line','image-bg'],['input-line','surface'],['accent','callout-bg']]) assert.ok(contrast(p[fg],p[bg])>=3,`${fg}/${bg}: ${contrast(p[fg],p[bg]).toFixed(2)}`);
  }
});
