//SuperBot par EdwardT
const Discord = require("discord.js")
const bot = new Discord.Client()

const prefix = process.env.prefix
const charSpace = " "
const permission = process.env.permission
const informationTime = process.env.informationTime
const errorTime = process.env.errorTime
const spamTime = process.env.spamTime
let muted = []
let spammer = []
const timers = []

try
{
	bot.login(process.env.token)
} catch(error)
{
	console.error(error)
}

//Bot
bot.on("ready", () => {
	console.info(`Logged in as ${bot.user.tag}`)
})

bot.on("message", async command => {
	if(command.author.equals(bot.user) || command.guild === null) return
	//Muted
	for(loopPlayer of muted)
	{
		//ByPassMuteCommands
		if(command.author.username == loopPlayer && (!command.content.startsWith(prefix+"mute") && !command.content.startsWith(prefix+"unmute")))
		{
			command.delete(0)
			.then(() => {
				command.author.send("Impossible d'envoyer ce message car vous êtes muet")
				.then(messageReply => {
					messageReply.delete(informationTime)
				})
			})
			return
		}
	}
	//Spam
	if(spammer.includes(command.author))
	{
		command.delete(0)
		.then(() => {
			command.reply("Impossible d'envoyer deux messages aussi vite")
			.then(messageReply => {
				messageReply.delete(errorTime)
			})
		})
		return
	} else {
		spammer.push(command.author)
		timers.push(setInterval(() => {
			const index = spammer.indexOf(command.author)
			spammer = spammer.slice(index+1)
		}, spamTime))
	}
	//Fields
	const senderArgs = command.content.split(charSpace)
	const membersList = command.guild.members.array()
	const roles = command.guild.member(command.author).roles.array()
	let autorized = false
	let textArg
	let numberArg
	//Commands
	switch(senderArgs[0].toLowerCase())
	{
		case prefix+"mute":
			for(role of roles)
			{
				if(role.name.toLowerCase() == permission.toLowerCase())
				{
					autorized = true
					break
				}
			}
			command.delete(0)
			.then(() => {
				if(autorized)
				{
					textArg = senderArgs.slice(1).join(charSpace)
					if(textArg.length > 0)
					{
						for(member of membersList)
						{
							let muting = member.user.username
							if(muting == senderArgs[1])
							{
								muted.push(muting)
								command.reply(muting+" rendu muet")
								.then(messageReply => {
									messageReply.delete(informationTime)
									.then(() => {
										command.author.send("Les membres muets sont :\n"+muted.join(", "))
									})
								})
							}
						}
					} else {
						command.reply("Vous devez spécifier un utilisateur à rendre muet")
						.then(messageReply => {
							messageReply.delete(errorTime)
							.then(() => {
								command.author.send("La syntaxe de la commande:\n```css\n"+prefix+"mute <user>\n```")
								.then(messagePrivate => {
									messagePrivate.delete(informationTime)
								})
							})
						})
					}
				} else {
					command.reply("Vous n'avez pas la permission requise")
					.then(messageReply => {
						messageReply.delete(errorTime)
					})
				}
			})
			break
		case prefix+"unmute":
			for(role of roles)
			{
				if(role.name.toLowerCase() == permission.toLowerCase())
				{
					autorized = true
					break
				}
			}
			command.delete(0)
			.then(() => {
				if(autorized)
				{
					textArg = senderArgs.slice(1).join(charSpace)
					if(textArg.length > 0)
					{
						for(member of membersList)
						{
							let unmuting = member.user.username
							if(unmuting == senderArgs[1])
							{
								if(muted.includes(unmuting))
								{
									const index = muted.indexOf(unmuting)
									muted = muted.slice(index+1)
									command.reply(unmuting+" rendu parlant")
									.then(messageReply => {
										messageReply.delete(informationTime)
										.then(() => {
											command.author.send("Les membres muets sont :\n"+muted.join(", "))
										})
									})
								} else {
									command.reply("L'utilisateur spécifié n'est pas muet")
									.then(messageReply => {
										messageReply.delete(errorTime)
										.then(() => {
											command.author.send("Les membres muets sont :\n"+muted.join(", "))
											.then(messagePrivate => {
												messagePrivate.delete(informationTime)
											})
										})
									})
								}
							}
						}
					} else {
						command.reply("Vous devez spécifier un utilisateur à rendre parlant")
						.then(messageReply => {
							messageReply.delete(errorTime)
							.then(() => {
								command.author.send("La syntaxe de la commande:\n```css\n"+prefix+"unmute <user>\n```")
								.then(messagePrivate => {
									messagePrivate.delete(informationTime)
								})
							})
						})
					}
				} else {
					command.reply("Vous n'avez pas la permission requise")
					.then(messageReply => {
						messageReply.delete(errorTime)
					})
				}
			})
			break
		case prefix+"list":
			command.delete(0)
			.then(() => {
				command.author.send("Les membres sont :\nPseudos :"+membersList.join(", ")+"\n========== ========== ==========")
				.then(() => {
					command.author.send("Les membres muets sont :\n"+muted.join(", ")+"\n========== ========== ==========")
				})
			})
			break
		case prefix+"cls":
			command.delete(0)
			.then(() => {
				command.author.send("Suppression des messages ICI...")
				.then(messagePrivate => {
					messagePrivate.channel.fetchMessages()
					.then(messagesToDelete => {
						const messagesToDeleteList = messagesToDelete.array()
						for(messageToDelete of messagesToDeleteList)
						{
							messageToDelete.delete()
						}
					})
				})
			})
			break
		case prefix+"bc":
			textArg = senderArgs.slice(1).join(charSpace)
			if(textArg.length > 0)
			{
				command.channel.send(textArg)
				.then(() => {
					command.delete(0)
				})
			} else {
				command.reply("Impossible d'envoyer un message vide")
				.then(messageReply => {
					messageReply.delete(errorTime)
					.then(() => {
						command.delete(0)
						.then(() => {
							command.author.send("La syntaxe de la commande:\n```css\n"+prefix+"bc <text>\n```")
							.then(messagePrivate => {
								messagePrivate.delete(informationTime)
							})
						})
					})
				})
			}
			break
		case prefix+"tbc":
			numberArg = senderArgs[1]*1000
			textArg = senderArgs.slice(2).join(charSpace)
			if(textArg.length > 0)
			{
				command.channel.send(textArg)
				.then(messageReply => {
					command.delete(0)
					.then(() => {
						messageReply.delete(numberArg)
					})
				})
			} else {
				command.reply("Impossible d'envoyer un message vide")
				.then(messageReply => {
					messageReply.delete(errorTime)
					.then(() => {
						command.delete(0)
						.then(() => {
							command.author.send("La syntaxe de la commande:\n```css\n"+prefix+"tbc <number_seconde> <text>\n```")
							.then(messagePrivate => {
								messagePrivate.delete(informationTime)
							})
						})
					})
				})
			}
			break
	}
})
