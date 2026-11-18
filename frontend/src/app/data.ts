export type Persona = { id: string; nom: string; role: string };
export type Sollicitation = {
  id: string;
  organisme: string;
  module: string;
  date: string;
  etape: string;
};

export const personas: Persona[] = [
  { id: "p1", nom: "Amina Diallo", role: "Responsable d'antenne Île-de-France" },
  { id: "p2", nom: "Camille Fabre", role: "Directrice du développement et des partenariats" },
];
