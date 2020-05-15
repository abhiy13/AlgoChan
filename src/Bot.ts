import { Client, Message } from 'discord.js';
import Collection from '@discordjs/collection';
import fs from 'fs';
import { Command } from './types';

export class Bot extends Client {
  private commands: Collection<string, Command>;  
  private PREFIX = '~';
  
  /**
   * Bot constructor
   * @param token BOT_TOKEN
   */
  constructor(token: string) {
    super();
    this.login(token);
    this.commands = new Collection();
  }

  /**
   * Configures The Bot
   */
  Config() {
    const files = fs.readdirSync('./src/commands')
      .filter(file => file.endsWith('_cmd.ts'));
    
    for(const file of files) {
      const cmd = require(`./commands/${file}`);
      this.commands.set(cmd.name, cmd);
    }
  }

  /**
   * Resolves a recieved command
   * @param command the command
   * @param message Message Object
   */  
  Resolve(command: string, message: Message) {
    const cmd = this.commands.get(command);
    if(cmd === undefined) return;
    cmd.execute(message);
  }

  /**
   * Run Once the bot is Ready
   */
  handleReady() {
    if(!this.user) return;
    this.user.setActivity('Playing AlgoBox', {type: 'PLAYING'});
    console.log('Bot is Now Online');
  }

  /**
   * Run On getting messages 
   */
  handleMessage(message: Message) {
    const { content } = message;
    if(!content.startsWith(this.PREFIX) || message.author.bot) return;
    const cmd = content.split(' ')[0].slice(1);
    try {
      this.Resolve(cmd, message);
    } catch (e) {
      console.log(e);
      message.reply(e);
    }
  }

  /**
   * Starts the bot
   */
  Main() {

    // Configure the bot
    this.Config();

    // Once the Bot is ready
    this.once('ready', () => {
      this.handleReady();
    });

    // At every message
    this.on('message', (message: Message) => {
      this.handleMessage(message);
    });
  }
};