import { useState } from 'react';
import LoginPage from "./LoginPage.jsx";
import BackSport from "./BackSport.jsx";
import FrontSport from "./FrontSport.jsx";
import { NUMBER_OF_SPORTS, SPORTS } from '../config/constants.js';

import { useGameContext } from '../context/GameContext.jsx';

function Book({setDisplayGame}){

    const { gamesDone, handleLogin, username } = useGameContext();

    const [currentPage, setCurrentPage] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const [coverFlipped, setCoverFlipped] = useState(false);
    const [lastCoverFlipped, setLastCoverFlipped] = useState(false);
    const [pagesFlipped, setPagesFlipped] = useState(Array(NUMBER_OF_SPORTS + 1).fill(false));
    const [pagesHidden, setPagesHide] = useState(Array(NUMBER_OF_SPORTS + 1).fill(true));
    const [pagesLefted, setPagesLefted] = useState(Array(NUMBER_OF_SPORTS + 1).fill(false));

    const userAgent = navigator.userAgent.toLowerCase();
    console.log(userAgent);
    if(userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('android')) {
        alert("Ce site est optimisé pour une navigation sur ordinateur.");
    }

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
            },450)

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
            }, 450)
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
        const isFlipped = pagesFlipped[pageIndex]
        let pageLeft;
        let newHidden;

        if (!isFlipped) {
            if (pageIndex === 0 && !isConnected) {
                alert("Connexion obligatoire pour aller à la page suivante.");
                return;
            }

            const newFlips = [...pagesFlipped];
            newFlips[pageIndex] = true;
            setPagesFlipped(newFlips);

            setTimeout(()=>{
                newHidden = [...pagesHidden];
                newHidden[pageIndex+1] = false;
                setPagesHide(newHidden);
            },150)

            setTimeout(()=>{
                pageLeft = [...pagesLefted]
                pageLeft[pageIndex] = true;
                setPagesLefted(pageLeft);

                newHidden[pageIndex-1] = true;
                setPagesHide(newHidden);
            },450)

            setCurrentPage(prev => prev + 1);
        } else {
            const newFlips = [...pagesFlipped];
            newFlips[pageIndex] = false;
            setPagesFlipped(newFlips);

            setTimeout(()=>{
                newHidden = [...pagesHidden];
                newHidden[pageIndex-1] = false;
                setPagesHide(newHidden);
            },150)

            setTimeout(()=>{
                pageLeft = [...pagesLefted]
                pageLeft[pageIndex] = false;
                setPagesLefted(pageLeft);

                newHidden[pageIndex+1] = true;
                setPagesHide(newHidden);
            },450)

            setCurrentPage(prev => prev - 1);
        }
    }

    async function handleLoginLocal(id) {
        await handleLogin(id);
        setIsConnected(true);
    }

    return (
        <div className="book" id="book">
            <div className="rings" id="rings">

                {Array.from({length: 18}).map((_, index) => (
                    <div key={index} className="ring"/>
                ))}

            </div>

            <div className={`cover ${coverFlipped ? 'flipping-forward' : ''}`} id="cover" onClick={handleCoverClick}>
                <div className="front face">
                    <div className="cover-title">Outdoor<br/>Explorer</div>
                    <img className="img-cover" id="imgCover" src="/assets/illustrations/montagnes_front_page.svg"
                         alt="Mountains icons"/>
                </div>
                <div className="back face"></div>
            </div>

            <div className={`cover last-cover ${lastCoverFlipped ? 'flipping-forward' : ''}`} id="lastCover"
                 onClick={handleLastCoverClick} style={{zIndex: lastCoverFlipped ? 1 : -10}}></div>

            <div
                className={`page ${pagesFlipped[0] ? 'flipping-forward' : ''} ${pagesHidden[0] ? 'hidden' : ''}`}
                id="page0" style={{right: pagesLefted[0] ? '3.5%' : '2.5%'}}
                onClick={(e) => {
                    if (e.target.closest('form') || e.target.closest('button')) return;
                    handlePageClick(0);
                }}>


                <div className="front face">
                    <LoginPage send={handleLoginLocal} currentUsername={username}/>
                </div>

                <div className="back face">
                    <BackSport sport={SPORTS[0]} gameDone={gamesDone[0]} setGame={setDisplayGame} sportId={0}/>
                </div>

            </div>

            {SPORTS.map((sport, id) => {
                const pageIndex = id + 1;

                return (
                    <div
                        className={`page ${pagesFlipped[pageIndex] ? 'flipping-forward' : ''} ${pagesHidden[pageIndex] ? 'hidden' : ''}`}
                        key={id} id={`page${pageIndex}`} style={{right: pagesLefted[pageIndex] ? '35px' : '23px'}}
                        onClick={(e) => {
                            if (e.target.closest('button') || e.target.closest('a')) return;
                            handlePageClick(pageIndex);
                        }}>

                        <div className="front face">
                            <FrontSport sport={SPORTS[id]} gameDone={gamesDone[id]}/>
                        </div>


                        <div className="back face">
                            <BackSport sport={SPORTS[id + 1]} gameDone={gamesDone[id + 1]} setGame={setDisplayGame} sportId={id+1}/>
                        </div>

                    </div>

                );
            })}

        </div>
    );
}

export default Book;