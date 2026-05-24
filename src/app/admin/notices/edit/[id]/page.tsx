"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import FileDropzone from "@/components/notices/FileDropzone";

type Notice = {
  _id: string;
  title: string;
  description: string;
  category: string;
  noticeDate: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
};

type UploadedFileData = {
  fileUrl: string;
  fileType: string;
  fileName: string;
};

function formatDateForInput(dateValue: string) {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

export default function AdminEditNoticePage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [noticeDate, setNoticeDate] = useState("");

  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchNotice() {
      try {
        setLoading(true);
        setMessage("");

        const res = await fetch(`/api/notices/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const contentType = res.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          setMessage("API route not found or server returned non-JSON response.");
          return;
        }

        const result = await res.json();

        if (!res.ok || !result.success) {
          setMessage(result.message || "Failed to fetch notice.");
          return;
        }

        const notice: Notice = result.data;

        setTitle(notice.title);
        setDescription(notice.description);
        setCategory(notice.category);
        setNoticeDate(formatDateForInput(notice.noticeDate));
        setFileUrl(notice.fileUrl || "");
        setFileType(notice.fileType || "");
        setFileName(notice.fileName || "");
      } catch (error) {
        console.error("Fetch single notice error:", error);
        setMessage("Something went wrong while fetching notice.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchNotice();
    }
  }, [id]);

  async function uploadNewFileIfSelected(): Promise<UploadedFileData> {
    if (!newFile) {
      return {
        fileUrl,
        fileType,
        fileName,
      };
    }

    const formData = new FormData();
    formData.append("file", newFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "File upload failed.");
    }

    return {
      fileUrl: result.data.fileUrl,
      fileType: result.data.fileType,
      fileName: result.data.fileName,
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const uploadedFile = await uploadNewFileIfSelected();

      const res = await fetch(`/api/notices/${id}`, {
        method: "PUT",
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

      const contentType = res.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        setMessage("API route not found or server returned non-JSON response.");
        return;
      }

      const result = await res.json();

      if (!res.ok || !result.success) {
        setMessage(result.message || "Failed to update notice.");
        return;
      }

      router.push("/admin/notices");
      router.refresh();
    } catch (error) {
      console.error("Update notice error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating notice."
      );
    } finally {
      setSaving(false);
    }
  }

  function removeCurrentAttachment() {
    setFileUrl("");
    setFileType("");
    setFileName("");
    setNewFile(null);
    setMessage("");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
        <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
          Loading notice...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            Protected Admin Area
          </p>

          <h1 className="mb-2 text-3xl font-bold">Edit Notice</h1>

          <p className="text-gray-600">
            Update notice information, date, and optional attachment.
          </p>
        </header>

        {message && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {message}
          </div>
        )}

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
              Change this if the notice should show an older or different date.
            </p>
          </div>

          {fileUrl && (
            <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
              <p className="mb-2">
                Current attachment:{" "}
                <span className="font-medium">
                  {fileName || "Notice attachment"}
                </span>
              </p>

              <div className="flex flex-wrap gap-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  View Current File
                </a>

                <button
                  type="button"
                  onClick={removeCurrentAttachment}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Remove Attachment
                </button>
              </div>
            </div>
          )}

          <FileDropzone
            file={newFile}
            onFileChange={setNewFile}
            onError={setMessage}
            label={fileUrl ? "Replace Attachment" : "Attachment"}
            helperText={
              fileUrl
                ? "Drop a new file only if you want to replace the current attachment. Allowed: JPG, PNG, WEBP, PDF. Max 10MB."
                : "Allowed: JPG, PNG, WEBP, PDF. Max file size: 10MB."
            }
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Notice"}
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