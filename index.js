const TelegramApi = require('node-telegram-bot-api')
const fs = require('fs')
const path = require('path')
const token = '2119010337:AAFIrNMWKg1wXFrVAKE8wn47gUodNz4JIis'
const request = require('request');

const bot = new TelegramApi(token, { polling: true })

const voiceMessages = ['2021-11-12 12.08.02', '2021-11-12 12.12.49', '2021-11-12 12.13.05', '2021-11-12 12.13.17', '2021-11-12 12.30.52', '2021-11-12 12.30.48', '2021-11-12 12.30.44', '2021-11-12 12.30.40', '2021-11-12 12.30.37', '2021-11-12 12.30.33', '2021-11-12 12.30.29', '2021-11-12 12.30.26', '2021-11-12 12.30.20', '2021-11-12 12.30.16', '2021-11-12 12.30.12', '2021-11-12 12.30.06', '2021-11-12 12.29.59', '2021-11-12 12.29.53', '2021-11-12 12.29.49', '2021-11-12 12.29.46', '2021-11-12 12.29.41', '2021-11-12 12.29.37', '2021-11-12 12.29.33', '2021-11-12 12.29.27', '2021-11-12 12.30.56', '2021-11-12 12.31.00', '2021-11-12 12.31.04', '2021-11-12 12.31.10', 'murlikanye']
const afterAnimePhrases = ['Кароч аниме какое-то гавно, если честно', 'Это прям ЕБЕЙШЕЕ аниме бтв', 'Брух, стрейтовский кринж', 'Ну это уже почти уровень ебейших тефтелей', 'На твоём месте я бы такое не гуглил🔫🗿']


const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Ну тип ресет вселенной нахуй' },
        { command: '/voice', description: 'Абсолютно случайное голосовое моим голосом' },
        { command: '/anime', description: 'Ебейшее аниме' }
    ])
    let isolate = false
    let isListening = false
    let animeTitle = ''
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        let username = msg.chat.first_name
        
        if (text === '/start') {
            await bot.sendMessage(chatId, `Даров ${username}`)
            return await bot.sendMessage(chatId, '😎')
        }
        else if (text === '/voice') {
            let voiceMessageId = Math.floor(Math.random() * (29 - 0 + 1))
            await bot.sendVoice(chatId, `./voice_messages/${voiceMessages[voiceMessageId]}.ogg`)
            if (voiceMessageId === 28) {
                await bot.sendMessage(chatId, 'Блять тут не слышно как мой кот мурлыкает')
                return await bot.sendMessage(chatId, 'Сорь :3')
            } else {
                return
            }
        }
        else if (text === '/anime') {
            //isolate = true
            isListening=true
            return await bot.sendMessage(chatId, 'Напиши пж название тайтла или его часть, только на англ, хочу немножко повыёбываться :3')
            
            
            
        } else if (isListening) {
                animeTitle = text
                return request(`https://kitsu.io/api/edge/anime?filter[text]=${text}`, function (error, response, body) {
                try {
                    const animeData = JSON.parse(body).data
                    let animeOptionsArr = []
                    animeData.map((anime)=>animeOptionsArr.push([{text: anime.attributes.titles.en_jp, callback_data: anime.id}]))
                    let animeOptions = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: animeOptionsArr
                        })
                    }
                    if (animeOptionsArr.length > 0) {
                        isListening = false
                        return bot.sendMessage(chatId, 'Крч я нашол вот эти ониме:', animeOptions)
                    } else {
                        isListening = false
                        return bot.sendMessage(chatId, 'Я таких аниме не нашол, ха!')
                    }
                    
                    
                } catch (error) {
                    console.log(error)
                    bot.sendMessage(chatId, 'Ой сорь, я обосрался походу, попробуй ещё раз пж')
                    bot.sendSticker(chatId, './telegram-cloud-document-2-3169966196963409953.webp')
                }
            })
                
                
        } else if (!isolate) {
            await bot.sendVideoNote(chatId, './video_messages/2021-11-12 16.35.37.mp4')
            return await bot.sendMessage(chatId, 'Ыыы извини пожалуйста я не панимаю')
        }
    })
    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id
        const data = msg.data
        return request(`https://kitsu.io/api/edge/anime?filter[text]=${animeTitle}`,  async (error, response, body) => {
            try {
                    const animeData = JSON.parse(body).data
                const animeStats = animeData.find(anime => anime.id == data).attributes
                if (animeStats.description.length < 700) {
                    await bot.sendPhoto(chatId, animeStats.posterImage.original, {
                        caption: `Бля чёт так на английском побазарить захотелось🗿🗿🗿 Кароч вот чё такое "${animeStats.titles.en_jp}": 

${animeStats.description}`
                    })
                    let afterAnimePhraseId = Math.floor(Math.random() * (4 - 0 + 1))
                    return bot.sendMessage(chatId, afterAnimePhrases[afterAnimePhraseId])
                } else {
                    await bot.sendPhoto(chatId, animeStats.posterImage.original, {
                        caption: `Кароч аниме "${animeStats.titles.en_jp}" - полное днище, под него только срать и можно`
                    })
                }
                    
            } catch (error) {
                console.log(error)
                bot.sendMessage(chatId, 'Ой сорь, я обосрался походу, попробуй ещё раз пж')
                bot.sendSticker(chatId, './telegram-cloud-document-2-3169966196963409953.webp')
            }
            })
        
    })

    
}

start()