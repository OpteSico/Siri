// 初期設定
const bgm = document.getElementById("bgm");
const muteBtn = document.getElementById("muteToggle");

let isMuted = localStorage.getItem("bgmMuted") === "true";
updateMuteUI();

function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("bgmMuted", isMuted);
  updateMuteUI();

  if (!isMuted) {
    bgm.play().catch(e => console.warn("BGM再生エラー:", e));
  } else {
    bgm.pause();
  }
}

function updateMuteUI() {
  muteBtn.innerText = isMuted ? "🔇 OFF" : "🔊 ON";
  if (isMuted) {
    bgm.pause();
  }
}

// メニュー移行時にBGM再生とボタン表示
function goToMenu() {
  const intro = document.getElementById('introScreen');
  intro.classList.add('fade-out');
  setTimeout(() => {
    intro.classList.remove('visible');
    document.getElementById('menuScreen').classList.add('visible');
    muteBtn.style.display = 'block';
    if (!isMuted) {
      bgm.play().catch(e => console.warn("BGM再生エラー:", e));
    }
  }, 1000);
}

function skipToMenu() {
  document.getElementById('introScreen').classList.remove('visible');
  document.getElementById('menuScreen').classList.add('visible');
  muteBtn.style.display = 'block';
  if (!isMuted) {
    bgm.play().catch(e => console.warn("BGM再生エラー:", e));
  }
}
