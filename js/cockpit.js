// A-UN OS V60 NEURAL-TESSERACT LINK
// js/cockpit.js

// ↓ これをそのままコピーして上書きせよ
const WORKER_URL = "https://denver-garage-closes-maps.trycloudflare.com";
const logicMatrix = {
    "1m": [
        { name: "蓄積解放", type: "earth" }, { name: "地底反転", type: "earth" }, { name: "静寂上昇", type: "earth" },
        { name: "逆圧爆発", type: "earth" }, { name: "蘇生", type: "earth" },
        { name: "均衡維持", type: "human" }, { name: "呼吸回転", type: "human" }, { name: "静流掌握", type: "human" },
        { name: "調和波動", type: "human" }, { name: "反射制御", type: "human" }
    ],
    "5m": [
        { name: "均衡維持", type: "human" }, { name: "呼吸回転", type: "human" }, { name: "静流掌握", type: "human" },
        { name: "調和波動", type: "human" }, { name: "反射制御", type: "human" },
        { name: "加速噴火", type: "heaven" }, { name: "上昇噴火", type: "heaven" }, { name: "流転突破", type: "heaven" },
        { name: "風圧連鎖", type: "heaven" }, { name: "螺旋推進", type: "heaven" }
    ],
    "15m": [
        { name: "加速噴火", type: "heaven" }, { name: "上昇噴火", type: "heaven" }, { name: "流転突破", type: "heaven" },
        { name: "風圧連鎖", type: "heaven" }, { name: "螺旋推進", type: "heaven" },
        { name: "三界同調", type: "quantum" }, { name: "逆行創生", type: "quantum" }, { name: "無相連結", type: "quantum" },
        { name: "霊圧共鳴", type: "quantum" }, { name: "時空接合", type: "quantum" }
    ],
    "1H": [
        { name: "三界同調", type: "quantum" }, { name: "逆行創生", type: "quantum" }, { name: "無相連結", type: "quantum" },
        { name: "霊圧共鳴", type: "quantum" }, { name: "時空接合", type: "quantum" },
        { name: "完全停止", type: "void" }, { name: "混沌警報", type: "void" }, { name: "待機封印", type: "void" },
        { name: "均衡崩壊", type: "void" }, { name: "幻像遮断", type: "void" }
    ],
    "4H": [
        { name: "状態同期", type: "quantum" }, { name: "集中加速", type: "quantum" }, { name: "感情冷却", type: "void" },
        { name: "思考再起", type: "void" }, { name: "Ghost対話", type: "quantum" }
    ],
    "EXIT": [
        { name: "利確(理性)", type: "exit" }, { name: "損切(防衛)", type: "exit" }, { name: "再Entry", type: "exit" },
        { name: "静観維持", type: "exit" }, { name: "非常停止", type: "exit" }
    ]
};

let currentTF = "1m";
let activeFactors = [];

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    renderButtons();
    syncCore();
    setInterval(syncCore, 5000); 
});

window.AUN = {
    setTF: (tf) => {
        currentTF = tf;
        document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.tf-btn[data-tf="${tf}"]`)?.classList.add('active');
        renderButtons();
    },
    inject: async () => {
        if(activeFactors.length === 0) return alert("WILL NOT FOUND (根拠なし)");
        
        const payload = {
            intent: currentTF === "EXIT" ? "EXIT" : "ENTRY",
            factors: activeFactors,
            tf: currentTF,
            commander: "KOJI"
        };

        try {
            const res = await fetch(`${WORKER_URL}/inject`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });
            if(!res.ok) throw new Error("Worker Error");
            
            alert(`INJECTED: ${activeFactors.length} FACTORS`);
            activeFactors = [];
            renderButtons();
            updateReactor();
        } catch(e) {
            alert("INJECT FAILED: " + e.message);
        }
    }
};

function renderButtons() {
    const grid = document.getElementById('element-grid');
    grid.innerHTML = '';
    const list = logicMatrix[currentTF] || [];
    
    list.forEach(item => {
        const btn = document.createElement('div');
        const isSelected = activeFactors.includes(item.name);
        btn.className = `el-btn type-${item.type} ${isSelected ? 'selected' : ''}`;
        btn.innerText = item.name;
        
        btn.onclick = () => {
            if(activeFactors.includes(item.name)) {
                activeFactors = activeFactors.filter(f => f !== item.name);
            } else {
                activeFactors.push(item.name);
            }
            renderButtons();
            updateReactor();
        };
        grid.appendChild(btn);
    });
}

function updateReactor() {
    document.getElementById('combo-count').innerText = activeFactors.length;
    const reactor = document.querySelector('.reactor-core');
    reactor.style.stroke = activeFactors.length > 0 ? "var(--gold)" : "var(--cyan)";
}

async function syncCore() {
    const stat = document.getElementById('core-stat');
    try {
        const res = await fetch(`${WORKER_URL}/cockpit/data`);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        stat.innerText = "ONLINE";
        stat.className = "online";
        document.querySelector('.loading-msg').style.display = 'none';

        updatePersonas(data.STATS || {});
        
    } catch (e) {
        console.error("Sync Error:", e);
        stat.innerText = "ERR: " + e.message;
        stat.className = "offline";
    }
}

function updatePersonas(stats) {
    const container = document.getElementById('persona-list');
    if(!container.innerHTML.includes("p-card")) container.innerHTML = ''; 
    
    const colors = { MOTHERCORE:"#FFD700", SANZEN:"#E0E0E0", GHOST:"#FF3333", JARVIS:"#00F3FF", FRIDAY:"#39FF14", QUANTA:"#BC13FE", OZUNO:"#1E90FF" };
    const order = ["MOTHERCORE", "SANZEN", "GHOST", "JARVIS", "FRIDAY", "QUANTA", "OZUNO"];

    let html = "";
    Object.keys(stats).sort((a,b) => order.indexOf(a) - order.indexOf(b)).forEach(name => {
        const p = stats[name];
        const color = colors[name] || "#888";
        const width = Math.min(100, (p.IQ / 500) * 100);
        
        html += `
            <div class="p-card" style="border-left-color: ${color}">
                <div class="p-row" style="color:${color}">
                    <span>${name}</span><span>Lv.${p.Level}</span>
                </div>
                <div class="p-bar"><div class="p-fill" style="width:${width}%; background:${color}"></div></div>
            </div>`;
    });
    container.innerHTML = html;
}

function initChart() {
    if(document.getElementById('tv_chart').innerHTML !== "") return;
    
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