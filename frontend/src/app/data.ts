export type Persona = { id: string; nom: string; role: string };
export type Sollicitation = {
  id: string;
  organisme: string;
  module: string;
  etape: string;
};

export const personas: Persona[] = [
  { id: "p1", nom: "Amina Diallo", role: "Responsable d'antenne Île-de-France" },
  { id: "p2", nom: "Camille Fabre", role: "Directrice du développement et des partenariats" },
];

export const sollicitationsExemple: Sollicitation[] = [
  { id: "s1", organisme: "Mairie de Paris", module: "Formation", etape: "Session planifiée" },
  { id: "s2", organisme: "Entreprise Lumio", module: "Sensibilisation — Fresque de la rue", etape: "Devis envoyé" },
  { id: "s3", organisme: "Lycée Voltaire", module: "Formation", etape: "Demande reçue" },
];
