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

import finishLine from "../../assets/games_illustrations/share/finish_line.svg";
import victoryText from "../../assets/games_illustrations/share/texte_victoire.svg";
import defeatText from "../../assets/games_illustrations/trail/texte_defaite.svg";

import { useGameContext } from "../../context/GameContext.jsx";
import { BASE_WIDTH, BASE_HEIGHT} from '../../config/constants.js';


function trailGame({ setGame }) {
    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    const pixelPastedRef = useRef(0);
    const animationFrameIdRef = useRef(null);
    const currentScaleRef = useRef(1);

    const [gameStarted, setGameStarted] = useState(false);

    const {getCanvasScale,  screenSize, handleGameResult, setDisplayBook, getRandomInt } = useGameContext();

    useEffect(() => {
        currentScaleRef.current = getCanvasScale(canvasRef.current);
    }, [screenSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        currentScaleRef.current = getCanvasScale(canvasRef.current);

        let win = false;
        let gameEnd = false;

        let speed = 4;

        let playerX = 450;
        let playerY = 100;

        let playerDirection = 0;

        let playerFrame = 0;
        let lastFrame = 1;
        let animationFrame = 0;
        const animationSpeed = 8;

        const obsTypes = ["tree0", "tree1", "tree2", "rock0", "rock1", "rock2"];

        const hitboxes = {
            tree0 : { w: 130, h: 180, offsetX: 25, offsetY: 60 },
            tree1 : { w: 100, h: 180, offsetX: 20, offsetY: 60 },
            tree2 : { w: 100, h: 180, offsetX: 20, offsetY: 60 },
            treeDecor0 : { w: 130, h: 180,offsetX: 25,offsetY: 60 },
            treeDecor1 : { w: 100, h: 180,offsetX: 20,offsetY: 60 },
            treeDecor2 : { w: 100, h: 180,offsetX: 20,offsetY: 60 },
            rock0 : { w: 40,  h: 40, offsetX: 2, offsetY: 10 },
            rock1 : { w: 40,  h: 40, offsetX: 2, offsetY: 10 },
            rock2 : { w: 40,  h: 40, offsetX: 2, offsetY: 10 },
            grass0 : { w: 40,  h: 40, offsetX: 2, offsetY: 10 },
            grass1 : { w: 40,  h: 40, offsetX: 2, offsetY: 10 },
            grass2 : { w: 40,  h: 40, offsetX: 2, offsetY: 10 },
            finishLine : { w: 600, h: 200,offsetX: 0, offsetY: 0  },
            player : { w: 40,  h: 90, offsetX: 0, offsetY: 0  },
        };

        let obstacles = createObstacles();

        const keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false,
        };

        const handleKeyDown = (e) => { if (e.key.includes("Arrow")) keys[e.key] = true; };
        const handleKeyUp   = (e) => { if (e.key.includes("Arrow")) keys[e.key] = false; };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup",   handleKeyUp);

        const sources = {
            trailer0, trailer1, trailer2,
            trailerG1, trailerG2, trailerG3,
            trailerD1, trailerD2, trailerD3,
            tree0, tree1, tree2,
            rock0, rock1, rock2,
            grass0, grass1, grass2,
            treeDecor0: tree0, treeDecor1: tree1, treeDecor2: tree2,
            finishLine, victoryText, defeatText,
        };

        let loadedCount = 0;
        const totalImages = Object.keys(sources).length;
        Object.entries(sources).forEach(([key, src]) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imagesRef.current[key] = img;
                loadedCount++;
                if (loadedCount === totalImages) gameLoop();
            };
        });

        function createObstacles() {
            const obs = [];
            for (let i = 0; i < 5; i++) {
                obs.push({ type: `tree${getRandomInt(0, 2)}`, x: getRandomInt(150, BASE_WIDTH - 150), y: getRandomInt(280, BASE_HEIGHT) });
                obs.push({ type: `rock${getRandomInt(0, 2)}`, x: getRandomInt(-50, BASE_WIDTH + 50), y: getRandomInt(280, BASE_HEIGHT) });
                obs.push({ type: `grass${getRandomInt(0, 2)}`, x: getRandomInt(-50, BASE_WIDTH + 50), y: getRandomInt(-50, BASE_HEIGHT) });
            }
            for (let i = 0; i < 15; i++) {
                obs.push({ type: `treeDecor${getRandomInt(0, 2)}`, x: getRandomInt(-50, 150), y: getRandomInt(-50, BASE_HEIGHT + 100) });
                obs.push({ type: `treeDecor${getRandomInt(0, 2)}`, x: getRandomInt(BASE_WIDTH - 150, BASE_WIDTH + 150), y: getRandomInt(-50, BASE_HEIGHT + 100) });
            }
            obs.push({ type: "finishLine", x: BASE_WIDTH / 2 - hitboxes["finishLine"].w / 2, y: 900 });
            obs.push({ type: "player", x: playerX, y: playerY });
            return obs;
        }

        function gameLoop() {
            if (canvas.dataset.reset === "true") {
                gameEnd = false;
                win = false;
                pixelPastedRef.current = 0;
                playerX = 450;
                playerY = 100;
                obstacles = createObstacles();
                canvas.dataset.reset = "false";
                speed = 4;
                playerDirection = 0;
            }
            updatePositions();
            drawGame();
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        }

        function checkCollision(px, py, obs) {
            const hb = hitboxes[obs.type];
            const pb = hitboxes["player"];
            if (!hb) return false;

            const pxStart = px + pb.offsetX;
            const pxEnd= px + pb.w - pb.offsetX;
            const pyEnd = py + pb.h;

            const oxStart = obs.x + hb.offsetX;
            const oxEnd= obs.x + hb.w - hb.offsetX;
            const oyStart = obs.y + hb.offsetY;
            const oyEnd = obs.y + hb.h;

            if (pyEnd > oyStart && pyEnd < oyEnd) {
                return (
                    (pxStart > oxStart && pxStart < oxEnd) ||
                    (pxEnd > oxStart && pxEnd < oxEnd) ||
                    (pxStart < oxStart && pxEnd > oxEnd)
                );
            }
            return false;
        }

        function updatePositions() {
            const hPlayerSpeed= 5;
            const frontPlayerSpeed= 2;
            const backPlayerSpeed= 5;

            if (canvas.dataset.started !== "true" || gameEnd) return;

            speed += 0.003;
            pixelPastedRef.current -= speed;

            if (pixelPastedRef.current <= -10000) {
                win = true;
                gameEnd = true;
                setGameStarted(false);
                handleGameResult(1, true);
                return;
            }

            obstacles.forEach(obs => {
                if (obs.type !== "finishLine" || pixelPastedRef.current <= -9050) {
                    obs.y -= speed;
                }

                if (obsTypes.includes(obs.type) && checkCollision(playerX, playerY, obs)) {
                    win = false;
                    gameEnd = true;
                    setGameStarted(false);
                    handleGameResult(0, false);
                }

                if (obs.y < -200) {
                    if (obs.type.includes("treeDecor")) {
                        obs.y = BASE_HEIGHT + getRandomInt(50, 400);
                        obs.x = obs.x > BASE_WIDTH / 2
                            ? getRandomInt(-50, 150)
                            : getRandomInt(BASE_WIDTH - 150, BASE_WIDTH + 150);
                    } else if (obs.type.includes("tree") || obs.type.includes("rock")) {
                        obs.y = BASE_HEIGHT + getRandomInt(50, 400);
                        obs.x = getRandomInt(150, BASE_WIDTH - 150);
                    } else if (obs.type.includes("grass")) {
                        obs.y = BASE_HEIGHT + getRandomInt(50, 400);
                        obs.x = getRandomInt(0, BASE_WIDTH);
                    }
                }
            });

            playerDirection = 0;
            if (keys.ArrowLeft  && playerX - hPlayerSpeed    > 150)           { playerX -= hPlayerSpeed;    playerDirection = 1; }
            if (keys.ArrowRight && playerX + hPlayerSpeed    < BASE_WIDTH - 160) { playerX += hPlayerSpeed;    playerDirection = 2; }
            if (keys.ArrowUp    && playerY - backPlayerSpeed  > 10)            { playerY -= backPlayerSpeed; }
            if (keys.ArrowDown  && playerY + frontPlayerSpeed < BASE_HEIGHT)   { playerY += frontPlayerSpeed; }

            animationFrame++;
            if (animationFrame >= animationSpeed) {
                animationFrame = 0;
                if (playerDirection === 0) {
                    playerFrame = playerFrame === 0 ? (lastFrame === 1 ? 2 : 1) : 0;
                    if (playerFrame !== 0) lastFrame = playerFrame;
                } else if (playerDirection === 1) {
                    playerFrame = playerFrame === 4 ? (lastFrame === 3 ? 5 : 3) : 4;
                    if (playerFrame !== 4) lastFrame = playerFrame;
                } else {
                    playerFrame = playerFrame === 7 ? (lastFrame === 6 ? 8 : 6) : 7;
                    if (playerFrame !== 7) lastFrame = playerFrame;
                }
            }
        }

        function betterSort(obs) {
            const playerBottom = playerY + hitboxes["player"].h;
            return [...obs].sort((a, b) => {
                const isA = a.type === "player";
                const isB = b.type === "player";
                if (a.type.includes("grass") && !isB) return -1;
                if (b.type.includes("grass") && !isA) return 1;
                if (isA) return (b.y + hitboxes[b.type].h) > playerBottom ? -1 : 1;
                if (isB) return (a.y + hitboxes[a.type].h) > playerBottom ? 1 : -1;
                return (hitboxes[a.type].h + a.y) - (hitboxes[b.type].h + b.y);
            });
        }

        function drawGame() {
            const scale = currentScaleRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(scale, scale);

            ctx.fillStyle = "#309E1A";
            ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
            ctx.fillStyle = "#35982b";
            ctx.fillRect(150, 0, BASE_WIDTH - 300, BASE_HEIGHT);

            const frames = {
                0: imagesRef.current.trailer0,
                1: imagesRef.current.trailer1,
                2: imagesRef.current.trailer2,
                3: imagesRef.current.trailerG1,
                4: imagesRef.current.trailerG2,
                5: imagesRef.current.trailerG3,
                6: imagesRef.current.trailerD1,
                7: imagesRef.current.trailerD2,
                8: imagesRef.current.trailerD3,
            };

            betterSort(obstacles).forEach(obs => {
                if (obs.type === "player" && frames[0]) {
                    const playerImg = frames[playerFrame] || frames[0];
                    ctx.drawImage(playerImg, playerX, playerY, hitboxes["player"].w, hitboxes["player"].h);
                }
                const img = imagesRef.current[obs.type];
                if (img) ctx.drawImage(img, obs.x, obs.y, hitboxes[obs.type].w, hitboxes[obs.type].h);
            });

            if(gameEnd){
                if(win){
                    const imgW = 950;
                    const imgH = 850;
                    const x = (canvas.width - imgW) / 2;
                    const y = (canvas.height / 2) - 150;

                    ctx.drawImage(imagesRef.current.victoryText, x, y, imgW, imgH);
                }else{
                    const imgW = 750;
                    const imgH = 850;
                    const x = ((canvas.width - imgW) / 2)+85;
                    const y = (canvas.height / 2) - 150;

                    ctx.drawImage(imagesRef.current.defeatText, x, y, imgW, imgH);
                }
            }
            ctx.restore();
        }

        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup",   handleKeyUp);
        };
    }, []);

    return (
        <div className={"game"}>
            <canvas ref={canvasRef} data-started={gameStarted ? "true" : "false"} />
            <div className={"instruction"}>Éviter les obstacles avec les flèches du clavier.</div>
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

export default trailGame;