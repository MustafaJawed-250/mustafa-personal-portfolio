/**
 * Secure Express server for the portfolio AI chatbot.
 * Keeps the Groq API key server-side only.
 * Includes rate limiting and input sanitization.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors({ origin: true })); // Restrict in production if needed
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname)));

// Rate limit: 20 requests per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ---------- Portfolio context for the AI ----------
const portfolioContext = `
You are the AI assistant embedded in Muhammad Mustafa Jawed's personal portfolio website.
Your name is "Mustafa's AI Assistant". Be friendly, professional, concise, and helpful.
Answer questions about Mustafa, his skills, projects, and how to contact him.
Never invent information. If you don't know something, say so politely.
Keep responses under 120 words unless the user asks for more detail.

=== ABOUT MUSTAFA ===
Full Name: Muhammad Mustafa Jawed
Age: 15 years old
Title: AI Web Developer
Location: Focused on building modern, AI-powered web experiences.

Short Intro:
I'm Muhammad Mustafa Jawed, a young AI Web Developer passionate about building modern websites and integrating artificial intelligence into real-world web experiences. I love combining web development, creative design, and AI to build smart and interactive digital products.

About Me:
I'm Muhammad Mustafa Jawed, a 15-year-old AI Web Developer with a strong passion for web development, artificial intelligence, and building innovative digital experiences. I started my development journey by learning the fundamentals of HTML, CSS, and JavaScript and gradually moved toward building more advanced and interactive web applications.

What interests me most about development is the combination of web development and artificial intelligence. I enjoy integrating AI into websites to make them smarter, more interactive, and more useful. Whether it is an AI chatbot, an AI-powered website builder, or connecting AI APIs to a web application, I love experimenting with new possibilities.

I learn primarily by building real projects. Instead of only learning theory, I like taking an idea and turning it into an actual working website. Through my projects, I have explored frontend development, APIs, backend development, databases, authentication, AI integrations, and responsive UI design.

My goal is to continue improving as an AI Web Developer and eventually build advanced AI-powered products that solve real problems.

=== SKILLS ===
Frontend: HTML5, CSS3, JavaScript, Bootstrap, Responsive Web Design
Backend: Node.js, Express.js
Databases: PostgreSQL, Supabase
APIs & AI: REST APIs, API Integration, AI Integration, Groq API
Tools: Git, GitHub
Other: Frontend Development, Backend Development, Database Integration

=== SERVICES ===
- AI-Powered Web Development
- Frontend Web Development
- Responsive Website Development
- AI API Integration
- Interactive Web Applications
- Landing Page Development
- Backend Development with Node.js & Express.js
- Database Integration
- AI Chatbot Integration

=== PROJECTS ===
1. FORGE — AI Website Builder
   An AI-powered website builder that turns natural language prompts into complete, functional websites.
   Technologies: HTML, CSS, JavaScript, AI APIs, Groq
   Features: Prompt-to-website generation, live preview, responsive output, modern UI.
   Role: Solo Developer

2. KINOCAST — YouTube Clone
   A full-featured YouTube clone with video browsing, search, and playback experience.
   Technologies: HTML, CSS, JavaScript, YouTube Data API, Backend API routes
   Features: Video search, video playback, modern video interface, responsive design.
   Role: Solo Developer

3. AI Assistant — AI Chatbot
   An interactive AI chatbot that supports natural conversations in multiple languages.
   Technologies: HTML, CSS, JavaScript, Groq API, REST API
   Features: AI-powered conversations, modern chat UI, message history, multi-language support.
   Role: Solo Developer

=== CONTACT ===
Email: mustafajawed250@gmail.com
GitHub: https://github.com/MustafaJawed-250
LinkedIn: https://www.linkedin.com/in/mustafa-jawed-a66b63400/
Instagram: https://www.instagram.com/mustafajawed_/

When users ask how to contact Mustafa, always provide the email and social links.
Encourage them to reach out for collaborations or freelance work.
`;

// ---------- Chat endpoint ----------
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 characters).' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error. API key missing.' });
    }

    // Build messages array for Groq
    const messages = [
      { role: 'system', content: portfolioContext },
      ...history.slice(-8).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: String(h.content).slice(0, 1000)
      })),
      { role: 'user', content: message.trim() }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages,
        temperature: 0.7,
        max_tokens: 400,
        stream: false
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, errData);
      return res.status(502).json({ error: 'AI service temporarily unavailable. Please try again.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// ---------- Fallback for SPA ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio server running at http://localhost:${PORT}`);
  console.log(`   Chatbot endpoint: POST /api/chat\n`);
});
