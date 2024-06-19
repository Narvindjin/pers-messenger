import {sendMessage} from "@/app/lib/actions/message";
import {normalizeString} from "@/app/lib/actions";


const botMap: Map<string, number| null> = new Map();

export async function requestBotResponse(message: string, chatId: string, botId: string, adapterArray: {id:string}[], purpose: string) {
    let response;
    if (purpose === 'autosend') {
        const normalizedMessage = normalizeString(message);
        let isBotRemembered = botMap.has(botId);
        if (!isBotRemembered) {
            botMap.set(botId, null)
        }
        let botIntervalId = botMap.get(botId)
        if (normalizedMessage === 'start') {
            if (!botIntervalId) {
                await sendMessage('test', chatId, botId, adapterArray)
                botMap.set(botId, setInterval(async () => {
                    await sendMessage('test', chatId, botId, adapterArray)
                }, 5000))
            }
        } else if (normalizedMessage === 'end') {
            if (botIntervalId) {
                clearInterval(botIntervalId);
                botMap.set(botId, null);
                await sendMessage('stop-test', chatId, botId, adapterArray)
            }
        }
    } else {
        setTimeout(async () => {
            response = await sendMessage(message, chatId, botId, adapterArray)
        }, 1000)
        return response
    }
}