"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = require("../../config/config.json");
class Embed extends discord_js_1.MessageEmbed {
    constructor(opt) {
        super(opt);
        this.setColor(config_json_1.color);
        this.setFooter(config_json_1.footer);
    }
}
exports.Embed = Embed;
