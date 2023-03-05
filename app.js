const field = document.querySelector(".field");
const smile = document.querySelector(".smile");
let TIME = 0;
let finishGame = false;
let flags = [];
let questions = [];
let bombsRemains = 40;

smile.addEventListener('click', (event) =>{
    startGame(16, 16 , 40);
    TIME = 0;
    finishGame = false;
    bombsRemains = 40;
    flags = [];
    questions = [];
});

smile.addEventListener('mousedown', (event) =>{
    if(event.target.tagName !== 'BUTTON'){
        return;
    }
    smile.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -27px -24px;
                `;
});

smile.addEventListener('mouseup', (event) =>{
    if(event.target.tagName !== 'BUTTON'){
        return;
    }
    smile.style.cssText=`
        background-image: url(/sprite.png);
        background-repeat: no-repeat;
        background-position: 0px -24px;
    `;
});

field.addEventListener('mousedown', (event) =>{
    if(event.target.tagName !== 'BUTTON'){
        return;
    }
    smile.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -54px -24px;
                `;
});

field.addEventListener('mouseup', (event) =>{
    if(event.target.tagName !== 'BUTTON'){
        return;
    }
    smile.style.cssText=`
        background-image: url(/sprite.png);
        background-repeat: no-repeat;
        background-position: 0px -24px;
    `;
});



