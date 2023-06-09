// js goes here

var restartButton = document.getElementById("restartButton");
var gameContainer = document.getElementById("gameContainer");
var container = document.getElementById("container");
var flagsLeft = document.getElementById("flagsLeftDiv");
var timerDiv = document.getElementById("timerDiv");
var gridNums;
var gridContents;
var gridInfo; 
var gridInfo2;
var bombAmount;
var flagAmount = 0;
var rowLength;
var colLength;
var startTime;
var anInterval;
var startFlag = false;
var helpFlag = false;
document.getElementById("helpButton").addEventListener("click",toggleHelp,false);
document.getElementById("unhelpButton").addEventListener("click",toggleHelp,false);
window.addEventListener("resize",resizeEvent,false);
restartButton.addEventListener("click",startGame,false);
var statusContainer = document.getElementById("statusContainer");
var statusMsg = document.querySelectorAll("#statusMsg > p");

resizeEvent();
startGame();

function startGame(){

    gameContainer.innerHTML = "";
    restartButton.innerHTML = "🙂";
    var gameInfo = getGameInfo();
    var level = Math.floor(Math.random()*4)+1;
    var boardSize = Number(gameContainer.clientWidth);
    startFlag = false;
    timerDiv.innerHTML = "⌚ 0:00";
    clearInterval(anInterval);

    rowLength = gameInfo[level-1]["width"];
    colLength = gameInfo[level-1]["height"];
    bombAmount = gameInfo[level-1]["bombs"];
    flagAmount = bombAmount;
    flagsLeft.innerHTML = "🚩 x"+flagAmount;
    gameContainer.style.fontSize = gameInfo[level-1]["fontSize"];

    // building the html skeleton

    gameContainer.style.gridTemplateColumns = ""+getTemplateColumns(rowLength);

    for(let i=0; i<colLength; i++){

        for(let j=0; j<rowLength; j++){

            let divItem = document.createElement("div");
            divItem.classList.add("grid-item");
            gameContainer.append(divItem);

            let divCover = document.createElement("div");
            divCover.classList.add("grid-cover");
            divItem.append(divCover);

            let divContents = document.createElement("div");
            divContents.classList.add("grid-contents");
            divItem.append(divContents);

        }

    }

    //

    gridNums = document.getElementsByClassName("grid-cover");
    gridContents = document.getElementsByClassName("grid-contents");

    for(let i=0; i<gridContents.length; i++){

        gridContents[i].style.width = ""+(boardSize/rowLength)+"px";
        gridContents[i].style.height = ""+(boardSize/colLength)+"px";

        gridNums[i].style.width = ""+(boardSize/rowLength)+"px";
        gridNums[i].style.height = ""+(boardSize/colLength)+"px";

        gridContents[i].id = i;
        gridNums[i].id = "cover"+i;

    }
    
    gridInfo = makeGrid(gridNums.length);
    gridInfo2 = getBombInfo(gridInfo);

    printNums(gridNums);
    buildEventHandlers(gridContents,gridNums);

}

function setUpTimer(){

    startFlag = true;
    startTime = new Date();
    clearInterval(anInterval);
    anInterval = setInterval(function(){

        var endTime = new Date();
        timerDiv.innerHTML = "⌚ "+timer(startTime,endTime);

    },100);

}

function printNums(elem){

    var bombSpots = pickBombSpots(elem.length,bombAmount);

    var bomb = "💣";

    for(let i=0; i<elem.length; i++){

        if(bombSpots.indexOf(i) != -1){

            elem[i].innerText = ""+bomb;
            gridInfo[i] = "bomb";
            gridInfo2[i]["value"] = "bomb"; 

        } else {

            elem[i].innerHTML = "&nbsp";

        }

    }

    for(let i=0; i<elem.length; i++){

        if(bombSpots.indexOf(i) == -1){

            var bombRange = checkBombRange(bombSpots,i,rowLength,colLength);

            if(bombRange == 0){

                elem[i].innerText = "";
                gridInfo[i] = ""+bombRange;
                gridInfo2[i]["value"] = ""+bombRange; 
                

            } else{

                elem[i].style.color = ""+getRangeCol(bombRange);
                elem[i].innerText = ""+bombRange;
                gridInfo[i] = ""+bombRange;
                gridInfo2[i]["value"] = ""+bombRange; 

            }

        }

    }

}

