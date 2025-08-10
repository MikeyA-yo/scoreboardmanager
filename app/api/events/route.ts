import { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { EventDoc } from '@/types/models';
import bcrypt from 'bcryptjs';

// POST /api/events -> create event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, managementPassword, teams, creatorId } = body;
    if (!name || !/^[a-z0-9-]+$/i.test(name)) {
      return Response.json({ error: 'Invalid name (alphanumeric and dashes only)' }, { status: 400 });
    }
    if (!Array.isArray(teams) || teams.length < 2 || teams.length > 10) {
      return Response.json({ error: 'Teams must be 2-10 names' }, { status: 400 });
    }
    const db = await getDb();
    const existing = await db.collection<EventDoc>('events').findOne({ name });
    if (existing) return Response.json({ error: 'Name already taken' }, { status: 409 });

    const managementPasswordHash = managementPassword ? await bcrypt.hash(managementPassword, 10) : undefined;

    const now = new Date();
    const doc: EventDoc = {
      name,
      description,
      creatorId: creatorId ?? 'anon', // placeholder until auth integration
      managementPasswordHash,
      teams,
      sessions: [],
      createdAt: now,
      updatedAt: now,
    };
    await db.collection<EventDoc>('events').insertOne(doc as any);
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
