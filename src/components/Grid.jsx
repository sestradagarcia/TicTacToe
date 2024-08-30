import { View } from '@lightningjs/solid';

export default function Grid({x, y, color }) {
  return (
    <View style={{
        x: x,
        y: y,
    }}>
        <View style={{ width: 5, height: 900, x: 0, y: 0, color: color, }} />
        <View style={{ width: 5, height: 900, x: 300, y: 0, color: color, }} />
        <View style={{ height: 5, width: 900, x: -300, y: 300, color: color, }} />
        <View style={{ height: 5, width: 900, x: -300, y: 600, color: color, }} />
    </View>
  )
}
