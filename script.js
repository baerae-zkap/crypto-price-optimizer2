document.addEventListener('DOMContentLoaded', () => {
    
    const options = {
        slideDuration: 5000, 
        coverDuration: 3000, 
        autoPlay: true, 
        loop: false, 
        startWithCover: true, 
        
        textAnimationDelay: 300, 
        charsPerSecond: 10,       
        
        interLinePause: 200,      
        postAnimationPause: 1300, 
        
    };

    
    const storyData = {
        cover: {
            type: 'cover',
            background: {
                type: 'solid',
                value: null
            },
            title: '클릭 한 번에 최저가로 구매해요',
            identifier: '거래소마다 가격이 다른거 아세요?',
            logo: null
        },
        slides: [
            { 
                background: {
                    type: 'solid',
                    value: null
                },
                visual: { 
                    type: 'video',
                    src: '1pc.mov',
                    frame: false 
                },
                textLines: [
                    "거래소마다 다른 코인 가격",
                    "혹시 알고 계셨나요?"
                ]
            },
            { 
                background: {
                    type: 'solid',
                    value: null
                },
                visual: { 
                    type: 'video',
                    src: '2pc.mov',
                    frame: false 
                },
                textLines: [
                    "같은 코인도",
                    "가격차가 크게 발생할 수 있어요!"
                ]
            },
            { 
                background: {
                    type: 'solid',
                    value: null
                },
                visual: { 
                    type: 'video',
                    src: '3pc.mov',
                    frame: false 
                },
                textLines: [ 
                    "ZKAP은 최적의 루트를 비교해서",
                    "어느 거래소에서 사야 가장 저렴한지",
                    "한눈에 보여드려요."
                ]
            },
            { 
                background: {
                    type: 'solid',
                    value: null
                },
                visual: { 
                    type: 'video',
                    src: '4pc.mov',
                    frame: false 
                },
                textLines: [ 
                    "클릭 한 번이면",
                    "그 루트 그대로, 가장 좋은 가격으로",
                    "자동으로 구매해 드릴게요."
                ]
            }
        ],
        ending: { 
            type: 'ending',
            background: {
                type: 'solid',
                value: null
            },
            title: 'ZKAP으로 최적가에 구매하세요!',
            cta: {
                primary: {
                    text: 'ZKAP 사전예약 하기',
                    action: 'reserve'
                }
            }
        }
    };

    
    const icons = {
        surprise: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" fill="currentColor"/></svg>',
        question: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-10h2V7h-2v3zm0 4h2v-2h-2v2z" fill="currentColor"/></svg>',
        solution: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>',
        opportunity: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>'
    };

    
    const progressContainer = document.getElementById('progress-container');
    const storyContent = document.getElementById('story-content');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const muteBtn = document.getElementById('mute-btn');
    const emailModal = document.getElementById('email-modal');
    const modalClose = document.getElementById('modal-close');
    const emailForm = document.getElementById('email-form');
    const slide0Audio = document.getElementById('slide0-audio');
    const muteTooltip = document.getElementById('mute-tooltip');
    const coverPlayButton = document.getElementById('cover-play-button');
    const pauseIconWrapper = coverPlayButton?.querySelector('.pause-icon-wrapper');
    const playIconWrapper = coverPlayButton?.querySelector('.play-icon-wrapper');

    
    const bottomNavControls = document.getElementById('bottom-nav-controls');
    const prevControlBtn = document.getElementById('prev-control-btn');
    const playPauseControlBtn = document.getElementById('play-pause-control-btn');
    const nextControlBtn = document.getElementById('next-control-btn');
    const playIcon = playPauseControlBtn?.querySelector('.play-icon');
    const pauseIcon = playPauseControlBtn?.querySelector('.pause-icon');

    
    let currentSlideIndex = options.startWithCover ? -1 : 0; 
    let slidesCount = storyData.slides.length;
    let isPaused = false;
    let isMuted = true; 
    let isAudioUnlocked = false; 
    let singleProgressBar = null;
    let lineTimeouts = []; 
    let singleProgressContainer = null; 

    
    function unlockAudio() {
        if (!isAudioUnlocked && slide0Audio) {
            console.log("Attempting to unlock audio via user interaction...");
            
            const wasMuted = slide0Audio.muted;
            slide0Audio.muted = true;
            slide0Audio.play().then(() => {
                slide0Audio.pause();
                slide0Audio.currentTime = 0; 
                slide0Audio.muted = wasMuted; 
                isAudioUnlocked = true;
                console.log("Audio unlocked by user interaction.");
                
                document.body.removeEventListener('click', unlockAudio);
                document.body.removeEventListener('touchstart', unlockAudio); 
                
                
                if (currentSlideIndex === 0) {
                    console.log("Audio unlocked AND current slide is 0. Attempting to play now.");
                    playSlide0Audio(); 
                }
            }).catch(e => {
                 console.warn("Audio unlock attempt failed:", e);
                 slide0Audio.muted = wasMuted; 
                 
            });
        } else if (isAudioUnlocked) {
             
             document.body.removeEventListener('click', unlockAudio);
             document.body.removeEventListener('touchstart', unlockAudio);
        }
    }

    
    function init() {
        createProgressBars();
        createAllSlides();
        setupEventListeners();

        
        const storyContainer = document.querySelector('.story-container');
        const bottomNavControls = document.getElementById('bottom-nav-controls');
        if (storyContainer && bottomNavControls) {
            storyContainer.appendChild(bottomNavControls);
        }

        console.log("Initializing listeners for audio unlock.");
        document.body.addEventListener('click', unlockAudio);
        document.body.addEventListener('touchstart', unlockAudio);
        const soundOnIcon = muteBtn.querySelector('.sound-on');
        const soundOffIcon = muteBtn.querySelector('.sound-off');
        if (soundOnIcon && soundOffIcon) {
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
        }
        if (options.startWithCover && storyData.cover) {
            showSlide(-1);
        } else {
            showSlide(0);
        }
        if (slide0Audio) {
            slide0Audio.addEventListener('play', () => {
                console.log("Slide 0 audio 'play' event fired at", slide0Audio.currentTime);
            });
             slide0Audio.addEventListener('error', (e) => {
                 console.error("Audio element error:", slide0Audio.error, e);
             });
        }
    }

    
    function createProgressBars() {
        progressContainer.innerHTML = '';
        const totalSegments = slidesCount; 
        
        for (let i = 0; i < totalSegments; i++) {
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progress = document.createElement('div');
            progress.className = 'progress';
            progress.dataset.index = i; 
            progressBar.appendChild(progress);
            progressContainer.appendChild(progressBar);
        }
    }

    
    function createSingleProgressBar() {
        
        progressContainer.style.display = 'none';
        
        
        const singleContainer = document.createElement('div');
        singleContainer.className = 'single-progress-container';
        
        const singleBar = document.createElement('div');
        singleBar.className = 'single-progress-bar';
        
        const singleProgress = document.createElement('div');
        singleProgress.className = 'single-progress';
        
        
        document.documentElement.style.setProperty('--animation-duration', `${options.coverDuration / 1000}s`);
        
        singleBar.appendChild(singleProgress);
        singleContainer.appendChild(singleBar);
        document.querySelector('.story-container').appendChild(singleContainer);
        
        return singleContainer;
    }

    
    function createAllSlides() {
        storyContent.innerHTML = '';
        
        
        if (storyData.cover) {
            createCoverSlide(storyData.cover);
        }
        
        
        storyData.slides.forEach((slide, index) => {
            createMessageSlide(slide, index);
        });
        
        
        if (storyData.ending) {
            createEndingSlide(storyData.ending);
        }
    }

    
    function createCoverSlide(coverData) {
            const slide = document.createElement('div');
        slide.className = 'cover-slide';
        slide.dataset.index = -1;

        
            const background = document.createElement('div');
        background.className = `slide-background ${coverData.background.type}`;
        
        if (coverData.background.value) {
            if (coverData.background.type === 'gradient') {
                background.style.background = coverData.background.value;
            } else {
                background.style.backgroundColor = coverData.background.value;
            }
        } else {
             
             if (coverData.background.type === 'gradient') {
                 
             } else {
                 background.style.backgroundColor = 'var(--background-color)'; 
             }
            }
            slide.appendChild(background);

        
        const content = document.createElement('div');
        content.className = 'slide-content';

        
        const identifier = document.createElement('div');
        identifier.className = 'cover-identifier';
        identifier.textContent = coverData.identifier; 
        content.appendChild(identifier);

        
        if (coverData.title) {
            const titleContainer = document.createElement('div');
            titleContainer.className = 'cover-title-container';

            
            const titleWords = coverData.title.split(' ');
            const midPoint = Math.ceil(titleWords.length / 2);
            const titleLine1Text = titleWords.slice(0, midPoint).join(' ');
            const titleLine2Text = titleWords.slice(midPoint).join(' ');

            
            const hiddenTitle = document.createElement('div');
            hiddenTitle.className = 'cover-title-hidden';
            const hiddenSpan1 = document.createElement('span');
            hiddenSpan1.textContent = titleLine1Text;
            const hiddenSpan2 = document.createElement('span');
            hiddenSpan2.textContent = titleLine2Text;
            hiddenTitle.appendChild(hiddenSpan1);
            hiddenTitle.appendChild(hiddenSpan2);
            titleContainer.appendChild(hiddenTitle);

            
            const visibleTitle = document.createElement('div');
            visibleTitle.className = 'cover-title-visible';
            const visibleSpan1 = document.createElement('span');
            visibleSpan1.className = 'cover-title-line-1'; 
            visibleSpan1.textContent = titleLine1Text;
            const visibleSpan2 = document.createElement('span');
            visibleSpan2.className = 'cover-title-line-2'; 
            visibleSpan2.textContent = titleLine2Text;
            visibleTitle.appendChild(visibleSpan1);
            visibleTitle.appendChild(visibleSpan2);
            titleContainer.appendChild(visibleTitle);

            content.appendChild(titleContainer);
        }

        
        const decorElement = document.createElement('div');
        decorElement.className = 'cover-decoration';
        slide.appendChild(decorElement); 

        slide.appendChild(content);
        storyContent.appendChild(slide); 
    }

    
    function createMessageSlide(slideData, index) {
        const slide = document.createElement('div');
        slide.className = 'story-slide';
        slide.dataset.index = index;

        const background = document.createElement('div');
        background.className = `slide-background ${slideData.background.type}`;
        slide.appendChild(background);

        
        const textGradientBg = document.createElement('div');
        textGradientBg.className = 'text-background-gradient';
        

        const content = document.createElement('div');
        content.className = 'slide-content';
        
        if (slideData.visual && slideData.visual.frame === false) {
            content.classList.add('full-bleed-video');
        }

        
        content.appendChild(textGradientBg);

        
        if (slideData.visual && slideData.visual.src) {
            const visualContainer = document.createElement('div');
            visualContainer.classList.add('visual-content-container');
            
            if (slideData.visual.frame === false) {
                visualContainer.classList.add('no-frame');
            }

            if (slideData.visual.type === 'icon') {
                const icon = document.createElement('img');
                icon.src = slideData.visual.src;
                icon.alt = "Slide visual";
                icon.classList.add('visual-icon');
                if (slideData.visual.size) {
                    icon.style.width = slideData.visual.size;
                    icon.style.height = slideData.visual.size;
                }
                visualContainer.appendChild(icon);
            } else if (slideData.visual.type === 'video') { 
                const videoElement = document.createElement('video');
                videoElement.classList.add('visual-video');
                videoElement.src = slideData.visual.src;
                videoElement.loop = slideData.visual.loop !== undefined ? slideData.visual.loop : true;
                videoElement.muted = slideData.visual.muted !== undefined ? slideData.visual.muted : true;
                videoElement.setAttribute('playsinline', '');
                videoElement.preload = "auto";

                videoElement.classList.add(`video-slide-${index}`);

                visualContainer.appendChild(videoElement);
            }

            content.appendChild(visualContainer); 
        }

        
        
        const textContainer = document.createElement('div');
        textContainer.className = 'bottom-text-container'; 
        textContainer.id = `text-container-${index}`;

        if (slideData.textLines && slideData.textLines.length > 0) {
            slideData.textLines.forEach((lineText, lineIndex) => {
                
                const lineWrapper = document.createElement('div');
                lineWrapper.className = 'line-content-wrapper';
                

                
                const bgLayer = document.createElement('div');
                bgLayer.className = 'text-layer background-layer';
                bgLayer.textContent = lineText;
                lineWrapper.appendChild(bgLayer);

                
                const fgLayer = document.createElement('div');
                
                fgLayer.className = 'text-layer foreground-layer karaoke-text-line';
                fgLayer.dataset.lineIndex = lineIndex; 
                fgLayer.textContent = lineText;
                lineWrapper.appendChild(fgLayer);

                textContainer.appendChild(lineWrapper);
            });
        }

        content.appendChild(textContainer);

        slide.appendChild(content);
            storyContent.appendChild(slide);
    }

    
    function showSlide(index) {
        console.log(`[showSlide] Called with index: ${index}`);
        const previousSlideIndex = currentSlideIndex; 
        
        lineTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        lineTimeouts = [];

        const slideElements = document.querySelectorAll('.story-slide, .cover-slide, .ending-slide');
        let previousSlideElement = null;
        let currentSlideElement = null;

        
        slideElements.forEach(s => s.classList.remove('no-transition'));

        
        slideElements.forEach(slide => {
            const slideIndex = parseInt(slide.dataset.index);
            if (slideIndex === previousSlideIndex) previousSlideElement = slide;
            if (slideIndex === index) currentSlideElement = slide;
        });

        const isSeamlessTransition = (previousSlideIndex === 0 && index === 1) || (previousSlideIndex === 2 && index === 3);

        
        if (isSeamlessTransition && currentSlideElement) {
            console.log(`[NoTransition] Applying to current slide ${index} for seamless transition`);
            currentSlideElement.classList.add('no-transition');
            
        }

        
        slideElements.forEach(slide => {
            if (slide === currentSlideElement) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        
        if (isSeamlessTransition && currentSlideElement) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (currentSlideElement.classList.contains('no-transition')) {
                        currentSlideElement.classList.remove('no-transition');
                        console.log(`[NoTransition] Removed from current slide ${index} after seamless display`);
                    }
                });
            });
        }

        
        const videos = document.querySelectorAll('.visual-video');
        videos.forEach(video => {
            const parentSlide = video.closest('.story-slide');
            if (parentSlide === currentSlideElement) {
                
                console.log(`[Video Control] Preparing video for slide ${index}`);
                video.pause(); 

                
                if (isSeamlessTransition) {
                    console.log(`[Video Control - Seamless] Immediately resetting and playing video for slide ${index}`);
                    video.currentTime = 0;
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => { 
                            if (error.name === 'NotAllowedError') {
                                console.warn(`[Video Control - Seamless] Autoplay prevented for slide ${index}:`, error.message);
                            } else {
                                console.error(`[Video Control - Seamless] Error playing video in slide ${index}:`, error);
                            }
                        });
                    }
                } else {
                    
                    requestAnimationFrame(() => {
                        video.currentTime = 0;
                        console.log(`[Video Control] currentTime set to 0 for slide ${index}`);
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                if (error.name === 'NotAllowedError') {
                                    console.warn(`[Video Control] Autoplay prevented for slide ${index}:`, error.message);
                                } else {
                                    console.error(`[Video Control] Error playing video in slide ${index}:`, error);
                                }
                            });
                        } else {
                             console.log("[Video Control] play() did not return a promise.");
                        }
                    });
                }
            } else {
                
                video.pause();
                
                 requestAnimationFrame(() => { 
                     if (video.currentTime !== 0) { 
                         video.currentTime = 0;
                         console.log(`[Video Control] Reset inactive video currentTime`);
                     }
                 });
            }
        });

        
        const progresses = document.querySelectorAll('.progress');
        progresses.forEach((progress, i) => {
            progress.style.animation = 'none';
            void progress.offsetWidth;
            if (i < index) {
                progress.style.width = '100%';
            } else {
                progress.style.width = '0%';
            }
            
            
        });

        
        if (singleProgressContainer) singleProgressContainer.style.display = 'none';
        progressContainer.style.display = 'none';
        if (muteTooltip) muteTooltip.classList.remove('visible');

        
        if (coverPlayButton) {
            coverPlayButton.style.display = (index < 0) ? 'flex' : 'none';
        }

        
        if (bottomNavControls) {
            if (index < 0 || index >= slidesCount) { 
                bottomNavControls.classList.add('controls-hidden');
            } else { 
                bottomNavControls.classList.remove('controls-hidden');
            }
        }

        
        updatePlayPauseIcon();

        
        if (index < 0) { 
            const coverSlide = document.querySelector('.cover-slide');
            if (coverSlide) coverSlide.classList.add('active');
            currentSlideIndex = -1;
            if (singleProgressContainer) singleProgressContainer.style.display = 'none';
            progressContainer.style.display = 'none';
            if (muteTooltip) muteTooltip.classList.remove('visible');
            if (coverPlayButton) {
                coverPlayButton.style.display = (index < 0) ? 'flex' : 'none';
            }
            const coverProgress = ensureSingleProgressBar();
            if (coverProgress) {
                if (singleProgressContainer) {
                     singleProgressContainer.style.display = 'block';
                }
                coverProgress.style.animation = 'none';
                void coverProgress.offsetWidth;
                coverProgress.style.animation = `progress-animation ${options.coverDuration / 1000}s linear forwards`;

                
                if (options.autoPlay) {
                     const handleCoverEnd = () => {
                          console.log("[AnimationEnd] Cover finished.");
                          if (!isPaused) goToNextSlide();
                     };
                     coverProgress.addEventListener('animationend', handleCoverEnd, { once: true });
                }
            }
            if (muteTooltip && isMuted) {
                muteTooltip.style.display = 'block';
                setTimeout(() => muteTooltip.classList.add('visible'), 50);
            }
        } else if (index >= slidesCount) { 
            console.log(`[showSlide] Entering Ending slide logic for index: ${index}`);
            const endingSlide = document.querySelector('.ending-slide');
            if (endingSlide) endingSlide.classList.add('active');
            currentSlideIndex = slidesCount;
             progressContainer.style.display = 'flex';
             progresses.forEach(p => p.style.width = '100%');
             if(nextBtn) nextBtn.style.display = 'none';
        } else { 
            const slideToShow = document.querySelector(`.story-slide[data-index="${index}"]`);
            if (slideToShow) slideToShow.classList.add('active');
            currentSlideIndex = index;
            progressContainer.style.display = 'flex';
            if(nextBtn) nextBtn.style.display = 'flex';
            if (index === 0 && slide0Audio) {
                playSlide0Audio();
            }

            
            startLineSweepAnimation(index);

            const totalAnimationTime = calculateTotalAnimationTime(index);
            const currentProgress = document.querySelector(`.progress[data-index="${index}"]`);

            if (currentProgress && totalAnimationTime > 0) {
                console.log(`[Progress ${index}] Setting duration: ${totalAnimationTime / 1000}s`);
                currentProgress.style.width = '0%';
                void currentProgress.offsetWidth;
                currentProgress.style.animation = `progress-animation ${totalAnimationTime / 1000}s linear forwards`;

                
                if (options.autoPlay) {
                     const handleSlideEnd = () => {
                          console.log(`[AnimationEnd] Slide ${index} finished.`);
                          if (!isPaused) goToNextSlide();
                     };
                     currentProgress.addEventListener('animationend', handleSlideEnd, { once: true });
                }
            }
        }
        
        
        currentSlideIndex = index;

        updateNavButtons();
        updatePlayPauseIcon();

        
        if (bottomNavControls) {
            if (index < 0 || index >= slidesCount) { 
                bottomNavControls.classList.add('controls-hidden');
            } else { 
                bottomNavControls.classList.remove('controls-hidden');
            }
        }
    }

    
    function updateNavButtons() {
        
        const isFirst = currentSlideIndex <= 0;
        const isLast = currentSlideIndex >= slidesCount;

        
        if (prevBtn) {
            prevBtn.style.opacity = isFirst ? '0' : '';
            prevBtn.style.pointerEvents = isFirst ? 'none' : 'auto';
        }
        
        if (nextBtn) {
            nextBtn.style.opacity = isLast ? '0' : '';
            nextBtn.style.pointerEvents = isLast ? 'none' : 'auto';
        }

        
        if (prevControlBtn) {
            prevControlBtn.disabled = isFirst;
            prevControlBtn.style.opacity = isFirst ? '0.5' : '1';
            prevControlBtn.style.cursor = isFirst ? 'default' : 'pointer';
        }
        
        if (nextControlBtn) {
            nextControlBtn.disabled = isLast;
            nextControlBtn.style.opacity = isLast ? '0.5' : '1';
            nextControlBtn.style.cursor = isLast ? 'default' : 'pointer';
        }
    }

    
    function goToPrevSlide() {
        if (currentSlideIndex > 0) {
            showSlide(currentSlideIndex - 1);
        }
    }

    
    function goToNextSlide() {
        console.log(`[goToNextSlide] Called. currentSlideIndex: ${currentSlideIndex}, slidesCount: ${slidesCount}`); 
        if (currentSlideIndex < slidesCount) {
            const nextIndex = currentSlideIndex + 1;
            console.log(`[goToNextSlide] Calling showSlide(${nextIndex})`); 
             showSlide(nextIndex);
        }
    }

    
    function stopAutoPlay() {
        console.log("stopAutoPlay called (timer logic removed)");
    }

    
    function togglePause() {
        isPaused = !isPaused;
        updatePlayPauseIcon();

        if (isPaused) {
            
            

            
            document.querySelectorAll('.progress, .foreground-layer.karaoke-text-line, .single-progress').forEach(el => {
                 if (el.style.animationPlayState === 'running') {
                     el.style.animationPlayState = 'paused';
                 }
             });
             document.querySelectorAll('.visual-video').forEach(video => {
                 if (!video.paused) {
                     video.pause();
                 }
             });
             if (slide0Audio && !slide0Audio.paused) slide0Audio.pause();
            console.log("Story paused");
        } else {
            console.log("Story resumed");

            
            document.querySelectorAll('.progress, .foreground-layer.karaoke-text-line, .single-progress').forEach(el => {
                 if (el.style.animationPlayState === 'paused') {
                      el.style.animationPlayState = 'running';
                 }
             });
             const activeSlideVideo = document.querySelector('.story-slide.active .visual-video, .cover-slide.active .visual-video');
             if (activeSlideVideo && activeSlideVideo.paused) {
                  activeSlideVideo.play().catch(e => console.error("Video resume failed:", e));
             }
             if (currentSlideIndex === 0 && slide0Audio && slide0Audio.paused && !isMuted) {
                 slide0Audio.play().catch(e => console.error("Audio resume failed:", e));
             }

            
        }
    }

    
    function toggleMute() {
        isMuted = !isMuted;
        
        
        const soundOnIcon = muteBtn.querySelector('.sound-on');
        const soundOffIcon = muteBtn.querySelector('.sound-off');
        if (isMuted) {
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
        } else {
            soundOnIcon.style.display = 'block';
            soundOffIcon.style.display = 'none';
        }
        
        
        if (slide0Audio) {
            slide0Audio.muted = isMuted;
        }
        
        
        if (muteTooltip) {
            if (!isMuted) {
                 muteTooltip.classList.remove('visible');
            } else if (currentSlideIndex < 0) { 
                 muteTooltip.style.display = 'block';
                 setTimeout(() => muteTooltip.classList.add('visible'), 50); 
            }
        }
        
        
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.muted = isMuted;
        });
    }

    
    function showEmailModal() {
        emailModal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    
    function closeEmailModal() {
        emailModal.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    
    function handleEmailSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        
        
        console.log('이메일 제출:', { email, name });
        
        
        alert('사전예약이 완료되었습니다. 감사합니다!');
        closeEmailModal();
    }

    
    function setupEventListeners() {
        
        prevBtn.addEventListener('click', goToPrevSlide);
        nextBtn.addEventListener('click', goToNextSlide);
        
        
        muteBtn.addEventListener('click', toggleMute);
        
        
        if (coverPlayButton) {
            coverPlayButton.addEventListener('click', () => {
                console.log('Cover play/pause button clicked');

                
                if (pauseIconWrapper && playIconWrapper) {
                    const iconToShow = isPaused ? playIconWrapper : pauseIconWrapper;
                    const iconToHide = isPaused ? pauseIconWrapper : playIconWrapper;

                    iconToHide.classList.remove('visible');
                    iconToShow.classList.add('visible');

                    setTimeout(() => {
                        iconToShow.classList.remove('visible');
                    }, 500);
                }

                togglePause();
            });
        }
        
        
        modalClose.addEventListener('click', closeEmailModal);
        emailForm.addEventListener('submit', handleEmailSubmit);
        
        
        emailModal.addEventListener('click', (e) => {
            if (e.target === emailModal) {
                closeEmailModal();
            }
        });
        
        
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartTime = 0;
        
        storyContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartTime = new Date().getTime();
        }, false);
        
        storyContent.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const touchEndTime = new Date().getTime();
            const touchTime = touchEndTime - touchStartTime;
            
            if (touchTime < 300) {
                
                if (touchEndX < touchStartX - 30) {
                    
                    goToNextSlide();
                } else if (touchEndX > touchStartX + 30) {
                    
                    goToPrevSlide();
                } else {
                    
                    const screenWidth = window.innerWidth;
                    const touchX = e.changedTouches[0].clientX;
                    
                    if (touchX < screenWidth * 0.3) {
                        
                        goToPrevSlide();
                    } else if (touchX > screenWidth * 0.7) {
                        
                        goToNextSlide();
                    }
                }
            }
        }, false);
        
        
        let touchHoldTimer = null;
        
        storyContent.addEventListener('touchstart', () => {
            touchHoldTimer = setTimeout(() => {
                togglePause();
            }, 300);
        }, false);
        
        storyContent.addEventListener('touchend', () => {
            clearTimeout(touchHoldTimer);
            
            
        }, false);
        
        
        storyContent.addEventListener('mousedown', () => {
            touchHoldTimer = setTimeout(() => {
                togglePause();
            }, 300);
        });
        
        storyContent.addEventListener('mouseup', () => {
            clearTimeout(touchHoldTimer);
        });

        
        storyContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('cta-button')) {
                const action = e.target.dataset.action;
                if (action) {
                    handleCTAAction(action);
                }
            }
        });

        
        progressContainer.addEventListener('click', (e) => {
            const progressBar = e.target.closest('.progress-bar');
            if (progressBar) {
                const index = Array.from(progressBar.parentNode.children).indexOf(progressBar);
                if (index >= 0 && index < slidesCount) {
                    stopAutoPlay();
                    showSlide(index);
            }
        }
    });

        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                goToPrevSlide();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                goToNextSlide();
            } else if (e.key === 'Escape') {
                closeEmailModal();
            }
        });

        
        if (prevControlBtn) prevControlBtn.addEventListener('click', goToPrevSlide);
        if (playPauseControlBtn) playPauseControlBtn.addEventListener('click', togglePause);
        if (nextControlBtn) nextControlBtn.addEventListener('click', goToNextSlide);
    }

    
    function handleCTAAction(action) {
        console.log('CTA Action:', action);
        
        
        switch (action) {
            case 'reserve':
            case 'notify':
                
                showEmailModal();
                break;
            default:
                
                console.log('Unknown action:', action);
        }
    }

    
    function startLineSweepAnimation(index) {
        lineTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        lineTimeouts = [];

        const textContainer = document.getElementById(`text-container-${index}`);
        if (!textContainer) return; 

        const lines = textContainer.querySelectorAll('.foreground-layer.karaoke-text-line');
        let cumulativeDelay = options.textAnimationDelay; 

        const useCharsPerSecond = options.charsPerSecond;

        lines.forEach((line, lineIndex) => {
            const lineText = line.textContent || '';
            const numChars = lineText.length;
            let duration = 0;
            if (numChars > 0 && useCharsPerSecond > 0) {
                 duration = (numChars / useCharsPerSecond) * 1000; 
            }

            if (duration > 0) {
                const delay = cumulativeDelay;
                line.style.animationName = 'gradient-sweep'; 
                line.style.animationDuration = `${duration / 1000}s`;
                line.style.animationDelay = `${delay / 1000}s`;
                line.style.animationPlayState = 'running';

                
                cumulativeDelay += duration + options.interLinePause;
            } else {
                 
            }
        });

        
        
    }

     
     function calculateTotalAnimationTime(index) {
         
         if (index === 0) {
            console.log(`[calculateTotalAnimationTime index=0] Returning fixed: 5000ms`);
            return 5000;
         }
         if (index === 1) {
             console.log(`[calculateTotalAnimationTime index=1] Returning fixed: 5000ms`);
             return 5000;
         }

         
         if (index === 2) { 
            console.log(`[calculateTotalAnimationTime index=2] Returning fixed: 6000ms`);
            return 6000; 
         }
         if (index === 3) { 
             console.log(`[calculateTotalAnimationTime index=3] Returning fixed: 7000ms`);
             return 6900; 
         }

         
         if (index < 0) return options.coverDuration; 
         if (index >= slidesCount) return 0; 

         
         const textContainer = document.getElementById(`text-container-${index}`);
         if (!textContainer) return options.textAnimationDelay + options.postAnimationPause;

         let cumulativeDelay = options.textAnimationDelay;
         let lastLineDuration = 0;
         const lines = textContainer.querySelectorAll('.foreground-layer.karaoke-text-line');
         const useCharsPerSecond = options.charsPerSecond;

         lines.forEach((line) => {
             const lineText = line.textContent || '';
             const numChars = lineText.length;
             let duration = 0;
             if (numChars > 0 && useCharsPerSecond > 0) {
                  duration = (numChars / useCharsPerSecond) * 1000;
             }

             if (duration > 0) {
                 cumulativeDelay += duration;
                 lastLineDuration = duration;
                 cumulativeDelay += options.interLinePause;
             }
         });

         let totalDuration;
         if (lastLineDuration > 0) {
             totalDuration = cumulativeDelay - options.interLinePause;
         } else {
             totalDuration = options.textAnimationDelay;
         }

         totalDuration += options.postAnimationPause;
         console.log(`[calculateTotalAnimationTime index=${index}] Calculated: ${totalDuration}ms`);
         return totalDuration;
     }

    
    function createEndingSlide(endingData) {
        const slide = document.createElement('div');
        slide.className = 'ending-slide';
        slide.dataset.index = slidesCount; 

        
        const background = document.createElement('div');
        background.className = `slide-background ${endingData.background.type}`;
        slide.appendChild(background);

        
        const content = document.createElement('div');
        content.className = 'slide-content';

        
        if (endingData.title) {
            const title = document.createElement('h2');
            title.className = 'ending-title';
            title.innerHTML = endingData.title; 
            content.appendChild(title);
        }

        
        if (endingData.cta && endingData.cta.primary) {
            const ctaContainer = document.createElement('div');
            ctaContainer.className = 'cta-container';

            const primaryBtn = document.createElement('button');
            primaryBtn.className = 'cta-button primary-cta';
            primaryBtn.textContent = endingData.cta.primary.text;
            primaryBtn.dataset.action = endingData.cta.primary.action;
            ctaContainer.appendChild(primaryBtn);

            content.appendChild(ctaContainer);
        }

        slide.appendChild(content);
        storyContent.appendChild(slide);
    }

    
    function playSlide0Audio() {
        if (slide0Audio) {
            console.log(`Attempting playSlide0Audio. isAudioUnlocked: ${isAudioUnlocked}, isMuted: ${isMuted}, paused: ${slide0Audio.paused}, currentTime: ${slide0Audio.currentTime}`);
            if (isAudioUnlocked) {
                console.log("Audio is unlocked, applying mute state and ensuring playback.");
                slide0Audio.muted = isMuted; 

                if (slide0Audio.paused) {
                    console.log("Audio is paused, calling play().");
                    const playPromise = slide0Audio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log(`Slide 0 audio playback started/resumed at ${slide0Audio.currentTime}.`);
                        }).catch(e => {
                             console.error(`Slide 0 playback failed!`, e);
                        });
                    } else {
                         console.log("Slide 0 play() did not return a promise.");
                    }
                } else {
                    console.log("Audio is already playing, only updated mute state.");
                }
            } else {
                 console.log("Slide 0 audio cannot play yet (not unlocked).");
            }
        } else {
            console.warn("slide0Audio element not found.");
        }
    }

    
    function ensureSingleProgressBar() {
        if (!singleProgressContainer) {
            singleProgressContainer = document.createElement('div');
            singleProgressContainer.className = 'single-progress-container';
            const singleBar = document.createElement('div');
            singleBar.className = 'single-progress-bar';
            const singleProgress = document.createElement('div');
            singleProgress.className = 'single-progress';
            singleBar.appendChild(singleProgress);
            singleProgressContainer.appendChild(singleBar);
            
            const storyContainer = document.querySelector('.story-container');
            storyContainer.insertBefore(singleProgressContainer, storyContainer.firstChild);
        }
        singleProgressContainer.style.display = 'block';
        return singleProgressContainer.querySelector('.single-progress');
    }

    
    function updatePlayPauseIcon() {
        if (!playIcon || !pauseIcon) return;
        if (isPaused) {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
    }

    
    init();
});
