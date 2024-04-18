'use server'

import {getFriendList} from "@/app/lib/actions";

type Friend = {
    id: string,
    email: string,
}

export default async function FriendList() {
    const constructFriendList = async () => {
        const friendArray:Friend[] | null = await getIncomingInviteList();
        if (friendArray) {
            return (
                <ul>
                    {friendArray.map((friend) => {
                        return (
                            <li key={friend.id}>
                                Друг: <h2>{friend.email}</h2>
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