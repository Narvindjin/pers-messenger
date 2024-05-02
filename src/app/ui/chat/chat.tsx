'use client'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import { useSocket } from '@/app/providers/socketProvider';
import {MessageInterface} from "@/pages/api/socket/io";
import {Chat} from "@/app/lib/types";


export default function Chat(chat: Chat | null) {
    const socket = useSocket();

    const inputHandler = (evt : React.ChangeEvent<HTMLInputElement>) => {
        if (socket.isConnected && chat) {
            if (evt.target.value.length < 1) {
                socket.socket.emit('stop-typing', chat.id);
            } else {
                socket.socket.emit('typing', chat.id);
            }
        }
    }
    const submitHandler = (evt:SubmitEvent) => {
        evt.preventDefault();
        if (socket.isConnected && chat) {
            const form = evt.target;
            const formData = new FormData(form);
            const messageText = formData.get('chat-message');
            if (typeof messageText == "string" && messageText.length > 0) {
                const message:MessageInterface = {
                    chatId: chat.id,
                    message: messageText
                }
                socket.socket.emit('chat-message', message);
            }
        }
    }

    return (
        <StyledContainer>
                testingChattingPage
                <form action={'/'} method={'post'} onSubmit={() => submitHandler}>
                <input
                    placeholder="Type something"
                    name={'chat-message'}
                    onChange={() => inputHandler}
                />
                    <button type={"submit"}>Послать сообщение</button>
                </form>
        </StyledContainer>
    );
}