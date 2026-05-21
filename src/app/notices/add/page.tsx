"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddNoticePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create notice");
        return;
      }

      setTitle("");
      setDescription("");
      setCategory("General");

      router.push("/notices");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">Add Notice</h1>
        <p className="mb-8 text-gray-600">
          Create a new notice and save it into MongoDB.
        </p>

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

          {message && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Notice"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/notices")}
              className="rounded-lg border px-5 py-3 font-medium"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}