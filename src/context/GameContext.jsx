import {createContext, useContext, useState, useRef, useEffect} from "react";
import { NUMBER_OF_SPORTS } from "../config/constants.js";
import { db } from '/services/firebase.js';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const GameContext = createContext();

export function GameContextProvider({ children }) {
    const [gamesDone, setGamesDone] = useState(Array(NUMBER_OF_SPORTS).fill(false));
    const [username, setUsername] = useState('');
    const usernameRef = useRef('');
    const gamesDoneRef = useRef(Array(NUMBER_OF_SPORTS).fill(false));
    const [displayBook, setDisplayBook] = useState(true);

    const [screenSize, setScreenSize] = useState({width: window.innerWidth, height: window.innerHeight});

    useEffect(() => {
        function handleResize() {setScreenSize({width: window.innerWidth, height: window.innerHeight});}

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function handleLogin(id) {
        try{
            const docRef = doc(db, "users", id);
            const userDoc = await getDoc(docRef);

            if(userDoc.exists()){
                let userData = userDoc.data();
                setGamesDone(userData.userGames)
                gamesDoneRef.current = userData.userGames;

            }else{
                const userGamesDB = Array(NUMBER_OF_SPORTS).fill(false);
                await setDoc(docRef, {
                    username: id,
                    userGames: userGamesDB
                })
                setGamesDone(userGamesDB)

            }
            setUsername(id);
            usernameRef.current = id;

        }catch(err){
            console.log(`[Error] Connection with Firebase : ${err} `);
            alert("Erreur lors de la connexion, veuillez réessayer.");
        }
    }

    async function handleGameResult(idSport, res){
        if(!gamesDoneRef.current[idSport]){

            let newGamesDone = [...gamesDoneRef.current];
            newGamesDone[idSport] = res;

            setGamesDone(newGamesDone);
            gamesDoneRef.current = newGamesDone;

            if(usernameRef.current){
                try{
                    const docRef = doc(db, "users", usernameRef.current);
                    await updateDoc(docRef, { userGames: newGamesDone });
                }catch (err) {
                    console.log(`[Error] Mise à jour Firebase : ${err}`);
                }
            }
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    return (
        <GameContext.Provider value={{ screenSize, gamesDone, setGamesDone, username, setUsername, handleLogin, handleGameResult, displayBook, setDisplayBook, getRandomInt }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameContext() {
    return useContext(GameContext);
}
