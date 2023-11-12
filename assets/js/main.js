'use strict';

const kindsObject = {
  all : '全て' ,
  logo : 'ロゴ制作' ,
  card : '名刺・カード制作' ,
  pamph : 'パンフレット制作' ,
  flyer : 'チラシ・ポスター制作' ,
  sign : '看板制作' ,
  web : 'WEB制作',
  others : 'その他'
};

let works_lists = null;
const nav_btns = createNavBtn(kindsObject);
nav_btns.forEach(nav_btn => {
  nav_btn.addEventListener('click', () => {navBtnClick(nav_btn);});
});

function navBtnClick(nav_btn){
  const click_kinds = nav_btn.dataset.kinds ; 
  const active_Kinds = document.querySelector(".nav_btn_box").querySelector(".active");
  active_Kinds.classList.remove('active');
  nav_btn.classList.add('active');
  if(click_kinds === 'all'){
    createImgWorks(works_lists);
  }else {
    const click_kinds_works = works_lists.filter(works_list => {
      return works_list.kinds === click_kinds;
    })
    createImgWorks(click_kinds_works);
  }
}

function createNavBtn(kindsObject){
  const nav_btns = [];
  Object.keys(kindsObject).forEach(key => {
    console.log(kindsObject[key]);
    const li = document.createElement('li');
    li.classList.add('nav_btn');
    if(key === 'all'){
      li.classList.add('active');
    }
    li.textContent = kindsObject[key].replace('制作','');
    li.dataset.kinds = key;
    nav_btns.push(li);
    document.querySelector('.nav_btn_box').appendChild(li);
  });
  return nav_btns;
}

async function fetchText(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

(async () => {
  try {
    // fetchTextからの戻り値を待つ
    works_lists = await fetchText('assets/js/img_file_names.json');
    
    works_lists = JSON.parse(works_lists);
    works_lists.sort((a,b) =>  b.date - a.date );
    createImgWorks(works_lists);

  } catch (error) {
    console.error('データ取得中にエラーが発生しました:', error);
  }
})();

(async () => {
  try {
    // ローカル環境でのjpgが入ったファイルをjsonデータへ変換
    // let works_list_json = null;
    // works_list_json = await fetchText('assets/works');
    // works_list_json = works_list_json.slice(works_list_json.indexOf('<ul>')+4,works_list_json.indexOf('</ul>')).split('<li>');
    // works_list_json.shift();
    // works_list_json.shift();
    // works_list_json = works_list_json.map(value => {
    //   const fileName = decodeURIComponent(value.split('"')[1]);
    //   const fileSplit = fileName.split('_');
    //   const obj = { 
    //     fileName : fileName ,
    //     kinds : fileSplit[1] , 
    //     date : Number(fileSplit[2]) , 
    //     company : fileSplit[3] ,
    //   }
    //   return obj;
    // });
    // ローカル環境でのjsonファイル出力
    // console.log(JSON.stringify(works_list_json));

  } catch (error) {
    console.error('データ取得中にエラーが発生しました:', error);
  }
})();



const works_list_parent = document.querySelector('#works_list_box');

works_list_parent.addEventListener('click',e => {
  createPickupWork(e.target);
});

function createImgWorks(worksArr){
  document.querySelector('#works_list_box').innerHTML = '';
  worksArr.forEach(work => {
    const li = document.createElement('li');
    li.classList.add('works_list');
    li.dataset.kinds = work.kinds;
    
    const pName = document.createElement('p');
    pName.classList.add('works_company_name');
    pName.textContent = work.company+'様';
    li.appendChild(pName);

    const img = document.createElement('img');
    img.classList.add('works_list_img');
    img.src = "assets/works/"+work.fileName;
    li.appendChild(img);

    const pDate = document.createElement('p');
    pDate.classList.add('works_date');
    pDate.textContent = "20"+String(work.date).slice(0,2)+"/"+String(work.date).slice(2);
    li.appendChild(pDate);
    
    document.querySelector('#works_list_box').appendChild(li)
  });
}

function createPickupWork(target){
  const pickup_work = document.querySelector('.pickup_work');
  const pickup_content = document.querySelector('.pickup_content');
  pickup_work.classList.add('active');
  

  pickup_content.querySelector('.pickup_kinds').textContent = kindsObject[target.dataset.kinds];
  pickup_content.querySelector('.pickup_company_name').textContent = target.querySelector('.works_company_name').textContent;
  pickup_content.querySelector('.pickup_date').textContent = target.querySelector('.works_date').textContent;
  pickup_content.querySelector('.pickup_img').src = target.querySelector('.works_list_img').src;
}



const pickup_delete_btn = document.querySelector('.pickup_delete_btn');
const pickup_mask = document.querySelector('.pickup_mask');
pickup_delete_btn.addEventListener('click', () => {deletePickup();});
pickup_mask.addEventListener('click', () => {deletePickup();});


function deletePickup(){
  const pickup_work = document.querySelector('.pickup_work');
  pickup_work.classList.remove('active');
}
