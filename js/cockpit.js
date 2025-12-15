// A-UN OS V52 NEURAL LINK
// js/cockpit.js
const WORKER_URL = "https://aun-router.3newgate.workers.dev"; // ★Workerエンドポイント

const logicData = {
    "1m": ["赤雲下", "青雲上", "雲突入", "雲ねじれ", "MACD GC", "MACD DC", "RSI 30", "RSI 70"],
    "5m": ["三役好転", "三役逆転", "MACD上昇", "MACD下降", "RSI 50抜"],
    "15m": ["未来雲ねじれ", "雲薄い", "トレンド継続"],
    "1H": ["上昇トレンド", "下降トレンド", "レンジ", "200MA支持"],
    "4H": ["大局順行", "大局逆行"],
    "LINE": ["レジサポ転換", "ブレイク", "全戻し", "キリ番"],
    "EXIT": ["利確(TP)", "損切(SL)", "微益撤退", "建値逃げ", "ドテン"]
};

let currentTF = "1m";
let activeFactors = [];

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    renderElements();
    setInterval(syncCore, 3000); // 3秒ごとにCoreと同期
    syncCore();
});

// --- CORE SYNC (GET /cockpit/data) ---
async function syncCore() {
    try {
        const res = await fetch(`${WORKER_URL}/cockpit/data`); // Worker経由でVPSへ
        if (!res.ok) throw new Error("Sync Fail");
        const data = await res.json();

        // システム状態更新
        const stat = document.getElementById('core-stat');
        stat.innerText = "ONLINE";
        stat.className = "online";

        // 人格リスト更新
        updatePersonas(data.STATS || {});
        
    } catch (e) {
        const stat = document.getElementById('core-stat');
        stat.innerText = "OFFLINE";
        stat.className = "offline";
    }
}

function updatePersonas(stats) {
    const container = document.getElementById('persona-list');
    container.innerHTML = '';
    
    // 表示順序定義
    const order = ["MOTHERCORE", "SANZEN", "GHOST", "OZUNO", "JARVIS", "FRIDAY"];
    const colors = { MOTHERCORE:"#FFD700", SANZEN:"#E0E0E0", GHOST:"#FF3333", JARVIS:"#00F3FF", FRIDAY:"#39FF14" };

    Object.keys(stats).sort((a,b) => order.indexOf(a) - order.indexOf(b)).forEach(name => {
        const p = stats[name];
        const color = colors[name] || "#888";
        const width = Math.min(100, (p.IQ / 500) * 100);
        
        const html = `
            <div class="p-card" style="border-left-color: ${color}" onclick="console.log('${name}')">
                <div class="p-row" style="color:${color}">
                    <span>${name}</span><span>Lv.${p.Level}</span>
                </div>
                <div class="p-bar"><div class="p-fill" style="width:${width}%; background:${color}"></div></div>
            </div>`;
        container.innerHTML += html;
    });
}

// --- INJECT LOGIC (POST /inject) ---
window.AUN = {
    setTF: (tf) => {
        currentTF = tf;
        document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.tf-btn[data-tf="${tf}"]`)?.classList.add('active');
        renderElements();
    },
    
    inject: async () => {
        if(activeFactors.length === 0) return alert("NO FACTORS");
        
        const payload = {
            intent: currentTF === "EXIT" ? "EXIT" : "ENTRY",
            factors: activeFactors,
            tf: currentTF,
            commander: "KOJI"
        };

        try {
            await fetch(`${WORKER_URL}/inject`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });
            
            // リアクター演出
            const reactor = document.querySelector('.reactor-core');
            reactor.style.stroke = "#fff";
            setTimeout(() => reactor.style.stroke = "var(--cyan)", 500);
            
            alert(`INJECTED: ${activeFactors.length} FACTORS`);
            activeFactors = [];
            renderElements();
            updateReactor();
        } catch(e) {
            alert("INJECT FAILED");
        }
    }
};

function renderElements() {
    const grid = document.getElementById('element-grid');
    grid.innerHTML = '';
    const list = logicData[currentTF] || [];
    
    list.forEach(txt => {
        const btn = document.createElement('div');
        btn.className = `el-btn ${activeFactors.includes(txt) ? 'selected' : ''}`;
        btn.innerText = txt;
        btn.onclick = () => {
            if(activeFactors.includes(txt)) activeFactors = activeFactors.filter(f => f !== txt);
            else activeFactors.push(txt);
            renderElements();
            updateReactor();
        };
        grid.appendChild(btn);
    });
}

function updateReactor() {
    document.getElementById('combo-count').innerText = activeFactors.length;
    const color = activeFactors.length > 0 ? "var(--gold)" : "var(--cyan)";
    document.getElementById('right-panel').style.borderLeftColor = color;
}

function initChart() {
    new TradingView.widget({
        "container_id": "tv_chart",
        "autosize": true,
        "symbol": "FX_IDC:XAUUSD",
        "interval": "1",
        "timezone": "Asia/Tokyo",
        "theme": "dark",
        "style": "1",
        "toolbar_bg": "#000000",
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "studies": ["IchimokuCloud@tv-basic"]
    });
}