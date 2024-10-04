'use client'
import React from "react";
import AddBotForm from "@/app/ui/addBotForm/addBotForm";
import { Bot } from "@/app/lib/types";

export default function AddBotList({botArray}:Readonly<{
    botArray: Bot[];
  }>) {
        return (
            <div>
                <h2>Список недобавленных ботиков</h2>
                {botArray.length > 0? 
                    <ul>
                        {botArray.map((bot) => {
                                    return (
                                        <li key={bot.id}>
                                            <AddBotForm bot={bot}></AddBotForm>
                                        </li>
                                    )
                            })}
                    </ul>:
                    'Все боты добавлены'
                }
            </div>
        );
    }