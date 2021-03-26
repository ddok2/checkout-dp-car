const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const asTable = require('as-table')
  .configure({ maxTotalWidth: 45, delimiter: ' | ' })

const token = process.env.TELEGRAM_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID
const targetUrl = process.env.TARGET_URL

const main = async () => {
  const bot = new TelegramBot(token, { polling: false })

  try {
    const { data } = await axios.get(targetUrl)

    if (data.data) {
      const { list } = data.data

      await bot.sendMessage(
        chatId,
        `### Raw Data ###

        ${JSON.stringify(list)}
        `
      )

      const results = list.filter(({ agencyName }) => {
        return agencyName === '신대치' || agencyName === '오산'
      })

      for (let i = 0; i < results.length; i++) {
        const {
          agencyTypeCode,
          agencyCode,
          agencyAddress,
          saleModelCode,
          agencyTel,
          carCode,
          carName,
          carTimName,
          totalCount,
          branchCount,
          agencyCount,
          latitude,
          longitude,
          agencyCarMasterCount,
          agencyCarCount,
          carTrimCode,
          interiorColorCode,
          saleModelName,
          exteriorColorCode,
          exteriorColorName,
          distanceOrder,
          ...target
        } = results[i]

        results[i] = target
      }

      await bot.sendMessage(chatId, asTable(results))

    }

  } catch (e) {
    await bot.sendMessage(chatId, `err: ${e.message || e}`)
    throw e
  }
}

main().catch(e => console.log(e))
