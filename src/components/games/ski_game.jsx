import { useRef, useEffect, useState } from "react";
import skier from "../../assets/games_illustrations/ski/skier.svg";
import tree from "../../assets/games_illustrations/ski/tree.svg";
import blueGates from "../../assets/games_illustrations/ski/blue_gates.svg";
import redGates from "../../assets/games_illustrations/ski/red_gates.svg";
import finishLine from "../../assets/games_illustrations/ski/finish_line.svg"
import victoryText from "../../assets/games_illustrations/ski/texte_victoire.svg"
import defeatText from "../../assets/games_illustrations/ski/texte_defaite.svg"
import {useGameContext} from "../../context/GameContext.jsx";

function ski_game({ setBook, setGame}) {
    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    let pixelPasted = 0;
    const [gameStarted, setGameStarted] = useState(false);
    const [gameWin, setGameWin] = useState(false);
    const { handleGameResult } = useGameContext();

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let win = false;
        let gameEnd = false;

        canvas.width = 1000;
        canvas.height = 700;

        const speed = 4;

        let obstacles = [];

        for (let i = 0; i < 20; i++) {
            obstacles.push({ type: "tree", x: getRandomInt(-50, 150), y: getRandomInt(-50, 800) });
        }
        for (let i = 0; i < 20; i++) {
            obstacles.push({ type: "tree", x: getRandomInt(800, 950), y: getRandomInt(-50, 800) });
        }

        obstacles.push({ type: "blueGate", x: 260, y: 500 , passed:false});
        obstacles.push({ type: "redGate", x: 550, y: 1000, passed:false});
        obstacles.push({type: "finishLine", x:250, y:900});

        let skierX = 450;
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

        const sources = {
            skier: skier,
            tree: tree,
            gateRed: redGates,
            gateBlue: blueGates,
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

        function gameLoop() {
            updatePositions();
            drawGame();
            if(!gameEnd){
                animationFrameId = requestAnimationFrame(gameLoop);
            }
        }

        function updatePositions() {
            const skierSpeed = 5;

            if (canvas.dataset.started !== "true") {
                return;
            }

            pixelPasted -= speed;

            if(pixelPasted <= -5000){
                setGameWin(true);
                win = true;
                gameEnd = true;
                setGameStarted(false);
                handleGameResult(0, true);
            }else{
                obstacles.forEach(obs => {

                    if(obs.type !== "finishLine" || pixelPasted <= -4050){
                        obs.y -= speed;
                    }

                    //Pour vérifier que les collisions
                    if ((obs.type === "blueGate" || obs.type === "redGate") && !obs.passed) {
                        const zone = (obs.y >= skierY && obs.y <= skierY + 2);
                        if (zone) {
                            obs.passed = true;
                            if (skierX > obs.x+2 && skierX+42 < obs.x+118) {
                                console.log("Gate passée");
                            } else {
                                console.log("Gate pas passée");
                                win = false;
                                gameEnd = true;
                                setGameStarted(false);
                                handleGameResult(0, false);
                            }
                        }
                    }

                    // Pour faire une belle boucle
                    if (obs.y < -200) {
                        obs.passed = false;
                        if (obs.type === "tree") {
                            obs.y = canvas.height + getRandomInt(50, 400);
                            if (obs.x < 500) {
                                obs.x = getRandomInt(-50, 150);
                            } else {
                                obs.x = getRandomInt(800, 950);
                            }
                        } else if (obs.type === "blueGate" || obs.type === "redGate") {
                            if(pixelPasted >= -4200){
                                obs.y = canvas.height
                                if(obs.type === "blueGate") {
                                    obs.x = getRandomInt(350, 450);
                                }else{
                                    obs.x = getRandomInt(550, 675);
                                }
                            }
                        }
                    }
                });
                if (keys.ArrowLeft) {
                    if(skierX - skierSpeed > 275){
                        skierX -= skierSpeed;
                    }
                }
                if (keys.ArrowRight) {
                    if(skierX + skierSpeed < 775){
                        skierX += skierSpeed;
                    }
                }
            }
        }

        function drawGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const imgSkier = imagesRef.current.skier;
            const imgTree = imagesRef.current.tree;
            const imgBlueGates = imagesRef.current.gateBlue;
            const imgRedGates = imagesRef.current.gateRed;
            const imgFinishLine = imagesRef.current.finishLine

            const obstaclesSort = obstacles.sort((a, b) => a.y - b.y);

            if (imgSkier) {
                ctx.drawImage(imgSkier, skierX, skierY, 42, 80);
            }

            obstaclesSort.forEach(obs => {
                if (obs.type === "blueGate" && imgBlueGates) {
                    ctx.drawImage(imgBlueGates, obs.x, obs.y, 120, 100);
                } else if (obs.type === "redGate" && imgRedGates) {
                    ctx.drawImage(imgRedGates, obs.x, obs.y, 120, 100);
                }else if (obs.type === "finishLine" && imgFinishLine) {
                    ctx.drawImage(imgFinishLine, obs.x, obs.y, 600, 200);
                }else if (obs.type === "tree" && imgTree) {
                    ctx.drawImage(imgTree, obs.x, obs.y, 160, 180);
                }
            });

            if(gameEnd){
                if(win){
                    ctx.drawImage(imagesRef.current.victoryText, 50, 200, 950, 850);
                }else{
                    ctx.drawImage(imagesRef.current.defeatText, 50, 200, 950, 450);
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
                setBook(true);
                setGameStarted(false);
            }}>
                Revenir au livre
            </button>

            {!gameStarted && (
                <button className={"launch-game-button"} onClick={() => {setGameStarted(true); pixelPasted = 0}}>
                    Lancer le jeu !
                </button>
            )}


            <canvas className="canvas" ref={canvasRef} data-started={gameStarted ? "true" : "false"} />

            <div className={"instruction"}>Passer entre les piquets avec les flèches &lt; gauche et droite &gt;.</div>
        </div>
    );
}

export default ski_game;