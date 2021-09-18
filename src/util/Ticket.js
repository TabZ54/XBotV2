"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("../../config/config.json");
const Embed_1 = require("./Embed");
function default_1(guild, member) {
    const claimChannel = guild.channels.cache.get(config_json_1.tickets_claim_channel);
    guild.channels.create(`ticket-${member.user.tag}`, {
        parent: config_json_1.tickets_category,
        permissionOverwrites: [{
                id: guild.id,
                deny: ['VIEW_CHANNEL']
            }, {
                id: member.id,
                allow: ['VIEW_CHANNEL']
            }]
    }).then((channel) => __awaiter(this, void 0, void 0, function* () {
        channel.send({
            embeds: [
                new Embed_1.Embed(config_json_1.messages.tickets.welcome)
            ]
        });
        claimChannel.send({
            embeds: [
                new Embed_1.Embed()
                    .setTitle("**Support Required**")
                    .setDescription("***Click on the button below to claim this support ticket*** \n\n **Paypal:** *mrcrackz@protonmail.com*\n\n *Make Sure its F&F* ")
                    .addField("Ticket", channel.toString())
            ],
            components: [
                new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton().setStyle("PRIMARY").setLabel("Claim").setCustomId("claim_ticket"))
            ]
        });
    }));
}
exports.default = default_1;
