import { useRef, useEffect, useState } from "react";
import skier from "../../assets/games_illustrations/ski/skier.svg";
import skierG from "../../assets/games_illustrations/ski/skierG.svg";
import skierD from "../../assets/games_illustrations/ski/skierD.svg";

import tree0 from "../../assets/games_illustrations/ski/tree.svg";
import tree1 from "../../assets/games_illustrations/ski/tree1.svg";
import tree2 from "../../assets/games_illustrations/ski/tree2.svg";

import fan0 from "../../assets/games_illustrations/ski/fan0.svg";
import fan1 from "../../assets/games_illustrations/ski/fan1.svg";
import fan2 from "../../assets/games_illustrations/ski/fan2.svg";

import blueGate from "../../assets/games_illustrations/ski/blue_gates.svg";
import redGate from "../../assets/games_illustrations/ski/red_gates.svg";

import finishLine from "../../assets/games_illustrations/ski/finish_line.svg";
import victoryText from "../../assets/games_illustrations/share/texte_victoire.svg";
import defeatText from "../../assets/games_illustrations/ski/texte_defaite.svg";

import { useGameContext } from "../../context/GameContext.jsx";
import { BASE_WIDTH, BASE_HEIGHT } from '../../config/constants.js';

function SkiGame({ setGame }) {
    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    const pixelPastedRef = useRef(0);
    const animationFrameIdRef = useRef(null);
    const currentScaleRef = useRef(1);

    const [gameStarted, setGameStarted] = useState(false);

    const { screenSize, handleGameResult, setDisplayBook, getRandomInt } = useGameContext();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 140;
        const scaleX = maxWidth / BASE_WIDTH;
        const scaleY = maxHeight / BASE_HEIGHT;
        const newScale = Math.min(scaleX, scaleY, 1);

        currentScaleRef.current = newScale;
        canvas.width = BASE_WIDTH * newScale;
        canvas.height = BASE_HEIGHT * newScale;
    }, [screenSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 140;
        const scaleX = maxWidth / BASE_WIDTH;
        const scaleY = maxHeight / BASE_HEIGHT;
        const initialScale = Math.min(scaleX, scaleY, 1);
        currentScaleRef.current = initialScale;
        canvas.width = BASE_WIDTH * initialScale;
        canvas.height = BASE_HEIGHT * initialScale;

        let win = false;
        let gameEnd = false;

        let speed = 4;

        let directionSkier = 0;
        let playerX = 450;
        const playerY = 100;

        let eltSize = {
            Gate : {w : 140, h : 120},
            tree : {w : 130, h : 180},
            fan : {w : 100, h : 120},
            finishLine : {w : 600, h :200 },
            player :{w : 100, h : 120}
        };

        let obstacles = createObstacles();

        const keys = {
            ArrowLeft: false,
            ArrowRight: false
        };

        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                keys[e.key] = true;
            }
        };
        const handleKeyUp = (e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                keys[e.key] = false;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const sources = {
            skier: skier,
            skierD: skierD,
            skierG: skierG,

            tree0: tree0,
            tree1: tree1,
            tree2: tree2,

            fan0: fan0,
            fan1: fan1,
            fan2: fan2,

            redGate: redGate,
            blueGate: blueGate,

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
                if (loadedCount === totalImages) {gameLoop();}
            };
        });

        function createObstacles(){
            let obstacles = [];

            for (let i = 0; i < 35; i++) {
                obstacles.push({ type: `tree${getRandomInt(0, 2)}`, x: getRandomInt(-50, 100), y: getRandomInt(-50, BASE_HEIGHT + 200) });
                obstacles.push({ type: `tree${getRandomInt(0, 2)}`, x: getRandomInt(BASE_WIDTH - 150, BASE_WIDTH + 150), y: getRandomInt(-50, BASE_HEIGHT + 200) });
            }

            for (let i = 0; i < 5; i++) {
                obstacles.push({ type: `fan${getRandomInt(0, 2)}`, x: getRandomInt(140, 160), y: getRandomInt(-50, BASE_HEIGHT + 200) });
                obstacles.push({ type: `fan${getRandomInt(0, 2)}`, x: getRandomInt(BASE_WIDTH - 150, BASE_WIDTH - 100), y: getRandomInt(-50, BASE_HEIGHT + 200) });
            }

            obstacles.push({ type: "blueGate", x: 280,  y: 500 });
            obstacles.push({ type: "redGate",  x: 550,  y: BASE_HEIGHT + 100 });
            obstacles.push({ type: "finishLine", x: 250, y: BASE_HEIGHT + 100});
            obstacles.push({ type: "player", x: playerX, y: playerY });

            return obstacles;
        }

        function gameLoop() {
            if (canvas.dataset.reset === "true") {
                gameEnd = false;
                win = false;
                pixelPastedRef.current = 0;
                playerX = 450;
                obstacles = createObstacles();
                canvas.dataset.reset = "false";
                speed = 4;
                directionSkier = 0;
            }
            updatePositions();
            drawGame();
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        }

        function checkCollisions(obs) {

            if(playerY+120 > obs.y+120 && playerY+60 < obs.y+120 ){
                if (playerX+30 >= obs.x && playerX+80 <= obs.x+140) {
                } else {
                    win = false;
                    gameEnd = true;
                    setGameStarted(false);
                    handleGameResult(0, false);
                }
            }
        }

        function updatePositions() {
            const skierSpeed = 5;

            if (canvas.dataset.started !== "true" || gameEnd) return;

            speed += 0.003;
            pixelPastedRef.current -= speed;

            if(pixelPastedRef.current <= -10000){
                win = true;
                gameEnd = true;
                setGameStarted(false);
                handleGameResult(0, true);
                return;
            }

            obstacles.forEach(obs => {
                if(obs.type !== "finishLine" || pixelPastedRef.current <= -9050) {
                    obs.y -= speed;
                }

                if (obs.type === "blueGate" || obs.type === "redGate") {
                    checkCollisions(obs);
                }

                if (obs.y < -200) {
                    if (obs.type.includes("tree")) {
                        obs.y = BASE_HEIGHT + getRandomInt(50, 400);
                        obs.x = obs.x < 500 ? getRandomInt(-50, 100) : getRandomInt(BASE_WIDTH - 150, BASE_WIDTH + 150);
                    }else if(obs.type.includes("fan")){
                        obs.y =BASE_HEIGHT + getRandomInt(50, 400);

                        if(pixelPastedRef.current <= -9450){
                                obs.x = getRandomInt(140, BASE_WIDTH - 100);
                        }else{
                            obs.x= obs.x<500 ? getRandomInt(140, 160):getRandomInt(BASE_WIDTH - 150, BASE_WIDTH - 100);
                        }
                    }else if (obs.type.includes("Gate")) {
                        if(pixelPastedRef.current >= -9200){
                            obs.y = BASE_HEIGHT + 100
                            if(obs.type === "blueGate") {
                                obs.x = getRandomInt(350, 500);
                            }else{
                                obs.x = getRandomInt(500, 675);
                            }
                        }
                    }
                }
                });
            directionSkier = 0;

            if (keys.ArrowLeft) {
                if(playerX - skierSpeed > 200){
                    playerX -= skierSpeed;
                    directionSkier = 1;
                }
            }
            if (keys.ArrowRight) {
                if(playerX + skierSpeed < BASE_WIDTH-200){
                    playerX += skierSpeed;
                    directionSkier = 2;
                    }
                }
            }

        function betterSort(obstacles) {
            const playerBottom = playerY + eltSize["player"].h;

            return (obstacles.sort((a, b) =>{
                let eltA;
                let eltB;
                const isPlayerA = a.type === "player";
                const isPlayerB = b.type === "player";

                if (isPlayerB) {
                    if(a.type.includes("tree")){eltA = "tree"}
                    else if(a.type.includes("finishLine")){eltA = "finishLine"}
                    else if(a.type.includes("Gate")){eltA = "Gate"}
                    else if(a.type.includes("fan")){eltA = "fan"}

                    const aBottom = a.y + eltSize[eltA].h;
                    return aBottom > playerBottom ? 1 : -1;
                }

                if (isPlayerA) {
                    if(b.type.includes("tree")){eltB = "tree"}
                    else if(b.type.includes("finishLine")){eltB = "finishLine"}
                    else if(b.type.includes("Gate")){eltB = "Gate"}
                    else if(b.type.includes("fan")){eltB = "fan"}

                    const bBottom = b.y + eltSize[eltB].h;
                    return bBottom > playerBottom ? -1 : 1;
                }

                eltA = a.type.includes("tree") ? "tree" : a.type.includes("finishLine") ? "finishLine" : a.type.includes("Gate") ? "Gate" : "fan";
                eltB = b.type.includes("tree") ? "tree" : b.type.includes("finishLine") ? "finishLine" : b.type.includes("Gate") ? "Gate" : "fan";

                return (eltSize[eltA].h + a.y) - (eltSize[eltB].h + b.y);
            }))
        }

        function drawGame() {
            const scale = currentScaleRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(scale, scale);

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

            const imgSkier = imagesRef.current.skier;
            const imgSkierD = imagesRef.current.skierD;
            const imgSkierG = imagesRef.current.skierG;

            betterSort(obstacles).forEach(obs => {
                if (obs.type === "player" && imgSkier) {
                    let currentSkierImg = imgSkier;

                    if (directionSkier === 1 && imgSkierG) {
                        currentSkierImg = imgSkierG;
                    } else if (directionSkier === 2 && imgSkierD) {
                        currentSkierImg = imgSkierD;
                    }
                    ctx.drawImage(currentSkierImg, playerX, playerY, 100, 120);
                }else{
                    let img = imagesRef.current[obs.type]
                    if(img){
                        if(obs.type.includes("tree")){
                            ctx.drawImage(img, obs.x, obs.y, eltSize["tree"].w, eltSize["tree"].h);
                        }else if(obs.type.includes("finishLine")){
                            ctx.drawImage(img, obs.x, obs.y, eltSize["finishLine"].w, eltSize["finishLine"].h);
                        }else if(obs.type.includes("Gate")){
                            ctx.drawImage(img, obs.x, obs.y, eltSize["Gate"].w, eltSize["Gate"].h);
                        }else if(obs.type.includes("fan")){
                            ctx.drawImage(img, obs.x, obs.y, eltSize["fan"].w, eltSize["fan"].h);
                        }
                    }
                }
            });

            if(gameEnd){
                if(win){
                    ctx.drawImage(imagesRef.current.victoryText, 25, 200, 950, 850);
                }else{
                    ctx.drawImage(imagesRef.current.defeatText, 25, 200, 950, 450);
                }
            }
            ctx.restore();
        }

        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <div className={"game"}>
            <canvas ref={canvasRef} data-started={gameStarted ? "true" : "false"} />
            <div className={"instruction"}>Passer entre les piquets avec les flèches &lt; gauche et droite &gt;.</div>
            {!gameStarted && (
                <div className={"game-buttons"}>
                    <button className={"launch-game-button"} onClick={() => {
                        if (canvasRef.current) canvasRef.current.dataset.reset = "true";
                        setGameStarted(true);
                    }}>
                        Lancer le jeu !
                    </button>
                    <button className={"back-button"} onClick={() => {
                        setGame(false);
                        setDisplayBook(true);
                        setGameStarted(false);
                    }}>
                        Revenir au livre
                    </button>
                </div>
            )}
        </div>
    );
}

export default SkiGame;