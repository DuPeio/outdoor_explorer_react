import sports from '../data/sports';
import { useState } from 'react';

const NUMBER_OF_SPORTS = sports.length;

function Book(){
    const [currentPage, setCurrentPage] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const [coverFlipped, setCoverFlipped] = useState(false);
    const [lastCoverFlipped, setLastCoverFlipped] = useState(false);
    const [pagesFlipped, setPagesFlipped] = useState(Array(NUMBER_OF_SPORTS + 1).fill(false));


    function handleCoverClick() {
        console.log(currentPage);
        if (!coverFlipped) {
            setCoverFlipped(true);
        } else {
            if (currentPage !== 0) return;
            setCoverFlipped(false);
        }
    }

    function handleLastCoverClick() {
        if(!lastCoverFlipped){
            if(currentPage !== 0)return;
            setLastCoverFlipped(true);
        }else{
            setLastCoverFlipped(false);
        }
    }

    function handlePageClick(pageIndex) {
        const isFlipped = pagesFlipped[pageIndex];

        if (!isFlipped) {
            if (pageIndex === 0 && !isConnected) {
                alert("Connexion obligatoire pour aller à la page suivante.");
                return;
            }

            // TODO : Changer le style right et de cacher/montrer les pages
            const newFlips = [...pagesFlipped];
            newFlips[pageIndex] = true;
            setPagesFlipped(newFlips);

            setCurrentPage(prev => prev + 1);
        } else {
            // TODO : Changer le style right et de cacher/montrer les pages
            const newFlips = [...pagesFlipped];
            newFlips[pageIndex] = false;
            setPagesFlipped(newFlips);

            setCurrentPage(prev => prev - 1);
        }
    }

    function handleLogin(id) {
        setIsConnected(true);
        console.log(`Connecté en tant que : ${id}`);
        // TODO : modifier pour changer le texte affiché pour montrer que l'utilisateur est connecté
    }

    return (
        <div className="book" id="book">
            <div className={`cover ${coverFlipped ? 'flipping-forward' : ''}`} id="cover" onClick={handleCoverClick}>
                <div className="front face">
                    <div className="cover-title">Outdoor<br/>Explorer</div>
                    <img className="img-cover" id="imgCover" src="../src/assets/illustrations/montagnes_front_page.svg"
                         alt="Mountains icons"/>
                </div>
                <div className="back face"/>
            </div>

            <div className={`cover last-cover ${lastCoverFlipped ? 'flipping-forward' : ''}`} id="lastCover"
                 onClick={handleLastCoverClick} style={{ zIndex: lastCoverFlipped ? 1 : -10 }}></div>
        </div>
    );

}
export default Book;