module.exports = {
	name: 'unban',
	description: 'Unban a user from a server.',
	guildOnly: true,
	usage: "<userID>",
	execute(message, args) {

		if(!message.member.hasPermission("BAN_MEMBERS")) {
			return message.channel.send(`**${message.author.username}**, You do not have perms to unban someone`)
		  }
		  
		if(!message.guild.me.hasPermission("BAN_MEMBERS")) {
			return message.channel.send(`**${message.author.username}**, I do not have perms to unban someone`)
		}

		if (!args.length) {
			return message.reply('You need to give a user id to unban the user');
		}

		if (isNaN(args[0])) {
			return message.reply('Please provide a valid user id.')
		}

		message.guild.fetchBans()
			.then((bans) => {
				let member = bans.get(args[0])

				if (member){
					message.guild.unban(member)
						.then((member) => message.channel.send(`**${member}** was unbanned.`))
						.catch((err) => message.channel.send('Failed to unban user.'))
				}

				else {
					message.channel.send(`User with id: ${args[0]} ban does not exist.`)
				}

			})
		
	},
};