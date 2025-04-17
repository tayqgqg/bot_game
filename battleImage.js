const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Kalau kamu punya font sendiri, kamu bisa uncomment dan sesuaikan
// registerFont(path.join(__dirname, 'fonts', 'funny.ttf'), { family: 'FunnyFont' });

async function generateBattleImage(player, monster, playerAttack, monsterAttack, remainingHP) {
  const canvas = createCanvas(700, 300);
  const ctx = canvas.getContext('2d');

  // Background color
  ctx.fillStyle = '#fef4d7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Box outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Gambar player dan monster (gunakan gambar default bawaan)
  const playerImg = await loadSafeImage(path.join(__dirname, 'assets', 'player.png'));
  const monsterImg = await loadSafeImage(path.join(__dirname, 'assets', 'monster.png'));

  // Player image
  if (playerImg) ctx.drawImage(playerImg, 50, 80, 100, 100);
  else drawBox(ctx, 50, 80, 100, 100, 'blue', 'Player');

  // Monster image
  if (monsterImg) ctx.drawImage(monsterImg, 550, 80, 100, 100);
  else drawBox(ctx, 550, 80, 100, 100, 'red', monster.name);

  // Text
  ctx.fillStyle = '#000';
  ctx.font = '20px sans-serif';

  ctx.fillText(`${player.name} menyerang ${monster.name} (-${playerAttack})`, 200, 120);
  ctx.fillText(`${monster.name} menyerang kembali (-${monsterAttack})`, 200, 150);
  ctx.fillText(`❤️ Sisa HP: ${remainingHP}`, 200, 180);

  // Simpan sebagai PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./battle_result.png', buffer);
}

// Gambar fallback kalau gambar tidak ada
function drawBox(ctx, x, y, w, h, color, label) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.fillText(label, x + 10, y + h / 2);
}

// Load gambar dengan aman
async function loadSafeImage(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return await loadImage(filePath);
    } else {
      console.warn(`Gambar tidak ditemukan: ${filePath}`);
      return null;
    }
  } catch (err) {
    console.error(`Gagal load gambar: ${filePath}`, err);
    return null;
  }
}

module.exports = { generateBattleImage };
