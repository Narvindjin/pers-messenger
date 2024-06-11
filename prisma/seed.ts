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
    url: string,
    imageUrl: string,
}

const botArray: Bot[] = [
    {
        name: 'test',
        url: '/',
        imageUrl: '/',
    }
]

async function initBots() {
    for (const bot of botArray) {
        const botInDB = await searchForBot(bot.name)
        if (!botInDB) {
            const newBot = await prisma.user.create({
                data: {
                    name: bot.name,
                    bot: true,
                    roomUrl: bot.url,
                    image: bot.imageUrl
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