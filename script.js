async function main(){
  const res = await fetch('drinks.json');
  const data = await res.json();
  const app = document.getElementById('app');

  data.sections.forEach(section => {
    const sec = renderSection(section);
    app.appendChild(sec);
  });
}

function renderSection(section){
  const tpl = document.getElementById('card-tpl').content.cloneNode(true);
  tpl.querySelector('.section-title').textContent = section.name;

  const sizesWrap = tpl.querySelector('.sizes');
  const itemsWrap = tpl.querySelector('.items');

  (section.groups || []).forEach(g=>{
    if (g.sizeLabel){
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = g.sizeLabel;
      sizesWrap.appendChild(b);
    }
    (g.items || []).forEach(item=>{
      itemsWrap.appendChild(renderItem(item));
    });
  });

  return tpl;
}

function renderItem(item){
  const t = document.getElementById('item-tpl').content.cloneNode(true);
  t.querySelector('.card-title').textContent = item.name;

  const head = t.querySelector('.card-head');
  head.addEventListener('click', ()=>{
    const exp = head.getAttribute('aria-expanded') === 'true';
    head.setAttribute('aria-expanded', String(!exp));
  });

  const props = t.querySelector('.props');
  (item.props || []).forEach(p=>{
    const row = document.createElement('div');
    row.className = 'prop';
    row.innerHTML = `<span class="label">${p.k}</span><span class="val">${p.v}</span>`;
    props.appendChild(row);
  });

  const timers = t.querySelector('.timers');

  // FOOD (solo lista con icono)
  if (item.food){
    const div = document.createElement('div');
    div.className = 'food';
    div.innerHTML =
      `<svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
         <path d="M3 16c6-6 12 6 18 0" />
         <path d="M4 12c4-4 12 4 16 0" />
       </svg>
       <span>${item.name}</span>`;
    props.appendChild(div);
    timers.remove();
    return t;
  }

  // COFFEE timer
  if (item.timers && item.timers.coffee){
    timers.appendChild(makeTimer('Café', item.timers.coffee));
  }
  // MILK timer
  if (item.timers && item.timers.milk){
    timers.appendChild(makeTimer('Leche', item.timers.milk));
  }
  // TEA timer
  if (item.timers && item.timers.tea){
    // un solo timer ocupa todo el ancho
    timers.style.gridTemplateColumns = '1fr';
    timers.appendChild(makeTimer('Té', item.timers.tea));
  }

  return t;
}

function makeTimer(label, seconds){
  const box = document.createElement('div');
  box.className = 'timer';

  const name = document.createElement('span');
  name.className = 'tname';
  name.textContent = label;

  const val = document.createElement('span');
  val.className = 'tval';
  val.textContent = fmt(seconds);

  const btn = document.createElement('button');
  btn.textContent = 'Start';

  let left = seconds, id=null;

  btn.addEventListener('click', ()=>{
    if (id){ // stop
      clearInterval(id); id=null; btn.textContent='Start'; btn.classList.remove('stop'); left=seconds; val.textContent=fmt(left); return;
    }
    btn.textContent='Stop'; btn.classList.add('stop');
    left = seconds;
    val.textContent = fmt(left);
    id = setInterval(()=>{
      left--;
      if (left <= 0){
        clearInterval(id); id=null; btn.textContent='Start'; btn.classList.remove('stop'); left=seconds; val.textContent=fmt(left);
        beep();
      }else{
        val.textContent = fmt(left);
      }
    }, 1000);
  });

  box.appendChild(name);
  box.appendChild(val);
  box.appendChild(btn);
  return box;
}

function fmt(s){
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const ss = (s%60).toString().padStart(2,'0');
  return `${m}:${ss}`;
}

function beep(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type='sine'; o.frequency.value=880;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime+0.02);
    o.start();
    setTimeout(()=>{ g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.2); o.stop(ctx.currentTime+0.25); }, 220);
  }catch(e){}
}

main();
