import Link from 'next/link';
import EventForm from '@/components/EventForm';

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="space-y-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Live Scoreboard Management</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Create and manage real-time multi-team events with session-based scoring. Share a public link, update scores live.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="#create" className="bg-black text-white px-5 py-2 rounded text-sm font-medium">Create Event</Link>
          <Link href="/login" className="border px-5 py-2 rounded text-sm font-medium">Login</Link>
          <Link href="/signup" className="border px-5 py-2 rounded text-sm font-medium">Sign Up</Link>
        </div>
      </header>
      <section id="create" className="scroll-mt-24">
        <EventForm />
      </section>
      <section className="text-sm text-gray-500 text-center pt-10 border-t">
        <p>After creating an event, share the public URL: /event/[eventName]</p>
        <p>Manage scores at /event/[eventName]/manage</p>
      </section>
    </div>
  );
}
