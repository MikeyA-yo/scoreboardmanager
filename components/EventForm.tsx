"use client";
import { useState } from 'react';

export default function EventForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [managementPassword, setManagementPassword] = useState("");
  const [teams, setTeams] = useState<string[]>(["Team A", "Team B"]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|undefined>();

  const updateTeam = (idx: number, value: string) => {
    setTeams(t => t.map((v,i)=> i===idx? value : v));
  };
  const addTeam = () => {
    setTeams(t => t.length < 10 ? [...t, `Team ${t.length+1}`] : t);
  };
  const removeTeam = (idx: number) => {
    setTeams(t => t.filter((_,i)=>i!==idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(undefined);
    try {
      const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim().toLowerCase(), description, managementPassword, teams }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessage('Created! Redirecting...');
      window.location.href = `/event/${name.trim().toLowerCase()}/manage`;
    } catch (err:any) {
      setMessage(err.message);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl w-full">
      <h2 className="text-xl font-semibold">Create Event</h2>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Event Name (slug)</label>
        <input required value={name} onChange={e=>setName(e.target.value)} pattern="[a-zA-Z0-9-]+" className="border rounded px-3 py-2 w-full" placeholder="my-event" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} className="border rounded px-3 py-2 w-full" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Management Password (optional)</label>
        <input type="password" value={managementPassword} onChange={e=>setManagementPassword(e.target.value)} className="border rounded px-3 py-2 w-full" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between"><span className="text-sm font-medium">Teams ({teams.length})</span>{teams.length<10 && <button type="button" onClick={addTeam} className="text-blue-600 text-sm">Add Team</button>}</div>
        <div className="space-y-2">
          {teams.map((t,i)=> (
            <div key={i} className="flex gap-2 items-center">
              <input required value={t} onChange={e=>updateTeam(i,e.target.value)} className="border rounded px-2 py-1 flex-1" />
              {teams.length>2 && <button type="button" onClick={()=>removeTeam(i)} className="text-red-600 text-xs">Remove</button>}
            </div>
          ))}
        </div>
      </div>
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading? 'Creating...' : 'Create Event'}</button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
