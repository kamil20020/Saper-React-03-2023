import { useEffect, useState } from "react";
import { TileValues } from "../models/TileValues";
import Board from "./Board";

const Game = () => {
  const [tiles, setTiles] = useState([]);
  const [showedTiles, setShowedTiles] = useState([])

  useEffect(() => {
    initTiles();
  }, []);

  const initTiles = () => {
    let newTiles = [];

    for (let i = 0; i < 10; i++) {
      const column = new Array(10).fill(TileValues.empty);
      newTiles.push(column);
    }

    setShowedTiles([...newTiles])

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

        for (let iCol = -1; iCol < 2; iCol++){

          const numberRow = row + iRow
          const numberCol = col + iCol

          if (
            numberRow < 0 ||
            numberRow == newTiles.length ||
            numberCol < 0 ||
            numberCol == newTiles.length ||
            newTiles[numberRow][numberCol] == TileValues.mine
          ) {
            continue;
          }

          newTiles[numberRow][numberCol]++
        }
      }
    }

    setTiles(newTiles);
  };

  return (
    <div>
      <Board tiles={tiles}/>
    </div>
  );
};

export default Game;
