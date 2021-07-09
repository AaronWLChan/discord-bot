const { prefix } = require('../config.json')
const Discord = require('discord.js')
const bannedWords = require('../bannedWords')

module.exports = {
    name: 'message',
    async execute(message) {

        if (bannedWords.some((word) => message.content.toLowerCase().includes(word))){
            
            await message.delete()
                    .then((msg) => message.reply("No swearing!"))
                    .catch((err) => console.log(err))
                
            return 
        }

        const client = message.client

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
    
        if (!client.commands.has(commandName)) return
    
        const command = client.commands.get(commandName)
    
        //Check if correct channel
        if (command.guildOnly && message.channel.type === 'dm'){
            return message.reply(`Cannot execute ${prefix}${command.name} inside DMs!`)
        }
    
        //Check args exist
        if (command.args && !args.length){
            let reply = "Incorrect arguments!"
    
            if(command.usage){
                reply += `\n Proper Usage: \`${prefix}${command.name} ${command.usage}\``
            }
            
            return message.channel.send(reply)
        }
    
        //Check permissions (if any)
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply('You can not do this!');
            }
        }
    
        //Handle Cooldowns
        const { cooldowns } = client;
    
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
    
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
    
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }
    
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
        try{
            command.execute(message, args)
    
        } catch (err) {
            console.log(err)
            message.reply('Encountered an error when trying to execute command.')
        }
    
    }
}