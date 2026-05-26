import {useState, useRef, useEffect} from "react";

import {useGameContext} from "../../context/GameContext.jsx";
import trailer0 from "../../assets/games_illustrations/trail/trailer0.svg";
import tree0 from "../../assets/games_illustrations/share/tree0.svg";
import tree1 from "../../assets/games_illustrations/share/tree1.svg";
import tree2 from "../../assets/games_illustrations/share/tree2.svg";
import rock0 from "../../assets/games_illustrations/trail/rock0.svg";
import rock1 from "../../assets/games_illustrations/trail/rock1.svg";
import rock2 from "../../assets/games_illustrations/trail/rock2.svg";
import grass0 from "../../assets/games_illustrations/share/grass0.svg";
import grass1 from "../../assets/games_illustrations/share/grass1.svg";
import grass2 from "../../assets/games_illustrations/share/grass2.svg";
import finishLine from "../../assets/games_illustrations/share/finish_line.svg";
import victoryText from "../../assets/games_illustrations/share/texte_victoire.svg";
import defeatText from "../../assets/games_illustrations/trail/texte_defaite.svg";

function climb_game({setGame}){

    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    const pixelPastedRef = useRef(0);
    const [gameStarted, setGameStarted] = useState(false);

    const { handleGameResult, setDisplayBook, getRandomInt } = useGameContext();

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 1000;
        canvas.height = 700;

        let win = false;
        let gameEnd = false;

        let holds = createHolds();

        let keys = {};

        for (let i = 97; i <= 122; i++) {
            keys[String.fromCharCode(i)] = false;
        }

        let lastTime = performance.now();
        let holdTimer = 0;
        const TIME_LIMIT = 1500;

        const sources = {
            trailer0: trailer0,

            tree0: tree0,
            tree1: tree1,
            tree2: tree2,

            rock0:rock0,
            rock1:rock1,
            rock2:rock2,

            grass0:grass0,
            grass1:grass1,
            grass2:grass2,

            finishLine: finishLine,
            victoryText : victoryText,
            defeatText: defeatText
        };

        let loadedCount = 0;
        const totalImages = Object.keys(sources).length;
        let animationFrameId;


        Object.entries(sources).forEach(([key, src]) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imagesRef.current[key] = img;
                loadedCount++;
                if (loadedCount === totalImages) {
                    gameLoop();
                }
            };
        });

        function createHolds(){
            let newHolds = [];

            for (let i = 500; i > -400; i -= 100) {
                const isEven = Math.abs(i) % 200 === 0;
                newHolds.push({
                    x: isEven ? getRandomInt(250, 450) : getRandomInt(550, 750),
                    y: i,
                    letter: String.fromCharCode(getRandomInt(97, 122))
                });
            }

            return newHolds;
        }



        const handleKeyDown = (e) => {
            if (canvas.dataset.started !== "true" || gameEnd) return;
            let pressedKey = e.key;
            if (pressedKey in keys) {
                let current_hold = holds[current_hold_id];

                if (pressedKey === current_hold.letter) {
                    keys[pressedKey] = true;
                }
                else {
                    win = false;
                    gameEnd = true;
                    setGameStarted(false);
                    handleGameResult(0, false);
                }
            }
        };

        const handleKeyUp = (e) => {
            if (e.key in keys) {
                keys[e.key] = false;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        let current_hold_id = 0;

        function gameLoop() {
            const now = performance.now();
            const deltaTime = now - lastTime;
            lastTime = now;

            if (canvas.dataset.reset === "true") {
                holdTimer = 0;
                gameEnd = false;
                win = false;
                pixelPastedRef.current = 0;
                holds = createHolds();
                canvas.dataset.reset = "false";
                current_hold_id = 0;
            }

            if (canvas.dataset.started === "true" && !gameEnd) {
                holdTimer += deltaTime;

                if (holdTimer >= TIME_LIMIT) {
                    win = false;
                    gameEnd = true;
                    setGameStarted(false);
                    handleGameResult(0, false);
                }
            }

            updatePositions();
            drawGame();
            animationFrameId = requestAnimationFrame(gameLoop);
        }



        function updatePositions(){
            if (canvas.dataset.started !== "true" || gameEnd) {
                return;
            }

            let current_hold =  holds[current_hold_id];

            if(keys[current_hold.letter]){
                holdTimer = 0;
                holds.forEach((h) => {
                    h.y+=100;
                });

                if(holds[0].y > 750){
                    holds.shift();
                    let highest_h = holds[holds.length - 1]

                    holds.push({
                        x: (highest_h.x > 500 ?getRandomInt(250,450) : getRandomInt(550, 750)),
                        y: highest_h.y - 100,
                        letter: String.fromCharCode(getRandomInt(97, 122))
                    })
                }else{
                    current_hold_id++;
                }

                if(current_hold_id >= holds.length-1){
                    current_hold_id = holds.length-1;
                }
            }
        }

        function drawGame(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#585858";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = "bold 40px Arial";
            ctx.fillStyle = "#FFFFFF";
            let h = holds[current_hold_id]
            ctx.fillText(h.letter, h.x, h.y);
        }
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