# ITERATIONS.md

- **Plan validé le 2026-11-18** (tel quel, par le développeur).
- **Source du plan** : proposé par l'agent. Aucun plan d'itérations de l'équipe trouvé dans la passation (ni fichier `cadrage/*iteration*`, ni clé `iterations` dans `passation.json`) : la passation s'arrête au PRD (`cadrage/7-prd.md`) et à son plan de livraison en 4 étapes, qui n'est pas un découpage en itérations de 10 minutes.
- **Temps restant annoncé** : 60 minutes, au moment de cette planification (2026-11-18).
- **Temps restant au début de l'itération 1** : 45 minutes (redemandé, 2026-11-18).
- **Durée du tour de test de l'équipe** : 10 minutes (valeur par défaut, le développeur ne savait pas la durée exacte).
- **Capacité estimée** : itération 1 (~23 min : codage + publication + tour de test) + itération 2 (~25 min) ≈ 48 minutes, ce qui laisse ~12 minutes de marge — pas assez pour une 3ᵉ itération complète, même courte (minimum réaliste ~18 minutes). **✂️ Seules 2 itérations sont détaillées** ; le reste du PRD passe en liste « À venir » et ne sera pas construit dans ce créneau.
- **Hors périmètre de ce build (✂️)** : la distinction des deux circuits (Entreprise / Collectivité), le suivi de l'étape du devis, et les sensibilisations dans l'outil — toutes prévues par le PRD mais repoussées faute de temps. À reprendre au prochain créneau de build, en commençant par les circuits (le PRD les place juste après le cœur du parcours).
- **⚠️ Hypothèses de la squad non couvertes explicitement** : `cadrage/5-hypotheses.md` est encore « Pas encore produit ». Aucune itération ci-dessous ne peut donc citer une hypothèse précise de l'équipe — à signaler aux cadreurs, qui devraient les rédiger pendant que le build avance.

## Itération 1 : L'application s'ouvre sur un choix de persona, puis affiche le tableau de bord des sollicitations (données en dur)

