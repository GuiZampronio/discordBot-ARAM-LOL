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

    if(command === "conezilla"){
        message.reply("CARECA");
    }

    if(command === "clear"){
        message.channel.bulkDelete(100);
    }

    if(command === "tobalol"){
        let matchId = [];
        let championKoba = [];

        (async function(){
            matchId = await lolFunctions.getLastAramMatch(fetch);
            championKoba = await lolFunctions.getKobaCharacter(fetch, matchId);
            message.reply(`Os ultimos dez campeões usados pelo Tobalol em ARAM foram os seguintes:\n${championKoba}`);
        })(); 
    }

    if(command === "mamou"){ 
        (async function(){
        let stringtoReply;

        stringtoReply =  await lolFunctions.computarMamada(fetch);
        message.reply(stringtoReply);  
        })();          
    }
   
});

