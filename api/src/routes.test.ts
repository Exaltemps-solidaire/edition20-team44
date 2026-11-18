import { describe, expect, it } from "vitest";
import { router } from "./routes.ts";
import { creerSollicitation, listerSollicitations, modifierSollicitation, supprimerSollicitation } from "./sollicitations.ts";

describe("router", () => {
  it("répond 200 sur les deux routes de santé", () => {
    expect(router("GET", "/health").statut).toBe(200);
    expect(router("GET", "/sante?x=1").statut).toBe(200);
  });

  it("répond 404 sur une route inconnue ou une méthode non prévue", () => {
    expect(router("GET", "/api/v1/inconnue").statut).toBe(404);
    expect(router("POST", "/health").statut).toBe(404);
  });

  it("crée une sollicitation valide et la retrouve dans la liste", () => {
    const avant = listerSollicitations().length;
    const reponse = router("POST", "/api/v1/sollicitations", {
      organisme: "Collège Pasteur",
      module: "Cluedo",
      date: "2027-01-15",
      circuit: "entreprise",
      devis: "a_envoyer",
    });
    expect(reponse.statut).toBe(201);
    expect(listerSollicitations().length).toBe(avant + 1);
  });
});

describe("creerSollicitation", () => {
  it("refuse un champ obligatoire manquant ou vide", () => {
    expect(creerSollicitation({ organisme: "", module: "Formation", date: "2027-01-01", circuit: "entreprise", devis: "envoye" }).ok).toBe(false);
    expect(creerSollicitation({ organisme: "X", module: "Formation", circuit: "entreprise", devis: "envoye" }).ok).toBe(false);
  });

  it("refuse un circuit manquant ou inconnu, accepte entreprise et collectivite", () => {
    expect(creerSollicitation({ organisme: "X", module: "Formation", date: "2027-01-01", devis: "envoye" }).ok).toBe(false);
    expect(creerSollicitation({ organisme: "X", module: "Formation", date: "2027-01-01", circuit: "autre", devis: "envoye" }).ok).toBe(false);
    expect(creerSollicitation({ organisme: "X", module: "Formation", date: "2027-01-01", circuit: "collectivite" }).ok).toBe(true);
  });

  it("exige un devis valide pour le circuit entreprise, l'ignore pour collectivite", () => {
    expect(creerSollicitation({ organisme: "X", module: "Formation", date: "2027-01-01", circuit: "entreprise" }).ok).toBe(false);
    expect(creerSollicitation({ organisme: "X", module: "Formation", date: "2027-01-01", circuit: "entreprise", devis: "autre" }).ok).toBe(false);
    const resultat = creerSollicitation({ organisme: "X", module: "Formation", date: "2027-01-01", circuit: "entreprise", devis: "signe" });
    expect(resultat.ok).toBe(true);
    expect(resultat.ok && resultat.sollicitation.devis).toBe("signe");
    const collectivite = creerSollicitation({ organisme: "Y", module: "Formation", date: "2027-01-01", circuit: "collectivite", devis: "signe" });
    expect(collectivite.ok && collectivite.sollicitation.devis).toBeUndefined();
  });
});

describe("modifierSollicitation", () => {
  it("met à jour une fiche existante sans en créer une nouvelle", () => {
    const cree = creerSollicitation({ organisme: "Avant", module: "Formation", date: "2027-01-01", circuit: "collectivite" });
    const avant = listerSollicitations().length;
    const id = cree.ok ? cree.sollicitation.id : "";
    const resultat = modifierSollicitation(id, { organisme: "Après", module: "Formation", date: "2027-01-01", circuit: "collectivite" });
    expect(resultat.ok).toBe(true);
    expect(resultat.ok && resultat.sollicitation.organisme).toBe("Après");
    expect(listerSollicitations().length).toBe(avant);
  });

  it("refuse une fiche introuvable ou des champs invalides", () => {
    expect(modifierSollicitation("inconnu", { organisme: "X", module: "Y", date: "2027-01-01", circuit: "collectivite" }).ok).toBe(false);
    const cree = creerSollicitation({ organisme: "X", module: "Y", date: "2027-01-01", circuit: "collectivite" });
    const id = cree.ok ? cree.sollicitation.id : "";
    expect(modifierSollicitation(id, { organisme: "", module: "Y", date: "2027-01-01", circuit: "collectivite" }).ok).toBe(false);
  });
});

describe("supprimerSollicitation", () => {
  it("retire une fiche existante de la liste", () => {
    const cree = creerSollicitation({ organisme: "À supprimer", module: "Formation", date: "2027-01-01", circuit: "collectivite" });
    const id = cree.ok ? cree.sollicitation.id : "";
    const avant = listerSollicitations().length;
    expect(supprimerSollicitation(id).ok).toBe(true);
    expect(listerSollicitations().length).toBe(avant - 1);
  });

  it("refuse une fiche introuvable", () => {
    expect(supprimerSollicitation("inconnu").ok).toBe(false);
  });
});
