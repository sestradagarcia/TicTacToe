import { Text, View } from "@lightningtv/solid";
import { useNavigate } from "@solidjs/router";
import { For, onMount } from "solid-js";
import Grid from "../components/Grid";

export default function About() {
    const navigate = useNavigate();

    let tileRefs = [1, 2, 3, 3, 4, 5, 6, 7, 9]
    let lineElementRef;

    const tiles = ['x', 'o', 'x', 'o', 'o', 'x', 'o', 'x', 'x']

    onMount(() => {
        setTimeout(() => {
            tileRefs.forEach((ref, idx) => {
                ref.animate({ alpha: 1, scale: 1.2 }, { duration: 300 * idx + 1, easing: 'ease-in' }).start();
            });
            lineElementRef.animate({ height: 900 }, { duration: 4000, delay: 2100, easing: 'cubic-bezier(0.00, 0, 0.16, 1)' }).start();
        }, 1000);
    })

    return (
        <View onBack={() => navigate('/menu')}>
            <Text style={{ fontSize: 60, width: 1500, contain: 'width', textAlign: 'center', x: 300 }}>
                This is a tic-tac-toe game made by Stephanie using Lightning 3 Solid JS
            </Text>
            <Grid x={800} y={150} color={0xffffffff} />
            <For each={tiles}>
                {(tile, idx) => (
                    <Text ref={tileRefs[idx()]} style={{ x: (idx() % 3) * 300 + 560, y: ~~(idx() / 3) * 300 + 250, color: 0x40ffffff, zIndex: 1000, alpha: 0, scale: 1 }}> {/*ref={`${"tile"+idx}`}*/}
                        {tile}
                    </Text>
                )}
            </For>
            <View ref={lineElementRef} style={{ width: 5, height: 0, x: 1250, y: 150, color: 0xffffffff }} />
        </View>
    )
}