function startGame(WIDTH, HEIGHT, BOMBS_COUNT){
    //setInterval(updateCountDown, 1000);
    
    const cellsCount = WIDTH * HEIGHT;
    field.innerHTML = '<button></button>'.repeat(cellsCount)
    const cells = [...field.children];
    

    let FIRST_CLICK = true;

    let closedCount = cellsCount;

    const bombs = [...Array(cellsCount).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, BOMBS_COUNT);

    //console.log(bombs);
    field.addEventListener('click', (event) =>{
        if(event.target.tagName !== 'BUTTON'){
            return;
        }
        
        
        const index = cells.indexOf(event.target);

        if(flags.includes(index) || questions.includes(index)){
            return;
        }
        else{
            const column = index % WIDTH;
            const row = Math.floor(index / WIDTH);
            open(row, column);
        }
        
    });

    field.addEventListener('contextmenu', (event) =>{
        if(event.target.tagName !== 'BUTTON'){
            return;
        }
        if(event.target.disabled === true){
            return;
        }
        const index = cells.indexOf(event.target);
        if(index === -1){
            return;
        }
        
        if(flags.includes(index)){
            let index_delete = flags.indexOf(index);
            flags.splice(index_delete, 1);
            questions.push(index);
            event.target.style.cssText=`
            background-image: url(/sprite.png);
            background-repeat: no-repeat;
            background-position: -51px -51px;
            `;
            
        }
        else if(!questions.includes(index)){
            flags.push(index);
            event.target.style.cssText=`
            background-image: url(/sprite.png);
            background-repeat: no-repeat;
            background-position: -34px -51px;
            `;
        }
        else if(questions.includes(index)){
            let index_delete = questions.indexOf(index);
            questions.splice(index_delete, 1);
            event.target.style.cssText=`
            background-image: url(/sprite.png);
            background-repeat: no-repeat;
            background-position: 0px -51px;
            `;
        }
        console.log(flags);
        console.log(questions);
    });

    


    function isValid(row, column){
        return row >= 0
            && row < HEIGHT
            && column >= 0
            && column < WIDTH;
    }

    function getCount(row, column){
        let count = 0;

        for(let x = -1; x<=1; x++){
            for(let y = -1; y<=1; y++){
                if(isBomb(row + y, column + x)){
                    count++;
                }
            } 
        }

        return count;
    }


    function open(row, column){
        if(isBomb(row, column) && FIRST_CLICK === true){
            const elem_replace = row * WIDTH + column;
            for(let i = 0; i < 16; i++){
                if(!bombs.includes(i)){
                    let index_replace = bombs.indexOf(elem_replace);
                    bombs.splice(index_replace, 1, i);
                }
            }
            //console.log(bombs)
            /*
            const elem_delete = row * WIDTH + column;
            let index_delete = bombs.indexOf(elem_delete);
            bombs.splice(index_delete, 1);*/
            //console.log(bombs)
            FIRST_CLICK = false;
            //console.log(BOMBS_COUNT);
            //BOMBS_COUNT--;
            //console.log(BOMBS_COUNT);
        }
        FIRST_CLICK = false;
        if(!isValid(row, column)) return;
        
        const index = row * WIDTH + column;
        const cell = cells[index];

        if(cell.disabled === true){
            return;
        }

        cell.disabled = true;

        if(isBomb(row, column)){
            cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -102px -51px;
                    cursor: auto;
                    `;
            // индекс по которому лежит
            // красная бомба с координатами поля        
            let red_bomb = bombs.indexOf(index);
            for(let i = 0; i < bombs.length; i++){
                if(red_bomb === i){
                    continue;
                }
                else{
                    if(flags.includes(bombs[i]) || questions.includes(bombs[i])){
                        continue;
                    }
                    let otherBomb = bombs[i];
                    let cellBomb = cells[otherBomb];
                    cellBomb.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -85px -51px;
                    cursor: auto;
                    `;
                }
            }
            for(let i = 0; i < flags.length; i++){
                if(!bombs.includes(flags[i])){
                    let noBomb = flags[i];
                    let noCellBomb = cells[noBomb];
                    noCellBomb.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -119px -51px;
                    cursor: auto;
                    `;
                }
            }
            for(let i = 0; i < questions.length; i++){
                if(!bombs.includes(questions[i])){
                    let noBomb = questions[i];
                    let noCellBomb = cells[noBomb];
                    noCellBomb.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -119px -51px;
                    cursor: auto;
                    `;
                }
            }
            smile.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -108px -24px;
                `;
            finishGame = true;
            alert("You loose!!!");
            return;
        }
        //console.log(closedCount);
        //console.log(closedCount - BOMBS_COUNT);
        //console.log(256 - closedCount);
        closedCount--;
        //console.log(closedCount);

        if(closedCount <= BOMBS_COUNT){
            smile.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -81px -24px;
                `;
            finishGame = true;
            alert("You won!");
            return;
        }

        const count = getCount(row, column);

        if(count !== 0){
            switch(count){
                case 1:
                    cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: 0px -68px;
                    cursor: auto;
                    `;
                    break;
                case 2:
                    cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -17px -68px;
                    cursor: auto;
                    `;
                    break;
                case 3:
                    cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -34px -68px;
                    cursor: auto;
                    `;
                    break;
                case 4:
                    cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -51px -68px;
                    cursor: auto;
                    `;
                    break;
                case 5:
                    cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -68px -68px;
                    cursor: auto;
                    `;
                    break;
                case 6:
                    cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -85px -68px;
                    cursor: auto;
                    `;
                    break;
                case 7:
                    cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -102px -68px;
                    cursor: auto;
                    `;
                    break;
                case 8:
                    cell.style.cssText=`
                    background-image: url(/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -119px -68px;
                    cursor: auto;
                    `;
                    break;
                default:
                    break;
            }
            return;
        }

        for(let x = -1; x<=1; x++){
            for(let y = -1; y<=1; y++){
                open(row + y, column + x);
            } 
        }
    }



    function isBomb(row, column){
        if(!isValid(row, column)){
            return false;
        }

        const index = row * WIDTH + column;
        return bombs.includes(index);
    }

}

startGame(16, 16 , 40);


setInterval(updateCountDown, 1000);




const digitMine1 = document.querySelector(".digit__min1");
const digitMine2 = document.querySelector(".digit__min2");
const digitSec1 = document.querySelector(".digit__sec1");
const digitSec2 = document.querySelector(".digit__sec2");
const digitSec3 = document.querySelector(".digit__sec3");



function setDigit(elem, digit){
    switch(digit){
        case 0:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -126px 2px;
                cursor: auto;
            `;
            break;
        case 1:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: 0px 2px;
                cursor: auto;
            `;
            break;
        case 2:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -14px 2px;
                cursor: auto;
            `;
            break;
        case 3:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -28px 2px;
                cursor: auto;
            `;
            break;
        case 4:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -42px 2px;
                cursor: auto;
            `;
            break;
        case 5:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -56px 2px;
                cursor: auto;
            `;
            break;
        case 6:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -70px 2px;
                cursor: auto;
            `;
            break;
        case 7:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -84px 2px;
                cursor: auto;
            `;
            break;
        case 8:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -98px 2px;
                cursor: auto;
            `;
            break;
        case 9:
            elem.style.cssText=`
                background-image: url(/sprite.png);
                background-repeat: no-repeat;
                background-position: -112px 2px;
                cursor: auto;
            `;
            break;
        default:
            break;
    }
}

function updateCountDown(){
    //console.log(flags);
    //console.log(questions);
    bombsRemains = 40 - flags.length - questions.length;
    //console.log(bombsRemains);


    
    let seconds = TIME;

    setDigit(digitMine1, Math.floor(bombsRemains/10));
    setDigit(digitMine2, bombsRemains%10);
    setDigit(digitSec1, Math.floor(seconds/100));
    setDigit(digitSec2, Math.floor(seconds/10)%10);
    setDigit(digitSec3, seconds%10);
    if(!finishGame){
        TIME++;
    }
}

