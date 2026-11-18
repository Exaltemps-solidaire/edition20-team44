export type Circuit = "entreprise" | "collectivite";

export type Sollicitation = {
  id: string;
  organisme: string;
  module: string;
  date: string;
  etape: string;
  circuit: Circuit;
};

export type NouvelleSollicitation = {
  organisme?: unknown;
  module?: unknown;
  date?: unknown;
  circuit?: unknown;
};

const CIRCUITS: Circuit[] = ["entreprise", "collectivite"];

let compteur = 0;
const sollicitations: Sollicitation[] = [
  { id: "s1", organisme: "Mairie de Paris", module: "Formation", date: "2026-12-01", etape: "Session planifiée", circuit: "collectivite" },
  { id: "s2", organisme: "Entreprise Lumio", module: "Sensibilisation — Fresque de la rue", date: "2026-12-05", etape: "Devis envoyé", circuit: "entreprise" },
  { id: "s3", organisme: "Lycée Voltaire", module: "Formation", date: "2026-12-10", etape: "Demande reçue", circuit: "entreprise" },
];

export function listerSollicitations(): Sollicitation[] {
  return sollicitations;
}

export function creerSollicitation(
  entree: NouvelleSollicitation,
): { ok: true; sollicitation: Sollicitation } | { ok: false; erreur: string } {
  const champsVides = ["organisme", "module", "date"].filter(
    (champ) => typeof entree[champ as keyof NouvelleSollicitation] !== "string" || !(entree[champ as keyof NouvelleSollicitation] as string).trim(),
  );
  if (champsVides.length > 0) {
    return { ok: false, erreur: `champ(s) obligatoire(s) manquant(s) : ${champsVides.join(", ")}` };
  }
  if (typeof entree.circuit !== "string" || !CIRCUITS.includes(entree.circuit as Circuit)) {
    return { ok: false, erreur: `circuit invalide : attendu ${CIRCUITS.join(" ou ")}` };
  }
  compteur += 1;
  const sollicitation: Sollicitation = {
    id: `s${sollicitations.length + compteur}`,
    organisme: (entree.organisme as string).trim(),
    module: (entree.module as string).trim(),
    date: (entree.date as string).trim(),
    etape: "Demande reçue",
    circuit: entree.circuit as Circuit,
  };
  sollicitations.push(sollicitation);
  return { ok: true, sollicitation };
}
