import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  Dumbbell,
  Utensils,
  Scale,
  ChartNoAxesColumnIncreasing,
  Plus,
  Check,
  ChevronRight,
  Pencil,
  Trash2,
  Droplets,
  Minus,
} from "lucide-react";
import "./style.css";
import "./extra.css";
import "./training.css";
import "./v4.css";
import { NutritionV4, TrainingV4 } from "./v4.jsx";
const days = ["Üst Güç", "Alt Güç", "Üst Pump", "Alt Pump"],
  program = [
    [
      { n: "Bench Press", t: "4 × 6–8" },
      { n: "Seated Cable Row", t: "4 × 8–10" },
      { n: "Shoulder Press DB", t: "3 × 8–10" },
      { n: "Lat Pulldown Wide Grip", t: "3 × 8–10" },
      { n: "Incline DB Press", t: "3 × 10–12" },
      { n: "Biceps Curl DB", t: "3 × 10–12" },
      { n: "Triceps Pushdown", t: "3 × 10–12" },
    ],
    [
      { n: "Squat Barbell", t: "4 × 6–8" },
      { n: "Romanian Deadlift", t: "4 × 6–8" },
      { n: "Leg Press", t: "3 × 10–12" },
      { n: "Leg Curl Seated", t: "3 × 10–12" },
      { n: "Standing Calf Raise DB", t: "4 × 12–15" },
      { n: "Mountain Climber", t: "3 × 20" },
    ],
    [
      { n: "Incline DB Bench Press", t: "3 × 10–12" },
      { n: "Lat Pulldown Wide Grip", t: "3 × 10–12" },
      { n: "Lateral Raise DB", t: "4 × 12–15" },
      { n: "Reverse Pec Deck", t: "4 × 12–15" },
      { n: "Cable Fly / Pec Deck", t: "3 × 12–15" },
      { n: "Hammer Curl DB", t: "3 × 10–12" },
      { n: "Triceps Pushdown", t: "3 × 12–15" },
      { n: "Bench Press Barbell", t: "3 × 8" },
    ],
    [
      { n: "Seated Leg Press", t: "4 × 10–12" },
      { n: "Romanian Deadlift", t: "3 × 8–10" },
      { n: "Leg Extension", t: "3 × 12–15" },
      { n: "Leg Curl Seated", t: "3 × 12–15" },
      { n: "Standing Calf Raise DB", t: "4 × 12–15" },
      { n: "Mountain Climber", t: "3 × 20" },
    ],
  ],
  iso = () => new Date().toLocaleDateString("en-CA");
const blank = (weight = "") => ({
  date: iso(),
  weight,
  water: 0,
  workout: 0,
  meals: [],
  weightHistory: weight ? [{ date: iso(), weight }] : [],
  workoutSession: {},
  workoutHistory: [],
});
const migrate = () => {
  const old = JSON.parse(localStorage.getItem("cezeri-today") || "null");
  if (!old) return blank();
  const data = { ...blank(old.weight || ""), ...old, date: old.date || iso() };
  data.meals = (old.meals || []).map((m, i) => ({
    ...m,
    id: m.id || `${Date.now()}-${i}`,
  }));
  data.weightHistory =
    old.weightHistory ||
    (old.weight ? [{ date: iso(), weight: old.weight }] : []);
  data.workoutSession = old.workoutSession || {};
  data.workoutHistory = old.workoutHistory || [];
  return data.date === iso()
    ? data
    : {
        ...blank(data.weight),
        weightHistory: data.weightHistory,
        workoutHistory: data.workoutHistory,
      };
};
const totals = (d) =>
  d.meals.reduce(
    (a, m) => ({
      protein: a.protein + Number(m.protein || 0),
      calories: a.calories + Number(m.calories || 0),
    }),
    { protein: 0, calories: 0 },
  );
