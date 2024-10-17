import styled from "styled-components";
import { fontLight } from "@/app/utils/mixins";

const CustomButton = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 5px 7px;
    min-width: 100px;
    align-items: center;
    max-width: 100%;
    background-color: ${(props) => props.theme.colorBackground};
    color: ${(props) => props.theme.colorText};
    border: 2px solid ${(props) => props.theme.colorText};
    border-radius: 5px;
    position: relative;
    ${fontLight};
`

const IconButton = styled.button`
    display: flex;
    width: 25px;
    height: 25px;
    justify-content: center;
    align-items: center;
    border: none;
    padding: 0 3px;
    background-color: transparent;

    &:first-of-type {
        padding-left: 0;
    }

    &:last-of-type {
        padding-right: 0;
    }

    & + button {
        border-left: 1px solid ${(props) => props.theme.colorText};
        width: 26px;
    }

    & > svg {
        display: flex;
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
    }
`

export {CustomButton, IconButton}