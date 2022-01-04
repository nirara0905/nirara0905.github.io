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
  // window.onload = function() {
  //   title.forEach(title => {
  //     setTimeout(() => {
  //       title.classList.add('show')
  //     }, 1000);
  //   });
  // }
  
  window.onload = function() {
    for(let i = 0;i < title.length;i++){
      setTimeout(() => {
        title[i].classList.add('show')
      }, (i+1) * 100);
    }
  }

  // window.onload = function() {
  //   setTimeout(() => {
  //     title[0].classList.add('show')
  //   }, 100);
  //   setTimeout(() => {
  //     title[1].classList.add('show')
  //   }, 200);
  //   setTimeout(() => {
  //     title[2].classList.add('show')
  //   }, 300);
  //   setTimeout(() => {
  //     title[3].classList.add('show')
  //   }, 400);
  //   setTimeout(() => {
  //     title[4].classList.add('show')
  //   }, 500);
  //   setTimeout(() => {
  //     title[5].classList.add('show')
  //   }, 600);
  //   setTimeout(() => {
  //     title[6].classList.add('show')
  //   }, 700);
  //   setTimeout(() => {
  //     title[7].classList.add('show')
  //   }, 800);
  //   setTimeout(() => {
  //     title[8].classList.add('show')
  //   }, 900);
  //   setTimeout(() => {
  //     title[9].classList.add('show')
  //   }, 1000);
  //   setTimeout(() => {
  //     title[10].classList.add('show')
  //   }, 1100);
  //   setTimeout(() => {
  //     title[11].classList.add('show')
  //   }, 1200);
  //   setTimeout(() => {
  //     title[12].classList.add('show')
  //   }, 1300);
  //   setTimeout(() => {
  //     title[13].classList.add('show')
  //   }, 1400);
  //   setTimeout(() => {
  //     title[14].classList.add('show')
  //   }, 1500);
  //   setTimeout(() => {
  //     title[15].classList.add('show')
  //   }, 1600);
  //   setTimeout(() => {
  //     title[16].classList.add('show')
  //   }, 1700);
  // }



}