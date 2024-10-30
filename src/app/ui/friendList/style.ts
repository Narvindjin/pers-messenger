import styled from "styled-components";
import { DeclineButton, InviteNameContainer } from "../incomingInviteList/style";

export const CustomFriendList = styled.ul`
    display: flex;
    flex-direction: column;
    padding-left: 0;
    list-style-type: none;
    max-height: 700px;
    border: 2px solid ${(props) => props.theme.colorInput};
    padding: 10px 15px;
    border-radius: 5px;
`

export const CustomForm = styled.form`
    width: 100%;
`

export const CustomFriendItem = styled.li`
    display: flex;
    border-bottom: 1px solid ${(props) => props.theme.colorInput};
    padding-bottom: 5px;

    &:last-of-type {
        border-bottom: none;
    }
`

export const FriendContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px;
`

export const FriendNameContainer = styled(InviteNameContainer)`
    margin-left: 10px;
    margin-right: auto;
`

export const DeleteFriendButton = styled(DeclineButton)`
    width: 30px;
    height: 30px;
`

export const AddFriendButton = styled(DeleteFriendButton)`
    color: ${(props) => props.theme.colorAccept}
`