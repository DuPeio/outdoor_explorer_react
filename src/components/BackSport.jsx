import {useState} from "react";
import SkiGame from './games/ski_game.jsx';

function BackSport ({sport, gameDone, setBook}) {

    const [hovered, setHovered] = useState(false);
    const [showSkiGame, setShowSkiGame] = useState(false);

    if (!sport) {return null;}

    if (showSkiGame) {
        return (
            <div className="ski-game-container">
                <SkiGame setBook={setBook} setGame={setShowSkiGame}/>
            </div>
        );
    }
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
                alert(`Mini-jeu ${sport.miniJeu}`);
                setBook(false);
                setShowSkiGame(true);
            }}
            >Lancer le mini jeu</button>
        </div>
    )
}

export default BackSport;