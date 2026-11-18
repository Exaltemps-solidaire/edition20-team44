// Service api du gabarit : écoute sur PORT (8081 par défaut), journaux sur la sortie standard.
// Lancé directement par Node (suppression des types TypeScript), sans étape de compilation.
import { createServer } from "node:http";
import { router } from "./routes.ts";

const port = Number(process.env.PORT ?? 8081);

function repondre(res: import("node:http").ServerResponse, statut: number, corps: unknown) {
  if (corps === undefined) {
    res.writeHead(statut).end();
  } else {
    res.writeHead(statut, { "Content-Type": "application/json" }).end(JSON.stringify(corps));
  }
}

const serveur = createServer((req, res) => {
  if (req.method === "POST" || req.method === "PUT") {
    let donnees = "";
    req.on("data", (morceau) => (donnees += morceau));
    req.on("end", () => {
      let corpsRequete: unknown;
      try {
        corpsRequete = donnees ? JSON.parse(donnees) : undefined;
      } catch {
        return repondre(res, 400, { erreur: "corps JSON invalide" });
      }
      const { statut, corps } = router(req.method ?? "GET", req.url ?? "/", corpsRequete);
      repondre(res, statut, corps);
    });
  } else {
    const { statut, corps } = router(req.method ?? "GET", req.url ?? "/");
    repondre(res, statut, corps);
  }
});

serveur.listen(port, () => console.log(`api : à l'écoute sur le port ${port}`));

// Arrêt propre : le conteneur reçoit SIGTERM, on termine les requêtes en cours avant de sortir.
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    console.log(`api : ${signal} reçu, arrêt`);
    serveur.close(() => process.exit(0));
  });
}
