# Membership Manager — Script de présentation

**Durée :** ~4–6 minutes  
**Langue :** Français  
**App :** MemberShip (admin dashboard + member portal)

---

## Avant de commencer — checklist de démo

- [ ] MySQL en marche : `docker compose up -d` (repo root)
- [ ] API en marche : `php artisan serve` (depuis `server/`)
- [ ] Client en marche : `npm run dev` (depuis `client/`)
- [ ] Browser ouvert sur http://localhost:5173
- [ ] Connecté en tant que **admin@example.com** / **password**
- [ ] Commencer sur **Admin → Dashboard** (`/admin/dashboard`)

**Demo member (à créer dans la Partie 4) :**

| Field | Value |
| ----- | ----- |
| Name | Demo Member |
| Email | demo@example.com |
| Password | password |
| National ID | NAT999999 |
| Phone | 0600000000 |

**Demo plan (à créer dans la Partie 3, puis supprimer) :**

| Field | Value |
| ----- | ----- |
| Name | Demo Monthly |
| Price | 150 |
| Duration | 30 days |

Pour le paiement de la Partie 5, utiliser un **plan seeded existant** (par ex. Monthly) afin que le member reste active après la suppression du demo plan.

---

## Partie 1 – Introduction

**Speech :**

Bonjour. Aujourd'hui je vais présenter **MemberShip**, un système de gestion d'adhésions.

Il peut servir pour toute activité qui fonctionne avec des members — comme une salle de sport, un club ou une bibliothèque.

L'application a deux rôles. L'**admin** gère les plans, les members, les payments et les check-ins. Le **member** consulte sa propre subscription et peut faire son check-in lui-même.

Elle est construite avec un **frontend React**, une **API Laravel** et une **base de données MySQL**.

Je commencerai par l'admin dashboard, puis je montrerai la partie member à la fin.

---

## Partie 2 – Admin Dashboard

**Speech :**

Voici l'admin dashboard. Il donne une vue d'ensemble rapide du système.

On voit ici **Total members**, **Active members** et **Expired members** — selon leur dernière subscription.

Ce graphique montre le **revenue** sur les six derniers mois, pour que l'admin puisse suivre les revenus dans le temps.

Maintenant je vais parcourir les pages de gestion principales une par une.

---

## Partie 3 – Plans Management

**Speech :**

Cette page sert à gérer les **plans d'adhésion**. Chaque plan a un nom, un prix en dirhams et une durée en jours.

Les admins peuvent créer, modifier et supprimer des plans ici.

Maintenant je vais créer un nouveau plan.

*Click **Add plan** → saisir Demo Monthly, 150 DH, 30 days → Save.*

Je vais modifier le prix pour montrer que l'édition fonctionne.

*Click **Edit** → changer le prix à 160 → Save.*

Et maintenant je vais le supprimer.

*Click **Delete** → confirmer.*

Ensuite, je vais gérer les members.

---

## Partie 4 – Members Management

**Speech :**

Sur cette page, l'admin gère les **members** — leur nom, email, national ID et téléphone.

On peut rechercher des members et filtrer par statut **active** ou **expired**.

Maintenant je vais créer un member pour notre démo.

*Click **Add member** → saisir Demo Member, demo@example.com, password, NAT999999, phone → Save.*

Je vais ouvrir le détail du member pour montrer le profil complet.

*Click sur la ligne → le detail drawer s'ouvre.*

On voit ici leurs **subscriptions**, **payments** et **check-ins**. Pour l'instant ce member est nouveau, donc la plupart de ces sections sont vides.

Enregistrons un payment pour activer sa subscription.

---

## Partie 5 – Payments Management

**Speech :**

La page payments sert à **enregistrer un payment**.

Quand on enregistre un payment, le système **crée ou prolonge automatiquement une subscription** pour ce member. On ne gère pas les subscriptions sur une page séparée.

Maintenant je vais saisir les informations de payment pour Demo Member.

*Select Demo Member → select a plan (par ex. Monthly) → le montant se remplit depuis le plan → Save.*

Ce payment rend la subscription du member **active**.

Ensuite, je vais faire le check-in de ce member côté admin.

---

## Partie 6 – Admin Check-ins

**Speech :**

Les check-ins permettent de suivre quand un member visite l'établissement.

Sur cette page, l'admin peut **faire le check-in de n'importe quel member** — par exemple à l'accueil.

Un member ne peut check-in que s'il a une **subscription active**. On vient de payer pour Demo Member, donc cela devrait fonctionner.

Maintenant je vais check-in Demo Member.

*Select Demo Member → click **Check in**.*

Le check-in apparaît dans la liste ci-dessous.

Maintenant je vais passer au rôle **member** et montrer ce que Demo Member voit.

---

## Partie 7 – Member Login

**Speech :**

Je vais me déconnecter du compte admin.

*Open profile menu → **Logout**.*

Voici la login page. Les members et les admins utilisent le même login, mais ils voient des menus différents après la connexion.

Maintenant je vais me connecter avec le member que nous avons créé.

*Enter demo@example.com and password → Login.*

On est redirigé vers le **member dashboard**. La sidebar est plus simple — seulement Dashboard et Check in.

---

## Partie 8 – Member Dashboard

**Speech :**

Voici le member dashboard. Il est en **read-only** — les members ne peuvent pas gérer d'autres personnes ici.

En haut on voit la **subscription actuelle** : **active** ou **expired**, le nom du plan et la date de fin.

En dessous, l'**historique des payments** — ce que le member a payé.

Et voici l'**historique des check-ins**, y compris le check-in que nous avons fait depuis la page admin.

Je vais montrer la page member check-in.

---

## Partie 9 – Member Check-in

**Speech :**

Sur cette page, le member peut **faire son check-in lui-même** à son arrivée.

Il clique sur un seul bouton — pas besoin de sélectionner un member. Le système utilise son propre compte.

Il faut une **subscription active** pour check-in. Demo Member est active, donc cela va fonctionner.

*Click **Check in**.*

Le nouveau check-in s'affiche dans la liste ci-dessous.

Cela couvre les deux parcours admin et member.

---

## Partie 10 – Conclusion

**Speech :**

Pour résumer, **MemberShip** est un système simple pour gérer les adhésions.

L'admin s'occupe des plans, des members, des payments et des check-ins. Le member consulte sa subscription et peut faire son check-in seul.

Tout ce que nous avons montré est connecté — un payment active une subscription, et une subscription active autorise les check-ins.

Merci pour votre attention. Je suis disponible pour vos questions.

---

## Guide de timing rapide

| Partie | Sujet | ~Secondes |
| ------ | ----- | --------- |
| 1 | Introduction | 35–45 |
| 2 | Admin dashboard | 25–35 |
| 3 | Plans CRUD | 40–50 |
| 4 | Members + drawer | 45–55 |
| 5 | Payments | 35–45 |
| 6 | Admin check-ins | 30–40 |
| 7 | Member login | 20–30 |
| 8 | Member dashboard | 25–35 |
| 9 | Member check-in | 20–30 |
| 10 | Conclusion | 20–30 |

**Conseil :** Dites d'abord les phrases courtes, puis faites les clicks. Faites une courte pause après chaque action réussie pour que le professeur puisse suivre.
