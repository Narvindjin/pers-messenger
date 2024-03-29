'use client'
import React, {useState} from 'react';
import StyledContainer from "@/app/utils/container";
import { useEffect } from 'react'
import io from 'socket.io-client'

let socket

export default function Chat() {
    const [input, setInput] = useState('')

    const onChangeHandler = (e) => {
      setInput(e.target.value)
      socket.emit('input-change', e.target.value)
    }

    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io()

        socket.on('connect', () => {
          console.log('connected')
        })

        socket.on('update-input', msg => {
          setInput(msg)
        })
      }

    useEffect(() => {
        await socketInitializer()
    },[])


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