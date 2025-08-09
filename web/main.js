// --- Menu logic ---
function showCharacterCreation() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('character-creation').style.display = '';
    document.getElementById('api-setting').style.display = 'none';
    document.getElementById('saves').style.display = 'none';
    document.getElementById('game-window').style.display = 'none';
}

function createCharacter() {
    const name = document.getElementById('charName').value.trim();
    const charClass = document.getElementById('charClass').value;
    if (!name) {
        alert('Vui lòng nhập tên nhân vật!');
        return;
    }
    gameState = {
        storyShown: false,
        log: [],
        character: {
            name,
            class: charClass
        }
    };
    document.getElementById('character-creation').style.display = 'none';
    showGame();
}

function showGame(loadData) {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('character-creation').style.display = 'none';
    document.getElementById('api-setting').style.display = 'none';
    document.getElementById('saves').style.display = 'none';
    document.getElementById('game-window').style.display = '';
    document.getElementById('game-log').innerHTML = '';
    if (loadData) {
        gameState = loadData;
        logGame('<i>Đã tải game từ save!</i>');
    } else {
        if (!gameState.character) {
            // Nếu chưa có nhân vật, quay lại tạo nhân vật
            showCharacterCreation();
            return;
        }
        showStory();
        logGame(`<b>Nhân vật:</b> ${gameState.character.name} (${gameState.character.class})`);
    }
}
function showApiSetting() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('api-setting').style.display = '';
    document.getElementById('saves').style.display = 'none';
    document.getElementById('game-window').style.display = 'none';
}
function showSaves() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('api-setting').style.display = 'none';
    document.getElementById('saves').style.display = '';
    document.getElementById('game-window').style.display = 'none';
}
function backToMenu() {
    document.getElementById('main-menu').style.display = '';
    document.getElementById('api-setting').style.display = 'none';
    document.getElementById('saves').style.display = 'none';
    document.getElementById('game-window').style.display = 'none';
}

// --- API Key ---
function saveApiKey() {
    const key = document.getElementById('apiKey').value;
    if (key) {
        localStorage.setItem('gemini_api_key', key);
        alert('Đã lưu API key!');
    }
}

// --- Game logic ---
let gameState = { storyShown: false, log: [] };

function showStory() {
    fetch('story.txt').then(r => r.text()).then(story => {
        logGame(`<b>Story:</b><br>${story.replace(/\n/g,'<br>')}`);
        gameState.storyShown = true;
    });
}

function logGame(msg) {
    const log = document.getElementById('game-log');
    log.innerHTML += `<div>${msg}</div>`;
    log.scrollTop = log.scrollHeight;
    gameState.log.push(msg);
}

async function sendCommand() {
    const cmd = document.getElementById('commandInput').value;
    if (!cmd) return;
    logGame(`<b>Bạn:</b> ${cmd}`);
    document.getElementById('commandInput').value = '';
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        logGame('<span style="color:red">Chưa thiết lập API key!</span>');
        return;
    }
    // Paste prompt lên log
    logGame(`<span style='color:#aaa'>[Prompt gửi AI]: ${cmd}</span>`);
    // Gọi Gemini API
    try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: cmd }] }]
            })
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        let aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '[Không có phản hồi từ AI]';
        logGame(`<i>Dungeon (AI):</i> ${aiReply}`);
    } catch (e) {
        logGame(`<span style='color:red'>Lỗi gọi AI: ${e}</span>`);
    }
}

// --- Save/Load game ---
function saveGame() {
    const key = prompt('Nhập key để mã hóa save:', 'dungeonkey');
    if (!key) return;
    const saveStr = JSON.stringify(gameState);
    const encrypted = xorEncryptDecrypt(saveStr, key);
    const b64 = toBase64(encrypted);
    const blob = new Blob([b64], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dungeon_save.txt';
    a.click();
}

function loadGameFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const key = prompt('Nhập key để giải mã save:', 'dungeonkey');
    if (!key) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const b64 = e.target.result;
            const encrypted = fromBase64(b64);
            const saveStr = xorEncryptDecrypt(encrypted, key);
            const data = JSON.parse(saveStr);
            showGame(data);
        } catch (err) {
            alert('Lỗi khi load save!');
        }
    };
    reader.readAsText(file);
}
