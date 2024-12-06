import { Text, View } from '@lightningtv/solid';
import Menu from '../components/Menu';

export default function MainMenu() {
    return (
        <View style={{
            x: 600,
            y: 400
        }}>
            <Menu items={[{ label: 'START GAME', path: '/submenu' }, { label: 'ABOUT', path: '/about' }, { label: 'EXIT', path: '/exitmenu' }]} />
        </View>
    )
}
