import React from 'react'
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ImageBackground,
  ImageSourcePropType,
  Text
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { THEME } from '../../theme'
import { styles } from './styles'

interface Props extends TouchableOpacityProps {
  data: GameCardProps
}

export interface GameCardProps {
  id: string
  name: string
  ads: string
  cover: ImageSourcePropType
}

export const GameCard: React.FC<Props> = ({ data, ...rest }: Props) => {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <ImageBackground source={data.cover} style={styles.cover}>
        <LinearGradient colors={THEME.COLORS.FOOTER} style={styles.footer}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.ads}>{data.ads} anúncios</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )
}
