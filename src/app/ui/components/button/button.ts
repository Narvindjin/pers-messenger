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

export {CustomButton}