var playlist = [

    { url: "media/dog.mp4", name: "dog.mp4" },
    { url: "media/rio.mp4", name: "rio.mp4" },
    { url: "media/cinematic.mp4", name: "cinematic.mp4" },
    { url: "media/green_samo.mp4", name: "samo.mp4" }
];
var currentIndex = 0;
var video = document.getElementById("myVideo");
var volumeControl = document.getElementById("volumeControl");




// Funcții pentru stocarea și încărcarea setărilor de volum
function saveVolume() {
    localStorage.setItem('volume', video.volume);
}

function loadVolume() {
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume !== null) {
        const numericVolume = parseFloat(savedVolume);
        video.volume = numericVolume;
        volumeControl.value = numericVolume;
    }
}

// Funcții pentru stocarea și încărcarea poziției curente în playlist
function saveCurrentIndex() {
    localStorage.setItem('currentIndex', currentIndex.toString());
}

function loadCurrentIndex() {
    const savedIndex = localStorage.getItem('currentIndex');
    if (savedIndex !== null) {
        const numericIndex = parseInt(savedIndex, 10);
        if (numericIndex >= 0 && numericIndex < playlist.length) {
            playVideoAtIndex(numericIndex);
        }
    }
}

// Adăugăm event listener pentru schimbarea volumului și salvăm volumul
volumeControl.addEventListener("input", function() { 
    video.volume = this.value;
    saveVolume();
});

// Adăugăm event listener pentru a salva setările la închiderea ferestrei sau actualizarea paginii
window.addEventListener('beforeunload', function() {
    saveVolume();
    saveCurrentIndex();
});





///efecte video
var video = document.getElementById('myVideo');
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var effectSelector = document.getElementById('effectSelector');

// initial facem canvasul invizbil
canvas.style.display = 'none';

// event listener pentru selectorul de efecte
effectSelector.addEventListener('change', function () {
    // verifică dacă efectul este 'none'
    if (this.value === 'none') {
        canvas.style.display = 'none';
    } else {
        // afișează canvas-ul și începe aplicarea efectului
        canvas.style.display = 'block';
        draw(); //apelam draw ca sa facem efectul
    }
});

function draw() {
    if (canvas.style.display === 'none') return; //daca canvasul nu e vizibil nu desenam nimic

    // setam dimensiunile canvas-ului la cele ale videoclipului
    canvas.width =  video.clientWidth/3;
    canvas.height = video.clientHeight/3;

    // Desenam videoclipul pe canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    //luam datele si aplicam efectul selectat
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    applyEffect(imageData, effectSelector.value);

    //punem datele imaginii modificate
    context.putImageData(imageData, 0, 0);

    // reîncearcă efectul
    requestAnimationFrame(draw);
}

function applyEffect(imageData, effect) {
    // se aplica efectul selectat
    if (effect === 'grayscale') {
        for (let i = 0; i < imageData.data.length; i += 4) {
            let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] = avg; // red
            imageData.data[i + 1] = avg; // green
            imageData.data[i + 2] = avg; // blue
        }
    }

    if (effect === 'sepia') {
        for (let i = 0; i < imageData.data.length; i += 4) {
            let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i+3] = avg; 
            imageData.data[i + 4] = avg; 
            imageData.data[i + 4] = avg; 
        }
    }
    
}


draw();









//subtitrari pentru video rio.mp4
// avem nevoie de referința la videoclipul "rio.mp4" și elementul video pentru subtitrări
const rioVideo = document.getElementById("myVideo");
const subtitleTrack = rioVideo.textTracks[0];

//functia de conversie pt json
function convertTimeToSeconds(timeStr) {
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
}

function clearSubtitles() {
    while (subtitleTrack.cues && subtitleTrack.cues.length > 0) {
        subtitleTrack.removeCue(subtitleTrack.cues[0]);
    }
}

function loadSubtitles() {
    // verificam dacă sursa videoclipului este "rio.mp4"
    const videoSrcFileName = rioVideo.src.split('/').pop();
    if (rioVideo.src.includes("rio.mp4")) {
        clearSubtitles(); // Curățați subtitrările existente

        fetch('media/subtitle.json')
            .then(response => response.json())
            .then(subtitles => {
                subtitles.forEach(subtitle => {
                    const startSeconds = convertTimeToSeconds(subtitle.start);
                    const endSeconds = convertTimeToSeconds(subtitle.end);
                    subtitleTrack.addCue(new VTTCue(startSeconds, endSeconds, subtitle.text));
                });
            })
            .catch(error => console.error('Error loading subtitles:', error));
    }
}

