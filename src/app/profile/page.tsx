'use client'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import {observer} from "mobx-react-lite";


function Profile() {
  return (
    <StyledContainer>
      testingProfilePage
    </StyledContainer>
  );
}

export default observer(Profile)