document.addEventListener('DOMContentLoaded', () => {
    const playlists = document.querySelector('.playlist'); // Playlist container
    const scrollUp = document.getElementById('scrollUp');
    const scrollDown = document.getElementById('scrollDown');
    const introDiv = document.querySelector('.intro-div');
    const content = document.querySelector('.content');
    const supriseBtn = document.getElementById('surpriseButton');
    const backBtn = document.querySelector('#backBtn');
    
    let currentsong = null;
    let isPlaying;
    // Initialize a variable to keep track of whether the song is "loved"
    let isLoved = false;

    const images = [ 'logo.jpg','img1.jpg', 'img2.jpg', 'img2.jpg', 'img2.jpg','img2.jpg'];

    const songs = [
        {
            audio: 'y2mate.com - Jax  Like My Father Lyric Video.mp3', 
            start: 15, 
            duration: 56, 
            quote: "Family is the first song of love we ever learn, played by hearts in harmony."
        },
        {
            audio: "y2mate.com - Alan Walker  Lost Control Lyrics ft Sorana.mp3", 
            start: 41, 
            duration: 30, 
            quote: "In the chaos of life, love is the anchor that keeps us from losing ourselves."
        },
        {
            audio: "y2mate.com - Frawley  If I Dont Laugh Ill Cry Lyrics (1).mp3", 
            start: 28, 
            duration: 42, 
            quote: "Sometimes laughter is the shield we wear to hide the tears we carry inside."
        },
        {
            audio: "y2mate.com - Tate McRae  you broke me first Official Video.mp3", 
            start: 7, 
            duration: 54, 
            quote: "The deepest scars are left by the ones we love the most, yet they teach us the strongest lessons."
        },
        {
            audio: "y2mate.com - Alan Walker Sabrina Carpenter  Farruko  On My Way Lyrics.mp3", 
            start: 34, 
            duration: 23, 
            quote: "Life is a journey, and every goodbye is just another step toward finding ourselves."
        },
        {
            audio: "y2mate.com - Alan Walker  Alone Lyrics.mp3", 
            start: 20, 
            duration: 23, 
            quote: "In the depths of solitude, we discover the strength to rise and shine."
        },
         {
            audio: "y2mate.com - UNDRESSED Forever Young Music Video.mp3", 
            start: 20, 
            duration: 23, 
            quote: "Life is a journey, and every goodbye is just another step toward finding ourselves."
        },
        
    ];
    

    scrollDown.addEventListener('click', () => {slidePlayList(true);});

    scrollUp.addEventListener('click', () => {slidePlayList(false);});

    supriseBtn.addEventListener('click', () => {alternateIntroAndContent(true);});

    backBtn.addEventListener('click', () => {

        if(currentsong && !currentsong.paused) {
            currentsong.pause();
        }
        alternateIntroAndContent(false);
    });

    function alternateIntroAndContent(state) {
        introDiv.style.display = state ? "none" : "block";
        state ? content.classList.add('active') : content.classList.remove('active');
    }
    
    // Function to handle scrolling
    function getScrollSpeed() {
        const screenWidth = window.innerWidth;
    
        // Adjust scroll speed based on screen width
        if (screenWidth < 768) { // Mobile devices
            return 300; // Faster scroll speed for mobile
        } else {
            return 550; // Default speed for larger screens
        }
    }
    
    function slidePlayList(isScrollingDown) {
        const scrollSpeed = getScrollSpeed(); // Get the appropriate scroll speed
    
        playlists.scrollBy({
            top: isScrollingDown ? scrollSpeed : -scrollSpeed,
            behavior: "smooth"
        });
    }

    function displayPlayers() {
        songs.forEach(song => {
            const player = document.createElement('div');
            player.classList.add('player');

            player.style.backgroundImage = `url(${getRandomImage()})`;
    
            const content = document.createElement('div');
            content.classList.add('contents');
            
           createItems(content, song);
           
           player.appendChild(content); // Append the content to the player div
           playlists.appendChild(player); // Append the player to the playlists container
        });
    }

    function getRandomImage() {
        const index  = Math.floor(Math.random() * images.length);
        const choosenImage = images[index];

        return  choosenImage;
    }

    function updatePlayBtn(btn,state) {
        state ? btn.innerHTML = '<i class="fas fa-pause"></i>' : btn.innerHTML = '<i class="fas fa-play"></i>';
    }

    function createItems(parent,song) {

        const audio = song.audio;
        const duration = song.duration;
        const startDuration = song.start;
        const quote = song.quote;

        const timeTruck = document.createElement('div');
        timeTruck.classList.add('time-truck');
        parent.appendChild(timeTruck);

        const timeBar = document.createElement('div');
        timeBar.classList.add('time-bar');
        timeTruck.appendChild(timeBar);

        // Create and append song title
        const lyricsDiv = document.createElement('div');
        lyricsDiv.classList.add('lyrics-container')
        parent.appendChild(lyricsDiv);
 
        const buttonContainers = document.createElement('div');
        buttonContainers.classList.add('player-buttons');
        parent.appendChild(buttonContainers);

        const playBtn = document.createElement('button');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        buttonContainers.appendChild(playBtn);

        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playsong(audio, startDuration, duration,timeBar,playBtn, lyricsDiv, quote);
            updatePlayBtn(playBtn, isPlaying)
        })

        const loveBtn = document.createElement('button');
        loveBtn.innerHTML = '<i class="fas fa-heart"></i>';
        buttonContainers.appendChild(loveBtn);

        // Check if the song is already loved on load
        const songId = audio.split(' ').join('_'); // Create a unique identifier for the song
        const lovedSongs = JSON.parse(localStorage.getItem('lovedSongs')) || {};

        if (lovedSongs[songId]) {
            isLoved = true;
            loveBtn.innerHTML = '<i class="fas fa-heart"></i>'; // Change color when loved
            loveBtn.style.backgroundColor = '#ff1493';
        }


        // Add click event listener to the love button
        loveBtn.addEventListener('click', () => {
            isLoved = !isLoved; // Toggle the loved state


            // Update the button's appearance based on the loved state
            if (isLoved) {
                loveBtn.innerHTML = '<i class="fas fa-heart"></i>'; // Change color when loved
                loveBtn.style.backgroundColor = '#ff1493';
                // Save the song to localStorage
                lovedSongs[songId] = true;

            } else {
                loveBtn.innerHTML = '<i class="fas fa-heart"></i>'; // Revert to default
                loveBtn.style.backgroundColor = '#007bff';

                // Remove the song from localStorage
                delete lovedSongs[songId];
            }

            // Update localStorage
            localStorage.setItem('lovedSongs', JSON.stringify(lovedSongs));
        });
    }
    
    function playsong(audioSrc, startTime, duration, timeBar, playBtn,lyricsDiv, quote) {
        // Check if there is a currently playing song and it's different from the one being played now
        if (currentsong && currentsong.src !== audioSrc) {
            currentsong.pause();
            currentsong.currentTime = startTime;
            lyricsDiv.innerHTML = '';
        }
    
        // Toggle play/pause functionality
        if (currentsong && !currentsong.paused) {
            // If the song is currently playing, pause it
            currentsong.pause();
            updatePlayBtn(playBtn, false);  // Update button to show play icon
            lyricsDiv.innerHTML = '';
            isPlaying = false;
        } else {
            // If no song is playing, or the song is paused, start or resume playback
            if (!currentsong || currentsong.src !== audioSrc) {
                // Create a new audio object if no song is loaded or it's a different song
                currentsong = new Audio(audioSrc);
            }
    
            // Start playing from the specified startTime
            currentsong.currentTime = startTime;
            currentsong.play();
            lyricsDiv.innerHTML = `<h2 class="quote-text">${quote}</h2> <p class="quote-author">Dorian Gray</p>`;
            updatePlayBtn(playBtn, true);  // Update button to show pause icon
            isPlaying = true;


            // Update the time bar as the song plays
            const interval = setInterval(() => {
                const elapsedTime = currentsong.currentTime - startTime; // Time passed since the start
                const progress = (elapsedTime / duration) * 100; // Calculate the percentage of the duration

                // Update the time bar's width based on progress
                timeBar.style.width = `${progress}%`;

                // If the song reaches the end of the specified duration, stop the song
                if (elapsedTime >= duration) {
                    currentsong.pause();
                    currentsong.currentTime = startTime; // Reset to start
                    updatePlayBtn(playBtn, false);  // Reset play button
                    clearInterval(interval);  // Stop updating the time bar
                    lyricsDiv.innerHTML = '';
                    slidePlayList(true);
                }
            }, 100); // Update every 100 milliseconds
    
        }

        currentsong.addEventListener('ended', () => {
            updatePlayBtn(playBtn, false);
            slidePlayList(true);
        });

        currentsong.addEventListener('timeupdate', () =>{
            const percentage = ((currentsong.currentTime - startTime) / duration) * 100;
            timeBar.style.width = `${percentage}%`;
        })
    }
    
    

    displayPlayers();
});

//-----------------------------------------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const hours = new Date().getHours();
    const nameElement = document.getElementById('name');

    document.getElementById('session').textContent = 
        hours < 12 ? 'Morning' : hours < 16 ? 'Afternoon' : 'Evening';

    // Function to animate the name by typing it letter by letter
    function animateName() {
        const nameText = nameElement.getAttribute('data-name');
        nameElement.innerHTML = '';

        [...nameText].forEach((letter, index) => {
            const span = document.createElement('span');
            span.classList.add('colors');
            span.textContent = letter;
            nameElement.appendChild(span);

            typewriteText(span, index); // Pass the span element and index to the function
        });
    }

    // Function to type each letter with a delay
    function typewriteText(span, index) {
        setTimeout(() => {
            span.style.opacity = 1; // Make the letter visible after the delay
        }, index * 300); // Delay increases for each letter (100ms per letter)
    }

    animateName();


});
