'use client'
import React from "react";
import {observer} from "mobx-react-lite";
import FriendList from "../friendList/friendList";
import AddBotList from "../addBotList/addBotList";
import { Bot, Friend } from "@/app/lib/types";


function FriendSection({friendArray, botArray}:Readonly<{
    friendArray: Friend[] | null;
    botArray: Bot[];
  }>) {
        return (
            <>
            <div>
                <FriendList friendArray={friendArray}/>
            </div>
            <div>
                <AddBotList botArray={botArray}/>
            </div>
            </>
        )
}

export default observer(FriendSection)