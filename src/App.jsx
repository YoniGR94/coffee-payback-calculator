import { useState } from "react";

// ─── Pricing ───────────────────────────────────────────────────────────────
const P = {
  kb: 0.80,   // קפה שחור לכפית
  kn: 0.40,   // נמס רגיל לכפית
  knd: 0.55,  // נמס נטול לכפית
  t: 1.00,    // תיון לשקית
  sh: 0.48,   // שוקו לכפית
  s: 0.05,    // סוכר לכפית
  m: 6.00,    // חלב רגיל לליטר
  msoy: 8.00, // חלב סויה לליטר
  cap: 2.00,  // קפסולה אחת
};
const V_CUP = 0.250;
const MILK_RATIO = { "ללא": 0, "קצת": 0.12, "חצי": 0.50, "הכל": 1.00 };

const milkPrice = (d) => {
  const ratio = MILK_RATIO[d.milk] || 0;
  if (ratio === 0) return 0;
  return ratio * V_CUP * (d.soy ? P.msoy : P.m);
};

const calcCost = (d) => {
  const milk = milkPrice(d);
  if (d.type === "black")    return d.spoons * P.kb  + d.sugar * P.s + milk;
  if (d.type === "nescafe")  return d.spoons * (d.decaf ? P.knd : P.kn) + d.sugar * P.s + milk;
  if (d.type === "tea")      return d.bags   * P.t   + d.sugar * P.s + milk;
  if (d.type === "choco")    return d.spoons * P.sh  + milk;
  if (d.type === "espresso") return d.shots  * P.cap + d.sugar * P.s + milk;
  return 0;
};

const DEFAULT_DRAFT = () => ({ type: "black", spoons: 2, sugar: 1, milk: "ללא", soy: false });

const newDrinkOfType = (type) => {
  const base = { soy: false };
  if (type === "black")    return { ...base, type, spoons: 2, sugar: 1,  milk: "ללא" };
  if (type === "nescafe")  return { ...base, type, spoons: 2, decaf: false, ice: false, sugar: 1, milk: "ללא" };
  if (type === "tea")      return { ...base, type, teaKind: "שחור", bags: 1, sugar: 1, milk: "ללא" };
  if (type === "choco")    return { ...base, type, spoons: 3, milk: "חצי" };
  if (type === "espresso") return { ...base, type, shots: 1, sugar: 0,  milk: "ללא" };
};

const DRINK_META = [
  { key: "black",    emoji: "☕", label: "קפה שחור"     },
  { key: "nescafe",  emoji: "🥄", label: "קפה נמס"      },
  { key: "espresso", emoji: "💊", label: "קפסולה"       },
  { key: "tea",      emoji: "🍵", label: "תה"            },
  { key: "choco",    emoji: "🍫", label: "שוקו"          },
];

const drinkLabel = (d) => {
  const m = DRINK_META.find(x => x.key === d.type);
  const parts = [];
  if (d.type === "black")    parts.push(`${d.spoons} כפיות קפה`);
  if (d.type === "nescafe")  parts.push(`${d.spoons} כפיות נמס${d.decaf ? " (נטול)" : ""}${d.ice ? " 🧊" : ""}`);
  if (d.type === "espresso") parts.push(`${d.shots === 1 ? "מנה בודדת" : "מנה כפולה"}`);
  if (d.type === "tea")      parts.push(`תה ${d.teaKind}, ${d.bags} תיון${d.bags > 1 ? "ים" : ""}`);
  if (d.type === "choco")    parts.push(`${d.spoons} כפיות שוקו`);
  if (d.sugar > 0)           parts.push(`${d.sugar} סוכר`);
  if (d.milk && d.milk !== "ללא") parts.push(`${d.soy ? "חלב סויה 🌿" : "חלב"} ${d.milk}`);
  return `${m.emoji} ${m.label} — ${parts.join(", ")}`;
};

const funnyMessage = (t) => {
  if (t < 3)  return "שותה בצניעות. כנראה גם לא מדפיס יותר מדי. 🖨️";
  if (t < 6)  return "סביר. האמרכלות עדיין לא מודאגת. 😌";
  if (t < 12)  return "מתחילים להרגיש את זה בתקציב. ☕☕";
  if (t < 20) return "האמרכלות בדרך אליך עם המחאה. 📬";
  if (t < 40) return "אתה בעצם מממן חצי מטבחון. כבוד. 🏆";
  return "אתה בטוח שאתה לא עובד כבריסטה? ⛾";
};

