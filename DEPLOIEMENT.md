# Déploiement

Application de suivi des sollicitations de formation et de sensibilisation pour **La Cloche** (lutte contre l'exclusion des personnes sans domicile), pôle « Changer les regards » : elle permet à une responsable d'antenne de noter l'étape d'une demande dans un outil partagé par l'équipe.

## Services

- `frontend/` : Next.js en export statique, servi par nginx (port 80 du conteneur, port 8080 sur la VM). **Service exposé au public.**
- `api/` : Node sans dépendance (port 8081 du conteneur, port 8081 sur la VM), routes `/health` et `/sante`. Pas encore appelée par le front (données en dur à ce stade).

## Services externes

Aucun à ce stade (pas de base de données, pas d'appel LLM, pas de stockage objet).

## Ce qui est fragile ou inachevé

- Les sollicitations affichées sont des données en dur (`frontend/src/app/data.ts`) : rien n'est encore persisté ni créé par un formulaire.
- Pas de distinction entre les circuits Entreprise et Collectivité, pas de suivi du devis, pas de sensibilisations dédiées : prévu aux itérations suivantes (voir `ITERATIONS.md`).

## Contacts

- Équipe : Équipe 44.
- Association : La Cloche, via les cadreurs de l'équipe sur PM Lab Solidaire.
