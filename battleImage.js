const { createCanvas } = require('canvas');
const fs = require('fs');

async function generateBattleImage(player, monster, playerAttack, monsterAttack, playerHP) {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#dff6ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#222';

  ctx.fillText(`🧙 ${player.name}`, 50, 80);
  ctx.fillText(`HP: ${playerHP} / 100`, 50, 110);
  ctx.fillText(`➡️ Serangan: ${playerAttack} dmg`, 50, 140);

  ctx.fillText(`👹 ${monster.name}`, 500, 80);
  ctx.fillText(`⬅️ Serangan: ${monsterAttack} dmg`, 500, 140);

  ctx.font = 'bold 36px Arial';
  ctx.fillText('⚔️ VS ⚔️', 340, 200);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./battle_result.png', buffer);
}

module.exports = { generateBattleImage };