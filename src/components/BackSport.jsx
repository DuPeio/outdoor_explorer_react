import {useState} from "react";

function BackSport ({sport, gameDone}) {

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
                alert(`Mini-jeu ${sport.miniJeu}`);}}>Lancer le mini jeu</button>
        </div>
    )
}

export default BackSport;