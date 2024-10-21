import styled from "styled-components";
import { IconButton } from "../components/button/button";

export const IdContainer = styled.div`
    margin-bottom: 5px;
`
export const IdRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
`
export const ClipboardContainer = styled(IconButton)`
    width: 25px;
    height: 20px;
    padding-left: 5px;
    color: ${(props) => props.theme.colorInput};

    &:first-of-type {
        padding-left: 5px;
    }
`