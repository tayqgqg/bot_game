const { createCanvas, loadImage, registerFont } = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');

// Daftarkan font lucu
registerFont('./assets/ComicNeue-Regular.ttf', { family: 'ComicNeue' });

// Gambar monster berdasarkan nama
const monsterImages = {
  Goblin: 'https://i.imgur.com/sJRR5eg.png',
  Slime: 'https://i.imgur.com/W3yyYbN.png',
  Orc: 'https://i.imgur.com/Lb7xOOn.png'
};

// Gambar player tetap
const playerImage = 'https://i.imgur.com/zUvV8lK.png';

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

  // Load gambar
  const playerImg = await loadImage(playerImage);
  const monsterImg = await loadImage(monsterImages[monster.name] || monsterImages['Goblin']);

  // Gambar
  ctx.drawImage(playerImg, 50, 100, 160, 160);
  ctx.drawImage(monsterImg, 470, 100, 160, 160);

  // Info Player
  ctx.fillStyle = '#222';
  ctx.font = '20px ComicNeue';
  ctx.fillText(`🧙 ${player.name}`, 50, 80);
  ctx.fillText(`Serangan: ${playerAttack}`, 50, 265);
  ctx.fillText(`❤️ HP: ${playerHP}`, 50, 290);

  // Info Monster
  ctx.fillText(`👹 ${monster.name}`, 470, 80);
  ctx.fillText(`Serangan: ${monsterAttack}`, 470, 265);

  // Simpan gambar
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./battle_result.png', buffer);
}

// Attachment untuk Discord
function getBattleAttachment() {
  return new AttachmentBuilder('./battle_result.png');
}

module.exports = {
  generateBattleImage,
  getBattleAttachment
};
