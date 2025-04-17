const { createCanvas, loadImage, registerFont } = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');

// Daftarkan font custom
registerFont('./assets/ComicNeue-Regular.ttf', { family: 'ComicNeue' });

async function generateBattleImage(player, monster, playerAttack, monsterAttack, playerHP) {
  const width = 700;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Latar
  ctx.fillStyle = '#f0f8ff';
  ctx.fillRect(0, 0, width, height);

  // Judul
  ctx.fillStyle = '#333';
  ctx.font = '24px ComicNeue';
  ctx.fillText('⚔️ PERTARUNGAN!', 260, 40);

  // Gambar monster & player
  const monsterImg = await loadImage('https://i.imgur.com/YIqfDuh.png');
  const playerImg = await loadImage('https://i.imgur.com/3r8YvNd.png');
  ctx.drawImage(playerImg, 50, 100, 160, 160);
  ctx.drawImage(monsterImg, 450, 100, 200, 160);

  // Info Player
  ctx.fillStyle = '#222';
  ctx.font = '20px ComicNeue';
  ctx.fillText(`🧙 ${player.name}`, 50, 80);
  ctx.fillText(`Serangan: ${playerAttack}`, 50, 260);
  ctx.fillText(`❤️ HP: ${playerHP}`, 50, 285);

  // Info Monster
  ctx.fillText(`👹 ${monster.name}`, 450, 80);
  ctx.fillText(`Serangan: ${monsterAttack}`, 450, 260);

  // Simpan gambar ke file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./battle_result.png', buffer);
}

// Ekspor fungsi dan file untuk dikirim ke Discord
function getBattleAttachment() {
  return new AttachmentBuilder('./battle_result.png');
}

module.exports = {
  generateBattleImage,
  getBattleAttachment
};