function pickBombSpots(amount,spots){

    var pickedSpots = [];

    for(let i=0; i<spots; i++){

        var randNum = Math.floor(Math.random()*amount);

        if(pickedSpots.indexOf(randNum) == -1){

            pickedSpots.push(randNum);

        } else {

            i--;

        }

    }

    return pickedSpots;

}

function checkBombRange(bombs,posn,rowLength,colLength){

    var counter = 0;

    for(let j=-1; j<2; j++){

        for(let k=-1; k<2; k++){

            if(k == 0 && j == 0){

                continue;

            } else if(Math.floor((posn+k)/rowLength) != Math.floor(posn/rowLength)){

                continue;

            } else if(Math.floor((posn+(j*colLength))/colLength) > colLength || Math.floor((posn+(j*colLength)/colLength)) < 0){

                continue;

            } else if(bombs.indexOf(posn+(j*colLength)+k) != -1){

                counter++;

            }

        }

    }

    return counter;

}

function getRangeCol(bombRange){

    var result = "";

    switch(bombRange){

        case 1:
            result = "blue";
            break;
        case 2:
            result = "green";
            break;
        case 3:
            result = "red";
            break;
        case 4:
            result = "purple"
            break;
        case 5:
            result = "maroon";
            break;
        case 6:
            result = "cyan";
            break;
        case 7:
            result = "pink";
            break;
        case 8:
            result = "orange";
            break;
        default:
            break;

    }

    return result;

}

function makeGrid(amount){

    var result = [];

    for(let i=0; i<amount; i++){

        result.push("");

    }

    return result;

}

function buildEventHandlers(elem,elem2){

    for(let i=0; i<elem.length; i++){

        elem[i].addEventListener("contextmenu",toggleFlag,false);
        elem[i].addEventListener("click",revealTile,false);
        elem2[i].addEventListener("click",pressNumbers,false);

        /*elem[i].addEventListener("click",function revealTile(e){

            if(gridInfo2[i]["flag"] == "none"){

                if(gridInfo2[i]["value"] == "0"){

                    revealAdditionalTile(elem,i);

                } else {

                    gridInfo2[i]["status"] = "visible";
                    elem[i].style.opacity = "0";

                }
                
                if(gridInfo2[i]["value"] == "bomb"){

                    elem2[i].innerText = "💥";
                    revealAllBombs(elem,elem2);
                    alert("You Lose");      

                } else if(checkHiddenTilesLeft(elem) == bombAmount){

                    for(let j=0; j<elem.length; j++){
                        
                        elem[j].removeEventListener("contextmenu",toggleFlag,false);
                        elem[j].removeEventListener("click",revealTile,false);

                    }

                    revealAllTiles(elem);
                    alert("You Win");

                }

                this.removeEventListener("click",revealTile);

            }

        },false);*/

        /*elem2[i].addEventListener("click",function test(e){

            alert("test");

        },true);*/

    }

}

function revealAdditionalTile(elem,val){

    if(gridInfo2[val]["status"] == "hidden" && gridInfo2[val]["value"] == "0" && gridInfo2[val]["flag"] == "none"){

        //console.log("hi");
        if(gridInfo2[val]["flag"] == "none"){

            gridInfo2[val]["status"] = "visible";
            elem[val].style.opacity = "0";
            elem[val].style.display = "none";
        
        }

        for(let j=-1; j<2; j++){

            for(let k=-1; k<2; k++){

                if(Math.floor((val+k)/rowLength) != Math.floor(val/rowLength)){
    
                    continue;
    
                } else if(Math.floor((val+(j*colLength))/colLength) > colLength || Math.floor((val+(j*colLength)/colLength)) < 0){
    
                    continue;
    
                } else {

                    if((val+(j*colLength)+k) >= 0 && (val+(j*colLength)+k) < (rowLength*colLength)){
    
                        revealAdditionalTile(elem,(val+(j*colLength)+k));

                    }
    
                }

            }

        }

    } else if (gridInfo2[val]["status"] == "hidden" && gridInfo2[val]["flag"] == "none"){

        gridInfo2[val]["status"] = "visible";
        elem[val].style.opacity = "0";
        elem[val].style.display = "none";

    }

}

