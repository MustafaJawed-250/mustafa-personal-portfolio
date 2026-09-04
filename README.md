# Muhammad Mustafa Jawed — AI Web Developer Portfolio

Premium, modern, highly animated personal developer portfolio built with vanilla HTML, CSS & JavaScript + a secure Node.js backend for the Groq-powered AI chatbot.

## Features

- Stunning dark futuristic UI with glassmorphism & glowing accents
- Custom cursor (desktop)
- Preloader, scroll progress bar, back-to-top
- Smooth scroll-triggered reveal animations
- Typing effect in hero
- Animated skill & service cards
- Three featured projects with embedded screen-recording videos
- Floating AI chatbot that knows your entire portfolio (powered by Groq)
- Fully responsive + accessible
- Magnetic buttons & micro-interactions

## Project Structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── assets/
    ├── images/
    └── videos/
        ├── project-1.mp4   ← FORGE (AI Website Builder)
        ├── project-2.mp4   ← KINOCAST (YouTube Clone)
        └── project-3.mp4   ← AI Assistant (Chatbot)
```

## Setup Instructions

### 1. Place your project videos

Rename and move your three screen recordings into the correct folders:

| Your video file       | Place as                          |
|-----------------------|-----------------------------------|
| `forge.mp4`           | `assets/videos/project-1.mp4`     |
| `youtube clone.mp4`   | `assets/videos/project-2.mp4`     |
| `ai chatbot.mp4`      | `assets/videos/project-3.mp4`     |

### 2. Install dependencies

```bash
cd portfolio
npm install
```

### 3. Configure Groq API key

1. Create a free account at [https://console.groq.com](https://console.groq.com)
2. Generate an API key
3. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

4. Open `.env` and paste your key:

```
GROQ_API_KEY=gsk_your_actual_key_here
PORT=3000
```

### 4. Run the portfolio

```bash
npm start
```

Open **http://localhost:3000** in your browser.

## Contact Form

The contact form opens the visitor’s default email client with a pre-filled message to `mustafajawed250@gmail.com`. No backend is required for it.

## Chatbot Security

- The Groq API key **never** leaves the server.
- Rate limiting is applied (20 requests / 15 min per IP).
- Input is length-limited and sanitized.
- System prompt contains your full portfolio context so the AI answers accurately.

## Customization

- Colors → edit CSS variables at the top of `style.css`
- Content → edit the HTML sections or the `portfolioContext` string in `server.js`
- Typing phrases → edit the `phrases` array in `script.js`

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). Reduced-motion preferences are respected.

---

Built with ❤️ by Muhammad Mustafa Jawed
