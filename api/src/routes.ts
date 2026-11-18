// Routage de l'API, sans dépendance : une fonction pure, testable sans démarrer de serveur.
// Le proxy d'entrée envoie /api/... à ce service sans retirer le préfixe : les routes métier
// se déclarent donc sous /api/v1/... ; /health et /sante restent à la racine (port 8081).
import {
  creerSollicitation,
  listerSollicitations,
  modifierSollicitation,
  supprimerSollicitation,
} from "./sollicitations.ts";

export type Reponse = { statut: number; corps?: unknown };

export function router(methode: string, url: string, corps?: unknown): Reponse {
  const chemin = new URL(url, "http://api").pathname;
  if (methode === "GET" && (chemin === "/health" || chemin === "/sante")) {
    return { statut: 200, corps: { status: "ok" } };
  }
  if (chemin === "/api/v1/sollicitations") {
    if (methode === "GET") {
      return { statut: 200, corps: listerSollicitations() };
    }
    if (methode === "POST") {
      const resultat = creerSollicitation((corps ?? {}) as Record<string, unknown>);
      return resultat.ok
        ? { statut: 201, corps: resultat.sollicitation }
        : { statut: 400, corps: { erreur: resultat.erreur } };
    }
  }
  const correspondance = chemin.match(/^\/api\/v1\/sollicitations\/([^/]+)$/);
  if (correspondance) {
    const id = correspondance[1];
    if (methode === "PUT") {
      const resultat = modifierSollicitation(id, (corps ?? {}) as Record<string, unknown>);
      if (!resultat.ok) {
        return { statut: resultat.erreur === "sollicitation introuvable" ? 404 : 400, corps: { erreur: resultat.erreur } };
      }
      return { statut: 200, corps: resultat.sollicitation };
    }
    if (methode === "DELETE") {
      const resultat = supprimerSollicitation(id);
      return resultat.ok ? { statut: 204 } : { statut: 404, corps: { erreur: resultat.erreur } };
    }
  }
  return { statut: 404 };
}
