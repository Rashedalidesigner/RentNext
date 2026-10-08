export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="flex flex-col items-center gap-3 text-slate-600">
        <div className="h-10 w-10 rounded-xl border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <p className="text-sm font-semibold">Loading RentNest…</p>
      </div>
    </div>
  );
}
