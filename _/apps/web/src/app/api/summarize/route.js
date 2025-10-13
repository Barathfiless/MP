// POST - Summarize meeting transcript using ChatGPT
export async function POST(request) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript) {
      return Response.json(
        { success: false, error: 'Transcript is required' },
        { status: 400 }
      );
    }
    
    // Call ChatGPT to summarize the meeting and extract action items
    const response = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are an AI meeting assistant. Analyze the given meeting transcript and:
1. Summarize the discussion in bullet points.
2. Extract clear action items with assignees and deadlines if mentioned.
3. Generate a Mermaid.js flowchart syntax representing the logical flow of the meeting.

Return the output in JSON format.`
          },
          {
            role: 'user',
            content: `Please analyze this meeting transcript: ${transcript}`
          }
        ],
        json_schema: {
          name: "meeting_analysis",
          schema: {
            type: "object",
            properties: {
              summary: {
                type: "array",
                items: {
                  type: "string"
                }
              },
              actionItems: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    task: { type: "string" },
                    assignedTo: { type: ["string", "null"] },
                    deadline: { type: ["string", "null"] },
                    status: { type: "string" }
                  },
                  required: ["task", "assignedTo", "deadline", "status"],
                  additionalProperties: false
                }
              },
              flowchart: {
                type: "string"
              }
            },
            required: ["summary", "actionItems", "flowchart"],
            additionalProperties: false
          }
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid AI response format');
    }
    
    const analysisResult = JSON.parse(data.choices[0].message.content);
    
    return Response.json({ 
      success: true, 
      summary: analysisResult.summary.join('\n• '),
      actionItems: analysisResult.actionItems,
      flowchart: analysisResult.flowchart
    });
  } catch (error) {
    console.error('Error summarizing meeting:', error);
    return Response.json(
      { success: false, error: 'Failed to summarize meeting' },
      { status: 500 }
    );
  }
}