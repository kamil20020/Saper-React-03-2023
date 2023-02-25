import React, { useEffect, useState } from "react";
import { TileValues } from "../models/TileValues";
import Tile from "./Tile";

const Board = ({tiles}) => {

  return (
    <div id="board">
        {tiles.map((tileRow, rowIndex) => (
            <React.Fragment>
                {tileRow.map((tile, colIndex) => (
                    <Tile key={rowIndex + "" + colIndex} field={tile}/>
                ))}
            </React.Fragment>
        ))}
    </div>
  );
};

export default Board;
