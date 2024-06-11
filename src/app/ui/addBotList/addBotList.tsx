import {getUnfriendedBots} from "@/app/lib/actions/friendInvites";
import AddBotForm from "@/app/ui/addBotForm/addBotForm";

export default async function AddBotList() {
    const botArray = await getUnfriendedBots();
    if (botArray.length > 0) {
        return (
            <div>
                <h2>Список недобавленных ботиков</h2>
                <ul>
                    {botArray.map((bot) => {
                                return (
                                    <li key={bot.id}>
                                        <AddBotForm bot={bot}></AddBotForm>
                                    </li>
                                )
                        })}
                </ul>
            </div>
        );
    }
}