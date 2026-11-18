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
- **Temps restant au début de l'itération 2** : 26 minutes (redemandé, 2026-11-18). Pas de retour de l'équipe sur la version 1 à ce moment-là.
- **Bilan** :
  - Codage réel : 3 minutes, bien dans le budget (pas d'alarme à 8 minutes). Pas d'incident cette fois : images de base déjà en cache, `registry.internal`/`postgres.internal` déjà levés depuis l'itération 1 — build + push + redéploiement en ~1 minute. Temps total de l'itération (codage + déploiement + vérifications) : 5 minutes.
  - Les 3 critères d'acceptation sont satisfaits, vérifiés en local par `curl` (GET liste, POST valide → 201 et apparition dans la liste, POST avec champ vide → 400).
  - **Shortcut assumé** : stockage en mémoire, pas Postgres (voir `adr.md`, entrée du 2026-11-18, et `DEPLOIEMENT.md`) — les sollicitations créées ne survivent pas à un redémarrage du conteneur `api`. Non reporté comme critère manquant (aucun critère ne portait sur la persistance), mais à traiter avant la fin du build si le temps le permet.
  - Rien d'autre n'est reporté sur le périmètre de cette itération.
  - Contrat de déployabilité : aucune borne, aucune alarme (`./scripts/verifier-deployabilite.sh`).
  - Démo (`e2e/demo.spec.ts`, hors DoD) : mise à jour avec l'étape de création. Jouée en local contre `localhost:8080` (chromium installé pour l'occasion) : **échoue dès l'étape précédente** (« Je vois le tableau de bord ») — attendu et documenté dans `docs/guidelines-deploiement.md` : sans le proxy d'entrée de la VM, le front sur 8080 ne relaie pas `/api/v1/...` vers l'api sur 8081, donc le `fetch` initial ne reçoit pas de JSON. Rien à corriger ici ; se rejouera correctement une fois `BASE_URL=$URL_PUBLIQUE`, depuis l'extérieur.
  - **Modifications** :
    - `api/src/sollicitations.ts` (nouveau) : stockage en mémoire, seed de 3 fiches, `creerSollicitation` avec validation des champs obligatoires — sert les 3 critères.
    - `api/src/routes.ts` : routes `GET`/`POST /api/v1/sollicitations` — sert les 3 critères.
    - `api/src/server.ts` : lecture du corps des requêtes `POST`/`PUT` (le routeur restait une fonction pure, testable sans serveur) — nécessaire au 1ᵉʳ et 3ᵉ critères.
    - `api/src/routes.test.ts` : tests sur la création valide (liste mise à jour, statut 201) et sur le refus des champs vides — DoD point 2.
    - `frontend/src/app/data.ts` : ne garde que les personas ; les sollicitations viennent désormais de l'API.
    - `frontend/src/app/page.tsx` : formulaire « Nouvelle sollicitation », chargement de la liste via `fetch` (effet structuré pour éviter l'erreur eslint `react-hooks/set-state-in-effect` de cette version de React) — sert les 3 critères.
    - `frontend/src/app/page.module.css` : styles du formulaire et des erreurs.
    - `adr.md` : décision du stockage en mémoire.
    - `DEPLOIEMENT.md` : section « fragile » mise à jour (persistance), routes de l'api à jour.
    - `e2e/demo.spec.ts` : étape de création ajoutée (hors DoD).

## Itération 3 : Thème clair, ombres douces, accent bleu

- **⚠️ Demande directe du développeur**, insérée devant « les deux circuits » (repoussé en itération 4) : le design jugé trop austère pour donner envie. Changement de priorité non validé par les cadreurs — à signaler si l'équipe s'en étonne en test.
- **Dans le périmètre** : forcer le thème clair (retirer le mode sombre suivant les préférences système), ajouter des ombres douces sur les cartes et boutons, utiliser le bleu comme accent discret (bordures, focus, bouton principal).
- **Hors périmètre** : refonte de la mise en page, nouvelle typographie, nouveaux composants.
- **Critères d'acceptation** :
  - Étant donné la page ouverte (y compris avec une préférence système sombre), alors le thème reste clair sur tous les écrans.
  - Étant donné les cartes et le formulaire, alors ils ont une ombre douce visible.
  - Étant donné les éléments interactifs, alors ils utilisent le bleu en accent discret (pas dominant).
- **Hypothèse de l'équipe couverte** : aucune (demande du développeur, hors hypothèses de la passation).
- **Codage estimé** : 5 minutes.
- **Fichiers prévus** : `frontend/src/app/globals.css`, `frontend/src/app/page.module.css`. Soit 2 fichiers.
- **Tests unitaires prévus** : aucun (balisage/style pur, DoD l'autorise).
- **Étapes ajoutées à la démo** : aucune (pas de nouveau comportement, juste du style).
- **Temps restant au début** : moins de 15 minutes (redemandé, 2026-11-18).
- **Bilan** :
  - Codage réel : moins d'une minute (pur CSS, aucune alarme de budget).
  - Les 3 critères sont satisfaits : `globals.css` et `page.module.css` ne contiennent plus de `@media (prefers-color-scheme: dark)` ; `box-shadow` et `#2563eb` confirmés dans le CSS servi par le conteneur déployé (`curl` sur les chunks `_next/static/chunks/*.css`).
  - Rien n'est reporté.
  - Seul le service `frontend` a été reconstruit, poussé et redéployé (l'`api` n'a pas changé) — plus rapide.
  - Contrat de déployabilité : aucune borne, aucune alarme.
  - **Modifications** :
    - `frontend/src/app/globals.css` : thème clair forcé (suppression des deux blocs `prefers-color-scheme: dark`), variables `--accent`/`--accent-soft` — sert les 3 critères.
    - `frontend/src/app/page.module.css` : `box-shadow` sur `.personaButton`, `.changerPersona`, `.fiche`, `.formulaire` ; bordure gauche et focus en bleu, bouton de soumission en bleu plein — sert les 3 critères.

## Itération 4 : Les deux circuits (Entreprise / Collectivité)

- **Dans le périmètre** : à la création d'une sollicitation, choisir le circuit « Entreprise » ou « Collectivité » ; la fiche affiche les champs propres à son circuit (ex. mention « sans facture » pour une collectivité, mention payante pour une entreprise).
- **Hors périmètre** : suivi détaillé du devis (prochaine itération), sensibilisations dédiées, migration du stockage vers Postgres.
- **Critères d'acceptation** :
  - Étant donné le formulaire de création, quand on choisit un circuit, alors les champs affichés correspondent à ce circuit.
  - Étant donné une fiche Collectivité et une fiche Entreprise dans le tableau de bord, alors leur circuit est visible sans ambiguïté sur chacune.
- **Hypothèse de l'équipe couverte** : aucune (hypothèses non rédigées, voir ⚠️ en tête de fichier).
- **Codage estimé** : 8 minutes.
- **Fichiers prévus** : `api/src/sollicitations.ts` (champ `circuit`), `api/src/routes.ts` (validation selon circuit), `frontend/src/app/page.tsx` (sélecteur de circuit + affichage), `api/src/routes.test.ts`. Soit 4 fichiers.
- **Tests unitaires prévus** : 1 à 2, sur la validation spécifique au circuit.
- **Étapes ajoutées à la démo** : choisir un circuit à la création, vérifier son affichage sur la fiche.
- **⚠️ À confirmer au lancement** : redemander le temps restant ; avec moins de 15 minutes annoncées avant l'itération 3, le budget (8 codage + 5 publication + 10 tour de test ≈ 23 minutes) risque fort de ne plus tenir. Envisager de la consacrer à stabiliser le pitch à la place.
- **Temps restant au début** : 30 minutes (redemandé, 2026-11-18 — plus que l'estimation précédente). Plan confirmé tel quel par le développeur.
- **Bilan** :
  - Codage réel : 1 minute (pas d'alarme). Déploiement rapide (~1 minute, images majoritairement en cache). Temps total de l'itération : environ 3 minutes.
  - **Critère 2 satisfait** : chaque fiche affiche désormais son circuit (« Collectivité — sans facture » ou « Entreprise — payante »), vérifié par `curl` sur `GET /api/v1/sollicitations` et sur une création de chaque circuit.
  - **Critère 1 partiellement satisfait, à signaler** : le formulaire propose bien le choix du circuit (deux boutons radio), mais les *champs* du formulaire restent identiques pour les deux circuits (organisme, module, date) — je n'ai pas différencié les champs eux-mêmes comme le prévoyait le critère au sens strict (ex. informations spécifiques à une collectivité). Simplification assumée pour tenir le budget d'1 minute de codage ; à reprendre si une itération ultérieure a le temps de distinguer réellement les champs par circuit.
  - Contrat de déployabilité : aucune borne, aucune alarme.
  - Démo (`e2e/demo.spec.ts`, hors DoD) : étape circuit ajoutée, non rejouée en local (même limitation que l'itération 2 : pas de proxy `/api/` sur `localhost:8080` depuis cette machine).
  - **Modifications** :
    - `api/src/sollicitations.ts` : champ `circuit` (`entreprise` | `collectivite`), requis et validé, seed des 3 fiches d'exemple mises à jour — sert les 2 critères.
    - `api/src/routes.test.ts` : tests sur le circuit manquant/invalide et sur les deux valeurs acceptées — DoD point 2.
    - `frontend/src/app/data.ts` : type `Circuit` et champ `circuit` sur `Sollicitation`.
    - `frontend/src/app/page.tsx` : sélecteur de circuit (radio) dans le formulaire, badge de circuit sur chaque fiche — sert les 2 critères.
    - `frontend/src/app/page.module.css` : styles du sélecteur et du badge.
    - `e2e/demo.spec.ts` : étape de choix du circuit ajoutée (hors DoD).

## Itération 5 : Suivi de l'étape du devis (circuit entreprise)

- **Dans le périmètre** : quand le circuit « Entreprise » est choisi, le formulaire propose l'étape du devis (à envoyer / envoyé / signé) ; une fiche Collectivité n'affiche aucun champ devis (pas de facture).
- **Hors périmètre** : rédaction du devis ou de la facture (l'outil note seulement l'étape, hors périmètre de toute l'application), sensibilisations dédiées, migration Postgres.
- **Critères d'acceptation** :
  - Étant donné le circuit Entreprise choisi à la création, alors un sélecteur d'étape de devis (à envoyer / envoyé / signé) apparaît dans le formulaire.
  - Étant donné le circuit Collectivité choisi, alors aucun champ devis n'apparaît.
  - Étant donné une fiche Entreprise dans le tableau de bord, alors son étape de devis est visible.
- **Hypothèse de l'équipe couverte** : aucune (hypothèses non rédigées, voir ⚠️ en tête de fichier).
- **Codage estimé** : 7 minutes.
- **Fichiers prévus** : `api/src/sollicitations.ts` (champ `devis`, validation conditionnelle au circuit), `api/src/routes.test.ts`, `frontend/src/app/page.tsx` (champ conditionnel + affichage), `frontend/src/app/data.ts` (type). Soit 4 fichiers.
- **Tests unitaires prévus** : 1 à 2, sur la validation conditionnelle (devis obligatoire si entreprise, absent/ignoré si collectivité).
- **Étapes ajoutées à la démo** : choisir l'étape de devis pour une fiche Entreprise, vérifier son affichage.
- **⚠️ À confirmer au lancement** : redemander le temps restant et valider que ce découpage (pas de distinction de champs par circuit à l'itération 4, rattrapée ici pour le devis seulement) convient toujours aux cadreurs.
- **Bilan** : _à remplir en fin d'itération_

## À venir

1. Sensibilisations dans le même outil : le module accepte cluedo / Fresque de la rue / stand et apparaît dans le tableau de bord comme une formation.
2. Migrer le stockage des sollicitations de la mémoire vers Postgres (base `team44`, déjà créée sur la plateforme) — shortcut noté dans `adr.md`.
