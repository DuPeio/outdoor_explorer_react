function ski_game({setBook, setGame}){
    return (
        <div className={"game-container"}>
            <button className={"back-button"} onClick={()=>{
                setGame(false);
                setBook(true);}}
            >Revenir au livre</button>
        </div>
    )
}

export default ski_game;