# Architecture Decision Record (ADR)

Journal des décisions d'architecture prises pendant le hackathon (dépendance nouvelle, stockage, pattern structurant).

Une entrée par décision, ajoutée à la fin, au format :

```
### AAAA-MM-JJ — <titre court>

- **Décision** : ce qui a été choisi
- **Contexte** : le problème à résoudre
- **Alternatives envisagées** : les autres options, et pourquoi elles sont écartées
- **Conséquences** : les compromis acceptés
```

Le fichier est un journal : on ajoute, on ne réécrit pas. Pour revenir sur une décision, une nouvelle entrée le dit explicitement.

---

## Décisions

### 2026-11-18 — Stockage des sollicitations en mémoire (api/src/sollicitations.ts)

- **Décision** : les sollicitations créées à l'itération 2 vivent dans un tableau en mémoire du processus `api`, pas dans Postgres.
- **Contexte** : itération de 10 minutes, budget plein pris par le formulaire, la validation et les routes ; la base `team44` existe déjà sur la plateforme mais n'est pas encore câblée côté `api`.
- **Alternatives envisagées** : Postgres dès cette itération — écartée, le temps ne le permettait pas dans le budget annoncé par le développeur (26 minutes restantes pour toute l'itération).
- **Conséquences** : shortcut : les sollicitations créées ne survivent pas à un redémarrage du conteneur `api` (contrat de déployabilité, règle 6, non respectée pour l'instant) ; à migrer vers Postgres dès qu'une itération a le budget pour le faire, avant la fin du build si possible.
