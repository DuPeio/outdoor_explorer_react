function FrontSport({sport, gameDone}) {
    if(!sport) return null;

    return (
        <div className="front face">
            <div className={`game-not-done ${gameDone ? 'hidden' : ''}`}>
                Déverrouillez les informations en jouant au mini-jeu !
            </div>

            <div className="informations-container">

                <div className={`informations`} style={{filter: gameDone ? 'blur(0)' : 'blur(4px)'}}>

                    <div className="resume" dangerouslySetInnerHTML={{ __html: sport.infos.resume }}></div>

                    <div className="season" dangerouslySetInnerHTML={{ __html: sport.infos.saisonIdeale }}></div>

                    <h4>Coût de la pratique</h4>
                    <div className="cost" dangerouslySetInnerHTML={{ __html: sport.infos.cout }}></div>

                    <div className="material-benefits">
                        <div className="material-container">
                            <h4>Matériel nécessaire</h4>
                            <div className="material" dangerouslySetInnerHTML={{ __html: sport.infos.materiel }}></div>
                        </div>
                        <div className="benefits-container">
                            <h4>Bienfaits</h4>
                            <div className="benefits" dangerouslySetInnerHTML={{ __html: sport.infos.bienfaits }}></div>
                        </div>
                    </div>

                    <h4>Conseils</h4>
                    <div className="tips" dangerouslySetInnerHTML={{ __html: sport.infos.conseilsDebutant }}></div>

                    <div className="club-link">
                        Si tu veux plus <b>d'informations</b> pour pratiquer rends-toi sur ce(s) lien(s) :{' '}
                        {sport.infos.lienClub.length > 1 ? (
                            <ul>
                                {sport.infos.lienClub.map((link, key) => (
                                    <li><a href={link} target="_blank" key={key}>{link}</a></li>
                                ))}
                            </ul>
                        ) : (<a href={sport.infos.lienClub[0]} target="_blank">{sport.infos.lienClub[0]}</a>)}
                    </div>


                </div>
            </div>
        </div>
    );
}

export default FrontSport;