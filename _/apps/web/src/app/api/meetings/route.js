import sql from "@/app/api/utils/sql";

// GET - Fetch all meetings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const limit = searchParams.get('limit') || '10';
    
    let query = `
      SELECT 
        m.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ai.id,
              'task', ai.task,
              'assigned_to', ai.assigned_to,
              'deadline', ai.deadline,
              'status', ai.status
            )
          ) FILTER (WHERE ai.id IS NOT NULL), 
          '[]'::json
        ) as action_items
      FROM meetings m
      LEFT JOIN action_items ai ON m.id = ai.meeting_id
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (platform) {
      paramCount++;
      query += ` WHERE m.platform = $${paramCount}`;
      params.push(platform);
    }
    
    query += ` GROUP BY m.id ORDER BY m.date DESC`;
    
    if (limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }
    
    const meetings = await sql(query, params);
    
    return Response.json({ 
      success: true, 
      meetings: meetings 
    });
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
    
    const meeting = await sql`
      INSERT INTO meetings (title, platform, duration, transcript, summary, flowchart_code)
      VALUES (${title}, ${platform}, ${duration || null}, ${transcript || null}, ${summary || null}, ${flowchart_code || null})
      RETURNING *
    `;
    
    return Response.json({ 
      success: true, 
      meeting: meeting[0] 
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return Response.json(
      { success: false, error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}