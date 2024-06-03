import {Message} from "@/app/lib/types";
import {useContext, useEffect, useState} from "react";
import {ChatContext} from "@/app/contexts/chatContext";
import {User} from "next-auth";

interface MessageInterface {
    message: Message
}
export default function ChatMessage({message}: MessageInterface) {
    const chatContext = useContext(ChatContext)
    const [fromUser, fromUserSetter] = useState<User | null>(null)
    useEffect(() => {
        if (chatContext.currentChat?.membersAdapters) {
            let user = chatContext.currentChat?.membersAdapters.find((member) => member.user.id === message.fromId).user
            if (!user && ) {
            }
            if (user) {
                fromUserSetter(user)
            }
        }
    }, [message, chatContext.currentChat]);

    return (
        <p>От: {fromUser?.name}</p>
    )
}