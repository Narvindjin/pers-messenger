'use server'
import {getOutgoingInviteList} from "@/app/lib/actions/friendInvites";
import { Invite } from '@/app/lib/types';
import InviteDeleteForm from "./inviteForm";

export default async function OutgoingInviteList() {
    const constructInviteList = async () => {
        const inviteArray:Invite[] | null = await getOutgoingInviteList();
        if (inviteArray) {
            return (
                <>
                    <h2>Исходящие приглашения:</h2>
                    <ul>
                        {inviteArray.map((invite) => {
                            return (
                                <li key={invite.id}>
                                    <InviteDeleteForm invite={invite}/>
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