- **Dans le périmètre** :
  - `.env.example` et `DEPLOIEMENT.md` (le squelette `api/`/`frontend/` a déjà ses `Dockerfile` et ses routes `/health`/`/sante` — confirmé dans le repo).
  - Écran « Qui êtes-vous ? » : liste de personas avec nom et rôle (ex. responsable d'antenne Île-de-France, directrice du développement et des partenariats), bouton pour changer de persona à tout moment.
  - Tableau de bord des sollicitations : liste de fiches d'exemple en dur (organisme, module, étape).
- **Hors périmètre** : création réelle d'une fiche, les deux circuits, le suivi du devis, les sensibilisations, toute connexion/compte.
- **Critères d'acceptation** :
  - Étant donné l'application démarrée, quand on ouvre `/`, alors l'écran « Qui êtes-vous ? » propose au moins 2 personas.
  - Étant donné un persona choisi et validé, alors le tableau de bord affiche une liste de sollicitations d'exemple avec leur étape.
  - Étant donné l'application déployée, quand on vérifie `/health` et `/sante` sur le port 8080, alors elles répondent 200 avec un corps vérifiable (pas seulement le code, qui est aussi celui de la page de réveil).
- **Hypothèse de l'équipe couverte** : aucune (hypothèses non rédigées dans la passation, voir ⚠️ ci-dessus).
- **Codage estimé** : 8 minutes.
- **Fichiers prévus** : `.env.example`, `DEPLOIEMENT.md`, `frontend/src/app/page.tsx` (écran persona), un composant ou une page tableau de bord, un fichier de données d'exemple (personas + fiches en dur). Soit 5 fichiers.
- **Tests unitaires prévus** : probablement aucun test métier requis (écran + données en dur, pas de logique à tester) — la DoD l'autorise (« pas de test sur du balisage pur »). À confirmer en fin de codage si une règle d'affichage apparaît (ex. tri des fiches).
- **Étapes ajoutées à la démo** : ouvrir l'app → choisir un persona → voir le tableau de bord avec les fiches d'exemple.
- **Bilan** :
  - Codage réel : 2 minutes, bien dans le budget. Aucun test métier ajouté : écran + données en dur, pas de logique (conforme à la DoD).
  - **⚠️ Incident hors codage, 17 minutes perdues** : le démarrage de la plateforme (`gitlab-ci-local`) et mes propres `podman build` ont buté sur la limite de pull anonyme de Docker Hub (`toomanyrequests`), probablement saturée par l'ensemble des équipes du hackathon sur la même IP sortante. `registry.internal` et `postgres.internal` ne démarraient pas, bloquant push et déploiement. Levé par une connexion authentifiée (`podman login docker.io`, identifiants de l'équipe), après quoi tout a réussi du premier coup. Les services `seed-object-store`, `seed-temporal`, `seed-idp`, `seed-analytics` du premier passage de la plateforme sont restés en échec (containers créés après coup par le second passage, non revérifiés un par un — aucun n'est utilisé par cette itération).
  - Les 3 critères d'acceptation sont satisfaits, vérifiés en local (`curl localhost:8080/`, `/health`, `/sante`, `localhost:8081/health`, `/sante`).
  - Rien n'est reporté sur le périmètre de cette itération.
  - Contrat de déployabilité : aucune borne, aucune alarme (`./scripts/verifier-deployabilite.sh`).
  - **Modifications** :
    - `frontend/src/app/data.ts` (nouveau) : personas et sollicitations d'exemple en dur — sert les 2 premiers critères.
    - `frontend/src/app/page.tsx` : écran persona + tableau de bord sur une seule route (un seul écran nouveau au sens des règles de taille, pas deux) — sert les 2 premiers critères.
    - `frontend/src/app/page.module.css` : mise en forme minimale des deux écrans.
    - `.env.example` (nouveau) : variable `PORT` lue par `api/src/server.ts` — contrat de déployabilité, règle 2.
    - `DEPLOIEMENT.md` (nouveau) : page de déploiement — contrat de déployabilité, règle 8.
    - `api/Dockerfile`, `frontend/Dockerfile` : image de base qualifiée en `docker.io/library/...` (exigé par le `/CLAUDE.md` du serveur, résolution des noms courts échoue hors terminal interactif).
    - `frontend/nginx.conf` : en-têtes de sécurité et CSP repris du gabarit du serveur, adaptés (`connect-src`/`script-src` sans les adresses injoignables, `'unsafe-inline'` nécessaire à l'hydratation de Next.js) — 3ᵉ critère (page servie correctement, pas blanche).
    - `podman-compose.yml` (nouveau, racine) : les deux services, ports 8080/8081, réseau `core-network`.
    - `e2e/demo.spec.ts` : ajout des étapes persona + tableau de bord (hors DoD).

## Itération 2 : Créer une fiche de sollicitation et la retrouver dans le tableau de bord partagé

- **⚠️ Marge réduite** : l'incident Docker Hub de l'itération 1 a consommé 17 des 45 minutes annoncées pour tout le build. Il reste environ 26 minutes, pour un budget d'itération 2 estimé à ~25 minutes (10 codage + 5 publication + 10 tour de test) : ça ne tient que si rien d'autre n'accroche. Redemander le temps restant en tout début d'itération 2, comme prévu, pour confirmer ou réduire.
- **Dans le périmètre** : formulaire « Nouvelle sollicitation » (organisme, module, date), stockage de la fiche côté API, apparition immédiate dans le tableau de bord pour tout persona.
- **Hors périmètre** : distinction des circuits Entreprise/Collectivité, suivi du devis, sensibilisations spécifiques, édition ou suppression d'une fiche.
- **Critères d'acceptation** :
  - Étant donné le tableau de bord, quand on clique « Nouvelle sollicitation » et qu'on renseigne organisme, module et date, alors la fiche apparaît dans la liste partagée.
  - Étant donné une fiche créée par un persona, quand un autre persona recharge le tableau de bord, alors il voit la fiche à jour sans l'avoir saisie lui-même.
  - Étant donné un champ obligatoire vide (organisme, module ou date), quand on tente de valider, alors la création est refusée et l'erreur est visible.
- **Hypothèse de l'équipe couverte** : aucune (voir ⚠️ en tête de fichier).
- **Codage estimé** : 10 minutes (budget plein).
- **Fichiers prévus** : composant/page du formulaire, `api/src/routes.ts` (routes `GET`/`POST /api/v1/sollicitations`), un module de stockage (en mémoire, par simplicité à ce stade — décision à loguer dans `adr.md` si elle structure la suite), l'appel front en chemin relatif, `api/src/routes.test.ts`. Soit 5 fichiers.
- **Tests unitaires prévus** : 1 à 3, sur la validation des champs obligatoires et sur l'ajout effectif de la fiche au stockage.
- **Étapes ajoutées à la démo** : + cliquer « Nouvelle sollicitation » → remplir organisme/module/date → valider → vérifier que la fiche apparaît dans le tableau de bord.
- **Bilan** : _à remplir en fin d'itération (durée de codage réelle, dépassement éventuel, fait, reporté, modifications fichier par fichier)_

## À venir

1. Les deux circuits (Entreprise / Collectivité) : le choix à la création affiche les champs propres à chaque parcours (fiche organisme détaillée selon le circuit).
2. Suivi de l'étape du devis (circuit entreprise) : payant ou non, étape du devis (à envoyer / envoyé / signé) visible sur la fiche, sans le produire.
3. Sensibilisations dans le même outil : le module accepte cluedo / Fresque de la rue / stand et apparaît dans le tableau de bord comme une formation.
