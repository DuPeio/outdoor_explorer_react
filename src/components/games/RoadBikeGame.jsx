import {useGameContext} from "../../context/GameContext.jsx";
import {useEffect, useRef, useState} from "react";
import biker0 from "../../assets/games_illustrations/road_bike/biker0.svg"
import biker1 from "../../assets/games_illustrations/road_bike/biker1.svg"
import biker2 from "../../assets/games_illustrations/road_bike/biker2.svg"
import roadPainting from "../../assets/games_illustrations/road_bike/road.svg"
import tree0 from "../../assets/games_illustrations/share/tree0.svg";
import tree1 from "../../assets/games_illustrations/share/tree1.svg";
import tree2 from "../../assets/games_illustrations/share/tree2.svg";
import grass0 from "../../assets/games_illustrations/share/grass0.svg";
import grass1 from "../../assets/games_illustrations/share/grass1.svg";
import grass2 from "../../assets/games_illustrations/share/grass2.svg";
import finishLine from "../../assets/games_illustrations/share/finish_line.svg";
import victoryText from "../../assets/games_illustrations/share/texte_victoire.svg";
import defeatText from "../../assets/games_illustrations/road_bike/texte_defaite.svg";
import {BASE_HEIGHT, BASE_WIDTH} from "../../config/constants.js";

