import { meetingsCollection } from "@/app/api/utils/mongo";

// GET - Fetch all meetings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const limit = searchParams.get('limit') || '10';
    const col = await meetingsCollection();
    const query = platform && platform !== 'all' ? { platform } : {};
    const docs = await col
      .find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .toArray();
    const meetings = docs.map((d) => ({ id: String(d._id), ...d }));
    return Response.json({ success: true, meetings });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}

// POST - Create a new meeting
export async function POST(request) {
  try {
    const { title, platform, duration, transcript, summary, flowchart_code } = await request.json();
    
    if (!title || !platform) {
      return Response.json(
        { success: false, error: 'Title and platform are required' },
        { status: 400 }
      );
    }
    const col = await meetingsCollection();
    const doc = {
      title,
      platform,
      duration: duration ?? null,
      transcript: transcript ?? null,
      summary: summary ?? null,
      flowchart_code: flowchart_code ?? null,
      date: new Date().toISOString(),
    };
    const { insertedId } = await col.insertOne(doc);
    return Response.json({ success: true, meeting: { id: String(insertedId), ...doc } });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return Response.json(
      { success: false, error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}