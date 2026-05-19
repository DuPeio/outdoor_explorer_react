import {useRef, useEffect} from "react";
import skier from "../../assets/games_illustrations/ski/skier.svg";
import tree from "../../assets/games_illustrations/ski/tree.svg";
import blueGates from "../../assets/games_illustrations/ski/blue_gates.svg";
import redGates from "../../assets/games_illustrations/ski/red_gates.svg";

function ski_game({ setBook, setGame }) {
    const canvasRef = useRef(null);
    const imagesRef = useRef({});

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = 1000;
        canvas.height = 700;

        const sources = {
            skier: skier,
            tree: tree,
            gateRed: redGates,
            gateBlue: blueGates
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
                    drawGameElement(ctx);
                }
            };
        });

        function drawGameElement(ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // BG
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const imgSkier = imagesRef.current.skier;
            const imgTree = imagesRef.current.tree;
            const imgBlueGates = imagesRef.current.gateBlue
            const imgRedGates = imagesRef.current.gateRed


            if (imgSkier) {
                ctx.drawImage(imgSkier, 400, 100, 42, 80);
            }
            if (imgTree) {
                // Dessiner les arbres aléatoirements entre x : -50 et 100 775 et 900
                // Le y va changer dans la boucle pour les faire avancer
                ctx.drawImage(imgTree, -50, 300, 160, 180);
                ctx.drawImage(imgTree, 100, 150, 160, 180);
                ctx.drawImage(imgTree, 775, 300, 160, 180);
                ctx.drawImage(imgTree, 900, 150, 160, 180);
            }
            // Entre les gates un écart de 200 au moins
            if(imgBlueGates) {
                // de 175 à 450
                ctx.drawImage(imgBlueGates, 260,300, 120, 100);
                ctx.drawImage(imgBlueGates, 375,550, 120, 100);
            }
            if(imgRedGates) {
                // de 550 à 650
                ctx.drawImage(imgRedGates, 550,500, 120, 100);
                ctx.drawImage(imgRedGates, 650,350, 120, 100);
            }
        }

    }, []);

    return (
        <div className={"game"}>
            <button className={"back-button"} onClick={() => {
                setGame(false);
                setBook(true);
            }}>
                Revenir au livre
            </button>

            {/* Ajout de bordures en CSS directement pour bien voir le Canvas */}
            <canvas
                className="canvas"
                ref={canvasRef}
                style={{ border: "2px solid #ccc", background: "#f0f4f8", display: "block", margin: "10px auto" }}
            />

            <div className={"instruction"}>Passer entre les piquets avec les flèches &lt; gauche et droite &gt;.</div>
        </div>
    );
}

export default ski_game;