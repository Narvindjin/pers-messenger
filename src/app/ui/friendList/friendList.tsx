'use server'

import {getFriendList} from "@/app/lib/actions/friendList";
import RemoveFriendForm from "./friendItem";
import { Friend } from "@/app/lib/types";

export default async function FriendList() {
    const constructFriendList = async () => {
        const friendArray:Friend[] | null = await getFriendList();
        if (friendArray) {
            return (
                <div>
                    <h1>Друзья:</h1>
                    <ul>
                        {friendArray.map((friend) => {
                            if (!friend.bot) {
                                return (
                                    <li key={friend.id}>
                                        <RemoveFriendForm friend={friend}/>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                    <h2>Ботики:</h2>
                    <ul>
                        {friendArray.map((friend) => {
                            if (friend.bot) {
                                return (
                                    <li key={friend.id}>
                                        <RemoveFriendForm friend={friend}/>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            )
        }
        return null
    }
    return (
        <>
            {await constructFriendList()}
        </>
    )
}