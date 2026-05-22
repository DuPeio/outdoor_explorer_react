import { useRef, useEffect, useState } from "react";
import trailer0 from "../../assets/games_illustrations/trail/trailer0.svg";
import trailer1 from "../../assets/games_illustrations/trail/trailer1.svg";
import trailer2 from "../../assets/games_illustrations/trail/trailer2.svg";

import trailerG1 from "../../assets/games_illustrations/trail/trailerG1.svg";
import trailerG2 from "../../assets/games_illustrations/trail/trailerG2.svg";
import trailerD1 from "../../assets/games_illustrations/trail/trailerD1.svg";
import trailerD2 from "../../assets/games_illustrations/trail/trailerD2.svg";

import tree0 from "../../assets/games_illustrations/trail/tree0.svg";
import tree1 from "../../assets/games_illustrations/trail/tree1.svg";
import tree2 from "../../assets/games_illustrations/trail/tree2.svg";

import rock0 from "../../assets/games_illustrations/trail/rock0.svg";
import rock1 from "../../assets/games_illustrations/trail/rock1.svg";
import rock2 from "../../assets/games_illustrations/trail/rock2.svg";

import grass0 from "../../assets/games_illustrations/trail/grass0.svg";
import grass1 from "../../assets/games_illustrations/trail/grass1.svg";
import grass2 from "../../assets/games_illustrations/trail/grass2.svg";

