import dotenv from 'dotenv';
import { REST } from '@discordjs/rest'
import { Routes } from "discord-api-types/v9"
import * as commands from './commands/index.js'
dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.LOGIN_TOKEN;

const commandsArray = []

for (const key in commands) {
    if (Object.hasOwnProperty.call(commands, key)) {
        const command = commands[key];
        commandsArray.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commandsArray },
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();