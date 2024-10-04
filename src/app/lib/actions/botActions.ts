import {sendMessage} from "@/app/lib/actions/message";
import {normalizeString} from "@/app/lib/actions";
import { Bot } from "../types";
import prisma from "@/app/lib/prisma";
import { sendCharacterMessage } from "../charAi";


const chatMap: Map<string, NodeJS.Timeout| null> = new Map();

export async function requestBotResponse(message: string, chatId: string, bot: Bot, adapterArray: {id:string}[], userId: string) {
    let response: string | null = null;
    if (bot.botPurpose === 'autosend') {
        const normalizedMessage = await normalizeString(message);
        const isChatRemembered = chatMap.has(chatId);
        if (!isChatRemembered) {
            chatMap.set(chatId, null)
        }
        const botIntervalId = chatMap.get(chatId)
        if (normalizedMessage === 'start') {
            if (!botIntervalId) {
                await sendMessage('test', chatId, bot.id, adapterArray)
               /*  const intervalId = setInterval(async () => {
                    await sendMessage('test', chatId, bot.id, adapterArray)
                }, 5000)
                chatMap.set(chatId, intervalId) */
            }
        } else if (normalizedMessage === 'end') {
            if (botIntervalId) {
                clearInterval(botIntervalId);
                chatMap.set(chatId, null);
                await sendMessage('stop-test', chatId, bot.id, adapterArray)
            }
        }
    } else {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        const characterResponse = await sendCharacterMessage(bot, message, user)
        response = await sendMessage(characterResponse, chatId, bot.id, adapterArray)
        return response
    }
}