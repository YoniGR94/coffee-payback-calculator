import React from "react";

// ─── Credit ────────────────────────────────────────────────────────────────
// שורת הקרדיט בתחתית האתר - קישור ל-LinkedIn ול-GitHub של הפרויקט.

export default function Credit() {
  return (
    <div style={{
      textAlign: "center",
      fontSize: 12,
      opacity: 0.7,
      marginTop: 20
    }}>
      © יוני גטהון · 
      <a
        href="https://www.linkedin.com/in/yoni-getahun/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#091169" }}
      >
        LinkedIn
      </a>
      
       · 
       <a
         href="https://github.com/YoniGR94/coffee-payback-calculator"
         target="_blank"
         rel="noopener noreferrer"
         style={{ color: "#091169", textDecoration: "underline" }}
       >
         GitHub
       </a>
       
    </div>
  );
}
