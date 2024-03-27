'use client'
import styled from "styled-components";
import media from "./breakpoints";

export const StyledContainer = styled.div`
    padding-left: 90px;
    padding-right: 90px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1440px;
    height: 100%;
    width: 100%;
    
    @media (${media.tablet}) {
        padding-left: 20px;
        padding-right: 20px;
    }
`

export default StyledContainer