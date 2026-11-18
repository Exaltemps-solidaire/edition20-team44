"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./page.module.css";
import {
  LIBELLES_DEVIS,
  MODULES,
  personas,
  type Circuit,
  type EtapeDevis,
  type Persona,
  type Sollicitation,
  type TypeModule,
} from "./data";
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
  const [typeModule, setTypeModule] = useState<TypeModule>("Formation");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [circuit, setCircuit] = useState<Circuit>("entreprise");
  const [devis, setDevis] = useState<EtapeDevis>("a_envoyer");
  const [contact, setContact] = useState("");
  const [adresse, setAdresse] = useState("");
  const [raisonSociale, setRaisonSociale] = useState("");
  const [infoCollectivite, setInfoCollectivite] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [idEnEdition, setIdEnEdition] = useState<string | null>(null);
  const [idDetail, setIdDetail] = useState<string | null>(null);

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
    setTypeModule("Formation");
    setDate("");
    setHeure("");
    setCircuit("entreprise");
    setDevis("a_envoyer");
    setContact("");
    setAdresse("");
    setRaisonSociale("");
    setInfoCollectivite("");
    setIdEnEdition(null);
    setFormulaireOuvert(false);
  }

  function ouvrirEdition(s: Sollicitation) {
    setOrganisme(s.organisme);
    setTypeModule(s.module);
    setDate(s.date);
    setHeure(s.heure ?? "");
    setCircuit(s.circuit);
    setDevis(s.devis ?? "a_envoyer");
    setContact(s.contact ?? "");
    setAdresse(s.adresse ?? "");
    setRaisonSociale(s.raisonSociale ?? "");
    setInfoCollectivite(s.infoCollectivite ?? "");
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
        heure,
        circuit,
        contact,
        adresse,
        raisonSociale,
        ...(circuit === "entreprise" ? { devis } : {}),
        ...(circuit === "collectivite" ? { infoCollectivite } : {}),
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
    setIdDetail(null);
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

  const sollicitationDetail = sollicitations.find((s) => s.id === idDetail) ?? null;

  const champsFormulaire = (
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
      <input placeholder="Organisme" value={organisme} onChange={(e) => setOrganisme(e.target.value)} />
      <input placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
      <input placeholder="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
      <input
        placeholder="Raison sociale"
        value={raisonSociale}
        onChange={(e) => setRaisonSociale(e.target.value)}
      />
      {circuit === "collectivite" && (
        <input
          placeholder="Informations collectivité"
          value={infoCollectivite}
          onChange={(e) => setInfoCollectivite(e.target.value)}
        />
      )}
      <select value={typeModule} onChange={(e) => setTypeModule(e.target.value as TypeModule)}>
        {MODULES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
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
  );

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

      {sollicitationDetail && !formulaireOuvert ? (
        <div className={styles.detail}>
          <button className={styles.changerPersona} onClick={() => setIdDetail(null)}>
            ← Retour
          </button>
          <h2>{sollicitationDetail.organisme}</h2>
          <p>Contact : {sollicitationDetail.contact || "non renseigné"}</p>
          <p>Adresse : {sollicitationDetail.adresse || "non renseignée"}</p>
          <p>Raison sociale : {sollicitationDetail.raisonSociale || "non renseignée"}</p>
          {sollicitationDetail.circuit === "collectivite" && (
            <p>Informations collectivité : {sollicitationDetail.infoCollectivite || "non renseignées"}</p>
          )}
          <p>Module : {sollicitationDetail.module}</p>
          <p>
            Date et heure : {sollicitationDetail.date} {sollicitationDetail.heure || ""}
          </p>
          <p>Étape : {sollicitationDetail.etape}</p>
          <p className={styles.circuitBadge}>
            {sollicitationDetail.circuit === "collectivite"
              ? "Collectivité — sans facture"
              : `Entreprise — payante — ${sollicitationDetail.devis ? LIBELLES_DEVIS[sollicitationDetail.devis] : ""}`}
          </p>
          <p>Pièce jointe : non disponible dans cette version</p>
          <p>Signature électronique : non disponible dans cette version</p>
          <div className={styles.ficheActions}>
            <button onClick={() => ouvrirEdition(sollicitationDetail)}>Modifier</button>
            <button onClick={() => supprimerSollicitation(sollicitationDetail.id)}>Supprimer</button>
          </div>
        </div>
      ) : (
        <>
          <button
            className={styles.changerPersona}
            onClick={() => (formulaireOuvert ? fermerFormulaire() : setFormulaireOuvert(true))}
          >
            {formulaireOuvert ? "Annuler" : "Nouvelle sollicitation"}
          </button>
          {formulaireOuvert && champsFormulaire}
          {!formulaireOuvert && (
            <>
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
                    <button className={styles.lienDetail} onClick={() => setIdDetail(s.id)}>
                      <strong>{s.organisme}</strong> — {s.module} ({s.date}) — <em>{s.etape}</em>
                    </button>
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
            </>
          )}
        </>
      )}
    </main>
  );
}
