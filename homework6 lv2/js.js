const input = document.querySelector('input');
const comments=document.querySelector('.comments')
input.addEventListener('input',function(){
    console.log(input.value)
})
input.addEventListener('keyup',function(e){
    if(e.key==='Enter'){
        addDiv()
    }
})
const btn=document.querySelector('button');
btn.addEventListener('click',addDiv)
function addDiv(){
    if(input.value.trim()==='')
        return alert('请输入内容')

    const div =document.createElement('div');
    div.className='comment';


    const name=document.createElement('p');
    name.className='name';
    name.innerHTML='大菠萝oioi';

    const content=document.createElement('p')
    content.className='content';
    content.innerHTML=input.value;
    input.value=' ';

    const now=new Date()
    const time=document.createElement('p');
    time.className='time';
    time.innerHTML=now.toString();

    const button=document.createElement('button');
    button.className='del';
    button.innerText= '删除';
    button.onclick = function() {
        comments.removeChild(div);

    }
    div.appendChild(name);
    div.appendChild(content);
    div.appendChild(time);
    div.appendChild(button);
    comments.appendChild(div)
}