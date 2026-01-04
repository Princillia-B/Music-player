// Etape 1 : Lorsque qu’on clique sur lecture l’audio doit se lancer, lorsque l’on clique sur pause il doit être mis sur pause

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.src = "../resources/Play_fill.svg";
  } else {
    audio.pause();
    playBtn.src = "../resources/pause.svg";
  }
})



// Etape 2 : Lorsque l’audio est en cours, je dois voir à gauche la durée actuelle et à droite la durée totale (en minutes)

// La durée actuelle à gauche

// 1. Je récupère mon élémént HTML depuis le DOM 
const currentTime = document.querySelector(".current-time");

// 2. J'écris la fonction qui me permet de changer le format des minutes et secondes
function formatTime(seconds) {
  const durationMinutes = Math.floor(seconds / 60);
  const durationSeconds = Math.floor(seconds % 60);
  const paddedSecs = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds; // ici c'est un opérateur ternaire ( ?: = if/else)
  // donc ca singifie if durationSeconds <10 alors affiche 0+secondes (00), sinon affiche les secondes

  return `${durationMinutes}:${paddedSecs}`;
}

// 3. J'ajoute mon écouteur d'évènement pour mettre la durée à jour selon mon nouveau format
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);

  //Etape 3.2 (La progressionBar = (audio.currentTime  / audio.duration) * 100 pour le pourcentage -> je dois l'ajouter dans mon écouteur d'évènement timeupdate)
  const currentTimeDisplay = audio.currentTime;
  const durationDisplay = audio.duration;
  const progressionBar = (currentTimeDisplay / durationDisplay) * 100;

  // Je lie le cSS de la barre au JS
  barFill.style.width = `${progressionBar}%`; // Ne pas oublié le pourcentage
});


// La durée totale à droite

// 1. Je récupère mon éléménet HTML depuis le DOM 
const durationEl = document.querySelector(".time-duration");

// 1. Je crée la fonction qui me permettra d'afficher dans le Dom sans problème
function displayTotalDuration() {
  if (!isNaN(audio.duration)) {
    //Quand l'audio n'est pas chargée -> audio.duration === NaN (Not a number)
    // Donc en gros si audio.duration est différent de Nan (donc si c'est un nombre alors duration s'affiche sous le format formatTime )
    durationEl.textContent = formatTime(audio.duration);
  }
}
// 2. Je finis en ajoutant mon écouteur d'évènement pour mettre la durée total à jour selon mon nouveau format
audio.addEventListener("loadedmetadata", displayTotalDuration);
displayTotalDuration();


// Etape 3 : La durée actuelle doit se voir sur la barre de progression

// 1. Je récupère ma barre de progression pleine depuis le DOM
const barFill = document.querySelector(".bar-fill");

// 2. La progressionBar = (audio.currentTime  / audio.duration) * 100 pour le pourcentage -> je dois l'ajouter dans mon écouteru d'évènement timeupdate

// Etape 4 : la barre de progression doit être cliquable et permettre de déplacer l'audio
const bar = document.querySelector(".bar");


bar.addEventListener("click", (event) => {
  //Ensuite il faut que je connaisse l'endroit où à cliqué l'utilisateur par rapport à la taille de la barre (avec clientX, je sais où il a cliqué par rapport à la taille de l'écran)
  const barRect = bar.getBoundingClientRect(); // permet de connaitre la taille de barre
  const barPositionAfterClick = event.clientX - barRect.x; // je soustrait la position de l'endroit où le client à cliqué sur le navigateur - la taille de la barre sur sa positon horizontale
  const barProgressionAfterClick = (barPositionAfterClick / barRect.width) * 100; // Je récupère la valeur en %

  // La barre se remplit là où j'ai cliqué
  barFill.style.width = `${barProgressionAfterClick}%`;

  // Je dois avoir ma barre de progression en seconde (secondes = pourcentage * audio.duration)
  const barProgressionAfterClickInSecondes = (barProgressionAfterClick / 100) * audio.duration;

  audio.currentTime = barProgressionAfterClickInSecondes;
});


// Etape 5 : J’ai une liste de musiques (playlist) et je sais laquelle est en cours
const src = document.getElementById("audio");
const title = document.getElementById("song-title");
const artist = document.getElementById("artist-name");
const image = document.getElementById("song-cover-image");

const playlist = [
  {
    src: "../resources/lost-in-city-lights-145038.mp3",
    title: "Lost in the City Lights",
    artist: "Cosmo Sheldrake",
    image: "../resources/cover-1.jpg"
  },
  {
    src: "../resources/forest-lullaby-110624.mp3",
    title: "Forest Lullaby",
    artist: "Lesfm",
    image: "../resources/cover-2.jpg"
  }
]

// Lier mon index  + musique de la playlist au DOM
let currentMusicIndex = 0; // La musique à l'index 1

function loadMusic() {
  audio.src = playlist[currentMusicIndex].src;
  title.textContent = playlist[currentMusicIndex].title;
  artist.textContent = playlist[currentMusicIndex].artist;
  image.src = playlist[currentMusicIndex].image;
}
loadMusic();

// Etape 6 : Lorsque l’audio est terminé je dois aller à la musique suivante (donc le currentMusicIndex passe au suivant)
audio.addEventListener("ended", () => {
  currentMusicIndex++;
  if (currentMusicIndex >= playlist.length) {
    currentMusicIndex = 0;
  }
  loadMusic();
  audio.play();
})

// Etape 7 : Lorsque je clique sur précédent, je dois revenir à la musique 
const previousBtn = document.getElementById("previous-song");

previousBtn.addEventListener("click", () => {
  currentMusicIndex--;
  if (currentMusicIndex <= playlist.length) {
    currentMusicIndex = 0;
  }
  loadMusic();
  audio.play();
});

// Etape 8 : Quand je clique sur suivant, je charge la musique suivante
const nextBtn = document.getElementById("next-song");

nextBtn.addEventListener("click", () => {
  currentMusicIndex++;
  if (currentMusicIndex >= playlist.length) {
    currentMusicIndex = 0;
  }
  loadMusic();
  audio.play();
});
