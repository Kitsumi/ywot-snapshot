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
            tilesToPicture(parsed, WorldProps.xsize, WorldProps.ysize);
        } else {
            console.log(parsed);
        }
    }
    getTiles(WorldProps.xsize, WorldProps.ysize);
});

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var recievedTiles = 0;
function tilesToPicture(tileData, xsize, ysize) {
    console.log(`Got Tiles: ${recievedTiles}`);
    recievedTiles++;
    var Tiles = tileData.tiles;
    for (var Tile in Tiles) {
        if (Tiles.hasOwnProperty(Tile)) {
            var tile = Tiles[Tile];
            var tileX = Number(Tile.split(",")[1])+Math.floor((xsize*18)/2);
            var tileY = Number(Tile.split(",")[0])+Math.floor((ysize*18)/2);
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

function getTiles(xsize, ysize) {
	canvas.width = (160)*(xsize*18);
	canvas.height = (144)*(ysize*18);
	var startX = 0-Math.floor((xsize*18)/2);
	var startY = 0-Math.floor((ysize*18)/2);
	for (var y = 0; y < ysize; y++) {
		for (var x = 0; x < xsize; x++) {
			socket.send(JSON.stringify({
				"kind": "fetch",
				'min_tileY': startY+(y*18),
				'min_tileX': startX+(x*18),
				'max_tileY': startY+(y*18)+18,
				'max_tileX': startX+(x*18)+18,
				'v': 3
			}));
		}
	}
}
