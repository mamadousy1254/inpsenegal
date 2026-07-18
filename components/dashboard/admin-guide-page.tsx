"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  CalendarClockIcon,
  CalendarIcon,
  DatabaseIcon,
  MailIcon,
  NewspaperIcon,
  PlaneIcon,
  UsersIcon,
} from "lucide-react";

const SECTIONS = [
  { id: "missions", label: "Missions", icon: PlaneIcon },
  { id: "convocations", label: "Convocations", icon: CalendarClockIcon },
  { id: "absences", label: "Absences & congés", icon: CalendarIcon },
  { id: "utilisateurs", label: "Utilisateurs & rôles", icon: UsersIcon },
  { id: "ged", label: "GED — Documents", icon: DatabaseIcon },
  { id: "newsletter", label: "Newsletter", icon: MailIcon },
  { id: "contenu-site", label: "Contenu du site", icon: NewspaperIcon },
] as const;

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 border-b border-border/60 pb-2 text-xl font-semibold tracking-tight text-foreground"
    >
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 text-base font-semibold text-foreground">{children}</h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function Ul({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-[var(--inp-vert)]/25 bg-[var(--inp-vert)]/5 px-4 py-3 text-sm text-foreground">
      {children}
    </div>
  );
}

export function AdminGuidePage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
          <BookOpenIcon className="size-3.5" />
          Guide administrateur — INP Intranet
        </div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Mode d&apos;emploi de la plateforme
        </h1>
        <P>
          Ce guide explique, sans jargon technique, comment gérer les missions,
          les convocations, les absences, les utilisateurs et la GED. Il est
          destiné à la personne qui administre l&apos;intranet au quotidien.
        </P>
      </header>

      <nav className="rounded-2xl border border-border/60 bg-muted/15 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sommaire
        </p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  <span className="flex size-6 items-center justify-center rounded-md bg-[var(--inp-vert)]/10 text-xs text-[var(--inp-vert)]">
                    {index + 1}
                  </span>
                  <Icon className="size-4 text-muted-foreground" />
                  {section.label}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ——— MISSIONS ——— */}
      <section className="space-y-3">
        <SectionTitle id="missions">1. Missions</SectionTitle>
        <P>
          Menu : <strong>Missions</strong> → page{" "}
          <Link href="/dashboard/missions" className="text-[var(--inp-vert)] underline">
            /dashboard/missions
          </Link>
          . Les missions les plus récentes apparaissent en haut de la liste.
        </P>

        <SubTitle>Qui a accès à quoi ?</SubTitle>
        <Ul
          items={[
            <>
              <strong>Créer une mission</strong> : Super administrateur,
              Administrateur, Directeur, RH, Responsable / Manager, PDCVR, AAT,
              Directeur technique.
            </>,
            <>
              <strong>Voir toutes les missions</strong> (accès total) : Super
              administrateur, Administrateur, Directeur, RH, PDCVR, AAT,
              Directeur technique.
            </>,
            <>
              <strong>Manager</strong> : voit les missions de sa direction et
              celles où il participe.
            </>,
            <>
              <strong>Employé, Chauffeur</strong> et autres : voient uniquement
              les missions où ils sont créateur, chef de mission ou missionnaire.
            </>,
            <>
              <strong>Supprimer</strong> : Super administrateur, Administrateur,
              Directeur, PDCVR, AAT, Directeur technique (pas le RH).
            </>,
            <>
              <strong>Télécharger / générer un ordre de mission</strong> :
              uniquement les rôles avec accès total (pas Employé ni Chauffeur).
            </>,
          ]}
        />

        <SubTitle>Créer une mission</SubTitle>
        <P>
          Cliquez sur <strong>Nouvelle mission</strong>, puis suivez les 5
          étapes :
        </P>
        <Ul
          items={[
            <>
              <strong>Général</strong> : objet (obligatoire), description, type
              (Terrain, Formation, Atelier, Réunion, Urgente), priorité,
              direction, projet. Vous pouvez importer une convocation existante.
            </>,
            <>
              <strong>Localisation</strong> : pays, région, département,
              commune, village, adresse, GPS éventuel.
            </>,
            <>
              <strong>Transport & budget</strong> : budget global (FCFA), nombre
              de voitures. Pour chaque voiture : nombre de personnes,
              immatriculation (optionnel), et sélection optionnelle des personnes
              à bord (recherche + filtres service / fonction).
            </>,
            <>
              <strong>Dates & équipe</strong> : dates et heures de départ /
              retour, missionnaires, chef de mission. Les personnes placées
              dans les voitures apparaissent automatiquement ici ; vous pouvez
              encore en ajouter ou en retirer.
            </>,
            <>
              <strong>Pièces & envoi</strong> : pièces jointes + récapitulatif.
              Boutons : <strong>Enregistrer brouillon</strong>,{" "}
              <strong>Soumettre pour validation</strong>, ou{" "}
              <strong>Valider</strong> (si vous avez l&apos;accès total).
            </>,
          ]}
        />

        <SubTitle>Validation d&apos;une mission</SubTitle>
        <P>Après soumission, la mission passe par 2 étapes :</P>
        <Ul
          items={[
            <>
              <strong>Chef de service</strong> (validée par un Manager de la
              direction, ou un gestionnaire missions).
            </>,
            <>
              <strong>Directeur</strong> (validée par Directeur / Admin / Super
              admin, ou un gestionnaire missions).
            </>,
          ]}
        />
        <P>
          Actions dans le détail : <strong>Approuver</strong> ou{" "}
          <strong>Refuser</strong>. Un refus renvoie la mission en brouillon. Si
          les deux étapes sont OK, la mission devient <strong>Validée</strong>.
        </P>

        <SubTitle>E-mails envoyés (missions)</SubTitle>
        <Ul
          items={[
            <>
              <strong>Soumission</strong> → e-mail aux managers de la direction
              et aux Directeur / Admin / Super admin : validation requise.
            </>,
            <>
              <strong>Refus</strong> → e-mail au créateur.
            </>,
            <>
              <strong>Validation complète</strong> (ou bouton Valider à la
              création) → e-mail à tous les missionnaires : mission validée.
            </>,
          ]}
        />

        <SubTitle>Ordre de mission (PDF)</SubTitle>
        <P>
          Dans le détail d&apos;une mission (bouton{" "}
          <strong>Ordre de mission</strong> ou onglet Documents) :
        </P>
        <Ul
          items={[
            <>Choisissez la personne concernée.</>,
            <>
              Moyen de transport optionnel (sinon celui de la mission /
              immatriculation).
            </>,
            <>
              Cliquez sur <strong>Générer le PDF</strong>. La prise en charge
              est toujours <strong>PDCVR</strong>.
            </>,
          ]}
        />

        <SubTitle>Modifier, démarrer, annuler, supprimer</SubTitle>
        <Ul
          items={[
            <>
              <strong>Modifier</strong> : possible surtout en brouillon (créateur
              ou gestionnaire).
            </>,
            <>
              <strong>Démarrer la mission</strong> : quand elle est validée
              (participant ou gestionnaire).
            </>,
            <>
              <strong>Annuler</strong> : pour les missions validées ou en cours
              (gestionnaires).
            </>,
            <>
              <strong>Supprimer</strong> : icône corbeille pour les rôles
              autorisés.
            </>,
            <>
              Dans l&apos;aperçu, chaque missionnaire affiche sa voiture et
              immatriculation s&apos;il a été assigné à un véhicule.
            </>,
          ]}
        />
      </section>

      {/* ——— CONVOCATIONS ——— */}
      <section className="space-y-3">
        <SectionTitle id="convocations">2. Convocations</SectionTitle>
        <P>
          Menu : <strong>Convocations</strong> →{" "}
          <Link
            href="/dashboard/convocations"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/convocations
          </Link>
          .
        </P>

        <SubTitle>Qui peut gérer les convocations ?</SubTitle>
        <P>
          Création et vue complète : Super administrateur, Administrateur,
          Directeur, RH. Les autres agents voient surtout leurs propres
          convocations et celles où ils sont invités.
        </P>

        <SubTitle>Créer une convocation</SubTitle>
        <P>
          Bouton <strong>Nouvelle convocation</strong>. Renseignez :
        </P>
        <Ul
          items={[
            <>Titre, date, heure (obligatoires).</>,
            <>
              Format : <strong>Présentiel</strong> (lieu) ou{" "}
              <strong>Visioconférence</strong> (lien).
            </>,
            <>Ordre du jour, documents préparatoires éventuels.</>,
            <>
              Destinataires : agents individuels, ou par service / direction /
              section / région.
            </>,
            <>
              Canal : e-mail ou SMS. Option : envoyer immédiatement après
              création.
            </>,
            <>
              Boutons : <strong>Créer et envoyer</strong> ou{" "}
              <strong>Enregistrer le brouillon</strong>.
            </>,
          ]}
        />

        <SubTitle>Filtres</SubTitle>
        <Ul
          items={[
            <>
              Onglets : <strong>Mes convocations</strong>,{" "}
              <strong>Toutes</strong> (admins), <strong>Archives</strong>.
            </>,
            <>
              Recherche + filtre de statut : Brouillon, Envoyée, Terminée,
              Annulée.
            </>,
          ]}
        />

        <SubTitle>E-mails / SMS</SubTitle>
        <P>
          Les invités reçoivent une convocation avec l&apos;objet, la date, le
          lieu ou le lien visio, l&apos;ordre du jour, et un{" "}
          <strong>code de présence</strong>. Un rappel peut être renvoyé
          (sujet du type « Rappel — Convocation — … »).
        </P>

        <SubTitle>Validation de présence (code)</SubTitle>
        <Ul
          items={[
            <>
              L&apos;invité répond : Présent / Absent / Excusé.
            </>,
            <>
              Pour l&apos;émargement, il saisit le{" "}
              <strong>code de présence</strong> reçu.
            </>,
            <>
              L&apos;organisateur / secrétariat peut aussi marquer les
              présences, envoyer, renvoyer ou archiver la convocation.
            </>,
          ]}
        />
      </section>

      {/* ——— ABSENCES ——— */}
      <section className="space-y-3">
        <SectionTitle id="absences">3. Absences &amp; congés</SectionTitle>
        <P>
          Menu : <strong>Absences &amp; congés</strong> →{" "}
          <Link
            href="/dashboard/absences"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/absences
          </Link>
          .
        </P>

        <SubTitle>Écran principal</SubTitle>
        <Ul
          items={[
            <>
              Boutons : <strong>Demande d&apos;absence</strong>,{" "}
              <strong>Déléguer mes validations</strong>.
            </>,
            <>
              Onglets : <strong>Mes demandes</strong>,{" "}
              <strong>À valider</strong>, <strong>Toutes</strong> (admins
              absences).
            </>,
            <>
              Solde affiché : jours acquis, jours pris, solde disponible
              (environ 2 jours acquis par mois selon le contrat).
            </>,
          ]}
        />

        <SubTitle>Créer une demande</SubTitle>
        <Ul
          items={[
            <>
              Choisissez le motif (congés, médicale, familiale, formation,
              etc.), les dates, un justificatif si besoin.
            </>,
            <>
              <strong>Soumettre la demande</strong> : elle part vers la chaîne
              de validateurs de l&apos;agent.
            </>,
            <>
              Les admins (Super admin, Admin, Directeur, RH) peuvent faire une
              demande <strong>pour un autre agent</strong> et éventuellement
              une <strong>approbation directe</strong>.
            </>,
          ]}
        />

        <SubTitle>Validateurs d&apos;absence</SubTitle>
        <P>
          Chaque utilisateur peut avoir une chaîne de validateurs (ex. supérieur
          hiérarchique, puis RH). Les validateurs possibles sont notamment :
          Super admin, Admin, Directeur, RH, Manager.
        </P>
        <Callout>
          Pour assigner les validateurs d&apos;un agent : allez sur le{" "}
          <strong>Tableau de bord</strong> (liste des utilisateurs) → icône{" "}
          <strong>Validateurs</strong> (silhouette avec coche) sur la ligne de
          l&apos;agent → définissez la chaîne.
        </Callout>

        <SubTitle>Déléguer une validation</SubTitle>
        <P>
          Sur la page Absences, cliquez{" "}
          <strong>Déléguer mes validations</strong>. Choisissez le titulaire et
          le remplaçant pour la période. Le remplaçant est notifié et pourra
          valider à votre place.
        </P>

        <SubTitle>Approbation / refus</SubTitle>
        <Ul
          items={[
            <>
              Dans l&apos;onglet <strong>À valider</strong> : Approuver ou
              Refuser (commentaire utile en cas de refus).
            </>,
            <>
              La validation est séquentielle (niveau 1 puis niveau 2, etc.).
            </>,
            <>
              Un solde insuffisant peut bloquer l&apos;approbation finale (sauf
              cas gérés par les admins). Certaines absences (ex. maladie) ne
              déduisent pas le solde.
            </>,
          ]}
        />

        <SubTitle>E-mails (absences)</SubTitle>
        <Ul
          items={[
            <>
              Nouvelle demande / passage au niveau suivant → e-mail au
              validateur concerné (ou à son délégué).
            </>,
            <>
              Approbation finale → e-mail au demandeur.
            </>,
            <>
              Refus final → e-mail au demandeur avec le motif.
            </>,
          ]}
        />
      </section>

      {/* ——— UTILISATEURS ——— */}
      <section className="space-y-3">
        <SectionTitle id="utilisateurs">4. Utilisateurs, rôles &amp; contrats</SectionTitle>
        <P>
          Les utilisateurs se gèrent depuis le{" "}
          <Link href="/dashboard" className="text-[var(--inp-vert)] underline">
            Tableau de bord
          </Link>{" "}
          (accueil). Accès réservé à : Super administrateur, Administrateur,
          Directeur, RH.
        </P>

        <SubTitle>Créer un utilisateur</SubTitle>
        <OlSteps
          steps={[
            <>
              Cliquez sur <strong>Nouvel utilisateur</strong>.
            </>,
            <>
              Remplissez identité (prénom, nom, e-mail, téléphone), poste /
              fonction, service, direction, section, rôle.
            </>,
            <>
              Choisissez le <strong>type de contrat</strong> (CDI, CDD, Stage,
              Consultant, Autre).
            </>,
            <>
              Si un contrat est renseigné : indiquez la{" "}
              <strong>date d&apos;embauche</strong> et l&apos;
              <strong>année de contrat</strong>. Le solde de congés est alors
              initialisé (environ 2 jours acquis par mois).
            </>,
            <>
              Validez avec <strong>Créer l&apos;utilisateur</strong>.
            </>,
          ]}
        />

        <SubTitle>Rôles (à retenir)</SubTitle>
        <Ul
          items={[
            <>
              <strong>Super administrateur / Administrateur / Directeur /
              RH</strong> : encadrement, gestion utilisateurs, absences, GED,
              convocations, missions (selon cas), contenu du site.
            </>,
            <>
              <strong>Responsable / Manager</strong> : validation « Chef de
              service » des missions, vue des missions de sa direction,
              validateur d&apos;absences possible.
            </>,
            <>
              <strong>PDCVR, AAT, Directeur technique</strong> : comme un
              employé pour le reste, mais accès total aux missions (créer,
              voir toutes, modifier, supprimer, ordre de mission).
            </>,
            <>
              <strong>Employé / Chauffeur</strong> : accès intranet standard ;
              missions limitées à celles où ils participent ; pas d&apos;ordre
              de mission à télécharger.
            </>,
            <>
              <strong>Rédacteur / Chercheur</strong> : accès intranet ;
              contenus selon périmètre.
            </>,
            <>
              <strong>Partenaire</strong> : pas d&apos;accès au dashboard.
            </>,
          ]}
        />

        <SubTitle>Icônes utiles sur le tableau des utilisateurs</SubTitle>
        <Ul
          items={[
            <>
              <strong>Œil</strong> : voir le profil.
            </>,
            <>
              <strong>Crayon</strong> : modifier l&apos;utilisateur.
            </>,
            <>
              <strong>Validateurs</strong> : définir qui valide ses absences.
            </>,
            <>
              <strong>Congés &amp; absences</strong> (calendrier) : consulter /
              gérer le solde (admins congés).
            </>,
            <>
              <strong>Message</strong> : envoyer un message.
            </>,
            <>
              <strong>Corbeille</strong> : supprimer (avec confirmation).
            </>,
          ]}
        />

        <Callout>
          Après création d&apos;un agent, pensez à lui assigner sa{" "}
          <strong>chaîne de validateurs</strong> pour que ses demandes
          d&apos;absence circulent correctement.
        </Callout>
      </section>

      {/* ——— GED ——— */}
      <section className="space-y-3">
        <SectionTitle id="ged">5. GED — Documents</SectionTitle>
        <P>
          Menu : <strong>GED — Documents</strong> →{" "}
          <Link href="/dashboard/ged" className="text-[var(--inp-vert)] underline">
            /dashboard/ged
          </Link>
          .
        </P>

        <SubTitle>Créer un dossier</SubTitle>
        <P>
          Cliquez sur <strong>Nouveau dossier</strong>, saisissez le nom, puis{" "}
          <strong>Créer</strong>. Naviguez dans les dossiers via le fil
          d&apos;Ariane (Accueil → …).
        </P>

        <SubTitle>Ajouter un fichier / document</SubTitle>
        <P>
          Cliquez sur <strong>Upload</strong> (ou <strong>Ajouter un
          document</strong>), choisissez le fichier, validez. Le document
          apparaît dans le dossier courant.
        </P>

        <SubTitle>Actions sur un fichier</SubTitle>
        <Ul
          items={[
            <>Aperçu, téléchargement, renommage, suppression.</>,
            <>
              <strong>Partager</strong> : ouvre{" "}
              <strong>Partager le document</strong>. Choisissez la durée du lien
              (15 min, 1 h, 6 h, 24 h, 7 jours), puis{" "}
              <strong>Copier le lien</strong> et/ou{" "}
              <strong>Envoyer au destinataire</strong> (e-mail / SMS).
            </>,
          ]}
        />

        <SubTitle>Droits GED</SubTitle>
        <P>
          Super admin, Admin, Directeur et RH ont une vue large. Les autres
          agents voient surtout leurs documents, les documents publics ou ceux
          partagés avec eux. Modifier / supprimer : admin GED ou propriétaire
          du fichier.
        </P>
      </section>

      {/* ——— NEWSLETTER ——— */}
      <section className="space-y-3">
        <SectionTitle id="newsletter">6. Newsletter</SectionTitle>
        <P>
          Menu latéral <strong>Contenu site</strong> →{" "}
          <strong>Newsletter</strong> →{" "}
          <Link
            href="/dashboard/newsletter"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/newsletter
          </Link>
          . Accès : Super administrateur, Administrateur, Directeur, RH.
        </P>

        <SubTitle>Où trouver les e-mails inscrits ?</SubTitle>
        <P>
          Sur cette page, vous voyez le tableau de tous les abonnés avec les
          colonnes : <strong>E-mail</strong>, <strong>Statut</strong>,{" "}
          <strong>Source</strong>, <strong>Inscrit le</strong>,{" "}
          <strong>IP</strong>.
        </P>
        <Ul
          items={[
            <>
              Compteurs en haut : <strong>Total</strong>,{" "}
              <strong>Actifs</strong>, <strong>Désinscrits</strong>.
            </>,
            <>
              Recherche : <strong>Rechercher par e-mail…</strong>
            </>,
            <>
              Filtres : statut (<strong>Actif</strong> /{" "}
              <strong>Désinscrit</strong>), année d&apos;inscription,
              pagination <strong>Précédent</strong> / <strong>Suivant</strong>.
            </>,
            <>
              Sources possibles : inscription depuis le{" "}
              <strong>pied de page</strong> du site public, depuis un article,
              etc.
            </>,
          ]}
        />

        <SubTitle>Actions possibles</SubTitle>
        <Ul
          items={[
            <>
              <strong>Désinscrire</strong> : passe un abonné actif en
              désinscrit.
            </>,
            <>
              <strong>Réactiver</strong> : remet un désinscrit en actif.
            </>,
            <>
              <strong>Supprimer</strong> : suppression définitive de
              l&apos;inscription.
            </>,
          ]}
        />
        <Callout>
          Les inscriptions se font depuis le <strong>site public</strong> (pied
          de page). Il n&apos;y a pas d&apos;ajout manuel ni d&apos;envoi de
          campagne depuis ce tableau : il sert à consulter et gérer la liste
          des e-mails inscrits.
        </Callout>
      </section>

      {/* ——— CONTENU SITE ——— */}
      <section className="space-y-3">
        <SectionTitle id="contenu-site">7. Contenu du site</SectionTitle>
        <P>
          Dans la sidebar, le bloc <strong>Contenu site</strong> permet de
          gérer ce qui apparaît sur le site public. Accès : Super
          administrateur, Administrateur, Directeur, RH.
        </P>
        <Callout>
          Règle commune : le champ <strong>Statut</strong> doit être{" "}
          <strong>Publié</strong> pour apparaître sur le site.{" "}
          <strong>Brouillon</strong> = visible seulement dans le dashboard.
          Utilisez <strong>Modifier</strong> / la corbeille sur chaque ligne, et
          les filtres (statut, année, recherche, tri).
        </Callout>

        <SubTitle>Actualités &amp; vidéos</SubTitle>
        <P>
          Menu <strong>Actualités</strong> →{" "}
          <Link
            href="/dashboard/actualites"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/actualites
          </Link>
          . Deux onglets : <strong>Actualités</strong> |{" "}
          <strong>Vidéos INP</strong>.
        </P>
        <Ul
          items={[
            <>
              <strong>Nouvelle actualité</strong> : titre, résumé, image de
              couverture, catégorie (Événements, Recherche, Partenariats,
              Projets, Publications), auteur, contenu (éditeur), tags, statut,
              date de publication, option <strong>Mettre à la une</strong> →{" "}
              <strong>Créer</strong> / <strong>Enregistrer</strong>.
            </>,
            <>
              <strong>Nouvelle vidéo</strong> (onglet Vidéos INP) : titre,{" "}
              <strong>Lien de la vidéo</strong>, statut, date →{" "}
              <strong>Ajouter</strong>.
            </>,
          ]}
        />

        <SubTitle>Publications</SubTitle>
        <P>
          Menu <strong>Publications</strong> →{" "}
          <Link
            href="/dashboard/publications"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/publications
          </Link>
          .
        </P>
        <Ul
          items={[
            <>
              Cliquez sur <strong>Nouvelle publication</strong>.
            </>,
            <>
              Renseignez : titre, auteurs, année, type (Rapport technique,
              Article scientifique, Étude nationale, Fiche technique), résumé,
              axe de recherche, méthodologie, résultats, PDF, DOI, tags,
              statut, date.
            </>,
            <>
              Cases utiles :{" "}
              <strong>
                Afficher sur Publications scientifiques (Recherche)
              </strong>
              , <strong>Mettre en avant</strong>.
            </>,
            <>
              Pour la page Recherche dédiée : menu{" "}
              <strong>Publ. scientifiques</strong> (
              <Link
                href="/dashboard/publications-scientifiques"
                className="text-[var(--inp-vert)] underline"
              >
                /dashboard/publications-scientifiques
              </Link>
              ) — même formulaire, case scientifique cochée par défaut.
            </>,
          ]}
        />

        <SubTitle>Médiathèque (images)</SubTitle>
        <P>
          Menu <strong>Médiathèque</strong> →{" "}
          <Link
            href="/dashboard/mediatheque"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/mediatheque
          </Link>
          . Ici ce sont les <strong>images</strong> (les vidéos se gèrent dans
          Actualités → onglet Vidéos INP).
        </P>
        <Ul
          items={[
            <>
              Cliquez sur <strong>Nouvelle image</strong>.
            </>,
            <>
              Champs : image, texte alternatif, légende, statut, date de
              publication → <strong>Ajouter</strong> /{" "}
              <strong>Enregistrer</strong>.
            </>,
            <>
              Recherche possible : <strong>Rechercher par légende…</strong>
            </>,
          ]}
        />

        <SubTitle>Documentation</SubTitle>
        <P>
          Menu <strong>Documentation</strong> →{" "}
          <Link
            href="/dashboard/documentation"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/documentation
          </Link>
          . Onglets par rubrique (rapports, guides, bulletins, open data,
          archives, textes réglementaires). Bouton{" "}
          <strong>Nouvelle ressource</strong> : titre, description, année,
          statut, puis champs selon la rubrique (PDF, URL, catégorie, etc.) →{" "}
          <strong>Enregistrer</strong>.
        </P>

        <SubTitle>Institut (équipe &amp; délégations)</SubTitle>
        <P>
          Menu <strong>Institut</strong> →{" "}
          <Link
            href="/dashboard/institut"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/institut
          </Link>
          .
        </P>
        <Ul
          items={[
            <>
              Onglet <strong>Équipe</strong> :{" "}
              <strong>Nouveau membre</strong> (nom, fonction, pôle, zone,
              photo, statut, ordre d&apos;affichage).
            </>,
            <>
              Onglet <strong>Délégations</strong> :{" "}
              <strong>Nouvelle délégation</strong> (régions, sols, cultures,
              contact, ordre organigramme, etc.).
            </>,
          ]}
        />

        <SubTitle>Partenaires</SubTitle>
        <P>
          Menu <strong>Partenaires</strong> →{" "}
          <Link
            href="/dashboard/partenaires"
            className="text-[var(--inp-vert)] underline"
          >
            /dashboard/partenaires
          </Link>
          . Bouton <strong>Nouveau partenaire</strong> : logo, acronyme,
          catégorie, nom, description, pays, site web, statut, ordre →{" "}
          <strong>Enregistrer</strong>.
        </P>

        <SubTitle>Autres contenus utiles</SubTitle>
        <Ul
          items={[
            <>
              <strong>Recherche</strong> : axes / projets de recherche affichés
              sur le site.
            </>,
            <>
              <strong>Recrutement</strong> : candidatures spontanées reçues.
            </>,
            <>
              <strong>Rendez-vous</strong> : demandes de rendez-vous du site
              public.
            </>,
          ]}
        />
      </section>

      <footer className="rounded-2xl border border-dashed border-border/70 px-4 py-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Besoin d&apos;un rappel rapide ?</p>
        <p className="mt-1">
          Missions → créer / valider / ordre PDF. Convocations → envoyer + code
          de présence. Absences → demande + validateurs + délégation.
          Utilisateurs → créer avec contrat + assigner validateurs. GED →
          dossier, upload, partage. Newsletter → liste des e-mails inscrits.
          Contenu site → Actualités / Vidéos / Publications / Médiathèque
          (statut Publié).
        </p>
      </footer>
    </div>
  );
}

function OlSteps({ steps }: { steps: ReactNode[] }) {
  return (
    <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
      {steps.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  );
}
