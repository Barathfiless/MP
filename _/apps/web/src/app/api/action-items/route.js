import sql from "@/app/api/utils/sql";

// GET - Fetch all action items with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meeting_id');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assigned_to');
    
    let query = `
      SELECT 
        ai.*,
        m.title as meeting_title,
        m.platform as meeting_platform,
        m.date as meeting_date
      FROM action_items ai
      LEFT JOIN meetings m ON ai.meeting_id = m.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (meetingId) {
      paramCount++;
      query += ` AND ai.meeting_id = $${paramCount}`;
      params.push(parseInt(meetingId));
    }
    
    if (status) {
      paramCount++;
      query += ` AND ai.status = $${paramCount}`;
      params.push(status);
    }
    
    if (assignedTo) {
      paramCount++;
      query += ` AND LOWER(ai.assigned_to) LIKE LOWER($${paramCount})`;
      params.push(`%${assignedTo}%`);
    }
    
    query += ` ORDER BY ai.created_at DESC`;
    
    const actionItems = await sql(query, params);
    
    return Response.json({ 
      success: true, 
      actionItems: actionItems 
    });
  } catch (error) {
    console.error('Error fetching action items:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch action items' },
      { status: 500 }
    );
  }
}

// POST - Create a new action item
export async function POST(request) {
  try {
    const { meeting_id, task, assigned_to, deadline, status } = await request.json();
    
    if (!task) {
      return Response.json(
        { success: false, error: 'Task is required' },
        { status: 400 }
      );
    }
    
    const actionItem = await sql`
      INSERT INTO action_items (meeting_id, task, assigned_to, deadline, status)
      VALUES (${meeting_id || null}, ${task}, ${assigned_to || null}, ${deadline || null}, ${status || 'Pending'})
      RETURNING *
    `;
    
    return Response.json({ 
      success: true, 
      actionItem: actionItem[0] 
    });
  } catch (error) {
    console.error('Error creating action item:', error);
    return Response.json(
      { success: false, error: 'Failed to create action item' },
      { status: 500 }
    );
  }
}