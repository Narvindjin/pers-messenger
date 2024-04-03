'use client'
import styled from "styled-components";

const StyledHeader = styled.div`
    background-color: black;
    width: 100%;
`

const StyledList = styled.ul`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    gap: 10px;
    height: 100%;
`

const StyledItem = styled.li`
    display: flex;
    height: fit-content;
    width: fit-content;
    padding: 4px;
    align-items: center;
    color: white;
`

export {StyledHeader, StyledList, StyledItem};