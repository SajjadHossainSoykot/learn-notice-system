"use client";

import Image from "next/image";
import { X } from "lucide-react";

type AttachmentPreviewModalProps = {
  open: boolean;
  fileUrl: string;
  fileType?: string;
  fileName?: string;
  onClose: () => void;
};

export default function AttachmentPreviewModal({
  open,
  fileUrl,
  fileType,
  fileName,
  onClose,
}: AttachmentPreviewModalProps) {
  if (!open || !fileUrl) return null;

  const isImage = fileType?.startsWith("image/");
  const isPdf = fileType === "application/pdf";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">Attachment Preview</h2>
            <p className="truncate text-sm text-gray-500">
              {fileName || "Notice attachment"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-gray-700 transition hover:bg-gray-100"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-gray-50 p-4">
          {isImage && (
            <div className="relative mx-auto h-[70vh] w-full max-w-4xl overflow-hidden rounded-xl border bg-white">
              <Image
                src={fileUrl}
                alt={fileName || "Notice attachment"}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}

          {isPdf && (
            <iframe
              src={fileUrl}
              className="h-[70vh] w-full rounded-xl border bg-white"
              title={fileName || "PDF preview"}
            />
          )}

          {!isImage && !isPdf && (
            <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
              Preview is not available for this file type.
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t px-5 py-4">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Open in New Tab
          </a>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}