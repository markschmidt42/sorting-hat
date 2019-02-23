let $hat, $hatImg, $houseName, $houseImg, $instr;
let resetTimeout;

let isPlaying = false;
const houses = ["h", "s", "r", "g"];
const spotsPerHouse = 10;
let houseList = [];

let selectedOption = "";

const loadHouses = () => {
  for (x = 0; x < spotsPerHouse; x++) {
    houseList.push(...houses);
  }

  houseList = shuffle(houseList);
  //console.log(houseList)
};

const getRandomHouse = () => {
  houseList = shuffle(houseList);
  return houseList.pop();
};

const playRandomSound = () => {
  console.log("playRandomSound()");
  selectedOption = getRandomHouse();
  sound = selectedOption;
  path = "audio/" + sound + ".mp3";
  //console.log(path)
  playSound(path);
};

const runSort = () => {
  if (isPlaying) {
    return;
  }

  if (houseList.length == 0) {
    playSound("audio/sad.mp3");
    $instr.innerText = "I'm sorry, all of the houses are full!";
    return;
  }

  startSorting();
  console.log("annyang.abort();");
  if (useMic()) annyang.abort();

  console.log("playRandomSound timeout");
  setTimeout(playRandomSound, 1000);
};

const startSorting = () => {
  clearTimeout(resetTimeout);
  resetScene(true);
  document.body.className = "heard-it";
  isPlaying = true;
};

const startAnimation = () => {
  document.body.className = "animating";
  $hatImg.src = "images/animated.gif";
};

const doneSorting = () => {
  console.log("annyang.resume();");
  if (useMic()) annyang.resume();
  isPlaying = false;
  $hatImg.src = "images/still.png";
  setScene();
  resetTimeout = setTimeout(resetScene, 10000);
};

const setScene = () => {
  $houseImg.className = "fadein";
  document.body.className = "selected-house";
  
  document.body.style.backgroundImage =
    "url('images/bg-" + selectedOption + ".jpg')";
  $houseImg.src = "images/" + selectedOption + ".jpg";
  $houseName.className = null;
};

const resetScene = hideInstructions => {
  document.body.className = null;
  document.body.style.backgroundImage = null;
  $houseName.className = "reset";
};

let mainAudio = null;
const playSound = path => {
  mainAudio = document.getElementById("audio");
  mainAudio.addEventListener("canplaythrough", loadedMainAudio, false);
  mainAudio.src = path;
  //mainAudio = new Audio(path);
  if (!path.includes("sad")) {
    mainAudio.onended = doneSorting;
  }
};



const loadedMainAudio = () => {
  startAnimation();
  // mainAudio.play();
  const playPromise = mainAudio.play();
  if (playPromise !== null){
      playPromise.catch(() => { mainAudio.play(); })
  }  
};

const shuffle = array => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

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
};

const useMic = () => {
  return !location.protocol.includes("file");
};

const onLoad = () => {
  $hat = document.getElementById("hat");
  $hatImg = document.getElementById("hat-img");
  $houseName = document.getElementById("house-name");
  $houseImg = document.getElementById("house-img");
  $instr = document.getElementById("instructions");

  loadHouses();

  window.onkeydown = event => {
    if (event.code == "Enter" || event.code == "Space") {
      runSort();
    }
  };

  $hat.onclick = runSort;

  // https://github.com/TalAter/annyang/tree/master/docs#abort
  if (useMic() && annyang) {
    // Let's define our first command. First the text we expect, and then the function it should call
    var commands = {
      "please sort me": runSort,
      "please sort her": runSort,
      "please sort him": runSort,
      "sort me please": runSort,
      "sort me": runSort,
      "sorting hat, plesae sort me": runSort
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    console.log("annyang.start();");
    annyang.start();
  }

  function audioFullyLoaded() {
    console.log('audioFullyLoaded')
  }

  function preloadAudio(url) {
    var audio = new Audio();
    audio.addEventListener('canplaythrough', loadedAudio, false);
    audio.src = url;
  }

  var loaded = 0;
  function loadedAudio() {
      // this will be called every time an audio file is loaded
      // we keep track of the loaded files vs the requested files
      loaded++;
      console.log(loaded)
      if (loaded == audioFiles.length){
        // all have loaded
        audioFullyLoaded();
      }
  }

  var images = new Array();
  function preload() {
    for (i = 0; i < preload.arguments.length; i++) {
      images[i] = new Image();
      images[i].src = preload.arguments[i];
    }
  }
  audioFiles = []
  houses.forEach(house => {
    audioFiles.push("audio/" + house + ".mp3");
    preload("images/" + house + ".jpg", "images/bg-" + house + ".jpg");
  });
  preload("images/main-bg-heard-it.jpg");
  preload("images/animated.gif");

  // we start preloading all the audio files
  for (var i in audioFiles) {
    preloadAudio(audioFiles[i]);
  }
};

window.onload = onLoad;
