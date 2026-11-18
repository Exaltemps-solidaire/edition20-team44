"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { personas, sollicitationsExemple, type Persona } from "./data";

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);

  if (!persona) {
    return (
      <main className={styles.page}>
        <h1>Qui êtes-vous ?</h1>
        <ul className={styles.personas}>
          {personas.map((p) => (
            <li key={p.id}>
              <button className={styles.personaButton} onClick={() => setPersona(p)}>
                {p.nom} — {p.role}
              </button>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span>
          {persona.nom} — {persona.role}
        </span>
        <button className={styles.changerPersona} onClick={() => setPersona(null)}>
          Changer de persona
        </button>
      </header>
      <h1>Sollicitations</h1>
      <ul className={styles.liste}>
        {sollicitationsExemple.map((s) => (
          <li key={s.id} className={styles.fiche}>
            <strong>{s.organisme}</strong> — {s.module} — <em>{s.etape}</em>
          </li>
        ))}
      </ul>
    </main>
  );
}
