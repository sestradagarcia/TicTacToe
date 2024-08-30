import { View, Text } from "@lightningjs/solid";
import Menu from "../components/Menu";

export default function ExitMenu() {
  return (
    <View style={{y: 300, }}>
        <Text style={{x: 300, }}>Do you want to save?</Text>
        <View style={{x: 200, y: 200,}}>
            <Menu items={[{ label: 'SAVE', path: '/save'}, { label: 'QUIT', path: '/quit' },]}/>
        </View>
    </View>
  )
}
