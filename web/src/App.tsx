import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { GameBanner } from './components/GameBanner'
import { CreateAdBanner } from './components/CreateAdBanner'
import { CreateAdModal } from './components/CreateAdModal'

import { api } from './services/api'
import logoImg from './assets/logo-nlw-esports.svg'
import './styles/main.css'

interface Game {
  id: string
  title: string
  bannerUrl: string
  _count: {
    ads: number
  }
}

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    api
      .get('/games')
      .then(response => {
        const sortedList = response.data.sort((a: Game, b: Game) => {
          return a.title.toLowerCase() < b.title.toLowerCase()
            ? -1
            : a.title.toLowerCase() > b.title.toLowerCase()
            ? 1
            : 0
        })

        setGames(sortedList)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} />
      <h1 className="text-6xl text-white font-black mt-20">
        Seu{' '}
        <span className="text-transparent bg-nwl-gradient bg-clip-text">
          duo
        </span>{' '}
        está aqui
      </h1>

      <div className="grid grid-cols-6 gap-6 mt-16">
        {games.map(game => {
          return (
            <GameBanner
              key={game.id}
              title={game.title}
              bannerUrl={game.bannerUrl}
              adsCount={game._count.ads}
            />
          )
        })}
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CreateAdBanner />

        {isModalOpen && <CreateAdModal />}
      </Dialog.Root>
    </div>
  )
}

export default App
