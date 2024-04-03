'use client'
import React, {Suspense, useState} from 'react';
import StyledContainer from "@/app/utils/container";
import {PageObject} from "@/app/profile/layout";

const chattingPage:PageObject = {
    id: 0,
    name: 'Чаты',
    url: './chat',
}

let socket

export default function Chat() {
    const [input, setInput] = useState('')

    const onChangeHandler = (e) => {
      setInput(e.target.value)
      socket.emit('input-change', e.target.value)
    }


  return (
      <StyledContainer>
              testingChattingPage
              <input
                  placeholder="Type something"
                  value={input}
                  onChange={onChangeHandler}
              />
      </StyledContainer>
  );
}

export {chattingPage};