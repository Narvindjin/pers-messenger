import {sendMessage} from "@/app/lib/actions/message";

export async function requestBotResponse(message: string, chatId: string, botId: string, adapterArray: {id:string}[]) {
    let response;
    setTimeout(async () => {
        response =  await sendMessage(message, chatId, botId, adapterArray)
    }, 1000)
    return response
}