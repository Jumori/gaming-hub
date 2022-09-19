import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { TouchableOpacity, View, Image, FlatList, Text } from 'react-native'
import { Entypo } from '@expo/vector-icons'

import { GameParams } from '../../@types/navigation'
import { Background } from '../../components/Background'
import { Heading } from '../../components/Heading'
import { DuoCard, DuoCardProps } from '../../components/DuoCard'

import logoImg from '../../assets/logo-nlw-esports.png'
import { styles } from './styles'
import { THEME } from '../../theme'
import { api } from '../../services/api'

export const Game: React.FC = () => {
  const [duos, setDuos] = useState<DuoCardProps[]>([])

  const navigation = useNavigation()
  const route = useRoute()
  const game = route.params as GameParams

  const handleGoBack = (): void => {
    navigation.goBack()
  }

  useEffect(() => {
    api
      .get(`/games/${game.id}/ads`)
      .then(response => {
        setDuos(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo} />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          resizeMode="cover"
          style={styles.cover}
        />

        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />

        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => {}} />
          )}
          horizontal
          contentContainerStyle={[
            duos.length > 0 ? styles.contentList : styles.emptyListContent
          ]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicado ainda.
            </Text>
          )}
          style={styles.containerList}
        />
      </SafeAreaView>
    </Background>
  )
}
