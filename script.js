// DOM Elements
const quoteBox = document.getElementById("quoteBox");
const generateBtn = document.getElementById("generateBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const printBtn = document.getElementById("printBtn");
const themeSwitcher = document.getElementById("themeSwitcher");
const favoritesModal = document.getElementById("favoritesModal");
const closeFavorites = document.getElementById("closeFavorites");
const favoritesList = document.getElementById("favoritesList");
const openFavorites = document.getElementById("openFavorites");
const exportFavorites = document.getElementById("exportFavorites");
const importFavorites = document.getElementById("importFavorites");
const importFile = document.getElementById("importFile");
const clearFavorites = document.getElementById("clearFavorites");
const helpModal = document.getElementById("helpModal");
const openHelp = document.getElementById("openHelp");
const closeHelp = document.getElementById("closeHelp");
const closeHelpBtn = document.getElementById("closeHelpBtn");
const openCredits = document.getElementById("openCredits");
const creditsModal = document.getElementById("creditsModal");
const closeCredits = document.getElementById("closeCredits");
const closeCreditsBtn = document.getElementById("closeCreditsBtn");
const settingsModal = document.getElementById("settingsModal");
const openSettings = document.getElementById("openSettings");
const closeSettings = document.getElementById("closeSettings");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const soundToggle = document.getElementById("soundToggle");
const animationToggle = document.getElementById("animationToggle");
const bgCanvas = document.getElementById("bgCanvas");

// State
const usedQuotes = new Set();
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let eggCount = 0;

// Quote data
const verbs = ["believe", "push", "embrace", "chase", "face", "conquer", "ignite", "build", "create", "explore", "discover", "overcome", "inspire", "lead", "grow", "shine", "persist", "rise", "dream", "achieve"];
const adjectives = ["fearless", "strong", "brave", "limitless", "unstoppable", "resilient", "bold", "passionate", "relentless", "hopeful", "courageous", "determined", "radiant", "focused", "confident", "optimistic", "dedicated", "ambitious", "grateful", "resourceful"];
const nouns = ["dreams", "goals", "future", "path", "journey", "vision", "mission", "purpose", "destiny", "potential", "success", "challenge", "mountain", "horizon", "possibility", "opportunity", "legacy", "story", "adventure", "moment"];
const endings = [
  "with everything you've got.",
  "and never look back.",
  "like nothing can stop you.",
  "until it becomes reality.",
  "and create your own destiny.",
  "because you are enough.",
  "and let your light shine.",
  "with courage in your heart.",
  "and inspire those around you.",
  "because greatness awaits.",
  "and make every moment count.",
  "with hope and determination.",
  "and write your own story.",
  "with passion and purpose.",
  "and break every limit.",
  "and turn dreams into action.",
  "with gratitude and grace.",
  "and embrace the unknown.",
  "with relentless optimism.",
  "and leave a mark on the world."
];
const extraQuotes = [
  "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Act as if what you do makes a difference. It does. – William James",
  "Keep your face always toward the sunshine—and shadows will fall behind you. – Walt Whitman",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. – Ralph Waldo Emerson",
  "The best way to get started is to quit talking and begin doing. – Walt Disney",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "Everything you've ever wanted is on the other side of fear. – George Addair"
];

// Initialize
(function() {
  // Animated Background
  const ctx = bgCanvas.getContext('2d');
  let particles = [];
  
  function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  
  function createParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7,
        color: `rgba(34,166,179,${Math.random() * 0.5 + 0.2})`
      });
    }
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > bgCanvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > bgCanvas.height) p.dy *= -1;
    }
    requestAnimationFrame(animateParticles);
  }
  
  resizeCanvas();
  createParticles();
  animateParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // Theme
  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeSwitcher.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  
  themeSwitcher.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
  });
  
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme === 'dark');

  // Settings
  soundToggle.checked = JSON.parse(localStorage.getItem('soundOn') || 'false');
  soundToggle.addEventListener('change', () => {
    localStorage.setItem('soundOn', soundToggle.checked);
  });
  
  animationToggle.checked = JSON.parse(localStorage.getItem('animOn') || 'true');
  animationToggle.addEventListener('change', () => {
    localStorage.setItem('animOn', animationToggle.checked);
  });

  // Initial UI state
  animateQuote("Click the button to generate motivation!");
  moveButtonRandomly();
  if (window.innerWidth < 600) quoteBox.style.fontSize = '1.1rem';
})();

