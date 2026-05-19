import sports from '../data/sports.js';
import { useState } from 'react';
import LoginPage from "./LoginPage.jsx";
import BackSport from "./BackSport.jsx";
import FrontSport from "./FrontSport.jsx";

import { db } from '/services/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const NUMBER_OF_SPORTS = sports.length;

function Book(){
    const [currentPage, setCurrentPage] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState('');

    const [coverFlipped, setCoverFlipped] = useState(false);
    const [lastCoverFlipped, setLastCoverFlipped] = useState(false);
    const [pagesFlipped, setPagesFlipped] = useState(Array(NUMBER_OF_SPORTS + 1).fill(false));
    const [pagesHidden, setPagesHide] = useState(Array(NUMBER_OF_SPORTS + 1).fill(true));
    const [pagesLefted, setPagesLefted] = useState(Array(NUMBER_OF_SPORTS + 1).fill(false));

    const [gamesDone, setGamesDone] = useState(Array(NUMBER_OF_SPORTS).fill(false));


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

    async function handleLogin(id) {
        try{
            const docRef = doc(db, "users", id)
            const userDoc = await getDoc(docRef);

            if(userDoc.exists()){
                let userData = userDoc.data();
                setGamesDone(userData.userGames)

            }else{
                const userGames = Array(NUMBER_OF_SPORTS).fill(false);
                await setDoc(docRef, {
                    username: id,
                    userGames: userGames
                })
                setGamesDone(userGames)
            }

            setIsConnected(true);
            setUsername(id);

        }catch(err){
            console.log(`[Error] Connection with Firebase : ${err} `);
            alert("Erreur lors de la connexion, veuillez réessayer.");
        }
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
                id="page0" style={{right: pagesLefted[0] ? '35px':'23px'}}
                onClick={(e) => {
                    if (e.target.closest('form') || e.target.closest('button')) return;
                    handlePageClick(0);
                }}>


                <div className="front face">
                    <LoginPage send={handleLogin} currentUsername={username}/>
                </div>

                <div className="back face">
                    <BackSport sport={sports[0]}/>
                </div>

            </div>

            {sports.map((sport, id)=>{
                const pageIndex = id + 1;

                return(
                    <div className={`page ${pagesFlipped[pageIndex] ? 'flipping-forward' : ''} ${pagesHidden[pageIndex] ? 'hidden' : ''}`}
                         key= {id} id={`page${pageIndex}`} style={{ right: pagesLefted[pageIndex] ? '35px' : '23px' }}
                         onClick={(e) => {
                         if (e.target.closest('button') || e.target.closest('a')) return;
                         handlePageClick(pageIndex);
                    }}>

                        <div className="front face">
                            <FrontSport sport={sports[id]} gameDone={gamesDone[id]}/>
                        </div>


                        <div className="back face">
                            <BackSport sport={sports[id+1]}/>
                        </div>

                    </div>

                );
            })}

        </div>

    );

}

export default Book;