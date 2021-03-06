const Discord = require('discord.js')
const { token } = require('./config.json')
const fs = require('fs')

const client = new Discord.Client();
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

//Get Commands
const commandFolders = fs.readdirSync('./commands')

for (const folder of commandFolders) {

    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((f) => f.endsWith('.js'))

    for (const file of commandFiles){

        const command = require(`./commands/${folder}/${file}`)

        client.commands.set(command.name, command)
    }

}

//Events
const eventFiles = fs.readdirSync('./events').filter((f) => f.endsWith('.js'))

for (const file of eventFiles){
    const event = require(`./events/${file}`)

    if (event.once){
        
        client.once(event.name, (...args) => event.execute(...args, client))
    }

    else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}

client.login(token)
