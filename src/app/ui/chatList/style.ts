import styled from "styled-components";

export const ChatListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    padding: 20px;
    border-right: 2px solid ${(props) => props.theme.colorText};
    justify-content: flex-start;
    align-items: center;
`

export const CustomChatList = styled.ul`
    display: flex;
    list-style-type: none;
    padding-left: 0;
    flex-direction: column;
    border-bottom: 1px solid ${(props) => props.theme.colorText};
    width: 100%;
    margin: 0;
    align-items: flex-start;
    &:last-of-type {
        border-bottom: none;
    }
`

export const CustomForm = styled.form`
    width: 100%;
`

export const CustomChatItem = styled.li`
    display: flex;
    width: 100%;
`

interface ChatButtonInterface {
    $isCurrent: boolean
}

export const ChangeCurrentChatButton = styled.button<ChatButtonInterface>`
    display: flex;
    width: 100%;
    flex-direction: column;
    background-color: ${({$isCurrent, theme}) => $isCurrent? theme.colorLightGray: theme.colorBackground};
    border: none;
    align-items: flex-start;
    padding: 5px;
`

export const ChatInfoContainer = styled.div`
    width: 100%;
    max-width: 100%;
    min-height: 50px;
`

export const TextLine = styled.p`
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: normal;
    margin: 5px 0;
    text-align: left;
`