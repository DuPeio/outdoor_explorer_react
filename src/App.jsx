import { NUMBER_OF_SPORTS, SPORTS } from './config/constants.js';
import Book from './components/Book';
import './App.css';
import Ski_game from "./components/games/ski_game.jsx";
import {useState} from "react";


function App() {
    const [displayBook, setDisplayBook] = useState(true);
    const [gamesDisplayed, setGamesDisplayed] = useState(Array(NUMBER_OF_SPORTS).fill(false));

    return (
        <div className="scene">
            <div className={`book-container ${displayBook ? "" : "hidden"}`}>
                <Book sports={SPORTS} setDisplayBook={setDisplayBook} setDisplayGame={setGamesDisplayed} />
            </div>

            <div className={`game-container ${gamesDisplayed[0] ? "" : "hidden"}`}>
                <Ski_game setGame={setGamesDisplayed} setBook={setDisplayBook} />
            </div>

        </div>
    );
}

export default App;