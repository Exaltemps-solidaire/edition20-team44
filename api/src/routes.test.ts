import { describe, expect, it } from "vitest";
import { router } from "./routes.ts";
import { creerSollicitation, listerSollicitations } from "./sollicitations.ts";

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
    });
    expect(reponse.statut).toBe(201);
    expect(listerSollicitations().length).toBe(avant + 1);
  });
});

describe("creerSollicitation", () => {
  it("refuse un champ obligatoire manquant ou vide", () => {
    expect(creerSollicitation({ organisme: "", module: "Formation", date: "2027-01-01" }).ok).toBe(false);
    expect(creerSollicitation({ organisme: "X", module: "Formation" }).ok).toBe(false);
  });
});
