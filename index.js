const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const { generateBattleImage } = require('./battleImage');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
let players = {};

function loadPlayerData() {
  if (fs.existsSync('playerData.json')) {
    players = JSON.parse(fs.readFileSync('playerData.json'));
  }
}

function savePlayerData() {
  fs.writeFileSync('playerData.json', JSON.stringify(players, null, 2));
}

function getPlayer(id, username) {
  if (!players[id]) {
    players[id] = { name: username, level: 1, exp: 0, hp: 100 };
    savePlayerData();
  }
  return players[id];
}

client.once('ready', () => {
  console.log(`Bot online as ${client.user.tag}`);
  loadPlayerData();
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const id = message.author.id;
  const username = message.author.username;
  const player = getPlayer(id, username);
  const content = message.content.toLowerCase();

  if (content === '!mulai') {
    message.channel.send(`Selamat datang, ${player.name}! Ketik \`!berburu\` untuk melawan monster!`);
  }

  else if (content === '!status') {
    message.channel.send(`🧙 **${player.name}**\n⭐ Level: ${player.level}\n⚡ EXP: ${player.exp} / 100\n❤️ HP: ${player.hp}`);
  }

  else if (content === '!istirahat') {
    if (player.hp === 100) {
      message.channel.send(`❤️ HP kamu sudah penuh!`);
    } else {
      player.hp = 100;
      savePlayerData();
      message.channel.send(`💤 ${player.name} istirahat dan memulihkan HP!`);
    }
  }

  else if (content === '!berburu') {
    if (player.hp <= 0) {
      return message.channel.send(`💤 ${player.name}, kamu pingsan! Gunakan \`!istirahat\`.`);
    }

    const monsters = [
      { name: 'Goblin', hp: 30, attack: 10 },
      { name: 'Slime', hp: 25, attack: 8 },
      { name: 'Orc', hp: 50, attack: 15 },
    ];
    const monster = monsters[Math.floor(Math.random() * monsters.length)];

    let monsterHP = monster.hp;
    let playerAttack = Math.floor(Math.random() * 20) + 5;
    let monsterAttack = monster.attack;

    monsterHP -= playerAttack;
    player.hp -= monsterAttack;
    if (player.hp < 0) player.hp = 0;

    await generateBattleImage(player, monster, playerAttack, monsterAttack, player.hp);
    message.channel.send({ content: '⚔️ Hasil Pertarungan:', files: ['./battle_result.png'] });

    let result = '';

    if (monsterHP <= 0) {
      const expGain = Math.floor(Math.random() * 30) + 20;
      player.exp += expGain;
      result += `🎉 Kamu menang dan mendapat **${expGain} EXP**!\n`;

      if (player.exp >= 100) {
        player.level += 1;
        player.exp = 0;
        player.hp = 100;
        result += `✨ **LEVEL UP!** Levelmu sekarang ${player.level}! ❤️ HP pulih.`;
      } else {
        result += `⭐ EXP: ${player.exp} / 100`;
      }
    }

    if (player.hp <= 0) {
      result += `\n💀 Kamu pingsan! Gunakan \`!istirahat\`.`;
    }

    savePlayerData();
    if (result.trim() !== '') {
      message.channel.send(result);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);
