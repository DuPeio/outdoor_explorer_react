import { useRef, useEffect, useState } from "react";
import trailer from "../../assets/games_illustrations/ski/skier.svg";

import tree0 from "../../assets/games_illustrations/ski/tree.svg";

import rock from "../../assets/games_illustrations/trail/rock.svg";

import finishLine from "../../assets/games_illustrations/ski/finish_line.svg"

// TODO : Bien ranger les assets pour les trucs share et pas share
import victoryText from "../../assets/games_illustrations/ski/texte_victoire.svg"
import defeatText from "../../assets/games_illustrations/ski/texte_defaite.svg"

import {useGameContext} from "../../context/GameContext.jsx";

function trail_game({setGame}) {

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

        let speed = 4;

        let directionTrailer = 0;

        let obstacles = createObstacles();

        let playerX = 450;
        const skierY = 100;

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

        // Partie différente
        const sources = {
            trailer: trailer,
            tree0: tree0,
            treeDecor: tree0,
            rock:rock,
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

        //Fonction différente
        function createObstacles(){
            let obstacles = [];

            for (let i = 0; i < 5; i++) {
                obstacles.push({ type: `tree0`, x: getRandomInt(-50, 950), y: getRandomInt(-50, 800) });
            }

            for (let i = 0; i < 30; i++) {
                obstacles.push({ type: `treeDecor`, x: getRandomInt(-50, 150), y: getRandomInt(-50, 800) });
            }
            for (let i = 0; i < 30; i++) {
                obstacles.push({ type: `treeDecor`, x: getRandomInt(850, 950), y: getRandomInt(-50, 800) });
            }

            for (let i = 0; i < 5; i++) {
                obstacles.push({ type: `rock`, x: getRandomInt(-50, 950), y: getRandomInt(-50, 800) });
            }

            obstacles.push({ type: "finishLine", x: 250, y: 900 });

            return obstacles;
        }

        // Fonction réutilisable
        function gameLoop() {
            if (canvas.dataset.reset === "true") {
                gameEnd = false;
                win = false;
                pixelPastedRef.current = 0;
                playerX = 450;
                obstacles = createObstacles();
                canvas.dataset.reset = "false";
                speed = 4;
                // directionSkier = 0;
            }
            updatePositions();
            drawGame();
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        function updatePositions() {
            const skierSpeed = 5;

            if (canvas.dataset.started !== "true" || gameEnd) {
                return;
            }
            speed += 0.003;
            pixelPastedRef.current -= speed;

            if(pixelPastedRef.current <= -10000){
                win = true;
                gameEnd = true;
                setGameStarted(false);
                handleGameResult(1, true);
            }else{
                obstacles.forEach(obs => {

                    if(obs.type !== "finishLine" || pixelPastedRef.current <= -9050){
                        obs.y -= speed;
                    }

                    //Pour vérifier que les collisions
                    if ((obs.type === "tree0" || obs.type === "rock")) {
                        const zone = (obs.y >= skierY && obs.y <= skierY + 50);
                        if (zone) {
                            if (playerX> obs.x-50 && playerX+50 < obs.x+100) {
                                console.log("Aie l'obstacle");
                                win = false;
                                gameEnd = true;
                                setGameStarted(false);
                                handleGameResult(0, false);
                            } else {
                                console.log("Obstacle passé");
                            }
                        }
                    }
                    // Pour faire une belle boucle
                    if (obs.y < -200) {
                        if (obs.type === "tree0" || obs.type === "rock") {
                            obs.y = canvas.height + getRandomInt(50, 400);
                            obs.x = getRandomInt(-50, 950);
                        }

                        if (obs.type === "treeDecor") {
                            obs.y = canvas.height + getRandomInt(50, 400);
                            if (obs.x < 500) {
                                obs.x = getRandomInt(-50, 150);
                            } else {
                                obs.x = getRandomInt(850, 950);
                            }
                        }
                    }
                });

                if (keys.ArrowLeft) {
                    if(playerX - skierSpeed > 200){
                        playerX -= skierSpeed;
                    }
                }
                if (keys.ArrowRight) {
                    if(playerX + skierSpeed < 750){
                        playerX += skierSpeed;
                    }
                }

            }
        }

        function drawGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#0f0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const imgTrailer = imagesRef.current.trailer;
            const imgTree0 = imagesRef.current.tree0;
            const imgTreeDecor = imagesRef.current.treeDecor;
            const imgRock = imagesRef.current.rock;
            const imgFinishLine = imagesRef.current.finishLine

            const obstaclesSort = obstacles.sort((a, b) => a.y - b.y);

            ctx.drawImage(imgTrailer, playerX, skierY, 100, 120);

            obstaclesSort.forEach(obs => {
                if (obs.type === "finishLine" && imgFinishLine) {
                    ctx.drawImage(imgFinishLine, obs.x, obs.y, 600, 200);
                }else if (obs.type === "tree0" && imgTree0) {
                    ctx.drawImage(imgTree0, obs.x, obs.y, 130, 180);
                }else if(obs.type === "rock" && imgRock){
                    ctx.drawImage(imgRock, obs.x, obs.y, 40, 40);
                }else if (obs.type === "treeDecor" && imgTreeDecor) {
                    ctx.drawImage(imgTreeDecor, obs.x, obs.y, 130, 180);
                }
            });

            if(gameEnd){
                if(win){
                    ctx.drawImage(imagesRef.current.victoryText, 25, 200, 950, 850);
                }else{
                    ctx.drawImage(imagesRef.current.defeatText, 25, 200, 950, 450);
                }
            }
        }
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };

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

            <div className={"instruction"}>Eviter les obstacles avec les flèches &lt; gauche et droite &gt;.</div>
        </div>
    );
}

export default trail_game;