const readMoreBtn = document.querySelector('#read-more');
 readMoreBtn.addEventListener('click',(e)=>{
     if (readMoreBtn.innerText === 'Read More') {
         readMoreBtn.innerText ='Read Less';
     }
     else{
         readMoreBtn.innerText = 'Read More';
     }
 });