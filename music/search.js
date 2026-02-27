const searchBtn=document.querySelector('.searchBtn')
const searchPage=document.querySelector('.searchPage')
const inputBox=document.querySelector('.searchBox')
const keywordsBox=document.querySelector('.keywordsBox')
const singerCardContainer=document.querySelector('.singerCardContainer')
let globalSearchResult = null;
searchBtn.addEventListener('click',showSearchPage)
inputBox.addEventListener('keyup',function(e){
    if(e.key==='Enter'){
        showSearchPage()
    }
})
function showSearchPage(){
    //保存输入框关键词
    const keywords=inputBox.value;
    keywordsBox.innerHTML=inputBox.value
    //页面上显示的搜索关键字
    console.log(keywords)
 fetch('http://localhost:3000/search/suggest/multimatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords: keywords })
  })
  .then(res => res.json())
  .then(data => {
  console.log('搜索结果:', data);
  inputBox.value = ''; // 清空输入框
  globalSearchResult=data.result
  console.log(globalSearchResult)
  //搜索结果-歌手
for(let i=0;i<globalSearchResult.artists.length;i++){
    const singerCard=document.createElement('div')
    singerCard.className='singerCard'
    singerCardContainer.appendChild(singerCard)
    const singerCardImg=document.createElement('img')
    singerCardImg.className='singerCardImg'
    singerCard.appendChild(singerCardImg)
    singerCardImg.src=globalSearchResult.artists[i].picUrl
    const singerNameResult=document.createElement('div')
    singerNameResult.classList='singerNameResult'
    singerCard.appendChild(singerNameResult)
    singerNameResult.innerHTML=globalSearchResult.artists[i].name
}
})

//显示搜索页面
searchPage.style.display='block'
}