// Quote generation
function generateQuote() {
  let quote;
  if (Math.random() < 0.2) {
    quote = extraQuotes[Math.floor(Math.random() * extraQuotes.length)];
  } else {
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const end = endings[Math.floor(Math.random() * endings.length)];
    quote = `Always ${verb} like a ${adj} soul chasing ${noun} ${end}`;
  }
  
  let attempts = 0;
  while (usedQuotes.has(quote) && attempts < 100) {
    quote = generateQuote();
    attempts++;
  }
  
  usedQuotes.add(quote);
  return quote;
}

function animateQuote(newQuote) {
  if (!animationToggle.checked) {
    quoteBox.textContent = newQuote;
    return;
  }
  quoteBox.style.opacity = 0;
  setTimeout(() => {
    quoteBox.textContent = newQuote;
    quoteBox.style.opacity = 1;
  }, 350);
}

// Button movement
function moveButtonRandomly() {
  const btn = generateBtn;
  const pad = 20;
  const maxX = window.innerWidth - btn.offsetWidth - pad;
  const maxY = window.innerHeight - btn.offsetHeight - pad - 80;
  let x, y, tries = 0;
  
  do {
    x = Math.random() * maxX + pad;
    y = Math.random() * maxY + pad;
    tries++;
  } while (
    Math.abs(x - btn.offsetLeft) < 60 &&
    Math.abs(y - btn.offsetTop) < 60 &&
    tries < 10
  );
  
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
}

// Sound effect
let audioCtx, beep;
function playSound() {
  if (!soundToggle.checked) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  beep = audioCtx.createOscillator();
  beep.type = 'triangle';
  beep.frequency.value = 660;
  beep.connect(audioCtx.destination);
  beep.start();
  setTimeout(() => beep.stop(), 120);
}

// Favorites
function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function renderFavorites() {
  favoritesList.innerHTML = '';
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<li style="color:#888;">No favorites yet.</li>';
    return;
  }
  
  favorites.forEach((q, i) => {
    const li = document.createElement('li');
    li.style.marginBottom = '12px';
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.innerHTML = `<span style="flex:1;">${q}</span>
      <button aria-label="Copy" style="margin-left:8px;font-size:1.1rem;">📋</button>
      <button aria-label="Delete" style="margin-left:8px;font-size:1.1rem;color:#e74c3c;">🗑️</button>`;
    
    li.querySelectorAll('button')[0].onclick = () => {
      navigator.clipboard.writeText(q);
    };
    
    li.querySelectorAll('button')[1].onclick = () => {
      favorites.splice(i, 1);
      saveFavorites();
      renderFavorites();
    };
    
    favoritesList.appendChild(li);
  });
}

// Event listeners
generateBtn.addEventListener("click", () => {
  const newQuote = generateQuote();
  animateQuote(newQuote);
  playSound();
  moveButtonRandomly();
  generateBtn.classList.add('animated');
});

generateBtn.addEventListener('animationend', () => {
  generateBtn.classList.remove('animated');
});

favoriteBtn.addEventListener('click', () => {
  const quote = quoteBox.textContent;
  if (!favorites.includes(quote)) {
    favorites.push(quote);
    saveFavorites();
    favoriteBtn.textContent = '💛';
    setTimeout(() => favoriteBtn.textContent = '⭐', 800);
  }
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(quoteBox.textContent);
  copyBtn.textContent = '✅';
  setTimeout(() => copyBtn.textContent = '📋', 800);
});

shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    await navigator.share({text: quoteBox.textContent});
  } else {
    alert('Sharing not supported on this browser.');
  }
});

printBtn.addEventListener('click', () => {
  const w = window.open('', '', 'width=600,height=400');
  w.document.write(`<pre style="font-size:1.5rem;font-family:Montserrat,sans-serif;padding:2em;">${quoteBox.textContent}</pre>`);
  w.print();
  w.close();
});

openFavorites.addEventListener('click', e => {
  e.preventDefault();
  renderFavorites();
  favoritesModal.style.display = 'flex';
  favoritesModal.focus();
});

