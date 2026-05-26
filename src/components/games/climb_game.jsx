import {useState, useRef, useEffect} from "react";

import {useGameContext} from "../../context/GameContext.jsx";

function climb_game({setGame}){

    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    const pixelPastedRef = useRef(0);
    const [gameStarted, setGameStarted] = useState(false);

    const { handleGameResult, setDisplayBook, getRandomInt } = useGameContext();


    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let win = false;
        let gameEnd = false;

        canvas.width = 1000;
        canvas.height = 700;


        // function gameLoop() {
        //     if (canvas.dataset.reset === "true") {
        //         gameEnd = false;
        //         win = false;
        //         pixelPastedRef.current = 0;
        //         playerX = 450;
        //         obstacles = createObstacles();
        //         canvas.dataset.reset = "false";
        //         speed = 4;
        //         playerDirection = 0;
        //     }
        //     updatePositions();
        //     drawGame();
        //     animationFrameId = requestAnimationFrame(gameLoop);
        // }
    }, []);

    return (
        <div className={"game"}>
            <button className={"back-button"} onClick={() => {
                setGame(false);
                setDisplayBook(true);
                setGameStarted(false);
            }}>
                Revenir au livre
            </button>

            {!gameStarted && (
                <button className={"launch-game-button"} onClick={() => {
                    canvasRef.current.dataset.reset = "true";
                    setGameStarted(true);
                }}>
                    Lancer le jeu !
                </button>
            )}


            <canvas className="canvas" ref={canvasRef} data-started={gameStarted ? "true" : "false"} />

            <div className={"instruction"}>Appuyer sur les touches indiquées le plus rapidement possible.</div>
        </div>
    );
}




export default climb_game;