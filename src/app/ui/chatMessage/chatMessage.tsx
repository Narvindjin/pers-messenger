import {Message} from "@/app/lib/types";
import {useContext, useEffect, useState} from "react";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {User} from "next-auth";
import {UserContext} from "@/app/contexts/userContext";
import DOMPurify from "isomorphic-dompurify";
import {observer} from "mobx-react-lite";

interface MessageInterface {
    message: Message
}
function ChatMessage({message}: MessageInterface) {
    const chatContext = useContext(ChatContext) as ChatContextObject;
    const authenticatedUser = useContext(UserContext).user;
    const [fromUser, fromUserSetter] = useState<User | null>(null)
    useEffect(() => {
        if (chatContext.currentChat?.membersAdapters) {
            const adapter = chatContext.currentChat?.membersAdapters.find((member) => member.user.id === message.fromId)
            let user: User
            if (!adapter && authenticatedUser?.id === message.fromId) {
                user = authenticatedUser;
            } else if (adapter) {
                user = adapter.user
            }
            if (user) {
                fromUserSetter(user)
            }
        }
    }, [message, chatContext.currentChat]);

    return (
        <div style={message.unread?{backgroundColor:'darkgray'}: undefined}>
            <p>От: {fromUser?.id === authenticatedUser?.id? "Вы": fromUser?.name}</p>
            <p>Время: {message.postDate.toString()}</p>
            <p>Контент: {DOMPurify.sanitize(message.content)}</p>
        </div>
    )
}

export default observer(ChatMessage)