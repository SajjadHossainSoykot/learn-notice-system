"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FileDropzone from "@/components/notices/FileDropzone";

type UploadedFileData = {
  fileUrl: string;
  fileType: string;
  fileName: string;
  filePublicId: string;
  fileResourceType: string;
  filePreviewUrls: string[];
};

export default function AdminAddNoticePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [noticeDate, setNoticeDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadFileIfSelected(): Promise<UploadedFileData> {
    if (!file) {
      return {
        fileUrl: "",
        fileType: "",
        fileName: "",
        filePublicId: "",
        fileResourceType: "",
        filePreviewUrls: [],
      };
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "File upload failed.");
    }

    return {
      fileUrl: result.data.fileUrl || "",
      fileType: result.data.fileType || "",
      fileName: result.data.fileName || "",
      filePublicId: result.data.filePublicId || "",
      fileResourceType: result.data.fileResourceType || "",
      filePreviewUrls: result.data.filePreviewUrls || [],
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const uploadedFile = await uploadFileIfSelected();

      const res = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          noticeDate,
          ...uploadedFile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create notice.");
        return;
      }

      router.push("/admin/notices");
      router.refresh();
    } catch (error) {
      console.error("Add notice error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating notice."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            Protected Admin Area
          </p>

          <h1 className="mb-2 text-3xl font-bold">Add Notice</h1>

          <p className="text-gray-600">
            Create a notice with optional notice date and optional PDF/image
            attachment.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter notice description"
              rows={5}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            >
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Exam">Exam</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Notice Date <span className="text-gray-400">(optional)</span>
            </label>

            <input
              type="date"
              value={noticeDate}
              onChange={(e) => setNoticeDate(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />

            <p className="mt-2 text-sm text-gray-500">
              Leave empty to use today&apos;s publishing date. You can also
              select an older date for backdated notices.
            </p>
          </div>

          <FileDropzone
            file={file}
            onFileChange={setFile}
            onError={setMessage}
            label="Attachment"
          />

          {message && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Notice"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/notices")}
              className="rounded-lg border px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}