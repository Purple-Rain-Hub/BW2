let stringId;
let id;
const urlAlbum = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const albumImg = document.getElementById("albumImgH1")
const albumName = document.getElementById("albumText");
const artistName = document.getElementById("artistName");
const releaseYear = document.getElementById("releaseYear");
const tracksNum = document.getElementById("tracksNum");
const minutaggio = document.getElementById("minutaggio");
const ulSongs = document.getElementById("ulSongs");
const randomAlbumName = document.querySelectorAll(".albumName")
const albumArtist = document.querySelectorAll(".albumArtist")
const randomAlbumImg = document.querySelectorAll(".albumImg")
const albumCards = document.querySelectorAll(".albumCards")
let usedID;
let album;

document.addEventListener("load", init());

function init() {
    stringId = sessionStorage.getItem("idAlbum");
    id = JSON.parse(stringId);
    usedID = [];
    album = [];
    getAlbum();
    randomID();
}

async function getAlbum() {
    try {
        const response = await fetch(urlAlbum + id);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            printAlbum(data);
        }
        else console.error("errore: " + error);
    } catch (error) {
        console.error("errore: " + error);
    }
}

function printAlbum(data) {
    // stampa per nome album ecc.
    console.log("qui sotto info buone");
    console.log(albumImg);
    console.log(data.cover);
    
    
    albumImg.setAttribute("src", `${data.cover}`);
    albumName.innerHTML = `${data.title}`;
    artistName.innerHTML = `di ${data.artist.name}`;
    releaseYear.innerHTML = `${data.release_date}`;
    tracksNum.innerHTML = `${data.nb_tracks} brani`;
    minutaggio.innerHTML = `${durationTime(data.duration)}`;
    // stampa canzoni
    for (let i = 0; i < data.tracks.data.length; i++) {
        ulSongs.innerHTML += `<li class="col-1 text-end">${i + 1}</li>
                <li class="col-4">${data.tracks.data[i].title}</li>
                <li class="col-4">${data.tracks.data[i].rank}</li>
                <li class="col-3 text-end pe-5">${durationTime(data.tracks.data[i].duration)}</li>`;
    }
}

function randomID() {
    for (let i = 0; i < 8; i++) {
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
    getRandomAlbum(usedID)
}

async function getRandomAlbum(usedID) {
    try {
        for (let i = 0; i < 8; i++) {
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
            albumlink(album)
        }
        console.log(album);
        printRandomAlbum(album);
    } catch (error) {
        console.error(error);
    }
}

function printRandomAlbum(album) {
    for (let i = 0; i < 8; i++) {
        const randomAlbumCards = album[i];
        console.log(randomAlbumCards);
        randomAlbumImg[i].setAttribute("src", `${randomAlbumCards.cover}`)
        randomAlbumName[i].innerHTML = `${randomAlbumCards.title}`;
        albumArtist[i].innerHTML = `${randomAlbumCards.artist.name}`;
    }
}

function albumlink(album) {
    for (let i = 0; i < albumCards.length; i++) {
        albumCards[i].addEventListener("click", function (e) {
            e.preventDefault;
            ulSongs.innerHTML = "";
            sessionStorage.clear;
            sessionStorage.setItem("idAlbum", JSON.stringify(album[i].id));
            window.location.reload();
        })
    }
}

function durationTime(time) {
    let sec = parseInt(time, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}