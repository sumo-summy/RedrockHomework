

let myAudio = document.createElement('audio');
myAudio.classList.add('myAudio');
const playPauseBtn = document.querySelector('.displayPause');
const progressBar = document.getElementById('progressBar');
const allBanners=document.querySelector('.allBanners')
const lastGroup = document.getElementById('lastGroup');
const nextGroup = document.getElementById('nextGroup');
let currentPlaylist = null; 
let currentSongIndex = -1; 
  
let group = 0;
let banners = [];
// 轮播图
function autoSwitch(banners) {
  allBanners.innerHTML = '';
  const start = group * 3;
  const end = start + 3;
  const showBanners = banners.slice(start, end);

  for (let i = 0; i < showBanners.length; i++) {
    const item = showBanners[i];
    const banner = document.createElement('div');
    banner.className = 'banner';
    const bannerImg = document.createElement('img');
    bannerImg.className='bannerImg'
    bannerImg.src = item.bigImageUrl;
    const typeTitle=document.createElement('div')
    typeTitle.classList.add('typeTitle')
    typeTitle.innerHTML=item.typeTitle
    banner.appendChild(typeTitle)
    banner.appendChild(bannerImg);
    allBanners.appendChild(banner);
  }

  group = (end < banners.length) ? group + 1 : 0;
  setTimeout(() => autoSwitch(banners),5000);
}


function switchGroup(type) {
  const maxGroup = 2;
  //type=last：上一组  type=next：下一组
  if (type === 'last') {
    group = group === 0 ? maxGroup : group - 1;//第一组切最后一组
  } else {
    group = group === maxGroup ? 0 : group + 1;//最后一组切第一组
  }
  //原有渲染逻辑，更新页面
    allBanners.innerHTML = '';
    const start = group * 3;
    const end = start + 3;
    const showBanners = banners.slice(start, end);
    showBanners.forEach(item => {
    const banner = document.createElement('div');
    banner.className = 'banner';
    const bannerImg = document.createElement('img');
    bannerImg.className='bannerImg';
    bannerImg.src = item.bigImageUrl;
    const typeTitle=document.createElement('div')
    typeTitle.classList.add('typeTitle')
    typeTitle.innerHTML=item.typeTitle
    banner.appendChild(typeTitle)
    banner.appendChild(bannerImg);
    allBanners.appendChild(banner);
  });
}


fetch('http://localhost:3000/banner')
  .then(res => res.json())
  .then(res => {
    console.log('轮播图', res);
    banners=res.banners;
    autoSwitch(banners);
    lastGroup.onclick = () => switchGroup('last');
    nextGroup.onclick = () => switchGroup('next');
  })








  

const menuItems = document.querySelectorAll('.menuItems');
   
            
// 为每个菜单项添加点击事件
menuItems.forEach(item => {
item.addEventListener('click', function(event) {
                   
console.log('点击了:', this.id);
                    
// 移除所有active类
menuItems.forEach(menuItem => {
menuItem.classList.remove('active');
    });
                    
// 给当前点击的添加active类
 this.classList.add('active');
                  
              
  });
});

const content=document.querySelector('.content')
 const recommendationPage=document.querySelector('.rcmd');    
 const featuredPage=document.querySelector('.featuredPage');
 const likedMusicpage=document.querySelector('.likedMusicpage')       
 //显示推荐页面      
function showRecommendationpage(){
  content.style.display='block'
  playlistDetail.style.display='none'
   featuredPage.classList.remove('active');
   likedMusicpage.classList.remove('active')
   recommendationPage.classList.add('active');
}
//点击触发
document.getElementById("tj").addEventListener("click",showRecommendationpage);        
  
 //显示歌单      
function showFeaturedpage(){
    content.style.display='block'
  playlistDetail.style.display='none'
   likedMusicpage.classList.remove('active')
   recommendationPage.classList.remove('active');
   featuredPage.classList.add('active');
}
//点击触发
document.getElementById("jx").addEventListener("click",showFeaturedpage);        
    
//我喜欢的音乐      
function showlikedMusicpage(){
    content.style.display='block'
  playlistDetail.style.display='none'
   featuredPage.classList.remove('active');
   recommendationPage.classList.remove('active');
   likedMusicpage.classList.add('active')
}
//点击触发
document.getElementById("likedMusic").addEventListener("click",showlikedMusicpage);




//分类按钮切换效果
const categoryBtns=document.querySelectorAll('.category');
categoryBtns.forEach(item=>{
  item.addEventListener('click',function(event){
    console.log('点击了:', this.id);

    categoryBtns.forEach(categoryBtns=>{
      categoryBtns.classList.remove('active');
    });
    this.classList.add('active');
  })
})





