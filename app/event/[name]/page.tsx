import { getDb } from '@/lib/mongodb';
import { EventDoc, computeTotals } from '@/types/models';
import { use } from 'react';

// Keep dynamic; we don't cache because of live scores
export const revalidate = 0;

// NOTE: In some Next.js versions params is still a plain object (not a Promise yet).
// We defensively handle both to avoid calling use() on a non-thenable which triggers
// the "Expected a suspended thenable" React error.
export default async function PublicEventPage({ params }: { params: { name: string } | Promise<{ name: string }> }) {
  let name: string;
  if (params && typeof (params as any).then === 'function') {
    // Treat as promise variant
    name = (use(params as Promise<{ name: string }>) as { name: string }).name;
  } else {
    name = (params as { name: string }).name;
  }
  const db = await getDb();
  const event = await db.collection<EventDoc>('events').findOne({ name });
  if (!event) return <div className="p-6">Event not found.</div>;
  const totals = computeTotals(event);
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold">{event.name}</h1>
      {event.description && <p className="text-gray-600 text-sm">{event.description}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Team</th>
              <th className="border px-2 py-1 text-right">Total</th>
              {event.sessions.map((s,i)=>(
                <th key={i} className="border px-2 py-1 text-right">{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {event.teams.map((team,i)=> (
              <tr key={i}>
                <td className="border px-2 py-1">{team}</td>
                <td className="border px-2 py-1 text-right font-semibold">{totals[i]}</td>
                {event.sessions.map((s,j)=>(
                  <td key={j} className="border px-2 py-1 text-right">{s.scores[i]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">Auto-refreshes every 5s.</p>
      <script // naive polling reload - will optimize later
        dangerouslySetInnerHTML={{ __html: `setInterval(()=>{fetch('/api/events/${event.name}').then(r=>r.json()).then(d=>{if(!d.sessions) return; location.reload();});},5000);` }} />
    </div>
  );
}
