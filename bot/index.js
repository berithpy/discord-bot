import dotenv from 'dotenv';
import _ from 'lodash';
import { Client, Collection, Intents } from 'discord.js';
import * as commands from './commands/index.js'
import * as events from './events/index.js'
dotenv.config();
const token = process.env.LOGIN_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

for (const key in commands) {
    if (Object.hasOwnProperty.call(commands, key)) {
        const command = commands[key];
        client.commands.set(command.data.name, command);
    }
}

for (const key in events) {
    if (Object.hasOwnProperty.call(events, key)) {
        const event = events[key];
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

    }
}

client.login(token);