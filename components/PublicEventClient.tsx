"use client";
import { useEffect, useState } from 'react';

interface Session { name: string; scores: number[]; }
interface EventData { name: string; description?: string; teams: string[]; sessions: Session[]; totals: number[]; updatedAt: string; }

export default function PublicEventClient({ initial, name }: { initial: EventData; name: string }) {
  const [data, setData] = useState<EventData>(initial);
  const [error, setError] = useState<string|undefined>();

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/events/${name}`, { cache: 'no-store' });
        const json = await res.json();
        if (res.ok) {
          // Only update if changed (basic shallow comparison on updatedAt)
          if (json.updatedAt !== data.updatedAt) {
            setData(json);
          }
        } else {
          setError(json.error || 'Error fetching');
        }
      } catch (e:any) {
        setError(e.message);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [name, data.updatedAt]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{data.name}</h1>
        {data.description && <p className="text-gray-600 text-sm">{data.description}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Team</th>
              <th className="border px-2 py-1 text-right">Total</th>
              {data.sessions.map((s,i)=>(<th key={i} className="border px-2 py-1 text-right">{s.name}</th>))}
            </tr>
          </thead>
          <tbody>
            {data.teams.map((team,i)=> (
              <tr key={i}>
                <td className="border px-2 py-1">{team}</td>
                <td className="border px-2 py-1 text-right font-semibold">{data.totals[i]}</td>
                {data.sessions.map((s,j)=>(
                  <td key={j} className="border px-2 py-1 text-right">{s.scores[i]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">Auto-updates every 5s. Last update: {new Date(data.updatedAt).toLocaleTimeString()}</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
