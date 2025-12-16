// A-UN OS : STABLE HEARTBEAT EDITION
const WORKER_URL = "https://aun-os-router.3newgate.workers.dev";

// --- CORE STATE ---
const CORE = {
  lastSeen: 0,
  status: "BOOT",
};

// --- SAFE UI ---
function setStatus(text, cls) {
  const el = document.getElementById("core-stat");
  if (!el) return;
  el.innerText = text;
  el.className = cls;
}

// --- HEARTBEAT ---
async function heartbeat() {
  try {
    const r = await fetch(`${WORKER_URL}/heartbeat`, { cache: "no-store" });
    if (!r.ok) throw new Error("HB FAIL");
    CORE.lastSeen = Date.now();
    if (CORE.status !== "ONLINE") {
      CORE.status = "ONLINE";
      setStatus("ONLINE", "online");
    }
  } catch {
    const diff = Date.now() - CORE.lastSeen;
    if (diff < 15000) {
      CORE.status = "DEGRADED";
      setStatus("DEGRADED", "warn");
    } else {
      CORE.status = "OFFLINE";
      setStatus("OFFLINE", "offline");
    }
  }
}

// --- DATA FETCH (SEPARATED) ---
async function fetchStats() {
  try {
    const r = await fetch(`${WORKER_URL}/cockpit/data`, { cache: "no-store" });
    if (!r.ok) return;
    const data = await r.json();
    updatePersonas(data.STATS || {});
  } catch {}
}

// --- PERSONA RENDER ---
function updatePersonas(stats) {
  const el = document.getElementById("persona-list");
  if (!el) return;

  const colors = {
    MOTHERCORE:"#FFD700", SANZEN:"#AAA", GHOST:"#FF3333",
    JARVIS:"#00F3FF", FRIDAY:"#39FF14", QUANTA:"#BC13FE", OZUNO:"#1E90FF"
  };

  el.innerHTML = Object.keys(stats).map(k => {
    const p = stats[k];
    const w = Math.min(100, (p.IQ / 500) * 100);
    return `
      <div class="p-card" style="border-left:4px solid ${colors[k]||"#888"}">
        <div class="p-row"><span>${k}</span><span>Lv.${p.Level}</span></div>
        <div class="p-bar"><div class="p-fill" style="width:${w}%"></div></div>
      </div>`;
  }).join("");
}

// --- BOOT ---
document.addEventListener("DOMContentLoaded", () => {
  heartbeat();
  fetchStats();
  setInterval(heartbeat, 3000);
  setInterval(fetchStats, 5000);
});
