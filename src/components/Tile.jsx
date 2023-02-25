import { TileValues } from "../models/TileValues";

const Tile = ({ field, row, col, onClick}) => {

  const appendClasses = () => {
    let classes = ""

    if(field === TileValues.mine){
        classes += "tile-mine"
    }
    else if(field === TileValues.hidden){
        classes += " tile-hidden"
    }
    else if(field === TileValues.flag){
        classes += " tile-flag"
    }

    return classes
  }

  return (
    <div
      className={`tile noselect ${appendClasses()}`}
      onMouseDown={(e) => onClick(e, row, col)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {(field == TileValues.hidden || field == TileValues.flag) ? "" : field}
    </div>
  );
};

export default Tile;
