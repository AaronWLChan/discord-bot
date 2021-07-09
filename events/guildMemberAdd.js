const Canvas = require('canvas')
const Discord = require('discord.js')

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {

		const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
        
		if (!channel) return;

		//channel.send(`Welcome to the server, ${member}`);
		const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');

		const background = await Canvas.loadImage('./assets/background.jpg')

		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }))

		context.drawImage(background, 0, 0, canvas.width, canvas.height)

		context.drawImage(avatar, 25, 25, 200, 200)

		//Welcome Text
		context.font = '28px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

		//Username
		let fontSize = 70;

		do {
			// Assign the font to the context and decrement it so it can be measured again
			context.font = `${fontSize -= 10}px sans-serif`;
			// Compare pixel width of the text to the canvas minus the approximate avatar size
		} while (context.measureText(member.displayName).width > canvas.width - 300);

		context.fillStyle = '#ffffff'
		
		context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8)

		//Apply as attachment
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png')

		channel.send(`Welcome to the server, ${member}`, attachment);

		
	},
};