'use client'
import React, {useContext, useEffect} from 'react';
import { useSocket } from '@/app/providers/socketProvider';
import {MessageInterface} from "@/pages/api/socket/io";
import {ChatContext} from "@/app/contexts/chatContext";


export default function Chat() {
    const socket = useSocket();
    const chatContext = useContext(ChatContext)

    useEffect(() => {

    }, [chatContext]);

    const inputHandler = (evt : React.ChangeEvent<HTMLInputElement>) => {
        if (socket.isConnected && chatContext.currentChat) {
            if (evt.target.value.length < 1) {
                socket.socket.emit('stop-typing', chatContext.currentChat);
            } else {
                socket.socket.emit('typing', chatContext.currentChat);
            }
        }
    }
    const submitHandler = (evt:SubmitEvent) => {
        evt.preventDefault();
        if (socket.isConnected && chatContext.currentChat) {
            const form = evt.target;
            if (form) {
                const formData = new FormData(form as HTMLFormElement);
                const messageText = formData.get('chat-message');
                if (typeof messageText == "string" && messageText.length > 0) {
                    const message:MessageInterface = {
                        chatId: chatContext.currentChat.id,
                        message: messageText
                    }
                    socket.socket.emit('chat-message', message);
                }
            }
        }
    }

    return (
        <div>
            <div>
                <p>История сообщений:</p>
            </div>
            <div>
                <form action={'/'} method={'post'} onSubmit={() => submitHandler}>
                <input
                    placeholder="Type something"
                    name={'chat-message'}
                    onChange={() => inputHandler}
                />
                    <button type={"submit"}>Послать сообщение</button>
                </form>
            </div>
        </div>
    );
}