import { TileValues } from "../models/TileValues";

const Tile = ({field}) => {

    return (
        <div className={`tile noselect ${field == TileValues.mine ? "tile-mine" : "tile-normal"}`}>
            {field == TileValues.empty ? "" : field}
        </div>
    )
}

export default Tile;