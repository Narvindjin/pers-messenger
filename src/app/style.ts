'use client'
import styled from "styled-components";

const StyledWrapper = styled.div`
    position: relative;
  display: flex;
  flex-direction: column;

  header,
  footer {
    flex-shrink: 0;
  }

  main {
    flex-grow: 1;
  }
`

export {StyledWrapper};