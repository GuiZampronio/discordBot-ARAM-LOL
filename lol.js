const config = require("./config.json");
const players = require("./players.json");

const Key = config.RIOT_KEY;
const KobaId = players[0].id;
const aramid = 450;

async function getPlayerPerdedor(playersDamages, playersName){
    let smallerDamage = playersDamages[0];
    let playerIndex;
    let playerMamador;
    
    playersDamages.forEach((element, index) => {
        if(element <= smallerDamage){
            smallerDamage = element;
            playerIndex = index;
        }    
    })

    playerMamador = playersName[playerIndex].name;

    return playerMamador;
}

async function getPlayersDamages(match, playersName){
    let playersDamages = [];
    let damage;
    
    playersName.forEach(element => {
        damage = (match.info.participants).find(value => JSON.stringify(element.id) == JSON.stringify(value.puuid))
        playersDamages.push(damage.totalDamageDealtToChampions);
    })

    return playersDamages;
}

async function getPlayersChampions(match, playersName){
    let playersChampions = [];
    let champion;
    
    playersName.forEach(element => {
        champion = (match.info.participants).find(value => JSON.stringify(element.id) == JSON.stringify(value.puuid))
        playersChampions.push(champion.championName);
    })

    return playersChampions;

}

async function getPlayersNames(match){
    let playersMamada = [];
    let playersinGame = [];
    let playerId;
    let playersNames = [];

    (match.metadata.participants).forEach(element => playersinGame.push(element));
    
    players.forEach(element => {
        playerId = playersinGame.find(value => JSON.stringify(value) == JSON.stringify(element.id)); 
        if(playerId != undefined){playersMamada.push(playerId)};
    });

    playersMamada.forEach(element => {
        players.forEach(value => {
            if(JSON.stringify(value.id) == JSON.stringify(element)){
                playersNames.push(value); 
            }
        });      
    });
    
    return playersNames;
}

async function getAramMatch(fetch, validGameId){
    const link = `https://americas.api.riotgames.com/lol/match/v5/matches/${validGameId}?api_key=${Key}`;
    let response = await fetch(link);
    response = await response.json();

    return response;

}

async function chooseValidGame(matchesArray){
    let filterArray = [];
    let amountPlayersMamada = 0;
    let i, j;
    let possibleMatches = [];
    let validGame = "BR_0";
    
    matchesArray.forEach(element => {
        if(!filterArray.some(value => JSON.stringify(value) == JSON.stringify(element))){
             filterArray.push(element);       
        }
    });


    for(i = 0; i < filterArray.length; i++){
        for(j = 0; j < matchesArray.length; j++){
            if(JSON.stringify(filterArray[i]) == JSON.stringify(matchesArray[j])){
                amountPlayersMamada++;
            }
            if(amountPlayersMamada == 3){
                possibleMatches.push(filterArray[i]);
                break;
            }
        }
        amountPlayersMamada = 0;   
    }

    for(i = 0; i < possibleMatches.length; i++){
        if(JSON.stringify(possibleMatches[i]) > validGame){
            validGame = possibleMatches[i];
        }
    }

    return validGame;

}

async function getLastAramMatches(fetch){
    let matchesArray = [];
    let link, response, i;
    
    for(i = 0; i < players.length; i++){
        link = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${players[i].id}/ids?queue=${aramid}&start=0&count=1&api_key=${Key}`;
        response = await fetch(link);
        response = await response.json()
        matchesArray.push(response)
    }
    
    return matchesArray;
}

async function getLastAramMatch(fetch){
    const link = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${KobaId}/ids?queue=${aramid}&start=0&count=10&api_key=${Key}`;
    let response = await fetch(link);
    
    response = await response.json();
    return response;
}

async function getKobaCharacter(fetch, matchId){
    let indexParticipantKoba;
    let indexMatchId = 0;
    let championKoba = []


    while(indexMatchId != 10){
        const link = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId[indexMatchId]}?api_key=${Key}`;
        let response = await fetch(link);
        response = await response.json();
        for(indexParticipantKoba = 0; indexParticipantKoba < 10; indexParticipantKoba++){
            if(KobaId == response.metadata.participants[indexParticipantKoba]){
                break;
            }
        }
        championKoba.push(response.info.participants[indexParticipantKoba].championName);
        indexMatchId++;
    }

    return championKoba;
}

async function computarPerdedor(fetch){
    let matchesArray = [];
    let validGameId;
    let match;
    let playersName = []; 
    let playersChampions = [];
    let playersDamages = [];
    let playerMamador;
    let stringFinal = "";
    let stringInformations = "";

    matchesArray = await getLastAramMatches(fetch);
    validGameId = await chooseValidGame(matchesArray);
    match = await getAramMatch(fetch, validGameId);
    playersName = await getPlayersNames(match);
    playersChampions = await getPlayersChampions(match, playersName);
    playersDamages = await getPlayersDamages(match, playersName);
    playerMamador = await getPlayerPerdedor(playersDamages, playersName);

    playersName.forEach((element, index) => {
        stringInformations = stringInformations.concat(JSON.stringify(element.name), ":\n", "Campeão: ", JSON.stringify(playersChampions[index]), 
        "\n", "Dano: ", JSON.stringify(playersDamages[index]), "\n\n")    
    })

    stringFinal = stringFinal.concat("Informações sobre o ultimo ARAM  :", "\n\n"
    , stringInformations, "PARABÉNS ", playerMamador, " VOCÊ PERDEU!");

    //console.log(stringFinal);

    return stringFinal;
}

module.exports = {getLastAramMatch, getKobaCharacter, computarMamada};

