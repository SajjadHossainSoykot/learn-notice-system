"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NoticeAttachmentCard from "@/components/notices/NoticeAttachmentCard";
import AttachmentPreviewModal from "@/components/notices/AttachmentPreviewModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

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

type NoticeApiResponse = {
  success: boolean;
  message?: string;
  data: Notice[];
};

type PreviewFile = {
  fileUrl: string;
  fileType?: string;
  fileName?: string;
};

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);

  async function fetchNotices() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/notices", {
        method: "GET",
        cache: "no-store",
      });

      const result: NoticeApiResponse = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || "Failed to fetch notices");
        return;
      }

      setNotices(result.data || []);
    } catch (error) {
      console.error("Admin notice fetch error:", error);
      setError("Something went wrong while fetching notices.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id);

      const res = await fetch(`/api/notices/${deleteTarget._id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || "Failed to delete notice.");
        return;
      }

      setNotices((prev) =>
        prev.filter((notice) => notice._id !== deleteTarget._id)
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete notice error:", error);
      setError("Something went wrong while deleting notice.");
    } finally {
      setDeletingId("");
    }
  }

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                  Protected Admin Area
                </p>

                <h1 className="mb-2 text-3xl font-bold">
                  Admin Notice Dashboard
                </h1>

                <p className="max-w-2xl text-gray-600">
                  Manage public notices with date and optional PDF/image
                  attachments.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={fetchNotices}
                  className="rounded-lg border px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Refresh
                </button>

                <Link
                  href="/admin/notices/add"
                  className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700"
                >
                  Add Notice
                </Link>
              </div>
            </div>
          </header>

          {loading && (
            <div className="rounded-xl border bg-white p-6 text-gray-600 shadow-sm">
              Loading notices...
            </div>
          )}

          {!loading && error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && notices.length === 0 && (
            <div className="rounded-xl border bg-white p-6 text-gray-600 shadow-sm">
              No notices found.
            </div>
          )}

          {!loading && notices.length > 0 && (
            <div className="space-y-4">
              {notices.map((notice) => (
                <article
                  key={notice._id}
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold">{notice.title}</h2>

                    <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {notice.category}
                    </span>
                  </div>

                  <p className="mb-4 leading-relaxed text-gray-700">
                    {notice.description}
                  </p>

                  <NoticeAttachmentCard
                    fileUrl={notice.fileUrl}
                    fileType={notice.fileType}
                    fileName={notice.fileName}
                    onPreview={() =>
                      setPreviewFile({
                        fileUrl: notice.fileUrl || "",
                        fileType: notice.fileType,
                        fileName: notice.fileName,
                      })
                    }
                  />

                  <div className="mb-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    Notice Date:{" "}
                    <span className="font-medium text-gray-900">
                      {new Date(notice.noticeDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                      Created: {new Date(notice.createdAt).toLocaleString()}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/notices/edit/${notice._id}`}
                        className="w-fit rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(notice)}
                        disabled={deletingId === notice._id}
                        className="w-fit rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === notice._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <AttachmentPreviewModal
        open={!!previewFile}
        fileUrl={previewFile?.fileUrl || ""}
        fileType={previewFile?.fileType}
        fileName={previewFile?.fileName}
        onClose={() => setPreviewFile(null)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Notice?"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this notice?"
        }
        confirmText="Delete Notice"
        cancelText="Cancel"
        danger
        loading={!!deletingId}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => {
          if (!deletingId) {
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}