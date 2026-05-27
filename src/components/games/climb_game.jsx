import {useState, useRef, useEffect} from "react";

import {useGameContext} from "../../context/GameContext.jsx";
import climber0 from "../../assets/games_illustrations/climb/climber0.svg";
import climber1 from "../../assets/games_illustrations/climb/climber1.svg";
import climber2 from "../../assets/games_illustrations/climb/climber2.svg";

import hold0 from "../../assets/games_illustrations/climb/hold0.svg";
import hold1 from "../../assets/games_illustrations/climb/hold1.svg";
import hold2 from "../../assets/games_illustrations/climb/hold2.svg";
import hold3 from "../../assets/games_illustrations/climb/hold3.svg";
import hold4 from "../../assets/games_illustrations/climb/hold4.svg";
import hold5 from "../../assets/games_illustrations/climb/hold5.svg";
import hold6 from "../../assets/games_illustrations/climb/hold6.svg";

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

        const playerX = canvas.width / 2;
        const playerY = 550;

        let playerFrame = 0;
        let animationTimer = 0;
        let isAnimating = false;
        let animationStep = 1;
        let targetFrameAfterReset = 0

        let lastTime = performance.now();
        let holdTimer = 0;
        const TIME_LIMIT = 1500;



        const sources = {
            climber0: climber0,
            climber1: climber1,
            climber2: climber2,

            hold0: hold0,
            hold1: hold1,
            hold2: hold2,
            hold3: hold3,
            hold4: hold4,
            hold5: hold5,
            hold6: hold6,

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

        const elmtSize = [
            {w:50, h:50},
            {w:50, h:50},
            {w:50, h:50},
            {w:50, h:50},
            {w:50, h:50},
            {w:50, h:50},
            {w:50, h:50}
    ];

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

                let newLetter = String.fromCharCode(getRandomInt(97, 122));
                if(newHolds.length > 0){
                    while(newLetter === newHolds[newHolds.length - 1].letter){
                        newLetter = String.fromCharCode(getRandomInt(97, 122));
                    }
                }
                newHolds.push({
                    x: isEven ? getRandomInt(250, 450) : getRandomInt(550, 750),
                    y: i,
                    letter: newLetter,
                    hold : getRandomInt(0,6)
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

            if (isAnimating) {
                animationTimer += deltaTime;

                if (animationStep === 1) {
                    playerFrame = 0;

                    if (animationTimer >= 100) {
                        animationStep = 2;
                        animationTimer = 0;
                    }
                } else if (animationStep === 2) {
                    playerFrame = targetFrameAfterReset;

                    if (animationTimer >= 250) {
                        isAnimating = false;
                    }
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

                isAnimating = true;
                animationTimer = 0;
                animationStep = 1;
                playerFrame = 0;

                targetFrameAfterReset = current_hold.x > 500 ? 1 : 2;

                holds.forEach((h) => {h.y+=100;});

                if(holds[0].y > 750){
                    holds.shift();
                    let highest_h = holds[holds.length - 1]

                    let newLetter = String.fromCharCode(getRandomInt(97, 122));
                    while(newLetter === highest_h.letter){
                        newLetter = String.fromCharCode(getRandomInt(97, 122));
                    }

                    let newH = {
                        x: (highest_h.x > 500 ?getRandomInt(250,450) : getRandomInt(550, 750)),
                        y: highest_h.y - 100,
                        letter: newLetter,
                        hold : getRandomInt(0,6)
                    };

                    holds.push(newH);
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

            const imgClimber0 = imagesRef.current.climber0;
            const imgClimber1 = imagesRef.current.climber1;
            const imgClimber2 = imagesRef.current.climber2;

            // const imgRock0 = imagesRef.current.rock0;
            // const imgRock1 = imagesRef.current.rock1;
            // const imgRock2 = imagesRef.current.rock2
            //
            // const imgGrass0 = imagesRef.current.grass0;
            // const imgGrass1 = imagesRef.current.grass1;
            // const imgGrass2 = imagesRef.current.grass2;
            //
            // const imgFinishLine = imagesRef.current.finishLine


            holds.forEach((h) => {
                const imgHold = imagesRef.current[`hold${h.hold}`];

                if(imgHold){
                    ctx.drawImage(imgHold, h.x, h.y, elmtSize[h.hold].w,elmtSize[h.hold].h );
                }
            })

            let h = holds[current_hold_id]
            ctx.fillText(h.letter, h.x, h.y);

            let currentClimber = imagesRef.current[`climber${playerFrame}`];

            if (!currentClimber) {
                currentClimber = imagesRef.current.climber0;
            }

            if (currentClimber) {
                ctx.drawImage(currentClimber, 455, 500, 90, 120);
            }


            if(gameEnd){
                if(win){
                    ctx.drawImage(imagesRef.current.victoryText, 25, 200, 950, 850);
                }else{
                    ctx.drawImage(imagesRef.current.defeatText, 250, 200, 650, 675);
                }
            }

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