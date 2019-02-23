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
    document.body.className = null;
    console.log('playRandomSound()')
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

    document.body.className = 'heard-it';
    console.log('annyang.abort();')
    annyang.abort();

    console.log('playRandomSound timeout')
    setTimeout(playRandomSound, 1000);
}

const startSorting = () => {
    clearTimeout(resetTimeout);
    resetScene();
    $instr.style.display = "none";
    isPlaying = true;
    $hatImg.src = 'images/animated.gif'
}

const doneSorting = () => {
    console.log('annyang.resume();')
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

let mainAudio = null;
const playSound = (path) => {
    mainAudio = new Audio(path);
    if (!path.includes('sad')) {
        mainAudio.onended = doneSorting;
        mainAudio.addEventListener('canplaythrough', loadedAudio, false);

        startSorting()
        isPlaying = true;
    }
}

const loadedAudio = () => {
    mainAudio.play();
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

    // https://github.com/TalAter/annyang/tree/master/docs#abort
    if (annyang) {
        // Let's define our first command. First the text we expect, and then the function it should call
        var commands = {
            'please sort me': runSort
            ,'sort me': runSort
            ,'sorting hat, plesae sort me': runSort
        };
      
        // Add our commands to annyang
        annyang.addCommands(commands);
      
        // Start listening. You can call this here, or attach this call to an event, button, etc.
        console.log('annyang.start();')
        annyang.start();
      }

    function preloadAudio(url) {
        var audio = new Audio();
        audio.src = url;
    }
        
    var images = new Array()
    function preload() {
        for (i = 0; i < preload.arguments.length; i++) {
            images[i] = new Image()
            images[i].src = preload.arguments[i]
        }
    }
    preload('images/animated.gif');
    houses.forEach((house) => {
        preloadAudio("audio/"+ house +".mp3");
        preload(
            "images/"+ house +".jpg",
            "images/bg-"+ house +".jpg"
        )
    });
}

window.onload = onLoad;