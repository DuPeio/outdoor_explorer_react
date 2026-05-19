function ski_game({setBook, setGame}){
    setTimeout(()=>{
        setBook(true);
        setGame(false);
    },2000)
}

export default ski_game;