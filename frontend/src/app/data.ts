export type Persona = { id: string; nom: string; role: string };
export type Circuit = "entreprise" | "collectivite";
export type EtapeDevis = "a_envoyer" | "envoye" | "signe";
export type TypeModule = "Formation" | "Sensibilisation";
export type Sollicitation = {
  id: string;
  organisme: string;
  module: TypeModule;
  date: string;
  heure?: string;
  etape: string;
  circuit: Circuit;
  devis?: EtapeDevis;
  contact?: string;
  adresse?: string;
  raisonSociale?: string;
  infoCollectivite?: string;
};

export const MODULES: TypeModule[] = ["Formation", "Sensibilisation"];

export const LIBELLES_DEVIS: Record<EtapeDevis, string> = {
  a_envoyer: "Devis à envoyer",
  envoye: "Devis envoyé",
  signe: "Devis signé",
};

export const personas: Persona[] = [
  { id: "p1", nom: "Amina Diallo", role: "Responsable d'antenne Île-de-France" },
  { id: "p2", nom: "Camille Fabre", role: "Directrice du développement et des partenariats" },
];
