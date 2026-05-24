"use client";

import { FileText, ImageIcon, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

type FileDropzoneProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onError?: (message: string) => void;
  label?: string;
  helperText?: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

function formatFileSize(size: number) {
  const sizeInMb = size / (1024 * 1024);
  return `${sizeInMb.toFixed(2)} MB`;
}

function isImageFile(fileType: string) {
  return fileType.startsWith("image/");
}

export default function FileDropzone({
  file,
  onFileChange,
  onError,
  label = "Attachment",
  helperText = "Allowed: JPG, PNG, WEBP, PDF. Max file size: 10MB.",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function validateAndSetFile(selectedFile: File | null) {
    if (!selectedFile) {
      onFileChange(null);
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      onError?.("Only JPG, PNG, WEBP, and PDF files are allowed.");
      onFileChange(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      onError?.("File size must be less than 10MB.");
      onFileChange(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    onError?.("");
    onFileChange(selectedFile);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    validateAndSetFile(droppedFile);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function removeFile() {
    onFileChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-2 block font-medium">
        {label} <span className="text-gray-400">(optional)</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={
          isDragging
            ? "cursor-pointer rounded-xl border-2 border-dashed border-gray-900 bg-gray-100 px-5 py-8 text-center transition"
            : "cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition hover:border-gray-500 hover:bg-gray-100"
        }
      >
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <UploadCloud size={28} className="text-gray-700" />
        </div>

        <p className="text-sm font-semibold text-gray-900">
          Drag and drop file here, or click to browse
        </p>

        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      </div>

      {file && (
        <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                {isImageFile(file.type) ? (
                  <ImageIcon size={22} className="text-gray-700" />
                ) : (
                  <FileText size={22} className="text-gray-700" />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {file.name}
                </p>

                <p className="text-xs text-gray-500">
                  {file.type === "application/pdf"
                    ? "PDF"
                    : isImageFile(file.type)
                      ? "Image"
                      : "File"}{" "}
                  · {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-gray-700 transition hover:bg-gray-100"
              aria-label="Remove selected file"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}