function roadBikeGame({setGame}) {
    const canvasRef = useRef(null);
    const imagesRef = useRef({});
    const pixelPastedRef = useRef(0);
    const animationFrameIdRef = useRef(null);
    const currentScaleRef = useRef(1);

    const [gameStarted, setGameStarted] = useState(false);

    const { returnGamePage, drawEndGame, getCanvasScale, screenSize, handleGameResult, getRandomInt } = useGameContext();


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

        let roadDirection = 0;
        let targetDirection = 0;
        let changeTimer = 0;

        let playerDirection = 0;
        let playerX = 450;
        const playerY = 100;

        let playerFrame = 0;
        let lastFrame = 1;
        let animationFrame = 0;
        const animationSpeed = 12

        let roadSegments = [];
        const segmentHeight = 5;
        const roadWidth = 200;

        const sources = {
            biker0 : { name : biker0, w : 50 , h : 120},
            biker1 : { name : biker1, w : 50 , h : 120},
            biker2 : { name : biker2, w : 50, h : 120},

            grass0:{name:grass0, w: 40, h:40},
            grass1:{name:grass1, w: 40, h:40},
            grass2:{name:grass2, w: 40, h:40},

            treeDecor0: {name:tree0, w: 130, h:180},
            treeDecor1: {name:tree1, w: 100, h:180},
            treeDecor2: {name:tree2, w: 100, h:180},

            finishLine: {name:finishLine, w: 600 , h:200},

            victoryText : {name:victoryText, w: 950, h:850},
            defeatText: {name:defeatText, w: 750, h:650},

            roadPainting : {name:roadPainting, w: 5, h:15}
        };

        function initRoad() {
            roadSegments = [];
            let currentX = 500;

            let initRoadDirection = 0;
            let initTargetDirection = 0;
            let initChangeTimer = 0;

            for (let y = BASE_HEIGHT + 200; y >= -5 ; y -= segmentHeight) {
                initChangeTimer--;
                if (initChangeTimer <= 0) {
                    initTargetDirection = getRandomInt(-2, 2);
                    initChangeTimer = getRandomInt(0, 5);
                }

                if (initRoadDirection < initTargetDirection) initRoadDirection += 0.1;
                if (initRoadDirection > initTargetDirection) initRoadDirection -= 0.1;

                currentX += initRoadDirection;

                if (currentX < 300){
                    currentX = 300;
                    initTargetDirection = 2;
                }

                if (currentX > 700){
                    currentX = 700;
                    initTargetDirection = -2;
                }

                roadSegments.push({ x: currentX, y: y });
            }
        }

        initRoad();

        function createObstacles() {
            let obstacles = [];

            for (let i = 0; i < 15; i++) {
                obstacles.push({ type: `treeDecor${getRandomInt(0,2)}`, x: getRandomInt(-50, 150), y: getRandomInt(-50, BASE_HEIGHT+100) });
                obstacles.push({ type: `grass${getRandomInt(0,2)}`, x: getRandomInt(-50, 150), y: getRandomInt(-50, BASE_HEIGHT+100) });
                obstacles.push({ type: `treeDecor${getRandomInt(0,2)}`, x: getRandomInt(BASE_WIDTH-300, BASE_WIDTH+100), y: getRandomInt(-50, BASE_HEIGHT+100) });
                obstacles.push({ type: `grass${getRandomInt(0,2)}`, x: getRandomInt(BASE_WIDTH-300, BASE_WIDTH+100), y: getRandomInt(-50, BASE_HEIGHT+100) });
            }

            for(let i = 0; i<roadSegments.length; i+= 10){
                obstacles.push({ type: `roadPainting`, x: roadSegments[i].x, y: roadSegments[i].y })
            }

            obstacles.push({ type: "finishLine", x: 200, y: BASE_HEIGHT + 100 });

            return obstacles;
        }

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


        let loadedCount = 0;
        const totalImages = Object.keys(sources).length;

        Object.entries(sources).forEach(([key, data]) => {
            const img = new Image();
            img.src = data.name;
            img.onload = () => {
                imagesRef.current[key] = img;
                loadedCount++;
                if (loadedCount === totalImages) {
                    gameLoop();
                }
            };
        });

        function gameLoop() {
            if (canvas.dataset.reset === "true") {
                roadDirection = 0;
                targetDirection = 0;
                changeTimer = 0;
                initRoad();
                obstacles = createObstacles();
                gameEnd = false;
                win = false;
                pixelPastedRef.current = 0;
                playerX = roadSegments[roadSegments.length - 20].x;
                canvas.dataset.reset = "false";
                speed = 4;
            }
            updatePositions();
            drawGame();
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        }

        function betterSort(obstacles) {
            const getBottomY = (obs) => {
                if (obs.type.includes("treeDecor")) return obs.y + 180;
                if (obs.type.includes("grass")) return obs.y + 40;
                if (obs.type === "finishLine") return obs.y + 200;
                return obs.y;
            };
            return [...obstacles].sort((a, b) => getBottomY(a) - getBottomY(b));
        }

        function updatePositions() {
            const playerSpeed = 5;

            if (canvas.dataset.started !== "true" || gameEnd) {
                return;
            }

            roadSegments.forEach(seg => {
                seg.y -= speed;
            });

            while (roadSegments[roadSegments.length - 1].y < -50) {

                let seg = roadSegments.pop();

                changeTimer--;
                if (changeTimer <= 0) {
                    targetDirection = getRandomInt(-3, 3);
                    changeTimer = getRandomInt(20, 50);
                }

                if (roadDirection < targetDirection) roadDirection += 0.1;
                if (roadDirection > targetDirection) roadDirection -= 0.1;

                let newX = roadSegments[0].x + roadDirection;
                if (newX < 350) {
                    targetDirection = 2;
                }
                if (newX > 700) {
                    targetDirection = -2;
                }

                seg.x = newX;
                seg.y = roadSegments[0].y + segmentHeight-0.5;

                roadSegments.unshift(seg);
            }

            let currentSeg = roadSegments.find(seg => playerY+120 >= seg.y && playerY+120 < seg.y + segmentHeight);

            if(!gameEnd && currentSeg){
                if(playerX+25 < currentSeg.x-roadWidth/2 || playerX+25 > currentSeg.x+roadWidth/2){
                    win = false;
                    gameEnd = true;
                    setGameStarted(false);
                    handleGameResult(3, false);
                }
            }

            speed += 0.003;
            pixelPastedRef.current -= speed;

            if(pixelPastedRef.current <= -20000){
                win = true;
                gameEnd = true;
                setGameStarted(false);
                handleGameResult(3, true);
            }else{
                obstacles.forEach(obs => {

                    if(obs.type !== "finishLine" || pixelPastedRef.current <= -19050){
                        obs.y -= speed;
                    }

                    if(obs.y < -5 && obs.type === "roadPainting"){
                        obs.y =roadSegments[0].y ;
                        obs.x = roadSegments[0].x;
                    }

                    if (obs.y < -200) {
                        if (obs.type.includes("treeDecor") || obs.type.includes("grass")) {
                            obs.y = canvas.height + getRandomInt(200, 400);
                            if (obs.x < 500) {
                                obs.x = getRandomInt(-50, 150);
                            } else {
                                obs.x = getRandomInt(BASE_WIDTH-300, BASE_WIDTH+100);
                            }
                        }
                    }
                });

                playerDirection = 0;

                if (keys.ArrowLeft) {
                    playerX -= playerSpeed;
                    playerDirection = 1;
                }
                if (keys.ArrowRight) {
                    playerX += playerSpeed;
                    playerDirection = 2;
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

        function drawGame() {
            const scale = currentScaleRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(scale, scale);

            ctx.fillStyle = "#309E1A";
            ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

            ctx.fillStyle = "#4A4A4A";
            roadSegments.forEach(seg => {
                ctx.fillRect(seg.x - (roadWidth / 2), seg.y, roadWidth, segmentHeight);
            });

            const imgBiker0 = imagesRef.current.biker0;
            const imgBiker1 = imagesRef.current.biker1;
            const imgBiker2 = imagesRef.current.biker2;

            const obstaclesSort = betterSort(obstacles);

            obstaclesSort.forEach(obs => {
                let img = imagesRef.current[obs.type];

                if(img){
                    ctx.drawImage(img, obs.x, obs.y, sources[obs.type].w, sources[obs.type].h)
                }
            });

            if (imgBiker0) {
                let currentPlayerImg = imgBiker0;

                if (playerDirection === 1 && imgBiker1) {
                    currentPlayerImg = imgBiker1;
                }
                else  if (playerDirection === 2 && imgBiker2) {
                    currentPlayerImg = imgBiker2;
                }
                else {
                    if (playerFrame === 1 && imgBiker1) {
                        currentPlayerImg = imgBiker1;
                    } else if (playerFrame === 2 && imgBiker2) {
                        currentPlayerImg = imgBiker2;
                    }
                }
                ctx.drawImage(currentPlayerImg, playerX, playerY, sources["biker0"].w, sources["biker0"].h);
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
        returnGamePage("Suivre la route avec les flêches < gauche et droite >.", canvasRef, gameStarted, setGameStarted, setGame)
    );
}

export default roadBikeGame;