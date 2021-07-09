const { BAN_MEMBERS } = require('../../permissions.json')

module.exports = {
	name: 'ban',
	description: 'Ban a user from a server.',
	guildOnly: true,
	usage: "<user>",
	execute(message) {

		if(!message.member.hasPermission(BAN_MEMBERS)) {
			return message.channel.send(`**${message.author.username}**, You do not have perms to unban someone`)
		  }
		  
		if(!message.guild.me.hasPermission(BAN_MEMBERS)) {
			return message.channel.send(`**${message.author.username}**, I do not have perms to unban someone`)
		}

		if (!message.mentions.users.size) {
			return message.reply('You need to tag a user in order to ban them!');
		}

		const taggedUser = message.mentions.users.first();

		const user = message.guild.member(taggedUser)

		if (user){
			user.ban(taggedUser)
			.then((member) => message.channel.send(`Banned **${member}**`))
			.catch((err) => message.channel.send("Unable to ban member."))
		}

		else {
			message.channel.send("User doesn't exist in this server.")
		}

	},
};