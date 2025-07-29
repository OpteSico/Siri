// game.js 完全版

const answer = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
let allHints = [];
const npcHints = [[], [], []];
let inquiries = 0;

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('playerName') || '';
  document.getElementById('playerName').value = savedName;
});

function saveName() {
  const name = document.getElementById('playerName').value.trim();
  if (name) {
    localStorage.setItem('playerName', name);
    alert("プレイヤー名を保存しました");
  }
}

function startGame() {
  document.getElementById('nameScreen').classList.remove('visible');
  document.getElementById('gameScreen').classList.add('visible');
  allHints = generateHints(answer);

  for (let i = 0; i < 3; i++) {
    const firstHint = drawHint();
    npcHints[i].push(firstHint);
    document.getElementById(`npc${i + 1}Hint`).innerText = firstHint;
    appendHintLog(i + 1, firstHint);
  }
  updateStatsDisplay();
}

function rotateDigit(event, index) {
  event.preventDefault();
  const delta = event.deltaY < 0 ? 1 : -1;
  changeDigit(index, delta);
}

function changeDigit(index, delta) {
  const digitElem = document.getElementById(`digit-${index}`);
  let value = parseInt(digitElem.innerText);
  value = (value + delta + 10) % 10;
  digitElem.innerText = value;
  digitElem.classList.remove('spin-up', 'spin-down');
  digitElem.classList.add(delta > 0 ? 'spin-up' : 'spin-down');
  setTimeout(() => digitElem.classList.remove('spin-up', 'spin-down'), 200);
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const values = [];
  for (let i = 0; i < 4; i++) {
    values.push(parseInt(document.getElementById(`digit-${i}`).innerText));
  }
  const avg = (values.reduce((a, b) => a + b, 0) / 4).toFixed(1);
  const med = median(values);
  document.getElementById('statsDisplay').innerText = `平均: ${avg}　中央値: ${med}`;
}

function getHint(npcNumber) {
  const hint = drawHint();
  npcHints[npcNumber - 1].push(hint);
  document.getElementById(`npc${npcNumber}Hint`).innerText = hint;
  inquiries++;
  appendHintLog(npcNumber, hint);
}

function drawHint() {
  const used = npcHints.flat();
  const available = allHints.filter(h => !used.includes(h));
  if (available.length === 0) return "もうヒントはないようだ。";
  return available[Math.floor(Math.random() * available.length)];
}

function appendHintLog(npc, hint) {
  const logArea = document.getElementById('hintLog');
  const entry = document.createElement('div');
  entry.innerText = `NPC${npc}: ${hint}`;
  logArea.appendChild(entry);
}

function submitGuess() {
  const guess = [];
  for (let i = 0; i < 4; i++) {
    guess.push(parseInt(document.getElementById(`digit-${i}`).innerText));
  }

  const isCorrect = guess.every((num, i) => num === answer[i]);
  showResult(isCorrect);
  if (isCorrect) saveRanking();
}

function showResult(success) {
  const modal = document.getElementById('resultModal');
  const image = document.getElementById('resultImage');
  const message = document.getElementById('resultMessage');
  const answerDisplay = document.getElementById('correctAnswerDisplay');

  if (success) {
    image.src = "congrats.png";
    message.innerText = "おめでとうございます！正解です！";
    answerDisplay.innerText = `ヒント使用数: ${inquiries}`;
  } else {
    image.src = "gameover.png";
    message.innerText = "ゲームオーバー！";
    answerDisplay.innerText = `正解は ${answer.join('')} でした。`;
  }

  modal.style.display = 'flex';
}

function returnToMenu() {
  document.getElementById('resultModal').style.display = 'none';
  window.location.href = 'index.html';
}

function saveRanking() {
  const name = localStorage.getItem('playerName') || '名無しさん';
  const rankingData = JSON.parse(localStorage.getItem('ranking')) || [];
  rankingData.push({ name, inquiries });
  rankingData.sort((a, b) => a.inquiries - b.inquiries);
  localStorage.setItem('ranking', JSON.stringify(rankingData.slice(0, 10)));
}

function toggleHintModal() {
  const modal = document.getElementById('hintModal');
  modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function openRanking() {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  const list = ranking.map((r, i) => `${i + 1}. ${r.name} - ${r.inquiries}回`).join('\n');
  alert("=== ランキング ===\n" + list);
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return (sorted[1] + sorted[2]) / 2;
}

function generateHints(ans) {
  const [a, b, c, d] = ans;
  const sum = a + b + c + d;
  const uniqueCount = new Set(ans).size;
  const max = Math.max(...ans);
  const min = Math.min(...ans);

  const hints = [
    `1桁目は${a % 2 === 0 ? '偶数' : '奇数'}です。`,
    `2桁目は${b >= 5 ? '5以上' : '5未満'}です。`,
    `3桁目は${c % 2 === 0 ? '偶数' : '奇数'}です。`,
    `4桁目は${d >= 5 ? '5以上' : '5未満'}です。`,
    `4桁の合計は${sum >= 20 ? '20以上' : (sum >= 15 ? '15以上20未満' : '15未満')}です。`,
    `同じ数字は${uniqueCount < 4 ? '含まれています' : '含まれていません'}。`,
    `1桁目と2桁目の和は${a + b}です。`,
    `3桁目と4桁目の和は${c + d}です。`,
    `最大の数字は${max}です。`,
    `最小の数字は${min}です。`,
    `偶数は${ans.filter(n => n % 2 === 0).length}つ含まれています。`,
    `奇数は${ans.filter(n => n % 2 !== 0).length}つ含まれています。`,
    `1桁目と3桁目の差は${Math.abs(a - c)}です。`,
    `2桁目と4桁目の差は${Math.abs(b - d)}です。`,
    `数字の平均は${(sum / 4).toFixed(1)}です。`,
    `最大と最小の差は${max - min}です。`,
    `最初の3桁の和は${a + b + c}です。`,
    `後ろの3桁の和は${b + c + d}です。`,
  ];
  return shuffle(hints).slice(0, 30);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
