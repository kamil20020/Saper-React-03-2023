import { useEffect, useState } from "react";
import { TileValues } from "../models/TileValues";
import Board from "./Board";

const Game = () => {
  const [tiles, setTiles] = useState([]);
  const [showedTiles, setShowedTiles] = useState([]);

  useEffect(() => {
    initTiles();
    initShowedTiles();
  }, []);

  const initTiles = () => {
    let newTiles = [];

    for (let i = 0; i < 10; i++) {
      const column = new Array(10).fill(TileValues.empty);
      newTiles.push(column);
    }

    let minesLocations = [];

    //add mines
    for (let i = 0; i < 10; ) {
      let randRow = Math.floor(Math.random() * 9);
      let randCol = Math.floor(Math.random() * 9);

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

    for (let i = 0; i < 10; i++) {
      const column = new Array(10).fill(TileValues.hidden);
      newShowedTiles.push(column);
    }

    setShowedTiles([...newShowedTiles]);
  };

  const loseLogic = () => {
    alert("Przegrana!");
  };

  const winLogic = () => {
    let exploredTiles = 0
    showedTiles.forEach(
      (tilesRow) => {

        exploredTiles += tilesRow.filter(
          (tile) => tile !== TileValues.hidden && tile !== TileValues.flag
        ).length
      }
    )

    if(exploredTiles == 90){
      alert("Wygrana!")
    }
  };

  let exploredShowedTiles = []

  const exploreTiles = (row, col) => {

    if(row < 0 || row == tiles.length || col < 0 || col == tiles.length){
      return;
    }
    
    const showedTile = exploredShowedTiles[row][col]

    if(showedTile != TileValues.hidden){
      return;
    }

    const tile = tiles[row][col]

    exploredShowedTiles[row][col] = tile

    if(tile != TileValues.empty){
      return;
    }

    for (let iRow = -1; iRow < 2; iRow++) {
      for (let iCol = -1; iCol < 2; iCol++) {
        const neighRow = row + iRow;
        const neighCol = col + iCol;
        exploreTiles(neighRow, neighCol)
      }
    }
  }

  const handleClick = (e, row, col) => {
    let showedTile = showedTiles[row][col];
    let newShowedTiles = [...showedTiles];

    if (e.button == 2) {
      if (showedTile == TileValues.flag) {
        newShowedTiles[row][col] = TileValues.hidden;
        setShowedTiles(newShowedTiles);
      } else if (showedTile == TileValues.hidden) {
        newShowedTiles[row][col] = TileValues.flag;
        setShowedTiles(newShowedTiles);
      }
    } else {
      if (showedTile == TileValues.hidden) {
        const tile = tiles[row][col];

        if (tile !== TileValues.mine) {
          exploredShowedTiles = [...showedTiles]
          exploreTiles(row, col, [...showedTiles])
          setShowedTiles(exploredShowedTiles)
          exploredShowedTiles = []

          winLogic()
        }
        else{
          const newShowedTiles = [...showedTiles]
          newShowedTiles[row][col] = tile
          setShowedTiles(newShowedTiles)

          loseLogic()
        }
      }
    }
  };

  return (
    <div>
      <Board tiles={showedTiles} onClick={handleClick} />
    </div>
  );
};

export default Game;
