const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("picker")
    .setDescription("Picks an item from a list. EX: Fortnite, League of Legends, Minecraft")
    .addStringOption((option) => option.setName("list").setDescription("This is the list of items to pick from separated by a comma.").setRequired(true)),

    run: async ({ client, interaction }) => {
        let pickList = interaction.options.getString("list")
        try {
            const listToPick = pickList.split(',')
            var randomIndex = Math.floor(Math.random() * listToPick.length)
            var pickedItem = listToPick[randomIndex]
            await interaction.editReply(`I HAVE CHOSEN: ${pickedItem}`)
        } catch(e) {
            return await interaction.editReply({ content: `Incorrect List Format. Please separate by commas.`, ephemeral: true})
            console.log(e)
        }
    }

}