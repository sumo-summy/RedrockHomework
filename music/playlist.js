const playerBar=document.querySelector('.playerBar')
const playerName=document.querySelector('.playerName')
const playerSinger=document.querySelector('.playerSinger')
const playerCover=document.querySelector('.playerCover')

const cover1=document.querySelector('.cover1')
const playlistDetail=document.querySelector('.playlistDetail')
const playlistName=document.querySelector('.playlistName')
const playlistDescription=document.querySelector('.playlistDescription')
const nicknameOfCreator=document.querySelector('.nicknameOfCreator')
const avatar=document.querySelector('.avatar')
const createTime=document.querySelector('.createTime')
const playCountOnCover=document.querySelector('.playCountOnCover')
const songCardContainer=document.querySelector('.songCardContainer')



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
    //这是歌单卡片被点击时触发的事件（页面跳转到歌单详情）
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
        //计算平均色并加深（保证文字清晰）
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



songCard.onclick = async function() {
  const pb = document.querySelector('.playerBar');
  // 2. 强制赋值ID（用this.id，this就是当前点击的songCard，100%有值）
  if (pb) pb.id = this.id;
  // 3. 验证：控制台打印结果，能看到赋值成功
  console.log('playerBar赋值结果', pb ? pb.id : '没找到playerBar', '当前歌曲ID：', this.id);
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



document.addEventListener('click', async function(e) {
  const songCard = e.target.closest('.songCard');
  if (!songCard) return; 


  const songId = songCard.id;
  console.log('歌曲ID', songId);


  setTimeout(() => {
    const allPlayerBars = document.querySelectorAll('.playerBar');
    allPlayerBars.forEach(pb => {
      pb.setAttribute('id', songId);
      console.log('playerBar改ID成功', pb.id);
    });
  }, 100);
});