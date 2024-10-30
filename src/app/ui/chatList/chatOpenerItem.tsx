'use client'
import React, {useContext, useEffect, useState} from "react";
import {Chat, Message} from "@/app/lib/types";
import {useFormState, useFormStatus} from 'react-dom';
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {UserContext} from "@/app/contexts/userContext";
import {observer} from "mobx-react-lite";
import { messageHistoryHandler } from "@/app/lib/actions/message";
import { useSocket } from "@/app/providers/socketProvider";
import { HiddenInput } from "@/app/utils/mixins";
import { ChangeCurrentChatButton, ChatInfoContainer, CustomForm, TextLine } from "./style";

interface ChatOpenerItemProps {
    chat: Chat;
}

function ChatOpenerItem({chat}:ChatOpenerItemProps) {
    const socket = useSocket();
    const [persistentName, changeName] = useState('default');
    const chatContext = useContext(ChatContext) as ChatContextObject
    const [result, formAction] = useFormState(messageHistoryHandler, null);
    const user = useContext(UserContext)
    const {pending} = useFormStatus();

    useEffect(() => {
        if (result && result.success) {
            if (chatContext.currentChat) {
                socket.socket.volatile.emit('stop-typing', chatContext.currentChat.id);
            }
            chatContext.setCurrentChat(chat)
            socket.socket.emit('clear-unread', chat.id)
            chatContext.handleNewMessageHistory(result)
        }
    }, [result])

    const returnLastMessage = () => {
        let message: null | Message = null;
        if (chat.messages && chat.messages.length > 0) {
            message = chat.messages[chat.messages.length - 1];
        } else if (chat.lastMessage) {
            message = chat.lastMessage;
        }
        return (
            <ChatInfoContainer>
            {chat.writingArray? <TextLine>{chat.writingArray[0].name} печатает...</TextLine>:
                message? <>
                            <TextLine>{message.fromId === user.user?.id ? 'Вы:' : chat.membersAdapters.find((member) => member.user.id === message!.fromId)!.user.name + ':'}</TextLine>
                            <TextLine>{message.content}</TextLine>
                        </>:
                        <>
                            <br/>
                            <br/>
                        </>
            }
        </ChatInfoContainer>
        )
    }

    const createName = () => {
        let name = '';
        for (const member of chat.membersAdapters) {
            if (member.user.name) {
                name = name + member.user.name
            } else {
                name = name + member.user.email
            }
        }
        changeName(name);
    }
    useEffect(() => {
        createName();
    }, [chat])
    return (
        <CustomForm action={formAction as unknown as string}>
            <ChangeCurrentChatButton $isCurrent={chatContext.currentChat?.id === chat.id} type={"submit"} aria-disabled={pending || chatContext.currentChat?.id === chat.id}>
                <h3>{persistentName}</h3>
                <HiddenInput type="hidden" name="chatId" value={chat.id}></HiddenInput>
                {chat.unread? <p>Непрочитанных сообщений: {chat.unread}</p>: null}
                {returnLastMessage()}
            </ChangeCurrentChatButton>
        </CustomForm>
    )
}

export default observer(ChatOpenerItem)