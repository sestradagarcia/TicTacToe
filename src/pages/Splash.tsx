import { ElementNode, Text, View } from '@lightningtv/solid';
import { onMount } from "solid-js"
import { useNavigate } from "@solidjs/router";

export default function Splash({ text, path }) {
    const navigate = useNavigate();

    let loadRef!: ElementNode

    const animation = (a, t) => {
        setTimeout(() => {
            loadRef.animate({ alpha: a }, { duration: 1000, easing: 'ease-in-out' }).start();
            console.log(a, t)
        }, t);
    }

    onMount(() => {
        animation(1, 5)
        animation(0, 1005)
        animation(1, 2005)
        animation(0, 3005)
        animation(1, 4005)
        animation(0, 5005)

        const timeout = setTimeout(() => {
            path && navigate(path);
        }, 6000);
        return () => clearTimeout(timeout);
    });
    return (
        <View>
            <Text style={{ fontSize: 75 }}>TicTacToe</Text>
            <Text ref={loadRef} style={{ alpha: 0, y: 500, x: 900 }}>{text}</Text>
        </View>
    )
}
