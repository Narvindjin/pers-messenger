import styled from "styled-components";
import { CustomInput } from "../components/input/input";
import { TRANS_TIME } from "@/app/global/theme";

export const AvatarInput = styled(CustomInput)`
    cursor: pointer;
    margin-bottom: 10px;
    outline: none;
    display: flex;
    flex-direction: row;
    &::file-selector-button {
        display: inline-flex;
        padding: 8px 10px;
        margin: -7px -10px;
        margin-right: 13px;
        min-height: 100%;
        border-left: none;
        border-top: none;
        border-bottom: none;
        transition: background-color ${TRANS_TIME} ease;
    }
`