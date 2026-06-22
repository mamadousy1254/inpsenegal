import ContactMessageModel from "@/lib/mongo/models/contact-message.model";

export async function generateContactMessageReference(): Promise<string> {
  const year = new Date().getFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));

  const count = await ContactMessageModel.countDocuments({
    createdAt: { $gte: startOfYear },
  });

  return `INP-CT-${year}-${String(count + 1).padStart(4, "0")}`;
}
