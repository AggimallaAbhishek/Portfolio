export function LoadingPanel({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <div className="glass-card flex items-center gap-3 px-6 py-4 text-sm text-slate-200">
        <span className="h-3 w-3 animate-pulse rounded-full bg-cyan" />
        <span>{label}</span>
      </div>
    </div>
  );
}
