// Données réelles issues de sources officielles publiques
// Sources : Présidence du Sénégal, Le Soleil, Sud Quotidien, AllAfrica, MASAE
// Ces actualités peuvent être enrichies/mises à jour via le back-office

export interface ActualiteDemo {
  slug: string;
  type: "URGENT" | "COMMUNIQUÉ" | "INFO";
  source: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author?: string;
  sourceUrl?: string;        // URL de la source officielle pour traçabilité
}

export const demoActualites: ActualiteDemo[] = [
  // ─── 0. INTERVIEW DU DG — LE SOLEIL (mise en avant, première position) ───
  {
    slug: "interview-dg-sante-des-sols",
    type: "COMMUNIQUÉ",
    source: "DIRECTION GÉNÉRALE INP",
    title: "« Sans terre fertile et saine, impossible d'obtenir des rendements élevés et durables » : le plaidoyer du DG de l'INP",
    date: "8 décembre 2025",
    category: "Interview",
    excerpt: "À l'occasion de la Journée mondiale des sols, le Directeur général de l'INP, Alfred Kouly Tine, a accordé un entretien au quotidien Le Soleil. Il y dresse un état des lieux préoccupant des sols sénégalais et détaille les solutions déployées par l'Institut, à commencer par le programme prioritaire « Santé des sols ».",
    content: `
      <p>À l'occasion de la <strong>Journée mondiale des sols</strong>, le Directeur général de l'INP, <strong>Alfred Kouly Tine</strong>, a accordé un entretien au quotidien <em>Le Soleil</em>. Il y dresse un état des lieux préoccupant des sols sénégalais et détaille les solutions déployées par l'Institut, à commencer par le programme prioritaire « Santé des sols ».</p>

      <h2>Un état de santé des sols fragile</h2>
      <p>Malgré la grande diversité des sols du Sénégal, leur fertilité demeure globalement très faible, en raison d'une teneur très basse en éléments nutritifs essentiels aux cultures. Plusieurs facteurs se cumulent : le changement climatique, la déforestation, l'extension des surfaces cultivées sans jachère, des pratiques agricoles inadaptées, l'exportation importante de biomasse, le manque d'amendements organiques, ainsi qu'une acidification liée à un usage déséquilibré d'engrais chimiques — auxquels s'ajoutent l'érosion et la salinisation.</p>

      <h2>Des dégradations variées selon les zones</h2>
      <p>Le Directeur général distingue l'érosion éolienne, l'érosion hydrique (eaux de ruissellement) et la salinisation. Cette dernière est particulièrement marquée dans les vallées ouvertes sur les domaines fluvio-marins — Sine-Saloum, Casamance, Niayes et delta du fleuve Sénégal — ainsi qu'à Kédougou, du fait de l'altération de roches riches en sodium.</p>

      <h2>Des solutions adaptées à chaque dégradation</h2>
      <p>Contre l'érosion éolienne : plantation d'arbres adaptés aux zones pédoclimatiques, agroforesterie, installation de brise-vents et paillage. Contre la salinisation : lutte biologique (espèces capables de rabattre la nappe salée et de favoriser l'infiltration) et ouvrages mécaniques tels que les digues anti-sel. Au cœur du dispositif, le programme <strong>« Santé des sols »</strong>, mené avec le ministère de l'Agriculture, repose sur le chaulage (correction de l'acidité), le phosphatage (les sols sénégalais étant pauvres en phosphore) et les amendements organiques (pour améliorer la rétention en eau des sols sableux). Le DG insiste sur la nécessité de combiner ces méthodes et sur la promotion d'engrais organo-minéraux pour préserver durablement la santé des sols.</p>

      <h2>L'INP au cœur de la souveraineté alimentaire</h2>
      <p>Pour Alfred Kouly Tine, l'implication de l'INP est totale et déterminante : il n'y a pas de souveraineté alimentaire possible avec des sols pauvres et malades.</p>
      <blockquote>« Sans terre fertile et saine, il est impossible d'obtenir des rendements élevés et durables. »
      <cite>— Alfred Kouly Tine, Directeur général de l'INP</cite></blockquote>
      <p>Restaurer la fertilité constitue, selon lui, la seule base productive capable de soutenir une agriculture à la fois intensive et durable.</p>

      <h2>Un partenariat exemplaire avec la SOGAS</h2>
      <p>L'entretien revient sur le partenariat noué avec la <strong>Société de gestion des abattoirs du Sénégal (SOGAS)</strong> : les déchets d'abattage, longtemps source de pollution de la baie de Hann, sont désormais valorisés en compost. Plus de <strong>300 tonnes de compost</strong> de haute qualité ont déjà été produites et commercialisées, le processus fonctionnant en continu — transformant une source de pollution en un amendement précieux pour les agriculteurs.</p>

      <h2>Quatre grands axes</h2>
      <p>Les projets de l'INP s'articulent autour de quatre axes : améliorer la connaissance et la cartographie des sols ; restaurer concrètement la fertilité (programme « Santé des sols », chaulage, phosphatage, amendements organiques) ; mettre à l'échelle les technologies validées (compostage, agroforesterie, gestion intégrée de la fertilité) ; et former massivement producteurs, étudiants et techniciens, avec des parcelles de démonstration installées directement chez les paysans.</p>

      <p><strong>Source :</strong> Entretien réalisé par Assane Fall, publié dans <em>Le Soleil</em> le 8 décembre 2025. <a href="https://lesoleil.sn/actualites/environnement/alfred-kouly-tine-sans-terre-fertile-et-saine-impossible-dobtenir-des-rendements-eleves-et-durables/" target="_blank" rel="noopener noreferrer">Lire l'intégralité de l'entretien sur Le Soleil ↗</a></p>
    `,
    coverImage: "/images/direction/dg-portrait.png",
    author: "Service Communication INP",
    sourceUrl: "https://lesoleil.sn/actualites/environnement/alfred-kouly-tine-sans-terre-fertile-et-saine-impossible-dobtenir-des-rendements-eleves-et-durables/",
  },

  // ─── 1. JOURNÉE MONDIALE DES SOLS 2025 ───
  {
    slug: "journee-mondiale-sols-2025",
    type: "COMMUNIQUÉ",
    source: "DIRECTION GÉNÉRALE INP",
    title: "Journée mondiale des sols 2025 : l'INP au cœur de la souveraineté alimentaire du Sénégal",
    date: "5 décembre 2025",
    category: "Événement",
    excerpt: "L'Institut national de Pédologie a célébré la Journée mondiale des sols par une journée portes ouvertes consacrée à la sensibilisation du jeune public et au programme prioritaire « Santé des sols ».",
    content: `
      <p>L'<strong>Institut national de Pédologie (INP)</strong> a célébré la Journée mondiale des sols, le 5 décembre 2025, avec une journée portes ouvertes destinée à vulgariser le travail mené pour la souveraineté alimentaire du Sénégal.</p>

      <p>L'événement, qui a pris des allures de rentrée académique, a privilégié <strong>étudiants et élèves</strong> afin d'expliquer à la jeune génération qu'à l'heure de l'agriculture de précision, la pédologie — science des sols — est un pilier incontournable du développement agricole.</p>

      <h2>Un constat alarmant sur la fragilité des sols</h2>

      <p>Lors de cet événement, le Directeur Général de l'INP, <strong>Dr Alfred Kouly TINE</strong>, a dressé un constat préoccupant : les sols sénégalais sont rongés par l'érosion, l'acidification, la salinisation et l'épuisement en matière organique.</p>

      <blockquote>« Sans terre fertile et saine, impossible d'obtenir des rendements élevés et durables. »
      <cite>— Dr Alfred Kouly TINE, Directeur Général de l'INP</cite></blockquote>

      <h2>Le programme « Santé des sols » : des résultats concrets</h2>

      <p>L'INP s'est mobilisé sur le terrain à travers le <strong>programme prioritaire « Santé des sols »</strong>, dont il assure la maîtrise. En seulement 9 mois :</p>

      <ul>
        <li>Près de <strong>7 000 hectares cartographiés</strong></li>
        <li><strong>6 500 hectares amendés</strong></li>
        <li>Des <strong>recommandations précises</strong> déployées commune par commune</li>
      </ul>

      <p>Les actions mobilisent du <strong>chaulage</strong> pour relever le pH des sols, du <strong>phosphate naturel</strong> pour stimuler les cultures, et de la <strong>matière organique</strong> pour restaurer la vie microbienne des terres.</p>

      <h2>Une mobilisation à amplifier</h2>

      <p>Si les efforts déployés sont impressionnants, ils restent une goutte d'eau face aux besoins nationaux estimés à :</p>

      <ul>
        <li><strong>120 000 tonnes de chaux</strong></li>
        <li><strong>9,90 millions de tonnes de phosphate</strong></li>
        <li><strong>15 millions de tonnes d'amendements organiques</strong></li>
      </ul>

      <p>Le DG a réaffirmé l'engagement de l'INP à accompagner les programmes gouvernementaux pour contribuer à la <strong>Vision 2050</strong>, en renforçant la résilience des communautés face au changement climatique.</p>
    `,
    coverImage: "/images/direction/slide-3-journee-sols.jpg",
    author: "Direction Générale de l'INP",
    sourceUrl: "https://lesoleil.sn/actualites/environnement/etat-des-sols-au-senegal-diagnostic-sante-fragile/",
  },

  // ─── 2. NOMINATION DU PRÉSIDENT DU CONSEIL D'ADMINISTRATION ───
  {
    slug: "nomination-president-ca-sanoussy-sane",
    type: "COMMUNIQUÉ",
    source: "PRÉSIDENCE DE LA RÉPUBLIQUE",
    title: "Nomination de M. Sanoussy SANE à la présidence du Conseil d'Administration de l'INP",
    date: "25 juin 2025",
    category: "Gouvernance",
    excerpt: "Lors du Conseil des ministres du 25 juin 2025, le Président de la République a nommé M. Sanoussy SANE, expert en économie solidaire et en gouvernance sociale, Président du Conseil d'Administration de l'INP.",
    content: `
      <p>Lors de la réunion hebdomadaire du Conseil des Ministres tenue le <strong>mercredi 25 juin 2025</strong> au Palais de la République, le Président de la République, <strong>Son Excellence Monsieur Bassirou Diomaye Diakhar FAYE</strong>, a procédé à des nominations à l'Institut national de Pédologie (INP).</p>

      <h2>Nomination</h2>

      <p><strong>Monsieur Sanoussy SANE</strong>, Expert en économie solidaire et en gouvernance sociale, est nommé <strong>Président du Conseil d'Administration de l'Institut national de Pédologie (INP)</strong>, en remplacement de <strong>Monsieur Paul FAYE</strong>.</p>

      <h2>Une nouvelle gouvernance pour l'Institut</h2>

      <p>Cette nomination s'inscrit dans la dynamique de renouvellement institutionnel engagée par le Gouvernement. M. Sanoussy SANE apporte à l'INP son expertise reconnue en économie solidaire et en gouvernance sociale, des compétences clés pour accompagner la transformation institutionnelle de l'Institut.</p>

      <p>L'INP tient à exprimer sa reconnaissance à <strong>M. Paul FAYE</strong> pour son engagement et son leadership au cours de son mandat à la tête du Conseil d'Administration.</p>

      <p>L'ensemble du personnel de l'INP souhaite la bienvenue à M. Sanoussy SANE et l'assure de son entière collaboration pour la réussite de la mission de service public confiée à l'Institut.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
    author: "Service Communication INP",
    sourceUrl: "https://www.presidence.sn/fr/actualites/communique-du-conseil-des-ministres-du-mercredi-25-juin-2025/",
  },

  // ─── 3. CAMPAGNE TERRAIN ZONE SUD ───
  {
    slug: "campagne-chaulage-phosphatage-sud",
    type: "INFO",
    source: "DÉLÉGATION SUD INP",
    title: "Campagne d'information et de sensibilisation sur le chaulage et l'amendement organique en zone Sud",
    date: "Novembre 2025",
    category: "Terrain",
    excerpt: "L'INP a déployé une campagne d'information et de sensibilisation dans la zone Sud du Sénégal sur les techniques de chaulage, de phosphatage et d'amendement organique des sols agricoles.",
    content: `
      <p>L'<strong>Institut national de Pédologie</strong> a mené une vaste campagne d'information et de sensibilisation dans la <strong>zone Sud du Sénégal</strong> sur les techniques essentielles à la restauration de la fertilité des terres : <strong>chaulage, phosphatage et amendement organique</strong>.</p>

      <h2>Pourquoi cette campagne ?</h2>

      <p>Les sols de la zone Sud (Casamance et Sénégal Oriental) présentent des caractéristiques spécifiques :</p>

      <ul>
        <li>Sols à <strong>sulfates acides</strong> dans les bas-fonds rizicoles</li>
        <li>Acidification progressive sous l'effet d'une pluviométrie abondante</li>
        <li>Appauvrissement en matière organique sous cultures intensives</li>
        <li>Risques de salinisation dans les zones de mangroves drainées</li>
      </ul>

      <h2>Les solutions techniques diffusées</h2>

      <p>L'INP recommande une approche combinée pour restaurer ces terres :</p>

      <ul>
        <li><strong>Chaulage</strong> : utilisation de chaux agricole pour neutraliser l'acidité et relever le pH des sols</li>
        <li><strong>Phosphatage</strong> : apport de phosphate naturel sénégalais pour stimuler les cultures</li>
        <li><strong>Amendement organique</strong> : intégration de compost et de matière organique pour restaurer la vie microbienne du sol</li>
      </ul>

      <h2>Une approche participative</h2>

      <p>Les équipes de la délégation Sud ont travaillé directement avec les <strong>producteurs locaux</strong>, les <strong>coopératives agricoles</strong> et les <strong>services techniques régionaux</strong> pour démontrer l'efficacité de ces techniques sur des parcelles pilotes.</p>

      <p>Cette campagne s'inscrit dans la mise en œuvre du programme prioritaire <strong>« Santé des sols »</strong>, qui vise à restaurer durablement la fertilité des terres agricoles sénégalaises au service de la souveraineté alimentaire.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
    author: "Délégation Sud — INP",
    sourceUrl: "https://www.facebook.com/gestiondessols/",
  },

];

export function getActualiteBySlug(slug: string): ActualiteDemo | null {
  return demoActualites.find((a) => a.slug === slug) || null;
}

/** Catégories uniques utilisées par les actualités. */
export function getCategories(): string[] {
  return Array.from(new Set(demoActualites.map((a) => a.category)));
}

/** Articles suggérés : même catégorie d'abord, puis les autres. */
export function getRelatedActualites(currentSlug: string, limit = 3): ActualiteDemo[] {
  const current = demoActualites.find((a) => a.slug === currentSlug);
  if (!current) return demoActualites.slice(0, limit);

  const sameCategory = demoActualites.filter(
    (a) => a.slug !== currentSlug && a.category === current.category
  );
  const others = demoActualites.filter(
    (a) => a.slug !== currentSlug && a.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, limit);
}

/** Article précédent / suivant (ordre du tableau). */
export function getPrevNextActualites(currentSlug: string): {
  prev: ActualiteDemo | null;
  next: ActualiteDemo | null;
} {
  const index = demoActualites.findIndex((a) => a.slug === currentSlug);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? demoActualites[index - 1] : null,
    next: index < demoActualites.length - 1 ? demoActualites[index + 1] : null,
  };
}
