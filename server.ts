import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // YouTube Search API Proxy Endpoint
  app.get('/api/youtube/search', async (req, res) => {
    try {
      const { skill, targetRole, studentLevel, preferredLanguage, maxResults } = req.query;
      const apiKey = process.env.YOUTUBE_API_KEY;

      if (!apiKey) {
        return res.json({
          isLiveApi: false,
          notice: 'YOUTUBE_API_KEY environment variable is not configured. Returning verified curated resources.',
          items: [],
        });
      }

      // Generate deterministic query string
      const cleanSkill = (skill as string) || 'Software Engineering';
      const cleanLevel = (studentLevel as string) || 'Beginner';
      const cleanRole = (targetRole as string) || '';
      
      const queryStr = `${cleanSkill} ${cleanLevel} ${cleanRole} tutorial course`.trim();

      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.append('key', apiKey);
      url.searchParams.append('q', queryStr);
      url.searchParams.append('part', 'snippet');
      url.searchParams.append('maxResults', String(maxResults || 6));
      url.searchParams.append('type', 'video');
      url.searchParams.append('videoCategoryId', '27'); // Education

      if (preferredLanguage && preferredLanguage !== 'Other') {
        const langMap: Record<string, string> = {
          English: 'en',
          Hindi: 'hi',
          Kannada: 'kn',
        };
        if (langMap[preferredLanguage as string]) {
          url.searchParams.append('relevanceLanguage', langMap[preferredLanguage as string]);
        }
      }

      const ytRes = await fetch(url.toString());
      if (!ytRes.ok) {
        const errBody = await ytRes.text();
        return res.json({
          isLiveApi: false,
          notice: `YouTube Data API returned status ${ytRes.status}. Using verified fallback resources.`,
          items: [],
          error: errBody,
        });
      }

      const data = await ytRes.json();
      return res.json({
        isLiveApi: true,
        notice: 'Live results retrieved from YouTube Data API v3.',
        items: data.items || [],
      });
    } catch (err: any) {
      return res.json({
        isLiveApi: false,
        notice: `Error connecting to YouTube Data API: ${err.message}`,
        items: [],
      });
    }
  });

  // AI Career Mentor Endpoint (Gemini 3.6 Flash Integration)
  app.post('/api/mentor/chat', async (req, res) => {
    try {
      const { prompt, history, context, isVoiceMode } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        const fallback = generateServerContextFallback(prompt, context, isVoiceMode);
        return res.json({
          response: fallback,
          isAiGenerated: false,
          notice: 'GEMINI_API_KEY environment variable is not set. Using context-aware fallback mentor engine.',
          modelUsed: 'Context-Aware Fallback Engine',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const targetRole = context?.targetRole || context?.studentProfile?.targetRole || 'Engineering Professional';
      const firstName = context?.studentProfile?.firstName || 'Student';
      const academicYear = context?.studentProfile?.academicYear || 'Engineering Student';
      const branch = context?.studentProfile?.branch || 'Computer Science';

      const voiceModeInstruction = isVoiceMode
        ? `
VOICE MODE INSTRUCTION (CRITICAL):
The student is interacting with you via Voice Chat.
- Speak naturally, warmly, and concisely (2 to 4 short sentences maximum or a brief 3-point list).
- Avoid markdown tables, long code snippets, excessive headings, or lengthy paragraphs.
- Keep tone conversational and suitable for spoken text-to-speech rendering.`
        : '';

      const systemInstruction = `
You are Aira, an expert AI Career Mentor for engineering students on TechPath AI.
Your identity and role:
- Name: Aira
- Role: AI Career Mentor
- Personality: Professional, encouraging, practical, honest, student-friendly, and industry-oriented.
- Focus: Career decisions, skills acquisition strategy, learning roadmaps, capstone projects, interview preparation, campus/off-campus placements, internships, and tech industry expectations.
${voiceModeInstruction}

CRITICAL INSTRUCTIONS:
1. ALWAYS reference the student's personal TechPath context provided below (Name: ${firstName}, Year: ${academicYear}, Branch: ${branch}, Target Role: ${targetRole}).
2. Use their actual completed skills, top skill gaps, active roadmap stage, and career priorities to make your advice deeply relevant.
3. NEVER recommend technologies or frameworks that contradict their chosen target role (${targetRole}) unless explicitly asked.
4. Structure your response clearly using Markdown formatting (headings, bullet points, bold text) for high readability.
5. Provide specific, step-by-step actionable advice.
6. Encourage the student while remaining grounded in real industry hiring standards (do not make unrealistic promises like "100% placement guarantee").
7. Do not output meta-chat filler like "As an AI..." or "Based on the prompt...". Speak naturally and directly as Aira.
8. JOB OPENING QUERIES: If asked about specific current job openings at a company (e.g. "What jobs are open at Microsoft today?"): State clearly that you don't have live job-opening API data connected right now, and direct the student to the official company careers page (e.g. Microsoft: https://careers.microsoft.com, Google: https://careers.google.com, Amazon: https://www.amazon.jobs, TCS: https://www.tcs.com/careers). NEVER invent or fabricate current job listings.
`;

      let contextSummary = '';
      if (context) {
        const skillsList = context.currentSkills?.map((s: any) => `${s.name} (${s.proficiency || s.level})`).join(', ') || 'None listed';
        const topGaps = context.skillGaps?.filter((g: any) => String(g.priority).toUpperCase() === 'HIGH').map((g: any) => `${g.skillName} (Current: ${g.currentLevel}, Needed: ${g.requiredLevel})`).join(', ') || 'None';
        
        contextSummary = `
STUDENT CONTEXT OVERVIEW:
- Student Name: ${firstName}
- Target Role: ${targetRole}
- Academic Stage: ${academicYear} in ${branch} (Graduating ${context.studentProfile?.graduationYear || 2026})
- Current Skills: ${skillsList}
- High-Priority Skill Gaps: ${topGaps}
- Roadmap Status: ${context.roadmapProgress?.overallProgressPercentage || 0}% overall progress. Active Stage: ${context.roadmapProgress?.currentStageName || 'Foundation'}
- Current Step Focus: ${context.currentRoadmapStep ? `${context.currentRoadmapStep.title} (${context.currentRoadmapStep.skillName})` : 'Not started'}
- Career Priorities: ${context.careerPriorities?.join(', ') || 'Placement preparation'}
- Preferred Format: ${context.learningPreferences?.formats?.join(', ') || 'Mixed'}, Language: ${context.learningPreferences?.language || 'English'}
`;
      }

      const formattedHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map((msg: any) => `${msg.sender === 'user' ? 'Student' : 'Aira'}: ${msg.text}`)
            .join('\n')
        : '';

      const fullPrompt = `
${contextSummary}

CONVERSATION HISTORY:
${formattedHistory}

STUDENT QUESTION:
${prompt}
`;

      const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-3.6-flash'];
      let responseText = '';
      let successfulModel = '';

      for (const modelName of candidateModels) {
        try {
          const geminiRes = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (geminiRes?.text) {
            responseText = geminiRes.text;
            successfulModel = modelName;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Gemini model ${modelName} returned error: ${modelErr?.message || modelErr}`);
        }
      }

      if (responseText) {
        return res.json({
          response: responseText,
          isAiGenerated: true,
          modelUsed: successfulModel,
        });
      }

      // If no model succeeded, return the fallback context-aware engine
      const fallback = generateServerContextFallback(req.body?.prompt || '', req.body?.context, isVoiceMode);
      return res.json({
        response: fallback,
        isAiGenerated: false,
        notice: 'Gemini API call unavailable or returned access error. Using context-aware fallback engine.',
        modelUsed: 'Context-Aware Fallback Engine',
      });
    } catch (err: any) {
      console.warn('Unable to process request via Gemini API:', err?.message || err);
      const fallback = generateServerContextFallback(req.body?.prompt || '', req.body?.context, req.body?.isVoiceMode);
      return res.json({
        response: fallback,
        isAiGenerated: false,
        notice: `Gemini API unavailable: ${err?.message || 'Error'}. Using context-aware fallback response.`,
        modelUsed: 'Context-Aware Fallback Engine',
      });
    }
  });

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

function generateServerContextFallback(prompt: string, context: any, isVoiceMode?: boolean): string {
  const lower = prompt.toLowerCase();
  const target = context?.targetRole || 'Engineering Professional';
  const name = context?.studentProfile?.firstName || 'Student';
  const year = context?.studentProfile?.academicYear || 'Engineering';
  const branch = context?.studentProfile?.branch || 'CS/IT';
  const topGap = context?.skillGaps?.find((g: any) => String(g.priority).toUpperCase() === 'HIGH')?.skillName || 'Core Frameworks';
  const stage = context?.roadmapProgress?.currentStageName || 'Core Skills';

  if (isVoiceMode) {
    if (lower.includes('job') || lower.includes('openings') || lower.includes('microsoft') || lower.includes('google')) {
      return `I don't have live job-opening API data connected right now. You can open the official company careers page from TechPath's Opportunities page to check active openings.`;
    }
    if (lower.includes('project') || lower.includes('portfolio') || lower.includes('capstone')) {
      return `Hi ${name}! For your target role as a ${target}, I recommend building a capstone project focusing on ${topGap}. Connect a React frontend to an Express API with database persistence to prove full stack engineering capabilities to recruiters.`;
    }
    if (lower.includes('interview') || lower.includes('placement') || lower.includes('campus')) {
      return `Hello ${name}! For ${target} campus placement preparation, practice 20 medium LeetCode questions, bridge your ${topGap} skill gap, and prepare STAR method behavioral stories for your technical interviews.`;
    }
    return `Hi ${name}! You are currently at ${context?.roadmapProgress?.overallProgressPercentage || 0}% completion in your ${stage} roadmap stage. Your immediate focus is mastering ${topGap}. What specific question can I answer for you?`;
  }

  if (lower.includes('job') || lower.includes('openings') || lower.includes('vacancy') || lower.includes('hiring')) {
    if (lower.includes('microsoft')) {
      return `I don't have live Microsoft job-opening data connected right now. You can open [Microsoft's Official Careers Portal](https://careers.microsoft.com) to check current openings. TechPath also features curated verified roles on our Opportunities page!`;
    }
    if (lower.includes('google')) {
      return `I don't have live Google job-opening data connected right now. You can visit [Google's Official Careers Portal](https://careers.google.com) to check active positions. Check TechPath's Opportunities page for curated positions!`;
    }
    if (lower.includes('amazon')) {
      return `I don't have live Amazon job-opening data connected right now. You can check [Amazon Jobs](https://www.amazon.jobs) for real-time listings. Feel free to explore our Opportunities section for curated tech positions!`;
    }
    return `I don't have real-time live job-opening feeds for all company career portals connected directly to text chat. However, you can browse verified tech company opportunities and direct official career links on TechPath's **Opportunities** page!`;
  }

  if (lower.includes('project') || lower.includes('portfolio') || lower.includes('capstone')) {
    return `Hi ${name}! For an aspiring **${target}**, I strongly recommend building a production-grade project highlighting **${topGap}**.

### 🛠️ Recommended Capstone Blueprint for ${target}
1. **Frontend Architecture:** Build a modular React dashboard with clean state management and responsive Tailwind CSS.
2. **Backend Services:** Express REST APIs handling authentication, authorization, and standard CRUD workflows.
3. **Data Persistence:** Relational (Cloud SQL/PostgreSQL) or Document (Firestore) schemas with indexed foreign keys.
4. **Production Deployment:** Host on Cloud Run or Vercel with automated GitHub Actions CI/CD workflows.

This project directly proves to recruiters that you possess end-to-end full stack development capabilities!`;
  }

  if (lower.includes('interview') || lower.includes('placement') || lower.includes('campus')) {
    return `Hello ${name}! As a **${year} (${branch})** student preparing for **${target}** placements, focus on these key pillars:

1. **Problem Solving & DSA:** Solve 20-30 LeetCode medium questions covering Arrays, Trees, HashTables, and Dynamic Programming.
2. **Technical Skill Gap:** Bridge your primary gap in **${topGap}** to answer deep technical architectural questions.
3. **Project Technical Walkthrough:** Be prepared to explain system trade-offs, schema decisions, and bugs you solved in your projects.
4. **Behavioral Preparation:** Craft 3 STAR-method stories demonstrating leadership, teamwork, and learning from technical mistakes.`;
  }

  if (lower.includes('roadmap') || lower.includes('progress') || lower.includes('next')) {
    return `Great question, ${name}! Your roadmap progress currently stands at **${context?.roadmapProgress?.overallProgressPercentage || 0}%** in the **${stage}** stage.

### 🎯 Next Steps:
• Focus on mastering **${topGap}** required for ${target}.
• Complete the active roadmap step: *${context?.currentRoadmapStep?.title || topGap}*.
• Check the Resources tab on TechPath AI for hand-curated tutorials tailored to your learning preferences.`;
  }

  return `Hello ${name}! As your AI Career Mentor, I am here to guide your journey towards becoming a successful **${target}**.

Based on your student profile (**${year}, ${branch}**), your immediate technical priority is mastering **${topGap}** to advance in your **${stage}** roadmap.

Feel free to ask me about:
1. Step-by-step strategies to learn **${topGap}**
2. Capstone project ideas tailored for ${target}
3. Placement and interview preparation advice
4. Resume optimization strategies!`;
}

startServer();

