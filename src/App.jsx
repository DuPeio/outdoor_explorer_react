import { NUMBER_OF_SPORTS, SPORTS } from './config/constants.js';
import Book from './components/Book';
import './App.css';
import SkiGame from "./components/games/SkiGame.jsx";
import TrailGame from "./components/games/TrailGame.jsx";
import RoadBikeGame from "./components/games/RoadBikeGame.jsx";
import ClimbGame from "./components/games/ClimbGame.jsx";
import {useState} from "react";

import { useGameContext } from './context/GameContext.jsx';


function App() {
    const { displayBook } = useGameContext();
    const [gamesDisplayed, setGamesDisplayed] = useState(Array(NUMBER_OF_SPORTS).fill(false));

    return (
        <div className="scene">
            <div className={`book-container ${displayBook ? "" : "hidden"}`}>
                <Book sports={SPORTS} setDisplayGame={setGamesDisplayed} />
            </div>

            {gamesDisplayed[0] &&
                <div className={`game-container`}>
                    <SkiGame setGame={setGamesDisplayed} />
                </div>
            }

            {gamesDisplayed[1] &&
                <div className={`game-container`}>
                    <TrailGame setGame={setGamesDisplayed} />
                </div>
            }

            {gamesDisplayed[2] &&
                <div className={`game-container`}>
                    <ClimbGame setGame={setGamesDisplayed} />
                </div>
            }

            {gamesDisplayed[3] &&
                <div className={`game-container`}>
                    <RoadBikeGame setGame={setGamesDisplayed} />
                </div>
            }
        </div>
    );
}

export default App;