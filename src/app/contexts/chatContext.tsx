import {createContext, Dispatch, SetStateAction, useState} from "react";
import React from "react";
import {Chat, MessageHistoryResponse} from "@/app/lib/types";
import {Message} from "@/app/lib/types";
import {makeAutoObservable} from "mobx";
import {adapter} from "next/dist/server/web/adapter";

class ChatContextObject {
    currentChat: Chat | null;
    chatList: Chat[];
    switchedTabs: boolean;
    switchedTabsSetter: Dispatch<SetStateAction<boolean>>;

    constructor() {
        makeAutoObservable(this)
    }

    updateChatList(newChatList: Chat[]) {
        this.chatList = newChatList;
    }

    setCurrentChat(chat: Chat) {
        this.currentChat = chat;
    }

    handleNewMessageHistory(messageHistory: MessageHistoryResponse) {
        let unreadMessagesMap = new Map;
        if (messageHistory.success && messageHistory.messageHistory) {
            for (const adapter of messageHistory.messageHistory.adapters) {
                for (const unreadMessage of adapter.toUnreadMessages) {
                    unreadMessagesMap.set(unreadMessage.id, true)
                }
            }
            unreadMessagesMap.forEach((value, key) => {
                for (const message of messageHistory.messageHistory?.messages) {
                    if (message.id === key) {
                        message.unread = true;
                    }
                }
            })
            if (this.currentChat && this.currentChat.id === messageHistory.messageHistory.chatId) {
                this.currentChat.messages = messageHistory.messageHistory.messages;
            } else {
                const chat = this.chatList.find((chatInList) => {
                    if (chatInList.id === messageHistory.messageHistory?.chatId) {
                        return true
                    }
                    return false
                })
                if (chat) {
                    chat.messages = messageHistory.messageHistory.messages;
                }
            }
        } else if (!messageHistory.success) {
            console.log(messageHistory.errorMessage)
        }
    }
}

export interface chatContextInterface {
    currentChat: Chat | null;
    currentChatSetter: Dispatch<SetStateAction<Chat | null>> | null;
    changeMessageArray: Dispatch<SetStateAction<Message[]>> | null;
    currentMessageArray: Message[];
    chatList: Chat[] | null;
    chatListSetter: Dispatch<SetStateAction<Chat[] | null>> | null,
    switchedTabs: boolean;
    switchedTabsSetter: Dispatch<SetStateAction<boolean>> | null,
}

export const ChatContext = createContext<ChatContextObject | null>(null)


const ChatContextContainer = ({children}: React.PropsWithChildren) => {
    const [currentChat, updateCurrentChat] = useState<Chat | null>(null);
    const [currentMessageArray, editCurrentMessageArray] = useState<Message[]>([])
    const [chatList, updateChatList] = useState<Chat[] | null>(null);
    const [switchedTabs, switchedTabsSetter] = useState<boolean>(false)

    function changeCurrentChat(chat: Chat) {
        if (chatList) {
            const chatListCopy = chatList.slice(0)
            const oldChat = chatListCopy.find((oldChat) => oldChat === chat)
            oldChat.unread = 0;
            updateChatList(chatListCopy);
        }
        updateCurrentChat(chat);
        if (chat?.messages) {
            editCurrentMessageArray(chat?.messages!)
        }
    }

    return (
        <ChatContext.Provider value={{
            currentChat: currentChat,
            currentChatSetter: changeCurrentChat,
            changeMessageArray: editCurrentMessageArray,
            chatList: chatList,
            chatListSetter: updateChatList,
            currentMessageArray: currentMessageArray,
            switchedTabs: switchedTabs,
            switchedTabsSetter: switchedTabsSetter
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export {ChatContextContainer}
