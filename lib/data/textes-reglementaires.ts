export interface DocumentTexte {
    slug: string;
    title: string;
    description: string;
    type: string;
    date: string;
    reference: string;
    taille: string;
    category: "base-legale" | "national" | "international";
}

export const TEXTES_REGLEMENTAIRES: DocumentTexte[] = [
    // Base légale
    {
        slug: "decret-2004-802-creation-inp",
        title: "Décret n°2004-802 du 28 juin 2004",
        description:
            "Création de l'Institut National de Pédologie en tant qu'établissement public scientifique.",
        type: "Décret",
        date: "28 juin 2004",
        reference: "Journal Officiel du Sénégal",
        taille: "0.86 MB",
        category: "base-legale",
    },
    {
        slug: "loi-orientation-agro-sylvo-pastorale",
        title: "Loi d'orientation agro-sylvo-pastorale",
        description:
            "Cadre stratégique définissant la politique nationale agricole et la gestion durable des terres.",
        type: "Loi",
        date: "4 juin 2004",
        reference: "Assemblée Nationale du Sénégal",
        taille: "1.2 MB",
        category: "base-legale",
    },
    // Textes nationaux
    {
        slug: "politique-nationale-gestion-durable-terres",
        title: "Politique nationale de gestion durable des terres",
        description:
            "Orientation stratégique pour lutter contre la dégradation des terres et promouvoir la résilience agricole.",
        type: "Document de politique",
        date: "Mars 2019",
        reference: "Ministère de l'Agriculture",
        taille: "2.4 MB",
        category: "national",
    },
    {
        slug: "code-environnement-senegal",
        title: "Code de l'environnement",
        description:
            "Dispositions réglementaires relatives à la protection des ressources naturelles.",
        type: "Loi",
        date: "Janvier 2001",
        reference: "Journal Officiel du Sénégal",
        taille: "3.1 MB",
        category: "national",
    },
    // Conventions internationales
    {
        slug: "convention-nations-unies-desertification",
        title:
            "Convention des Nations Unies sur la lutte contre la désertification (CNULCD)",
        description:
            "Instrument juridique international clé pour la protection des terres arides et semi-arides.",
        type: "Convention internationale",
        date: "17 juin 1994",
        reference: "Nations Unies",
        taille: "1.8 MB",
        category: "international",
    },
    {
        slug: "convention-diversite-biologique",
        title: "Convention sur la diversité biologique",
        description:
            "Cadre mondial pour la conservation et l'utilisation durable de la biodiversité des sols.",
        type: "Convention internationale",
        date: "5 juin 1992",
        reference: "Nations Unies",
        taille: "2.1 MB",
        category: "international",
    },
    {
        slug: "accord-paris-climat",
        title: "Accord de Paris sur le climat",
        description:
            "Engagement international pour la réduction des émissions et l'adaptation au changement climatique.",
        type: "Accord international",
        date: "12 décembre 2015",
        reference: "CCNUCC",
        taille: "0.95 MB",
        category: "international",
    },
];
