const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("listcommands").setDescription("Lists all commands in chat"),
	run: async ({ client, interaction }) => {
        await interaction.editReply(`These are the following commands:
        \n/play song [URL] - This command will play a song from a youtube url
        \n/play playlist [Playlist URL] - This command will queue all videos within a youtube playlist
        \n/play search [Search Keywords] - This command will play the first youtube video from the search
        \n/pause
        \n/resume
        \n/skip
        \n/skipto [Track Number in Queue]
        \n/shuffle
        \n/info
        \n/queue
        \n/quit
        \n/listcommands`)
	},
}