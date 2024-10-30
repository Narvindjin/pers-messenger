import styled from "styled-components";

export const LinkList = styled.ul`
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding-left: 0;
    list-style-type: none;
`

export const LinkItem = styled.li`
    & > a {
        font-size: 2rem;
    }
`