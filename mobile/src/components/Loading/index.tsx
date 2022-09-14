import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import { THEME } from '../../theme'
import { styles } from './styles'

export const Loading: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={THEME.COLORS.PRIMARY} />
    </View>
  )
}