closeFavorites.addEventListener('click', () => favoritesModal.style.display = 'none');

exportFavorites.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(favorites, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'favorites.json';
  a.click();
  URL.revokeObjectURL(url);
});

importFavorites.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const arr = JSON.parse(evt.target.result);
      if (Array.isArray(arr)) {
        favorites = arr;
        saveFavorites();
        renderFavorites();
      }
    } catch {}
  };
  reader.readAsText(file);
});

clearFavorites.addEventListener('click', () => {
  if (confirm('Clear all favorites?')) {
    favorites = [];
    saveFavorites();
    renderFavorites();
  }
});

openHelp.addEventListener('click', e => {
  e.preventDefault();
  helpModal.style.display = 'flex';
  helpModal.focus();
});

closeHelp.addEventListener('click', () => helpModal.style.display = 'none');
closeHelpBtn.addEventListener('click', () => helpModal.style.display = 'none');

openCredits.addEventListener('click', () => {
  creditsModal.style.display = 'flex';
  creditsModal.focus();
});

closeCredits.addEventListener('click', () => creditsModal.style.display = 'none');
closeCreditsBtn.addEventListener('click', () => creditsModal.style.display = 'none');

openSettings.addEventListener('click', e => {
  e.preventDefault();
  settingsModal.style.display = 'flex';
  settingsModal.focus();
});

closeSettings.addEventListener('click', () => settingsModal.style.display = 'none');
closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'f' && e.ctrlKey) {
    openFavorites.click();
    e.preventDefault();
  }
  if (e.key === 'h' && e.ctrlKey) {
    openHelp.click();
    e.preventDefault();
  }
  if (e.key === 's' && e.ctrlKey) {
    openSettings.click();
    e.preventDefault();
  }
  if (e.key === 'n' && e.ctrlKey) {
    generateBtn.click();
    e.preventDefault();
  }
  if (e.key === 'Escape') {
    [favoritesModal, helpModal, creditsModal, settingsModal].forEach(modal => {
      if (modal.style.display === 'flex') modal.style.display = 'none';
    });
  }
});

// Accessibility
[generateBtn, favoriteBtn, copyBtn, shareBtn, printBtn, themeSwitcher].forEach(el => {
  el.tabIndex = 0;
});

[openFavorites, openHelp, openSettings].forEach(el => {
  el.tabIndex = 0;
});

[favoritesModal, helpModal, creditsModal, settingsModal].forEach(modal => {
  modal.setAttribute('aria-hidden', 'true');
  modal.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [tabindex="0"]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
});

// Easter Egg
quoteBox.addEventListener('dblclick', () => {
  eggCount++;
  if (eggCount === 5) {
    animateQuote("🎉 You found the secret! Keep shining. 🎉");
    eggCount = 0;
  }
});

// Responsive improvements
// --- AI Quote Generation using OpenAI API (replace with your API key) ---
async function fetchAIQuote() {
    // You must provide your own OpenAI API key below for this to work
    const apiKey = 'YOUR_OPENAI_API_KEY'; // <-- Replace with your key
    const prompt = "Write a short, original, motivational quote (max 25 words).";
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: prompt}],
                max_tokens: 60,
                temperature: 0.9
            })
        });
        const data = await response.json();
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content.trim();
        }
        return null;
    } catch (e) {
        return null;
    }
}

// Override generateQuote to use AI
async function generateQuote() {
    let quote = await fetchAIQuote();
    if (!quote) {
        // fallback to local generation if API fails
        if (Math.random() < 0.2) {
            quote = extraQuotes[Math.floor(Math.random() * extraQuotes.length)];
        } else {
            const verb = verbs[Math.floor(Math.random() * verbs.length)];
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const end = endings[Math.floor(Math.random() * endings.length)];
            quote = `Always ${verb} like a ${adj} soul chasing ${noun} ${end}`;
        }
    }
    let attempts = 0;
    while (usedQuotes.has(quote) && attempts < 100) {
        quote = await generateQuote();
        attempts++;
    }
    usedQuotes.add(quote);
    return quote;
}

