// ─── Pricing ───────────────────────────────────────────────────────────────
// כל המחירים של המשקאות והתוספות במקום אחד.
// לעדכון מחיר (למשל אם הקפה בסופר התייקר) - כאן ורק כאן.

export const P = {
  kb: 0.80,   // קפה שחור כפית
  kn: 0.40,   // נמס רגיל כפית
  knd: 0.55,  // נמס נטול כפית
  t: 1.00,    // תיון שקית
  sh: 0.48,   // שוקו כפית
  s: 0.05,    // סוכר כפית
  m: 7.20,    // חלב רגיל ליטר
  msoy: 9.00, // חלב סויה ליטר
  cap: 2.00,  // קפסולה אחת
};

export const V_CUP = 0.250;

export const MILK_RATIO = { "ללא": 0, "קצת": 0.12, "חצי": 0.50, "הכל": 1.00 };

export const milkPrice = (d) => {
  const ratio = MILK_RATIO[d.milk] || 0;
  if (ratio === 0) return 0;
  return ratio * V_CUP * (d.soy ? P.msoy : P.m);
};

export const calcCost = (d) => {
  const milk = milkPrice(d);
  if (d.type === "black")    return d.spoons * P.kb  + d.sugar * P.s + milk;
  if (d.type === "nescafe")  return d.spoons * (d.decaf ? P.knd : P.kn) + d.sugar * P.s + milk;
  if (d.type === "tea")      return d.bags   * P.t   + d.sugar * P.s + milk;
  if (d.type === "choco")    return d.spoons * P.sh  + milk;
  if (d.type === "espresso") return d.shots  * P.cap + d.sugar * P.s + milk;
  return 0;
};
