import { Text, View } from '@lightningjs/solid';
import Menu from '../components/Menu';

export default function MainMenu() {
    return (
        <View style={{
            x: 600,
            y: 400
        }}>
            <Menu items={[
                    { label: "TWO PLAYER", path: "/twoPlayerGame" },
                    { label: "SINGLE PLAYER", path: "/singlePlayerGame" }
                ]}/>
        </View>
    )
}
