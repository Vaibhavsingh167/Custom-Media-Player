/* ============================================================
   Custom Media Player — Spotify Clone
   Vanilla JavaScript, no frameworks
   ============================================================ */

// --- Song Data ---
const songs = [
    {
        title: "Summer Walk",
        artist: "Olexy",
        src: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_3d1eb351ec.mp3?filename=summer-walk-152722.mp3",
        cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop"
    },
    {
        title: "Lofi Study",
        artist: "FASSounds",
        src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf7f5.mp3?filename=lofi-study-112191.mp3",
        cover: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&h=500&fit=crop"
    },
    {
        title: "Good Night",
        artist: "FASSounds",
        src: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_67b36fccb0.mp3?filename=good-night-109988.mp3",
        cover: "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?w=500&h=500&fit=crop"
    }
];

// --- DOM References ---
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");

const coverArt = document.getElementById("cover-art");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");

const smallCover = document.getElementById("small-cover");
const smallTitle = document.getElementById("small-title");
const smallArtist = document.getElementById("small-artist");

const progressTrack = document.getElementById("progress-track");
const progressFill = document.getElementById("progress-fill");
const progressThumb = document.getElementById("progress-thumb");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const volumeTrack = document.getElementById("volume-track");
const volumeFill = document.getElementById("volume-fill");
const volumeThumb = document.getElementById("volume-thumb");
const volumeBtn = document.getElementById("volume-btn");
const volumeIcon = document.getElementById("volume-icon");

// --- State ---
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 = off, 1 = all, 2 = one
let animFrameId = null;
let isDraggingProgress = false;
let isDraggingVolume = false;
let previousVolume = 1;

// --- Initialize ---
function init() {
    loadTrack(currentIndex);
    audio.volume = 1;
    updateVolumeUI(1);
}

// --- Load Track ---
function loadTrack(index) {
    const song = songs[index];
    audio.src = song.src;
    coverArt.src = song.cover;
    trackTitle.textContent = song.title;
    trackArtist.textContent = song.artist;
    smallCover.src = song.cover;
    smallTitle.textContent = song.title;
    smallArtist.textContent = song.artist;
    progressFill.style.width = "0%";
    progressThumb.style.left = "0%";
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
}

// --- Play / Pause ---
function togglePlay() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function play() {
    audio.play();
    isPlaying = true;
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");
    playBtn.setAttribute("aria-label", "Pause");
    playBtn.setAttribute("title", "Pause");
    startProgressLoop();
}

function pause() {
    audio.pause();
    isPlaying = false;
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
    playBtn.setAttribute("aria-label", "Play");
    playBtn.setAttribute("title", "Play");
    stopProgressLoop();
}

// --- Next / Previous ---
function nextTrack() {
    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentIndex && songs.length > 1);
        currentIndex = newIndex;
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }
    loadTrack(currentIndex);
    if (isPlaying) play();
}

function prevTrack() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentIndex && songs.length > 1);
        currentIndex = newIndex;
    } else {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
    loadTrack(currentIndex);
    if (isPlaying) play();
}

// --- Shuffle ---
function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
}

// --- Repeat ---
function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    const icon = repeatBtn.querySelector("i");
    repeatBtn.classList.toggle("active", repeatMode > 0);
    if (repeatMode === 2) {
        icon.classList.remove("fa-repeat");
        icon.classList.add("fa-repeat");
        repeatBtn.innerHTML = '<i class="fas fa-repeat"></i><span style="position:absolute;font-size:0.5rem;font-weight:700;">1</span>';
        repeatBtn.style.position = "relative";
    } else {
        repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
        repeatBtn.style.position = "";
    }
}

// --- Track End ---
function handleTrackEnd() {
    if (repeatMode === 2) {
        audio.currentTime = 0;
        play();
    } else if (repeatMode === 1) {
        nextTrack();
    } else {
        if (currentIndex < songs.length - 1) {
            nextTrack();
        } else {
            pause();
            currentIndex = 0;
            loadTrack(currentIndex);
        }
    }
}

