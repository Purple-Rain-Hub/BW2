const urlAlbum = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const usedID = [];
const album = [];
const artistName = document.querySelectorAll(".artistName");
const songTitle = document.querySelectorAll(".songTitle");
const songImg = document.querySelectorAll(".songImg");
const songList = document.getElementById("songList");

let songAudio;
let isPlaying;
const playerImg = document.getElementById("playerImg");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const btnPlay = document.getElementById("btnPlay");
const btnPlay2 = document.getElementById("btnPlaypiccolo");
const playIcon2 = document.querySelector("#btnPlaypiccolo i"); 
const playIcon = document.querySelector("#btnPlay i");
const totalTime = document.getElementById("totalTime");
const currentTime = document.getElementById("currentTime");
let currentTimer = 0;
let timer;
let duration;
let progressTimer;
let percentage = 0;
const progressbar = document.querySelectorAll(".progress-bar");

document.addEventListener("load", init());

function init() {
    randomID();
}

function randomID() {
    for (let i = 0; i < 10; i++) {
        let randomNum = Math.floor(Math.random() * 80);
        let ID = 756200 + randomNum;
        if (usedID.includes(ID)) {
            console.log("id già usato");
            i--
        }
        else {
            usedID.push(ID);
        }
    }
    getAlbum(usedID)
}

async function getAlbum(usedID) {
    try {
        for (let i = 0; i < 10; i++) {
            const response = await fetch(urlAlbum + usedID[i])
            if (response.ok) {
                const data = await response.json();
                if (!data.hasOwnProperty("error")) {
                    album.push(data);
                }
                else {
                    usedID[i] += 1;
                    console.log("riprovando");
                    i--
                }
            }
        }
        console.log(album);
        printSong(album);
    } catch (error) {
        console.error(error);
    }
}

function printSong(album){
    console.log(album);
    for (let i=0 ; i< 10; i++){
        const randomSongCards = album[i].tracks.data[Math.floor(Math.random() * album[i].tracks.data.length)];
        songList.innerHTML += `<div class="d-flex songCards">
          <img src="${randomSongCards.album.cover}" style="width: 50px; height: 50px;" class="songImg">
          <div class="ms-2">
            <p class="h5 p-0 m-0 songTitle" >${randomSongCards.title}</p>
            <p class="text-gray artistName">${randomSongCards.artist.name}</p>
          </div>
        </div>`
    }
    const songCards = document.querySelectorAll(".songCards");
    for (let i = 0; i < 10; i++) {
        console.log(songCards[i]);
        
        songCards[i].addEventListener("click", function () {
            if (songAudio && !songAudio.paused) {
                songAudio.pause();
            }
            playerImg.setAttribute("src", `${songCards[i].querySelector("img").src}`)
            playerTitle.innerHTML = `${songCards[i].querySelector(".songTitle").innerText}`;
            playerArtist.innerHTML = `${songCards[i].querySelector(".artistName").innerText}`;
            songAudio = new Audio(randomSongCards.preview)
            songAudio.play();
            totalTime.innerHTML = `${durationTime(randomSongCards.duration)}`
            duration = randomSongCards.duration;
            currentTimer = 0;
            percentage = 0;
            clearInterval(timer);
            clearInterval(progressTimer);
            progressTimer = setInterval(function () {
                let progressPercentage = 25 / duration;
                progressbar[0].setAttribute("style", `width:${percentage += progressPercentage}%`)
                progressbar[1].setAttribute("style", `width:${percentage += progressPercentage}%`)
            }, 250)
            timer = setInterval(function () {
                if (currentTimer < randomSongCards.duration) {
                    currentTimer++;
                    currentTime.innerHTML = `${durationTime(currentTimer)}`
                }
                else clearInterval(timer);
            }, 1000);

            playIcon.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill")
            isPlaying = true;
        })
    }
}