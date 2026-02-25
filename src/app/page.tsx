import { Button } from '@/components/Button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 text-5xl font-bold tracking-tight">
          ⚡ EleMotor
          <span className="ml-2 text-blue-400">Frontend</span>
        </h1>
        <p className="text-lg text-slate-400">
          Next.js 16 · TypeScript · Tailwind CSS v4 · ESLint · Prettier
        </p>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: 'Next.js', value: '16', color: 'bg-black' },
          { label: 'TypeScript', value: 'Strict', color: 'bg-blue-700' },
          { label: 'Tailwind', value: 'v4', color: 'bg-teal-700' },
          { label: 'ESLint', value: '9 Flat', color: 'bg-purple-700' },
          { label: 'Prettier', value: '✓', color: 'bg-pink-700' },
        ].map((item) => (
          <div
            key={item.label}
            className={`${item.color} flex flex-col items-center rounded-xl p-4 shadow-lg`}
          >
            <span className="text-xs font-medium uppercase tracking-widest text-slate-300">
              {item.label}
            </span>
            <span className="mt-1 text-2xl font-bold">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Button showcase */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="primary" isLoading>
          Loading…
        </Button>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Starter profesional listo para producción 🚀
      </p>
    </main>
  );
}
