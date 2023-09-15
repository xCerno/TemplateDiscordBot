const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Loads Songs from Youtube")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("song")
                .setDescription("Loads a single song from a url")
                .addStringOption((option) => option.setName("url").setDescription("The Song's URL").setRequired(true))
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist of songs from a url")
                .addStringOption((option) => option.setName("url").setDescription("The Playlist's URL").setRequired(true))
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("search")
                .setDescription("Searches for Song based on provided keywords")
                .addStringOption((option) => option.setName("searchterms").setDescription("The Search Keywords").setRequired(true))
        ),
        run: async ({ client, interaction }) => {
            if (!interaction.member.voice.channel)
                return interaction.editReply("You need to be in an VC to use this command")

            const queue = await client.player.createQueue(interaction.guild)
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new EmbedBuilder()

            if (interaction.options.getSubcommand() === "song") {
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No Results")
                
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}` })
            } else if (interaction.options.getSubcommand() === "playlist") {
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No Results")
                
                const playlist = result.playlist
                await queue.addTracks(result.tracks)
                embed
                    .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** has been added to the Queue`)
                    .setThumbnail(playlist.thumbnail)
            } else if (interaction.options.getSubcommand() === "search") {
                let url = interaction.options.getString("searchterms")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No Results")
                
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}` })
            }
            if (!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed]
            })
        }

}