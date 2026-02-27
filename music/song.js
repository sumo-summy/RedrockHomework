

let myAudio = document.createElement('audio');
myAudio.classList.add('myAudio');
const playPauseBtn = document.querySelector('.displayPause');
const progressBar = document.getElementById('progressBar');
const allBanners=document.querySelector('.allBanners')
const lastGroup = document.getElementById('lastGroup');
const nextGroup = document.getElementById('nextGroup');
let currentPlaylist = null; 
let currentSongIndex = -1; 
  
function togglePlay(e) {
  e.stopPropagation();
  if(myAudio.paused){
    myAudio.play().catch(err => console.error('播放失败:', err));
    playPauseBtn.src='imgs/pause-red.png';
    startSpin();
  }else{
    myAudio.pause();
    playPauseBtn.src='imgs/display-red.png';
    pauseSpin();
  }
}
// 进度条更新
function updateProgress() {
  if (myAudio.duration) {
    const progress = (myAudio.currentTime / myAudio.duration) * 100;
    progressBar.value = progress;
    //同步进度条颜色宽度
    progressBar.style.setProperty('--progress', progress + '%');
  }
  updateLyricHighlight();
}

//拖动进度条调整播放位置
function seekProgress(e) {
  if (myAudio.duration && myAudio.src) {
    const value = e.target.value;
    myAudio.currentTime = (value / 100) * myAudio.duration;
    //拖动时同步进度条颜色宽度
    progressBar.style.setProperty('--progress', value + '%');
  }
  updateLyricHighlight();
}


playPauseBtn.addEventListener('click', togglePlay);
myAudio.ontimeupdate = updateProgress;
progressBar.oninput = seekProgress;

// 唱片转动
function startSpin() {
  playerCover.style.animation = 'spin 10s linear infinite';
  document.head.insertAdjacentHTML('beforeend', `<style>@keyframes spin {from {transform: rotate(0deg);} to {transform: rotate(360deg);}}</style>`);
}
//停止转动
function pauseSpin() {
  playerCover.style.animationPlayState = 'paused';
}


//下一首
async function playNextSong(e) {
  e.stopPropagation();
//校验
  if (!currentPlaylist || currentSongIndex === -1 || currentSongIndex >= currentPlaylist.tracks.length - 1) {
    alert('已是最后一首');
    return;
  }
//索引+1，切换下一首
  currentSongIndex++;
  await playSongByIndex(currentSongIndex);
}
//上一首
async function playLastSong(e) {
  e.stopPropagation();
//校验
  if (!currentPlaylist || currentSongIndex <= 0) {
    alert('已是第一首');
    return;
  }
//索引-1，切换上一首
  currentSongIndex--;
  await playSongByIndex(currentSongIndex);
}
async function playSongByIndex(index) {
  if (myAudio) {
    myAudio.pause();
    myAudio.src = '';
  }
  const song = currentPlaylist.tracks[index];
  if (!song) return;
  const playRes = await fetch(`http://localhost:3000/song/url?id=${song.id}`);
  const playData = await playRes.json();
  const playUrl = playData.data?.[0]?.url;

//播放歌曲
  myAudio.src = playUrl;
  await myAudio.play().catch(err => console.error('播放失败:', err));
//更新底部播放器信息
  playerSinger.innerHTML = song.ar[0].name;
  playerCover.src = song.al.picUrl;
  playerName.innerHTML = song.name;
  startSpin();
  playerBar.style.display = 'block';
  playPauseBtn.src = 'imgs/pause-red.png';
   currentLyricIndex = -1;
  if (lyricsContainer) lyricsContainer.innerHTML = '';
; 
   if (song.id)
    fetch(`http://localhost:3000/lyric?id=${song.id}`)
      .then(res => res.json())
      .then(res => {
        console.log('切换歌曲后歌词', res);
        const lyricStr = res.lrc?.lyric || res.tlyric?.lyric || '';
        const lyrics = parseLyrics(lyricStr);
        renderLyrics(lyrics);
        songNameoflrcPage.innerHTML=playerName.innerHTML
        singeroflrcPage.innerHTML=playerSinger.innerHTML
      })
      .catch(err => {
        console.error('切换歌曲请求歌词失败:', err);
        renderLyrics([{ time: 0, text: '歌词加载失败' }]);
      });
  }

//绑定上一首，下一首按钮
const lastSong = document.querySelector('.lastSong');
const nextSong = document.querySelector('.nextSong');
lastSong.addEventListener('click', playLastSong);
nextSong.addEventListener('click', playNextSong);

//上一页按钮（顶部）
const lastPageBtn=document.getElementById('lastPage')
lastPageBtn.addEventListener('click',lastPage)
function lastPage(){
  playlistDetail.style.display='none'
  content.style.display='block'
  searchPage.style.display='none'
}












