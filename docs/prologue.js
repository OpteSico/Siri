const dialogue = [
  "……",
　"えー……夜分にすみません……",
  "皆さんにお集まり頂いたのは…4桁の暗号を解くためなんです…",
  "私の部下であるこの巡査が",
  "今から聞き込み致しますので…しばしお付き合いを…"
];
let dialogueIndex = 0;

function nextLine() {
  dialogueIndex++;
  if (dialogueIndex < dialogue.length) {
    document.getElementById("dialogueBox").innerText = dialogue[dialogueIndex];
  } else {
    window.location.href = 'game.html';
  }
}

function skipPrologue() {
  window.location.href = 'game.html';
}
