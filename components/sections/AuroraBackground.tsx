export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[55vh] w-[55vh] -translate-x-1/2 rounded-full bg-(--color-accent) opacity-25 blur-[130px]" />
      <div className="absolute top-1/3 -left-32 h-[45vh] w-[45vh] rounded-full bg-(--color-violet) opacity-20 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-[45vh] w-[45vh] rounded-full bg-(--color-cyan) opacity-[0.12] blur-[130px]" />
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
