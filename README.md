Prompt:
🚀 Build a full-stack AI-integrated web application named MEETPILOT – Smart Meeting Recap & Flowchart Assistant using React.js (frontend), Flask or FastAPI (backend), and Firebase/MongoDB (database).
The purpose of the app is to integrate with real-time meeting platforms like Google Meet, Zoom, Microsoft Teams, and Skype, capture live conversations, transcribe, summarize, and visualize them into action items and flowcharts.
Design it as a professional, modern, and responsive application using TailwindCSS and Framer Motion animations.
🏗️ Project Structure:
Frontend: React.js + TailwindCSS
Backend: FastAPI / Flask
Database: Firebase Firestore / MongoDB
APIs:
AssemblyAI or Whisper API → Transcription
OpenAI GPT-4 → Summarization + Action item extraction
Mermaid.js → Flowchart generation

🏠 1. Home Page
Purpose: Welcome the user and provide navigation.
Sections:
Welcome message (e.g., “Welcome, [UserName] 👋”)
Cards or buttons for:
Live Meetings
Meeting History
Dashboard (Action Items)
Share Reports
Add soft animations (Framer Motion)
Tailwind responsive grid layout

🎥 2. Live Meetings Page
Purpose: Connect and transcribe live or uploaded meetings.
Features:
Dropdown / buttons for platform selection: Google Meet, Zoom, Teams, Skype
"Start Recording" or "Upload Audio" option
Real-time transcription box (fetch text via AssemblyAI / Whisper API)
“Summarize Meeting” button → Sends transcript to GPT-4
“Save Meeting” button → Stores transcript, summary, and actions in DB
Backend flow:
Receive audio input stream
Send to AssemblyAI / Whisper API → Get transcript
Send transcript → GPT-4 API → Get summary + action items
Store { meetingID, transcript, summary, actionItems, timestamp } in DB

🕓 3. Meeting History Page
Purpose: View, share, and manage past meetings.
Features:
Fetch and display all meetings from database
Each meeting card shows:
Title (e.g., “Team Sync – Oct 13”)
Platform (Zoom / Meet / Teams)
Date & Duration
Buttons → View Summary / View Flowchart / Share / Delete
Filter by platform or date
Modal popup for detailed view
“Share Report” → generates shareable meeting summary link

📊 4. Dashboard Page (Action Items)
Purpose: Display actionable insights extracted from meetings.
Features:
Table / Cards for:
Task Name
Assigned Person
Deadline
Status (Pending / Completed)
Button: “Mark as Done”
Button: “Add New Action Item”
Auto-Generated Flowchart using Mermaid.js
GPT-4 generates Mermaid syntax like:
graph TD
A[Meeting Start] --> B[Discussion]
B --> C[Decision Points]
C --> D[Action Items]

Save updates to Firebase in real time

⚙️ 5. Backend Logic (FastAPI / Flask)
Endpoints:
/transcribe → Handles audio input & sends to AssemblyAI / Whisper
/summarize → Sends transcript to GPT-4, returns summary & actions
/save_meeting → Saves meeting data to DB
/get_meetings → Fetch all user meetings
/delete_meeting/{id} → Deletes meeting record
/generate_flowchart → Converts AI summary into Mermaid.js flowchart syntax

☁️ 6. Database Schema (Firebase / MongoDB)
{
"meetings": [
{
"id": "auto_id",
"title": "Design Review",
"platform": "Google Meet",
"date": "2025-10-13",
"transcript": "Full text...",
"summary": "Summarized points...",
"actionItems": [
{"task": "Update UI mockups", "assignedTo": "Barath", "status": "Pending"}
],
"flowchartCode": "graph TD; A-->B; B-->C;"
}
]
}

🧠 7. AI Prompts for Summarization
When calling GPT-4:
You are an AI meeting assistant. Analyze the given meeting transcript and:


Summarize the discussion in bullet points.
Extract clear action items with assignees and deadlines if mentioned.
Generate a Mermaid.js flowchart syntax representing the logical flow of the meeting.
Return the output in JSON format:
{
"summary": "...",
"actionItems": [...],
"flowchart": "..."
}

🎨 8. UI Styling & Design
Use TailwindCSS for all styling.
Use Framer Motion for page transitions and hover animations.
Use lucide-react icons for navigation.
Layout suggestion:
Navbar (Home | Live Meeting | History | Dashboard)
Main container (with responsive grid)
Card-based UI for summaries & items
