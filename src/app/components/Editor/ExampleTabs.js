"use client";
import React, { useState } from 'react';
import { styleButton } from "@/src/app/constants/styles";

export default function ExampleTabs({ tabs, onSelect }) {
  const [active, setActive] = useState(0);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      Examples
      {/* --- Buttons for the active tab --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "10px",
        }}
      >
        {tabs[active].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            style={styleButton}
            onMouseDown={(e) => {
              e.target.style.transform = "translate(4px, 4px)";
              e.target.style.boxShadow = "0 0 0 #004444";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "translate(0, 0)";
              e.target.style.boxShadow = "4px 4px 0 #004444";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translate(0, 0)";
              e.target.style.boxShadow = "4px 4px 0 #004444";
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translate(2px, 2px)";
              e.target.style.boxShadow = "2px 2px 0 #004444";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translate(0, 0)";
              e.target.style.boxShadow = "4px 4px 0 #004444";
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* --- Circle pagination --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {tabs.map((_, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: i === active ? "#00aaaa" : "#888",
              cursor: "pointer",
              transition: "0.2s",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
