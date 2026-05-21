type Notice = {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

async function getNotices() {
  const res = await fetch("http://localhost:3000/api/notices", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notices");
  }

  return res.json();
}

export default async function NoticesPage() {
  const result = await getNotices();
  const notices: Notice[] = result.data;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Notice Board</h1>
        <p className="mb-8 text-gray-600">
          This page fetches notices from MongoDB using a Next.js API route.
        </p>

        {notices.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-gray-600">
            No notices found.
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold">{notice.title}</h2>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    {notice.category}
                  </span>
                </div>

                <p className="mb-3 text-gray-700">{notice.description}</p>

                <p className="text-sm text-gray-500">
                  Created: {new Date(notice.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}