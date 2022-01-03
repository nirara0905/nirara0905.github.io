'use strict';

{

  const start = document.querySelector('h2');
  const title = document.querySelectorAll('span');
  const titleText = title[0].textContent;
  console.log(title);
  console.log(titleText);

  // title.forEach(title => {

  // });
  // start.addEventListener('click',()=>{
  //   for(let i = 0;i < title.length;i++){
  //     title[i].classList.add('show')
  //   }
  // });
  for(let i = 0;i < title.length;i++){
    title[i].classList.add('show');
  }


}