function revealAllTiles(elem){

    for(let j=0; j<elem.length; j++){

        if(gridInfo2[j]["value"] == "bomb"){

            if(gridInfo2[j]["flag"] != "placed"){

                gridInfo2[j]["flag"] = "placed";
                elem[j].innerText = "🚩";

            }

        } else {

            gridInfo2[j]["status"] = "visible";
            elem[j].style.opacity = "0";
            elem[j].style.display = "none";

        }

    }

}

function revealAllBombs(elem){

    for(let j=0; j<elem.length; j++){

        if(gridInfo2[j]["status"] == "hidden" && gridInfo2[j]["flag"] == "placed"){

            if(gridInfo2[j]["value"] != "bomb"){

                elem[j].style.backgroundColor = "rgba(220,70,70)";

            }

        } else if(gridInfo2[j]["status"] == "hidden" && gridInfo2[j]["value"] == "bomb"){

            if(gridInfo2[j]["flag"] == "placed"){
    
                continue;
    
            } else {

                gridInfo2[j]["status"] = "visible";
                elem[j].style.opacity = "0";
                elem[j].style.display = "none";

            }

        }

    }

}

function checkHiddenTilesLeft(elem){

    var result = 0;

    for(let j=0; j<elem.length; j++){

        if(gridInfo2[j]["status"] == "hidden"){

            result++;

        }

    }

    return result;

}

function getBombInfo(limit){

    var result = [
    {
        "#": 0,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 1,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 2,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 3,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 4,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 5,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 6,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 7,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 8,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 9,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 10,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 11,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 12,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 13,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 14,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 15,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 16,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 17,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 18,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 19,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 20,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 21,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 22,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 23,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 24,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 25,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 26,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 27,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 28,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 29,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 30,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 31,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 32,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 33,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 34,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 35,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 36,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 37,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 38,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 39,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 40,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 41,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 42,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 43,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 44,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 45,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 46,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 47,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 48,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 49,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 50,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 51,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 52,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 53,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 54,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 55,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 56,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 57,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 58,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 59,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 60,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 61,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 62,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 63,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 64,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 65,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 66,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 67,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 68,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 69,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 70,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 71,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 72,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 73,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 74,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 75,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 76,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 77,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 78,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 79,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 80,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 81,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 82,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 83,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 84,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 85,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 86,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 87,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 88,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 89,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 90,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 91,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 92,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 93,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 94,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 95,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 96,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 97,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 98,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 99,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 100,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 101,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 102,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 103,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 104,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 105,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 106,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 107,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 108,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 109,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 110,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 111,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 112,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 113,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 114,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 115,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 116,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 117,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 118,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 119,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 120,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 121,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 122,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 123,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 124,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 125,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 126,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 127,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 128,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 129,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 130,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 131,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 132,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 133,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 134,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 135,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 136,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 137,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 138,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 139,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 140,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 141,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 142,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 143,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 144,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 145,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 146,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 147,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 148,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 149,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 150,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 151,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 152,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 153,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 154,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 155,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 156,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 157,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 158,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 159,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 160,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 161,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 162,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 163,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 164,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 165,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 166,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 167,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 168,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 169,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 170,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 171,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 172,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 173,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 174,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 175,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 176,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 177,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 178,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 179,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 180,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 181,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 182,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 183,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 184,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 185,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 186,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 187,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 188,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 189,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 190,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 191,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 192,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 193,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 194,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 195,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 195,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 195,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 195,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 195,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 195,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 195,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 195,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 203,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 204,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 205,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 206,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 207,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 208,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 209,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 210,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 211,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 212,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 213,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 214,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 215,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 216,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 217,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 218,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 219,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 220,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 221,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 222,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 223,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 224,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 225,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 226,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 227,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 228,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 229,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 230,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 231,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 232,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 233,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 234,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 235,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 236,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 237,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 238,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 239,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 240,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 241,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 242,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 243,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 244,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 245,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 246,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 247,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 248,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 249,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 250,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 251,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 252,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 253,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 254,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 255,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 256,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 257,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 258,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 259,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 260,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 261,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 262,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 263,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 264,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 265,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 266,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 267,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 268,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 269,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 270,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 271,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 272,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 273,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 274,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 275,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 276,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 277,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 278,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 279,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 280,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 281,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 282,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 283,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 284,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 285,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 286,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 287,
        "value": "",
        "status": "hidden",
        "flag": "none"
    },
    {
        "#": 288,
        "value": "",
        "status": "hidden",
        "flag": "none"
    }];

    //console.log(result);

    return result;

}

