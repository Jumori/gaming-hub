import React, { useState } from 'react'
import { Image, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import logoImg from '../../assets/logo-nlw-esports.png'
import { Heading } from '../../components/Heading/index'
import { GameCard, GameCardProps } from '../../components/GameCard/index'
import { Background } from '../../components/Background'
import { api } from '../../services/api'
import { styles } from './styles'

export const Home: React.FC = () => {
  const [games, setGames] = useState<GameCardProps[]>([])
  const navigation = useNavigation()

  const handleOpenGame = ({ id, title, bannerUrl }: GameCardProps): void => {
    navigation.navigate('game', { id, title, bannerUrl })
  }

  useFocusEffect(
    React.useCallback(() => {
      api
        .get('/games')
        .then(response => {
          const sortedList = response.data.sort(
            (a: GameCardProps, b: GameCardProps) => {
              return a.title.toLowerCase() < b.title.toLowerCase()
                ? -1
                : a.title.toLowerCase() > b.title.toLowerCase()
                ? 1
                : 0
            }
          )

          setGames(sortedList)
        })
        .catch(error => {
          console.error(error)
        })
    }, [])
  )

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Image source={logoImg} style={styles.logo} />

        <Heading
          title="Encontre seu duo!"
          subtitle="Selecione o game que deseja jogar..."
        />

        <FlatList
          data={games}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GameCard data={item} onPress={() => handleOpenGame(item)} />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.contentList}
        />
      </SafeAreaView>
    </Background>
  )
}
