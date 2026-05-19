import { useRef, useEffect } from "react";
import skier from "../../assets/games_illustrations/ski/skier.svg";
import tree from "../../assets/games_illustrations/ski/tree.svg";
import blueGates from "../../assets/games_illustrations/ski/blue_gates.svg";
import redGates from "../../assets/games_illustrations/ski/red_gates.svg";

function ski_game({ setBook, setGame }) {
    const canvasRef = useRef(null);
    const imagesRef = useRef({});

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

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

        obstacles.push({ type: "blueGate", x: 260, y: 400 });
        obstacles.push({ type: "redGate", x: 550, y: 900 });

        let skierX = 450;
        const skierY = 100;

        const sources = {
            skier: skier,
            tree: tree,
            gateRed: redGates,
            gateBlue: blueGates
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
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        function updatePositions() {
            obstacles.forEach(obs => {
                obs.y -= speed;
                if (obs.y < -200) {
                    if (obs.type === "tree") {
                        obs.y = canvas.height + getRandomInt(50, 400);
                        if (obs.x < 500) {
                            obs.x = getRandomInt(-50, 150);
                        } else {
                            obs.x = getRandomInt(800, 950);
                        }
                    } else {
                        obs.y = canvas.height
                        if(obs.type === "blueGate") {
                            obs.x = getRandomInt(325, 450);
                        }else{
                            obs.x = getRandomInt(550, 675);
                        }
                    }
                }
            });
        }

        function drawGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const imgSkier = imagesRef.current.skier;
            const imgTree = imagesRef.current.tree;
            const imgBlueGates = imagesRef.current.gateBlue;
            const imgRedGates = imagesRef.current.gateRed;

            const obstaclesSort = [...obstacles].sort((a, b) => a.y - b.y);

            obstaclesSort.forEach(obs => {
                if (obs.type === "tree" && imgTree) {
                    ctx.drawImage(imgTree, obs.x, obs.y, 160, 180);
                } else if (obs.type === "blueGate" && imgBlueGates) {
                    ctx.drawImage(imgBlueGates, obs.x, obs.y, 120, 100);
                } else if (obs.type === "redGate" && imgRedGates) {
                    ctx.drawImage(imgRedGates, obs.x, obs.y, 120, 100);
                }
            });

            if (imgSkier) {
                ctx.drawImage(imgSkier, skierX, skierY, 42, 80);
            }
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };

    }, []);

    return (
        <div className={"game"}>
            <button className={"back-button"} onClick={() => {
                setGame(false);
                setBook(true);
            }}>
                Revenir au livre
            </button>

            <canvas className="canvas" ref={canvasRef} />

            <div className={"instruction"}>Passer entre les piquets avec les flèches &lt; gauche et droite &gt;.</div>
        </div>
    );
}

export default ski_game;