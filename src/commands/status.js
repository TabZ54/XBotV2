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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = exports.run = void 0;
const Embed_1 = require("../util/Embed");
const minecraft_server_util_1 = __importDefault(require("minecraft-server-util"));
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const host = args[0];
    const port = parseInt(args[1]) || 2556;
    if (isNaN(port)) {
        return message.reply({
            embeds: [
                new Embed_1.Embed()
                    .setTitle("Error")
                    .setDescription(`Please enter a valid port.`)
            ]
        });
    }
    minecraft_server_util_1.default.status(host, {
        port: port
    }).catch(err => {
        return message.reply({
            embeds: [
                new Embed_1.Embed()
                    .setTitle("Error")
                    .setDescription("Server not found.")
            ]
        });
    }).then((response) => {
        message.reply({
            embeds: [
                new Embed_1.Embed()
                    .setTitle("Status Fetched")
                    .addField("Server", `${host}:${port}`)
                    .addField("Players", `${response.onlinePlayers}/${response.maxPlayers}`)
            ]
        });
    });
});
exports.run = run;
exports.info = {
    name: "status"
};
