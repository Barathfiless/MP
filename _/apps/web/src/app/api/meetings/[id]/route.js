import sql from "@/app/api/utils/sql";

// GET - Fetch a single meeting by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const meeting = await sql`
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
      WHERE m.id = ${id}
      GROUP BY m.id
    `;
    
    if (meeting.length === 0) {
      return Response.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      );
    }
    
    return Response.json({ 
      success: true, 
      meeting: meeting[0] 
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch meeting' },
      { status: 500 }
    );
  }
}

// PUT - Update a meeting
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    // Build dynamic update query
    const setClause = [];
    const values = [];
    let paramCount = 0;
    
    const allowedFields = ['title', 'platform', 'duration', 'transcript', 'summary', 'flowchart_code'];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        paramCount++;
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    }
    
    if (setClause.length === 0) {
      return Response.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    paramCount++;
    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const query = `
      UPDATE meetings 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await sql(query, values);
    
    if (result.length === 0) {
      return Response.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      );
    }
    
    return Response.json({ 
      success: true, 
      meeting: result[0] 
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return Response.json(
      { success: false, error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a meeting
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await sql`
      DELETE FROM meetings 
      WHERE id = ${id}
      RETURNING id
    `;
    
    if (result.length === 0) {
      return Response.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      );
    }
    
    return Response.json({ 
      success: true, 
      message: 'Meeting deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return Response.json(
      { success: false, error: 'Failed to delete meeting' },
      { status: 500 }
    );
  }
}