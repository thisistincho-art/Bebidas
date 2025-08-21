const { useState, useMemo, useEffect } = React;

/** ===========================
 * DATA (orden igual a la carta)
 * - ml base por bebida
 * - cup: "150" | "300" (tamaño de taza sugerido)
 * - timers: espressoSec, milkShakeSec, teaSec
 * - layers: visual de la taza (proporciones referenciadas a 300 ml)
 *   { name, ml, colorVar }
 * =========================== */

const DATA = [
  {
    section: "Café Solo",
    groups: [
      {
        cup: "150 ml",
        items: [
          { name: "Espresso", cup: "150", layers: [{name:"Espresso", ml:30, colorVar:"--cafe"}], timers:{espressoSec:25} },
          { name: "Lungo", cup: "150", layers: [{name:"Lungo", ml:60, colorVar:"--cafe"}], timers:{espressoSec:35} },
          { name: "Doppio", cup: "150", layers: [{name:"Doppio (2x)", ml:60, colorVar:"--cafe"}], timers:{espressoSec:25} },
          { name: "Doppio Lungo", cup: "150", layers: [{name:"Doppio Lungo", ml:120, colorVar:"--cafe"}], timers:{espressoSec:40} }
        ]
      },
      {
        cup: "300 ml",
        items: [
          { name: "Long Black (Americano)", cup: "300",
            layers: [
              {name:"Espresso", ml:60, colorVar:"--cafe"},
              {name:"Agua", ml:180, colorVar:"--agua"}
            ],
            timers:{espressoSec:25}
          },
          { name: "Filtrado", cup: "300",
            layers: [{name:"Café filtrado", ml:250, colorVar:"--cafe"}],
            timers:{} },
          { name: "Batch Brew", cup: "300",
            layers: [{name:"Batch brew", ml:200, colorVar:"--cafe"}],
            timers:{} }
        ]
      }
    ]
  },

  {
    section: "Café Fresco",
    groups: [
      {
        cup: "300 ml",
        items: [
          { name: "Cold Brew", cup: "300",
            layers:[{name:"Cold brew", ml:250, colorVar:"--cafe"}],
            timers:{} },
          { name: "Lemon Cold Brew", cup: "300",
            layers:[
              {name:"Cold brew", ml:200, colorVar:"--cafe"},
              {name:"Limón/Syrup", ml:50, colorVar:"--limon"}
            ],
            timers:{} },
          { name: "Flat White Frío", cup:"300",
            layers:[
              {name:"Espresso", ml:60, colorVar:"--cafe"},
              {name:"Leche", ml:180, colorVar:"--leche"}
            ],
            timers:{espressoSec:25, milkShakeSec:30}
          },
          { name: "Latte Frío", cup:"300",
            layers:[
              {name:"Espresso", ml:60, colorVar:"--cafe"},
              {name:"Leche", ml:180, colorVar:"--leche"}
            ],
            timers:{espressoSec:25, milkShakeSec:30}
          },
          { name: "Magic Frío", cup:"300",
            layers:[
              {name:"Doble Ristretto", ml:40, colorVar:"--cafe"},
              {name:"Leche", ml:160, colorVar:"--leche"}
            ],
            timers:{espressoSec:20, milkShakeSec:30}
          },
          { name: "Hoppy Espresso", cup:"300",
            layers:[
              {name:"Espresso", ml:60, colorVar:"--cafe"},
              {name:"Soda lupulada", ml:180, colorVar:"--lupulo"}
            ],
            timers:{espressoSec:25}
          }
        ]
      }
    ]
  },

  {
    section: "Tés",
    groups: [
      {
        cup: "300 ml",
        items: [
          { name:"Té negro Taragüi (saquito 2g)", cup:"300",
            layers:[{name:"Agua hervida", ml:200, colorVar:"--te-negro"}],
            timers:{teaSec:240} },
          { name:"Mate cocido (saquito)", cup:"300",
            layers:[{name:"Agua hervida", ml:200, colorVar:"--te-negro"}],
            timers:{teaSec:240} },
          { name:"Digestivo Cachamai (hierbas)", cup:"300",
            layers:[{name:"Agua hervida", ml:200, colorVar:"--te-hierbas"}],
            timers:{teaSec:240} },
          { name:"Earl Grey (saquito)", cup:"300",
            layers:[{name:"Agua hervida", ml:200, colorVar:"--earl"}],
            timers:{teaSec:240} }
        ]
      }
    ]
  },

  {
    section: "Café con Leche",
    groups: [
      {
        cup: "150 ml",
        items: [
          { name:"Macchiato", cup:"150",
            layers:[
              {name:"Espresso", ml:30, colorVar:"--cafe"},
              {name:"Leche/espuma", ml:30, colorVar:"--leche"}
            ],
            timers:{espressoSec:25, milkShakeSec:15} },
          { name:"Magic (doble ristretto)", cup:"150",
            layers:[
              {name:"Doble Ristretto", ml:40, colorVar:"--cafe"},
              {name:"Leche", ml:80, colorVar:"--leche"}
            ],
            timers:{espressoSec:20, milkShakeSec:20} },
          { name:"Cappuccino", cup:"150",
            layers:[
              {name:"Espresso", ml:30, colorVar:"--cafe"},
              {name:"Leche", ml:120, colorVar:"--leche"}
            ],
            timers:{espressoSec:25, milkShakeSec:25} },
          { name:"Flat White", cup:"150",
            layers:[
              {name:"Doppio (2x)", ml:60, colorVar:"--cafe"},
              {name:"Leche", ml:90, colorVar:"--leche"}
            ],
            timers:{espressoSec:25, milkShakeSec:20} }
        ]
      },
      {
        cup: "300 ml",
        items: [
          { name:"Latte", cup:"300",
            layers:[
              {name:"Doppio (2x)", ml:60, colorVar:"--cafe"},
              {name:"Leche", ml:210, colorVar:"--leche"}
            ],
            timers:{espressoSec:25, milkShakeSec:30} },
          { name:"Mocaccino", cup:"300",
            layers:[
              {name:"Espresso", ml:60, colorVar:"--cafe"},
              {name:"Leche", ml:180, colorVar:"--leche"},
              {name:"Chocolate", ml:30, colorVar:"--choc"}
            ],
            timers:{espressoSec:25, milkShakeSec:30} },
          { name:"Vainilla Latte", cup:"300",
            layers:[
              {name:"Espresso", ml:60, colorVar:"--cafe"},
              {name:"Leche", ml:180, colorVar:"--leche"},
              {name:"Vainilla", ml:30, colorVar:"--vainilla"}
            ],
            timers:{espressoSec:25, milkShakeSec:30} }
        ]
      }
    ]
  }
];

