import styled from "styled-components";
import React from "react";

export const ModalStyle = styled.div<React.ComponentPropsWithRef<"div">>`
    position: absolute;
    width: 250px;
    max-width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: fit-content;
    max-height: 90vh;
    min-height: 200px;
    z-index: 11;
    background-color: white;
    padding: 10px;
    opacity: 0;
    transition: translate 0.3s ease, opacity 0.3s ease;
    
    &.ReactModal__Content--after-open{
        opacity: 1;
    }
    
    &.ReactModal__Content--before-close{
        opacity: 0;
    }
`

export const OverlayStyle = styled.div<React.ComponentPropsWithRef<"div">>`
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    position: fixed;
    opacity: 0;
    
    &.ReactModal__Overlay--after-open{
        opacity: 1;
    }
    
    &.ReactModal__Overlay--before-close{
        opacity: 0;
    }
`