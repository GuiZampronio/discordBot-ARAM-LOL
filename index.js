const Discord = require("discord.js");
const config = require("./config.json");
const fetch = require("node-fetch");
const lolFunctions = require("./lol");

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });
client.login(config.BOT_TOKEN);

const prefix = "!";


client.on("message", function(message) { 
    if (message.author.bot){
        return;
    }
    if(!message.content.startsWith(prefix)){
        return;
    }
    
    const messageBody = message.content.slice(prefix.length);
    const command = messageBody.toLowerCase();

    if(command === "clear"){
        message.channel.bulkDelete(100);
    }

    if(command === "perdedor"){ 
        (async function(){
        let stringtoReply;

        stringtoReply =  await lolFunctions.computarPerdedor(fetch);
        message.reply(stringtoReply);  
        })();          
    }
   
});

