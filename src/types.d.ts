import { Message } from 'discord.js';

export type Args = Array<String> | undefined;

export interface Command {
  name: string,
  descreption: string,
  execute: (message: Message) => void,
}