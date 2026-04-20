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
var pausedElapsed = 0;
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
    pausedElapsed = 0;
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

            elem[i].innerHTML = "&nbsp;";

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

            } else if(Math.floor((posn+(j*colLength))/colLength) >= colLength || Math.floor((posn+(j*colLength))/colLength) < 0){

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

    let result = Array.from({length: limit.length}, function(_, i){
        return{
            "#":i,
            "value":"",
            "status":"hidden",
            "flag":"none"
        };
    });

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
            endGame("Lose");

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
                    endGame("Lose");      
        
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

        if(startFlag){

            startTime = new Date(new Date() - pausedElapsed);
            anInterval = setInterval(function(){
                var endTime = new Date();
                timerDiv.innerHTML = "⌚ "+timer(startTime,endTime);
            }, 100)

        }

    } else if (helpFlag === false){

        document.getElementById("helpContainer").style.display = "block";
        helpFlag = true;

        if(startFlag){

            pausedElapsed = new Date() - startTime;
            clearInterval(anInterval);

        }

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