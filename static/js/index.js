let page = 0;
let keyword;
let fetching = false;
const getPage = async () => {
  fetching = true;
  const container = document.querySelector('.container');
  if (page === null) {
    console.log('沒資料');
    return;
  }
  let url = '';
  if (keyword) {
    url = `/api/attractions?page=${page}&keyword=${keyword}`;
  } else {
    url = `/api/attractions?page=${page}`;
  }
  let data = await fetch(url);
  let parseData = await data.json();

  page = parseData.nextPage;

  if (parseData.data.length !== 0) {
    let getData = parseData.data;
    for (let i = 0; i < 12; i++) {
      let imgOb = new Image();
      imgOb.src = getData[i].images[0];
      imgOb.fetchPriority = 'high';
      //   let img_url = getData[i].images[0];
      let name = getData[i].name;
      let mrtData = getData[i].mrt;
      let catData = getData[i].category;
      let id = getData[i].id;

      const secondDiv = document.createElement('div');
      secondDiv.classList.add('second-div');
      secondDiv.setAttribute(
        'onclick',
        `window.open('/attraction/${id}','_self')`
      );
      const secondImg = document.createElement('img');
      secondImg.classList.add('second-img');
      secondImg.src = imgOb.src;
      //   secondImg.src = img_url;
      const title = document.createElement('div');
      title.classList.add('title');
      const titleH1 = document.createElement('h1');
      titleH1.classList.add('title-h1');
      titleH1.innerText = name;
      const mrtDiv = document.createElement('div');
      mrtDiv.classList.add('mrt');
      const mrt = document.createElement('h1');
      mrt.innerText = mrtData;
      const cat = document.createElement('h1');
      cat.innerText = catData;

      mrtDiv.append(mrt, cat);
      title.append(titleH1);
      secondDiv.append(secondImg, title, mrtDiv);

      container.append(secondDiv);
    }
  } else {
    if (container.innerHTML === '') {
      const fail = document.createElement('h1');
      const failImg = document.createElement('img');
      failImg.src = '/static/images/not-found.png';
      failImg.style.width = '150px';
      failImg.style.height = '150px';
      fail.innerText = '沒有搜尋到此景點名稱';
      fail.style.color = '#757575';
      container.append(fail, failImg);
    }
  }
  // page = parseData.nextPage;
  // console.log(parseData.nextPage)

  fetching = false;
};

// 執行首頁
getPage();

// 捲軸設定
window.addEventListener('scroll', () => {
  if (fetching) {
    return;
  }
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight) {
    getPage();
  }
});

// search bar button 設定
let btn = document.querySelector('.search-btn');
let input = document.getElementById('inp-word');
btn.addEventListener('click', async function () {
  let inpValue = input.value;
  input.value = '';
  let container = document.querySelector('.container');
  container.innerHTML = ``;
  page = 0;
  keyword = inpValue;
  getPage();
});

// category value設定
function show(e) {
  let clickValue = e.text;
  document.getElementById('inp-word').value = clickValue;
}

// category html 設定
let category = document.querySelector('.category');

function setAtt() {
  for (let i = 0; i < 9; i++) {
    let moreCat = document.createElement('a');
    moreCat.classList.add('catList');
    moreCat.setAttribute('onclick', 'show(this);');
    category.appendChild(moreCat);
  }
}

setAtt();

// 取得category資料
async function getData() {
  try {
    const response = await fetch('/api/categories');
    const res = await response.json();
    for (let i = 0; i < 9; i++) {
      let catList = document.querySelectorAll('.catList');
      catList[i].innerText = res.data[i];
    }
  } catch (err) {
    console.log('fetch failed:', err);
  }
}

getData();

// 顯示或隱藏category
const catList = document.querySelectorAll('.catList');
document.addEventListener('click', (e) => {
  if (e.target === input) {
    category.style.visibility = 'visible';
    for (i = 0; i < catList.length; i++) {
      catList[i].style.visibility = 'visible';
    }
  } else {
    category.style.visibility = 'hidden';
    for (i = 0; i < catList.length; i++) {
      catList[i].style.visibility = 'hidden';
    }
  }
});
