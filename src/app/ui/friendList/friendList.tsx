'use client'
import React, { useState } from "react";
import RemoveFriendForm from "./friendItem";
import { Bot, Friend } from "@/app/lib/types";
import { CustomFriendItem, CustomFriendList } from "./style";
import AddBotForm from "../addBotForm/addBotForm";

export default function FriendList({friendArray, unaddedBotArray}:Readonly<{
    friendArray: Friend[] | null;
    unaddedBotArray: Bot[]
  }>) {
    const [friendsExist, changeFriendsExist] = useState(false);
    const [botsExist, changeBotsExist] = useState(false);
    return (
        <div>
            <h1>Друзья</h1>
            <CustomFriendList>
                {friendArray?
                friendArray.map((friend) => {
                    if (!friend.bot) {
                        if (!friendsExist) {
                            changeFriendsExist(true)
                        }
                        return (
                            <CustomFriendItem key={friend.id}>
                                <RemoveFriendForm friend={friend}/>
                            </CustomFriendItem>
                        )
                    }
                }): null}
                {friendsExist? null:
                'Ваш список друзей пуст'
                }
            </CustomFriendList>
            <h2>Ботики</h2>
            <CustomFriendList>
                {friendArray?
                friendArray.map((friend) => {
                    if (friend.bot) {
                        if (!botsExist) {
                            changeBotsExist(true)
                        }
                        return (
                            <CustomFriendItem key={friend.id}>
                                <RemoveFriendForm friend={friend}/>
                            </CustomFriendItem>
                        )
                    }
                }): null}
                {unaddedBotArray?
                unaddedBotArray.map((bot) => {
                    return (
                        <CustomFriendItem key={bot.id}>
                            <AddBotForm bot={bot}/>
                        </CustomFriendItem>
                    )
                }): null}
            </CustomFriendList>
        </div>
    )
}