"use client";

import Link from "next/link";
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

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
        setError("Something went wrong while fetching notices");
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Notice Board</h1>
            <p className="text-gray-600">
              This page fetches notices from MongoDB using a Next.js API route.
            </p>
          </div>

          <Link
            href="/notices/add"
            className="w-fit rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700"
          >
            Add Notice
          </Link>
        </div>

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
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold">{notice.title}</h2>

                  <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    {notice.category}
                  </span>
                </div>

                <p className="mb-3 text-gray-700">{notice.description}</p>

                <p className="text-sm text-gray-500">
                  Created: {new Date(notice.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}