// Update event handler for generateBtn to handle async
generateBtn.addEventListener("click", async () => {
    animateQuote("Generating...");
    const newQuote = await generateQuote();
    animateQuote(newQuote);
    playSound();
    moveButtonRandomly();
    generateBtn.classList.add('animated');
});

// Responsive font size
window.addEventListener('resize', () => {
    if (window.innerWidth < 600) {
        quoteBox.style.fontSize = '1.1rem';
    } else {
        quoteBox.style.fontSize = '1.7rem';
    }
});
window.dispatchEvent(new Event('resize'));

// --- Improved Styles ---
document.body.style.background = "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)";
document.body.style.fontFamily = "'Montserrat', 'Segoe UI', Arial, sans-serif";
document.body.style.margin = "0";
document.body.style.minHeight = "100vh";
quoteBox.style.background = "rgba(255,255,255,0.85)";
quoteBox.style.borderRadius = "18px";
quoteBox.style.boxShadow = "0 4px 24px rgba(34,166,179,0.12)";
quoteBox.style.padding = "2.2em 1.5em";
quoteBox.style.margin = "2em auto";
quoteBox.style.maxWidth = "600px";
quoteBox.style.transition = "background 0.3s, box-shadow 0.3s";
quoteBox.style.fontWeight = "500";
quoteBox.style.letterSpacing = "0.01em";
quoteBox.style.color = "#222";
generateBtn.style.background = "linear-gradient(90deg,#22a6b3 60%,#6dd5ed 100%)";
generateBtn.style.color = "#fff";
generateBtn.style.border = "none";
generateBtn.style.borderRadius = "50px";
generateBtn.style.padding = "0.9em 2.2em";
generateBtn.style.fontSize = "1.2rem";
generateBtn.style.boxShadow = "0 2px 12px rgba(34,166,179,0.15)";
generateBtn.style.cursor = "pointer";
generateBtn.style.transition = "background 0.2s, transform 0.2s";
generateBtn.onmouseover = () => generateBtn.style.transform = "scale(1.06)";
generateBtn.onmouseout = () => generateBtn.style.transform = "scale(1)";
favoriteBtn.style.background = "none";
favoriteBtn.style.border = "none";
favoriteBtn.style.fontSize = "1.5rem";
favoriteBtn.style.cursor = "pointer";
favoriteBtn.style.marginLeft = "0.5em";
copyBtn.style.background = "none";
copyBtn.style.border = "none";
copyBtn.style.fontSize = "1.5rem";
copyBtn.style.cursor = "pointer";
copyBtn.style.marginLeft = "0.5em";
shareBtn.style.background = "none";
shareBtn.style.border = "none";
shareBtn.style.fontSize = "1.5rem";
shareBtn.style.cursor = "pointer";
shareBtn.style.marginLeft = "0.5em";
printBtn.style.background = "none";
printBtn.style.border = "none";
printBtn.style.fontSize = "1.5rem";
printBtn.style.cursor = "pointer";
printBtn.style.marginLeft = "0.5em";
themeSwitcher.style.background = "none";
themeSwitcher.style.border = "none";
themeSwitcher.style.fontSize = "1.5rem";
themeSwitcher.style.cursor = "pointer";
themeSwitcher.style.marginLeft = "0.5em";
// Add subtle hover/focus effect for theme switcher for better UX
themeSwitcher.onmouseover = () => themeSwitcher.style.transform = "scale(1.12)";
themeSwitcher.onmouseout = () => themeSwitcher.style.transform = "scale(1)";
themeSwitcher.onfocus = () => themeSwitcher.style.boxShadow = "0 0 0 2px #22a6b355";
themeSwitcher.onblur = () => themeSwitcher.style.boxShadow = "none";

// --- Enhanced Features and Upgrades ---

// 1. Motivational Quote History
let quoteHistory = JSON.parse(localStorage.getItem('quoteHistory') || '[]');
const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const closeHistory = document.getElementById("closeHistory");
const historyList = document.getElementById("historyList");

function saveQuoteToHistory(quote) {
    if (!quoteHistory.includes(quote)) {
        quoteHistory.unshift(quote);
        if (quoteHistory.length > 50) quoteHistory.pop();
        localStorage.setItem('quoteHistory', JSON.stringify(quoteHistory));
    }
}

