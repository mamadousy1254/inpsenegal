# INP – Institut National de Pédologie

Site officiel de l'**Institut National de Pédologie** (Sénégal).  
Établissement public à caractère scientifique et technologique – Référence nationale en science des sols.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **Framer Motion** – animations
- **Lucide Icons**
- **Parse Server (Back4App)** – CMS & données (Publications, Actualités, etc.)

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | URL du site (ex. `https://inp.sn`) |
| `NEXT_PUBLIC_PARSE_APP_ID` | Application ID Back4App |
| `NEXT_PUBLIC_PARSE_JS_KEY` | JavaScript Key Back4App |
| `NEXT_PUBLIC_PARSE_SERVER_URL` | URL Parse (ex. `https://parseapi.back4app.com`) |

## Structure

```
/app          → Routes (page.tsx, layout.tsx)
/components   → UI, layout (header, footer), sections homepage
/lib          → utils (cn)
/services     → Parse (getPublications, getActualites)
/types        → Types TypeScript + déclarations Parse
```

## Pages

- `/` – Accueil (hero, missions, chiffres clés, recherche, carto, publications, actualités)
- `/institut`, `/missions`, `/recherche`, `/cartographie`, `/laboratoires`
- `/publications`, `/actualites`, `/services`, `/partenaires`, `/documentation`
- `/contact`, `/mentions-legales`, `/espace-professionnel`

## Back4App (Parse)

Collections prévues : `Publication`, `Actualite`, `Service`, `Partenaire`, `Laboratoire`, `Projet`, `Document`, `_User`, **Director**.

### Collection Director (Mot du Directeur)

| Champ     | Type   | Requis |
|----------|--------|--------|
| fullName | String | oui    |
| title    | String | oui    |
| quote    | String | oui    |
| message  | Text   | oui    |
| photo    | File   | non    |
| signature| File   | non    |

Un seul enregistrement est utilisé (le plus récent). Récupération côté serveur via `getDirector()` dans `lib/parse-server.ts`.  
Sans clés Parse, les blocs Publications et Actualités affichent un message vide (pas d’erreur).

## Identité visuelle

- **Vert institutionnel** : `#1F3D2B`
- **Beige sable** : `#D8C3A5`
- **Marron terre** : `#8B5E3C`

Logo : composant SVG dans le header. Pour utiliser le logo PNG, placer l’image dans `public/assets/inp-logo.png` et utiliser le composant `Logo` dans le header.

## Scripts

- `npm run dev` – développement
- `npm run build` – build production
- `npm run start` – serveur production
- `npm run lint` – ESLint
