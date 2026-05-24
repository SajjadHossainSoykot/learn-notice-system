"use client";

import Image from "next/image";
import { Download, ExternalLink, FileText, X } from "lucide-react";

type AttachmentPreviewModalProps = {
  open: boolean;
  fileUrl: string;
  fileType?: string;
  fileName?: string;
  filePreviewUrls?: string[];
  onClose: () => void;
};

export default function AttachmentPreviewModal({
  open,
  fileUrl,
  fileType,
  fileName,
  filePreviewUrls = [],
  onClose,
}: AttachmentPreviewModalProps) {
  if (!open || !fileUrl) return null;

  const isImage = fileType?.startsWith("image/");
  const isPdf = fileType === "application/pdf";
  const hasPdfPagePreview = isPdf && filePreviewUrls.length > 0;

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
            <div className="relative mx-auto h-[70vh] w-full overflow-hidden rounded-xl border bg-white">
              <Image
                src={fileUrl}
                alt={fileName || "Notice attachment"}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}

          {hasPdfPagePreview && (
            <div className="mx-auto max-w-4xl space-y-5">
              {filePreviewUrls.map((previewUrl, index) => (
                <div
                  key={previewUrl}
                  className="rounded-xl border bg-white p-3 shadow-sm"
                >
                  <p className="mb-3 text-sm font-medium text-gray-600">
                    Page {index + 1}
                  </p>

                  <div className="relative h-[70vh] w-full overflow-hidden rounded-lg border bg-gray-50">
                    <Image
                      src={previewUrl}
                      alt={`${fileName || "PDF"} page ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isPdf && !hasPdfPagePreview && (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border bg-white p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <FileText size={34} className="text-gray-700" />
              </div>

              <h3 className="mb-2 text-xl font-bold">PDF Attachment</h3>

              <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-600">
                PDF page preview is not available for this older upload. You can
                open or download the PDF using the buttons below.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  <ExternalLink size={16} />
                  Open PDF
                </a>

                <a
                  href={fileUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>
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

          <a
            href={fileUrl}
            download
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Download
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