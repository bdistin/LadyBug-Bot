const { Command } = require("klasa");

class Presence extends Command {
  constructor(...args) {
    super(...args, {
      description: "Changes bot presence.",
      permissionLevel: 10,
      usage: "<clear|presence:string>",
      aliases: ["setpresence", "game", "setgame", "status"]
    });
  }
  
  async run(msg, [presence]) {
    if(presence === "clear") {
      await this.client.user.setActivity(null);
      return msg.send("Cleared presence.");
    }
    const type = "type" in msg.flags ? this.resolveType(msg.flags.type) : "PLAYING";
    const status = "status" in msg.flags ? this.resolveStatus(msg.flags.status) : null;
    presence = presence
      .replace(/{users}/g, this.client.users.size)
      .replace(/{guilds}/g, this.client.guilds.size)
      .replace(/{channels}/g, this.client.channels.size)
      .replace(/{prefix}/g, this.client.options.prefix);
    const options = {};
    if(type) options.type = type;
    if(type === "STREAMING") options.url = msg.flags.url || "https://twitch.tv/a";
    await this.client.user.setActivity(presence.trim(), options);
    if(status) await this.client.user.setStatus(status);
    return msg.send(`Changed presence to: ${type.toLowerCase()} **${presence.trim()}**${status ? `, Status: **${status}**` : ""}`);
  }
  
  resolveType(str) {
    if(!["stream", "streaming", "listening", "watching", "playing", "play", "watch", "listen"].includes(str.toLowerCase())) throw "Invalid type.";
    switch(str.toLowerCase()) {
      case "stream":
      case "streaming":
        return "STREAMING";
      case "play":
      case "playing":
        return "PLAYING";
      case "watch":
      case "watching":
        return "WATCHING";
      case "listening":
      case "listen":
        return "LISTENING";
    }
  }
  
  resolveStatus(str) {
    if(!["online", "offline", "idle", "dnd", "away"].includes(str.toLowerCase())) throw "Invalid status.";
    if(str.toLowerCase() === "away") return "idle";
    return str.toLowerCase();
  }
}

module.exports = Presence;