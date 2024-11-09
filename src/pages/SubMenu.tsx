import { Text, View } from '@lightningtv/solid';
import Menu from '../components/Menu';

// Define the type for menu item objects
interface MenuItem {
    label: string;
    path: string;
}

export default function MainMenu() {
    // Define the menu items with explicit type
    const menuItems: MenuItem[] = [
        { label: "TWO PLAYER", path: "/twoplayergame" },
        { label: "SINGLE PLAYER", path: "/singleplayergame" }
    ];

    return (
        <View style={{
            x: 600,
            y: 400
        }}>
            <Menu items={menuItems} />
        </View>
    );
}
