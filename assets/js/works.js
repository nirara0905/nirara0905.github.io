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
let visibleWorks = [];
let activeWorkIndex = -1;
let activeTrigger = null;

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
    const res  = await fetch('assets/js/img_file_names.json', { cache: 'no-cache' });
    works_lists = (await res.json()).filter(work => work.published !== false);
    works_lists.sort((a, b) => b.date - a.date);
    createImgWorks(works_lists);
  } catch (e) {
    console.error('works fetch error:', e);
  }
})();

/* render grid */
function createImgWorks(arr) {
  const box = document.querySelector('#works_list_box');
  visibleWorks = arr;
  box.innerHTML = '';
  arr.forEach((work, index) => {
    const li = document.createElement('li');
    li.classList.add('works_list');
    li.dataset.kinds = work.kinds;
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `${work.company}様 ${kindsObject[work.kinds]}の制作実績を拡大`);
    li.dataset.index = String(index);

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
  activeWorkIndex = Number(li.dataset.index);
  activeTrigger = li;
  showPickup(activeWorkIndex);
  const modal = document.querySelector('.pickup_work');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  document.body.style.overflow = 'hidden';
  document.querySelector('.pickup_delete_btn').focus();
}

function showPickup(index) {
  activeWorkIndex = (index + visibleWorks.length) % visibleWorks.length;
  const work = visibleWorks[activeWorkIndex];
  const content = document.querySelector('.pickup_content');
  const image = content.querySelector('.pickup_img');
  content.querySelector('.pickup_kinds').textContent = kindsObject[work.kinds] || '';
  content.querySelector('.pickup_company_name').textContent = `${work.company}様`;
  content.querySelector('.pickup_date').textContent = `20${String(work.date).slice(0, 2)}/${String(work.date).slice(2)}`;
  content.querySelector('.pickup_counter').textContent = `${activeWorkIndex + 1} / ${visibleWorks.length}`;
  image.src = `assets/works/${work.fileName}`;
  image.alt = `${work.company}様 ${kindsObject[work.kinds]}の制作実績`;
}

function closePickup() {
  const modal = document.querySelector('.pickup_work');
  modal.classList.remove('active');
  modal.removeAttribute('aria-modal');
  modal.removeAttribute('role');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (activeTrigger) activeTrigger.focus();
  activeTrigger = null;
}

document.querySelector('.pickup_delete_btn').addEventListener('click', closePickup);
document.querySelector('.pickup_mask').addEventListener('click', closePickup);
document.querySelector('.pickup_prev').addEventListener('click', () => showPickup(activeWorkIndex - 1));
document.querySelector('.pickup_next').addEventListener('click', () => showPickup(activeWorkIndex + 1));

document.querySelector('#works_list_box').addEventListener('keydown', e => {
  const li = e.target.closest('.works_list');
  if (li && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    openPickup(li);
  }
});

document.addEventListener('keydown', e => {
  if (!document.querySelector('.pickup_work').classList.contains('active')) return;
  if (e.key === 'Escape') closePickup();
  if (e.key === 'ArrowLeft') showPickup(activeWorkIndex - 1);
  if (e.key === 'ArrowRight') showPickup(activeWorkIndex + 1);
});

let pointerStartX = null;
const pickupImageBox = document.querySelector('.pickup_img_box');
pickupImageBox.addEventListener('pointerdown', e => { pointerStartX = e.clientX; });
pickupImageBox.addEventListener('pointerup', e => {
  if (pointerStartX === null) return;
  const deltaX = e.clientX - pointerStartX;
  pointerStartX = null;
  if (Math.abs(deltaX) < 45) return;
  showPickup(activeWorkIndex + (deltaX < 0 ? 1 : -1));
});
pickupImageBox.addEventListener('pointercancel', () => { pointerStartX = null; });