function getGameInfo(){

    var result = [
        {
            "#":1,
            "mode":"Small",
            "width":8,
            "height":8,
            "bombs":8,
            "fontSize": "1.2em"
        },
        {
            "#":2,
            "mode":"Medium",
            "width":11,
            "height":11,
            "bombs":16,
            "fontSize": "1.05em"
        },
        {
            "#":3,
            "mode":"Big",
            "width":14,
            "height":14,
            "bombs":26,
            "fontSize": "0.9em"
        },
        {
            "#":4,
            "mode":"Huge",
            "width":17,
            "height":17,
            "bombs":40,
            "fontSize": "0.75em"
        }
    ];

    return result;

}

function getTemplateColumns(cols){

    var result = "";

    var amount = 100/cols;

    for(let i=0; i<cols; i++){

        result += " "+(amount)+"%";

    }

    return result;

}

function resizeEvent(event){

    var buffer = 20;
    var minSize = 330;
    var windowHeight = window.innerHeight - 50;
    var windowWidth = window.innerWidth;

    var smallerDimension = windowHeight <= windowWidth ? windowHeight : windowWidth;
    var scaleFactor = minSize < smallerDimension ? smallerDimension/(minSize+buffer) : 1;

    container.style.transform = "scale("+scaleFactor+")";

}

function toggleFlag(e){

    e.preventDefault();

    if(startFlag === false){

        setUpTimer();

    }

    var currID = Number(this.id);

    if(gridInfo2[currID]["flag"] == "none"){

        if(flagAmount > 0){

            gridInfo2[currID]["flag"] = "placed";
            document.getElementById(""+currID).innerText = "🚩";
            flagAmount--;
            flagsLeft.innerHTML = "🚩 x"+flagAmount;

        } else {

            alert("You have used up all your flags");

        }

    } else {

        gridInfo2[currID]["flag"] = "none";
        document.getElementById(""+currID).innerText = "";
        flagAmount++;
        flagsLeft.innerHTML = "🚩 x"+flagAmount;

    }

}

function revealTile(e){

    if(startFlag === false){

        setUpTimer();

    }

    var currID = this.id;

    if(gridInfo2[currID]["flag"] == "none"){

        if(gridInfo2[currID]["value"] == "0"){

            revealAdditionalTile(gridContents,Number(currID));

        } else {

            gridInfo2[currID]["status"] = "visible";
            document.getElementById(""+currID).style.opacity = "0";
            document.getElementById(""+currID).style.display = "none";

        }
        
        if(gridInfo2[currID]["value"] == "bomb"){

            for(let j=0; j<gridContents.length; j++){
                
                gridContents[j].removeEventListener("contextmenu",toggleFlag,false);
                gridContents[j].removeEventListener("click",revealTile,false);

            }

            gridNums[currID].innerText = "💥";
            revealAllBombs(gridContents,gridNums);
            buttonTransition(restartButton,"🙁");
            endGame("Lose");;

        } else if(checkHiddenTilesLeft(gridContents) == bombAmount){

            for(let j=0; j<gridContents.length; j++){
                
                gridContents[j].removeEventListener("contextmenu",toggleFlag,false);
                gridContents[j].removeEventListener("click",revealTile,false);

            }

            revealAllTiles(gridContents);
            buttonTransition(restartButton,"😎");
            flagAmount = 0;
            flagsLeft.innerHTML = "🚩 x"+flagAmount;
            endGame("Win");

        } else {

            buttonTransition(restartButton,"🙂");
    
        }
    

        this.removeEventListener("click",revealTile);

    } else {

        buttonTransition(restartButton,"🙂");

    }

}

