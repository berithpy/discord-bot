import { SlashCommandBuilder } from '@discordjs/builders';
import getRandomEmoji from "../utils.js";
export default {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll')
        .addStringOption(option =>
            option.setName('header')
                .setDescription('The header of the poll')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The options space delimited')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mention')
                .setDescription('The user or role to mention')
                .setRequired(false)),
    async execute(interaction) {
        const input = interaction.options.get("input")
        const header = interaction.options.get("header")
        const mention = interaction.options.get("mention")
        const pollOptions = input.value.split(" ")
        let reactions = []
        let response = header.value + "\n"
        for (let index = 0; index < pollOptions.length; index++) {
            const randomEmoji = getRandomEmoji();
            const copt = pollOptions[index];
            reactions.push(randomEmoji)
            response += randomEmoji + copt + "\n"
        }
        if (mention) {
            response += mention.value
        }
        await interaction.reply(response);
        const message = await interaction.fetchReply();
        for (let index = 0; index < reactions.length; index++) {
            const r = reactions[index];
            message.react(r)
        }
    },
};
