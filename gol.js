window.onload = function() {

/**
 * TODOs:
 * - Include buttons that generate popular patterns (preferably drag'n'drop).
 */

    function Petritable(w, h)
    {
        this.width = w;
        this.height = h;
        this.htmlPetriTable;
        this.cellArray = new Array();
        this.buildPetriTable = buildPetriTable;
        this.deletePetritable = deletePetritable;
        this.reDrawLifeStatus = reDrawLifeStatus;
        this.syncLifeStatusToDrawing = syncLifeStatusToDrawing;

        function buildPetriTable() {
            this.htmlPetriTable = document.createElement("table");
            this.htmlPetriTable.setAttribute("class","petritable");
            this.htmlPetriTable.setAttribute("id", "petritable");

            for (var i = 0; i < this.width ; i++) {
                var row=this.htmlPetriTable.insertRow(i);
                for (var j = 0; j < this.height ; j++) {
                    var c = new Cell(row.insertCell(j));
                    c.setID(i, j);
                    c.setAttribute("id", i + "_" + j);
                    c.setAttribute("class", "deadcell");
                    c.addEventListener("click",function myfunc() {
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

            document.body.appendChild(this.htmlPetriTable);
        }

        function deletePetritable() {
            document.getElementById("petritable").remove();
        }

        function reDrawLifeStatus() {
            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.cellArray[ i + "_" + j ];
                    if (currentCell.isAlive()) {
                        currentCell.setAttribute("class", "alivecell");
                    } else {
                        currentCell.setAttribute("class", "deadcell");
                    }
                }
            }
        }

        function syncLifeStatusToDrawing() {
            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.cellArray[ i + "_" + j ];
                    if (currentCell.getAttribute("class") == "alivecell") {
                        currentCell.setAlive(true);
                    } else {
                        currentCell.setAlive(false);
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
        this.setID = setID;
        this.setAttribute = setAttribute;
        this.getAttribute = getAttribute;
        this.addEventListener = addEventListener;
        this.setAlive = setAlive;
        this.isAlive = isAlive;
        this.getNumberOfNeighbours = getNumberOfNeighbours;
        this.getNeighborCoords = getNeighborCoords;
        this.isNeighbourAlive = isNeighbourAlive;

        function setAttribute(attribute, value) {
            this.element.setAttribute(attribute, value);
        }

        function getAttribute(attribute) {
            return this.element.getAttribute(attribute);
        }

        function addEventListener(action, func) {
            this.element.addEventListener(action ,func);
        }

        function setID(row, col) {
            this.row = row;
            this.column = col;
        }

        function setAlive(isAlive) {
            this.alive = isAlive;
        }

        function isAlive() {
            return this.alive;
        }

        function getNumberOfNeighbours(table) {
            var num = 0;
            var neighborCoords = this.getNeighborCoords();
            for (var i = 0; i < neighborCoords.length; i += 2) {
                if (this.isNeighbourAlive(i, neighborCoords, table)) {
                    num++;
                }
            }
            return num;
        }

        function getNeighborCoords() {
            var neighborCoords = new Array();
            neighborCoords[0] = this.row - 1; // top row
            neighborCoords[1] = this.column; // top col
            neighborCoords[2] = this.row + 1; // bottom row
            neighborCoords[3] = this.column; // bottom col
            neighborCoords[4] = this.row; // left row
            neighborCoords[5] = this.column - 1; // left col
            neighborCoords[6] = this.row; // right row
            neighborCoords[7] = this.column + 1; // right col
            neighborCoords[8] = this.row - 1; // top left row
            neighborCoords[9] = this.column - 1; // top left col
            neighborCoords[10] = this.row - 1; // top right row
            neighborCoords[11] = this.column + 1; // top right col
            neighborCoords[12] = this.row + 1; // bottom left row
            neighborCoords[13] = this.column - 1; // bottom left col
            neighborCoords[14] = this.row + 1; // bottom right row
            neighborCoords[15] = this.column + 1; // bottom right col
            return neighborCoords;
        }

        function isNeighbourAlive(index, coords, table) {
            var dir_r = coords[index];
            var dir_c = coords[index+1];
            if (dir_r < 0 || dir_c < 0 || dir_r > table.width - 1|| dir_c > table.height - 1) {
                return false;
            }
            if(table.cellArray[ dir_r + "_" + dir_c ].getAttribute("class") == "alivecell") {
                return true;
            }
            return false;
        }
    }

    function LifeGen(w, h) 
    {
        this.width = w;
        this.height = h;
        this.theTable = new Petritable(w,h);
        this.lifeAndDeath = lifeAndDeath;

        function lifeAndDeath() {
            this.theTable.reDrawLifeStatus();

            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.theTable.cellArray[ i + "_" + j ];
                    var nOn = currentCell.getNumberOfNeighbours(this.theTable);
                    if (currentCell.isAlive()) {
                        if (nOn < 2) {
                            currentCell.setAlive(false);
                        } else if (nOn == 2 || nOn == 3) {
                            currentCell.generation++;
                        } else {
                            currentCell.setAlive(false);
                        }
                    } else {
                        if (nOn == 3) {
                            currentCell.setAlive(true);
                        }
                    }
                }
            }
        }
    }

    var petritableWidth = 80;
    var petritableHeight = 130;
    var generator = new LifeGen(petritableWidth,petritableHeight);

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
        generator = new LifeGen(petritableWidth,petritableHeight);
    }

    document.getElementById("startBtn").addEventListener("click", startBtnListener, false);
    document.getElementById("resetBtn").addEventListener("click", resetBtnListener, false);
}
 