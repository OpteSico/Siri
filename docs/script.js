// 初期設定
const bgm = document.getElementById("bgm");
const muteBtn = document.getElementById("muteToggle");

// ミュート状態を localStorage に保存・取得
let isMuted = localStorage.getItem("bgmMuted") === "true";
updateMuteUI();

function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("bgmMuted", isMuted);
  updateMuteUI();
}

function updateMuteUI() {
  if (isMuted) {
    bgm.pause();
    muteBtn.innerText = "🔇 OFF";
  } else {
    bgm.play();
    muteBtn.innerText = "🔊 ON";
  }
}

// オープニングからメニューへ移行時にBGM再生
function goToMenu() {
  const intro = document.getElementById('introScreen');
  intro.classList.add('fade-out');
  setTimeout(() => {
    intro.classList.remove('visible');
    document.getElementById('menuScreen').classList.add('visible');
    muteBtn.style.display = 'block'; // ミュートボタンを表示
    if (!isMuted) {
      bgm.play();
    }
  }, 1000);
}

function skipToMenu() {
  document.getElementById('introScreen').classList.remove('visible');
  document.getElementById('menuScreen').classList.add('visible');
  muteBtn.style.display = 'block';
  if (!isMuted) {
    bgm.play();
  }
}
