import { connectDB } from "@/lib/mongo/db";
import SiteSettingsModel from "@/lib/mongo/models/site-settings.model";

export type MaintenanceSettings = {
  maintenanceEnabled: boolean;
  maintenanceMessage: string;
};

type CacheEntry = MaintenanceSettings & { expiresAt: number };

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 3_000;

export function clearMaintenanceCache(): void {
  cache = null;
}

export async function getMaintenanceSettings(): Promise<MaintenanceSettings> {
  if (cache && cache.expiresAt > Date.now()) {
    return {
      maintenanceEnabled: cache.maintenanceEnabled,
      maintenanceMessage: cache.maintenanceMessage,
    };
  }

  await connectDB();
  const doc = await SiteSettingsModel.findOne({ key: "global" }).lean();

  const settings: MaintenanceSettings = {
    maintenanceEnabled: Boolean(doc?.maintenanceEnabled),
    maintenanceMessage: doc?.maintenanceMessage?.trim() ?? "",
  };

  cache = { ...settings, expiresAt: Date.now() + CACHE_TTL_MS };
  return settings;
}

export async function isMaintenanceModeEnabled(): Promise<boolean> {
  const settings = await getMaintenanceSettings();
  return settings.maintenanceEnabled;
}

export async function setMaintenanceMode(input: {
  enabled: boolean;
  message?: string;
  updatedById?: string;
}): Promise<MaintenanceSettings> {
  await connectDB();

  const doc = await SiteSettingsModel.findOneAndUpdate(
    { key: "global" },
    {
      $set: {
        maintenanceEnabled: input.enabled,
        ...(input.message !== undefined
          ? { maintenanceMessage: input.message.trim() }
          : {}),
        ...(input.updatedById ? { updatedBy: input.updatedById } : {}),
      },
      $setOnInsert: { key: "global" },
    },
    { upsert: true, new: true },
  ).lean();

  clearMaintenanceCache();

  return {
    maintenanceEnabled: Boolean(doc?.maintenanceEnabled),
    maintenanceMessage: doc?.maintenanceMessage?.trim() ?? "",
  };
}
