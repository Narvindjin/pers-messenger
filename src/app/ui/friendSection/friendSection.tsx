'use client'
import React from "react";
import {observer} from "mobx-react-lite";
import FriendList from "../friendList/friendList";
import { Bot, Friend } from "@/app/lib/types";


function FriendSection({friendArray, botArray}:Readonly<{
    friendArray: Friend[] | null;
    botArray: Bot[];
  }>) {
        return (
            <div>
                <FriendList unaddedBotArray={botArray} friendArray={friendArray}/>
            </div>
        )
}

export default observer(FriendSection)