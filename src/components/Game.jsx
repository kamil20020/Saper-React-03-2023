import { useEffect, useState } from "react";
import { TileValues } from "../models/TileValues";
import Board from "./Board";

const Game = () => {
  const [tiles, setTiles] = useState([]);
  const [showedTiles, setShowedTiles] = useState([]);
  const [placedFlags, setPlacedFlags] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEndedGame, setIsEndedGame] = useState(false);

  const numberOfRows = 8;
  const numberOfCols = 8;
  const numberOfMines = 10;

  useEffect(() => {
    initTiles();
    initShowedTiles();
  }, []);

  let timer;

  const initTimer = () => {
    timer = setInterval(() => {
      setElapsedTime((elapsedTime) => elapsedTime + 1);
    }, 1000);
  };

  const initTiles = () => {
    let newTiles = [];

    for (let i = 0; i < numberOfRows; i++) {
      const column = new Array(numberOfCols).fill(TileValues.empty);
      newTiles.push(column);
    }

    let minesLocations = [];

    //add mines
    for (let i = 0; i < numberOfMines; ) {
      let randRow = Math.floor(Math.random() * numberOfRows);
      let randCol = Math.floor(Math.random() * numberOfCols);

      if (newTiles[randRow][randCol] == TileValues.empty) {
        newTiles[randRow][randCol] = TileValues.mine;
        minesLocations.push({ row: randRow, col: randCol });
        i++;
      }
    }

    //add numbers
    for (let i = 0; i < minesLocations.length; i++) {
      const { row, col } = minesLocations[i];

      for (let iRow = -1; iRow < 2; iRow++) {
        for (let iCol = -1; iCol < 2; iCol++) {
          const numberRow = row + iRow;
          const numberCol = col + iCol;

          if (
            numberRow < 0 ||
            numberRow == newTiles.length ||
            numberCol < 0 ||
            numberCol == newTiles.length ||
            newTiles[numberRow][numberCol] == TileValues.mine
          ) {
            continue;
          }

          newTiles[numberRow][numberCol]++;
        }
      }
    }

    setTiles(newTiles);
  };

  const initShowedTiles = () => {
    let newShowedTiles = [];

    for (let i = 0; i < numberOfRows; i++) {
      const column = new Array(numberOfCols).fill(TileValues.hidden);
      newShowedTiles.push(column);
    }

    setShowedTiles([...newShowedTiles]);
  };

  const showBoardAfterLose = () => {
    let newShowedTiles = [...showedTiles];

    tiles.forEach((tilesRow, rowIndex) => {
      tilesRow.forEach((tile, colIndex) => {
        const showedTile = newShowedTiles[rowIndex][colIndex];
        if (tile === TileValues.mine && showedTile !== TileValues.flag) {
          newShowedTiles[rowIndex][colIndex] = tile;
        }
      });
    });

    setShowedTiles(newShowedTiles);
  };

  const afterEndgameLogic = () => {
    if(window.confirm('Jeszcze jedna rozgrywka?')){
      initTiles();
      initShowedTiles();
      setIsEndedGame(false)
    }
  }

  const loseLogic = () => {
    setIsEndedGame(true);
    showBoardAfterLose();
    clearInterval(timer);
    alert("Przegrana!");
    afterEndgameLogic()
  };

  const winLogic = () => {
    let exploredTiles = 0;
    showedTiles.forEach((tilesRow) => {
      exploredTiles += tilesRow.filter(
        (tile) => tile !== TileValues.hidden && tile !== TileValues.flag
      ).length;
    });

    if (exploredTiles == numberOfRows * numberOfCols - numberOfMines) {
      setIsEndedGame(true);
      //clearInterval(timer);
      alert("Wygrana!");
      afterEndgameLogic()
    }
  };

  let exploredShowedTiles = [];

  const exploreEmptyTiles = (row, col) => {
    if (row < 0 || row == tiles.length || col < 0 || col == tiles.length) {
      return;
    }

    const showedTile = exploredShowedTiles[row][col];

    if (showedTile != TileValues.hidden) {
      return;
    }

    const tile = tiles[row][col];

    exploredShowedTiles[row][col] = tile;

    if (tile != TileValues.empty) {
      return;
    }

    for (let iRow = -1; iRow < 2; iRow++) {
      for (let iCol = -1; iCol < 2; iCol++) {
        const neighRow = row + iRow;
        const neighCol = col + iCol;
        exploreEmptyTiles(neighRow, neighCol);
      }
    }
  };

  const exploreSafeTiles = (row, col) => {

    const tile = showedTiles[row][col]

    if(!/^\d+$/.test(tile)){
      return;
    }

    let neighFlags = 0;
    let neighMines = 0;
    let correctFlags = 0;

    let numberFields = []

    for (let iRow = -1; iRow < 2; iRow++) {
      for (let iCol = -1; iCol < 2; iCol++) {
        const neighTileRow = row + iRow;
        const neighTileCol = col + iCol;

        if (neighTileRow < 0 || neighTileRow == tiles.length || neighTileCol < 0 || neighTileCol == tiles.length) {
          continue;
        }

        const neighTile = tiles[neighTileRow][neighTileCol];
        const neighShowedTile = exploredShowedTiles[neighTileRow][neighTileCol];

        let neighTileIsMine = false;

        if (neighTile === TileValues.mine) {
          neighMines++;
          neighTileIsMine = true;
        }

        if (neighShowedTile === TileValues.flag) {
          neighFlags++;
          if(neighTileIsMine){
            correctFlags++;
          }
        } else if(neighShowedTile === TileValues.hidden){
          if (!neighTileIsMine) {
            numberFields.push({row: neighTileRow, col: neighTileCol})
          }
        }
      }
    }

    if (neighFlags == neighMines) {
      if (correctFlags != neighMines) {
        loseLogic();
      }
      else{
        for(let i=0; i < numberFields.length; i++){
          const {row, col} = numberFields[i];
          exploreEmptyTiles(row, col)
        }
      }
    }
  };

  const handleClick = (e, row, col) => {
    if (isEndedGame) {
      return;
    }

    if (elapsedTime == 0) {
      //initTimer()
    }

    let showedTile = showedTiles[row][col];
    let newShowedTiles = [...showedTiles];

    if (e.button == 2) {
      if (showedTile == TileValues.flag) {
        newShowedTiles[row][col] = TileValues.hidden;
        setPlacedFlags(placedFlags - 1);
        setShowedTiles(newShowedTiles);
      } else if (showedTile == TileValues.hidden) {
        newShowedTiles[row][col] = TileValues.flag;
        setPlacedFlags(placedFlags + 1);
        setShowedTiles(newShowedTiles);
      }
    } else {
      if (showedTile == TileValues.hidden) {
        const tile = tiles[row][col];

        if (tile !== TileValues.mine) {
          exploredShowedTiles = [...showedTiles];
          exploreEmptyTiles(row, col, [...showedTiles]);
          setShowedTiles(exploredShowedTiles);
          exploredShowedTiles = [];

          winLogic();
        } else {
          const newShowedTiles = [...showedTiles];
          newShowedTiles[row][col] = tile;
          setShowedTiles(newShowedTiles);

          loseLogic();
        }
      } else {
        exploredShowedTiles = [...showedTiles];
        exploreSafeTiles(row, col);
        setShowedTiles(exploredShowedTiles);
        winLogic();
        exploredShowedTiles = [];
      }
    }
  };

  return (
    <div id="game">
      <Board tiles={showedTiles} onClick={handleClick} />
      <div id="info">
        <div id="mines">
          <p
            className="tile tile-mine noselect"
            style={{ width: 50, height: 50 }}
          >
            *
          </p>
          <p>{numberOfMines - placedFlags}</p>
        </div>
        <div id="timer">Czas: {elapsedTime} s</div>
      </div>
    </div>
  );
};

export default Game;
