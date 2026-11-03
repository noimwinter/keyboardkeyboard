'use strict';
const DEMO='C4 E4 G4 E4 D4 F4 A4 G4 E4 G4 C5 B4 A4 G4 E4 D4 C4 D4 E4 G4 F4 D4 C4 C4';
const $=id=>document.getElementById(id);
function parseNotes(text){
 const tokens=text.trim().split(/[\s,]+/).filter(Boolean);
 if(!tokens.length)throw Error('Add at least one note.');
 if(tokens.length>10000)throw Error('Please use 10,000 notes or fewer.');
 return tokens.map((token,i)=>{const m=/^([A-Ga-g])([#b]?)([0-8])$/.exec(token);if(!m)throw Error(`Note ${i+1}: “${token}” is invalid. Try C4, F#4 or Bb4.`);
 const midi=(Number(m[3])+1)*12+({C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1].toUpperCase()])+(m[2]==='#'?1:m[2]==='b'?-1:0);
 if(midi<21||midi>108)throw Error(`Note ${i+1} is outside A0–C8.`);
 return {name:m[1].toUpperCase()+m[2]+m[3],midi};});
}
function fromMidi(midi){return {midi,name:['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][midi%12]+(Math.floor(midi/12)-1)};}
function eventFromPitches(pitches){return {pitches,name:pitches.map(n=>n.name).join(' + ')}}
function parseSequence(text){return text.trim().split(/[\s,]+/).filter(Boolean).map(token=>{if(token.split('+').some(n=>!n))throw Error('Use C4+E4 for a chord, with no empty notes.');const pitches=parseNotes(token.split('+').join(' '));if(pitches.length>16)throw Error('Use 16 notes or fewer in a chord.');return eventFromPitches(pitches);});}
const LIBRARY=window.PIECE_LIBRARY;
function pieceNotes(id){return LIBRARY[id].events.map(e=>({...eventFromPitches(e.pitches.map(fromMidi)),tick:e.tick}));}
const LISZT=pieceNotes('liszt');
let notes=LISZT.slice(),index=0,playing=false,ctx,master,voices=[],held=new Set(),loading=false,requestId=0;
const samples=new Map();
let samplePromise;
async function audioReady(){
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!Audio)throw Error('This browser does not support Web Audio. Try a recent browser.');
 if(!ctx){ctx=new Audio();master=ctx.createGain();master.gain.value=Number($('volume').value)/100*.8;
 const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-12;compressor.knee.value=20;compressor.ratio.value=4;master.connect(compressor);compressor.connect(ctx.destination);}
 await ctx.resume();
 if(!samplePromise){samplePromise=(async()=>{
  const bank=Object.entries(window.PIANO_SAMPLES||{});if(bank.length!==30)throw Error('Grand piano files are missing. Reload the page or restore samples.js.');
  let loaded=0;
  await Promise.all(bank.map(async([file,data])=>{
   const midi=parseNotes(file.replace('.mp3','').replace('s','#'))[0].midi;
   if(!samples.has(midi)){const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));samples.set(midi,await ctx.decodeAudioData(bytes.buffer));}
   loaded++;$('sound-status').textContent=`Loading grand piano · ${loaded}/${bank.length}`;
  }));
  $('sound-status').textContent='Yamaha C5 grand · ready';
 })().catch(e=>{samplePromise=null;throw e;});}
 await samplePromise;
}
function silence(){for(const v of voices){try{v.source.stop();}catch{}}voices=[];}
function sound(midi,t=ctx.currentTime){
 if(voices.length>=32){const oldest=voices.shift();oldest.gain.gain.cancelScheduledValues(t);oldest.gain.gain.setTargetAtTime(0,t,.015);oldest.source.stop(t+.08);}
 const root=[...samples.keys()].reduce((best,n)=>Math.abs(n-midi)<Math.abs(best-midi)?n:best);
 const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=samples.get(root);source.playbackRate.value=2**((midi-root)/12);
 const duration=Math.min(source.buffer.duration/source.playbackRate.value,7);
 gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.8,t+.003);gain.gain.setValueAtTime(.8,t+Math.max(.004,duration-.35));gain.gain.linearRampToValueAtTime(0,t+duration);
 source.connect(gain);gain.connect(master);source.start(t);source.stop(t+duration);
 const voice={source,gain};voices.push(voice);source.onended=()=>{source.disconnect();gain.disconnect();voices=voices.filter(v=>v!==voice);};
}
function render(){const done=index===notes.length; $('current').textContent=index?notes[index-1].name:'—';$('status').textContent=loading?'Loading…':done?'Complete':playing?'Playing':'Paused';$('play').disabled=loading;$('play').textContent=loading?'Loading grand…':playing?'Ⅱ Pause':done?'↺ Play again':'▶ Play';$('count').textContent=`${index} / ${notes.length} presses`;$('percent').textContent=Math.round(index/notes.length*100)+'%';$('progress').max=notes.length;$('progress').value=index;$('tap').disabled=!playing;$('hint').textContent=done?'Beautifully done. Play again whenever you like.':playing?'Press any key · you set the pace':'Press Play to continue';$('upcoming').replaceChildren(...notes.slice(index,index+7).map(n=>{const e=document.createElement('span');e.className='chip';e.textContent=n.name;return e;}));document.querySelectorAll('[data-midi]').forEach(k=>k.classList.toggle('active',index>0&&notes[index-1].pitches.some(n=>n.midi===Number(k.dataset.midi))));}
function step(){if(!playing||index>=notes.length)return;if(!ctx||ctx.state!=='running'){playing=false;$('message').textContent='Audio was interrupted. Press Play to resume.';render();return;}const when=ctx.currentTime+.01;notes[index].pitches.forEach(n=>sound(n.midi,when));index++;if(index===notes.length){playing=false;$('announcement').textContent='Song complete.';}render();}
$('play').onclick=async()=>{
 if(playing){requestId++;playing=false;silence();render();return;}
 const ticket=++requestId;loading=true;render();
 try{await audioReady();if(ticket!==requestId)return;if(index===notes.length)index=0;playing=true;$('stage').focus();}
 catch(e){if(ticket===requestId){$('message').textContent='Could not load grand piano. '+e.message;$('sound-status').textContent='Audio unavailable · press Play to retry';}}
 finally{if(ticket===requestId){loading=false;render();}}
};
function pauseAndReset(){requestId++;loading=false;index=0;playing=false;silence();}
$('reset').onclick=()=>{pauseAndReset();render();};
$('tap').onclick=()=>{step();$('stage').focus();};
$('volume').oninput=()=>{if(master)master.gain.setTargetAtTime(Number($('volume').value)/100*.8,ctx.currentTime,.02);};
function setSong(parsed,title,credit,choice){
 pauseAndReset();notes=parsed;$('title').textContent=title;$('credit').textContent=credit+` · ${notes.length.toLocaleString()} presses`;
 $('song').value=choice;$('sequence').value=notes.map(e=>e.pitches.map(n=>n.name).join('+')).join(' ');
 $('piece-note').textContent=LIBRARY[choice]?'Both hands play together when their notes start together. Later notes wait for your next press, even after a rest.':'One musical moment per press. Notes joined with + play together; spaces separate presses.';
 $('message').textContent=`Loaded ${notes.length.toLocaleString()} presses. Press Play when ready.`;render();
}
function load(text,demo=false){try{const parsed=parseSequence(text);if(!parsed.length)throw Error('Add at least one note.');if(parsed.length>10000)throw Error('Please use 10,000 presses or fewer.');setSong(parsed,demo?'Morning Steps':'Your melody',demo?'An original melody':'Custom sequence',demo?'demo':'custom');}catch(e){$('message').textContent=e.message;}}
$('load').onclick=()=>load($('sequence').value);$('demo').onclick=()=>load(DEMO,true);
function choosePiece(id){const piece=LIBRARY[id];if(piece)setSong(pieceNotes(id),piece.title,piece.credit,id);else load(DEMO,true);}
$('song').replaceChildren(...Object.entries(LIBRARY).map(([id,piece])=>{const option=document.createElement('option');option.value=id;option.textContent=piece.title;return option;}),...['demo','custom'].map(id=>{const option=document.createElement('option');option.value=id;option.textContent=id==='demo'?'Morning Steps · Original demo':'Custom sequence';option.disabled=id==='custom';return option;}));
$('song').onchange=()=>choosePiece($('song').value);
document.addEventListener('keydown',e=>{const code=e.code||e.key;if(e.repeat||held.has(code))return;held.add(code);if(e.isComposing||e.target.closest('input,textarea,select,button,a,[contenteditable="true"]'))return;if(!playing)return;e.preventDefault();step();});
document.addEventListener('keyup',e=>held.delete(e.code||e.key));
function loseFocus(){held.clear();if(playing||loading){requestId++;loading=false;playing=false;silence();render();}}
window.addEventListener('blur',loseFocus);document.addEventListener('visibilitychange',()=>{if(document.hidden)loseFocus();});
let whiteCount=0;for(let midi=60;midi<=83;midi++){const black=[1,3,6,8,10].includes(midi%12);const key=document.createElement('div');key.dataset.midi=midi;key.className=black?'black':'white';if(black)key.style.left=`${whiteCount/14*100}%`;else{whiteCount++;if(midi%12===0)key.textContent='C'+(Math.floor(midi/12)-1);}$('keys').appendChild(key);}choosePiece('liszt');
