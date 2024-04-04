'use client'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import {PageObject} from "@/app/profile/layout";

const managingPage:PageObject = {
    id: 0,
    name: 'Друзья и ботики',
    url: '/profile/manage',
}

export default function Chat() {
  return (
    <StyledContainer>
      testingManagingPage
    </StyledContainer>
  );
}

export {managingPage}