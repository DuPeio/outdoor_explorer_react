import {useState} from "react";
import { NUMBER_OF_SPORTS } from '../config/constants.js';

function BackSport ({sportId, sport, gameDone, setBook, setGame}) {

    const [hovered, setHovered] = useState(false);

    if (!sport) {return null;}

    return (
        <div className="sport-container">
            <div className="sport-name-container" id="container" style={{backgroundImage: `url(../src/${sport.image})`}} onMouseOver={() => setHovered(true)}
                 onMouseOut={() => setHovered(false)}>
                <div className="sport-name" id="sport" style={{backgroundImage: `url(../src/${sport.image})`, color: hovered ? '#dabe12' : 'transparent',
                    fontSize: hovered ? '500%' : '450%', filter: hovered ? 'invert(0)' : 'invert(1)'}}>{sport.name}</div>
            </div>

            <div className="description" dangerouslySetInnerHTML={{ __html: sport.description }} id="description"></div>

            <img className="badge" id="badge" src={gameDone ? (`../src/${sport.badge}`):(`../src/${sport.emplacement}`)} alt="Reward of the sport"/>

            <button className="game-btn" id="game" onClick={(e) => {
                e.stopPropagation();
                setBook(false);

                const newGamesDisplayed = Array(NUMBER_OF_SPORTS).fill(false);
                newGamesDisplayed[sportId] = true;
                setGame(newGamesDisplayed);
            }}
            >Lancer le mini jeu</button>
        </div>
    )
}

export default BackSport;