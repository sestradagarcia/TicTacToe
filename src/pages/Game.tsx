import { ElementNode, Text, View, hexColor } from "@lightningtv/solid";
import { createEffect, createSignal, For, Show, onMount, onCleanup } from "solid-js";
import { Column } from '@lightningtv/solid-ui';
import Utils from '../lib/GameUtils.js';
import Grid from "../components/GameGrid";
import GestureRecognition from "../lib/GestureRecogniser.js";

interface GameProps {
    mode: string;
    difficulty: string;
}

export default function Game({ mode, difficulty }: GameProps) {
    const [index, setIndex] = createSignal(0)
    const [tiles, setTiles] = createSignal(['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'])
    const [player1Turn, setPlayer1Turn] = createSignal(true)
    const [gameOutcome, setGameOutcome] = createSignal('')
    const [end, setEnd] = createSignal(false)
    const [player1Score, setPlayer1Score] = createSignal(0)
    const [player2Score, setPlayer2Score] = createSignal(0)
    const [computerScore, setComputerScore] = createSignal(0)

    let playerPosition!: ElementNode
    let player1!: ElementNode
    let player2!: ElementNode
    let computer!: ElementNode

    const reset = () => {
        setIndex(0)
        setTiles(['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'])
        setPlayer1Turn(true)
        setGameOutcome('')
        setEnd(false)
    }
    
    //handle up, down,left, and right keys on playersTurn to move playerPosition

    const handleUp = () => {
        if (player1Turn() || mode === "two-player") {
            if (index() - 3 >= 0) {
                setIndex(index() - 3)
            }
            console.log("up")
        }
    }

    const handleDown = () => {
        if (player1Turn() || mode === "two-player") {
            if (index() + 3 <= tiles().length - 1) {
                setIndex(index() + 3)
            }
            console.log("Down")
        }
    }

    const handleRight = () => {
        if (player1Turn() || mode === "two-player") {
            if ((index() + 1) % 3) {
                setIndex(index() + 1)
            }
            console.log("right")
        }
    }

    const handleLeft = () => {
        if (player1Turn() || mode === "two-player") {
            if (index() % 3) {
                setIndex(index() - 1)
            }
            console.log("left")
        }
    }

    const place = (position, marker) => {
        if (!end()) {
            if (tiles()[position] === 'e') {
                const updatedTiles = [...tiles()]
                updatedTiles[position] = marker
                const tilesRemaining = updatedTiles.map((el, idx) => {
                    if (el === 'e') return idx
                }).filter(Boolean)
                setTiles(updatedTiles)
                console.log("winner", Utils.getWinner(updatedTiles))
                if (Utils.getWinner(updatedTiles)) {
                    setGameOutcome('Win')
                    setEnd(true)
                } else if (!tilesRemaining.length) {
                    setGameOutcome('Tie')
                    setEnd(true)
                }
                setPlayer1Turn(!player1Turn())
            }
        }
    }

    const handleEnter = () => {
        if (end()) {
            if (gameOutcome() === 'Win') {
                if (Utils.getWinner(tiles()) === 'x') {
                    setPlayer1Score(player1Score() + 1)
                } else {
                    mode === "single-player" ? setComputerScore(computerScore() + 1) : setPlayer2Score(player2Score() + 1)
                }
            }
            reset()
        } else if (player1Turn()) {
            place(index(), 'x')
            mode === "single-player" && !end() && ComputerTurn()
        } else if (!player1Turn() && mode === "two-player") {
            place(index(), 'o')
        }
        console.log("enter")
    }

    //handle computers turn
    const ComputerTurn = () => {
        const AIPosition = Utils.AI(tiles(), difficulty)
        if (AIPosition === -1) {
            setGameOutcome('Tie')
            setEnd(true)
        }
        setTimeout(() => {
            if (!player1Turn()) {
                place(AIPosition, 'o')
            }
        }, ~~(Math.random() * 1200) + 200)
    }

    const getNotification = () => {
        if (end()) {
            if (gameOutcome() === 'Tie') {
                return 'Tie (press enter to try again)'
            } else if (gameOutcome() === 'Win') {
                if (Utils.getWinner(tiles()) === 'x') {
                    return 'Player wins (press enter to continue)'
                } else {
                    return (mode === "single-player" ? 'Computer wins (press enter to continue)' : 'Player 2 wins (press enter to continue)')
                }
            }
        }
        console.log("show notification")
    }

    onMount(() => {
        const videoElement = document.getElementById("webcam") as HTMLVideoElement;
    
        if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
            console.error("videoElement is not a valid HTMLVideoElement");
            return;
        }
        videoElement.style.transform = 'scaleX(-1)';
        videoElement.style.position = 'absolute';
        videoElement.style.top = '50px';
        videoElement.style.left = '50px';
        videoElement.style.width = '600px';
        videoElement.style.zIndex = '100';
        document.body.appendChild(videoElement);
    
        GestureRecognition(videoElement, {
            handleUp,
            handleDown,
            handleLeft,
            handleRight,
            handleEnter,
        });
    
        onCleanup(() => {
            videoElement.remove();
        });
    });

    createEffect(() => {
        playerPosition.x = (index() % 3) * 300 + 428
        playerPosition.y = ~~(index() / 3) * 300 + 148
        playerPosition.alpha = !end() ? 0.1 : 0 || end() && 0
        playerPosition.color = player1Turn() ? hexColor('#FFFF00') : hexColor('#FF0000')
        player1.fontSize = player1Turn() && !end() ? 50 : 40
        mode === "two-player" ? (player2.fontSize = !player1Turn() && !end() ? 50 : 40) : (computer.fontSize = !player1Turn() && !end() ? 50 : 40);
    });

    return (
        <View autofocus onEnter={handleEnter} onUp={handleUp} onDown={handleDown} onRight={handleRight} onLeft={handleLeft}>
            <Column>
                <Text ref={player1} style={{ y: 10, fontSize: 40, color: hexColor('#FFFF00') }}>Player 1:  {player1Score()}</Text>
                {mode === "two-player" ? <Text ref={player2} style={{ y: 60, fontSize: 40, color: hexColor('#FF0000') }}>Player 2:  {player2Score()}</Text>
                    : <Text ref={computer} style={{ y: 60, fontSize: 40, color: hexColor('#FF0000') }}>Computer: {computerScore()}</Text>}
            </Column>
            <View ref={playerPosition} style={{
                width: 250,
                height: 250,
                color: 0x40ffffff,
                x: 575,
                y: 145,
                zIndex: 1000,
                transition: {
                    y: { duration: 800, easing: 'ease-in-out' },
                    x: { duration: 800, easing: 'ease-in-out' },
                },
            }} />
            <Grid x={700} y={120} color={0x40ffffff}/>
            <For each={tiles()}>
                {(tile, idx) => (
                    <Text style={{ x: (idx() % 3) * 300 + 505, y: ~~(idx() / 3) * 300 + 165, color: 0x40ffffff, zIndex: 1000, fontSize:200 }}>
                        {tile === 'e' ? '' : tile}
                    </Text>
                )}
            </For>
            <Show when={gameOutcome() === 'Win' || gameOutcome() === 'Tie'}>
                <Text style={{
                    fontSize: 60, width: 1500, contain: 'width', textAlign: 'centre',
                    color: 0x40ffffff, x: 300,
                    y: 0, zIndex: 1000,
                    alpha: 1,
                    transition: {
                        alpha: { duration: 300, easing: "ease-in" },
                    }
                }}>
                    {getNotification()}
                </Text>
            </Show>
        </View>
    )
}
