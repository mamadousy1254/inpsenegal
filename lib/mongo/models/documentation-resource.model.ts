import mongoose, { Schema, type Document, models } from "mongoose";
import { CMS_STATUSES, type CmsStatus } from "@/lib/constants/cms";
import {
  DOCUMENTATION_RUBRIQUES,
  DOCUMENTATION_DOC_TYPES,
  GUIDE_CATEGORIES,
  OPEN_DATA_CATEGORIES,
  OPEN_DATA_FORMATS,
  TEXTES_LEGAL_CATEGORIES,
  TEXTES_LEGAL_TYPES,
  type DocumentationRubrique,
  type DocumentationDocType,
  type TextesLegalCategory,
  type TextesLegalType,
} from "@/lib/constants/documentation";

export interface IDocumentationResource extends Document {
  rubrique: DocumentationRubrique;
  slug: string;
  title: string;
  description: string;
  year: number;
  status: CmsStatus;
  category?: (typeof GUIDE_CATEGORIES)[number] | (typeof OPEN_DATA_CATEGORIES)[number] | TextesLegalCategory;
  issue?: string;
  format?: (typeof OPEN_DATA_FORMATS)[number];
  docType?: DocumentationDocType;
  legalType?: TextesLegalType;
  legalDate?: string;
  reference?: string;
  fileSize?: string;
  author?: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  pdfFileName?: string;
  downloadUrl?: string;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentationResourceSchema = new Schema<IDocumentationResource>(
  {
    rubrique: { type: String, enum: DOCUMENTATION_RUBRIQUES, required: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    category: { type: String, trim: true },
    issue: { type: String, trim: true },
    format: { type: String, enum: OPEN_DATA_FORMATS },
    docType: { type: String, enum: DOCUMENTATION_DOC_TYPES },
    legalType: { type: String, enum: TEXTES_LEGAL_TYPES },
    legalDate: { type: String, trim: true },
    reference: { type: String, trim: true },
    fileSize: { type: String, trim: true },
    author: { type: String, trim: true },
    pdfUrl: { type: String, trim: true },
    pdfPublicId: { type: String, trim: true },
    pdfFileName: { type: String, trim: true },
    downloadUrl: { type: String, trim: true },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

documentationResourceSchema.index({ rubrique: 1, status: 1, year: -1 });
documentationResourceSchema.index({ rubrique: 1, slug: 1 }, { unique: true });

const MODEL_NAME = "DocumentationResource";

/** En dev, le modèle Mongoose peut rester en cache avec un ancien enum `rubrique`. */
if (process.env.NODE_ENV !== "production" && models[MODEL_NAME]) {
  delete models[MODEL_NAME];
}

const DocumentationResourceModel =
  models[MODEL_NAME] ??
  mongoose.model<IDocumentationResource>(MODEL_NAME, documentationResourceSchema);

export default DocumentationResourceModel;