function renderHistory() {
    historyList.innerHTML = '';
    if (quoteHistory.length === 0) {
        historyList.innerHTML = '<li style="color:#888;">No quote history yet.</li>';
        return;
    }
    quoteHistory.forEach((q, i) => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.innerHTML = `<span style="flex:1;">${q}</span>
            <button aria-label="Copy" style="margin-left:8px;font-size:1.1rem;">📋</button>
            <button aria-label="Favorite" style="margin-left:8px;font-size:1.1rem;color:#f1c40f;">⭐</button>`;
        li.querySelectorAll('button')[0].onclick = () => {
            navigator.clipboard.writeText(q);
        };
        li.querySelectorAll('button')[1].onclick = () => {
            if (!favorites.includes(q)) {
                favorites.push(q);
                saveFavorites();
                renderFavorites();
            }
        };
        historyList.appendChild(li);
    });
}

historyBtn.addEventListener('click', e => {
    e.preventDefault();
    renderHistory();
    historyModal.style.display = 'flex';
    historyModal.focus();
});
closeHistory.addEventListener('click', () => historyModal.style.display = 'none');

// 2. Daily Quote Feature
const dailyQuoteBox = document.getElementById("dailyQuoteBox");
function setDailyQuote() {
    let today = new Date().toISOString().slice(0, 10);
    let stored = JSON.parse(localStorage.getItem('dailyQuote') || '{}');
    if (stored.date !== today) {
        let quote;
        if (Math.random() < 0.5) {
            quote = extraQuotes[Math.floor(Math.random() * extraQuotes.length)];
        } else {
            const verb = verbs[Math.floor(Math.random() * verbs.length)];
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const end = endings[Math.floor(Math.random() * endings.length)];
            quote = `Always ${verb} like a ${adj} soul chasing ${noun} ${end}`;
        }
        stored = { date: today, quote };
        localStorage.setItem('dailyQuote', JSON.stringify(stored));
    }
    dailyQuoteBox.textContent = stored.quote;
}
setDailyQuote();

// 3. Search Quotes in Favorites and History
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!query) return;
    let found = [];
    found = favorites.filter(q => q.toLowerCase().includes(query));
    found = found.concat(quoteHistory.filter(q => q.toLowerCase().includes(query) && !favorites.includes(q)));
    if (found.length === 0) {
        searchResults.innerHTML = '<li style="color:#888;">No results found.</li>';
        return;
    }
    found.forEach(q => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        li.innerHTML = `<span>${q}</span>`;
        searchResults.appendChild(li);
    });
});

// 4. Randomize Theme Colors
const colorThemes = [
    {bg: "#e0eafc", fg: "#22a6b3"},
    {bg: "#fceabb", fg: "#f8b500"},
    {bg: "#f5f7fa", fg: "#36d1c4"},
    {bg: "#f8ffae", fg: "#43cea2"},
    {bg: "#f9f9f9", fg: "#e17055"}
];
const randomThemeBtn = document.getElementById("randomThemeBtn");
randomThemeBtn.addEventListener('click', () => {
    const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
    document.body.style.background = `linear-gradient(135deg, ${theme.bg} 0%, ${theme.fg} 100%)`;
    quoteBox.style.boxShadow = `0 4px 24px ${theme.fg}33`;
    generateBtn.style.background = `linear-gradient(90deg,${theme.fg} 60%,${theme.bg} 100%)`;
});

// 5. Export/Import All Data (Favorites + History)
const exportAllBtn = document.getElementById("exportAllBtn");
const importAllBtn = document.getElementById("importAllBtn");
const importAllFile = document.getElementById("importAllFile");

exportAllBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({
        favorites,
        quoteHistory
    }, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motivation-data.json';
    a.click();
    URL.revokeObjectURL(url);
});

importAllBtn.addEventListener('click', () => importAllFile.click());
importAllFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const obj = JSON.parse(evt.target.result);
            if (Array.isArray(obj.favorites) && Array.isArray(obj.quoteHistory)) {
                favorites = obj.favorites;
                quoteHistory = obj.quoteHistory;
                saveFavorites();
                localStorage.setItem('quoteHistory', JSON.stringify(quoteHistory));
                renderFavorites();
                renderHistory();
            }
        } catch {}
    };
    reader.readAsText(file);
});

