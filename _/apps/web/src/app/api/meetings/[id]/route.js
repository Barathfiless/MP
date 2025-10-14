import { meetingsCollection } from "@/app/api/utils/mongo";
import { ObjectId } from "mongodb";

// GET - Fetch a single meeting by ID
export async function GET(_request, { params }) {
  try {
    const id = params.id;
    const col = await meetingsCollection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) return Response.json({ success: false, error: 'Meeting not found' }, { status: 404 });
    return Response.json({ success: true, meeting: { id, ...doc } });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return Response.json({ success: false, error: 'Failed to fetch meeting' }, { status: 500 });
  }
}

// PUT - Update a meeting
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const updates = await request.json();
    const allowed = ['title', 'platform', 'duration', 'transcript', 'summary', 'flowchart_code', 'date'];
    const $set = Object.fromEntries(Object.entries(updates).filter(([k, v]) => allowed.includes(k) && v !== undefined));
    if (Object.keys($set).length === 0) return Response.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    const col = await meetingsCollection();
    const result = await col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set }, { returnDocument: 'after' });
    if (!result) return Response.json({ success: false, error: 'Meeting not found' }, { status: 404 });
    return Response.json({ success: true, meeting: { id, ...result } });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return Response.json({ success: false, error: 'Failed to update meeting' }, { status: 500 });
  }
}

// DELETE - Delete a meeting
export async function DELETE(_request, { params }) {
  try {
    const id = params.id;
    const col = await meetingsCollection();
    await col.deleteOne({ _id: new ObjectId(id) });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return Response.json({ success: false, error: 'Failed to delete meeting' }, { status: 500 });
  }
}