/** ===== util: simple countdown ===== */
function useTimer(initialSec=0){
  const [sec,setSec]=useState(initialSec);
  const [running,setRunning]=useState(false);
  useEffect(()=>{
    if(!running) return;
    const id=setInterval(()=>setSec(s=> {
      if(s<=1){ clearInterval(id); setRunning(false); return 0; }
      return s-1;
    }),1000);
    return ()=>clearInterval(id);
  },[running]);
  const start=(s)=>{ setSec(s); setRunning(true); };
  const stop=()=>setRunning(false);
  const mm = String(Math.floor(sec/60)).padStart(2,"0");
  const ss = String(sec%60).padStart(2,"0");
  return {sec,display:`${mm}:${ss}`,running,start,stop};
}

/** ===== Cup visualization (reference 300 ml) ===== */
function Cup({layers}){
  // calc heights relative to 300ml
  const totalRef = 300;
  let y=160; // bottom
  return (
    <div className="cup" aria-label="taza 300ml">
      {layers.map((l,i)=>{
        const h = Math.max(2, Math.round(160*(l.ml/totalRef)));
        y -= h;
        const style={
          height: h+"px",
          bottom: (160 - h - (layers.slice(i+1).reduce((a,b)=>a+Math.round(160*(b.ml/totalRef)),0)))+"px",
          background: `var(${l.colorVar})`,
          opacity:.95
        };
        return <div key={i} className="layer" style={style}></div>;
      })}
      <div className="layer-label">{Math.round(layers.reduce((a,b)=>a+b.ml,0))} ml</div>
    </div>
  );
}

/** ===== Card ===== */
function DrinkCard({item}){
  const [open,setOpen]=useState(false);
  const espTimer = useTimer(item.timers?.espressoSec || 0);
  const milkTimer= useTimer(item.timers?.milkShakeSec || 0);
  const teaTimer = useTimer(item.timers?.teaSec || 0);

  return (
    <div className="card">
      <div className="cardTitle" onClick={()=>setOpen(!open)} style={{cursor:"pointer"}}>
        <span>{item.name}</span>
        <span className="badge">{item.cup}</span>
      </div>
      {open && (
        <div className="details">
          <div className="rowSplit">
            <Cup layers={item.layers}/>
            <div>
              {item.layers.map((l,i)=>(
                <span key={i} className="pill">{l.name}: {l.ml} ml</span>
              ))}
              <div className="note">La taza visualiza proporciones sobre una referencia de 300 ml.</div>
            </div>
          </div>

          {/* Timers */}
          {item.timers?.espressoSec ? (
            <div className="row">
              <button className="btn" onClick={()=>espTimer.start(item.timers.espressoSec)}>Timer espresso</button>
              <div className="time">{espTimer.display}</div>
            </div>
          ):null}

          {item.timers?.milkShakeSec ? (
            <div className="row">
              <button className="btn" onClick={()=>milkTimer.start(item.timers.milkShakeSec)}>Batir leche</button>
              <div className="time">{milkTimer.display}</div>
            </div>
          ):null}

          {item.timers?.teaSec ? (
            <div className="row">
              <button className="btn" onClick={()=>teaTimer.start(item.timers.teaSec)}>Infusión</button>
              <div className="time">{teaTimer.display}</div>
            </div>
          ):null}
        </div>
      )}
    </div>
  );
}

/** ===== Section ===== */
function Section({section}){
  return (
    <div className="section">
      <h2>{section.section}</h2>

      {section.groups.map((g,idx)=>(
        <div key={idx}>
          <div className="sizeBlock">{g.cup}</div>
          <div className="grid">
            {g.items.map((it,i)=> <DrinkCard key={i} item={it}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function App(){
  return (
    <div className="container">
      <h1>Barista Minimal</h1>
      {DATA.map((sec,i)=> <Section key={i} section={sec}/>)}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
