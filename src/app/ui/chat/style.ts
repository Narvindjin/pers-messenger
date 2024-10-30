import styled from "styled-components";
import { IconButton } from "../components/button/button";

export const ChatWrapper = styled.div`
    display: flex;
    padding: 20px;
    width: 70%;
    flex-direction: column;
`

export const ChatInput = styled.input`
    flex-grow: 1;
`

export const SendButton = styled(IconButton)`
`

export const SendForm = styled.form`
    display: flex;
    flex-direction: row;
`