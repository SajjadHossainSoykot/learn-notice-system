"use client";

import { FileText, ImageIcon, ExternalLink, Eye } from "lucide-react";

type NoticeAttachmentCardProps = {
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  onPreview: () => void;
};

export default function NoticeAttachmentCard({
  fileUrl,
  fileType,
  fileName,
  onPreview,
}: NoticeAttachmentCardProps) {
  if (!fileUrl) return null;

  const isImage = fileType?.startsWith("image/");
  const isPdf = fileType === "application/pdf";

  return (
    <div className="mb-4 rounded-xl border bg-gray-50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            {isImage ? (
              <ImageIcon size={22} className="text-gray-700" />
            ) : (
              <FileText size={22} className="text-gray-700" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {fileName || "Notice attachment"}
            </p>

            <p className="text-xs text-gray-500">
              {isPdf ? "PDF Attachment" : isImage ? "Image Attachment" : "File"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            <Eye size={16} />
            Preview
          </button>

          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <ExternalLink size={16} />
            Open
          </a>
        </div>
      </div>
    </div>
  );
}