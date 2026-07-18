import type { Metadata } from "next";
import { getMaintenanceSettings } from "@/lib/services/site-settings/maintenance-mode";
import { MaintenancePageContent } from "@/components/maintenance/maintenance-page-content";

export const metadata: Metadata = {
  title: "Maintenance — Institut national de Pédologie",
  description:
    "Le site de l'Institut national de Pédologie est temporairement en maintenance.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const settings = await getMaintenanceSettings();

  return (
    <MaintenancePageContent
      message={settings.maintenanceMessage}
      loginHref="/login"
    />
  );
}
