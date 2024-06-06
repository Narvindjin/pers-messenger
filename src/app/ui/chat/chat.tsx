'use client'
import React, {FormEvent, Fragment, useContext, useEffect} from 'react';
import { useSocket } from '@/app/providers/socketProvider';
import {MessageInterface} from "@/pages/api/socket/io";
import {ChatContext} from "@/app/contexts/chatContext";
import ChatMessage from "@/app/ui/chatMessage/chatMessage";


export default function Chat() {
    const socket = useSocket();
    const chatContext = useContext(ChatContext);

    useEffect(() => {
        if (socket.socket && socket.socket.connected && chatContext.switchedTabs) {
            console.log('get-history');
            chatContext.switchedTabsSetter!(false);
            socket.socket.emit('get-history', chatContext.currentChat?.id);
        }
    }, [socket.socket, chatContext.switchedTabs]);

    const inputHandler = (evt : React.ChangeEvent<HTMLInputElement>) => {
        if (socket.socket && socket.socket.connected && chatContext.currentChat) {
            if (evt.target.value.length < 1) {
                console.log('stopped typing')
                socket.socket.emit('stop-typing', chatContext.currentChat.id);
            } else {
                console.log('typing')
                socket.socket.emit('typing', chatContext.currentChat.id);
            }
        }
    }

    const blurHandler = (evt : React.FocusEvent<HTMLInputElement>) => {
        /*if (socket.socket && chatContext.currentChat) {
            socket.socket.emit('stop-typing', chatContext.currentChat.id);
        }*/
    }

    const deleteButtonHandler = () => {
        if (socket.socket && socket.socket.connected && chatContext.currentChat) {
            socket.socket.emit('delete-history', chatContext.currentChat?.id);
        }
    }

    const submitHandler = (evt:FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (socket.socket && socket.socket.connected && chatContext.currentChat) {
            const form = evt.target;
            if (form) {
                const formData = new FormData(form as HTMLFormElement);
                const messageText = formData.get('chat-message');
                console.log(messageText);
                if (typeof messageText == "string" && messageText.length > 0) {
                    const message:MessageInterface = {
                        chatId: chatContext.currentChat.id,
                        message: messageText
                    }
                    console.log('message:', message)
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
                <button type={"button"} onClick={() => deleteButtonHandler()}>Удалить все сообщения</button>
            </div>
            {chatContext.currentChat?.writingArray? <p>{chatContext.currentChat.writingArray[0].name} печатает...</p>: null}
            <div>
                <form action={'/'} method={'post'} onSubmit={(evt) => submitHandler(evt)}>
                <input
                    placeholder="Type something"
                    name={'chat-message'}
                    onChange={(evt) => inputHandler(evt)}
                    onBlur={(evt) => blurHandler(evt)}
                />
                    <button type={"submit"}>Послать сообщение</button>
                </form>
            </div>
        </div>
    );
}