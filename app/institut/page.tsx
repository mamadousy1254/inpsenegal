import { redirect } from "next/navigation";

/**
 * La page racine /institut redirige vers la présentation globale.
 */
export default function InstitutRootPage() {
  redirect("/institut/presentation");
}
