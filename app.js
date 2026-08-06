/**
 * LIQUID BLUE GLASS INTERACTIVE ENGINE
 * Developer: David Adesta (terecya)
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initTeyabotSimulator();
    initTerminal();
    initTechFilters();
    initSoundEngine();
    initTiltEffect();
    initNavHighlight();
});

/* ==========================================
   1. SOUND ENGINE (Web Audio API Haptics)
   ========================================== */
let soundEnabled = true;
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playGlassBeep(freq = 600, duration = 0.08) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio fallback
    }
}

function initSoundEngine() {
    const btnSound = document.getElementById('btn-sound-toggle');
    const iconSound = document.getElementById('sound-icon');

    if (btnSound) {
        btnSound.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                iconSound.className = 'fa-solid fa-volume-high';
                playGlassBeep(800, 0.1);
            } else {
                iconSound.className = 'fa-solid fa-volume-xmark';
            }
        });
    }
}

/* ==========================================
   2. TYPEWRITER EFFECT
   ========================================== */
const typewriterPhrases = [
    "Founder of Teyabot",
    "Discord Bot Architect",
    "Full-Stack Web Engineer",
    "TypeScript & Lua Specialist",
    "Liquid Glass UI Craftsman"
];

function initTypewriter() {
    const target = document.getElementById('typewriter');
    if (!target) return;

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = typewriterPhrases[phraseIdx];
        
        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            target.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentPhrase.length) {
            speed = 2200; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % typewriterPhrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ==========================================
   3. TEYABOT INTERACTIVE DISCORD SIMULATOR
   ========================================== */
function initTeyabotSimulator() {
    const chatStream = document.getElementById('discord-chat');
    const inputField = document.getElementById('sim-input');
    const sendBtn = document.getElementById('sim-send-btn');
    const presetBtns = document.querySelectorAll('.cmd-preset-btn');
    const pingEl = document.getElementById('sim-ping');

    // Randomize ping slightly
    setInterval(() => {
        if (pingEl) {
            const currentPing = 14 + Math.floor(Math.random() * 8);
            pingEl.textContent = `${currentPing}ms`;
        }
    }, 4000);

    const botCommands = {
        '/help': {
            title: "Teyabot Command Directory",
            desc: "Available slash commands in this interactive sandbox:",
            fields: [
                { name: "🤖 /stats", value: "Display live bot uptime, cluster node, & processed requests." },
                { name: "🧘 /mindful", value: "Trigger Teyabot's daily mindfulness & habit check." },
                { name: "⚡ /ping", value: "Check WebSocket & database roundtrip latency." },
                { name: "🔮 /architecture", value: "View David Adesta's bot architecture breakdown." }
            ]
        },
        '/stats': {
            title: "Teyabot Operational Statistics",
            desc: "Current cluster node metrics running on high-concurrency Gateway v10:",
            fields: [
                { name: "Uptime", value: "99.98% (42 Days Clean)" },
                { name: "Active Shards", value: "12 Gateway Shards" },
                { name: "Commands Processed", value: "1,248,920 Requests" },
                { name: "Memory Usage", value: "142 MB / Node" }
            ]
        },
        '/mindful': {
            title: "Teyabot Mindful Routine ✨",
            desc: "\"Mindfulness isn't about clearing your thoughts, but becoming aware of them.\"",
            fields: [
                { name: "Daily Tip", value: "Take 3 deep breaths before returning to your code." },
                { name: "Habit Tracker", value: "Hydration Check: 💧 5/8 Glasses Completed" }
            ]
        },
        '/ping': {
            title: "Pong! 🏓",
            desc: "Gateway Latency Metrics:",
            fields: [
                { name: "WebSocket Latency", value: `${12 + Math.floor(Math.random() * 8)}ms` },
                { name: "API Endpoint Ping", value: `${18 + Math.floor(Math.random() * 10)}ms` }
            ]
        },
        '/architecture': {
            title: "Teyabot System Architecture",
            desc: "Engineered by **David Adesta (terecya)**:",
            fields: [
                { name: "Core Language", value: "TypeScript & Node.js 24" },
                { name: "Event Queue", value: "Redis Pub/Sub & BullMQ" },
                { name: "Database Layer", value: "PostgreSQL with Prisma ORM" },
                { name: "Scripting Engine", value: "Embedded Lua VM" }
            ]
        }
    };

    function executeCommand(cmdStr) {
        cmdStr = cmdStr.trim();
        playGlassBeep(700, 0.05);

        if (cmdStr === '/clear') {
            chatStream.innerHTML = '';
            appendBotResponse({
                title: "Console Cleared",
                desc: "Chat history has been reset. Type `/help` to see available commands."
            });
            return;
        }

        // Render User Command Msg
        appendUserMessage(cmdStr);

        // Process Bot Answer
        setTimeout(() => {
            const cmdData = botCommands[cmdStr.toLowerCase()];
            if (cmdData) {
                appendBotResponse(cmdData);
            } else {
                appendBotResponse({
                    title: "Unknown Slash Command",
                    desc: `Command \`${cmdStr}\` was not recognized in the sandbox. Type \`/help\` for list of commands.`
                });
            }
            chatStream.scrollTop = chatStream.scrollHeight;
        }, 350);
    }

    function appendUserMessage(text) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userHtml = `
            <div class="message-group user-msg">
                <div class="msg-content">
                    <div class="msg-header">
                        <span class="bot-name" style="color: #34d399;">Visitor</span>
                        <span class="user-badge">USER</span>
                        <span class="msg-time">${timeStr}</span>
                    </div>
                    <div style="color: #dcddde; font-family: var(--font-mono); font-size: 0.9rem;">
                        ${escapeHtml(text)}
                    </div>
                </div>
            </div>
        `;
        chatStream.insertAdjacentHTML('beforeend', userHtml);
    }

    function appendBotResponse(data) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let fieldsHtml = '';
        if (data.fields) {
            fieldsHtml = `
                <div class="embed-fields">
                    ${data.fields.map(f => `
                        <div class="embed-field">
                            <div class="field-name">${f.name}</div>
                            <div class="field-value">${f.value}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const botHtml = `
            <div class="message-group bot-msg">
                <img src="assets/teyabot_avatar.png" alt="Teyabot" class="msg-avatar">
                <div class="msg-content">
                    <div class="msg-header">
                        <span class="bot-name">Teyabot</span>
                        <span class="bot-badge">BOT</span>
                        <span class="msg-time">${timeStr}</span>
                    </div>
                    <div class="discord-embed">
                        <div class="embed-inner">
                            <h4 class="embed-title">${data.title}</h4>
                            <p class="embed-desc">${data.desc}</p>
                            ${fieldsHtml}
                            <div class="embed-footer">
                                <span>Teyabot Sandbox Engine • David Adesta Architecture</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        chatStream.insertAdjacentHTML('beforeend', botHtml);
    }

    // Event Handlers
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cmd = btn.getAttribute('data-cmd');
            executeCommand(cmd);
        });
    });

    if (sendBtn && inputField) {
        sendBtn.addEventListener('click', () => {
            if (inputField.value.trim()) {
                executeCommand(inputField.value);
                inputField.value = '';
            }
        });

        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && inputField.value.trim()) {
                executeCommand(inputField.value);
                inputField.value = '';
            }
        });
    }
}

/* ==========================================
   4. DEVELOPER CLI TERMINAL CONSOLE
   ========================================== */
function initTerminal() {
    const termBody = document.getElementById('terminal-body');
    const termInput = document.getElementById('term-input');
    const clearBtn = document.getElementById('term-clear-btn');

    const cliCommands = {
        'help': `
Available CLI Commands:
  - <span class="text-neon-blue">about</span>     : Display full developer bio for David Adesta.
  - <span class="text-neon-blue">skills</span>    : List core programming languages and frameworks.
  - <span class="text-neon-blue">teyabot</span>   : Show information about Teyabot ecosystem.
  - <span class="text-neon-blue">contact</span>   : Display official contact handles.
  - <span class="text-neon-blue">clear</span>     : Clear the terminal console screen.
  - <span class="text-neon-blue">sudo</span>      : Execute admin privilege simulation.
        `,
        'about': `
<span class="text-neon-green">Developer Profile:</span>
- <span class="text-neon-blue">Real Name:</span> David Adesta (David Adesta Arviansyah)
- <span class="text-neon-blue">Handle:</span> terecya (@trcya)
- <span class="text-neon-blue">Role:</span> Founder of Teyabot & Discord Bot Architect
- <span class="text-neon-blue">Location:</span> Indonesia 🇮🇩
- <span class="text-neon-blue">Focus:</span> High-concurrency Discord Bot systems, Liquid Glass UI, and TypeScript backends.
        `,
        'skills': `
<span class="text-neon-green">Technical Skills Matrix:</span>
  [Languages] : TypeScript, JavaScript, Lua, Python, PHP
  [Frontend]  : React.js, Next.js, Vanilla Glass CSS, HTML5
  [Backend]   : Node.js, Express, Prisma ORM, REST API
  [Databases] : PostgreSQL, MySQL, Redis
  [DevOps]    : Docker, Git, Vercel, Railway
        `,
        'teyabot': `
<span class="text-neon-green">Teyabot Infrastructure Overview:</span>
Teyabot is a custom high-performance bot ecosystem engineered by David Adesta.
It utilizes Redis event-driven queues, modular slash command handlers, and multi-sharded Discord connections.
        `,
        'contact': `
<span class="text-neon-green">Official Handles:</span>
- GitHub : <a href="https://github.com/trcya" target="_blank" style="color:#60a5fa;">https://github.com/trcya</a>
- Email  : david.adesta@example.com
        `,
        'sudo': `
<span style="color:#ef4444;">[PERMISSION DENIED]</span> David Adesta has root authority. Visitors are restricted to user space! 🔒
        `
    };

    function handleInput(cmd) {
        cmd = cmd.trim().toLowerCase();
        playGlassBeep(500, 0.05);

        // Echo command line
        const echoLine = document.createElement('div');
        echoLine.className = 'term-line';
        echoLine.innerHTML = `<span class="term-prompt"><span class="user">terecya</span>@<span class="host">system</span>:<span class="path">~</span>$</span> ${escapeHtml(cmd)}`;
        termBody.appendChild(echoLine);

        if (cmd === 'clear') {
            termBody.innerHTML = '';
            return;
        }

        const responseDiv = document.createElement('div');
        responseDiv.className = 'term-line output';

        if (cliCommands[cmd]) {
            responseDiv.innerHTML = cliCommands[cmd].trim();
        } else if (cmd === '') {
            return;
        } else {
            responseDiv.innerHTML = `<span style="color:#ef4444;">zsh: command not found: ${escapeHtml(cmd)}</span>. Type '<span class="text-neon-green">help</span>' for available options.`;
        }

        termBody.appendChild(responseDiv);
        termBody.scrollTop = termBody.scrollHeight;
    }

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleInput(termInput.value);
                termInput.value = '';
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            termBody.innerHTML = '';
            playGlassBeep(400, 0.05);
        });
    }
}

/* ==========================================
   5. TECH MATRIX FILTERING
   ========================================== */
function initTechFilters() {
    const filterBtns = document.querySelectorAll('#tech-filter-group .filter-btn');
    const techCards = document.querySelectorAll('#tech-matrix .tech-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playGlassBeep(650, 0.04);
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            techCards.forEach(card => {
                const cat = card.getAttribute('data-cat');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

/* ==========================================
   6. GLASS TILT EFFECT
   ========================================== */
function initTiltEffect() {
    const heroCard = document.getElementById('hero-main-card');
    if (!heroCard) return;

    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

/* ==========================================
   7. NAV LINK ACTIVE HIGHLIGHT ON SCROLL
   ========================================== */
function initNavHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Utility
function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
