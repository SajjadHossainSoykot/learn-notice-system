"use client";

import { useEffect, useState } from "react";

type Notice = {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

type NoticeApiResponse = {
  success: boolean;
  message?: string;
  data: Notice[];
};

export default function PublicNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      console.error("Notice fetch error:", error);
      setError("Something went wrong while fetching notices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            Public Notice Board
          </p>

          <h1 className="mb-2 text-3xl font-bold">All Notices</h1>

          <p className="max-w-2xl text-gray-600">
            View latest notices published from the admin notice management
            system.
          </p>
        </header>

        {loading && (
          <div className="rounded-xl border bg-white p-6 text-gray-600 shadow-sm">
            Loading notices...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && notices.length === 0 && (
          <div className="rounded-xl border bg-white p-6 text-gray-600 shadow-sm">
            No notices found.
          </div>
        )}

        {!loading && !error && notices.length > 0 && (
          <div className="space-y-4">
            {notices.map((notice) => (
              <article
                key={notice._id}
                className="rounded-xl border bg-white p-5 shadow-sm"
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

                <p className="border-t pt-4 text-sm text-gray-500">
                  Published: {new Date(notice.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}