import Link from 'next/link';
import EventForm from '@/components/EventForm';
import { LandingFeatures } from '@/components/LandingFeatures';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Live Scoreboard Management',
  description: 'Create, manage, and share real-time multi-team event scoreboards with session-based scoring.'
};

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-12 flex flex-col gap-20 max-w-7xl mx-auto">
      <header className="space-y-6 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-black to-neutral-600 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">Live Scoreboard Management</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Run tournaments, classroom competitions, hackathon challenges, or casual game nights. Create an event, add teams, record session scores, and share a live updating public scoreboard.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="#create" className="group bg-black text-white px-6 py-3 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/90">
            Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/login" className="border px-6 py-3 rounded-md text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10">Login</Link>
          <Link href="/signup" className="border px-6 py-3 rounded-md text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10">Sign Up</Link>
        </div>
        <p className="text-xs uppercase tracking-wider text-gray-400">No refresh needed • Session-based scoring • Mobile friendly</p>
      </header>

      <section className="space-y-8">
        <h2 className="text-xl font-semibold tracking-tight">Why this app?</h2>
        <LandingFeatures />
      </section>

      <section id="create" className="scroll-mt-28 space-y-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-2">Create an Event</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">Define a unique event name (used in the URL), list teams, optionally set a management password. You&apos;ll be taken to the management console to add sessions and scores.</p>
        </div>
        <EventForm />
      </section>

      <section className="rounded-xl border bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 p-8 flex flex-col gap-4 text-center">
        <h3 className="text-lg font-semibold">How sharing works</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Give spectators the public link <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs">/event/&lt;eventName&gt;</code>. Keep <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs">/event/&lt;eventName&gt;/manage</code> private for editing scores. A new session can represent a round, inning, quiz question set, sprint, or any scoring block.</p>
      </section>

      <footer className="text-xs text-gray-500 text-center pb-10 border-t pt-6">
        <p>Roadmap: user accounts, role-based permissions, richer analytics, export.</p>
      </footer>
    </div>
  );
}
