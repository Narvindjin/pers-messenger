'use server'

import {getFriendList} from "@/app/lib/actions/friendList";
import RemoveFriendForm from "./friendItem";
import { Friend } from "@/app/lib/types";

export default async function FriendList() {
    const constructFriendList = async () => {
        const friendArray:Friend[] | null = await getFriendList();
        if (friendArray) {
            return (
                <ul>
                    {friendArray.map((friend) => {
                        return (
                            <li key={friend.id}>
                                <RemoveFriendForm friend={friend}/>
                            </li>
                        )
                    })}
                </ul>
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