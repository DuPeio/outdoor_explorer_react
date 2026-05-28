import { useRef, useEffect, useState } from "react";
import trailer0 from "../../assets/games_illustrations/trail/trailer0.svg";
import trailer1 from "../../assets/games_illustrations/trail/trailer1.svg";
import trailer2 from "../../assets/games_illustrations/trail/trailer2.svg";

import trailerG1 from "../../assets/games_illustrations/trail/trailerG1.svg";
import trailerG2 from "../../assets/games_illustrations/trail/trailerG2.svg";
import trailerG3 from "../../assets/games_illustrations/trail/trailerG3.svg";

import trailerD1 from "../../assets/games_illustrations/trail/trailerD1.svg";
import trailerD2 from "../../assets/games_illustrations/trail/trailerD2.svg";
import trailerD3 from "../../assets/games_illustrations/trail/trailerD3.svg";

import tree0 from "../../assets/games_illustrations/share/tree0.svg";
import tree1 from "../../assets/games_illustrations/share/tree1.svg";
import tree2 from "../../assets/games_illustrations/share/tree2.svg";

import rock0 from "../../assets/games_illustrations/trail/rock0.svg";
import rock1 from "../../assets/games_illustrations/trail/rock1.svg";
import rock2 from "../../assets/games_illustrations/trail/rock2.svg";

import grass0 from "../../assets/games_illustrations/share/grass0.svg";
import grass1 from "../../assets/games_illustrations/share/grass1.svg";
import grass2 from "../../assets/games_illustrations/share/grass2.svg";

import finishLine from "../../assets/games_illustrations/share/finish_line.svg"

import victoryText from "../../assets/games_illustrations/share/texte_victoire.svg"
import defeatText from "../../assets/games_illustrations/trail/texte_defaite.svg"

import {useGameContext} from "../../context/GameContext.jsx";

