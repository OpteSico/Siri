function startGame() {
    document.getElementById('nameScreen').classList.remove('visible');
    document.getElementById('gameScreen').classList.add('visible');
  }

// ランダムに4桁の答えを生成
const answer = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));

// 生成済みヒントを保持
let allHints = [];
const npcHints = [[], [], []]; // 各NPCが提示したヒント
let inquiries = 0; // 聞き込み回数

// ゲーム開始時の処理
document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('playerName') || '';
  document.getElementById('playerName').value = savedName;

  // 答えに基づく30個のヒントを生成
  allHints = generateHints(answer);

  // NPC3人が最初のヒントを提示
  for (let i = 0; i < 3; i++) {
    const firstHint = drawHint();
    npcHints[i].push(firstHint);
    document.getElementById(`npc${i + 1}Hint`).innerText = firstHint;
  }
});

// 名前を保存
function saveName() {
  const name = document.getElementById('playerName').value.trim();
  if (name) {
    localStorage.setItem('playerName', name);
    alert("プレイヤー名を保存しました");
  }
}

// ヒントをランダムに1つ取得（重複なし）
function drawHint() {
  const remaining = allHints.filter(h => !npcHints.flat().includes(h));
  if (remaining.length === 0) return "もうヒントはないようだ。";
  return remaining[Math.floor(Math.random() * remaining.length)];
}

// NPCごとの聞き込み
function getHint(npcNumber) {
  const hint = drawHint();
  npcHints[npcNumber - 1].push(hint);
  document.getElementById(`npc${npcNumber}Hint`).innerText = hint;
  inquiries++;
}

function submitGuess() {
  const guess = [];
  for (let i = 0; i < 4; i++) {
    guess.push(parseInt(document.getElementById(`digit-${i}`).innerText, 10));
  }

  if (guess.every((num, i) => num === answer[i])) {
    alert("正解！おめでとうございます！");
    saveRanking();
    window.location.href = 'index.html';
  } else {
    alert(`残念！正解は ${answer.join('')} でした。`);
    saveRanking();
    window.location.href = 'index.html';
  }
}


// ランキング保存
function saveRanking() {
  const name = localStorage.getItem('playerName') || '名無しさん';
  const rankingData = JSON.parse(localStorage.getItem('ranking')) || [];
  rankingData.push({ name, inquiries });
  localStorage.setItem('ranking', JSON.stringify(rankingData));
}

// メモ機能の表示切替
function toggleMemo() {
  const memo = document.getElementById('memo');
  memo.style.display = memo.style.display === 'none' ? 'block' : 'none';
}

// 答えに基づき30個のヒントを生成
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
    `1桁目は4桁目より${a > d ? '大きい' : (a < d ? '小さい' : '同じ')}です。`,
    `2桁目と3桁目は${b === c ? '同じです' : '異なります'}。`,
    `偶数は${ans.filter(n => n % 2 === 0).length}つ含まれています。`,
    `奇数は${ans.filter(n => n % 2 !== 0).length}つ含まれています。`,
    `1桁目と3桁目の差は${Math.abs(a - c)}です。`,
    `2桁目と4桁目の差は${Math.abs(b - d)}です。`,
    `最大の数字は${ans.indexOf(max) + 1}桁目にあります。`,
    `最小の数字は${ans.indexOf(min) + 1}桁目にあります。`,
    `4つの数字の中で最も頻出する数字は${mode(ans)}です。`,
    `数字の中央値は${median(ans)}です。`,
    `4桁目は${d === 0 ? 'ゼロです' : 'ゼロではありません'}。`,
    `1桁目は2桁目より${a > b ? '大きい' : (a < b ? '小さい' : '同じ')}です。`,
    `3桁目は4桁目より${c > d ? '大きい' : (c < d ? '小さい' : '同じ')}です。`,
    `4桁の積は${a * b * c * d === 0 ? '0です（どこかに0があります）' : '0ではありません'}。`,
    `1桁目から4桁目の中で2番目に大きい数字は${secondLargest(ans)}です。`,
    `数字の平均は${(sum / 4).toFixed(1)}です。`,
    `最大と最小の差は${max - min}です。`,
    `最初の3桁の和は${a + b + c}です。`,
    `後ろの3桁の和は${b + c + d}です。`,
    `4桁の中で同じ数字が${4 - uniqueCount}個重複しています。`,
  ];

  return shuffle(hints).slice(0, 30);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 配列の最頻値
function mode(arr) {
  const counts = {};
  arr.forEach(n => counts[n] = (counts[n] || 0) + 1);
  return Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
}

// 配列の中央値
function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return (sorted[1] + sorted[2]) / 2;
}

// 2番目に大きい数字
function secondLargest(arr) {
  const sorted = [...new Set(arr)].sort((a, b) => b - a);
  return sorted.length > 1 ? sorted[1] : sorted[0];
}
