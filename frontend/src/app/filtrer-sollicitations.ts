import type { Circuit, Sollicitation } from "./data";

export type Filtre = "tout" | Circuit;

export function filtrerSollicitations(liste: Sollicitation[], filtre: Filtre): Sollicitation[] {
  if (filtre === "tout") return liste;
  return liste.filter((s) => s.circuit === filtre);
}
