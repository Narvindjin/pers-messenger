import styled from "styled-components";

export const CustomInput = styled.input`
    display: flex;
    width: 300px;
    max-width: 100%;
    background-color: ${(props) => props.theme.colorElement};
    border: 2px solid ${(props) => props.theme.colorInput};
    padding: 7px 10px 7px 10px;
    height: 38px;
    border-radius: 5px;
    &::placeholder {
        opacity: 50%;
    }
    &:active {
        border: 2px solid ${(props) => props.theme.colorInput};;
    }
`