import finishLine from "../../assets/games_illustrations/trail/finish_line.svg"

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

        let obstacles = createObstacles();

        let playerX = 450;
        const playerY = 100;

        let playerDirection = 0;

        // For the player animation
        let playerFrame = 0;
        let lastFrame = 1;
        let animationFrame = 0;
        const animationSpeed = 12

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
            trailer0: trailer0,
            trailer1: trailer1,
            trailer2: trailer2,
            trailerG1: trailerG1,
            trailerG2: trailerG2,
            trailerD1: trailerD1,
            trailerD2: trailerD2,

            tree0: tree0,
            tree1: tree1,
            tree2: tree2,

            rock0:rock0,
            rock1:rock1,
            rock2:rock2,

            grass0:grass0,
            grass1:grass1,
            grass2:grass2,

            treeDecor0: tree0,
            treeDecor1: tree1,
            treeDecor2: tree2,

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

        const obs_types = ["tree0","tree1","tree2","rock0","rock1","rock2"];

        const hitboxes = {
            tree0: { w: 130, h: 180, offsetX: 25,  offsetY: 60  },
            tree1: { w: 100, h: 180, offsetX: 20,  offsetY: 60  },
            tree2: { w: 100, h: 180, offsetX: 20,  offsetY: 60  },
            rock0: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },
            rock1: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },
            rock2: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },
            player: { w: 40, h: 90, offsetX: 0, offsetY: 0   }
        };

        //Fonction différente
        function createObstacles(){
            let obstacles = [];

            for (let i = 0; i < 5; i++) {
                obstacles.push({ type: `tree${getRandomInt(0,2)}`, x: getRandomInt(150, 850), y: getRandomInt(280, 750) });
            }

            for (let i = 0; i < 15; i++) {
                obstacles.push({ type: `treeDecor${getRandomInt(0,2)}`, x: getRandomInt(-50, 100), y: getRandomInt(-50, 900) });
            }
            for (let i = 0; i < 15; i++) {
                obstacles.push({ type: `treeDecor${getRandomInt(0,2)}`, x: getRandomInt(860, 950), y: getRandomInt(-50, 900) });
            }

            for (let i = 0; i < 5; i++) {
                obstacles.push({ type: `rock${getRandomInt(0,2)}`, x: getRandomInt(-50, 950), y: getRandomInt(280, 750) });
            }

            for (let i = 0; i < 5; i++) {
                obstacles.push({ type: `grass${getRandomInt(0,2)}`, x: getRandomInt(-50, 950), y: getRandomInt(-50, 750) });
            }

            obstacles.push({ type: "finishLine", x: 200, y: 900 });

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
                playerDirection = 0;
            }
            updatePositions();
            drawGame();
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        function checkCollision(playerX, playerY, obs) {
            const hb = hitboxes[obs.type];
            const player_box = hitboxes["player"];
            if (!hb) return false;

            const pw = player_box.w;
            const ph = player_box.h;

            const px_start = playerX + player_box.offsetX;
            const px_end = playerX + pw - player_box.offsetX;

            const py_end = playerY + ph;

            const ow = hb.w;
            const oh = hb.h;

            const ox_start = obs.x + hb.offsetX;
            const ox_end = obs.x + ow - hb.offsetX;

            const oy_start = obs.y + hb.offsetY;
            const oy_end = obs.y + oh;

            if((py_end > oy_start && py_end < oy_end)){
                return ((px_start > ox_start && px_start < ox_end) ||
                    (px_end > ox_start && px_end < ox_end) ||
                    (px_start < ox_start && px_end > ox_end));
            }
            return false;
        }

        function updatePositions() {
            const playerSpeed = 5;

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
                    if (obs_types.includes(obs.type)) {
                        let colision = checkCollision(playerX, playerY, obs);
                        if (colision) {
                            win = false;
                            gameEnd = true;
                            setGameStarted(false);
                            handleGameResult(0, false);
                        }
                    }

                    // Pour faire une belle boucle
                    if (obs.y < -200) {
                        if (obs.type === "tree0" || obs.type === "tree1" || obs.type === "tree2" || obs.type === "rock0" ||
                            obs.type === "rock1" || obs.type === "rock2") {
                            obs.y = canvas.height + getRandomInt(50, 400);
                            obs.x = getRandomInt(200, 800);
                        }

                        if (obs.type === "treeDecor0" ||obs.type === "treeDecor1" || obs.type === "treeDecor2") {
                            obs.y = canvas.height + getRandomInt(50, 400);
                            if (obs.x < 500) {
                                obs.x = getRandomInt(-50, 150);
                            } else {
                                obs.x = getRandomInt(850, 950);
                            }
                        }

                        if(obs.type === "grass1" || obs.type === "grass2" || obs.type === "grass3" ){
                            obs.y = canvas.height + getRandomInt(50, 400);
                            obs.x = getRandomInt(0, 950);
                        }
                    }
                });

                playerDirection = 0

                if (keys.ArrowLeft) {
                    if(playerX - playerSpeed > 150){
                        playerX -= playerSpeed;
                        playerDirection = 1;
                    }
                }
                if (keys.ArrowRight) {
                    if(playerX + playerSpeed < 810){
                        playerX += playerSpeed;
                        playerDirection = 2;
                    }
                }

                animationFrame++;
                if (animationFrame >= animationSpeed) {
                    animationFrame = 0;

                    if(playerDirection === 0){
                        if (playerFrame === 0) {
                            playerFrame = lastFrame === 1 ? 2 : 1;
                            lastFrame = playerFrame;
                        } else {
                            playerFrame = 0;
                        }

                    } else if (playerDirection === 1){
                        playerFrame = playerFrame === 3 ? 4 : 3;
                    } else {
                        playerFrame = playerFrame === 5 ? 6 : 5;
                    }
                }
            }
        }

            function betterSort(obstacles) {
                let obstaclesSorted = obstacles.sort((a, b) =>{
                    if((a.type.includes("tree")||a.type === "finish_line") && (b.type.includes("grass")||b.type.includes("rock"))){
                        if(b.y > a.y && b.y < a.y + 180){
                            return 10;
                        }
                    }else if((b.type.includes("tree")||b.type === "finish_line") && (a.type.includes("grass")||a.type.includes("rock"))) {
                        if(a.y > b.y && a.y < b.y+ 180){
                            return -10;
                        }
                    }
                    return a.y - b.y;
                });
                return obstaclesSorted;
            }

        function drawGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#309E1A";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#35982b";
            ctx.fillRect(150, 0, 700, canvas.height);

            const imgTrailer0 = imagesRef.current.trailer0;
            const imgTrailer1 = imagesRef.current.trailer1;
            const imgTrailer2 = imagesRef.current.trailer2;
            const imgTrailerG1 = imagesRef.current.trailerG1;
            const imgTrailerG2 = imagesRef.current.trailerG2;
            const imgTrailerD1 = imagesRef.current.trailerD1;
            const imgTrailerD2 = imagesRef.current.trailerD2;

            const imgTree0 = imagesRef.current.tree0;
            const imgTree1 = imagesRef.current.tree1;
            const imgTree2 = imagesRef.current.tree2;

            const imgTreeDecor0 = imagesRef.current.treeDecor0;
            const imgTreeDecor1 = imagesRef.current.treeDecor1;
            const imgTreeDecor2 = imagesRef.current.treeDecor2;

            const imgRock0 = imagesRef.current.rock0;
            const imgRock1 = imagesRef.current.rock1;
            const imgRock2 = imagesRef.current.rock2

            const imgGrass0 = imagesRef.current.grass0;
            const imgGrass1 = imagesRef.current.grass1;
            const imgGrass2 = imagesRef.current.grass2;

            const imgFinishLine = imagesRef.current.finishLine

            const obstaclesSort = betterSort(obstacles);

            if (imgTrailer0) {
                let currentPlayerImg = imagesRef.current.trailer0;

                // Gauche
                if (playerFrame === 3 && imagesRef.current.trailerG1) {
                    currentPlayerImg = imagesRef.current.trailerG1;
                } else if (playerFrame === 4 && imagesRef.current.trailerG2) {
                    currentPlayerImg = imagesRef.current.trailerG2;
                }

                // Droite
                else  if (playerFrame === 5 && imagesRef.current.trailerD1) {
                        currentPlayerImg = imagesRef.current.trailerD1;
                } else if (playerFrame === 6 && imagesRef.current.trailerD2) {
                    currentPlayerImg = imagesRef.current.trailerD2;
                }

                // Tout droit
                else {
                    if (playerFrame === 1 && imagesRef.current.trailer1) {
                        currentPlayerImg = imagesRef.current.trailer1;
                    } else if (playerFrame === 2 && imagesRef.current.trailer2) {
                        currentPlayerImg = imagesRef.current.trailer2;
                    }
                }
                ctx.drawImage(currentPlayerImg, playerX, playerY, 40, 90);
            }

            obstaclesSort.forEach(obs => {
                if (obs.type === "finishLine" && imgFinishLine) {
                    ctx.drawImage(imgFinishLine, obs.x, obs.y, 600, 200);
                }

                else if (obs.type === "tree0" && imgTree0) {
                    ctx.drawImage(imgTree0, obs.x, obs.y, 130, 180);
                }else if (obs.type === "tree1" && imgTree1) {
                    ctx.drawImage(imgTree1, obs.x, obs.y, 100, 180);
                }else if (obs.type === "tree2" && imgTree2) {
                    ctx.drawImage(imgTree2, obs.x, obs.y, 100, 180);
                }

                else if(obs.type === "rock0" && imgRock0){
                    ctx.drawImage(imgRock0, obs.x, obs.y, 40, 40);
                }else if(obs.type === "rock1" && imgRock1){
                    ctx.drawImage(imgRock1, obs.x, obs.y, 40, 40);
                }else if(obs.type === "rock2" && imgRock2){
                    ctx.drawImage(imgRock2, obs.x, obs.y, 40, 40);
                }

                else if (obs.type === "treeDecor0" && imgTreeDecor0) {
                    ctx.drawImage(imgTreeDecor0, obs.x, obs.y, 130, 180);
                }else if (obs.type === "treeDecor1" && imgTreeDecor1) {
                    ctx.drawImage(imgTreeDecor1, obs.x, obs.y, 100, 180);
                }else if (obs.type === "treeDecor2" && imgTreeDecor2) {
                    ctx.drawImage(imgTreeDecor2, obs.x, obs.y, 100, 180);
                }

                else if(obs.type === "grass0" && imgGrass0){
                    ctx.drawImage(imgGrass0, obs.x, obs.y, 40, 40);
                }else if(obs.type === "grass1" && imgGrass1){
                    ctx.drawImage(imgGrass1, obs.x, obs.y, 40, 40);
                }else if(obs.type === "grass2" && imgGrass2){
                    ctx.drawImage(imgGrass2, obs.x, obs.y, 40, 40);
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