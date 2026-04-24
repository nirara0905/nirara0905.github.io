'use strict';

const kindsObject = {
  all    : '全て',
  logo   : 'ロゴ制作',
  card   : '名刺・カード制作',
  pamph  : 'パンフレット制作',
  flyer  : 'チラシ・ポスター制作',
  sign   : '看板制作',
  web    : 'WEB制作',
  others : 'その他',
};

let works_lists = null;

/* build filter buttons */
const nav_btns = createNavBtn(kindsObject);
nav_btns.forEach(btn => btn.addEventListener('click', () => navBtnClick(btn)));

function createNavBtn(obj) {
  const btns = [];
  Object.keys(obj).forEach(key => {
    const li = document.createElement('li');
    li.classList.add('nav_btn');
    if (key === 'all') li.classList.add('active');
    li.textContent = obj[key].replace('制作', '');
    li.dataset.kinds = key;
    btns.push(li);
    document.querySelector('.nav_btn_box').appendChild(li);
  });
  return btns;
}

function navBtnClick(btn) {
  document.querySelector('.nav_btn_box .active').classList.remove('active');
  btn.classList.add('active');
  const kind = btn.dataset.kinds;
  createImgWorks(kind === 'all' ? works_lists : works_lists.filter(w => w.kinds === kind));
}

/* fetch works data */
(async () => {
  try {
    const res  = await fetch('assets/js/img_file_names.json');
    works_lists = await res.json();
    works_lists.sort((a, b) => b.date - a.date);
    createImgWorks(works_lists);
  } catch (e) {
    console.error('works fetch error:', e);
  }
})();

/* render grid */
function createImgWorks(arr) {
  const box = document.querySelector('#works_list_box');
  box.innerHTML = '';
  arr.forEach(work => {
    const li = document.createElement('li');
    li.classList.add('works_list');
    li.dataset.kinds = work.kinds;

    const name = document.createElement('p');
    name.classList.add('works_company_name');
    name.textContent = work.company + '様';
    name.style.pointerEvents = 'none';

    const img = document.createElement('img');
    img.classList.add('works_list_img');
    img.src = 'assets/works/' + work.fileName;
    img.alt = work.company + '様 ' + kindsObject[work.kinds];
    img.loading = 'lazy';
    img.style.pointerEvents = 'none';

    const date = document.createElement('p');
    date.classList.add('works_date');
    date.textContent = '20' + String(work.date).slice(0,2) + '/' + String(work.date).slice(2);
    date.style.pointerEvents = 'none';

    li.appendChild(name);
    li.appendChild(img);
    li.appendChild(date);
    box.appendChild(li);
  });
}

/* click → modal */
document.querySelector('#works_list_box').addEventListener('click', e => {
  const li = e.target.closest('.works_list');
  if (li) openPickup(li);
});

function openPickup(li) {
  const content = document.querySelector('.pickup_content');
  content.querySelector('.pickup_kinds').textContent        = kindsObject[li.dataset.kinds] || '';
  content.querySelector('.pickup_company_name').textContent = li.querySelector('.works_company_name').textContent;
  content.querySelector('.pickup_date').textContent         = li.querySelector('.works_date').textContent;
  content.querySelector('.pickup_img').src                  = li.querySelector('.works_list_img').src;
  document.querySelector('.pickup_work').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePickup() {
  document.querySelector('.pickup_work').classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelector('.pickup_delete_btn').addEventListener('click', closePickup);
document.querySelector('.pickup_mask').addEventListener('click', closePickup);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePickup(); });