// trebuie sa ne asiguram ca sursa videoclipului este "rio.mp4" și când este încărcat
rioVideo.addEventListener('loadeddata', () => {
    loadSubtitles(); // apelam doar aici când sursa videoclipului este "rio.mp4"
});





video.volume = volumeControl.value;

video.addEventListener('ended', playNextVideo);
volumeControl.addEventListener("input", function() { video.volume = this.value; });

function playVideoAtIndex(index) {
    if (index >= 0 && index < playlist.length) {
        currentIndex = index;
        const newVideoSrc = playlist[currentIndex].url;
        video.src = newVideoSrc; // actualizam sursa videoclipului
        video.load(); // Important pentru a reîncărca videoclipul și track-urile asociate

        // Mutăm încărcarea subtitrărilor aici
        if (newVideoSrc.includes("rio.mp4")) {
            loadSubtitles();
        } else {
            clearSubtitles(); // Ștergem subtitrările pentru alte videoclipuri
        }

        // adaugam un listener pentru evenimentul 'loadeddata' care va reda videoclipul
        video.addEventListener('loadeddata', function autoPlay() {
            video.play();
            video.removeEventListener('loadeddata', autoPlay);
        });

    }
}




function playNextVideo() {
    currentIndex = (currentIndex + 1) % playlist.length;
    playVideoAtIndex(currentIndex);
}

function playPreviousVideo() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playVideoAtIndex(currentIndex);
}

function togglePlayPause() {
    if (video.paused) video.play();
    else video.pause();
}

function handleFileInput(event) {
    var files = event.target.files;
    var wasPlaying = !video.paused; 
    for (var i = 0; i < files.length; i++) {
        var fileURL = URL.createObjectURL(files[i]);
        var fileName = files[i].name;
        
        // aici am facut o verificare daca fiecare fișier din playlist exista
        var fileExists = playlist.some(function(item) {
            return item.name === fileName;
        });
        
        if (!fileExists) {
            playlist.push({ url: fileURL, name: fileName });
        }
    }
    updatePlaylistUI();
    if (playlist.length === 1) playVideoAtIndex(0);
    if (wasPlaying && playlist.length > 0) {
        playVideoAtIndex(currentIndex); // redăm videoclipul curent dacă se reda anterior
    } 
}



function updatePlaylistUI() {
    var playlistElement = document.getElementById("playlist");
    playlistElement.innerHTML = '';

    playlist.forEach(function(video, index) {
        var listItem = document.createElement("li");
        listItem.classList.add('playlist-item');
        listItem.setAttribute('draggable', true);

        listItem.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData("text/plain", index);
        });

        listItem.addEventListener('dragover', function(event) {
            event.preventDefault();
        });

        listItem.addEventListener('drop', drop);

        var titleDiv = document.createElement("div");
        titleDiv.textContent = video.name;
        titleDiv.style.flexGrow = "1";
        titleDiv.style.cursor = "pointer"; 
        titleDiv.addEventListener('click', function() {
            playVideoAtIndex(index);
        });

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation(); 
            if (index === currentIndex) {
                // se trce la urm video dacă videoclipul curent este șters
                playNextVideo();
            } else if (index < currentIndex) {
                // ajustam currentIndex dacă un video anterior celui curent este șters
                currentIndex--;
            }
            playlist.splice(index, 1);
            updatePlaylistUI();
        });

        listItem.appendChild(titleDiv);
        listItem.appendChild(deleteButton);
        playlistElement.appendChild(listItem);
    });
}


function allowDrop(event) { event.preventDefault(); }

function drop(event) {
    event.preventDefault();
    var fromIndex = parseInt(event.dataTransfer.getData("text/plain"));
    var toIndex = [...event.currentTarget.children].indexOf(event.target.closest('li'));

    if (fromIndex !== toIndex && toIndex !== -1) {
        var item = playlist.splice(fromIndex, 1)[0];
        playlist.splice(toIndex, 0, item);
        updatePlaylistUI();

        // daca video ul curent este mutat, actualizați currentIndex
        if (currentIndex === fromIndex) {
            currentIndex = toIndex;
        } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
            currentIndex--;
        } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
            currentIndex++;
        }
    }
}



document.getElementById("fileInput").addEventListener("change", handleFileInput);
document.getElementById("playlist").addEventListener("dragover", allowDrop);
document.getElementById("playlist").addEventListener("drop", drop);


window.onload = updatePlaylistUI;

// Folosim event listener pentru încărcarea paginii pentru a încărca setările și funcționalitățile
window.addEventListener('load', function() {
    loadVolume();
    loadCurrentIndex();
    updatePlaylistUI();

    if (localStorage.getItem('volume') !== null) {
        loadVolume();
    }
    if (localStorage.getItem('currentIndex') !== null) {
        loadCurrentIndex();
    }
});

