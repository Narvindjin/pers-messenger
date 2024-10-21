'use client'
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { User } from "next-auth";
import { ClipboardContainer, IdContainer, IdRow } from "./style";

export default function IdBlock({user}: {
    user: User;
}) {
    const getIdToClipboard = () => {
        navigator.clipboard.writeText(user.id!);
    }
  return (
    <IdContainer>
        Ваш ID: <br/>
        <IdRow onClick={getIdToClipboard}>
            <b>{user.id}</b>
            <ClipboardContainer>
                <FontAwesomeIcon icon={faClipboard} />
            </ClipboardContainer>
        </IdRow>
    </IdContainer>
  );
}