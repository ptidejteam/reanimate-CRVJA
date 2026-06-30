import React, { useEffect, useRef } from "react";
import ExampleLoadButton from "./ExampleLoadButton";

export default function SideNavigation({
  isSideMenuOpen,
  setIsSideMenuOpen,
  clearBanks,
  handleBankChange,
  setAmosCode,
  // forceParse,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        if (!event.target.closest("#menu-toggle-btn") && setIsSideMenuOpen) {
          setIsSideMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSideMenuOpen]);
  const loadExample = async (ascPath, bankPaths = []) => {
    try {
      clearBanks();
      for (let i = 0; i < bankPaths.length; i++) {
        const resBank = await fetch(bankPaths[i].path);
        const blob = await resBank.blob();
        const file = new File([blob], bankPaths[i].name);
        handleBankChange(i, file);
      }
      const resAsc = await fetch(ascPath);
      const text = await resAsc.text();
      setAmosCode(text);
      // forceParse(text);
    } catch (err) {
      console.error("Failed to load example:", err);
    }
  };

  const examples = [
    {
      label: "Pac-Man",
      action: () =>
        loadExample("/examples/Example1_Pac-Man/Example1_Pac-Man.asc", [
          {
            path: "/examples/Example1_Pac-Man/Example1_Pac-Man.abk",
            name: "Example1_Pac-Man.abk",
          },
        ]),
    },
    {
      label: "Piano",
      action: () =>
        loadExample("/examples/Example2_Piano/Example2_Piano.asc"),
    },
    {
      label: "Rotating Triangle",
      action: () =>
        loadExample("/examples/Example3_Rotating_Triangle/Example3_Rotating_Triangle.asc"),
    },
    {
      label: "Colourful Text",
      action: () =>
        loadExample("/examples/Example4_Colourful_Text/Example4_Colourful_Text.asc"),
    },
  ];

  const reanimate26Examples = [
    {
      label: "Escape From Reanimate 🥇",
      action: () =>
        loadExample(
          "/reanimate26/EscapeFromReanimate_Kotowicz_Maher_Abdalla_Ullmann/Game.asc",
          [
            {
              path: "/reanimate26/EscapeFromReanimate_Kotowicz_Maher_Abdalla_Ullmann/AmosBank_Escape1.abk",
              name: "AmosBank_Escape1.abk",
            },
            {
              path: "/reanimate26/EscapeFromReanimate_Kotowicz_Maher_Abdalla_Ullmann/AmosBank_Escape2.abk",
              name: "AmosBank_Escape2.abk",
            },
          ]
        ),
    },
    {
      label: "Park Bedlam 🥇",
      action: () =>
        loadExample(
          "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/park_bedlam_v20.asc",
          [
            {
              path: "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/AleksBank.abk",
              name: "AleksBank.abk",
            },
            {
              path: "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/Cat.abk",
              name: "Cat.abk",
            },
            {
              path: "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/DuckSquirrel.abk",
              name: "DuckSquirrel.abk",
            },
            {
              path: "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/Pigeon.abk",
              name: "Pigeon.abk",
            },
            {
              path: "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/Raccoon.abk",
              name: "Raccoon.abk",
            },
          ]
        ),
    },
    {
      label: "Welcome to the Backrooms 🥈",
      action: () =>
        loadExample(
          "/reanimate26/Welcome_to_the_Backrooms_Politowski_Bigot_Serra_Lopez/Welcome_to_the_Backrooms.asc",
          [
            {
              path: "/reanimate26/Welcome_to_the_Backrooms_Politowski_Bigot_Serra_Lopez/Sprite.abk",
              name: "Sprite.abk",
            },
          ]
        ),
    },
    {
      label: "Galaxy Patrol 🥉",
      action: () =>
        loadExample(
          "/reanimate26/GalaxyPatrol_Tondorf_Chua_Zongo_Bijani/GalaxyPatrol_TCZB.asc",
          [
            {
              path: "/reanimate26/GalaxyPatrol_Tondorf_Chua_Zongo_Bijani/gjs.abk",
              name: "gjs.abk",
            },
          ]
        ),
    },
    {
      label: "World of Iris 🥉",
      action: () =>
        loadExample(
          "/reanimate26/WorldOfIris_Mioto_Petrillo_Yefi_Guéhéneuc/WoI.asc",
          [
            {
              path: "/reanimate26/WorldOfIris_Mioto_Petrillo_Yefi_Guéhéneuc/WoI.abk",
              name: "WoI.abk",
            },
          ]
        ),
    },
  ];

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid black",
        paddingRight: "10px",
        marginRight: "10px",
        minWidth: "500px",
        maxWidth: "500px",
        paddingTop: "10px",
        alignItems: "flex-start",
        overflowY: "auto",
        height: "100%",
      }}
    >
      <div style={{ width: "100%" }}>
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              borderBottom: "2px solid #ccc",
              paddingBottom: "4px",
              marginBottom: "10px",
              marginTop: "0",
            }}
          >
            Examples
          </h4>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0, width: "100%" }}>
            {examples.map((ex, index) => (
              <li key={index}>
                <ExampleLoadButton label={ex.label} onClick={ex.action} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4
            style={{
              borderBottom: "2px solid #ccc",
              paddingBottom: "4px",
              marginBottom: "10px",
            }}
          >
            ReAnimate'26 Realisations
          </h4>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0, width: "100%" }}>
            {reanimate26Examples.map((ex, index) => (
              <li key={index}>
                <ExampleLoadButton label={ex.label} onClick={ex.action} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
