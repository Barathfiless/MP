import sql from "@/app/api/utils/sql";

// PUT - Update an action item
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    // Build dynamic update query
    const setClause = [];
    const values = [];
    let paramCount = 0;
    
    const allowedFields = ['task', 'assigned_to', 'deadline', 'status'];
    
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
      UPDATE action_items 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await sql(query, values);
    
    if (result.length === 0) {
      return Response.json(
        { success: false, error: 'Action item not found' },
        { status: 404 }
      );
    }
    
    return Response.json({ 
      success: true, 
      actionItem: result[0] 
    });
  } catch (error) {
    console.error('Error updating action item:', error);
    return Response.json(
      { success: false, error: 'Failed to update action item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an action item
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await sql`
      DELETE FROM action_items 
      WHERE id = ${id}
      RETURNING id
    `;
    
    if (result.length === 0) {
      return Response.json(
        { success: false, error: 'Action item not found' },
        { status: 404 }
      );
    }
    
    return Response.json({ 
      success: true, 
      message: 'Action item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting action item:', error);
    return Response.json(
      { success: false, error: 'Failed to delete action item' },
      { status: 500 }
    );
  }
}