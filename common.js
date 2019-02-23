let $hat, $hatImg, $houseName, $houseImg, $instr;
let resetTimeout;

let isPlaying = false;
const houses = ['h', 's', 'r', 'g'];
const spotsPerHouse = 10;
let houseList = [];

let selectedOption = ''

const loadHouses = () => {
    for( x = 0; x < spotsPerHouse; x++) {
        houseList.push(...houses);
    }

    houseList = shuffle(houseList);
    //console.log(houseList)
}

const getRandomHouse = () => {
    houseList = shuffle(houseList);
    return houseList.pop();
}


const playRandomSound = () => {
    selectedOption = getRandomHouse();
    sound = selectedOption;
    path = 'audio/'+ sound +'.mp3';
    //console.log(path)
    playSound(path);
}

const runSort = () => {
    if (isPlaying) {
        return;
    }
    if (houseList.length == 0) {
        playSound('audio/sad.mp3');
        $instr.innerText = "I'm sorry, all of the houses are full!";
        return;
    }
    playRandomSound();
}

const startSorting = () => {
    annyang.abort();
    clearTimeout(resetTimeout);
    resetScene();
    $instr.style.display = "none";
    isPlaying = true;
    $hatImg.src = 'images/animated.gif'
}

const doneSorting = () => {
    annyang.resume();
    isPlaying = false;
    $hatImg.src = 'images/still.png'
    setScene();
    resetTimeout = setTimeout(resetScene, 10000);
}

const setScene = () => {
    document.body.style.backgroundImage = "url('images/bg-"+ selectedOption +".jpg')";
    $houseImg.src = "images/"+ selectedOption +".jpg";
    $houseName.className = null;    
}

const resetScene = () => {
    document.body.style.backgroundImage = null;
    $houseName.className = 'reset';
    $instr.style.display = "block";
}

const playSound = (path) => {
    var audio = new Audio(path);
    if (!path.includes('sad')) {
        audio.onended = doneSorting;

        startSorting()
        isPlaying = true;
    }
    audio.play();
}

const shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
  
const onLoad = () => {
    $hat = document.getElementById('hat');
    $hatImg = document.getElementById('hat-img');
    $houseName = document.getElementById('house-name');
    $houseImg = document.getElementById('house-img');
    $instr = document.getElementById('instructions');

    loadHouses();

    window.onkeydown = (event) => {
        if (event.code == "Enter" || event.code == "Space") {
            runSort();
        }
    }

    $hat.onclick = runSort;

    if (annyang) {
        // Let's define our first command. First the text we expect, and then the function it should call
        var commands = {
          'please sort me': runSort
        };
      
        // Add our commands to annyang
        annyang.addCommands(commands);
      
        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
      }
}

window.onload = onLoad;