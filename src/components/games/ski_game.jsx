function ski_game({setBook, setGame}){
    return (
        <div className={"game"}>
            <button className={"back-button"} onClick={()=>{
                setGame(false);
                setBook(true);}}
            >Revenir au livre</button>

            <canvas className="canvas">

            </canvas>
        </div>
    )
}

export default ski_game;