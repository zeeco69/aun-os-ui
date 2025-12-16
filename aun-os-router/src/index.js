// A-UN ROUTER : STABLE CORE
const VPS_URL = "http://46.250.251.114:9000";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    // 🔹 HEARTBEAT : 生存確認専用（最重要）
    if (url.pathname === "/heartbeat") {
      return new Response(
        JSON.stringify({ alive: true, ts: Date.now() }),
        { headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // 🔹 UI DATA
    if (url.pathname === "/cockpit/data") {
      return new Response(JSON.stringify({
        STATS: {
          MOTHERCORE: { IQ: 405, Level: 101 },
          SANZEN: { IQ: 380, Level: 100 },
          GHOST: { IQ: 310, Level: 80 },
          JARVIS: { IQ: 350, Level: 96 },
          FRIDAY: { IQ: 335, Level: 93 },
          QUANTA: { IQ: 360, Level: 88 },
          OZUNO: { IQ: 999, Level: 99 }
        },
        STATUS: { PHASE: "ONLINE", TS: new Date().toISOString() }
      }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    // 🔹 INJECT
    if (url.pathname === "/inject" && request.method === "POST") {
      const body = await request.text();
      const r = await fetch(`${VPS_URL}/inject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });
      return new Response(await r.text(), {
        headers: { ...CORS, "Content-Type": "application/json" }
      });
    }

    return new Response("AUN ROUTER ALIVE", { headers: CORS });
  }
};
