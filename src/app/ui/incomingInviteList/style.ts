import { fontBold } from "@/app/utils/mixins";
import styled from "styled-components";

export const InviteList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding-left: 0;
    list-style-type: none;
`

export const InviteContainer = styled.div`
    display: flex;
    width: 300px;
    max-width: 100%;
    background-color: ${(props) => props.theme.colorButton};
    border: none;
    border-radius: 5px;
    box-shadow: ${(props) => props.theme.colorButton} 0 0 2px 1px;
    min-height: 50px;
    padding: 5px 10px;
    justify-content: space-between;
    align-items: center;
`
export const InviteName = styled.span`
    text-overflow: ellipsis;
    font-size: 1.6rem;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    font-weight: 600;
`

export const InviteNameContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    margin-right: 10px;
    min-width: 0;
`

export const InviteButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: auto;
    align-items: center;
    min-width: 0;
    flex-shrink: 0;
`