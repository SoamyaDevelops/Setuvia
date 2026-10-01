import React, { useState } from 'react';

const mockCallLogs = [
  {
    id: 1,
    date: '2026-10-01',
    duration: '5:23',
    ai_summary: 'Customer called about a $50 overcharge. They were highly frustrated. Agent assured them it would be investigated.',
    ai_mood: 'Angry',
    full_transcript: 'Agent: Hello, Setuvia Support.\nCustomer: My bill is wrong! I was charged an extra $50!\nAgent: I understand your frustration, I will escalate this.'
  },
  {
    id: 2,
    date: '2026-09-15',
    duration: '2:15',
    ai_summary: 'Customer called to reset their password. Issue was resolved quickly.',
    ai_mood: 'Neutral',
    full_transcript: 'Agent: Support here.\nCustomer: I need a password reset.\nAgent: Check your email. Done.'
  }
];

export default function CallLogsPanel() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Call History & AI Summaries</h3>
      <div className="space-y-4">
        {mockCallLogs.map((log) => (
          <div key={log.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-slate-800">📞 Call on {log.date}</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{log.duration} mins</span>
            </div>
            
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 mt-3">
              <h4 className="text-teal-800 font-bold text-xs uppercase mb-1">✨ AI Insight</h4>
              <p className="text-sm text-teal-900">{log.ai_summary}</p>
              <div className="mt-2 text-xs font-semibold text-teal-700">
                Detected Mood: <span className="bg-white px-2 py-0.5 rounded border border-teal-200">{log.ai_mood}</span>
              </div>
            </div>

            <button 
              onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              className="mt-3 text-sm text-blue-600 font-semibold hover:underline"
            >
              {expanded === log.id ? 'Hide Transcript' : 'View Full Transcript'}
            </button>

            {expanded === log.id && (
              <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-sm text-slate-600 whitespace-pre-wrap">
                {log.full_transcript}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
