"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./page.module.css";
import { personas, type Circuit, type Persona, type Sollicitation } from "./data";

async function obtenirSollicitations(): Promise<Sollicitation[]> {
  const reponse = await fetch("/api/v1/sollicitations");
  return reponse.json();
}

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [sollicitations, setSollicitations] = useState<Sollicitation[]>([]);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [organisme, setOrganisme] = useState("");
  const [typeModule, setTypeModule] = useState("");
  const [date, setDate] = useState("");
  const [circuit, setCircuit] = useState<Circuit>("entreprise");
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    obtenirSollicitations().then((donnees) => {
      if (!ignore) setSollicitations(donnees);
    });
    return () => {
      ignore = true;
    };
  }, []);

  async function creerSollicitation(evenement: FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    const reponse = await fetch("/api/v1/sollicitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organisme, module: typeModule, date, circuit }),
    });
    const corps = await reponse.json();
    if (!reponse.ok) {
      setErreur(corps.erreur ?? "La création a échoué.");
      return;
    }
    setOrganisme("");
    setTypeModule("");
    setDate("");
    setCircuit("entreprise");
    setFormulaireOuvert(false);
    setSollicitations(await obtenirSollicitations());
  }

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
      <button className={styles.changerPersona} onClick={() => setFormulaireOuvert((v) => !v)}>
        Nouvelle sollicitation
      </button>
      {formulaireOuvert && (
        <form className={styles.formulaire} onSubmit={creerSollicitation}>
          <div className={styles.circuits}>
            <label>
              <input
                type="radio"
                name="circuit"
                checked={circuit === "entreprise"}
                onChange={() => setCircuit("entreprise")}
              />
              Entreprise
            </label>
            <label>
              <input
                type="radio"
                name="circuit"
                checked={circuit === "collectivite"}
                onChange={() => setCircuit("collectivite")}
              />
              Collectivité
            </label>
          </div>
          <input
            placeholder="Organisme"
            value={organisme}
            onChange={(e) => setOrganisme(e.target.value)}
          />
          <input
            placeholder="Module (ex. Formation, Cluedo, Fresque de la rue)"
            value={typeModule}
            onChange={(e) => setTypeModule(e.target.value)}
          />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          {erreur && <p className={styles.erreur}>{erreur}</p>}
          <button type="submit">Créer</button>
        </form>
      )}
      <ul className={styles.liste}>
        {sollicitations.map((s) => (
          <li key={s.id} className={styles.fiche}>
            <strong>{s.organisme}</strong> — {s.module} ({s.date}) — <em>{s.etape}</em>
            <div className={styles.circuitBadge}>
              {s.circuit === "collectivite" ? "Collectivité — sans facture" : "Entreprise — payante"}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
