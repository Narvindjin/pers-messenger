'use client'
import React, {FormEvent, Fragment, useContext, useEffect, useState} from 'react';
import { useSocket } from '@/app/providers/socketProvider';
import {MessageInterface} from "@/pages/api/socket/io";
import {ChatContext} from "@/app/contexts/chatContext";
import ChatMessage from "@/app/ui/chatMessage/chatMessage";


export default function Chat() {
    const socket = useSocket();
    const chatContext = useContext(ChatContext);

    useEffect(() => {
        if (socket.socket)
        socket.socket.emit('get-history', chatContext.currentChat?.id);
    }, [chatContext.currentChat, socket.socket]);

    const inputHandler = (evt : React.ChangeEvent<HTMLInputElement>) => {
        if (socket.isConnected && chatContext.currentChat) {
            if (evt.target.value.length < 1) {
                socket.socket.emit('stop-typing', chatContext.currentChat);
            } else {
                socket.socket.emit('typing', chatContext.currentChat);
            }
        }
    }
    const submitHandler = (evt:FormEvent<HTMLFormElement>) => {
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
                <div>
                    {chatContext.currentMessageArray.map((message) => {
                        return(
                            <Fragment key={message.id}>
                                <ChatMessage message={message}/>
                            </Fragment>
                        )
                    })}
                </div>
            </div>
            <div>
                <form action={'/'} method={'post'} onSubmit={(evt) => submitHandler(evt)}>
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