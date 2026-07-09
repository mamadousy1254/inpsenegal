export const MISSION_ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MISSION_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export const MISSION_ATTACHMENT_CLOUDINARY_FOLDER =
  "inp-intranet/missions/attachments";

export const MISSION_ATTACHMENT_ACCEPT = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
} as const;