// --- Progress Bar (requestAnimationFrame) ---
function startProgressLoop() {
    function update() {
        if (!isDraggingProgress && audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = pct + "%";
            progressThumb.style.left = pct + "%";
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
        animFrameId = requestAnimationFrame(update);
    }
    cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(update);
}

function stopProgressLoop() {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
}

// --- Time Formatting (MM:SS) ---
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

// --- Duration Display ---
function handleMetadataLoaded() {
    durationEl.textContent = formatTime(audio.duration);
}

// --- Progress Seeking (Click + Drag) ---
function seekFromEvent(e) {
    const rect = progressTrack.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = x / rect.width;
    progressFill.style.width = (pct * 100) + "%";
    progressThumb.style.left = (pct * 100) + "%";
    currentTimeEl.textContent = formatTime(pct * audio.duration);
    return pct;
}

function onProgressMouseDown(e) {
    isDraggingProgress = true;
    progressTrack.classList.add("dragging");
    const pct = seekFromEvent(e);
    audio.currentTime = pct * audio.duration;

    function onMouseMove(e) {
        seekFromEvent(e);
    }

    function onMouseUp(e) {
        const pct = seekFromEvent(e);
        audio.currentTime = pct * audio.duration;
        isDraggingProgress = false;
        progressTrack.classList.remove("dragging");
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

// --- Volume Control (Click + Drag) ---
function setVolumeFromEvent(e) {
    const rect = volumeTrack.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = x / rect.width;
    audio.volume = pct;
    updateVolumeUI(pct);
    return pct;
}

function updateVolumeUI(pct) {
    volumeFill.style.width = (pct * 100) + "%";
    volumeThumb.style.left = (pct * 100) + "%";
    if (pct === 0) {
        volumeIcon.className = "fas fa-volume-xmark";
    } else if (pct < 0.5) {
        volumeIcon.className = "fas fa-volume-low";
    } else {
        volumeIcon.className = "fas fa-volume-high";
    }
}

function onVolumeMouseDown(e) {
    isDraggingVolume = true;
    volumeTrack.classList.add("dragging");
    setVolumeFromEvent(e);

    function onMouseMove(e) {
        setVolumeFromEvent(e);
    }

    function onMouseUp(e) {
        setVolumeFromEvent(e);
        isDraggingVolume = false;
        volumeTrack.classList.remove("dragging");
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

// --- Mute Toggle ---
function toggleMute() {
    if (audio.volume > 0) {
        previousVolume = audio.volume;
        audio.volume = 0;
        updateVolumeUI(0);
    } else {
        audio.volume = previousVolume;
        updateVolumeUI(previousVolume);
    }
}

// --- Keyboard Shortcuts ---
function handleKeyDown(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    switch (e.code) {
        case "Space":
            e.preventDefault();
            togglePlay();
            break;
        case "ArrowRight":
            e.preventDefault();
            audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
            break;
        case "ArrowLeft":
            e.preventDefault();
            audio.currentTime = Math.max(audio.currentTime - 5, 0);
            break;
        case "ArrowUp":
            e.preventDefault();
            audio.volume = Math.min(audio.volume + 0.05, 1);
            updateVolumeUI(audio.volume);
            break;
        case "ArrowDown":
            e.preventDefault();
            audio.volume = Math.max(audio.volume - 0.05, 0);
            updateVolumeUI(audio.volume);
            break;
        case "KeyM":
            toggleMute();
            break;
        case "KeyN":
            nextTrack();
            break;
        case "KeyP":
            prevTrack();
            break;
    }
}

// --- Event Listeners ---
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
shuffleBtn.addEventListener("click", toggleShuffle);
repeatBtn.addEventListener("click", toggleRepeat);
audio.addEventListener("ended", handleTrackEnd);
audio.addEventListener("loadedmetadata", handleMetadataLoaded);
progressTrack.addEventListener("mousedown", onProgressMouseDown);
volumeTrack.addEventListener("mousedown", onVolumeMouseDown);
volumeBtn.addEventListener("click", toggleMute);
document.addEventListener("keydown", handleKeyDown);

// --- Touch Support for Progress & Volume ---
function getTouchX(e) {
    return e.touches[0].clientX;
}

progressTrack.addEventListener("touchstart", function (e) {
    e.preventDefault();
    isDraggingProgress = true;
    progressTrack.classList.add("dragging");
    const touch = { clientX: getTouchX(e) };
    const pct = seekFromEvent(touch);
    audio.currentTime = pct * audio.duration;

    function onTouchMove(e) {
        seekFromEvent({ clientX: getTouchX(e) });
    }

    function onTouchEnd(e) {
        const finalX = e.changedTouches[0].clientX;
        const pct = seekFromEvent({ clientX: finalX });
        audio.currentTime = pct * audio.duration;
        isDraggingProgress = false;
        progressTrack.classList.remove("dragging");
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
    }

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
}, { passive: false });

volumeTrack.addEventListener("touchstart", function (e) {
    e.preventDefault();
    isDraggingVolume = true;
    volumeTrack.classList.add("dragging");
    setVolumeFromEvent({ clientX: getTouchX(e) });

    function onTouchMove(e) {
        setVolumeFromEvent({ clientX: getTouchX(e) });
    }

    function onTouchEnd(e) {
        setVolumeFromEvent({ clientX: e.changedTouches[0].clientX });
        isDraggingVolume = false;
        volumeTrack.classList.remove("dragging");
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
    }

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
}, { passive: false });

// --- Boot ---
init();
