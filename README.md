# ☕ Coffee Payback Calculator

> *"You're working from home. The office kitchen is empty. Someone owes you coffee."*

A humorous yet fully functional React app that calculates how much money your workplace owes you in hot drinks — built for Israeli office workers during remote work periods.

---

## 🚀 Live Demo on Vercel

[coffee payback calculator app](https://coffee-payback-calculator.vercel.app)

---

## 💡 What It Does

You log every hot drink you *would have* consumed at the office, and the app calculates the total cost the office saved — at your expense.

At the end, you get a friendly breakdown to forward to your HR/logistics department. 😄

---

## 🧮 Supported Drinks & Parameters

| Drink | Parameters |
|-------|-----------|
| ☕ Black Coffee | Spoonfuls (1–6), sugar (0–6), milk (none / a little / half) |
| 🥄 Instant Coffee | Spoonfuls (1–6), decaf toggle, ice toggle, sugar, milk |
| 💊 Espresso Capsule | Single / double shot, sugar, milk |
| 🍵 Tea | Type (black / green / decaf), bags (1–2), sugar, milk |
| 🍫 Hot Chocolate | Spoonfuls (1–6), milk amount |

All drinks support a **🌿 soy milk** toggle, which recalculates milk cost at soy milk pricing.

---

## 📐 Pricing Model

Costs are based on average Israeli market prices, calculated per unit:

| Ingredient | Unit | Price |
|-----------|------|-------|
| Ground coffee | per tsp | ₪0.80 |
| Instant coffee | per tsp | ₪0.40 |
| Decaf instant | per tsp | ₪0.55 |
| Tea bag | per bag | ₪1.00 |
| Hot chocolate powder | per tsp | ₪0.48 |
| Sugar | per tsp | ₪0.05 |
| Milk | per liter | ₪7.20 |
| Soy milk | per liter | ₪9.00 |
| Espresso capsule | per capsule | ₪2.00 |

Milk volume is calculated based on a 250ml average cup size × selected milk ratio.

---

## 🛠️ Tech Stack

- **React** (Vite)
- **CSS-in-JS** inline styles — no external CSS libraries
- **iOS 26-inspired Liquid Glass UI** — `backdrop-filter`, layered rgba, rounded corners
- **RTL Hebrew** layout throughout
- Deployed on **Vercel**, source on **GitHub**

---

## 📦 Run Locally

```bash
git clone https://github.com/YoniGR94/coffee-payback-calculator.git
cd coffee-payback-calculator
npm install
npm run dev
```

---

## 👤 Author

**Yoni Getahun** — [LinkedIn](https://www.linkedin.com/in/yoni-getahun/)

---

*Built with too much coffee and not enough office kitchen access.*