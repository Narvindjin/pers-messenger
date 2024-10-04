import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function searchForBot(botName: string) {
    const bot = await prisma.user.findFirst({
        where: {
            name: botName,
            bot: true
        }
    })
    return bot
}

interface Bot {
    name: string,
    botId: string | null,
    imageUrl: string,
    botPurpose: string,
    botDescription: string,
}

export const botArray: Bot[] = [
    {
        name: 'sanic',
        botId: 'OkQhIQ0WNko1Wx-phdqhUFI0vV3NLIpC8L6Ryyz2-Xo',
        imageUrl: '/',
        botPurpose: '',
        botDescription: 'Бот Саника'
    },
    {
        name: 'Автопосылатель сообщений',
        botId: null,
        imageUrl: '/',
        botPurpose: 'autosend',
        botDescription: 'Автопосылка сообщений, отправить start для начала, end для окончания'
    }
]

async function initBots() {
    for (const bot of botArray) {
        const botInDB = await searchForBot(bot.name)
        if (!botInDB) {
            await prisma.user.create({
                data: {
                    name: bot.name,
                    bot: true,
                    roomUrl: bot.botId,
                    image: bot.imageUrl,
                    botPurpose: bot.botPurpose,
                }
            });
        }
    }
}

async function main() {
  await initBots()
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('prisma-error', e)
    await prisma.$disconnect()
    process.exit(1)
  })