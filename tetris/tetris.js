const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d"); //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = 10;
const SQ = 30;
const empty = "WHITE"; // datark vandak

let score = 0;



function boxMake(x,y,color){
    ctx.fillStyle = color; // https://www.w3schools.com/tags/canvas_fillstyle.asp
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ); // https://www.w3schools.com/tags/canvas_fillrect.asp

    ctx.strokeStyle = "GRAY"; //     https://www.w3schools.com/tags/canvas_strokestyle.asp
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ); // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect
}


let board = [];
for(let r = 0; r <ROW; r++){
    board[r] = [];
    for(let c = 0; c < COL; c++){
        board[r][c] = empty;
    }
}
function makeBoard(){
    for(let r = 0; r <ROW; r++){
        for(let c = 0; c < COL; c++){
            boxMake(c,r,board[r][c]);
        }
    }
}

makeBoard();

const FIGURES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];


function Figures(tetrisfigures,color){
    this.tetrisfigures = tetrisfigures;
    this.color = color;
    
    this.tetrisfiguresN = 0;
    this.activeTetrisfigures = this.tetrisfigures[this.tetrisfiguresN];
    
    this.x = 3;
    this.y = -2;
}

function mixFigures(){
    let r = randomN = Math.floor(Math.random() * FIGURES.length)
    return new Figures( FIGURES[r][0],FIGURES[r][1]);
}

let p = mixFigures();


Figures.prototype.fill = function(color){
    for(let r = 0; r < this.activeTetrisfigures.length; r++){
        for(let c = 0; c < this.activeTetrisfigures.length; c++){
            if( this.activeTetrisfigures[r][c]){
                boxMake(this.x + c,this.y + r, color);
            }
        }
    }
}


Figures.prototype.draw = function(){
    this.fill(this.color);
}


Figures.prototype.unDraw = function(){
    this.fill(empty);
}

Figures.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetrisfigures)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Figures.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetrisfigures)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Figures.prototype.rotate = function(){
    let nextPattern = this.tetrisfigures[(this.tetrisfiguresN + 1)%this.tetrisfigures.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            kick = -1;
        }else{
            kick = 1;
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrisfiguresN = (this.tetrisfiguresN + 1)%this.tetrisfigures.length;
        this.activeTetrisfigures = this.tetrisfigures[this.tetrisfiguresN];
        this.draw();
    }
}


Figures.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetrisfigures)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        this.lock();
        p = mixFigures();
    }
    
}


Figures.prototype.collision = function(x,y,piece){
    for(let r = 0; r < piece.length; r++){
        for(let c = 0; c < piece.length; c++){
            if(!piece[r][c]){
                continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;
			
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            if(newY < 0){
                continue;
            }
            if( board[newY][newX] != empty){
                return true;
            }
        }
    }
    return false;
}



Figures.prototype.lock = function(){
    for(let r = 0; r < this.activeTetrisfigures.length; r++){
        for(let c = 0; c < this.activeTetrisfigures.length; c++){
            if( !this.activeTetrisfigures[r][c]){
                continue;
            }
            if(this.y + r < 0){
                alert("Game Over");
                gameOver = true;
                break;
            }
            board[this.y+r][this.x+c] = this.color;
        }
    }
    for(let r = 0; r < ROW; r++){
        let isRowFull = true;
        for(let c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != empty);
        }
        if(isRowFull){
            for(let y = r; y > 1; y--){
                for(let c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            for(let c = 0; c < COL; c++){
                board[0][c] = empty;
            }
           score += 1;
        }
    }
	
    makeBoard();
    scoreElement.innerHTML = score;
}


document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}


let dropStart = Date.now();   //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 500){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();