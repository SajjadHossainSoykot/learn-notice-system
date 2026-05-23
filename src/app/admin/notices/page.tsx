import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function AdminNoticesPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                Protected Admin Area
              </p>

              <h1 className="mb-2 text-3xl font-bold">Admin Notice Dashboard</h1>

              <p className="text-gray-600">
                Logged in as:{" "}
                <span className="font-medium text-gray-900">
                  {session?.user?.email}
                </span>
              </p>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({
                  redirectTo: "/admin/login",
                });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-red-200 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/notices"
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="mb-2 text-xl font-semibold">View Public Notices</h2>
            <p className="text-gray-600">
              Go to the public notice board page.
            </p>
          </Link>

          <Link
            href="/notices/add"
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="mb-2 text-xl font-semibold">Add Notice</h2>
            <p className="text-gray-600">
              Current add page. Later we will move it under /admin/notices/add.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}