//向推荐歌单接口发送请求
fetch(`http://localhost:3000/personalized/playlist`)
    .then(res => res.json())
    .then(res => 
      {console.log('res', res)
        const result=res.result

      creatRecommendedPlaylist(result)
    })

    const recommendedPlaylistscontainer=document.querySelector('.recommendedPlaylistscontainer')

function creatRecommendedPlaylist(result){ 
  for(let i=0;i<6;i++){
    const recommendedPlaylistCard=document.createElement('div');
    recommendedPlaylistCard.classList.add('recommendedPlaylistCard')
    recommendedPlaylistscontainer.appendChild(recommendedPlaylistCard)
    const rcmdimg=document.createElement('img');
    rcmdimg.classList.add('rcmdimg')
    recommendedPlaylistCard.appendChild(rcmdimg)

rcmdimg.src = result[i].picUrl
   // recommendedPlaylistCard.style.backgroundImage = `url("${result[i].picUrl}")`;


  const rcmdPlaylistText=document.createElement('div')
  rcmdPlaylistText.classList.add('rcmdPlaylistText')
  recommendedPlaylistCard.appendChild(rcmdPlaylistText)
  rcmdPlaylistText.innerHTML=result[i].name;
//播放数量
const playCount=document.createElement('div')
playCount.classList.add('playCount')
recommendedPlaylistCard.appendChild(playCount)
playCount.innerHTML=(result[i].playCount/10000).toFixed(1)+'万'





  }
}


const categories = ['华语', '摇滚', '民谣', '电子', '轻音乐'];
const playlistData = {};

async function fetchAllPlaylists() {
  for (const cat of categories) {
    const res = await fetch(`http://localhost:3000/playlist/category/list?cat=${cat}`);
    const data = await res.json();
    playlistData[cat] = data.playlists;
  }
  console.log('所有分类数据：', playlistData);
  bindBtnClick();
  const chinesePlaylists = playlistData['华语'];
  const rockPlaylists = playlistData['摇滚'];
  const folkPlaylists = playlistData['民谣'];
  const electronicPlaylists = playlistData['电子'];
  const lightMusicPlaylists = playlistData['轻音乐'];

  const playlistCardsContainer = document.querySelector('.playlistCardsContainer');

  async function createPlaylistCards(playlist) {
     playlistCardsContainer.innerHTML = '';
    for (let i = 0; i < playlist.length; i++) {
//创建卡片
      const playlistCard = document.createElement('div');
      playlistCard.classList.add('playlist');
      playlistCard.id=playlist[i].id
      playlistCardsContainer.appendChild(playlistCard);
//添加图片
    const playlistCardimg=document.createElement('img');
    playlistCardimg.classList.add('playlistCardimg')
    playlistCard.appendChild(playlistCardimg)
   playlistCardimg.src = playlist[i].coverImgUrl
//卡片背景颜色
    const bgColor = await getImageAverageColor(playlist[i].coverImgUrl);
    playlistCard.style.backgroundColor = bgColor; 
//添加文字
    const playlistCardText=document.createElement('div')
    playlistCardText.classList.add('playlistCardText')
    playlistCard.appendChild(playlistCardText)
    playlistCardText.innerHTML=playlist[i].name
    //添加播放量
    const playCount=document.createElement('div')
    playCount.classList.add('playCount2')
    playlistCard.appendChild(playCount)
   playCount.innerHTML=(playlist[i].playCount/10000).toFixed(1)+'万'

    }
    //这是歌单卡片被点击时出发的事件（页面跳转到歌单详情）
 bindPlaylistEvents();

  }
createPlaylistCards(chinesePlaylists);
function bindBtnClick() {
  // 给每个按钮加点击事件
  document.getElementById('btn-Chinese').onclick = () => createPlaylistCards(playlistData['华语']);
  document.getElementById('btn-rock').onclick = () => createPlaylistCards(playlistData['摇滚']);
  document.getElementById('btn-folk').onclick = () => createPlaylistCards(playlistData['民谣']);
  document.getElementById('btn-electronic').onclick = () => createPlaylistCards(playlistData['电子']);
  document.getElementById('btn-lightMusic').onclick = () => createPlaylistCards(playlistData['轻音乐']);
}
}

fetchAllPlaylists();


//提取图片平均颜色的函数 来源：豆包
function getImageAverageColor(imgUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // 解决跨域
    img.src = imgUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 50; // 缩小计算，提升性能
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        // 计算平均色并加深（保证文字清晰）
        const avgR = Math.floor((r / count) * 0.7);
        const avgG = Math.floor((g / count) * 0.7);
        const avgB = Math.floor((b / count) * 0.7);
        resolve(`rgb(${avgR}, ${avgG}, ${avgB})`);
      } catch (e) {
        resolve('#333'); // 出错用默认深色
      }
    };
    img.onerror = () => resolve('#333'); // 图片加载失败用默认色
  });
}

