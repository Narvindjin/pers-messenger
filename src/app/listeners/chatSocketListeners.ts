import {chatContextInterface} from "@/app/contexts/chatContext";
import {SocketContextType} from "@/app/providers/socketProvider";
import {Chat, Message, MessageHistoryResponse, TypingInterface} from "@/app/lib/types";
import {UserInterface} from "@/app/contexts/userContext";

function checkAndChangeWritingArray(chat: Chat, typingObject: TypingInterface, add: boolean) {
                    const adapterForUser = chat.membersAdapters.find((adapter) => adapter.user.id === typingObject.userId)
                    if (adapterForUser) {
                        const user = adapterForUser.user;
                        if (add) {
                            if (!Array.isArray(chat.writingArray)) {
                                chat.writingArray = [user]
                                return true
                            } else if (!chat.writingArray?.includes(user)) {
                                chat.writingArray.push(user);
                                return true
                            }
                        } else {
                            if (chat.writingArray) {
                                const indexOfUser = chat.writingArray.indexOf(user);
                                if (indexOfUser > -1) {
                                    chat.writingArray.splice(indexOfUser, 1);
                                    if (chat.writingArray.length < 1) {
                                        chat.writingArray = null;
                                    }
                                    return true
                                }
                            }
                        }
                    }
                    return false
                }

export function initChatSocketListeners(context: chatContextInterface, socket: SocketContextType, userContext: UserInterface) {
    if (socket.socket) {
        socket.socket.removeAllListeners();
        socket.socket.on('server-message', (message: Message) => {
            if (context.chatList) {
                const chatListCopy = context.chatList.slice(0)
                const chat = chatListCopy.find((chat) => chat.id === message.chatId)
                if (chat) {
                    chat.lastMessage = message;
                    if (context.currentChat?.id !== message.chatId) {
                        chat.unread++
                    }
                    context.chatListSetter!(chatListCopy);
                } else {
                    socket.socket.emit('request-new-chat', message.fromId)
                }
                if (context.currentChat?.id === message.chatId) {
                    const newHistory = context.currentMessageArray.slice(0);
                    newHistory.push(message);
                    context.changeMessageArray!(newHistory);
                }
            }
        });
        socket.socket.on('server-typing', (typingObject: TypingInterface) => {
            if (context.currentChat?.id === typingObject.chatId) {
                const newCurrentChat = {...context.currentChat}
                const checker = checkAndChangeWritingArray(newCurrentChat, typingObject, true)
                if (checker) {
                    context.currentChatSetter!(newCurrentChat)
                }
            }
            if (context.chatList) {
                const chatListCopy = context.chatList.slice(0)
                const chat = chatListCopy.find((chatToFind) => chatToFind.id === typingObject.chatId)
                if (chat && typingObject.userId !== userContext.user?.id) {
                    const checker = checkAndChangeWritingArray(chat, typingObject, true)
                    if (checker) {
                        context.chatListSetter!(chatListCopy)
                    }
                }
            }
        });
        socket.socket.on('server-stopped-typing', (typingObject: TypingInterface) => {
            if (context.currentChat?.id === typingObject.chatId) {
                const newCurrentChat = {...context.currentChat}
                const checker = checkAndChangeWritingArray(newCurrentChat, typingObject, false)
                if (checker) {
                    context.currentChatSetter!(newCurrentChat)
                }
            }
            if (context.chatList) {
                const chatListCopy = context.chatList.slice(0)
                const chat = chatListCopy.find((chatToFind) => chatToFind.id === typingObject.chatId)
                if (chat && typingObject.userId !== userContext.user?.id && chat.writingArray) {
                    const checker = checkAndChangeWritingArray(chat, typingObject, false)
                    if (checker) {
                        context.chatListSetter!(chatListCopy)
                    }
                }
            }
        });
        socket.socket.on('server-history', (messageHistory: MessageHistoryResponse) => {
            if (messageHistory.success && context.currentChat && context.currentChat.id === messageHistory.messageHistory?.chatId) {
                const newCurrentChat = {...context.currentChat}
                for (const adapter of messageHistory.messageHistory.adapters) {
                    for (const messageId of adapter.toUnreadMessages) {
                        for (const message of messageHistory.messageHistory.messages) {
                            if (messageId.chatId === message.chatId) {
                                message.unread = true;
                            }
                        }
                    }
                }
                newCurrentChat.messages = messageHistory.messageHistory.messages;
                if (context.currentChatSetter) {
                    context.currentChatSetter(newCurrentChat);
                }
            } else if (!messageHistory.success) {
                console.log(messageHistory.errorMessage)
            } else if (context.chatList) {
                const chatListCopy = context.chatList.slice(0)
                const chat = chatListCopy.find((chat) => chat.id === messageHistory.messageHistory?.chatId)
                if (chat && messageHistory.messageHistory?.messages.length > 0) {
                    chat.lastMessage = messageHistory.messageHistory?.messages[messageHistory.messageHistory?.messages.length - 1]!;
                    context.chatListSetter!(chatListCopy);
                }
            }
        })
    }
}