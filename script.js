document.addEventListener('DOMContentLoaded', () => {
    
    /* ------------------------------
     * 1. Terminal Sequence
     * ------------------------------ */
    const lines = [
        "Initializing secure connection...",
        "Identifying user protocol...",
        "Target match verified: THE MOST BEAUTIFUL GIRL.",
        "Current Status: Upset.",
        "Objective: Apologize and restore her smile.",
        "Loading apologies and factual statements...",
        "Ready to begin? >>"
    ];
    const typeWriterEl = document.getElementById('typewriter');
    const enterBtn = document.getElementById('enter-btn');
    let lineIdx = 0;
    
    function typeLine() {
        if (lineIdx >= lines.length) {
            enterBtn.classList.remove('hidden');
            return;
        }
        const line = document.createElement('div');
        typeWriterEl.appendChild(line);
        let charIdx = 0;
        const text = lines[lineIdx];
        
        const interval = setInterval(() => {
            line.innerHTML += text[charIdx] === ' ' ? '&nbsp;' : text[charIdx];
            charIdx++;
            if (charIdx >= text.length) {
                clearInterval(interval);
                lineIdx++;
                setTimeout(typeLine, 600); // Wait before next line
            }
        }, 30);
    }
    
    setTimeout(typeLine, 800); // Delay start

    enterBtn.addEventListener('click', () => {
        document.getElementById('terminal-screen').classList.remove('active');
        
        const main = document.getElementById('main-experience');
        main.classList.remove('hidden');
        
        setupObserver();
    });

    /* ------------------------------
     * 2. Scroll Intersection Observer
     * ------------------------------ */
    function setupObserver() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of element is visible

        document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
            obs.observe(el);
        });
    }

    /* ------------------------------
     * 3. Interactive Bubbles
     * ------------------------------ */
    const compliments = [
        "Your smile literally lights up the entire room.",
        "Your eyes are practically my favorite place to get lost.",
        "You're effortlessly gorgeous, even when you aren't trying.",
        "I still get butterflies every time my phone says it's you."
    ];
    
    const bubbleContainer = document.getElementById('bubble-container');
    let poppedCount = 0;

    compliments.forEach((comp) => {
        const b = document.createElement('div');
        b.className = 'bubble';
        b.innerHTML = `<span class="inner-text">${comp}</span>`;
        
        b.addEventListener('click', function() {
            if (!this.classList.contains('popped')) {
                this.classList.add('popped');
                poppedCount++;
                
                if (poppedCount === compliments.length) {
                    document.getElementById('all-popped-msg').classList.remove('hidden');
                    // Automatically gently scroll user down to slider section
                    setTimeout(() => {
                        document.querySelector('.panel-4').scrollIntoView({behavior: 'smooth'});
                    }, 3500);
                }
            }
        });
        bubbleContainer.appendChild(b);
    });

    /* ------------------------------
     * 4. Anger Slider
     * ------------------------------ */
    const slider = document.getElementById('anger-slider');
    const emoji = document.getElementById('anger-emoji');
    const angerMsg = document.getElementById('anger-msg');
    const angerNextBtn = document.getElementById('anger-next-btn');

    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (val > 80) {
            emoji.innerText = "😡";
            emoji.style.transform = "scale(1.2)";
            angerMsg.innerText = val + "% - Ready to commit a crime";
            slider.style.background = "#ff2a6d";
        } else if (val > 50) {
            emoji.innerText = "😠";
            emoji.style.transform = "scale(1.1)";
            angerMsg.innerText = val + "% - Still sleeping on the couch";
            slider.style.background = "#ff477e";
        } else if (val > 20) {
            emoji.innerText = "😐";
            emoji.style.transform = "scale(1)";
            angerMsg.innerText = val + "% - Willing to listen...";
            slider.style.background = "#ff758c";
        } else {
            emoji.innerText = "🥺";
            emoji.style.transform = "scale(0.9)";
            angerMsg.innerText = val + "% - Okay, maybe I can forgive you.";
            slider.style.background = "#ffd1dc";
            
            if (val === 0) {
                angerMsg.innerText = "0% - Phew. I was sweating there.";
                angerNextBtn.classList.remove('hidden');
                // Trigger reflow & class application
                void angerNextBtn.offsetWidth;
                angerNextBtn.classList.add('scale-in', 'in-view');
            }
        }
    });

    angerNextBtn.addEventListener('click', () => {
        document.querySelector('.panel-5').scrollIntoView({behavior: 'smooth'});
    });


    /* ------------------------------
     * 5. Whack-a-Mole (Bop the Monkey)
     * ------------------------------ */
    const holes = document.querySelectorAll('.hole');
    const scoreDisplay = document.getElementById('whack-score');
    let hitScore = 0;
    let gameActive = false;

    function randomHole() {
        const idx = Math.floor(Math.random() * holes.length);
        return holes[idx];
    }
    
    function popup() {
        if(!gameActive) return;
        const time = Math.random() * 600 + 400; // random time between 400ms and 1s
        const hole = randomHole();
        const mole = hole.querySelector('.mole');
        
        if(!mole.classList.contains('hit')) {
            mole.innerText = "🐒";
        }
        
        mole.classList.remove('hit');
        mole.classList.add('up');
        
        setTimeout(() => {
            mole.classList.remove('up');
            if(gameActive) setTimeout(popup, 300);
        }, time);
    }
    
    // Hit Detection
    holes.forEach(hole => {
        const mole = hole.querySelector('.mole');
        // Works on mobile AND web
        mole.addEventListener('mousedown', hitObj);
        mole.addEventListener('touchstart', hitObj);

        function hitObj(e) {
            e.preventDefault();
            if(!mole.classList.contains('up') || mole.classList.contains('hit')) return;
            
            mole.classList.add('hit');
            mole.innerText = "💥";
            hitScore++;
            scoreDisplay.innerText = hitScore;
            
            if(hitScore >= 5) {
                gameActive = false; // Stop popups
                // Force any active down
                document.querySelectorAll('.mole').forEach(m => m.classList.remove('up'));
                
                const endMsg = document.getElementById('whack-end');
                endMsg.classList.remove('hidden');
                
                setTimeout(() => {
                   document.querySelector('.panel-7').scrollIntoView({behavior: 'smooth'});
                }, 3000);
            }
        }
    });

    // Start game via Intersection Observer when scroll hits panel 6
    const moleObs = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && hitScore < 5 && !gameActive) {
            gameActive = true;
            popup();
        } else if (!entries[0].isIntersecting) {
            gameActive = false; // Pause if they scroll away
        }
    }, { threshold: 0.5 });
    moleObs.observe(document.querySelector('.whack-game'));


    /* ------------------------------
     * 6. Broken Heart Fix
     * ------------------------------ */
    const heart = document.getElementById('broken-heart');
    let heartFixed = false;
    
    heart.addEventListener('click', () => {
        if(heartFixed) return;
        heartFixed = true;
        
        heart.innerHTML = "❤️";
        heart.style.transform = "scale(1.4)";
        heart.style.filter = "drop-shadow(0 0 30px rgba(255,0,0,0.8))";
        
        const hint = heart.querySelector('.click-hint');
        if(hint) hint.remove();

        setTimeout(() => {
            const finalPanel = document.getElementById('final-panel');
            finalPanel.classList.remove('hidden');
            setTimeout(() => {
                finalPanel.scrollIntoView({behavior: 'smooth', block: 'end'});
                finalPanel.querySelectorAll('.fade-in, .slide-up').forEach(el => el.classList.add('in-view'));
            }, 300);
        }, 1200);
    });

    /* ------------------------------
     * 7. The "No" Button Chase
     * ------------------------------ */
    const noBtn = document.getElementById('btn-no');
    
    const moveNoButton = () => {
        const winW = window.innerWidth - noBtn.offsetWidth - 20;
        const winH = window.innerHeight - noBtn.offsetHeight - 20;
        
        if (noBtn.style.position !== 'fixed') {
            document.body.appendChild(noBtn);
            noBtn.style.position = 'fixed';
            noBtn.style.zIndex = '9999';
        }

        const newX = Math.max(20, Math.random() * winW);
        const newY = Math.max(20, Math.random() * winH);
        
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
    };

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => { 
        e.preventDefault(); 
        moveNoButton(); 
    });
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
        noBtn.innerText = "Nice try!";
    });

    /* ------------------------------
     * 8. Confetti & Success
     * ------------------------------ */
    const yesBtn = document.getElementById('btn-yes');
    yesBtn.addEventListener('click', () => {
        const cel = document.getElementById('celebration-screen');
        cel.classList.remove('hidden');
        cel.classList.add('active');
        
        if (noBtn && noBtn.parentElement === document.body) {
            noBtn.remove();
        }

        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 35, spread: 360, ticks: 100, zIndex: 1000 };

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 60 * (timeLeft / duration);
            
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    });
});
