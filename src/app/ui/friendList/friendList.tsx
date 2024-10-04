'use client'
import React, { useState } from "react";
import RemoveFriendForm from "./friendItem";
import { Friend } from "@/app/lib/types";

export default function FriendList({friendArray}:Readonly<{
    friendArray: Friend[] | null;
  }>) {
    const [friendsExist, changeFriendsExist] = useState(false);
    const [botsExist, changeBotsExist] = useState(false);
    return (
        <div>
            <h1>Друзья:</h1>
            <ul>
                {friendArray?
                friendArray.map((friend) => {
                    if (!friend.bot) {
                        if (!friendsExist) {
                            changeFriendsExist(true)
                        }
                        return (
                            <li key={friend.id}>
                                <RemoveFriendForm friend={friend}/>
                            </li>
                        )
                    }
                }): null}
                {friendsExist? null:
                'Ваш список друзей пуст'
                }
            </ul>
            <h2>Ботики:</h2>
            <ul>
                {friendArray?
                friendArray.map((friend) => {
                    if (friend.bot) {
                        if (!botsExist) {
                            changeBotsExist(true)
                        }
                        return (
                            <li key={friend.id}>
                                <RemoveFriendForm friend={friend}/>
                            </li>
                        )
                    }
                }): null}
                {botsExist? null:
                'Не добавлено ни одного бота'
                }
            </ul>
        </div>
    )
}