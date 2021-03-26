const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const asTable = require('as-table')
  .configure({ maxTotalWidth: 45, delimiter: ' | ' })

const {
  TELEGRAM_TOKEN: token,
  TELEGRAM_CHAT_ID: chatId,
  TARGET_URL: targetUrl,
} = process.env

const main = async () => {
  const bot = new TelegramBot(token, { polling: false })

  try {
    const { data } = await axios.get(targetUrl)

    if (data.data) {
      let { list } = data.data

      for (let i = 0; i < list.length; i++) {
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
        } = list[i]

        list[i] = target
      }

      list = list.filter(({ modelBasicInfo }) => {
        return modelBasicInfo.indexOf('디젤') > -1
      })

      await bot.sendMessage(
        chatId,
        `### Raw Data ###

${JSON.stringify(list)}`,
      )

      const results = list.filter(({ agencyName }) => {
        return agencyName === '신대치' || agencyName === '오산'
      })

      await bot.sendMessage(chatId, asTable(results))
    }

  } catch (e) {
    await bot.sendMessage(chatId, `err: ${e.message || e}`)
    throw e
  }
}

(async () => {
  await main()
})()
