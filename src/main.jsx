import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{Home,Dumbbell,Utensils,Scale,ChartNoAxesColumnIncreasing,Plus,Check,ChevronRight}from'lucide-react';
import'./style.css';

const days=['Üst Güç','Alt Güç','Üst Pump','Alt Pump'];
const initial={weight:'85.2',protein:0,calories:0,water:0,workout:0,meals:[]};
function App(){
 const[tab,setTab]=useState('Bugün');const[data,setData]=useState(()=>JSON.parse(localStorage.getItem('cezeri-today')||'null')||initial);
 useEffect(()=>localStorage.setItem('cezeri-today',JSON.stringify(data)),[data]);
 const p=Math.min(100,Math.round(data.protein/150*100)),k=Math.min(100,Math.round(data.calories/1900*100));
 return <div className="app"><header><div><small>17 TEMMUZ, CUMA</small><h1>Günaydın, Mustafa</h1></div><div className="avatar">MG</div></header>
 <main>{tab==='Bugün'&&<><section className="hero"><span>CEZERİ KOÇ</span><h2>Bugünkü hedefin net.</h2><p>Protein hedefini tamamla, 3 litre suyunu iç. Bugün antrenman varsa setlerini eksiksiz kaydet.</p><button onClick={()=>setTab('Antrenman')}>Planı aç <ChevronRight size={18}/></button></section>
 <h3>Günlük durum</h3><div className="metrics"><Metric value={`${data.weight} kg`} label="Sabah kilosu" color="#bf8cff"/><Metric value={`${data.protein}/150 g`} label="Protein" color="#39d98a" progress={p}/><Metric value={`${data.calories}/1900`} label="Kalori" color="#ffb44a" progress={k}/><Metric value={`${data.water}/3 L`} label="Su" color="#57b8ff" progress={data.water/3*100}/></div>
 <div className="rowhead"><h3>Bugünün adımları</h3><small>{[data.weight,data.meals.length,data.workout].filter(Boolean).length}/3 tamamlandı</small></div>
 <Task icon={<Scale/>} title="Sabah tartısı" detail="Tuvalet sonrası, aç karnına" done={!!data.weight} action={()=>{const v=prompt('Sabah kilon (kg)',data.weight);if(v)setData({...data,weight:v})}}/>
 <Task icon={<Utensils/>} title="Öğünlerini kaydet" detail={`${data.meals.length} öğün • ${data.protein} g protein`} done={data.meals.length>=3} action={()=>setTab('Beslenme')}/>
 <Task icon={<Dumbbell/>} title="Antrenman" detail="Programından devam et" done={!!data.workout} action={()=>setTab('Antrenman')}/></>}
 {tab==='Beslenme'&&<Nutrition data={data} setData={setData}/>} {tab==='Antrenman'&&<Training data={data} setData={setData}/>} {tab==='İlerleme'&&<Progress data={data}/>}</main>
 <nav>{[['Bugün',Home],['Beslenme',Utensils],['Antrenman',Dumbbell],['İlerleme',ChartNoAxesColumnIncreasing]].map(([n,I])=><button className={tab===n?'on':''} onClick={()=>setTab(n)}><I/><span>{n}</span></button>)}</nav></div>
}
function Metric({value,label,color,progress=100}){return <div className="metric"><b>{value}</b><small>{label}</small><i><em style={{width:`${progress}%`,background:color}}/></i></div>}
function Task({icon,title,detail,done,action}){return <button className="task" onClick={action}><i className={done?'done':''}>{done?<Check/>:icon}</i><span><b>{title}</b><small>{detail}</small></span><ChevronRight/></button>}
function Nutrition({data,setData}){const add=()=>{const name=prompt('Öğün adı (örn. kahvaltı)');if(!name)return;const protein=+prompt('Tahmini protein (g)',30)||0;const calories=+prompt('Tahmini kalori',400)||0;setData({...data,protein:data.protein+protein,calories:data.calories+calories,meals:[...data.meals,{name,protein,calories}]})};return <><div className="pagehead"><div><small>BESLENME</small><h2>Bugünün öğünleri</h2></div><button className="round" onClick={add}><Plus/></button></div><div className="summary"><Metric value={`${data.protein} g`} label="Toplam protein" color="#39d98a" progress={data.protein/150*100}/><Metric value={`${data.calories}`} label="Toplam kalori" color="#ffb44a" progress={data.calories/1900*100}/></div>{data.meals.length?data.meals.map((m,i)=><div className="meal"><Utensils/><span><b>{m.name}</b><small>{m.calories} kcal • {m.protein} g protein</small></span></div>):<Empty text="İlk öğününü ekle. Fotoğrafla analiz sonraki bağlantıda aktif olacak."/>}<button className="primary" onClick={add}><Plus/> Öğün ekle</button></>}
function Training({data,setData}){const[day,setDay]=useState(0);return <><div className="pagehead"><div><small>ANTRENMAN</small><h2>4 günlük programın</h2></div></div><div className="days">{days.map((d,i)=><button className={day===i?'active':''} onClick={()=>setDay(i)}><small>GÜN {i+1}</small><b>{d}</b></button>)}</div><div className="workcard"><Dumbbell/><div><small>BUGÜNÜN ANTRENMANI</small><h2>{days[day]}</h2><p>Set, tekrar ve kullandığın ağırlıkları burada kaydedeceğiz.</p></div></div><button className="primary" onClick={()=>setData({...data,workout:data.workout?0:1})}>{data.workout?<Check/>:<Dumbbell/>}{data.workout?'Antrenman tamamlandı':'Antrenmana başla'}</button></>}
function Progress({data}){return <><div className="pagehead"><div><small>İLERLEME</small><h2>Sonuçların</h2></div></div><div className="bigstat"><small>GÜNCEL KİLO</small><b>{data.weight} kg</b><p>Başlangıç 99.6 kg • Toplam −{(99.6-Number(data.weight)).toFixed(1)} kg</p></div><h3>Hedefler</h3><Task icon={<Scale/>} title="İlk hedef: 84 kg" detail={`${Math.max(0,Number(data.weight)-84).toFixed(1)} kg kaldı`} done={Number(data.weight)<=84}/><Task icon={<Scale/>} title="Ana hedef: 80 kg" detail={`${Math.max(0,Number(data.weight)-80).toFixed(1)} kg kaldı`} done={Number(data.weight)<=80}/></>}
function Empty({text}){return <div className="empty"><Utensils/><p>{text}</p></div>}
createRoot(document.getElementById('root')).render(<App/>);
