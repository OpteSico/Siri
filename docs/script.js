document.addEventListener('DOMContentLoaded', () => {
  const bgm = document.getElementById("bgm");
  const muteBtn = document.getElementById("muteToggle");
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
      bgm.play().catch(err => console.log("BGM再生エラー:", err));
      muteBtn.innerText = "🔊 ON";
    }
  }

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

  // HTMLから呼び出せるようにグローバル登録
  window.toggleMute = toggleMute;
  window.goToMenu = goToMenu;
  window.skipToMenu = skipToMenu;
});
