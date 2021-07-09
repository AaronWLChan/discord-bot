const { KICK_MEMBERS } = require('../../permissions.json')

module.exports = {
	name: 'kick',
	description: 'Tag a member and kick them (but not really).',
	guildOnly: true,
	usage: "<user>",
	execute(message) {

		if(!message.member.hasPermission(KICK_MEMBERS)) {
			return message.channel.send(`**${message.author.username}**, You do not have perms to kick users`)
		  }
		  
		if(!message.guild.me.hasPermission(KICK_MEMBERS)) {
			return message.channel.send(`**${message.author.username}**, I do not have perms to kick users`)
		}

		if (!message.mentions.users.size) {
			return message.reply('You need to tag a user in order to kick them!');
		}

		const taggedUser = message.mentions.users.first();

		const user = message.guild.member(taggedUser)

		//Check if user exists
		if (user){
			user.kick()
			.then((member) => message.channel.send(`Kicked **${member}**`))
			.catch((err) => message.channel.send("Unable to kick member."))
		}

		else {
			message.channel.send("User doesn't exist in this server.")
		}

	
	},
};