function App() {
  const [tab, setTab] = useState("Bugün"),
    [data, setData] = useState(migrate);
  useEffect(
    () => localStorage.setItem("cezeri-today", JSON.stringify(data)),
    [data],
  );
  const { protein, calories } = totals(data),
    p = Math.min(100, (protein / 150) * 100),
    k = Math.min(100, (calories / 1900) * 100),
    dateLabel = new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "long",
    })
      .format(new Date())
      .toLocaleUpperCase("tr-TR");
  const setWeight = () => {
    const v = prompt("Sabah kilon (kg)", data.weight);
    if (!v || isNaN(Number(v.replace(",", ".")))) return;
    const weight = v.replace(",", "."),
      weightHistory = [
        ...(data.weightHistory || []).filter((x) => x.date !== iso()),
        { date: iso(), weight },
      ];
    setData({ ...data, weight, weightHistory });
  };
  return (
    <div className="app">
      <header>
        <div>
          <small>{dateLabel}</small>
          <h1>Günaydın, Mustafa</h1>
        </div>
        <div className="avatar">MG</div>
      </header>
      <main>
        {tab === "Bugün" && (
          <>
            <section className="hero">
              <span>CEZERİ KOÇ</span>
              <h2>Bugünkü hedefin net.</h2>
              <p>
                Protein hedefini tamamla, 3 litre suyunu iç. Bugün antrenman
                varsa setlerini eksiksiz kaydet.
              </p>
              <button onClick={() => setTab("Antrenman")}>
                Planı aç <ChevronRight size={18} />
              </button>
            </section>
            <h3>Günlük durum</h3>
            <div className="metrics">
              <Metric
                value={data.weight ? `${data.weight} kg` : "—"}
                label="Sabah kilosu"
                color="#bf8cff"
                progress={data.weight ? 100 : 0}
              />
              <Metric
                value={`${protein}/150 g`}
                label="Protein"
                color="#39d98a"
                progress={p}
              />
              <Metric
                value={`${calories}/1900`}
                label="Kalori"
                color="#ffb44a"
                progress={k}
              />
              <Metric
                value={`${data.water.toFixed(2).replace(/\.00$/, "")} / 3 L`}
                label="Su"
                color="#57b8ff"
                progress={(data.water / 3) * 100}
              />
            </div>
            <Water data={data} setData={setData} />
            <div className="rowhead">
              <h3>Bugünün adımları</h3>
              <small>
                {
                  [data.weight, data.meals.length, data.workout].filter(Boolean)
                    .length
                }
                /3 tamamlandı
              </small>
            </div>
            <Task
              icon={<Scale />}
              title="Sabah tartısı"
              detail="Tuvalet sonrası, aç karnına"
              done={!!data.weight}
              action={setWeight}
            />
            <Task
              icon={<Utensils />}
              title="Öğünlerini kaydet"
              detail={`${data.meals.length} öğün • ${protein} g protein`}
              done={data.meals.length >= 3}
              action={() => setTab("Beslenme")}
            />
            <Task
              icon={<Dumbbell />}
              title="Antrenman"
              detail="Programından devam et"
              done={!!data.workout}
              action={() => setTab("Antrenman")}
            />
          </>
        )}
        {tab === "Beslenme" && <NutritionV4 data={data} setData={setData} />}{" "}
        {tab === "Antrenman" && <TrainingV4 data={data} setData={setData} />}{" "}
        {tab === "İlerleme" && <Progress data={data} />}
      </main>
      <nav>
        {[
          ["Bugün", Home],
          ["Beslenme", Utensils],
          ["Antrenman", Dumbbell],
          ["İlerleme", ChartNoAxesColumnIncreasing],
        ].map(([n, I]) => (
          <button
            key={n}
            className={tab === n ? "on" : ""}
            onClick={() => setTab(n)}
          >
            <I />
            <span>{n}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
function Metric({ value, label, color, progress = 100 }) {
  return (
    <div className="metric">
      <b>{value}</b>
      <small>{label}</small>
      <i>
        <em
          style={{ width: `${Math.min(100, progress)}%`, background: color }}
        />
      </i>
    </div>
  );
}
function Task({ icon, title, detail, done, action }) {
  return (
    <button className="task" onClick={action}>
      <i className={done ? "done" : ""}>{done ? <Check /> : icon}</i>
      <span>
        <b>{title}</b>
        <small>{detail}</small>
      </span>
      <ChevronRight />
    </button>
  );
}
function Water({ data, setData }) {
  const change = (n) =>
    setData({
      ...data,
      water: Math.max(0, Math.min(5, Math.round((data.water + n) * 100) / 100)),
    });
  return (
    <section className="water">
      <div>
        <Droplets />
        <span>
          <b>Su takibi</b>
          <small>Her bardak 250 ml</small>
        </span>
      </div>
      <div className="waterbuttons">
        <button onClick={() => change(-0.25)}>
          <Minus />
        </button>
        <b>{Math.round(data.water * 1000)} ml</b>
        <button onClick={() => change(0.25)}>
          <Plus />
        </button>
      </div>
    </section>
  );
}
function Nutrition({ data, setData }) {
  const ask = (m = { name: "", protein: 30, calories: 400 }) => {
    const name = prompt("Öğün adı (örn. kahvaltı)", m.name);
    if (!name) return;
    const protein = Number(prompt("Tahmini protein (g)", m.protein)),
      calories = Number(prompt("Tahmini kalori", m.calories));
    if (Number.isNaN(protein) || Number.isNaN(calories)) return;
    return { name, protein, calories };
  };
  const add = () => {
      const m = ask();
      if (m)
        setData({
          ...data,
          meals: [...data.meals, { ...m, id: crypto.randomUUID() }],
        });
    },
    edit = (m) => {
      const n = ask(m);
      if (n)
        setData({
          ...data,
          meals: data.meals.map((x) => (x.id === m.id ? { ...x, ...n } : x)),
        });
    },
    remove = (m) => {
      if (confirm(`${m.name} öğününü silmek istiyor musun?`))
        setData({ ...data, meals: data.meals.filter((x) => x.id !== m.id) });
    },
    t = totals(data);
  return (
    <>
      <div className="pagehead">
        <div>
          <small>BESLENME</small>
          <h2>Bugünün öğünleri</h2>
        </div>
        <button className="round" onClick={add}>
          <Plus />
        </button>
      </div>
      <div className="summary">
        <Metric
          value={`${t.protein} g`}
          label="Toplam protein"
          color="#39d98a"
          progress={(t.protein / 150) * 100}
        />
        <Metric
          value={`${t.calories}`}
          label="Toplam kalori"
          color="#ffb44a"
          progress={(t.calories / 1900) * 100}
        />
      </div>
      {data.meals.length ? (
        data.meals.map((m) => (
          <div className="meal" key={m.id}>
            <Utensils />
            <span>
              <b>{m.name}</b>
              <small>
                {m.calories} kcal • {m.protein} g protein
              </small>
            </span>
            <button onClick={() => edit(m)}>
              <Pencil />
            </button>
            <button className="danger" onClick={() => remove(m)}>
              <Trash2 />
            </button>
          </div>
        ))
      ) : (
        <Empty text="İlk öğününü ekle. Fotoğraf analizini sonraki sürümde bağlayacağız." />
      )}
      <button className="primary" onClick={add}>
        <Plus /> Öğün ekle
      </button>
    </>
  );
}
function Training({ data, setData }) {
  const [day, setDay] = useState(0),
    key = `day-${day}`,
    session = data.workoutSession || {},
    sets = session[key] || {};
  const addSet = (e) => {
    const weight = prompt(`${e.n} — kullandığın kilo`, "");
    if (weight === null) return;
    const reps = prompt(
      `${e.n} — yaptığın tekrar`,
      e.t.includes("20") ? "20" : "10",
    );
    if (reps === null) return;
    const next = {
      ...session,
      [key]: {
        ...sets,
        [e.n]: [
          ...(sets[e.n] || []),
          { weight: weight.replace(",", "."), reps },
        ],
      },
    };
    setData({ ...data, workoutSession: next });
  };
  const removeSet = (name, i) =>
    setData({
      ...data,
      workoutSession: {
        ...session,
        [key]: { ...sets, [name]: sets[name].filter((_, x) => x !== i) },
      },
    });
  const finish = () => {
    const entry = { date: iso(), day, name: days[day], sets };
    setData({
      ...data,
      workout: 1,
      workoutSession: { ...session, [key]: sets },
      workoutHistory: [
        ...(data.workoutHistory || []).filter(
          (x) => !(x.date === iso() && x.day === day),
        ),
        entry,
      ],
    });
  };
  return (
    <>
      <div className="pagehead">
        <div>
          <small>ANTRENMAN</small>
          <h2>4 günlük programın</h2>
        </div>
      </div>
      <div className="days">
        {days.map((d, i) => (
          <button
            key={d}
            className={day === i ? "active" : ""}
            onClick={() => setDay(i)}
          >
            <small>GÜN {i + 1}</small>
            <b>{d}</b>
          </button>
        ))}
      </div>
      <div className="workcard">
        <Dumbbell />
        <div>
          <small>BUGÜNÜN ANTRENMANI</small>
          <h2>{days[day]}</h2>
          <p>Her setten sonra kilo ve tekrarını kaydet.</p>
        </div>
      </div>
      <div className="exercises">
        {program[day].map((e) => (
          <section className="exercise" key={e.n}>
            <div className="exercisehead">
              <span>
                <b>{e.n}</b>
                <small>Hedef: {e.t}</small>
              </span>
              <button onClick={() => addSet(e)}>
                <Plus /> Set
              </button>
            </div>
            {(sets[e.n] || []).map((s, i) => (
              <div className="setrow" key={i}>
                <i>{i + 1}</i>
                <span>
                  <b>{s.weight || "Vücut"} kg</b>
                  <small>{s.reps} tekrar</small>
                </span>
                <button onClick={() => removeSet(e.n, i)}>
                  <Trash2 />
                </button>
              </div>
            ))}
          </section>
        ))}
      </div>
      <button className="primary" onClick={finish}>
        <Check /> Antrenmanı tamamla
      </button>
      {(data.workoutHistory || []).length > 0 && (
        <p className="saved">
          Toplam {data.workoutHistory.length} antrenman kaydı saklandı.
        </p>
      )}
    </>
  );
}
function Progress({ data }) {
  const h = [...(data.weightHistory || [])].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return (
    <>
      <div className="pagehead">
        <div>
          <small>İLERLEME</small>
          <h2>Sonuçların</h2>
        </div>
      </div>
      <div className="bigstat">
        <small>GÜNCEL KİLO</small>
        <b>{data.weight || "—"} kg</b>
        <p>
          Başlangıç 99.6 kg • Toplam −
          {data.weight ? (99.6 - Number(data.weight)).toFixed(1) : "0"} kg
        </p>
      </div>
      <h3>Hedefler</h3>
      <Task
        icon={<Scale />}
        title="İlk hedef: 84 kg"
        detail={`${Math.max(0, Number(data.weight) - 84).toFixed(1)} kg kaldı`}
        done={Number(data.weight) <= 84}
      />
      <Task
        icon={<Scale />}
        title="Ana hedef: 80 kg"
        detail={`${Math.max(0, Number(data.weight) - 80).toFixed(1)} kg kaldı`}
        done={Number(data.weight) <= 80}
      />
      {h.length > 0 && (
        <>
          <h3>Kilo geçmişi</h3>
          <div className="history">
            {h.slice(0, 14).map((x) => (
              <div key={x.date}>
                <span>
                  {new Date(`${x.date}T12:00`).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <b>{x.weight} kg</b>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
function Empty({ text }) {
  return (
    <div className="empty">
      <Utensils />
      <p>{text}</p>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
