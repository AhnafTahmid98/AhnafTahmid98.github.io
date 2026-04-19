# Ahnaf Tahmid — Personal Portfolio

[![Live Site](https://img.shields.io/badge/Live_Site-ahnaftahmid98.github.io-ff5722?style=for-the-badge)](https://ahnaftahmid98.github.io)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/ahnaf-tahmid98)
[![Email](https://img.shields.io/badge/Email-ahnaftahmid40%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ahnaftahmid40@gmail.com)

> A 3D interactive portfolio built from scratch — showcasing my work in robotics, AI integration, and embedded systems.

**Live Site:** [ahnaftahmid98.github.io](https://ahnaftahmid98.github.io)

---

## About This Project

This is my personal portfolio website. I built it to go beyond a static resume — something that actually demonstrates the skills I talk about. Every 3D scene is hand-written with Three.js, the AI chatbot is powered by Claude and trained on my background, and the whole thing runs with zero frameworks or build steps.

If you're here to evaluate me for a role: I'd recommend checking out the **Robot Savo** project on the live site first — it's the most representative of the work I care about.

---

## What's Inside

- **Hero section** with an interactive 3D robot I modeled in code
- **6 unique 3D visualizations** in the skills section — neural network, robot, code blocks, mobile UI, gears, and system architecture (all draggable)
- **AI chatbot** powered by Claude Sonnet that answers visitor questions about my background
- **Ambient 3D particle field** background
- **Project showcase** with real work: Robot Savo, Savo LLM Server, Health Monitoring System
- Fully responsive across desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |

 -------|------------|
| Structure | HTML5 |
| Styling | CSS3 (custom, no frameworks) |
| 3D Graphics | Three.js (r128) |
| Interactivity | Vanilla JavaScript (ES6+) |
| AI Chatbot | Anthropic Claude API via Cloudflare Workers |
| Typography | Instrument Serif · Inter · JetBrains Mono |
| Hosting | GitHub Pages |

**Zero frameworks. Zero build step. Just the fundamentals, done well.**

---

## Project Structure

```text
.
├── index.html              # Main entry point
├── README.md               # You're reading it
├── css/
│   ├── main.css            # Layout, components, responsive design
│   └── chatbot.css         # AI chatbot panel styling
├── js/
│   ├── main.js             # Scroll reveal, 3D tilt, file uploads
│   ├── background.js       # Three.js particle field
│   ├── hero-robot.js       # Hero section 3D robot model
│   ├── skills-scenes.js    # Six 3D skill scenes
│   └── chatbot.js          # Claude-powered AI assistant
└── media/
    └── (project photos and videos)
```

I deliberately separated concerns by file — HTML handles structure, CSS handles presentation, JavaScript handles behavior. Each 3D scene lives in its own module. This makes the codebase easy to read, maintain, and extend.

---

## Running Locally

Since this is pure HTML/CSS/JS, you have options:

**Option 1 — Just open the file:**

```bash
git clone git@github.com:AhnafTahmid98/AhnafTahmid98.github.io.git
cd AhnafTahmid98.github.io
# Double-click index.html, or open it in any browser
```

**Option 2 — Local server (recommended for full features):**

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve .
```

Then visit `http://localhost:8000`.

---

## The AI Chatbot

The chatbot embedded in the bottom-right corner uses Anthropic's Claude API to answer questions about my background. To keep my API key secure, it routes through a Cloudflare Workers proxy rather than calling the API directly from the browser.

**System prompt:** Carefully engineered to only answer from verified facts about me — it refuses to fabricate details and redirects unknown questions to my email.

**Architecture:**

```text
Browser → Cloudflare Worker (proxy) → Anthropic API → Claude Sonnet → Response
```

Full setup instructions for replicating this are at the bottom of this README.

---

## Design Philosophy

A few decisions I made intentionally:

- **Dark background with a single warm accent** — orange (`#ff5722`) reserved for emphasis only, never decoration. Keeps focus on content.
- **Editorial typography** — Instrument Serif italic for headings, paired with Inter for body and JetBrains Mono for technical details. Feels more like a magazine than a template.
- **Real 3D, not static images** — because I work in robotics and AI. If my portfolio doesn't demonstrate technical depth visually, the message falls flat.
- **Subtle grain texture overlay** — adds warmth and depth without being loud.
- **No generic stock animations** — every motion serves a purpose.

---

## Deployment

Hosted on **GitHub Pages**, served directly from the `master` branch. Automatically rebuilds on push.

For future visitors interested in setting up something similar:

### GitHub Pages (what I use)

1. Create a repo named `<your-username>.github.io`
2. Push this code to the `master` branch
3. Settings → Pages → Source: `master` / `/ (root)`
4. Live in 60 seconds at `<your-username>.github.io`

### Alternative hosts

- [Netlify](https://netlify.com) — drag-and-drop the folder
- [Vercel](https://vercel.com) — import the GitHub repo
- Any static file host will work

---

## Replicating the Chatbot

If you want to build your own AI chatbot proxy:

### Setup Guide

1. **Get an Anthropic API key** at [console.anthropic.com](https://console.anthropic.com/)

2. **Create a Cloudflare Worker** at [workers.cloudflare.com](https://workers.cloudflare.com/) and paste this code:

   ```javascript
   export default {
     async fetch(request, env) {
       if (request.method === 'OPTIONS') {
         return new Response(null, {
           headers: {
             'Access-Control-Allow-Origin': '*',
             'Access-Control-Allow-Methods': 'POST',
             'Access-Control-Allow-Headers': 'Content-Type',
           },
         });
       }

       const body = await request.json();
       const response = await fetch('https://api.anthropic.com/v1/messages', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'x-api-key': env.ANTHROPIC_API_KEY,
           'anthropic-version': '2023-06-01',
         },
         body: JSON.stringify({
           model: 'claude-sonnet-4-20250514',
           max_tokens: 500,
           system: body.system,
           messages: body.messages,
         }),
       });

       const data = await response.json();
       const reply = data.content
         ?.filter(b => b.type === 'text')
         .map(b => b.text)
         .join('\n')
         .trim() || '';

       return new Response(JSON.stringify({ reply }), {
         headers: {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*',
         },
       });
     },
   };
   ```

3. In Worker Settings → Variables, add `ANTHROPIC_API_KEY` (encrypted).

4. Update `js/chatbot.js`:

   ```javascript
   const CHATBOT_ENDPOINT = "https://your-worker.your-name.workers.dev";
   ```

---

## About Me

I'm an **IoT and software engineering student** working on real-world robotics platforms — currently building **Robot Savo**, a service robot that combines ROS 2, embedded hardware, and LLM-based reasoning into a cohesive system.

I'm interested in projects where software, hardware, and intelligence come together, and I'm actively looking for opportunities in robotics engineering, embedded development, and AI-powered automation.

If you'd like to work together, the chatbot on the live site can answer most questions — or just reach out directly.

---

## Contact

| | |

|---|---|
| 📧 Email | [ahnaftahmid40@gmail.com](mailto:ahnaftahmid40@gmail.com) |
| 💼 LinkedIn | [linkedin.com/in/ahnaf-tahmid98](https://linkedin.com/in/ahnaf-tahmid98) |
| 💻 GitHub | [@AhnafTahmid98](https://github.com/AhnafTahmid98) |
| 🎥 YouTube | [Robot Savo Channel](https://www.youtube.com/channel/UC5TYaQXKLNTr_u1foifFSUA) |

---

## License

Code is open for learning and inspiration. If you use this as a starting point for your own portfolio, a star ⭐ on the repo is appreciated but not required.

Personal photos, videos, and written content are © Ahnaf Tahmid.

---

Built with ● precision · 2026
