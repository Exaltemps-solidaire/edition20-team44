import { describe, expect, it } from "vitest";
import { filtrerSollicitations } from "./filtrer-sollicitations";
import type { Sollicitation } from "./data";

const liste: Sollicitation[] = [
  { id: "1", organisme: "A", module: "Formation", date: "2027-01-01", etape: "x", circuit: "collectivite" },
  { id: "2", organisme: "B", module: "Formation", date: "2027-01-02", etape: "x", circuit: "entreprise" },
];

describe("filtrerSollicitations", () => {
  it("renvoie tout quand le filtre est 'tout'", () => {
    expect(filtrerSollicitations(liste, "tout")).toHaveLength(2);
  });

  it("ne garde que le circuit demandé", () => {
    expect(filtrerSollicitations(liste, "collectivite")).toEqual([liste[0]]);
    expect(filtrerSollicitations(liste, "entreprise")).toEqual([liste[1]]);
  });
});
