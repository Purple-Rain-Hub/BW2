const urlAlbum = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const usedID = [];
const album = [];
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
const searchbar = document.getElementById("searchbar");
const form = document.getElementById("form");
const volumeBar = document.querySelector(".volume-bar");

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

function printSong(album) {
    console.log(album);
    for (let i = 0; i < 10; i++) {
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
        const randomSongCards = album[i].tracks.data[Math.floor(Math.random() * album[i].tracks.data.length)];
        songCards[i].addEventListener("click", function () {
            if (songAudio && !songAudio.paused) {
                songAudio.pause();
            }
            playerImg.setAttribute("src", `${randomSongCards.album.cover}`)
            playerTitle.innerHTML = `${randomSongCards.title}`;
            playerArtist.innerHTML = `${randomSongCards.artist.name}`;
            songAudio = new Audio(randomSongCards.preview)
            songAudio.play();
            songAudio.volume = volumeBar.value;
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

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchValue = searchbar.value;
    getSearch(searchValue);
})

async function getSearch(searchValue) {
    try {
        const response = await fetch("https://striveschool-api.herokuapp.com/api/deezer/search?q=" + searchValue)
        if (response.ok) {
            const data = await response.json();
            printSearch(data.data);
        }
        else console.log(error);
    } catch (error) {
        console.error(error);
    }
}

function printSearch(data) {
    const artistName = document.querySelectorAll(".artistName");
    const songTitle = document.querySelectorAll(".songTitle");
    const songImg = document.querySelectorAll(".songImg");
    const songCards = document.querySelectorAll(".songCards");
    for (let i = 0; i < 10; i++) {
        artistName[i].innerHTML = data[i].artist.name;
        songTitle[i].innerHTML = data[i].title;
        songImg[i].src = data[i].album.cover

        songCards[i].addEventListener("click", function () {
            if (songAudio && !songAudio.paused) {
                songAudio.pause();
            }
            playerImg.setAttribute("src", `${data[i].album.cover}`)
            playerTitle.innerHTML = `${data[i].title}`;
            playerArtist.innerHTML = `${data[i].artist.name}`;
            songAudio = new Audio(data[i].preview)
            songAudio.play();
            songAudio.volume = volumeBar.value;
            totalTime.innerHTML = `${durationTime(data[i].duration)}`
            duration = data[i].duration;
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
                if (currentTimer < data[i].duration) {
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

btnPlay.addEventListener("click", function (e) {
    e.preventDefault();
    if (isPlaying == false) {
        songAudio.play()
        playIcon.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill")
        timer = setInterval(function () {
            if (currentTimer < duration) {
                currentTimer++;
                currentTime.innerHTML = `${durationTime(currentTimer)}`
            }
            else clearInterval(timer);
        }, 1000);
        progressTimer = setInterval(function () {
            let progressPercentage = 100 / duration;
            progressbar[0].setAttribute("style", `width:${percentage += progressPercentage}%`)
            progressbar[1].setAttribute("style", `width:${percentage += progressPercentage}%`)
        }, 1000)
        isPlaying = true;
    }
    else {
        songAudio.pause();
        playIcon.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill")
        clearInterval(timer);
        clearInterval(progressTimer);
        isPlaying = false;
    }
})

btnPlay2.addEventListener("click", function (e) {
    e.preventDefault();
    if (isPlaying == false) {
        songAudio.play()
        playIcon2.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill")
        timer = setInterval(function () {
            if (currentTimer < duration) {
                currentTimer++;
                currentTime.innerHTML = `${durationTime(currentTimer)}`
            }
            else clearInterval(timer);
        }, 1000);
        progressTimer = setInterval(function () {
            let progressPercentage = 100 / duration;
            progressbar[0].setAttribute("style", `width:${percentage += progressPercentage}%`)
            progressbar[1].setAttribute("style", `width:${percentage += progressPercentage}%`)
        }, 1000)
        isPlaying = true;
    }
    else {
        songAudio.pause();
        playIcon2.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill")
        clearInterval(timer);
        clearInterval(progressTimer);
        isPlaying = false;
    }
})

function durationTime(time) {
    let sec = parseInt(time, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

volumeBar.addEventListener("input", function () {
    if (songAudio) {
        songAudio.volume = volumeBar.value;
    }
});