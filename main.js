const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb'); 
const audio = $('#audio'); 
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: '3107',
            singer:'W/n, Duongg, Nâu',
            path: './music/3107-WnDuonggNau.mp3',
            image: './img/3107.jfif'
        },

        {
            name: '3107 2',
            singer:'W/n, Duongg, Nâu',
            path: './music/3107_2-DuonggNauWn.mp3',
            image: './img/3107_2.jfif'
        },

        {
            name: '3107 3',
            singer:'W/n, Duongg, Nâu',
            path: './music/3107_3-WnDuonggNau.mp3',
            image: './img/3107_3.jfif'
        },

        {
            name: '3107 4',
            singer:'W/n, Duongg, Nâu',
            path: './music/3107_4-WnERIKNau.mp3',
            image: './img/3107_4.jfif'
        },

        {
            name: 'Bạn Cấp 3',
            singer:'Lou Hoàng',
            path: './music/Ban Cap 3 - Lou Hoang.mp3',
            image: './img/bancap3.jfif'
        },

        {
            name: 'Bắt Cóc Con Tim',
            singer:'Lou Hoàng',
            path: './music/Bat Coc Con Tim - Lou Hoang.mp3',
            image: './img/batcoccontim.jfif'
        },
        
        {
            name: 'Có em',
            singer:'Madihu_ Low G',
            path: './music/Co Em - Madihu_ Low G.mp3',
            image: './img/coem.jfif'
        },

        {
            name: 'Người Đáng Thương Là Anh',
            singer:'Only-C',
            path: '../music/Nguoi-Dang-Thuong-La-Anh-Only-C.mp3',
            image: './img/nguoidangthuonglaanh.jfif'
        },

        {
            name: 'Quên Đặt Tên',
            singer:'Phạm Nguyên Ngọc',
            path: './music/Quen Dat Ten - Pham Nguyen Ngoc BMZ.mp3',
            image: './img/quendatten.jfif'
        },

        {
            name: 'Vì Anh Đâu Có Biết',
            singer:'Madihu ft.Vũ',
            path: './music/ViAnhDauCoBiet-MadihuVu.mp3',
            image: './img/vianhdaucobiet.jfif'
        }
    ],


    render : function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === _this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>

                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>

                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })

        $('.playlist').innerHTML = htmls.join('');
    },

    defineProperties: function() {  
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        });
    },
    
    headleEvents: function () {
        _this = this;

        //Xử lí CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform  : 'rotate(360deg)'}
        ], {
            duration : 10000,
            iterations : Infinity
        })
        cdThumbAnimate.pause();

        //xử lí phóng to thu nhỏ CD
        const cdWidht = cd.offsetWidth;
        document.onscroll = function() {
           const scrollTop = document.documentElement.scrollTop;
           const newcdWidth = cdWidht - scrollTop;

           cd.style.width = newcdWidth > 0 ? newcdWidth + 'px': 0;
           cd.style.opacity = newcdWidth/cdWidht;
        }

        //Xử lí khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //Khi song duoc play 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi song bi pause 
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi thay đổi tiến độ bài hát
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Khi tua 
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //Khi nextSong
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Khi prevSong
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //khi ramdomSong
        randomBtn.onclick = function() { 
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);  
        }

        //Khi repeat Song 
        repeatBtn.onclick = function() { 
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);   

        }
 
        //Xử lí nextSong khi audio ended
        audio.onended = function() { 
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();    
            }
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('option')) {
                //Xử lí kho click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                //Xử lí khi click vào song options
                if (e.target.closest('option')) {

                }
            }

        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path ; 
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex) {
            this.currentIndex = newIndex;
            this.loadCurrentSong();
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block : 'nearest',
            })
        }, 100)
    },

    start: function() {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        //Lắng nghe / xử lí các sự kiện(DOM events)
        this.headleEvents();

        //Tải thông tin bài hát đầu tiên vào UI ;
        this.loadCurrentSong();
        
        //Render playlist   
        this.render();

    }
}

app.start()