function pressNumbers(event){

    var currID = Number(""+(this.id).substring(5,((this.id).length)));

    var selectedVal = gridInfo2[currID]["value"];

    if(selectedVal > 0 && selectedVal < 9){

        var flagCounter = 0;
        var nonFlagArr = [];

        for(let j=-1; j<2; j++){

            for(let k=-1; k<2; k++){
    
                if(k == 0 && j == 0){
    
                    continue;
    
                } else if(Math.floor((currID+k)/rowLength) != Math.floor(currID/rowLength)){
    
                    continue;
    
                } else if(Math.floor((currID+(j*colLength))/colLength) >= colLength || Math.floor((currID+(j*colLength))/colLength) < 0){
    
                    continue;
    
                } else if(gridInfo2[currID+(j*rowLength)+k]["flag"] == "placed"){
    
                    flagCounter++;
    
                } else if(gridInfo2[currID+(j*rowLength)+k]["status"] == "hidden"){

                    nonFlagArr.push(currID+(j*rowLength)+k);

                }
    
            }
    
        }

        if(flagCounter == this.innerHTML){

            for(let j=0; j<nonFlagArr.length; j++){

                revealAdditionalTile(gridContents,nonFlagArr[j]);

                if(gridInfo2[nonFlagArr[j]]["value"] == "bomb"){

                    for(let k=0; k<gridContents.length; k++){
                        
                        gridContents[k].removeEventListener("contextmenu",toggleFlag,false);
                        gridContents[k].removeEventListener("click",revealTile,false);
        
                    }

                    gridNums[nonFlagArr[j]].innerText = "💥";
                    revealAllBombs(gridContents,gridNums);
                    buttonTransition(restartButton,"🙁");
                    alert("You Lose");      
        
                } else if(checkHiddenTilesLeft(gridContents) == bombAmount){
        
                    for(let k=0; k<gridContents.length; k++){
                        
                        gridContents[k].removeEventListener("contextmenu",toggleFlag,false);
                        gridContents[k].removeEventListener("click",revealTile,false);
        
                    }
        
                    revealAllTiles(gridContents);
                    buttonTransition(restartButton,"😎");
                    flagAmount = 0;
                    flagsLeft.innerHTML = "🚩 x"+flagAmount;
                    endGame("Win");

        
                } else {

                    buttonTransition(restartButton,"🙂");
        
                }

            }

        } else {

            buttonTransition(restartButton,"🙂");

        }

    }

}

function buttonTransition(elem,emoji){

    elem.innerHTML = "😯";

    setTimeout(function(){

        elem.innerHTML = ""+emoji;

    },400);

}

function timer(start,end){

    var timeElapsed = Math.floor((end - start)/1000);

    var secs = timeElapsed%60;
    secs = secs < 10 ? "0"+secs : secs;
    var mins = Math.floor(timeElapsed/60);

    var result = mins+":"+secs;

    return result;

}

function toggleHelp(e){

    if(helpFlag === true){

        document.getElementById("helpContainer").style.display = "none";
        helpFlag = false;

    } else if (helpFlag === false){

        document.getElementById("helpContainer").style.display = "block";
        helpFlag = true;

    }

}

function endGame(msg){

    clearInterval(anInterval);
    statusContainer.addEventListener("click",closeStatusMsg,false);
    statusContainer.style.display = "flex";

    if(msg == "Win"){

        statusMsg[0].innerText = "🎉 You Win! 😎";

    } else if(msg == "Lose"){

        statusMsg[0].innerText = "💥 You Lose! 🙁";

    }

}

function closeStatusMsg(event){

    statusContainer.removeEventListener("click",closeStatusMsg,false);
    statusContainer.style.display = "none";

}