const shareWhatsApp = (total, confirmed) => {
  const grouped = confirmed.reduce((acc, d) => {
    acc[d.type] = acc[d.type] || { count: 0, cost: 0 };
    acc[d.type].count++;
    acc[d.type].cost += calcCost(d);
    return acc;
  }, {});
  const lines = Object.entries(grouped).map(([type, { count, cost }]) => {
    const m = DRINK_META.find(x => x.key === type);
    return `${m.emoji} ${m.label} ×${count} — ${cost.toFixed(2)} ₪`;
  });
  const appUrl = window.location.href;
  const text = `☕ מחשבון קפה האמרכלות\n\n${lines.join("\n")}\n\nסה"כ: ${total.toFixed(2)} ₪\n\nיש לפנות לאמרכלות לקבלת ההחזר 😄\n\nלחישוב עצמאי: ${appUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
};

// ─── Styles ────────────────────────────────────────────────────────────────
const glass = (alpha = 0.18, r = 22) => ({
  background: `rgba(255,255,255,${alpha})`,
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRadius: r,
  border: "1px solid rgba(255,255,255,0.38)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 6px 28px rgba(90,40,5,0.12)",
});

const pillStyle = (active) => ({
  ...glass(active ? 0.55 : 0.15, 999),
  padding: "7px 14px", cursor: "pointer",
  border: active ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.25)",
  color: active ? "#3d1f00" : "#6b4020",
  fontWeight: active ? 700 : 500, fontSize: 13,
  fontFamily: "Heebo, sans-serif", transition: "all 0.18s",
  boxShadow: active ? "0 2px 12px rgba(200,140,40,0.35)" : "none",
});

// ─── NumPicker ─────────────────────────────────────────────────────────────
const NumPicker = ({ label, value, min = 0, max = 6, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
    <span style={{ color: "#5c3010", fontWeight: 600, fontSize: 14, flex: 1 }}>{label}</span>
    <div style={{ display: "flex", alignItems: "center", gap: 4, ...glass(0.22, 999), padding: "3px 6px" }}>
      <button onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width: 44, height: 44, borderRadius: "50%", border: "none",
          background: "rgba(255,255,255,0.45)", cursor: "pointer",
          fontSize: 22, color: "#3d1f00", fontWeight: 700, lineHeight: 1 }}>−</button>
      <span style={{ minWidth: 32, textAlign: "center", fontSize: 20, fontWeight: 800, color: "#3d1f00" }}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width: 44, height: 44, borderRadius: "50%", border: "none",
          background: "rgba(255,255,255,0.45)", cursor: "pointer",
          fontSize: 22, color: "#3d1f00", fontWeight: 700, lineHeight: 1 }}>+</button>
    </div>
  </div>
);

const PillGroup = ({ label, value, options, onChange }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <div style={{ color: "#5c3010", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{label}</div>}
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map(o => <button key={o} onClick={() => onChange(o)} style={pillStyle(value === o)}>{o}</button>)}
    </div>
  </div>
);

const Toggle = ({ label, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
    <span style={{ color: "#5c3010", fontWeight: 600, fontSize: 14, flex: 1 }}>{label}</span>
    <div onClick={() => onChange(!value)} style={{
      width: 52, height: 30, borderRadius: 15,
      background: value ? "rgba(160,100,10,0.7)" : "rgba(255,255,255,0.3)",
      border: "1px solid rgba(255,255,255,0.45)",
      cursor: "pointer", position: "relative", transition: "all 0.22s", flexShrink: 0,
      boxShadow: value ? "0 2px 8px rgba(160,100,10,0.4)" : "none",
    }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 25 : 3,
        width: 24, height: 24, borderRadius: "50%",
        background: "white", transition: "left 0.22s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
      }} />
    </div>
  </div>
);

// ─── Soy milk toggle row ───────────────────────────────────────────────────
const SoyToggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{
    ...glass(value ? 0.35 : 0.15, 12),
    border: value ? "1px solid rgba(100,180,80,0.6)" : "1px solid rgba(255,255,255,0.28)",
    background: value ? "rgba(100,200,70,0.22)" : "rgba(255,255,255,0.13)",
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 14px", cursor: "pointer", marginBottom: 12,
    transition: "all 0.22s",
    boxShadow: value ? "0 2px 10px rgba(80,160,40,0.25)" : "none",
  }}>
    <span style={{ fontSize: 20 }}>🌿</span>
    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: value ? "#2a5c10" : "#5c3010" }}>
      חלב סויה
    </span>
    {/* Mini toggle indicator */}
    <div style={{
      width: 40, height: 22, borderRadius: 11,
      background: value ? "rgba(80,160,40,0.65)" : "rgba(200,200,200,0.35)",
      position: "relative", transition: "all 0.22s", flexShrink: 0,
      border: "1px solid rgba(255,255,255,0.4)",
    }}>
      <div style={{
        position: "absolute", top: 2, left: value ? 19 : 2,
        width: 18, height: 18, borderRadius: "50%",
        background: "white", transition: "left 0.22s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  </div>
);

// ─── Draft Card ────────────────────────────────────────────────────────────
const DraftCard = ({ draft, setDraft, onAdd }) => {
  const u = (k, v) => setDraft(prev => ({ ...prev, [k]: v }));
  const switchType = (t) => setDraft(newDrinkOfType(t));
  const hasMilk = draft.milk && draft.milk !== "ללא";

  return (
    <div style={{ ...glass(0.26, 22), padding: 18, marginBottom: 8 }}>
      {/* Type selector */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "#5c3010", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>סוג משקה</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {DRINK_META.map(({ key, emoji, label }) => (
            <button key={key} onClick={() => switchType(key)}
              style={{ ...pillStyle(draft.type === key), padding: "6px 12px", fontSize: 13 }}>
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.32)", marginBottom: 14 }} />

      {/* ☕ Black */}
      {draft.type === "black" && <>
        <NumPicker label="☕ כפיות קפה" value={draft.spoons} min={1} max={6} onChange={v => u("spoons", v)} />
        <NumPicker label="🍬 סוכר"       value={draft.sugar}  min={0} max={6} onChange={v => u("sugar", v)} />
        <PillGroup label="🥛 חלב" value={draft.milk} options={["ללא","קצת","חצי"]} onChange={v => u("milk", v)} />
        {hasMilk && <SoyToggle value={draft.soy} onChange={v => u("soy", v)} />}
      </>}

      {/* 🥄 Nescafe */}
      {draft.type === "nescafe" && <>
        <NumPicker label="🥄 כפיות נמס" value={draft.spoons} min={1} max={6} onChange={v => u("spoons", v)} />
        <Toggle label="☕ נטול קפאין"   value={draft.decaf}  onChange={v => u("decaf", v)} />
        <Toggle label="🧊 הוסף קרח"    value={draft.ice}    onChange={v => u("ice", v)} />
        <NumPicker label="🍬 סוכר"       value={draft.sugar}  min={0} max={6} onChange={v => u("sugar", v)} />
        <PillGroup label="🥛 חלב" value={draft.milk} options={["ללא","קצת","חצי","הכל"]} onChange={v => u("milk", v)} />
        {hasMilk && <SoyToggle value={draft.soy} onChange={v => u("soy", v)} />}
      </>}

      {/* 💊 Espresso capsule */}
      {draft.type === "espresso" && <>
        <PillGroup
          label="💊 מנה"
          value={draft.shots === 1 ? "בודדת" : "כפולה"}
          options={["בודדת", "כפולה"]}
          onChange={v => u("shots", v === "בודדת" ? 1 : 2)}
        />
        <NumPicker label="🍬 סוכר" value={draft.sugar} min={0} max={6} onChange={v => u("sugar", v)} />
        <PillGroup label="🥛 חלב" value={draft.milk} options={["ללא","קצת","חצי"]} onChange={v => u("milk", v)} />
        {hasMilk && <SoyToggle value={draft.soy} onChange={v => u("soy", v)} />}
      </>}

      {/* 🍵 Tea */}
      {draft.type === "tea" && <>
        <PillGroup label="🍵 סוג תה" value={draft.teaKind} options={["שחור","ירוק","נטול קפאין"]} onChange={v => u("teaKind", v)} />
        <NumPicker label="🫖 תיונים" value={draft.bags} min={1} max={2} onChange={v => u("bags", v)} />
        <NumPicker label="🍬 סוכר"   value={draft.sugar} min={0} max={6} onChange={v => u("sugar", v)} />
        <PillGroup label="🥛 חלב" value={draft.milk} options={["ללא","קצת"]} onChange={v => u("milk", v)} />
        {hasMilk && <SoyToggle value={draft.soy} onChange={v => u("soy", v)} />}
      </>}

      {/* 🍫 Choco */}
      {draft.type === "choco" && <>
        <NumPicker label="🍫 כפיות שוקו" value={draft.spoons} min={1} max={6} onChange={v => u("spoons", v)} />
        <PillGroup label="🥛 חלב" value={draft.milk} options={["קצת","חצי","הכל"]} onChange={v => u("milk", v)} />
        {<SoyToggle value={draft.soy} onChange={v => u("soy", v)} />}
      </>}

      {/* Cost + Add button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: 12, marginTop: 4 }}>
        <span style={{ fontSize: 13, color: "#7a4015", fontWeight: 600 }}>
          עלות כוס זו: <strong>{calcCost(draft).toFixed(2)} ₪</strong>
        </span>
        <button onClick={onAdd} style={{
          ...glass(0.55, 16),
          background: "rgba(80,35,5,0.68)",
          border: "1px solid rgba(255,255,255,0.45)",
          color: "#fff", cursor: "pointer",
          padding: "10px 22px", fontSize: 15, fontWeight: 700,
          boxShadow: "0 4px 16px rgba(80,35,5,0.3)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> הוסף
        </button>
      </div>
    </div>
  );
};

// ─── Confirmed drink row ───────────────────────────────────────────────────
const DrinkRow = ({ drink, index, onRemove }) => (
  <div style={{
    ...glass(0.18, 14),
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px", marginBottom: 6,
    animation: "slideIn 0.22s ease",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
      <span style={{ ...glass(0.38, 999), padding: "2px 9px", fontSize: 12, fontWeight: 800, color: "#3d1f00", flexShrink: 0 }}>
        {index + 1}
      </span>
      <span style={{ fontSize: 13, color: "#4a2500", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {drinkLabel(drink)}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginRight: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#6b3010" }}>{calcCost(drink).toFixed(2)} ₪</span>
      <button onClick={onRemove} style={{
        width: 28, height: 28, borderRadius: "50%",
        border: "1px solid rgba(220,80,80,0.4)",
        background: "rgba(220,80,80,0.15)",
        cursor: "pointer", color: "#a00", fontSize: 13, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>✕</button>
    </div>
  </div>
);

const Steps = ({ current }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 22 }}>
    {[0, 1, 2, 3].map(i => (
      <div key={i} style={{
        height: 10, borderRadius: 999,
        width: current === i ? 32 : 10,
        background: current === i ? "rgba(80,35,5,0.72)" : "rgba(255,255,255,0.4)",
        transition: "all 0.3s",
      }} />
    ))}
  </div>
);

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]       = useState(0);
  const [confirmed, setConfirmed] = useState([]);
  const [draft, setDraft]         = useState(DEFAULT_DRAFT());
  const [days, setDays]           = useState(1);

  const handleAdd = () => {
    setConfirmed(prev => [...prev, { ...draft, _id: Date.now() + Math.random() }]);
    setDraft(DEFAULT_DRAFT());
  };
  const removeConfirmed = (i) => setConfirmed(prev => prev.filter((_, j) => j !== i));

  const total = confirmed.reduce((s, d) => s + calcCost(d), 0);
  const grouped = confirmed.reduce((acc, d) => {
    acc[d.type] = acc[d.type] || { count: 0, cost: 0 };
    acc[d.type].count++;
    acc[d.type].cost += calcCost(d);
    return acc;
  }, {});

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg,#f9dea0 0%,#e8a055 28%,#c06820 58%,#7a3a08 100%)",
      fontFamily: "Heebo, sans-serif", direction: "rtl",
      padding: "24px 16px 50px", position: "relative", overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button{outline:none;font-family:Heebo,sans-serif}
        button:hover{opacity:0.87;transform:scale(1.025)}
        button:active{transform:scale(0.97)}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.35);border-radius:4px}
      `}</style>

      {[
        { w:320, h:320, top:"-80px",  right:"-80px", bg:"rgba(255,215,100,0.26)" },
        { w:200, h:200, top:"58%",    left:"-55px",  bg:"rgba(255,255,255,0.13)" },
        { w:150, h:150, top:"32%",    right:"-35px", bg:"rgba(200,90,20,0.28)"   },
      ].map((b, i) => (
        <div key={i} style={{ position:"fixed", width:b.w, height:b.h,
          top:b.top, right:b.right||undefined, left:b.left||undefined,
          background:b.bg, borderRadius:"50%", filter:"blur(68px)", pointerEvents:"none", zIndex:0 }} />
      ))}

      <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Steps current={screen} />

        {/* ── WELCOME ─────────────────────────────────────────────────────── */}
        {screen === 0 && (
          <div style={{ textAlign: "center", paddingTop: 32 }}>
            <div style={{ fontSize: 72, marginBottom: 14, filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.2))" }}>☕</div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: "#3d1f00", lineHeight: 1.25, marginBottom: 30,
              textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>
              מחשבון קפה<br/>האמרכלות
            </h1>
            <div style={{ ...glass(0.28, 24), padding: "26px 28px", marginBottom: 40 }}>
              <p style={{ fontSize: 16, color: "#4a2500", lineHeight: 2, fontWeight: 500 }}>
                לאור המצב הנוכחי בו אינך במשרד,<br />
                הינך חוסך למשרד את עלות השתייה החמה.
                <br /><br />
                רוצה לדעת כמה חסכת למשרד?<br />
                לחץ על <strong>"התחל"</strong> ורשום מה שתית היום.
              </p>
            </div>
            <button onClick={() => setScreen(1)} style={{
              ...glass(0.55, 20), background: "rgba(80,35,5,0.65)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff", cursor: "pointer",
              padding: "16px 56px", fontSize: 20, fontWeight: 700,
              boxShadow: "0 8px 28px rgba(80,35,5,0.35)",
            }}>התחל ☕</button>
          </div>
        )}

        {/* ── BUILD LIST ──────────────────────────────────────────────────── */}
        {screen === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#3d1f00", marginBottom: 16,
              textAlign: "center", textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>
              מה שתית היום? 🤔
            </h2>

            {/* 1. Draft card — always on top */}
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(80,35,5,0.7)", marginBottom: 8 }}>
              {confirmed.length === 0 ? "הגדר את המשקה הראשון:" : "הוסף משקה נוסף:"}
            </div>
            <DraftCard draft={draft} setDraft={setDraft} onAdd={handleAdd} />

            {/* 2. Confirmed list — below the draft */}
            {confirmed.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(80,35,5,0.7)", marginBottom: 8 }}>
                  משקאות שהוספת ({confirmed.length}):
                </div>
                {confirmed.map((d, i) => (
                  <DrinkRow key={d._id} drink={d} index={i} onRemove={() => removeConfirmed(i)} />
                ))}
              </div>
            )}

            {/* Sticky calc button */}
            {confirmed.length > 0 && (
              <div style={{ position: "sticky", bottom: 16, marginTop: 14 }}>
                <button onClick={() => setScreen(2)} style={{
                  ...glass(0.5, 20), background: "rgba(80,35,5,0.72)",
                  border: "1px solid rgba(255,255,255,0.45)",
                  color: "#fff", cursor: "pointer",
                  width: "100%", padding: 15, fontSize: 18, fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(80,35,5,0.35)",
                }}>
                  חשב את החיסכון 💰
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── DAYS PICKER ─────────────────────────────────────────────────── */}
        {screen === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>📅</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#3d1f00",
                textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>
                כמה ימים עבדת מהבית?
              </h2>
            </div>

            <div style={{ ...glass(0.26, 22), padding: 24, marginBottom: 24 }}>
              <p style={{ fontSize: 15, color: "#5c3010", fontWeight: 500, marginBottom: 20, textAlign: "center" }}>
                בחר מספר ימים — החישוב יכפיל את עלות היום
              </p>
              <NumPicker label="📆 ימי עבודה מהבית" value={days} min={1} max={30} onChange={setDays} />

              {/* Preview */}
              <div style={{ ...glass(0.2, 12), padding: "12px 16px", marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: "#5c3010", fontWeight: 600 }}>עלות ליום:</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#3d1f00" }}>{total.toFixed(2)} ₪</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 16, color: "#3d1f00", fontWeight: 700 }}>סה״כ {days} ימים:</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: "#3d1f00" }}>{(total * days).toFixed(2)} ₪</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setScreen(1)} style={{
                ...glass(0.25, 16), background: "rgba(255,255,255,0.22)",
                border: "1px solid rgba(255,255,255,0.38)",
                color: "#3d1f00", cursor: "pointer",
                flex: 1, padding: 13, fontSize: 15, fontWeight: 700,
              }}>← חזרה</button>
              <button onClick={() => setScreen(3)} style={{
                ...glass(0.5, 16), background: "rgba(80,35,5,0.72)",
                border: "1px solid rgba(255,255,255,0.45)",
                color: "#fff", cursor: "pointer",
                flex: 2, padding: 13, fontSize: 16, fontWeight: 700,
                boxShadow: "0 6px 20px rgba(80,35,5,0.3)",
              }}>הצג חיסכון 💰</button>
            </div>
          </div>
        )}

        {/* ── RESULTS ─────────────────────────────────────────────────────── */}
        {screen === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 60, marginBottom: 8 }}>🎉</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#3d1f00",
                textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>
                החיסכון שלך
              </h2>
            </div>

            <div style={{ ...glass(0.28, 24), padding: "6px 20px", marginBottom: 14 }}>
              {Object.entries(grouped).map(([type, { count, cost }]) => {
                const m = DRINK_META.find(x => x.key === type);
                return (
                  <div key={type} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "13px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.28)" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#4a2500" }}>
                      {m.emoji} {m.label} ×{count}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#6b3010" }}>
                      {cost.toFixed(2)} ₪
                    </span>
                  </div>
                );
              })}
              {/* Per day */}
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "14px 0 8px",
                borderBottom: days > 1 ? "1px solid rgba(255,255,255,0.28)" : "none" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#5c3010" }}>סה״כ ליום</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#3d1f00" }}>{total.toFixed(2)} ₪</span>
              </div>
              {/* Multi-day total */}
              {days > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "12px 0 10px" }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#3d1f00" }}>סה״כ {days} ימים</span>
                  <span style={{ fontSize: 30, fontWeight: 900, color: "#3d1f00" }}>{(total * days).toFixed(2)} ₪</span>
                </div>
              )}
            </div>

            <div style={{ ...glass(0.18, 16), padding: "11px 18px", marginBottom: 12, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#5c3010", fontStyle: "italic", fontWeight: 500 }}>
                {funnyMessage(total * days)}
              </p>
            </div>

            <div style={{ ...glass(0.26, 20), padding: "16px 22px", marginBottom: 20, textAlign: "center" }}>
              <p style={{ fontSize: 15, color: "#4a2500", lineHeight: 1.85, fontWeight: 500 }}>
                זוהי עלות המשקאות שחסכת למשרד.<br />
                <strong>יש לפנות לאמרכלות לקבלת ההחזר</strong> 📋
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => shareWhatsApp(total * days, confirmed)} style={{
                ...glass(0.45, 18), background: "rgba(37,160,75,0.62)",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff", cursor: "pointer",
                padding: 14, fontSize: 16, fontWeight: 700,
                boxShadow: "0 4px 18px rgba(37,160,75,0.28)",
              }}>📤 שלח לקבוצת המשרד בוואטסאפ</button>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setScreen(2)} style={{
                  ...glass(0.25, 16), background: "rgba(255,255,255,0.22)",
                  border: "1px solid rgba(255,255,255,0.38)",
                  color: "#3d1f00", cursor: "pointer",
                  flex: 1, padding: 13, fontSize: 15, fontWeight: 700,
                }}>← ערוך</button>
                <button onClick={() => { setScreen(0); setConfirmed([]); setDraft(DEFAULT_DRAFT()); setDays(1); }} style={{
                  ...glass(0.55, 16), background: "rgba(80,35,5,0.65)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#fff", cursor: "pointer",
                  flex: 1, padding: 13, fontSize: 15, fontWeight: 700,
                }}>התחל מחדש</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
