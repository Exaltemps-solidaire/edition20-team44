# Déploiement

Application de suivi des sollicitations de formation et de sensibilisation pour **La Cloche** (lutte contre l'exclusion des personnes sans domicile), pôle « Changer les regards » : elle permet à une responsable d'antenne de noter l'étape d'une demande dans un outil partagé par l'équipe.

## Services

- `frontend/` : Next.js en export statique, servi par nginx (port 80 du conteneur, port 8080 sur la VM). **Service exposé au public.**
- `api/` : Node sans dépendance (port 8081 du conteneur, port 8081 sur la VM), routes `/health`, `/sante`, et `/api/v1/sollicitations` (GET, POST).

## Services externes

Aucun appel externe. Une base `team44` existe sur la plateforme (Postgres) mais n'est pas encore câblée : voir ci-dessous.

## Ce qui est fragile ou inachevé

- **Les sollicitations sont stockées en mémoire dans le processus `api`** (`api/src/sollicitations.ts`), pas dans Postgres : elles disparaissent à chaque redémarrage du conteneur `api` (voir `adr.md`, entrée du 2026-11-18). À migrer vers la base `team44` dès qu'une itération a le budget.
- Pas de distinction entre les circuits Entreprise et Collectivité, pas de suivi du devis, pas de sensibilisations dédiées : prévu aux itérations suivantes (voir `ITERATIONS.md`).

## Contacts

- Équipe : Équipe 44.
- Association : La Cloche, via les cadreurs de l'équipe sur PM Lab Solidaire.
