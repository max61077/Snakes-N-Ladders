const board = document.querySelector('.board');
const dice = document.querySelector('.diceVal')
const diceBtn = document.getElementById('dice')
const msg = document.querySelector('.info .msg')
const box = document.getElementsByClassName('name')[0].children[2]
const chancesEle = document.getElementById('tc')
const replayBtn = document.getElementById('replay')
const modal = document.getElementsByClassName('modal')[0]

const boxes = []
let row = 'even';
const boxClr = 'darkslategrey'
let game = true;
let lastPosition = 0;
let player = boxes[0]
let prevPlayer = boxes[0]
let chance = false
let totalChances = 0;

//Message Info
const msgInfo = {
    start: {
        msg: 'Roll the Dice to Start the Game',
        color: 'yellowgreen'
    },
    turn: {
        msg: 'Wait for the turn to get over',
        color: 'red'
    },
    nextTurn: {
        msg: 'You can take the next turn',
        color: 'lightseagreen'
    },
    invalidMove: {
        msg: 'Invalid Move',
        color: 'red'
    },
    win: {
        msg: 'You won',
        color: 'yellowgreen'
    }
}

msg.style.color = msgInfo.start.color
msg.innerHTML = msgInfo.start.msg

//Creating Board
const makeBoard = () => {


    for(let i = 1; i <= 100; i++){

        const box = document.createElement('div')

        if(row === 'even'){
            box.classList.add('ebox')
            box.style.backgroundColor = boxClr
            box.style.color = 'whitesmoke'
        }
        else{
            box.classList.add('obox')
        }

        if(i % 10 != 0)
            row = row === 'even' ? 'odd' : 'even'

        board.appendChild(box)
    }
}

makeBoard()

//Making Snakes N Ladders
const snakesNLadder = {
    4: 16,
    26: 55,
    47: 90,
    60: 33,
    76: 34,
    83: 10,
    93: 52,
    99: 38
}

//Coloring Snakes and Ladders
const boxColor = diff => {

    if(diff > 0) {

        if(diff > 40)
            return '#5aa469'
        if(diff> 25)
            return 'yellowgreen'
        if(diff > 10)
            return 'lightgreen'

    } else {

        if(Math.abs(diff) > 50)
            return '#cf0000'
        if(Math.abs(diff)> 25)
            return '#fb3640'
        if(Math.abs(diff) > 10)
            return '#f9b208'
    }

}

//Filling Board
const fillBoard = () => {

    row = 'even';
    let res = []

    for(let i = 0; i < board.childElementCount; i++){

        if(i % 10 == 0 && i !== 0)
            row = row === 'even' ? 'odd' : 'even'
        
        if(row === 'odd')
            boxes.push(board.children[99 - i])
        else 
            res.push(board.children[99 - i])

        if(res.length === 10) {
            res.reverse()
            boxes.push(...res)
            res = []
        }

    }

    for(let i = 0; i < 100; i++){
        boxes[i].innerHTML = i + 1

        if(i in snakesNLadder){
            boxes[i - 1].innerHTML = i + ' -> ' + snakesNLadder[i]
            boxes[i - 1].style.color = boxColor(snakesNLadder[i] - i)

        }
    }

}

fillBoard()


//Checks Snakes n Ladder
const checkSnakeNLadder = pos => {
    // msg.innerHTML = pos
    if(pos in snakesNLadder){
        const turn = snakesNLadder[pos] - pos
        chance = true

        movePlayer(turn, true)
    }
}

//Player Position
const changePosition = (position, inc) => {

    let color = position % 2 != 0 ? 'white' : boxClr

    if(position !== 0){

        prevPlayer = inc > 0 ? boxes[position - 1] : boxes[position + 1]
        prevPlayer.style.backgroundColor = color
    }

    player = boxes[position]
    player.style.backgroundColor = 'dodgerblue'
}

let once = -1

//Player Movement
const movePlayer = (turns, snl) => {
    let i = lastPosition;
    let inc = turns > 0 ? 1 : -1;
    let timer = snl ? 50 : 150;

    if(i + turns <= 99) {
        let time = setInterval(() => {

            changePosition(i, inc)
            msg.style.color = msgInfo.turn.color
            msg.innerHTML = msgInfo.turn.msg
            
            if(i === lastPosition + turns + once){
                msg.style.color = msgInfo.nextTurn.color
                msg.innerHTML = msgInfo.nextTurn.msg
                once = 0
                lastPosition = i
                win(i)
                chance = false
                checkSnakeNLadder(lastPosition + 1)
                clearInterval(time)
            }

            i += inc;

        }, timer)

    } else {
        msg.style.color = msgInfo.invalidMove.color
        msg.innerHTML = msgInfo.invalidMove.msg
        chance = false
    }
}



//Dice Button
diceBtn.onclick = async() => {

    if(!game)
        return

    box.style.visibility = 'hidden'

    if(!chance) {
        chance = true
        totalChances += 1;

        await new Promise(res => {
            setTimeout(res, 200)
            dice.innerHTML = '...'
        })

        let number = Math.ceil(Math.random() * 6);
        dice.innerHTML = number
    
        movePlayer(number, false)
    } else {
        msg.style.color = msgInfo.turn.color
        msg.innerHTML = msgInfo.turn.msg
    }

}

//Check Win
const win = num => {
    if(num === 99){
        setTimeout(() => {
            modal.style.visibility = 'visible'
        }, 200)
        msg.style.color = msgInfo.win.color
        msg.innerHTML = msgInfo.win.msg
        chancesEle.innerHTML = totalChances
        game = false
    }
}

//Game Reset
const reset = () => {
    boxes[boxes.length - 1].style.backgroundColor = 'darkslategrey'
    lastPosition = 0;
    chance = false
    once = -1
    totalChances = 0
    game = true
    box.style.visibility = 'visible'
    modal.style.visibility = 'hidden'
    msg.innerHTML = msgInfo.start.msg
}

//Replay Btn
replayBtn.onclick = () => {
    if(!game)
        reset()
}
