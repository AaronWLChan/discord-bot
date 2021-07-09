const { MANAGE_MESSAGES } = require('../../permissions.json')

module.exports = {
	name: 'prune',
	description: 'Prune up to 99 messages.',
	usage: '<numberOfMessages>',
	execute(message, args) {

		if(!message.member.hasPermission(MANAGE_MESSAGES)) {
			return message.channel.send(`**${message.author.username}**, You do not have perms to prune messages`)
		  }
		  
		if(!message.guild.me.hasPermission(MANAGE_MESSAGES)) {
			return message.channel.send(`**${message.author.username}**, I do not have perms to prune messages`)
		}

		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.reply('That doesn\'t seem to be a valid number.');
		} else if (amount <= 1 || amount > 100) {
			return message.reply('You need to input a number between 1 and 99.');
		}

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('There was an error trying to prune messages in this channel!');
		});
	},
};