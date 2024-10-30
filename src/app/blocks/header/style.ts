'use client'
import styled from "styled-components";

const StyledHeader = styled.div`
    background-color: ${(props) => props.theme.colorBackground};
    width: 100%;
`

const StyledHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    gap: 10px;
    height: 100%;
`

const StyledItem = styled.div`
    display: flex;
    height: fit-content;
    width: fit-content;
    padding: 4px;
    align-items: center;
`

const NameContainer = styled.div`
    margin-right: auto;
    display: flex;
`

const MenuContainer = styled.div`
    margin-left: auto;
    display: flex;
`

export {StyledHeader, StyledHeaderContainer, StyledItem, NameContainer, MenuContainer};