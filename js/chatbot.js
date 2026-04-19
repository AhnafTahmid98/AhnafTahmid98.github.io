// ═══════════════════════════════════════════
// AI Chatbot
// ═══════════════════════════════════════════

// IMPORTANT: For the chatbot to work on your live website, set up a backend proxy.
// See README.md for full setup instructions (Cloudflare Workers guide).
// Replace this URL with your backend endpoint:

const CHATBOT_ENDPOINT = "YOUR_BACKEND_URL_HERE"; // e.g., "https://your-worker.your-name.workers.dev"

const AHNAF_CONTEXT = `You are an AI assistant on Ahnaf Tahmid's professional portfolio website. Your job is to answer questions about Ahnaf accurately and warmly. Be concise (2-4 sentences usually). Use HTML <strong> for emphasis when helpful. Never make up information not in the facts below — if asked something you don't know, say so politely and direct them to email Ahnaf at ahnaftahmid40@gmail.com.

FACTS ABOUT AHNAF TAHMID:

IDENTITY:
- Name: Ahnaf Tahmid
- Role: IoT and Software Engineering student
- Education: BSc in Internet of Things at Savonia University of Applied Sciences (2023 – Present)
- Status: Open to internships, thesis collaborations, and engineering roles
- Email: ahnaftahmid40@gmail.com
- Phone: +358 413 122 956
- GitHub: github.com/AhnafTahmid98
- LinkedIn: linkedin.com/in/ahnaf-tahmid98

PROFESSIONAL SUMMARY:
Ahnaf is a hands-on engineer focused on building intelligent real-world systems where ROS 2 robotics, LLM integration, and embedded hardware come together. Interested in GenAI, chatbot systems, intelligent interfaces, and prototype development.

SKILLS:
- Programming: Python, C++, C, Kotlin, Dart, JavaScript, SQL
- AI/Software: LLM Integration, Prompt Engineering, Conversational AI, Intent Routing, FastAPI, REST APIs, Docker, STT/TTS pipelines
- Robotics/Embedded: ROS 2, Raspberry Pi, sensor integration, motor control, GPS/IMU, telemetry, real-hardware testing
- Mobile: Flutter, Android, Jetpack Compose
- Tools: Git, GitHub, Linux, VS Code, MQTT, SQLite

PROJECTS:
1. ROBOT SAVO — Intelligent robotics platform (Python, C++, ROS 2, FastAPI, Docker, LLM, STT/TTS). Real-world service robot with end-to-end STT → LLM → TTS pipeline, modular server architecture, prompt-engineered behavior.
2. SAVO LLM SERVER — Python, FastAPI, Docker, LLM, Prompt Engineering. AI backend powering Robot Savo with intelligent response generation, navigation reasoning, and session management.
3. HEALTH MONITORING SYSTEM — Raspberry Pi, Flutter, REST APIs, MQTT, SQLite. Connected mobile system for patient sensor data.
4. STUDYBUDDY PLANNER — Kotlin, Jetpack Compose Android app.

GOALS: Grow as an engineer in robotics, embedded systems, AI-powered automation, intelligent backend systems.

INSTRUCTIONS:
- Refer to him as "Ahnaf" or "he" naturally
- If unsure: "I don't have that info — best to email Ahnaf directly at ahnaftahmid40@gmail.com."
- Don't invent details
- Use simple HTML: <strong>, <br>. No markdown.`;

const chatFab = document.getElementById('chatFab');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatSuggestions = document.getElementById('chatSuggestions');
const conversationHistory = [];

function toggleChat() {
  const isOpen = chatPanel.classList.toggle('open');
  chatFab.classList.toggle('open', isOpen);
  if (isOpen) setTimeout(() => chatInput.focus(), 300);
}

chatFab.addEventListener('click', toggleChat);
chatClose.addEventListener('click', toggleChat);

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
});

chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = text;
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="msg-bubble" style="padding:0"><div class="typing"><span></span><span></span><span></span></div></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

async function sendMessage(text) {
  if (!text.trim()) return;
  chatSuggestions.style.display = 'none';
  addMessage(text.replace(/</g, '&lt;'), 'user');
  conversationHistory.push({ role: 'user', content: text });
  chatInput.value = '';
  chatInput.style.height = 'auto';
  chatSend.disabled = true;
  showTyping();

  // If backend not configured, show fallback
  if (CHATBOT_ENDPOINT === "YOUR_BACKEND_URL_HERE") {
    setTimeout(() => {
      hideTyping();
      addMessage(`⚠️ The chatbot backend isn't set up yet. To enable it, follow the setup guide in <strong>README.md</strong>. In the meantime, you can reach Ahnaf directly at <a href="mailto:ahnaftahmid40@gmail.com">ahnaftahmid40@gmail.com</a>`, 'bot');
      chatSend.disabled = false;
      chatInput.focus();
    }, 800);
    return;
  }

  try {
    const response = await fetch(CHATBOT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: AHNAF_CONTEXT,
        messages: conversationHistory
      })
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    const data = await response.json();
    const reply = data.reply || data.content || '';
    hideTyping();
    if (reply) {
      addMessage(reply, 'bot');
      conversationHistory.push({ role: 'assistant', content: reply });
    } else {
      addMessage("Hmm, I didn't get a reply. Try asking again!", 'bot');
    }
  } catch (err) {
    hideTyping();
    addMessage(`I'm having trouble connecting right now. Please email Ahnaf directly at <a href="mailto:ahnaftahmid40@gmail.com">ahnaftahmid40@gmail.com</a>`, 'bot');
    console.error(err);
  }
  chatSend.disabled = false;
  chatInput.focus();
}

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  sendMessage(chatInput.value);
});

chatSuggestions.querySelectorAll('.sugg').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q));
});
