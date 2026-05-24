import { FileText, LockKeyhole } from "lucide-react";

export default function HeroPreviewCard() {
  return (
    <div className="border-t bg-gray-950 p-6 text-white sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">System Preview</p>
            <h2 className="mt-1 text-2xl font-black">Admin Notice Flow</h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-950">
            <LockKeyhole size={22} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-white p-4 text-gray-900">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-bold">Exam Routine Notice</h3>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                Academic
              </span>
            </div>

            <p className="line-clamp-2 text-sm leading-6 text-gray-600">
              This notice includes a PDF attachment. Public users can preview
              PDF pages as images and still open the original file.
            </p>

            <div className="mt-4 rounded-xl border bg-gray-50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <FileText size={20} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    routine-summary.pdf
                  </p>
                  <p className="text-xs text-gray-500">PDF Attachment</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded-lg bg-gray-950 px-3 py-2 text-sm font-bold text-white">
                  Preview
                </button>

                <button className="rounded-lg border bg-white px-3 py-2 text-sm font-bold text-gray-800">
                  Open
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Notice Date:{" "}
              <span className="font-semibold text-gray-900">24 May 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-400">Storage</p>
              <p className="mt-1 font-bold">MongoDB</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-400">Uploads</p>
              <p className="mt-1 font-bold">Cloudinary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}