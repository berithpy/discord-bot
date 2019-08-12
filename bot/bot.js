require('dotenv').config();
const _ = require('lodash');
const abcToEmoji = require('./regionalEmojiTranslator')
const Discord = require('discord.js');
const client = new Discord.Client();
const WAKESYMBOL = ">";
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
const TYPES = {
  TEXT:"text",
  RAFFLE:"raffle",
  ECHO:"echo",
  HELP:"help",
  REACT:"react"
};
const ACTIONS = {
  git:{
    type: TYPES.TEXT,
    template:"gud"
    },
  ligma:{
    type: TYPES.RAFFLE,
    template: _.template(" <%= userID %> has been banned for having LIGMA.")
  },
  raffle:{
    type: TYPES.RAFFLE,
    template:_.template("🤔")
  },
  ping:{
    type: TYPES.ECHO,
    template:_.template("pong")
  },
  echo:{
    type: TYPES.ECHO,
    template:_.template("<%= content %>")
  },
  users:{
    type:TYPES.ECHO,
    template:_.template("Disabled")
  },
  help:{
    type: TYPES.HELP,
    template: _.template("Available commands: \n <%= commands %>") 
  },
  music:{
    type: TYPES.MUSIC,
    template: _.template("Playing <%= song=>")
  },
  react:{
    type: TYPES.REACT,
  }
};

// Recursive react to write under peoples names.
function reactArray(array,msg) {
  if(array.length === 0) return;
  const current = array.shift();
  msg.react(current).then(reactArray(array,msg));
}

client.on('message', msg => {
  if (_.startsWith(msg.content,WAKESYMBOL)) {
    let text = msg.content;
    text = text.slice(1,text.length);
    // incoming action
    const messageAction = text.split(" ")[0];
    const action = ACTIONS[messageAction.toLowerCase()];
    if(action === undefined){
      msg.react('🤔');
      msg.reply('This action has not been implemented.');
      return;
    }
    // template data
    // Removes bot users from the users cache
    client.users.sweep(u=>{
      if(u.bot){
        return u;
      }
    });
    const templateData = {
      userID:client.users.random(),
      content: msg.content.replace(WAKESYMBOL+messageAction+' ',''),
      commands: Object.keys(ACTIONS).join("\n"),
      allUsers: client.users.map(u=>u.tag+String(u.bot)),
    };
    switch (action.type) {
      case TYPES.TEXT:
        msg.reply(action.template(templateData));
        break;
      case TYPES.RAFFLE:
        msg.channel.send(action.template(templateData));
        break;
      case TYPES.ECHO:
        msg.reply(action.template(templateData));
        break;
      case TYPES.HELP:
        msg.reply(action.template(templateData));
        break;
      case TYPES.MUSIC:
        msg.reply(action.template(templateData));
        break;
      case TYPES.REACT:
        reactArray(abcToEmoji(templateData.content.replace(' ','')),msg);
        break;
      default:
        msg.reply('This action has not been implemented.');
        msg.react('🤔');
        break;
    }
  }
});

// TODO Move this to the music type action
client.on("ready", () => {
  const channel = client.channels.get("<we should replace this with the channel of the asking user>");
  if (!channel) return console.log("The channel does not exist!");
  channel.join().then(connection => {
    // Yay, it worked!
    // connection.play('/local.mp3');
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
  });
});

client.login(process.env.LOGIN_TOKEN);
