const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inp.sn";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: "INP – Institut national de Pédologie",
  alternateName: "Institut national de Pédologie",
  url: baseUrl,
  description:
    "Institut parapublic à caractère scientifique et technologique. Référence nationale en science des sols, cartographie pédologique, fertilité et gestion durable des terres. Sous tutelle du Ministère de l'Agriculture.",
  areaServed: {
    "@type": "Country",
    name: "Sénégal",
  },
};

export function JsonLdOrganization() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
