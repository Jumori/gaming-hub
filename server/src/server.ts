import express from 'express'
import cors from 'cors'

import { PrismaClient } from '@prisma/client'
import { convertHoursStringToMinutes } from './utils/convertHourStringToMinutes'
import { convertMinutesToHourString } from './utils/convertMinutesToHourString'

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({ log: ['query'] })

app.get('/games', async (request, response) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            ads: true
          }
        }
      }
    })

    return response.status(200).json(games)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ data: 'Erro interno, checar logs' })
  }
})

app.post('/games/:id/ads', async (request, response) => {
  try {
    const gameId = request.params.id
    const body = request.body

    const ad = await prisma.ad.create({
      data: {
        gameId,
        name: body.name,
        weekDays: body.weekDays.join(','),
        useVoiceChannel: body.useVoiceChannel,
        yearsPlaying: body.yearsPlaying,
        hourStart: convertHoursStringToMinutes(body.hourStart),
        hourEnd: convertHoursStringToMinutes(body.hourEnd),
        discord: body.discord
      }
    })

    return response.status(201).json(ad)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ data: 'Erro interno, checar logs' })
  }
})

app.get('/games/:id/ads', async (request, response) => {
  try {
    const gameId = request.params.id

    const ads = await prisma.ad.findMany({
      select: {
        id: true,
        name: true,
        weekDays: true,
        useVoiceChannel: true,
        yearsPlaying: true,
        hourStart: true,
        hourEnd: true
      },
      where: {
        gameId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return response.status(200).json(
      ads.map(ad => {
        return {
          ...ad,
          weekDays: ad.weekDays.split(','),
          hourStart: convertMinutesToHourString(ad.hourStart),
          hourEnd: convertMinutesToHourString(ad.hourEnd)
        }
      })
    )
  } catch (error) {
    console.error(error)
    return response.status(500).json({ data: 'Erro interno, checar logs' })
  }
})

app.get('/ads/:id/discord', async (request, response) => {
  try {
    const adId = request.params.id
    const ad = await prisma.ad.findUniqueOrThrow({
      select: {
        discord: true
      },
      where: {
        id: adId
      }
    })

    return response.status(200).json({
      discord: ad.discord
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ data: 'Erro interno, checar logs' })
  }
})

app.listen(3333)
