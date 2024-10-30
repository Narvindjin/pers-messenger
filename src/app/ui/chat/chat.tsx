'use client'
import React, {FormEvent, Fragment, useContext, useEffect, useState} from 'react';
import { useSocket } from '@/app/providers/socketProvider';
import {MessageInterface} from "@/pages/api/socket/io";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import ChatMessage from "@/app/ui/chatMessage/chatMessage";
import {autorun} from "mobx";
import {observer} from "mobx-react-lite";
import { ChatInput, ChatWrapper, SendButton, SendForm } from './style';
import { HiddenSpan } from '../components/hiddenSpan/hiddenSpan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';


function Chat() {
    const socket = useSocket();
    const chatContext = useContext(ChatContext) as ChatContextObject;
    const [messageText, changeMessageText] = useState('');
    const [typing, setTyping] = useState(false)

    useEffect(() => {
        changeMessageText('');
        setTyping(false)
    }, [chatContext.currentChat])

    useEffect(() => {
        if (socket.socket && socket.socket.connected) {
            return autorun(() => {
                if (chatContext.isTabSwitched) {
                    chatContext.setIsTabSwitched(false)
                    socket.socket.emit('get-history', chatContext.currentChat?.id);
                }
            })
        }
    }, [socket.socket]);

    useEffect(() => {
        if (socket.socket && socket.socket.connected && chatContext.currentChat) {
            if (typing) {
                socket.socket.volatile.emit('typing', chatContext.currentChat.id);
            } else {
                socket.socket.volatile.emit('stop-typing', chatContext.currentChat.id);
            }
        }
    }, [typing])

    const inputHandler = (evt : React.ChangeEvent<HTMLInputElement>) => {
        changeMessageText(evt.target.value)
        if (socket.socket && socket.socket.connected && chatContext.currentChat) {
            if (evt.target.value.length < 1 && typing) {
                setTyping(false)
            } else if (evt.target.value.length > 0 && !typing) {
                setTyping(true)
            }
        }
    }

    const blurHandler = (evt : React.FocusEvent<HTMLInputElement>) => {
        /*if (socket.socket && chatContext && chatContext.currentChat) {
            socket.socket.emit('stop-typing', chatContext.currentChat.id);
        }*/
    }

    const deleteButtonHandler = () => {
        if (socket.socket && socket.socket.connected && chatContext.currentChat) {
            socket.socket.emit('delete-history', chatContext.currentChat?.id);
        }
    }

    const backButtonHandler = () => {
        chatContext.setCurrentChat(null)
    }

    const submitHandler = (evt:FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (socket.socket && socket.socket.connected && chatContext.currentChat) {
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
                    changeMessageText('');
                    setTyping(false);
                }
            }
        }
    }

    return (
        <ChatWrapper>
            <div>
                <div>
                    {chatContext.currentChat?.messages.map((message) => {
                        return(
                            <Fragment key={message.id}>
                                <ChatMessage message={message}/>
                            </Fragment>
                        )
                    })}
                </div>
            </div>
            {chatContext.currentChat?.writingArray? <p>{chatContext.currentChat.writingArray[0].name} печатает...</p>: null}
            <div>
                <SendForm action={'/'} method={'post'} onSubmit={(evt) => submitHandler(evt)}>
                    <ChatInput
                        placeholder="Type something"
                        name={'chat-message'}
                        value={messageText}
                        onChange={(evt) => inputHandler(evt)}
                        onBlur={(evt) => blurHandler(evt)}
                    />
                        <SendButton type={"submit"}>
                            <FontAwesomeIcon icon={faChevronRight} />
                            <HiddenSpan>Послать сообщение</HiddenSpan>
                        </SendButton>
                </SendForm>
            </div>
        </ChatWrapper>
    );
}

export default observer(Chat)