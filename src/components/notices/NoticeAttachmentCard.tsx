"use client";

import { ExternalLink, Eye, FileText, ImageIcon } from "lucide-react";

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
    <div className="mb-4 w-full overflow-hidden rounded-xl border bg-gray-50 p-3 sm:p-4">
      <div className="flex w-full min-w-0 flex-col gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm sm:h-12 sm:w-12">
            {isImage ? (
              <ImageIcon size={21} className="text-gray-700" />
            ) : (
              <FileText size={21} className="text-gray-700" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {fileName || "Notice attachment"}
            </p>

            <p className="text-xs text-gray-500">
              {isPdf ? "PDF Attachment" : isImage ? "Image Attachment" : "File"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex min-w-0 items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            <Eye size={16} />
            <span className="truncate">Preview</span>
          </button>

          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <ExternalLink size={16} />
            <span className="truncate">Open</span>
          </a>
        </div>
      </div>
    </div>
  );
}