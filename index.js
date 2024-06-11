const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});


client.on('messageCreate', async message => {
  if (message.content === '!rules') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة القوانين')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#f8ca3d')
        .setThumbnail('https://media.discordapp.net/attachments/1241845762556428430/1249825869992693821/38291BEB-D27F-465C-B99C-8B7DF8AABF53.jpg?ex=6668b68c&is=6667650c&hm=f963c80112f65b0d8dc3154d4e606b4065185c87981626bc17a13fae202d9a9e&=&format=webp&width=663&height=663')
        .setTitle('قوانين السيرفر')
        .setDescription('**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت**')
        .setImage('https://media.discordapp.net/attachments/1241845762556428430/1249824287527931954/Rules_20240608_224111_0000.png?ex=6668b512&is=66676392&hm=d5f3d2094ea06a1830c354d9e8aad7dec66f15c4a465c3578d84fa23b93da135&=&format=webp&quality=lossless&width=900&height=360')
        .setFooter({ text: 'Rules Bot' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#f8ca3d')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'Rules Bot' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