// 6. Keyboard Shortcuts Help Modal
const shortcutsBtn = document.getElementById("shortcutsBtn");
const shortcutsModal = document.getElementById("shortcutsModal");
const closeShortcuts = document.getElementById("closeShortcuts");
shortcutsBtn.addEventListener('click', () => {
    shortcutsModal.style.display = 'flex';
    shortcutsModal.focus();
});
closeShortcuts.addEventListener('click', () => shortcutsModal.style.display = 'none');

// 7. Improved Accessibility for Modals
[historyModal, shortcutsModal].forEach(modal => {
    modal.setAttribute('aria-hidden', 'true');
    modal.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll('button, [tabindex="0"]');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                last.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    });
});

// 8. Save quote to history on generation
async function enhancedGenerateQuote() {
    animateQuote("Generating...");
    const newQuote = await generateQuote();
    animateQuote(newQuote);
    playSound();
    moveButtonRandomly();
    generateBtn.classList.add('animated');
    saveQuoteToHistory(newQuote);
}
generateBtn.removeEventListener("click", async () => {}); // Remove previous if any
generateBtn.addEventListener("click", enhancedGenerateQuote);

// 9. Motivational Progress Bar (shows how many quotes generated today)
const progressBar = document.getElementById("progressBar");
function updateProgressBar() {
    let today = new Date().toISOString().slice(0, 10);
    let count = JSON.parse(localStorage.getItem('quotesToday') || '{}');
    if (count.date !== today) {
        count = { date: today, n: 0 };
    }
    progressBar.value = count.n;
    progressBar.max = 10;
    progressBar.title = `${count.n}/10 quotes generated today`;
}
function incrementProgressBar() {
    let today = new Date().toISOString().slice(0, 10);
    let count = JSON.parse(localStorage.getItem('quotesToday') || '{}');
    if (count.date !== today) {
        count = { date: today, n: 0 };
    }
    count.n++;
    if (count.n > 10) count.n = 10;
    localStorage.setItem('quotesToday', JSON.stringify(count));
    updateProgressBar();
}
generateBtn.addEventListener("click", incrementProgressBar);
updateProgressBar();

// 10. Fun: Confetti Animation on 10th Quote of the Day
function launchConfetti() {
    const confettiColors = ['#22a6b3', '#f8b500', '#43cea2', '#e17055', '#f1c40f'];
    for (let i = 0; i < 80; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'fixed';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.top = '-30px';
        conf.style.width = '8px';
        conf.style.height = '18px';
        conf.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        conf.style.opacity = 0.7;
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        conf.style.zIndex = 9999;
        document.body.appendChild(conf);
        setTimeout(() => {
            conf.style.transition = 'top 1.8s cubic-bezier(.23,1.01,.32,1)';
            conf.style.top = (window.innerHeight + 40) + 'px';
        }, 10);
        setTimeout(() => conf.remove(), 2000);
    }
}
generateBtn.addEventListener("click", () => {
    let today = new Date().toISOString().slice(0, 10);
    let count = JSON.parse(localStorage.getItem('quotesToday') || '{}');
    if (count.date === today && count.n === 10) {
        launchConfetti();
    }
});

// 11. Tooltip Helper for Buttons
function addTooltip(el, text) {
    el.setAttribute('title', text);
}
addTooltip(generateBtn, "Generate a new motivational quote (Ctrl+N)");
addTooltip(favoriteBtn, "Add current quote to favorites");
addTooltip(copyBtn, "Copy current quote");
addTooltip(shareBtn, "Share current quote");
addTooltip(printBtn, "Print current quote");
addTooltip(themeSwitcher, "Switch theme");

// 12. Auto-focus search input when opening search modal
const openSearch = document.getElementById("openSearch");
const searchModal = document.getElementById("searchModal");
const closeSearch = document.getElementById("closeSearch");
openSearch.addEventListener('click', () => {
    searchModal.style.display = 'flex';
    setTimeout(() => searchInput.focus(), 100);
});
closeSearch.addEventListener('click', () => searchModal.style.display = 'none');

