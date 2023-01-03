function member_check() {
  fetch('/api/user/auth')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      if (!result.data) {
        window.open('/', '_self');
      } else {
        fetch('/update-database')
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            document.querySelector('.member-name').innerText = result.name;
          });
      }
    });
}

member_check();

function updateData() {
  window.open('/member', '_self');
}

function get_order() {
  fetch('/api/orders')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      let tripArray = result.data;
      if (!tripArray) {
        noOrder();
      } else {
        const secondDiv = document.querySelector('.second');

        tripArray.forEach((item) => {
          const orderArea = document.createElement('div');
          orderArea.classList.add('order-area');
          let { number, price, status, trip } = item;
          const h2Number = document.createElement('h2');
          h2Number.innerText = '訂單編號：';
          const spanNumber = document.createElement('span');
          spanNumber.innerText = number;
          h2Number.append(spanNumber);

          const pPrice = document.createElement('p');
          pPrice.innerText = '總價：';
          const spanPrice = document.createElement('span');
          spanPrice.innerText = `${price} 元`;
          pPrice.append(spanPrice);

          const pStatus = document.createElement('p');
          pStatus.innerText = '付款狀態：';
          const spanStatus = document.createElement('span');
          spanStatus.innerText = status;
          pStatus.append(spanStatus);

          orderArea.append(h2Number);

          trip.forEach((item) => {
            let { date, time } = item;
            let { address, image, name } = item.attraction;
            const areaDiv = document.createElement('div');
            areaDiv.classList.add('booking-area');
            const picDiv = document.createElement('div');
            picDiv.classList.add('booking-pic');
            const detailDiv = document.createElement('div');
            detailDiv.classList.add('booking-detail');

            const orderImg = document.createElement('img');
            orderImg.src = image;
            picDiv.append(orderImg);

            const h3Title = document.createElement('h3');
            h3Title.innerText = name;
            const h4Date = document.createElement('h4');
            h4Date.innerText = `日期：${date}`;
            const h4Time = document.createElement('h4');
            h4Time.innerText =
              time == 'morning'
                ? '時間：早上9點到中午12點'
                : '時間：下午1點到下午4點';
            const h4Cost = document.createElement('h4');
            h4Cost.innerText =
              time == 'morning' ? '費用：2000元' : '費用：2500元';
            const h4Address = document.createElement('h4');
            h4Address.innerText = `地點：${address}`;

            picDiv.append(orderImg);
            detailDiv.append(h3Title, h4Date, h4Time, h4Cost, h4Address);
            areaDiv.append(picDiv, detailDiv);

            orderArea.append(areaDiv);
          });

          orderArea.append(pPrice, pStatus);
          secondDiv.append(orderArea);
        });
      }
    });
}

get_order();

function noOrder() {
  const failure = document.createElement('div');
  failure.classList.add('failure');
  const failImg = document.createElement('img');
  failImg.src = '/static/images/failure.png';
  const failText = document.createElement('h1');
  failText.innerText = '查無訂單資料';
  failure.append(failImg, failText);
  const second = document.querySelector('.second');
  second.append(failure);
}

const inputFile = document.querySelector('#file');
const userImg = document.querySelector('#user-img');
const memberPic = document.querySelector('.member-pic');

function fileActive() {
  inputFile.click();
}

inputFile.addEventListener('change', function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const result = reader.result;

    userImg.src = result;
    memberPic.style.overflow = 'hidden';

    fetch('/api/image', {
      method: 'POST',
      body: result,
    });
  };
  reader.readAsDataURL(file);
});

function orderCheck() {
  window.open('/order', '_self');
}

fetch(`/api/image`, {
  method: 'GET',
})
  .then((response) => response.text())
  .then((base64ImageString) => {
    if (base64ImageString != 'false') {
      const imageUrl = base64ImageString;

      userImg.src = imageUrl;
      memberPic.style.overflow = 'hidden';
    } else {
      userImg.src = '/static/images/user.png';
    }
  });
