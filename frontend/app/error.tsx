'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className="max-w-md rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600">RentNest could not load this page. Please try again.</p>
        <button onClick={reset} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Try again</button>
      </div>
    </div>
  );
}