// 13. Keyboard shortcut for search (Ctrl+F)
document.addEventListener('keydown', e => {
    if (e.key === 'f' && e.ctrlKey && !e.shiftKey) {
        openSearch.click();
        e.preventDefault();
    }
});

// 14. Responsive improvements for new elements
window.addEventListener('resize', () => {
    if (window.innerWidth < 600) {
        if (dailyQuoteBox) dailyQuoteBox.style.fontSize = '1rem';
        if (searchInput) searchInput.style.fontSize = '1rem';
    } else {
        if (dailyQuoteBox) dailyQuoteBox.style.fontSize = '1.3rem';
        if (searchInput) searchInput.style.fontSize = '1.1rem';
    }
});
window.dispatchEvent(new Event('resize'));

// --- Enhanced Responsive & Accessibility Features ---

// 1. Dynamically adjust modal sizes and positions for mobile/tablet
function adjustModalsForScreen() {
    const modals = [
        favoritesModal, helpModal, creditsModal, settingsModal,
        historyModal, shortcutsModal, searchModal
    ];
    modals.forEach(modal => {
        if (!modal) return;
        if (window.innerWidth < 600) {
            modal.style.width = '95vw';
            modal.style.height = '90vh';
            modal.style.borderRadius = '12px';
            modal.style.padding = '1em';
        } else {
            modal.style.width = '480px';
            modal.style.height = 'auto';
            modal.style.borderRadius = '18px';
            modal.style.padding = '2em';
        }
    });
}
window.addEventListener('resize', adjustModalsForScreen);
adjustModalsForScreen();

// 2. Improve focus management: trap focus inside open modal
function trapFocus(modal) {
    if (!modal) return;
    const focusable = modal.querySelectorAll('button, [tabindex="0"], input, select, textarea, a[href]');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                last.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    });
}
[
    favoritesModal, helpModal, creditsModal, settingsModal,
    historyModal, shortcutsModal, searchModal
].forEach(trapFocus);

// 3. Add ARIA roles for better accessibility
function setAriaRoles() {
    [
        {el: favoritesModal, role: 'dialog', label: 'Favorites'},
        {el: helpModal, role: 'dialog', label: 'Help'},
        {el: creditsModal, role: 'dialog', label: 'Credits'},
        {el: settingsModal, role: 'dialog', label: 'Settings'},
        {el: historyModal, role: 'dialog', label: 'Quote History'},
        {el: shortcutsModal, role: 'dialog', label: 'Keyboard Shortcuts'},
        {el: searchModal, role: 'dialog', label: 'Search Quotes'}
    ].forEach(({el, role, label}) => {
        if (el) {
            el.setAttribute('role', role);
            el.setAttribute('aria-label', label);
        }
    });
}
setAriaRoles();

// 4. Add swipe-to-close for modals on mobile
function enableSwipeToClose(modal, closeBtn) {
    if (!modal || !closeBtn) return;
    let startY = null;
    modal.addEventListener('touchstart', e => {
        if (e.touches.length === 1) startY = e.touches[0].clientY;
    });
    modal.addEventListener('touchmove', e => {
        if (startY !== null && e.touches.length === 1) {
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 80) {
                closeBtn.click();
                startY = null;
            }
        }
    });
    modal.addEventListener('touchend', () => { startY = null; });
}
enableSwipeToClose(favoritesModal, closeFavorites);
enableSwipeToClose(helpModal, closeHelp);
enableSwipeToClose(creditsModal, closeCredits);
enableSwipeToClose(settingsModal, closeSettings);
enableSwipeToClose(historyModal, closeHistory);
enableSwipeToClose(shortcutsModal, closeShortcuts);
enableSwipeToClose(searchModal, closeSearch);

// 5. Add "Back to Top" button for long lists (favorites/history/search)
function addBackToTop(listContainer) {
    if (!listContainer) return;
    let btn = document.createElement('button');
    btn.textContent = '⬆️ Top';
    btn.style.position = 'sticky';
    btn.style.bottom = '12px';
    btn.style.right = '12px';
    btn.style.margin = '0.5em 0 0 auto';
    btn.style.display = 'none';
    btn.style.background = '#22a6b3';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '20px';
    btn.style.padding = '0.5em 1.2em';
    btn.style.fontSize = '1rem';
    btn.style.cursor = 'pointer';
    btn.onclick = () => listContainer.scrollTo({top: 0, behavior: 'smooth'});
    listContainer.parentNode.appendChild(btn);

    listContainer.addEventListener('scroll', () => {
        btn.style.display = listContainer.scrollTop > 120 ? 'block' : 'none';
    });
}
addBackToTop(favoritesList);
addBackToTop(historyList);
addBackToTop(searchResults);

