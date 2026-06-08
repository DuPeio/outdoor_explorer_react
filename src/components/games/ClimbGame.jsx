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

import finishLine from "../../assets/games_illustrations/share/finish_line.svg";

import victoryText from "../../assets/games_illustrations/share/texte_victoire.svg";
import defeatText from "../../assets/games_illustrations/climb/texte_defaite.svg";

import {BASE_HEIGHT, BASE_WIDTH} from "../../config/constants.js";

function ClimbGame({setGame}){

    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    const pixelPastedRef = useRef(0);
    const [gameStarted, setGameStarted] = useState(false);
    const animationFrameIdRef = useRef(null);
    const currentScaleRef = useRef(1);

    const { returnGamePage, drawEndGame, getCanvasScale, screenSize, handleGameResult, getRandomInt } = useGameContext();

    useEffect(() => {
        currentScaleRef.current = getCanvasScale(canvasRef.current);
    }, [screenSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        currentScaleRef.current = getCanvasScale(canvasRef.current);

        const playerX = BASE_WIDTH / 2;

        let score = 0;

        let fakeHolds = [];

        const holdsSizes = [
            {w:45, h:68.5},
            {w:41, h:49},
            {w:35.5, h:63.5},
            {w:47, h:49},
            {w:38.5, h:58},
            {w:84.5, h:41},
            {w:75, h:59}
        ];

        let currentScrollY = 0;
        let targetScrollY = 0;


        let win = false;
        let gameEnd = false;

        let holds = createHolds();

        let keys = {};

        for (let i = 97; i <= 122; i++) {
            keys[String.fromCharCode(i)] = false;
        }

        let playerFrame = 0;
        let animationTimer = 0;
        let isAnimating = false;
        let animationStep = 1;
        let targetFrameAfterReset = 0

        let lastTime = performance.now();
        let holdTimer = 0;
        const timeLimit = 1500;

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

            finishLine: finishLine,
            victoryText : victoryText,
            defeatText: defeatText
        };

        let loadedCount = 0;
        const totalImages = Object.keys(sources).length;
        
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
            fakeHolds = [];
            currentScrollY = 0;
            targetScrollY = 0;

            for (let i = 285; i > -400; i -= 100) {
                const isEven = newHolds.length%2 === 0;

                let newLetter = String.fromCharCode(getRandomInt(97, 122));
                if(newHolds.length > 0) {
                    while(newLetter === newHolds[newHolds.length - 1].letter){
                        newLetter = String.fromCharCode(getRandomInt(97, 122));
                    }
                }

                let newHold = getRandomInt(0,6);

                newHolds.push({
                    x: isEven ?  playerX - 75 - holdsSizes[newHold].w/2 : playerX + 80 - holdsSizes[newHold].w/2,
                    y: i,
                    letter: newLetter,
                    hold : newHold
                });

                fakeHolds.push({
                    x: getRandomInt(0, 300),
                    y: i+getRandomInt(-45,45),
                    hold : getRandomInt(0,6)
                })

                fakeHolds.push({
                    x: getRandomInt(BASE_WIDTH-250, BASE_WIDTH-10),
                    y: i+getRandomInt(-45,45),
                    hold : getRandomInt(0,6)
                })
            }
            return newHolds;
        }

        const handleKeyDown = (e) => {
            if (canvas.dataset.started !== "true" || gameEnd) return;
            let pressedKey = e.key;
            if(pressedKey === "Enter") {
                win = true;
                gameEnd = true;
                setGameStarted(false);
                handleGameResult(2, true);
            }
            if (pressedKey in keys) {
                let currentHold = holds[currentHoldId];

                if (pressedKey === currentHold.letter) {
                    keys[pressedKey] = true;
                    score ++;
                }
                else {
                    win = false;
                    gameEnd = true;
                    setGameStarted(false);
                    handleGameResult(2, false);
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

        let currentHoldId = 0;

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
                currentHoldId = 0;
                playerFrame = 0;
                score = 0
            }

            if (canvas.dataset.started === "true" && !gameEnd) {
                holdTimer += deltaTime;

                if (holdTimer >= timeLimit) {
                    win = false;
                    gameEnd = true;
                    setGameStarted(false);
                    handleGameResult(2, false);
                }
            }

            if (currentScrollY < targetScrollY) {
                currentScrollY += (targetScrollY - currentScrollY) * 0.15;

                if (targetScrollY - currentScrollY < 0.5) {
                    currentScrollY = targetScrollY;
                }
            }

            if (isAnimating) {
                animationTimer += deltaTime;

                if (animationStep === 1) {
                    playerFrame = 0;

                    if (animationTimer >= 50) {
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
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        }

        function updatePositions(){
            if (canvas.dataset.started !== "true" || gameEnd) {
                return;
            }

            let currentHold = holds[currentHoldId];

            if(keys[currentHold.letter]){
                holdTimer = 0;

                isAnimating = true;
                animationTimer = 0;
                animationStep = 1;
                playerFrame = 0;

                targetFrameAfterReset = currentHold.x > BASE_WIDTH/2 ? 1 : 2;

                targetScrollY += 100;

                let highestFake = fakeHolds[fakeHolds.length - 1];
                if (highestFake.y + currentScrollY > -200) {
                    fakeHolds.push({
                        x: getRandomInt(0, 300),
                        y: highestFake.y - 100,
                        hold: getRandomInt(0, 6)
                    });
                    fakeHolds.push({
                        x: getRandomInt(BASE_WIDTH-250, BASE_WIDTH - 10),
                        y: highestFake.y - 100,
                        hold: getRandomInt(0, 6)
                    });
                }

                let highestH = holds[holds.length - 1];
                if (highestH.y + currentScrollY > -200) {
                    let newLetter = String.fromCharCode(getRandomInt(97, 122));
                    while(newLetter === highestH.letter){
                        newLetter = String.fromCharCode(getRandomInt(97, 122));
                    }

                    let newHold = getRandomInt(0,6);
                    let newH = {
                        x: (highestH.x > BASE_WIDTH/2 ? playerX - 75 - holdsSizes[newHold].w/2 : playerX + 85 - holdsSizes[newHold].w/2),
                        y: highestH.y - 100,
                        letter: newLetter,
                        hold : newHold
                    };
                    holds.push(newH);
                }

                currentHoldId++;

                if(score === 20){
                    win = true;
                    gameEnd = true;
                    setGameStarted(false);
                    handleGameResult(2, true);
                }
            }
        }

        function drawGame(){
            const scale = currentScaleRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(scale, scale);

            ctx.fillStyle = "#585858";
            ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

            ctx.font = "bold 24px Arial";
            ctx.fillStyle = "#DABE12FF";

            fakeHolds.forEach((h) => {
                const imgHold = imagesRef.current[`hold${h.hold}`];

                if(imgHold){
                    ctx.drawImage(imgHold, h.x, h.y + currentScrollY, holdsSizes[h.hold].w, holdsSizes[h.hold].h);
                }
            });

            holds.forEach((h) => {
                const imgHold = imagesRef.current[`hold${h.hold}`];

                if(imgHold){
                    ctx.drawImage(imgHold, h.x, h.y + currentScrollY, holdsSizes[h.hold].w, holdsSizes[h.hold].h);
                }
            });

            if(!gameEnd){ctx.fillText(`Score : ${score}`, BASE_WIDTH/2-45, BASE_HEIGHT-10);}

            if(!win){
                let h = holds[currentHoldId]
                ctx.fillText(h.letter.toUpperCase(), h.x+holdsSizes[holds[currentHoldId].hold].w/2, h.y+holdsSizes[holds[currentHoldId].hold].h*1.5+currentScrollY);

                ctx.beginPath();
                ctx.arc(h.x+holdsSizes[holds[currentHoldId].hold].w/2, h.y+holdsSizes[holds[currentHoldId].hold].h/2+currentScrollY, holdsSizes[holds[currentHoldId].hold].w, 0, Math.PI * 2);
                ctx.strokeStyle = "rgb(218 190 18 / 0.12)";
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.closePath();
            }

            let currentClimber = imagesRef.current[`climber${playerFrame}`];

            if (!currentClimber) {
                currentClimber = imagesRef.current.climber0;
            }

            if (currentClimber) {
                ctx.drawImage(currentClimber, BASE_WIDTH / 2 - 100, 375, 200, 300);
            }

            if(gameEnd){drawEndGame(ctx, win, imagesRef);}

            ctx.restore();
        }

        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        returnGamePage("Appuyer sur les touches indiquées le plus rapidement possible. Il faut un score de 20 pour gagner !", canvasRef, gameStarted, setGameStarted, setGame)
    );
}

export default ClimbGame;