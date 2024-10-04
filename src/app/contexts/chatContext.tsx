'use client'
import {createContext} from "react";
import React from "react";
import {Chat, Invite, MessageHistoryResponse, TypingInterface} from "@/app/lib/types";
import {Message} from "@/app/lib/types";
import {makeAutoObservable} from "mobx";

export class ChatContextObject {
    currentChat: Chat | null;
    chatList: Chat[];
    isTabSwitched: boolean;
    unreadChats: number;
    incomingInviteArray: Invite[];
    outgoingInviteArray: Invite[];

    constructor() {
        this.chatList = [];
        this.currentChat = null;
        this.isTabSwitched = false;
        this.unreadChats = 0;
        this.incomingInviteArray = [];
        this.outgoingInviteArray = [];
        makeAutoObservable(this)
    }

    setIsTabSwitched(state: boolean) {
        this.isTabSwitched = state;
    }

    setIncomingInviteArray(inviteArray: Invite[]) {
        this.incomingInviteArray = inviteArray;
    }

    setOutgoingInviteArray(inviteArray: Invite[]) {
        this.outgoingInviteArray = inviteArray;
    }

    updateChatList(newChatList: Chat[]) {
        this.chatList = newChatList;
        this.unreadChats = this.chatList.filter((chat) => {
            return chat.unread && chat.unread > 0
        }).length
    }

    setCurrentChat(chat: Chat | null) {
        this.currentChat = chat;
        this.isTabSwitched = true;
    }

    clearSelfUnread(chatId: string, selfId: string) {
        const chat = this.chatList.find((chat) => chat.id === chatId)
        if (chat) {
            for (const message of chat.messages) {
                if (message.unread !== false && message.fromId === selfId) {
                    message.unread = false;
                }
            }
        }
    }

    addMessage(message: Message, self: boolean) {
        const chat = this.chatList.find((chat) => chat.id === message.chatId)
        if (chat) {
            if (chat !== this.currentChat && !self) {
                if (chat.unread === 0) {
                    this.unreadChats++
                }
                chat.unread!++
                message.unread = true;
            } else if (self) {
                setTimeout(() => {
                    const addedMessage = chat.messages.find(mes => mes.id === message.id)
                    if (addedMessage && addedMessage.unread !== false) {
                        addedMessage.unread = true;
                    }
                }, 330)
            }
            chat.messages = [...chat.messages, message];
            chat.lastMessage = message;
            chat.lastMessage.unread = true
            console.log(chat)
            if (chat !== this.currentChat && !self) { 
                return false
            }
            return true
        }
        return false
    }

    checkAndChangeWritingArray(typingObject: TypingInterface, add: boolean) {
        let chat: Chat | null | undefined;
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
        const unreadMessagesMap = new Map;
        console.log(messageHistory)
        if (messageHistory.success && messageHistory.messageHistory) {
            for (const adapter of messageHistory.messageHistory.membersAdapters) {
                for (const unreadMessage of adapter.toUnreadMessages) {
                    unreadMessagesMap.set(unreadMessage.id, true)
                }
            }
            unreadMessagesMap.forEach((value, key) => {
                if (messageHistory.messageHistory?.messages) {
                    for (const message of messageHistory.messageHistory?.messages) {
                        if (message.id === key) {
                            message.unread = true;
                        }
                    }
                }
            })
            if (this.currentChat && this.currentChat.id === messageHistory.messageHistory.chatId) {
                this.currentChat.messages = messageHistory.messageHistory.messages;
                if (this.currentChat.unread && this.currentChat.unread > 0 && this.unreadChats > 0) {
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