function bindPlaylistEvents() {
//获取所有歌单卡片
const playlistCards = document.querySelectorAll('.playlist');

//给每个卡片绑定点击事件
playlistCards.forEach(card => {
card.addEventListener('click', async () => {
//获取歌单id
const playlistId = card.id;
console.log('点击的歌单id:', playlistId);
//用这个id去请求歌单详情
    try {
      const response = await fetch(`http://localhost:3000/playlist/detail?id=${playlistId}`);
      const data = await response.json();
      console.log('歌单详情数据:', data);
      // 在这里可以把数据渲染到歌单详情页面上
    createPlaylistDetailPage(data.playlist)
    } catch (error) {
      console.error('请求歌单详情失败:', error);
    }
  });
});
}

const cover1=document.querySelector('.cover1')
const playlistDetail=document.querySelector('.playlistDetail')
const playlistName=document.querySelector('.playlistName')
const playlistDescription=document.querySelector('.playlistDescription')
const nicknameOfCreator=document.querySelector('.nicknameOfCreator')
const avatar=document.querySelector('.avatar')
const createTime=document.querySelector('.createTime')
const playCountOnCover=document.querySelector('.playCountOnCover')
const songCardContainer=document.querySelector('.songCardContainer')
//渲染歌单详情的页面




function createPlaylistDetailPage(playlist){
  //把其他界面隐藏
const content = document.querySelector('.content');
if (content) {
  content.style.display = 'none';
}
//显示歌单详情页面
playlistDetail.style.display='block'
//渲染数据
cover1.src=playlist.coverImgUrl
playlistName.innerHTML=playlist.name
playlistDescription.innerHTML=playlist.description
nicknameOfCreator.innerHTML=playlist.creator.nickname
avatar.src=playlist.creator.avatarUrl
playCountOnCover.innerHTML=(playlist.playCount/10000).toFixed(1)+'万'
//时间
const timestamp = playlist.createTime
const date = new Date(timestamp);
const year = date.getFullYear();
const month = date.getMonth() + 1; 
const day = date.getDate();
const result = `${year}-${month}-${day}创建`;
createTime.innerHTML=result
songCardContainer.innerHTML = '';//清空容器
//提前声明，方便后续歌曲暂停


//创建歌单内的歌曲列表
for(let i=0;i<playlist.tracks.length;i++){
  //歌曲卡片
const songCard=document.createElement('div')
songCard.classList.add('songCard')
songCard.id=playlist.tracks[i].id
songCardContainer.appendChild(songCard)
//歌曲图片
const songImg=document.createElement('img')
songImg.classList.add('songImg')
songCard.appendChild(songImg)
songImg.src=playlist.tracks[i].al.picUrl
//歌名
const songName=document.createElement('div')
songName.classList.add('songName')
songCard.appendChild(songName)
songName.innerHTML=playlist.tracks[i].name

//歌手
for(let a=0;a<playlist.tracks[i].ar.length;a++){
const singerName=document.createElement('div')
singerName.classList.add('singerName')
songCard.append(singerName)
singerName.innerHTML=playlist.tracks[i].ar[a].name

}
//专辑
const albumName=document.createElement('div')
albumName.classList.add('albumName')
songCard.append(albumName)
albumName.innerHTML=playlist.tracks[i].al.name



songCard.onclick = async function() {
  // 把当前歌单存到全局
  currentPlaylist = playlist; 
  currentSongIndex = i; 
  //正在播放的音乐暂停
 if(myAudio){
  myAudio.pause();
   myAudio.src = ''
 }
  

//请求播放链接
const playRes = await fetch(`http://localhost:3000/song/url?id=${songCard.id}`);
const playData = await playRes.json();
const playUrl = playData.data?.[0]?.url;

myAudio.src=playUrl
//播放
  if (playUrl) {
    myAudio.src = playUrl;
    myAudio.play();
  }
    //渲染底部信息
const singerElement=this.querySelector('.singerName')
playerSinger.innerHTML=singerElement.innerHTML
const coverElement=this.querySelector('.songImg')
playerCover.src=coverElement.src
const nameElement=this.querySelector('.songName')
playerName.innerHTML=nameElement.innerHTML
startSpin()
//显示底部
playerBar.style.display='block'


};
}
}

const playerBar=document.querySelector('.playerBar')
const playerName=document.querySelector('.playerName')
const playerSinger=document.querySelector('.playerSinger')
const playerCover=document.querySelector('.playerCover')



function togglePlay() {
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
    progressBar.value = (myAudio.currentTime / myAudio.duration) * 100;
  }
}
// 拖动进度条调整播放位置
function seekProgress(e) {
  if (myAudio.duration && myAudio.src) {
    myAudio.currentTime = (e.target.value / 100) * myAudio.duration;
  }
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
async function playNextSong() {
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
async function playLastSong() {
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
}