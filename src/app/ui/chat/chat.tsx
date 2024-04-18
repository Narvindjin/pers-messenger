'use client'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import { useSocket } from '@/app/providers/socketProvider';


export default function Chat() {
    const socket = useSocket();

    const inputHandler = (evt : React.ChangeEvent<HTMLInputElement>) => {
        if (socket.isConnected) {
            const value = evt.target.value;
            socket.socket.emit('chat-message', value);
            console.log(value)
        }
    }

    return (
        <StyledContainer>
                testingChattingPage
                <input
                    onChange={inputHandler}
                    placeholder="Type something"
                />
        </StyledContainer>
    );
}