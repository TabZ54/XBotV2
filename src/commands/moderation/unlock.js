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
exports.info = exports.run = void 0;
const Embed_1 = require("../../util/Embed");
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = message.channel;
    channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SEND_MESSAGES: true
    });
    channel.send({
        embeds: [
            new Embed_1.Embed()
                .setTitle("Channel Unlocked")
                .setDescription("This channel has been locked by administration.")
        ]
    });
});
exports.run = run;
exports.info = {
    name: "unlock",
    permission: "admin"
};
