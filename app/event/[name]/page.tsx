import { getDb } from '@/lib/mongodb';
import { EventDoc, computeTotals } from '@/types/models';
import PublicEventClient from '@/components/PublicEventClient';

export const revalidate = 0; // dynamic

// Experimental promise-based params signature. If build/runtime rejects this, revert to object form.
export default async function PublicEventPage({ params }: { params: Promise<{ name: string }> }) {
  let name: string;
  try {
    // Await the params promise (Next.js experimental behavior)
    ({ name } = await params);
  } catch (e) {
    return <div className="p-6">Unable to resolve route parameters.</div>;
  }
  const db = await getDb();
  const event = await db.collection<EventDoc>('events').findOne({ name });
  if (!event) return <div className="p-6">Event not found.</div>;
  const totals = computeTotals(event);
  const initial = {
    name: event.name,
    description: event.description,
    teams: event.teams,
    sessions: event.sessions.map(s => ({ name: s.name, scores: s.scores })),
    totals,
    updatedAt: event.updatedAt.toISOString?.() || String(event.updatedAt)
  };
  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <PublicEventClient initial={initial as any} name={name} />
    </div>
  );
}
