window.onload = function() {

    function Petritable(w, h)
    {
        this.width = w;
        this.height = h;
        this.tbl;
        this.cellArray = new Array();

        this.buildPetriTable = function() {
            this.tbl = document.createElement("table");
            this.tbl.setAttribute("class","petritable");
            this.tbl.setAttribute("id", "petritable");
            for (var i = 0; i < this.width ; i++) {
                var row=this.tbl.insertRow(i);
                for (var j = 0; j < this.height ; j++) {
                    var c = new Cell(row.insertCell(j));
                    c.setID(i, j);
                    c.element.setAttribute("id", i + "_" + j);
                    c.element.setAttribute("class", "deadcell");
                    c.element.addEventListener("click",function myfunc() {
                        if (this.getAttribute("class") == "deadcell") {
                            this.setAttribute("class", "alivecell");
                        }
                        else {
                            this.setAttribute("class", "deadcell");
                        }
                    });
                    this.cellArray[ i + "_" + j ] = c;
                }
            }
            document.body.appendChild(this.tbl);
        }

        this.deletePetritable = function() {
            document.getElementById("petritable").remove();
        }

        this.getNumberOfNeighbours = function(cell) {
            var num = 0;
            var neighborCoords = this.getNeighborCoords(cell);
            for (var i = 0; i < neighborCoords.length; i += 2) {
                if (this.isNeighbourAlive(i, neighborCoords)) {
                    num++;
                }
            }
            return num;
        }

        this.isNeighbourAlive = function(index, coords) {
            var dir_r = coords[index];
            var dir_c = coords[index+1];
            if (dir_r < 0 || dir_c < 0 || dir_r > this.width - 1|| dir_c > this.height - 1) {
                return false;
            }
            if(this.cellArray[ dir_r + "_" + dir_c ].element.getAttribute("class") == "alivecell") {
                return true;
            }
            return false;
        }

        this.getNeighborCoords = function(cell) {
            var neighborCoords = new Array();
            neighborCoords[0] = cell.row - 1; // top row
            neighborCoords[1] = cell.column; // top col
            neighborCoords[2] = cell.row + 1; // bottom row
            neighborCoords[3] = cell.column; // bottom col
            neighborCoords[4] = cell.row; // left row
            neighborCoords[5] = cell.column - 1; // left col
            neighborCoords[6] = cell.row; // right row
            neighborCoords[7] = cell.column + 1; // right col
            neighborCoords[8] = cell.row - 1; // top left row
            neighborCoords[9] = cell.column - 1; // top left col
            neighborCoords[10] = cell.row - 1; // top right row
            neighborCoords[11] = cell.column + 1; // top right col
            neighborCoords[12] = cell.row + 1; // bottom left row
            neighborCoords[13] = cell.column - 1; // bottom left col
            neighborCoords[14] = cell.row + 1; // bottom right row
            neighborCoords[15] = cell.column + 1; // bottom right col
            return neighborCoords;
        }

        this.reDrawLifeStatus = function() {
            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    if (this.cellArray[ i + "_" + j ].alive) {
                        this.cellArray[ i + "_" + j ].element.setAttribute("class", "alivecell");
                    } else {
                        this.cellArray[ i + "_" + j ].element.setAttribute("class", "deadcell");
                    }
                }
            }
        }

        this.syncLifeStatusToDrawing = function() {
            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    if (this.cellArray[ i + "_" + j ].element.getAttribute("class") == "alivecell") {
                        this.cellArray[ i + "_" + j ].alive = true;
                    } else {
                        this.cellArray[ i + "_" + j ].alive = false;
                    }
                }
            } 
        }

        this.buildPetriTable();
    }

    function Cell(c)
    {
        this.element = c;
        this.row;
        this.column;
        this.alive = false;
        this.generation = 0;
        this.setID = function(row, col) {
            this.row = row;
            this.column = col;
        }
    }

    function LifeGen(w, h) 
    {
        this.width = w;
        this.height = h;
        this.theTable = new Petritable(w,h);

        this.lifeAndDeath = function() {
            this.theTable.reDrawLifeStatus();

            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var nOn = this.theTable.getNumberOfNeighbours(this.theTable.cellArray[ i + "_" + j ]);
                    if (this.theTable.cellArray[ i + "_" + j ].alive == true) {
                        if (nOn < 2) {
                            this.theTable.cellArray[ i + "_" + j ].alive = false;
                        } else if (nOn == 2 || nOn == 3) {
                            this.theTable.cellArray[ i + "_" + j ].generation++;
                        } else {
                            this.theTable.cellArray[ i + "_" + j ].alive = false;
                        }
                    } else {
                        if (nOn == 3) {
                            this.theTable.cellArray[ i + "_" + j ].alive = true;
                        }
                    }
                }
            }
        }
    }

    var generator = new LifeGen(60,80);

    var intervalId;

    var startBtnListener = function() {
        generator.theTable.syncLifeStatusToDrawing();
        intervalId = setInterval(function() { generator.lifeAndDeath(); }, 50);
        this.setAttribute("disabled", true);
    }

    var resetBtnListener = function() {
        generator.theTable.deletePetritable();
        clearInterval(intervalId);
        document.getElementById("startBtn").removeAttribute("disabled");
        generator = new LifeGen(60,80);
    }

    document.getElementById("startBtn").addEventListener("click", startBtnListener, false);
    document.getElementById("resetBtn").addEventListener("click", resetBtnListener, false);
}
/**
 * TODOs:
 * - Include buttons that generate popular patterns (preferably drag'n'drop).
 */
 