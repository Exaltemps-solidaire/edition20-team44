export type Circuit = "entreprise" | "collectivite";
export type EtapeDevis = "a_envoyer" | "envoye" | "signe";

export type Sollicitation = {
  id: string;
  organisme: string;
  module: string;
  date: string;
  etape: string;
  circuit: Circuit;
  devis?: EtapeDevis;
};

export type NouvelleSollicitation = {
  organisme?: unknown;
  module?: unknown;
  date?: unknown;
  circuit?: unknown;
  devis?: unknown;
};

const CIRCUITS: Circuit[] = ["entreprise", "collectivite"];
const ETAPES_DEVIS: EtapeDevis[] = ["a_envoyer", "envoye", "signe"];

let compteur = 0;
const sollicitations: Sollicitation[] = [
  { id: "s1", organisme: "Mairie de Paris", module: "Formation", date: "2026-12-01", etape: "Session planifiée", circuit: "collectivite" },
  { id: "s2", organisme: "Entreprise Lumio", module: "Sensibilisation — Fresque de la rue", date: "2026-12-05", etape: "Devis envoyé", circuit: "entreprise", devis: "envoye" },
  { id: "s3", organisme: "Lycée Voltaire", module: "Formation", date: "2026-12-10", etape: "Demande reçue", circuit: "entreprise", devis: "a_envoyer" },
];

export function listerSollicitations(): Sollicitation[] {
  return sollicitations;
}

type ChampsValides = {
  organisme: string;
  module: string;
  date: string;
  circuit: Circuit;
  devis?: EtapeDevis;
};

function validerChamps(entree: NouvelleSollicitation): { ok: true; valeurs: ChampsValides } | { ok: false; erreur: string } {
  const champsVides = ["organisme", "module", "date"].filter(
    (champ) => typeof entree[champ as keyof NouvelleSollicitation] !== "string" || !(entree[champ as keyof NouvelleSollicitation] as string).trim(),
  );
  if (champsVides.length > 0) {
    return { ok: false, erreur: `champ(s) obligatoire(s) manquant(s) : ${champsVides.join(", ")}` };
  }
  if (typeof entree.circuit !== "string" || !CIRCUITS.includes(entree.circuit as Circuit)) {
    return { ok: false, erreur: `circuit invalide : attendu ${CIRCUITS.join(" ou ")}` };
  }
  const circuit = entree.circuit as Circuit;
  if (circuit === "entreprise" && (typeof entree.devis !== "string" || !ETAPES_DEVIS.includes(entree.devis as EtapeDevis))) {
    return { ok: false, erreur: `devis invalide : attendu ${ETAPES_DEVIS.join(" ou ")}` };
  }
  return {
    ok: true,
    valeurs: {
      organisme: (entree.organisme as string).trim(),
      module: (entree.module as string).trim(),
      date: (entree.date as string).trim(),
      circuit,
      ...(circuit === "entreprise" ? { devis: entree.devis as EtapeDevis } : {}),
    },
  };
}

export function creerSollicitation(
  entree: NouvelleSollicitation,
): { ok: true; sollicitation: Sollicitation } | { ok: false; erreur: string } {
  const resultat = validerChamps(entree);
  if (!resultat.ok) return resultat;
  compteur += 1;
  const sollicitation: Sollicitation = {
    id: `s${sollicitations.length + compteur}`,
    etape: "Demande reçue",
    ...resultat.valeurs,
  };
  sollicitations.push(sollicitation);
  return { ok: true, sollicitation };
}

export function modifierSollicitation(
  id: string,
  entree: NouvelleSollicitation,
): { ok: true; sollicitation: Sollicitation } | { ok: false; erreur: string } {
  const index = sollicitations.findIndex((s) => s.id === id);
  if (index === -1) {
    return { ok: false, erreur: "sollicitation introuvable" };
  }
  const resultat = validerChamps(entree);
  if (!resultat.ok) return resultat;
  const sollicitation: Sollicitation = {
    ...sollicitations[index],
    ...resultat.valeurs,
    devis: resultat.valeurs.circuit === "entreprise" ? resultat.valeurs.devis : undefined,
  };
  sollicitations[index] = sollicitation;
  return { ok: true, sollicitation };
}

export function supprimerSollicitation(id: string): { ok: true } | { ok: false; erreur: string } {
  const index = sollicitations.findIndex((s) => s.id === id);
  if (index === -1) {
    return { ok: false, erreur: "sollicitation introuvable" };
  }
  sollicitations.splice(index, 1);
  return { ok: true };
}
