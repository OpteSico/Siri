const dialogue = [
  "……",
  "アナルに異物を入れてはいけません",
  "身体の不調や非常事態になりかねません",
  "お医者さんの３割は 直腸異物の",
  "撤去手術をやった経験があるようで",
  "……ン～ッフッフッフッ",
  "もう少し早く知りたかったものです",
  "私のお尻の穴は手遅れのようで……",
];
let dialogueIndex = 0;

function nextLine() {
  dialogueIndex++;
  if (dialogueIndex < dialogue.length) {
    document.getElementById("dialogueBox").innerText = dialogue[dialogueIndex];
  } else {
    goToMenu();
  }
}

function startGame() {
  // メニューのBGMを一旦停止
  const bgm = document.getElementById('bgm');
  if (bgm) bgm.pause();

  // ゲーム画面に遷移
  window.location.href = "game.html";
}


function howToPlay() {
  alert("4桁の暗号をNPCの証言を元に推理してください。");
}

function openCredits() {
  alert("優秀な警部ユーザーランキング");
}

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

  function showMenu() {
    document.getElementById('introScreen').classList.remove('visible');
    document.getElementById('menuScreen').classList.add('visible');
    muteBtn.style.display = 'block';
    if (!isMuted) {
      bgm.play().catch(e => console.warn("BGM再生エラー:", e));
    }
  }

  function goToMenu() {
    const intro = document.getElementById('introScreen');
    intro.classList.add('fade-out');
    setTimeout(showMenu, 1000);
  }

  function skipToMenu() {
    showMenu();
  }

  // グローバルに登録（HTMLから呼び出す用）
  window.toggleMute = toggleMute;
  window.goToMenu = goToMenu;
  window.skipToMenu = skipToMenu;
});
