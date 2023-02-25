import React, { useEffect, useState } from "react";
import { TileValues } from "../models/TileValues";
import Tile from "./Tile";

const Board = ({tiles, onClick}) => {

  return (
    <div id="board">
        {tiles.map((tileRow, rowIndex) => (
            <React.Fragment key={rowIndex}>
                {tileRow.map((tile, colIndex) => (
                    <Tile key={rowIndex + ":" + colIndex} field={tile} row={rowIndex} col={colIndex} onClick={onClick}/>
                ))}
            </React.Fragment>
        ))}
    </div>
  );
};

export default Board;
