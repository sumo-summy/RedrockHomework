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
