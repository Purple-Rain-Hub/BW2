const urlAlbum = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const usedID = [];
const album = [];
const songTitle = document.querySelectorAll(".songTitle");
const artistName = document.querySelectorAll(".artistName");
const albumTitle = document.querySelectorAll(".albumTitle");
const songImg = document.querySelectorAll(".songImg")
const songImgH1 = document.querySelector(".songImgH1")
const songTitleH1 = document.querySelector(".songTitleH1");
const albumTitleH1 = document.querySelector(".albumTitleH1");
const artistNameH1 = document.querySelectorAll(".artistNameH1");
const albumName = document.querySelectorAll(".albumName")
const albumArtist = document.querySelectorAll(".albumArtist")
const albumImg = document.querySelectorAll(".albumImg")
const albumCards = document.querySelectorAll(".altro-cards")
const songCards = document.querySelectorAll(".songCards")
const audio = document.querySelectorAll(".audio");
let songAudio;
let isPlaying;
const playerImg = document.getElementById("playerImg");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const btnPlay = document.getElementById("btnPlay");
const playIcon = document.querySelector("#btnPlay i")

document.addEventListener("load", init());

function init() {
    randomID();
}

function randomID() {
    for (let i = 0; i < 13; i++) {
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
        for (let i = 0; i < 13; i++) {
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
        albumlink(album);
    } catch (error) {
        console.error(error);
    }
}

function printSong(album) {
    const randomSongH1 = album[0].tracks.data[Math.floor(Math.random() * album[0].tracks.data.length)];

    songImgH1.setAttribute("src", `${randomSongH1.album.cover}`);
    songTitleH1.innerHTML = `${randomSongH1.title}`;
    albumTitleH1.innerHTML = `${randomSongH1.album.title}`;
    artistNameH1.forEach(e => {
        e.innerHTML = `${randomSongH1.artist.name}`;
    });
    for (let i = 0; i < songCards.length; i++) {
        const randomSongCards = album[i + 1].tracks.data[Math.floor(Math.random() * album[i + 1].tracks.data.length)];
        songImg[i].setAttribute("src", `${randomSongCards.album.cover}`)
        songTitle[i].innerHTML = `${randomSongCards.title}`;
        artistName[i].innerHTML = `${randomSongCards.artist.name}`;
        songCards[i].addEventListener("click", function () {
            if (songAudio && !songAudio.paused) {
                songAudio.pause();
            }
            playerImg.setAttribute("src", `${randomSongCards.album.cover}`)
            playerTitle.innerHTML = `${randomSongCards.title}`;
            playerArtist.innerHTML = `${randomSongCards.artist.name}`;
            songAudio = new Audio(randomSongCards.preview)
            songAudio.play();
            playIcon.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill")
            isPlaying = true;
        })
    }
    for (let i = 0; i < albumCards.length; i++) {
        const randomAlbumCards = album[i + 7];
        albumImg[i].setAttribute("src", `${randomAlbumCards.cover}`)
        albumName[i].innerHTML = `${randomAlbumCards.title}`;
        albumArtist[i].innerHTML = `${randomAlbumCards.artist.name}`;
    }
}

function albumlink(album) {
    for (let i = 0; i < albumCards.length; i++) {
        albumCards[i].addEventListener("click", function (e) {
            e.preventDefault;
            sessionStorage.clear;
            sessionStorage.setItem("idAlbum", JSON.stringify(album[i + 7].id));
            location.href = "album.html";
        })
    }
}

btnPlay.addEventListener("click", function(e){
    e.preventDefault();
    if (isPlaying == true){
        songAudio.pause();
        playIcon.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill")
        isPlaying = false
    }
    else{
        songAudio.play()
        playIcon.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill")
        isPlaying = true
    }
})