// 6. Announce new quote for screen readers
function announceQuote(quote) {
    let live = document.getElementById('quoteLiveRegion');
    if (!live) {
        live = document.createElement('div');
        live.id = 'quoteLiveRegion';
        live.setAttribute('aria-live', 'polite');
        live.style.position = 'absolute';
        live.style.left = '-9999px';
        document.body.appendChild(live);
    }
    live.textContent = quote;
}
const oldAnimateQuote = animateQuote;
animateQuote = function(newQuote) {
    oldAnimateQuote(newQuote);
    announceQuote(newQuote);
};

// 7. Add reduced motion support for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animationToggle.checked = false;
    localStorage.setItem('animOn', false);
    // Optionally, disable background animation
    if (bgCanvas) bgCanvas.style.display = 'none';
}

// 8. Add a subtle vibration on quote generation for mobile
function vibrateOnGenerate() {
    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
}
generateBtn.addEventListener('click', vibrateOnGenerate);

// 9. Add a "Copy All Favorites" button
const copyAllFavoritesBtn = document.createElement('button');
copyAllFavoritesBtn.textContent = 'Copy All Favorites';
copyAllFavoritesBtn.style.margin = '0.7em 0 0 0';
copyAllFavoritesBtn.style.background = '#22a6b3';
copyAllFavoritesBtn.style.color = '#fff';
copyAllFavoritesBtn.style.border = 'none';
copyAllFavoritesBtn.style.borderRadius = '20px';
copyAllFavoritesBtn.style.padding = '0.5em 1.2em';
copyAllFavoritesBtn.style.fontSize = '1rem';
copyAllFavoritesBtn.style.cursor = 'pointer';
copyAllFavoritesBtn.onclick = () => {
    if (favorites.length === 0) return;
    navigator.clipboard.writeText(favorites.join('\n'));
    copyAllFavoritesBtn.textContent = 'Copied!';
    setTimeout(() => copyAllFavoritesBtn.textContent = 'Copy All Favorites', 1200);
};
if (favoritesList && favoritesList.parentNode) {
    favoritesList.parentNode.insertBefore(copyAllFavoritesBtn, favoritesList);
}

// 10. Add a "Clear Search" button in search modal
const clearSearchBtn = document.createElement('button');
clearSearchBtn.textContent = 'Clear Search';
clearSearchBtn.style.margin = '0.7em 0 0 0.5em';
clearSearchBtn.style.background = '#e17055';
clearSearchBtn.style.color = '#fff';
clearSearchBtn.style.border = 'none';
clearSearchBtn.style.borderRadius = '20px';
clearSearchBtn.style.padding = '0.5em 1.2em';
clearSearchBtn.style.fontSize = '1rem';
clearSearchBtn.style.cursor = 'pointer';
clearSearchBtn.onclick = () => {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchInput.focus();
};
if (searchInput && searchInput.parentNode) {
    // Place the clear button right after the search input for better UX
    searchInput.parentNode.insertBefore(clearSearchBtn, searchInput.nextSibling);
    // Add a little spacing
    clearSearchBtn.style.marginLeft = '0.7em';
    clearSearchBtn.style.verticalAlign = 'middle';
    // Keyboard accessibility: Enter/Space triggers click
    clearSearchBtn.tabIndex = 0;
    clearSearchBtn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            clearSearchBtn.click();
        }
    });
    // Tooltip for clarity
    clearSearchBtn.title = "Clear the search box";
    // Extra: visually match search input
    clearSearchBtn.style.boxShadow = '0 2px 8px #e1705533';
    clearSearchBtn.style.transition = 'background 0.2s, transform 0.2s';
    clearSearchBtn.onmouseover = () => clearSearchBtn.style.transform = "scale(1.06)";
    clearSearchBtn.onmouseout = () => clearSearchBtn.style.transform = "scale(1)";
}