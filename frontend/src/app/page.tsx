"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./page.module.css";
import { LIBELLES_DEVIS, personas, type Circuit, type EtapeDevis, type Persona, type Sollicitation } from "./data";
import { filtrerSollicitations, type Filtre } from "./filtrer-sollicitations";

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
  const [devis, setDevis] = useState<EtapeDevis>("a_envoyer");
  const [erreur, setErreur] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [idEnEdition, setIdEnEdition] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    obtenirSollicitations().then((donnees) => {
      if (!ignore) setSollicitations(donnees);
    });
    return () => {
      ignore = true;
    };
  }, []);

  function fermerFormulaire() {
    setOrganisme("");
    setTypeModule("");
    setDate("");
    setCircuit("entreprise");
    setDevis("a_envoyer");
    setIdEnEdition(null);
    setFormulaireOuvert(false);
  }

  function ouvrirEdition(s: Sollicitation) {
    setOrganisme(s.organisme);
    setTypeModule(s.module);
    setDate(s.date);
    setCircuit(s.circuit);
    setDevis(s.devis ?? "a_envoyer");
    setIdEnEdition(s.id);
    setFormulaireOuvert(true);
  }

  async function soumettreFormulaire(evenement: FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    const url = idEnEdition ? `/api/v1/sollicitations/${idEnEdition}` : "/api/v1/sollicitations";
    const reponse = await fetch(url, {
      method: idEnEdition ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organisme,
        module: typeModule,
        date,
        circuit,
        ...(circuit === "entreprise" ? { devis } : {}),
      }),
    });
    if (!reponse.ok) {
      const corps = await reponse.json();
      setErreur(corps.erreur ?? "L'enregistrement a échoué.");
      return;
    }
    fermerFormulaire();
    setSollicitations(await obtenirSollicitations());
  }

  async function supprimerSollicitation(id: string) {
    if (!window.confirm("Supprimer cette sollicitation ?")) return;
    await fetch(`/api/v1/sollicitations/${id}`, { method: "DELETE" });
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
      <button
        className={styles.changerPersona}
        onClick={() => (formulaireOuvert ? fermerFormulaire() : setFormulaireOuvert(true))}
      >
        {formulaireOuvert ? "Annuler" : "Nouvelle sollicitation"}
      </button>
      {formulaireOuvert && (
        <form className={styles.formulaire} onSubmit={soumettreFormulaire}>
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
          {circuit === "entreprise" && (
            <select value={devis} onChange={(e) => setDevis(e.target.value as EtapeDevis)}>
              <option value="a_envoyer">Devis à envoyer</option>
              <option value="envoye">Devis envoyé</option>
              <option value="signe">Devis signé</option>
            </select>
          )}
          {erreur && <p className={styles.erreur}>{erreur}</p>}
          <button type="submit">{idEnEdition ? "Enregistrer" : "Créer"}</button>
        </form>
      )}
      <div className={styles.filtres}>
        {(["tout", "collectivite", "entreprise"] as const).map((f) => (
          <button
            key={f}
            className={filtre === f ? styles.filtreActif : styles.filtre}
            onClick={() => setFiltre(f)}
          >
            {f === "tout" ? "Tout" : f === "collectivite" ? "Collectivités" : "Entreprises"}
          </button>
        ))}
      </div>
      <ul className={styles.liste}>
        {filtrerSollicitations(sollicitations, filtre).map((s) => (
          <li key={s.id} className={styles.fiche}>
            <strong>{s.organisme}</strong> — {s.module} ({s.date}) — <em>{s.etape}</em>
            <div className={styles.circuitBadge}>
              {s.circuit === "collectivite"
                ? "Collectivité — sans facture"
                : `Entreprise — payante — ${s.devis ? LIBELLES_DEVIS[s.devis] : ""}`}
            </div>
            <div className={styles.ficheActions}>
              <button onClick={() => ouvrirEdition(s)}>Modifier</button>
              <button onClick={() => supprimerSollicitation(s.id)}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
