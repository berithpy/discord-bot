import dotenv from 'dotenv';
import _ from 'lodash';
import abcToEmoji from './regionalEmojiTranslator';
import discord from 'discord.js';
dotenv.config();
const client = new discord.Client();
const WAKESYMBOL = ">";
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
const TYPES = {
  TEXT:"text",
  RAFFLE:"raffle",
  REACT:"react",
  MUSIC:"music"
};
const ACTIONS = {
  git:{
    type: TYPES.TEXT,
    template:_.template("gud")
  },
  ligma:{
    type: TYPES.RAFFLE,
    template: _.template(" <@<%= userID %>> has been banned for having LIGMA.")
  },
  raffle:{
    type: TYPES.RAFFLE,
    template:_.template("🤔")
  },
  ping:{
    type: TYPES.TEXT,
    template:_.template("pong")
  },
  echo:{
    type: TYPES.TEXT,
    template:_.template("<%= content %>")
  },
  users:{
    type:TYPES.TEXT,
    template:_.template("Disabled")
  },
  help:{
    type: TYPES.TEXT,
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

async function notImplemented(msg){
  msg.react('🤔');
  msg.reply('This action has not been implemented.');
}

client.on('message',async msg => {
  if (_.startsWith(msg.content,WAKESYMBOL)) {
    let text = msg.content;
    text = text.slice(1,text.length);
    // incoming action
    const messageAction = text.split(" ")[0];
    const action = ACTIONS[messageAction.toLowerCase()];
    if(action === undefined){
      await notImplemented(msg);
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
      case TYPES.RAFFLE:
        msg.channel.send(action.template(templateData));
        break;
      case TYPES.TEXT:
        msg.reply(action.template(templateData));
        break;
      case TYPES.REACT:
        abcToEmoji(templateData.content.replace(/ /g,'')).forEach(async emoji =>{
          await msg.react(emoji);
        });
        break;
      default:
        await notImplemented(msg);
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
console.log(process.env.LOGIN_TOKEN)
client.login(process.env.LOGIN_TOKEN);
