'use server'

import {getIncomingInviteList} from "@/app/lib/actions/friendInvites";
import { Invite } from '@/app/lib/types';
import InviteAcceptForm from "./inviteForm";

export default async function IncomingInviteList() {
    const constructInviteList = async () => {
        const inviteArray:Invite[] | null = await getIncomingInviteList();
        if (inviteArray) {
            return (
                <>
                    <h2>Входящие приглашения:</h2>
                    <ul>
                        {inviteArray.map((invite) => {
                            return (
                                <li key={invite.id}>
                                    <InviteAcceptForm invite={invite}/>
                                </li>
                            )
                        })}
                    </ul>
                </>
            )
        }
        return null
    }
    return (
        <>
            {await constructInviteList()}
        </>
    )
}