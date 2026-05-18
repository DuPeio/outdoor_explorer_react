import sports from '../data/sports';
import { useState } from 'react';
import LoginPage from "./LoginPage.jsx";

const NUMBER_OF_SPORTS = sports.length;

function Book(){
    const [currentPage, setCurrentPage] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState('');

    const [coverFlipped, setCoverFlipped] = useState(false);
    const [lastCoverFlipped, setLastCoverFlipped] = useState(false);
    const [pagesFlipped, setPagesFlipped] = useState(Array(NUMBER_OF_SPORTS + 1).fill(false));
    const [pagesHidden, setPagesHide] = useState(Array(NUMBER_OF_SPORTS + 1).fill(true));


    function handleCoverClick() {
        let newHidden;
        if (!coverFlipped) {
            setCoverFlipped(true);

            setTimeout(()=>{
                newHidden = [...pagesHidden];
                newHidden[0] = false;
                setPagesHide(newHidden);
            }, 150)

        } else {
            if (currentPage !== 0) return;
            setCoverFlipped(false);

            setTimeout(()=>{
                newHidden = [...pagesHidden];
                newHidden[0] = true;
                setPagesHide(newHidden);
            },350)

        }
    }

    function handleLastCoverClick() {

        let newHidden;
        if(!lastCoverFlipped){
            if(currentPage !== NUMBER_OF_SPORTS+1)return;
            setLastCoverFlipped(true);
            setTimeout(()=>{
                newHidden = [...pagesHidden];
                newHidden[currentPage-1] = true;
                setPagesHide(newHidden);
            }, 350)
        }else{
            setLastCoverFlipped(false);
            setTimeout(()=>{
                newHidden = [...pagesHidden];
                newHidden[currentPage-1] = false;
                setPagesHide(newHidden);

            }, 150)

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
        setUsername(id);
    }

    return (
        <div className="book" id="book">
            <div className="rings" id="rings">

                {Array.from({ length: 18 }).map((_, index) => (
                    <div key={index} className="ring" />
                ))}

            </div>

            <div className={`cover ${coverFlipped ? 'flipping-forward' : ''}`} id="cover" onClick={handleCoverClick}>
                <div className="front face">
                    <div className="cover-title">Outdoor<br/>Explorer</div>
                    <img className="img-cover" id="imgCover" src="../src/assets/illustrations/montagnes_front_page.svg"
                         alt="Mountains icons"/>
                </div>
                <div className="back face"></div>
            </div>

            <div className={`cover last-cover ${lastCoverFlipped ? 'flipping-forward' : ''}`} id="lastCover"
                 onClick={handleLastCoverClick} style={{zIndex: lastCoverFlipped ? 1 : -10}}></div>

            <div
                className={`page ${pagesFlipped[0] ? 'flipping-forward' : ''} ${pagesHidden[0] ? 'hidden' : ''}`}
                id="page0"
                onClick={(e) => {
                    if (e.target.closest('form') || e.target.closest('button')) return;
                    handlePageClick(0);
                }}>


                <div className="front face">
                    <LoginPage send={handleLogin} currentUsername={username}/>
                </div>currentPage

                <div className="back face"></div>

            </div>

        </div>

    );

}

export default Book;