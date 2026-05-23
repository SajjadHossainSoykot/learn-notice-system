"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import NoticeAttachmentCard from "@/components/notices/NoticeAttachmentCard";
import AttachmentPreviewModal from "@/components/notices/AttachmentPreviewModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { formatDateTime, formatNoticeDate } from "@/lib/formatDate";

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

const ITEMS_PER_PAGE = 6;

const categoryFilters = [
  "All",
  "General",
  "Academic",
  "Event",
  "Exam",
  "Emergency",
];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredNotices = useMemo(() => {
    const sorted = [...notices].sort(
      (a, b) =>
        new Date(b.noticeDate).getTime() - new Date(a.noticeDate).getTime()
    );

    if (activeCategory === "All") {
      return sorted;
    }

    return sorted.filter((notice) => notice.category === activeCategory);
  }, [notices, activeCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotices.length / ITEMS_PER_PAGE)
  );

  const paginatedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNotices, currentPage]);

  function handleCategoryChange(category: string) {
    setActiveCategory(category);
    setCurrentPage(1);
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
      <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
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

          <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {categoryFilters.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={
                    activeCategory === category
                      ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                      : "rounded-full border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

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

          {!loading && !error && filteredNotices.length === 0 && (
            <div className="rounded-xl border bg-white p-6 text-gray-600 shadow-sm">
              No notices found for this category.
            </div>
          )}

          {!loading && paginatedNotices.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedNotices.map((notice) => (
                  <article
                    key={notice._id}
                    className="flex min-h-[310px] flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="line-clamp-2 text-base font-semibold sm:text-lg">
                        {notice.title}
                      </h2>

                      <span className="w-fit shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {notice.category}
                      </span>
                    </div>

                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-700">
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
                        {formatNoticeDate(notice.noticeDate)}
                      </span>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-gray-500">
                        Created: {formatDateTime(notice.createdAt)}
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

              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      type="button"
                      onClick={() => setCurrentPage(index + 1)}
                      className={
                        currentPage === index + 1
                          ? "rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                          : "rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      }
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
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