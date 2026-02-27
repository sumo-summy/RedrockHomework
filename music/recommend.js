
let result=[]
//向推荐歌单接口发送请求
fetch(`http://localhost:3000/personalized/playlist`)
    .then(res => res.json())
    .then(res => 
      {console.log('推荐歌单', res)
       result=res.result

      creatRecommendedPlaylist(result,a,b)
    })

    const recommendedPlaylistscontainer=document.querySelector('.recommendedPlaylistscontainer')


const refreshBtn=document.getElementById('refreshBtn')
let a=0,b=6
function refresh() {
    if (b < result.length) { 
       a+=6;
        b += 6;
    } else {
        a = 0;
        b = 6;
    }
    console.log('已刷新')
    console.log(a,b)
    recommendedPlaylistscontainer.innerHTML = '';
    creatRecommendedPlaylist(result,a,b);
}


refreshBtn.addEventListener('click', refresh);
function creatRecommendedPlaylist(result,start,end){ 
  console.log(start,end,)
  for(let i=start;i<end && i < result.length;i++){
    const recommendedPlaylistCard=document.createElement('div');
    console.log(i)
    recommendedPlaylistCard.classList.add('recommendedPlaylistCard')
    recommendedPlaylistscontainer.appendChild(recommendedPlaylistCard)
    const rcmdimg=document.createElement('img');
    rcmdimg.classList.add('rcmdimg')
    recommendedPlaylistCard.appendChild(rcmdimg)

rcmdimg.src = result[i].picUrl
  const rcmdPlaylistText=document.createElement('div')
  rcmdPlaylistText.classList.add('rcmdPlaylistText')
  recommendedPlaylistCard.appendChild(rcmdPlaylistText)
  rcmdPlaylistText.innerHTML=result[i].name;
//播放数量
const playCount=document.createElement('div')
playCount.classList.add('playCount')
recommendedPlaylistCard.appendChild(playCount)
playCount.innerHTML=(result[i].playCount/10000).toFixed(1)+'万'

    recommendedPlaylistCard.id=result[i].id



  }
  
  rcmdPlaylistEvents()
}



function rcmdPlaylistEvents() {
const recommendedPlaylistCard = document.querySelectorAll('.recommendedPlaylistCard');

//给每个卡片绑定点击事件
recommendedPlaylistCard.forEach(card => {
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
const subscribedCount=document.getElementById('subscribedCount')
subscribedCount.innerHTML=playlist.subscribedCount
songCardContainer.innerHTML = '';//清空容器
//歌曲数
const songNumgq=document.getElementById('songNum')
songNumgq.innerHTML=playlist.tracks.length


//创建歌单内的歌曲列表
for(let i=0;i<playlist.tracks.length;i++){
  //歌曲卡片
const songCard=document.createElement('div')
songCard.classList.add('songCard')
songCard.id=playlist.tracks[i].id
songCardContainer.appendChild(songCard)
//序号
const songNum=document.createElement('div')
songNum.classList.add('songNum')
songCard.appendChild(songNum)
if(i<9){
  songNum.innerHTML='0'+(i+1)
}else{
  songNum.innerHTML=i+1
}
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
//喜欢
const heart=document.createElement('div')
heart.className='heart'
songCard.appendChild(heart)


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
 playPauseBtn.src='imgs/pause-red.png';
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
