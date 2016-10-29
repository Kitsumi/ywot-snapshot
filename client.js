var socket = new WebSocket(WorldProps.socketURL);

socket.addEventListener('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

socket.onerror = (err) => {
    if (err.code === 'EHOSTDOWN') {
        console.log('server down');
    }
};

socket.addEventListener('open', function() {
    console.log('WebSocket Client Connected');
    socket.onmessage = function(data) {
        var parsed = JSON.parse(data.data);
        if (parsed.kind == "tileUpdate") {
            //tilesToPicture(parsed);
        } else if (parsed.kind == "fetch") {
            tilesToPicture(parsed);
            console.log(`Got Tiles!`)
        } else {
            console.log(parsed);
        }
    }
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': -18,
        'min_tileX': -18,
        'max_tileY': -10,
        'max_tileX': -10,
        'v': 3
    }));
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': -18,
        'min_tileX': -9,
        'max_tileY': -10,
        'max_tileX': 9,
        'v': 3
    }));
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': -18,
        'min_tileX': 10,
        'max_tileY': -10,
        'max_tileX': 18,
        'v': 3
    }));
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': -9,
        'min_tileX': -18,
        'max_tileY': 9,
        'max_tileX': -10,
        'v': 3
    }));
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': -9,
        'min_tileX': -9,
        'max_tileY': 9,
        'max_tileX': 9,
        'v': 3
    }));
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': -9,
        'min_tileX': 10,
        'max_tileY': 9,
        'max_tileX': 18,
        'v': 3
    }));
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': 10,
        'min_tileX': -18,
        'max_tileY': 18,
        'max_tileX': -10,
        'v': 3
    }));
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': 10,
        'min_tileX': -9,
        'max_tileY': 18,
        'max_tileX': 9,
        'v': 3
    }));
    socket.send(JSON.stringify({
        "kind": "fetch",
        'min_tileY': 10,
        'min_tileX': 10,
        'max_tileY': 18,
        'max_tileX': 18,
        'v': 3
    }));
});

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

function tilesToPicture(tileData, xmin, ymin) {
    var Tiles = tileData.tiles;
    for (var Tile in Tiles) {
        if (Tiles.hasOwnProperty(Tile)) {
            var tile = Tiles[Tile];
            var tileX = Number(Tile.split(",")[1])+18;
            var tileY = Number(Tile.split(",")[0])+18;
            if (tile != null) {
                if (tile.properties.writability == null) {
                    ctx.fillStyle = WorldProps.public;
                    ctx.fillRect(tileX*160, tileY*144, 160, 144);
                }
                if (tile.properties.writability == 1) {
                    ctx.fillStyle = WorldProps.members;
                    ctx.fillRect(tileX*160, tileY*144, 160, 144);
                }
                if (tile.properties.writability == 2) {
                    ctx.fillStyle = WorldProps.admin;
                    ctx.fillRect(tileX*160, tileY*144, 160, 144);
                }
                for (var i = 0; i < tile.content.length; i++) {
                    var char = tile.content[i];
                    var charX = i%16;
                    var charY = Math.floor(i/16);
                    ctx.fillStyle = WorldProps.color;
                    ctx.font="12pt Courier New";
                    if (tile.properties.cell_props.hasOwnProperty(charY)) {
                        if (tile.properties.cell_props[charY].hasOwnProperty(charX)) {
                            if (tile.properties.cell_props[charY][charX].hasOwnProperty("link")) {
                                if (tile.properties.cell_props[charY][charX].link.type == "url") {
                                    ctx.fillStyle = "#00F";
                                    ctx.fillRect((tileX*160)+(charX*10), (tileY*144)+(charY*18)+14, 10, 1);
                                } else if (tile.properties.cell_props[charY][charX].link.type == "coord") {
                                    ctx.fillStyle = "#008000";
                                    ctx.fillRect((tileX*160)+(charX*10), (tileY*144)+(charY*18)+14, 10, 1);
                                }
                            }
                        }
                    }
                    ctx.textBaseline="top"; 
                    ctx.fillText(char, (tileX*160)+(charX*10), (tileY*144)+(charY*18));
                }
            } else {
                ctx.fillStyle = WorldProps.public;
                ctx.fillRect(tileX*160, tileY*144, 160, 144);
            }
        }
    }
}