function parseLyrics(lyricStr) {
  if (!lyricStr || lyricStr.trim() === '') {
    return [{ time: 0, text: '暂无歌词' }];
  }
  const lyricRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]([\s\S]*?)(?=\[|$)/g;
  const lyrics = [];
  let match;
  while ((match = lyricRegex.exec(lyricStr)) !== null) {
    //提取时间部分并转成秒
    const minutes = parseInt(match[1], 10); //分钟
    const seconds = parseInt(match[2], 10); //秒
    const milliseconds = parseInt(match[3], 10); //毫秒
    const ms = parseInt(match[3], 10); //先提取毫秒数
    const totalTime = minutes * 60 + seconds + ms / (match[3].length === 2 ? 100 : 1000);
    
    // 提取歌词文本（去除首尾空格，过滤空行）
    const lyricText = match[4].trim();
    if (lyricText) {
      lyrics.push({
        time: totalTime, //存储为秒单位，和 audio.currentTime 一致
        text: lyricText
      });
    }
  }

  //解析结果兜底
  return lyrics.length > 0 ? lyrics : [{ time: 0, text: '暂无歌词' }];
}

//歌词渲染函数
function renderLyrics(lyrics) {
  if (!lyricsContainer) return;
  lyricsContainer.innerHTML = '';
  lyrics.forEach((lyric, index) => {
    const lyricItem = document.createElement('div');
    lyricItem.className = 'lyric-item';
    lyricItem.dataset.time = lyric.time;
    lyricItem.textContent = lyric.text;
    lyricsContainer.appendChild(lyricItem);
  });
}

//歌词高亮/滚动函数
function updateLyricHighlight() {
  if (!myAudio.src || !lyricsContainer || lyricsContainer.children.length === 0) return;

  const currentTime = myAudio.currentTime;
  const lyricItems = lyricsContainer.querySelectorAll('.lyric-item');
  let targetIndex = -1;

  // 匹配当前时间对应的歌词
  for (let i = 0; i < lyricItems.length; i++) {
    const lyricTime = parseFloat(lyricItems[i].dataset.time);
    const nextLyricTime = i < lyricItems.length - 1 ? parseFloat(lyricItems[i+1].dataset.time) : Infinity;
    if (lyricTime <= currentTime && currentTime < nextLyricTime) {
      targetIndex = i;
      break;
    }
  }

  // 更新高亮和滚动
  if (targetIndex !== currentLyricIndex && targetIndex !== -1) {
    if (currentLyricIndex >= 0) {
      lyricItems[currentLyricIndex].classList.remove('active');
    }
    lyricItems[targetIndex].classList.add('active');
    currentLyricIndex = targetIndex;
    // 居中滚动
    lyricsContainer.scrollTop = lyricItems[targetIndex].offsetTop - lyricsContainer.clientHeight / 2 + lyricItems[targetIndex].clientHeight / 2;
  }
}













//请求歌词
const lyricsContainer=document.getElementById('lyricsContainer')
let currentLyricIndex = -1; // 当前高亮歌词索引
const lyricsPage=document.querySelector('.lyricsPage')
playerBar.addEventListener('click',showLyricsPage)
const songNameoflrcPage=document.getElementById('songNameoflrcPage')
const singeroflrcPage=document.getElementById('singeroflrcPage')
function showLyricsPage(e){
   if (e.target === progressBar || progressBar.contains(e.target)) {
    return;
  }
if (e.target === this) { 
    lyricsPage.style.display ='block';
  }
  if (e.target === playerCover) { 
    lyricsPage.style.display ='block';
  }
//改变唱片位置和大小
playerCover.style.position = 'absolute';
playerCover.style.left = '181px';
playerCover.style.top = '-700px';
playerCover.style.border = '76px solid rgb(0, 0, 0)';
playerCover.style.borderRadius = '50%';
playerCover.style.width = '327px';
playerCover.style.height = '327px';
//底部歌名和歌手的位置
playerName.style.left='56px'
playerName.style.width='260px'
playerSinger.style.left='56px'
//歌词上方的歌名和歌手
songNameoflrcPage.innerHTML=playerName.innerHTML
singeroflrcPage.innerHTML=playerSinger.innerHTML
//请求歌词
 fetch(`http://localhost:3000/lyric?id=${playerBar.id}`)
    .then(res => res.json())
    .then(res => {
      console.log('歌词', res);
      //提取歌词字符串（优先普通歌词，无则用翻译歌词）
      const lyricStr = res.lrc?.lyric || res.tlyric?.lyric || '';
      //解析歌词
      const lyrics = parseLyrics(lyricStr);
      //渲染歌词到容器
      renderLyrics(lyrics);
      //重置当前歌词索引（避免切换歌曲后高亮错位）
      currentLyricIndex = -1;
    })
    .catch(err => {
      console.error('请求歌词失败:', err);
      // 失败时渲染默认提示
      renderLyrics([{ time: 0, text: '歌词加载失败' }]);
    });
}




//退出歌词界面
const backoffBtn=document.getElementById('backoffBtn')
backoffBtn.addEventListener('click',backoff)
function backoff(){
  lyricsPage.style.display='none'
  //唱片恢复
  playerCover.style.position = 'absolute';
playerCover.style.left = '40px';
playerCover.style.top = '15px';
playerCover.style.border = '15px solid black';
playerCover.style.borderRadius = '50%';
playerCover.style.width = '62px';
playerCover.style.height = '62px';
//名字恢复
playerName.style.left='150px'
playerName.style.width='115px'
playerSinger.style.left='150px'
}