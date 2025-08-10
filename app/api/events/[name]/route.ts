import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { EventDoc, computeTotals } from '@/types/models';
import bcrypt from 'bcryptjs';
// NOTE: Route handler params are currently synchronous objects in stable Next.js.
// Using a Promise union caused build-time type error. Keeping simple object form.

// GET /api/events/[name] -> public event data with totals
// Using Promise<any> context to align with experimental param delivery; cast after await.
export async function GET(_req: NextRequest, contextPromise: Promise<any>) {
  try {
    const { params } = await contextPromise as { params: { name: string } };
    const { name } = params;
    const db = await getDb();
    const event = await db.collection<EventDoc>('events').findOne({ name });
    if (!event) return Response.json({ error: 'Not found' }, { status: 404 });
    const totals = computeTotals(event);
    return Response.json({ name: event.name, description: event.description, teams: event.teams, sessions: event.sessions.map(s => ({ name: s.name, scores: s.scores })), totals, updatedAt: event.updatedAt });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/events/[name] -> add/edit session (requires password or creator)
export async function PATCH(req: NextRequest, contextPromise: Promise<any>) {
  try {
    const { params } = await contextPromise as { params: { name: string } };
    const { name } = params;
    const body = await req.json();
    const { action, managementPassword, session } = body as { action: 'add-session' | 'update-session'; managementPassword?: string; session: { name: string; scores: number[]; index?: number } };
    if (!action) return Response.json({ error: 'Action required' }, { status: 400 });
    const db = await getDb();
  const event = await db.collection<EventDoc>('events').findOne({ name });
    if (!event) return Response.json({ error: 'Not found' }, { status: 404 });

    // AuthZ placeholder: allow if managementPassword matches (until Better Auth integrated)
    if (event.managementPasswordHash) {
      if (!managementPassword || !(await bcrypt.compare(managementPassword, event.managementPasswordHash))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      return Response.json({ error: 'Management password not set' }, { status: 401 });
    }

    if (action === 'add-session') {
      if (!session || !session.name || !Array.isArray(session.scores) || session.scores.length !== event.teams.length) {
        return Response.json({ error: 'Invalid session' }, { status: 400 });
      }
      const now = new Date();
      event.sessions.push({ name: session.name, scores: session.scores, createdAt: now, updatedAt: now });
    } else if (action === 'update-session') {
      if (session?.index === undefined || session.index < 0 || session.index >= event.sessions.length) {
        return Response.json({ error: 'Invalid session index' }, { status: 400 });
      }
      if (!Array.isArray(session.scores) || session.scores.length !== event.teams.length) {
        return Response.json({ error: 'Scores length mismatch' }, { status: 400 });
      }
      const existing = event.sessions[session.index];
      existing.scores = session.scores;
      existing.updatedAt = new Date();
    }

    event.updatedAt = new Date();
    await db.collection<EventDoc>('events').updateOne({ _id: (event as any)._id }, { $set: { sessions: event.sessions, updatedAt: event.updatedAt } });
    const totals = computeTotals(event);
    return Response.json({ ok: true, totals });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
