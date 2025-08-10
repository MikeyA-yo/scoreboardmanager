"use client";
import { useEffect, useState } from 'react';

interface SessionData { name: string; scores: number[]; }

export default function ManageEventPage({ params }: { params: { name: string } }) {
  const [name, setName] = useState<string>('');
  const [event, setEvent] = useState<{ name: string; description?: string; teams: string[]; sessions: SessionData[]; totals: number[]; updatedAt: string }|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  const [managementPassword, setManagementPassword] = useState("");
  const [newSessionName, setNewSessionName] = useState("");
  const [newScores, setNewScores] = useState<number[]>([]);
  const [message, setMessage] = useState<string|undefined>();

  const fetchEvent = async () => {
    setLoading(true);
    try {
  const res = await fetch(`/api/events/${name}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setEvent(data);
      setNewScores(new Array(data.teams.length).fill(0));
    } catch (e:any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ setName(params.name); },[params]);
  useEffect(()=>{ if(name) fetchEvent(); },[name]);

  const addSession = async () => {
    setMessage(undefined);
    try {
  const res = await fetch(`/api/events/${name}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add-session', managementPassword, session: { name: newSessionName, scores: newScores } }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setNewSessionName(""); setNewScores(new Array(event!.teams.length).fill(0));
      await fetchEvent();
      setMessage('Session added');
    } catch (e:any) { setMessage(e.message); }
  };

  const updateSessionScore = (sessionIndex: number, teamIndex: number, value: number) => {
    setEvent(ev => {
      if (!ev) return ev; const clone = { ...ev, sessions: ev.sessions.map(s=> ({...s, scores: [...s.scores]}))};
      clone.sessions[sessionIndex].scores[teamIndex] = value; return clone;
    });
  };

  const saveSession = async (sessionIndex: number) => {
    if (!event) return;
    const session = event.sessions[sessionIndex];
    try {
  const res = await fetch(`/api/events/${name}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update-session', managementPassword, session: { index: sessionIndex, name: session.name, scores: session.scores } }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessage('Session updated');
      await fetchEvent();
    } catch (e:any) { setMessage((e as any).message); }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!event) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">Manage: {event.name}</h1>
      <div className="flex gap-4 flex-wrap items-end">
        <div>
          <label className="block text-xs font-medium mb-1">Management Password</label>
          <input type="password" value={managementPassword} onChange={e=>setManagementPassword(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">New Session Name</label>
            <input value={newSessionName} onChange={e=>setNewSessionName(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex items-end gap-2">
          {event.teams.map((t,i)=>(
            <div key={i} className="text-center">
              <label className="block text-[10px] uppercase tracking-wide mb-1">{t}</label>
              <input type="number" value={newScores[i]||0} onChange={e=> setNewScores(ns=> ns.map((v,j)=> j===i? Number(e.target.value): v))} className="border rounded px-2 py-1 w-20" />
            </div>
          ))}
          <button onClick={addSession} className="bg-blue-600 text-white px-3 py-1 rounded text-sm self-start mt-5">Add Session</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Team</th>
              <th className="border px-2 py-1 text-right">Total</th>
              {event.sessions.map((s,i)=>(<th key={i} className="border px-2 py-1 text-right">{s.name}</th>))}
            </tr>
          </thead>
          <tbody>
            {event.teams.map((team,i)=>(
              <tr key={i}>
                <td className="border px-2 py-1">{team}</td>
                <td className="border px-2 py-1 text-right font-semibold">{event.totals[i]}</td>
                {event.sessions.map((s,si)=>(
                  <td key={si} className="border px-2 py-1 text-right">
                    <input type="number" value={s.scores[i]} onChange={e=> updateSessionScore(si,i, Number(e.target.value))} className="w-16 border rounded px-1 py-0.5 text-right" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        {event.sessions.map((s,i)=>(
          <button key={i} onClick={()=>saveSession(i)} className="bg-green-600 text-white text-xs px-2 py-1 rounded">Save {s.name}</button>
        ))}
      </div>
      {message && <p className="text-sm text-gray-700">{message}</p>}
      <p className="text-xs text-gray-500">Changes require correct management password until auth is wired.</p>
    </div>
  );
}
