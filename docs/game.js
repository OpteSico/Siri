const answer = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
let allHints = [];
const npcHints = [[], [], []];
let inquiries = 0;

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('playerName') || '';
  document.getElementById('playerName').value = savedName;

  // ダイヤルにスワイプ検出を追加
  for (let i = 0; i < 4; i++) {
    enableSwipe(`digit-${i}`, i);
  }
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
  inquiries += 3; // 初期ヒント3つ分をカウントしておく
  updateStats();
}

function drawHint() {
  return allHints.length > 0 ? allHints.pop() : "もう知ってることはない";
}

function getHint(npcNumber, suffix = '') {
  const hint = drawHint();
  const fullHint = hint + suffix;
  npcHints[npcNumber - 1].push(fullHint);
  document.getElementById(`npc${npcNumber}Hint`).innerText = fullHint;
  inquiries++;
  appendHintLog(npcNumber, fullHint);
}


function appendHintLog(npc, hint) {
  const list = document.getElementById('hintList');
  const entry = document.createElement('li');
  entry.innerText = `NPC${npc}: ${hint}`;
  list.appendChild(entry);
}


function submitGuess() {
  const guess = [];
  for (let i = 0; i < 4; i++) {
    guess.push(parseInt(document.getElementById(`digit-${i}`).value));
  }

  if (guess.every((num, i) => num === answer[i])) {
    showClearScreen();
    saveRanking(); // スコア保存
  } else {
    alert(`残念！正解は ${answer.join('')} でした。`);
    saveRanking();
    window.location.href = 'index.html';
  }
}

function showClearScreen() {
  // ゲーム画面を非表示
  document.getElementById('gameScreen').classList.remove('visible');

  // クリア画面を表示
  const clearScreen = document.getElementById('clearScreen');
  clearScreen.classList.add('visible');

  // ヒント回数（初期3つを引く）
  const effectiveInquiries = Math.max(0, inquiries - 3);

  // プレイヤー名
  const name = localStorage.getItem('playerName') || '名無しさん';

  // メッセージ表示
  document.getElementById('clearMessage').innerText =
    `${name}さんは ${effectiveInquiries} 回の聞き込みで真相にたどりつきましたか…素晴らしいです…`;
}



function saveRanking() {
  const name = localStorage.getItem('playerName') || '名無しさん';
  const rankingData = JSON.parse(localStorage.getItem('ranking')) || [];
  rankingData.push({ name, inquiries });
  localStorage.setItem('ranking', JSON.stringify(rankingData));
}

function showHintLog() {
  document.getElementById("hintLogModal").style.display = "flex";
}

function closeHintLog() {
  document.getElementById("hintLogModal").style.display = "none";
}

function updateStats() {
  const values = [];
  for (let i = 0; i < 4; i++) {
    const val = parseInt(document.getElementById(`digit-${i}`).value);
    values.push(val);
  }
  const avg = (values.reduce((a, b) => a + b, 0) / 4).toFixed(1);
  const med = median(values);
  document.getElementById("avgValue").innerText = avg;
  document.getElementById("medianValue").innerText = med;
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
  const med = median(ans);

  function getDuplicateCount(arr) {
  const counts = {};
  for (let num of arr) {
    counts[num] = (counts[num] || 0) + 1;
  }
  return Object.values(counts).filter(count => count > 1).length;
}


  const hints = [

  `1桁目は${a % 2 === 0 ? '偶数' : '奇数'}`,
  `2桁目は${b % 2 === 0 ? '偶数' : '奇数'}`,
  `3桁目は${c % 2 === 0 ? '偶数' : '奇数'}`,
  `4桁目は${d % 2 === 0 ? '偶数' : '奇数'}`,
    
  `1桁目は${a < 4 ? '0～3' : a < 7 ? '4～6' : '7～9'}のいずれか`,
　`2桁目は${b < 4 ? '0～3' : b < 7 ? '4～6' : '7～9'}のいずれか`,
  `3桁目は${c < 4 ? '0～3' : c < 7 ? '4～6' : '7～9'}のいずれか`,
  `4桁目は${d < 4 ? '0～3' : d < 7 ? '4～6' : '7～9'}のいずれか`,

  `4桁の合計は${a + b + c + d}`,
  `数字の平均は${((a + b + c + d) / 4).toFixed(1)}`,
  `最大の数字は${Math.max(a, b, c, d)}`,
  `最小の数字は${Math.min(a, b, c, d)}`,
  `最大と最小の差は${Math.max(a, b, c, d) - Math.min(a, b, c, d)}`,

  `偶数は${[a, b, c, d].filter(n => n % 2 === 0).length}つ含まれている`,
  `奇数は${[a, b, c, d].filter(n => n % 2 !== 0).length}つ含まれている`,

  `同じ数字は${new Set([a, b, c, d]).size < 4 ? '含まれている' : '含まれていない'}。`,

  `1桁目 + 2桁目 = ${a + b}`,
  `3桁目 + 4桁目 = ${c + d}`,
  `1桁目 + 3桁目 = ${a + c}`,
  `2桁目 + 4桁目 = ${b + d}`,

  `1桁目と3桁目の差は${Math.abs(a - c)}`,
  `2桁目と4桁目の差は${Math.abs(b - d)}`,

  `数字の中央値は${med}`,

  `最初の3桁の和は${a + b + c}`,
  `後ろの3桁の和は${b + c + d}`,

  `同じ数字は${getDuplicateCount([a, b, c, d]) > 1 ? getDuplicateCount([a, b, c, d]) + 'つ' : 'ない'}`,
  ];
  return shuffle(hints).slice(0, 25);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
function toggleHintModal() {
  const modal = document.getElementById("hintModal");
  modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
}

// ダイヤル用：タップで数字を＋1（0〜9でループ）
function rotateDigitByTap(index) {
  const digitEl = document.getElementById(`digit-${index}`);
  let current = parseInt(digitEl.innerText);
  current = (current + 1) % 10;
  digitEl.innerText = current;
  updateStats();
}
function enableSwipe(id, index) {
  const el = document.getElementById(id);
  let startY = 0;

  el.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  });

  el.addEventListener('touchend', (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (Math.abs(deltaY) > 30) { // スワイプ距離の閾値
      if (deltaY < 0) {
        rotateDigit(index, 1); // 下にスワイプ → 次の数字
      } else {
        rotateDigit(index, -1); // 上にスワイプ → 前の数字
      }
    }
  });
}