function trailGame({setGame}) {

    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    const pixelPastedRef = useRef(0);
    const [gameStarted, setGameStarted] = useState(false);
    const animationFrameIdRef = useRef(null);


    const { handleGameResult, setDisplayBook, getRandomInt } = useGameContext();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let win = false;
        let gameEnd = false;

        canvas.width = 1000;
        canvas.height = 700;

        let speed = 4;

        let playerX = 450;
        const playerY = 100;

        let obstacles = createObstacles();

        let playerDirection = 0;

        let playerFrame = 0;
        let lastFrame = 1;
        let animationFrame = 0;
        const animationSpeed = 8;

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
            trailerG3: trailerG3,
            trailerD1: trailerD1,
            trailerD2: trailerD2,
            trailerD3: trailerD3,

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

        const obsTypes = ["tree0","tree1","tree2","rock0","rock1","rock2"];

        const hitboxes = {
            tree0: { w: 130, h: 180, offsetX: 25,  offsetY: 60  },
            tree1: { w: 100, h: 180, offsetX: 20,  offsetY: 60  },
            tree2: { w: 100, h: 180, offsetX: 20,  offsetY: 60  },

            treeDecor0: { w: 130, h: 180, offsetX: 25,  offsetY: 60  },
            treeDecor1: { w: 100, h: 180, offsetX: 20,  offsetY: 60  },
            treeDecor2: { w: 100, h: 180, offsetX: 20,  offsetY: 60  },

            rock0: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },
            rock1: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },
            rock2: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },

            grass0: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },
            grass1: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },
            grass2: { w: 40,  h: 40,  offsetX: 2,  offsetY: 10  },

            finishLine : {w:600, h:200, offsetX: 0, offsetY: 0  },

            player: { w: 40, h: 90, offsetX: 0, offsetY: 0}
        };

        function createObstacles(){
            let obstacles = [];

            for (let i = 0; i < 5; i++) {
                obstacles.push({ type: `tree${getRandomInt(0,2)}`, x: getRandomInt(150, 850), y: getRandomInt(280, 750) });
                obstacles.push({ type: `rock${getRandomInt(0,2)}`, x: getRandomInt(-50, 950), y: getRandomInt(280, 750) });
                obstacles.push({ type: `grass${getRandomInt(0,2)}`, x: getRandomInt(-50, 950), y: getRandomInt(-50, 750) });
            }

            for (let i = 0; i < 15; i++) {
                obstacles.push({ type: `treeDecor${getRandomInt(0,2)}`, x: getRandomInt(-50, 100), y: getRandomInt(-50, 900) });
                obstacles.push({ type: `treeDecor${getRandomInt(0,2)}`, x: getRandomInt(860, 950), y: getRandomInt(-50, 900) });
            }

            obstacles.push({ type: "finishLine", x: 200, y: 900 });

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
                playerDirection = 0;
            }
            updatePositions();
            drawGame();
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        }

        function checkCollision(playerX, playerY, obs) {
            const hb = hitboxes[obs.type];
            const playerBox = hitboxes["player"];
            if (!hb) return false;

            const pw = playerBox.w;
            const ph = playerBox.h;

            const pxStart = playerX + playerBox.offsetX;
            const pxEnd = playerX + pw - playerBox.offsetX;

            const pyEnd = playerY + ph;

            const ow = hb.w;
            const oh = hb.h;

            const oxStart = obs.x + hb.offsetX;
            const oxEnd = obs.x + ow - hb.offsetX;

            const oyStart = obs.y + hb.offsetY;
            const oyEnd = obs.y + oh;

            if((pyEnd > oyStart && pyEnd < oyEnd)){
                return ((pxStart > oxStart && pxStart < oxEnd) ||
                    (pxEnd > oxStart && pxEnd < oxEnd) ||
                    (pxStart < oxStart && pxEnd > oxEnd));
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

                    if (obsTypes.includes(obs.type)) {
                        if (checkCollision(playerX, playerY, obs)) {
                            win = false;
                            gameEnd = true;
                            setGameStarted(false);
                            handleGameResult(0, false);
                        }
                    }

                    if (obs.y < -200) {
                        if (obs.type.includes("treeDecor")) {
                            obs.y = canvas.height + getRandomInt(50, 400);
                            obs.x = obs.x > 500 ? getRandomInt(-50, 150) : getRandomInt(850, 950);
                        }

                        else if (obs.type.includes("tree") || obs.type.includes("rock")){
                            obs.y = canvas.height + getRandomInt(50, 400);
                            obs.x = getRandomInt(200, 800);
                        }

                        else if(obs.type.includes("grass")){
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
                        if (playerFrame === 4) {
                            playerFrame = lastFrame === 3 ? 5 : 3;
                            lastFrame = playerFrame;
                        } else {
                            playerFrame = 4;
                        }
                    } else {
                        if (playerFrame === 7) {
                            playerFrame = lastFrame === 6 ? 8 : 6;
                            lastFrame = playerFrame;
                        } else {
                            playerFrame = 7;
                        }
                    }
                }
            }
        }

        function betterSort(obstacles) {
            const playerBottom = playerY + hitboxes["player"].h;

            return [...obstacles].sort((a, b) => {
                const isPlayerA = a.type === "player";
                const isPlayerB = b.type === "player";

                if (a.type.includes("grass") && !isPlayerB) return -1;
                if (b.type.includes("grass") && !isPlayerA) return 1;

                if (isPlayerA) {
                    const bBottom = b.y + hitboxes[b.type].h;
                    return bBottom > playerBottom ? -1 : 1;
                }
                if (isPlayerB) {
                    const aBottom = a.y + hitboxes[a.type].h;
                    return aBottom > playerBottom ? 1 : -1;
                }

                return (hitboxes[a.type].h + a.y) - (hitboxes[b.type].h + b.y);
            });
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
            const imgTrailerG3 = imagesRef.current.trailerG3;

            const imgTrailerD1 = imagesRef.current.trailerD1;
            const imgTrailerD2 = imagesRef.current.trailerD2;
            const imgTrailerD3 = imagesRef.current.trailerD3;

            const obstaclesSort = betterSort(obstacles);

            obstaclesSort.forEach(obs => {

                if(obs.type === "player" && imgTrailer0){

                    let currentPlayerImg = imgTrailer0;

                    if (playerFrame === 3 && imgTrailerG1) {
                        currentPlayerImg = imgTrailerG1;
                    } else if (playerFrame === 4 && imgTrailerG2) {
                        currentPlayerImg = imgTrailerG2;
                    }else if (playerFrame === 5 && imgTrailerG3) {
                        currentPlayerImg = imgTrailerG3;
                    }

                    else  if (playerFrame === 6 && imgTrailerD1) {
                        currentPlayerImg = imgTrailerD1;
                    } else if (playerFrame === 7 && imgTrailerD2) {
                        currentPlayerImg = imgTrailerD2;
                    }else if (playerFrame === 8 && imgTrailerD3) {
                        currentPlayerImg = imgTrailerD3;
                    }

                    else {
                        if (playerFrame === 1 && imgTrailer1) {
                            currentPlayerImg = imgTrailer1;
                        } else if (playerFrame === 2 && imgTrailer2) {
                            currentPlayerImg = imgTrailer2;
                        }

                    }
                    ctx.drawImage(currentPlayerImg, playerX, playerY, hitboxes["player"].w, hitboxes["player"].h);
                }

                let img = imagesRef.current[obs.type];

                if(img){ctx.drawImage(img, obs.x, obs.y, hitboxes[obs.type].w, hitboxes[obs.type].h);}

            });

            if(gameEnd){
                if(win){
                    ctx.drawImage(imagesRef.current.victoryText, 25, 200, 950, 850);
                }else{
                    ctx.drawImage(imagesRef.current.defeatText, 250, 200, 650, 675);
                }
            }
        }
        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
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
                    if (canvasRef.current) {
                        canvasRef.current.dataset.reset = "true";
                    }
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

export default trailGame;