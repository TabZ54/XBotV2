"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config/config.json");
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
const permissions_json_1 = __importDefault(require("../config/permissions.json"));
const Ticket_1 = __importDefault(require("./util/Ticket"));
const Embed_1 = require("./util/Embed");
const readFiles = util_1.promisify(glob_1.default);
const client = new discord_js_1.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
});
const commands = new discord_js_1.Collection();
client.login(config_json_1.token);
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    const commandFiles = yield readFiles(process.cwd() + "/src/commands/**/*{.ts,.js}");
    commandFiles.map((value) => __awaiter(void 0, void 0, void 0, function* () {
        const file = yield Promise.resolve().then(() => __importStar(require(value)));
        commands.set(file.info.name, file);
    }));
    console.log(`Logged in - ${client.user.tag}`);
}));
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    if (!message.content.startsWith(config_json_1.prefix))
        return;
    const args = message.content.substr(config_json_1.prefix.length).split(" ");
    const command = commands.get(args.shift().toLowerCase());
    if (command) {
        if (command.info.permission && !message.member.roles.cache.some(r => permissions_json_1.default.find(r => r.key == command.info.permission).roleIds.includes(r.id)))
            return;
        command.run(client, message, args);
    }
}));
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isButton()) {
        switch (interaction.customId) {
            case "verifyTicket":
                const member = interaction.member;
                member.roles.add(config_json_1.verifiedRoleId);
                break;
            case "claim_ticket":
                if (interaction.message && interaction.message.embeds[0]) {
                    const channelId = interaction.message.embeds[0].fields[0].value.replace("<#", "").replace(">", "");
                    const channel = interaction.guild.channels.cache.get(channelId);
                    if (!channel)
                        return;
                    interaction.message.delete();
                    channel.permissionOverwrites.create(interaction.member, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true
                    });
                    channel.send(interaction.member.toString()).then(del => {
                        setTimeout(() => del.delete(), 3 * 1000);
                    });
                }
                break;
        }
    }
}));
client.on("messageReactionAdd", (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.bot)
        return;
    const message = reaction.message;
    const member = yield message.guild.members.fetch(user.id);
    if (message.partial) {
        try {
            yield message.fetch();
        }
        catch (error) {
            console.log(error.message);
        }
    }
    if (reaction.emoji.name == config_json_1.messages.panel.reaction && message.embeds[0] && message.embeds[0].title == config_json_1.messages.panel.title) {
        yield reaction.users.remove(member);
        Ticket_1.default(message.guild, member);
    }
}));
client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.cache.get(config_json_1.welcome_channel_id);
    if (!channel)
        return;
    channel.send({
        embeds: [
            new Embed_1.Embed()
                .setTitle(config_json_1.messages.welcome.title.replace(`%user%`, member.user.username))
                .setDescription(config_json_1.messages.welcome.description.replace(`%user%`, member.user.username))
                .setFooter(config_json_1.messages.welcome.footer)
                .setThumbnail(config_json_1.messages.welcome.imgUrl)
        ]
    });
});
