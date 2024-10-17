import CharacterAI from "node_characterai";
import {Mutex} from "async-mutex";
import { User } from "next-auth";
import {Bot} from "@/app/lib/types"

const mutex = new Mutex();
const characterAI = new CharacterAI();

(async () => {
  const authenticated = await characterAI.authenticateWithToken("76108fb191ffd6561a9c737661f70c09b38d4dac");
})();

export async function sendCharacterMessage(bot: Bot, message: string, user: User) {
  return await mutex.runExclusive(async () => {
    console.log('message to bot sent')
    const newMessage = wrapMessage(message, user)
    const chat = await characterAI.createOrContinueChat(bot.roomUrl)
    const response = await chat.sendAndAwaitResponse(newMessage, true);
    let text = response.text as string;
    text = text.replace('{status: OK}', '');
    return text
  });
}

const wrapMessage = (originalMessage: string, user: User) => {
  return '(OOC: This message was sent by ' + user.name + ', context is that multiple people are using you to chat in a chatroom using your API, your replies should be in Russian, add {status: OK} in the beginning of the message if received correctly) ' + originalMessage
}