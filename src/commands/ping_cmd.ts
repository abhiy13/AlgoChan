import { Message } from 'discord.js';

module.exports =  {
  name: 'ping',
  descreption: 'reply to ping',
  execute(message: Message) {
    message.channel.send('Pong');
  }
};