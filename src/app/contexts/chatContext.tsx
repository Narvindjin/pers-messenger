import {createContext} from "react";
import React from "react";
import {Chat, MessageHistoryResponse, TypingInterface} from "@/app/lib/types";
import {Message} from "@/app/lib/types";
import {makeAutoObservable} from "mobx";

export class ChatContextObject {
    currentChat: Chat | null;
    chatList: Chat[];
    isTabSwitched: boolean;
    unreadChats: number;
    inviteIdArray: string[];

    constructor() {
        this.chatList = [];
        this.currentChat = null;
        this.isTabSwitched = false;
        this.unreadChats = 0;
        this.inviteIdArray = []
        makeAutoObservable(this)
    }

    setIsTabSwitched(state: boolean) {
        this.isTabSwitched = state;
    }

    updateChatList(newChatList: Chat[]) {
        this.chatList = newChatList;
        this.unreadChats = this.chatList.filter((chat) => {
            return chat.unread > 0
        }).length
    }

    setCurrentChat(chat: Chat) {
        this.currentChat = chat;
        this.setIsTabSwitched(true)
    }

    addMessage(message: Message, self?: boolean) {
        const chat = this.chatList.find((chat) => chat.id === message.chatId)
        if (chat) {
            chat.messages.push(message);
            chat.lastMessage = message;
            if (chat !== this.currentChat && !self) {
                chat.lastMessage.unread = true;
                if (chat.unread === 0) {
                    this.unreadChats++
                }
                chat.unread++
            }
        }
    }

    checkAndChangeWritingArray(typingObject: TypingInterface, add: boolean) {
        let chat: Chat | null;
        if (this.currentChat?.id === typingObject.chatId) {
            chat = this.currentChat;
        } else {
            chat = this.chatList.find((chatToFind) => chatToFind.id === typingObject.chatId)
        }
        if (chat) {
            const adapterForUser = chat.membersAdapters.find((adapter) => adapter.user.id === typingObject.userId)
            if (adapterForUser) {
                const user = adapterForUser.user;
                if (add) {
                    if (!Array.isArray(chat.writingArray)) {
                        chat.writingArray = [user]
                    } else if (!chat.writingArray?.includes(user)) {
                        chat.writingArray.push(user);
                    }
                } else {
                    if (chat.writingArray) {
                        const indexOfUser = chat.writingArray.indexOf(user);
                        if (indexOfUser > -1) {
                            chat.writingArray.splice(indexOfUser, 1);
                            if (chat.writingArray.length < 1) {
                                chat.writingArray = null;
                            }
                        }
                    }
                }
            }
        }
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
                if (this.currentChat.unread > 0 && this.unreadChats > 0) {
                    this.unreadChats--
                }
                this.currentChat.unread = 0;
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

export const ChatContext = createContext<ChatContextObject | null>(null)


const ChatContextContainer = ({children}: React.PropsWithChildren) => {
    return (
        <ChatContext.Provider value={new ChatContextObject()}>
            {children}
        </ChatContext.Provider>
    )
}

export {ChatContextContainer}
