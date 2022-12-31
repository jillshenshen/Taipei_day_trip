let params = new URLSearchParams(window.location.search);
let orderNumber = params.get('number');
// document.querySelector('.order_number').innerText = orderNumber;

let url = `/api/order/${orderNumber}`;

function get_order() {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      const orderArea = document.createElement('div');
      orderArea.classList.add('order-area');
      let { number, price, status, trip } = result.data;
      const h2Number = document.createElement('h2');
      h2Number.innerText = '訂單編號：';
      const spanNumber = document.createElement('span');
      spanNumber.innerText = number;
      h2Number.append(spanNumber);

      const pPrice = document.createElement('p');
      pPrice.innerText = '總價：';
      const spanPrice = document.createElement('span');
      spanPrice.innerText = price;
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
        h4Cost.innerText = time == 'morning' ? '費用：2000元' : '費用：2500元';
        const h4Address = document.createElement('h4');
        h4Address.innerText = `地點：${address}`;

        picDiv.append(orderImg);
        detailDiv.append(h3Title, h4Date, h4Time, h4Cost, h4Address);
        areaDiv.append(picDiv, detailDiv);

        orderArea.append(areaDiv);
      });

      const thankDiv = document.querySelector('.thank-div');
      const h1Title = document.createElement('h1');
      h1Title.innerText = '可前往會員頁面管理訂單';
      const backBtn = document.createElement('button');
      backBtn.innerText = '會員頁面';
      backBtn.classList.add('back-btn');
      orderArea.append(pPrice, pStatus);
      thankDiv.append(orderArea, h1Title, backBtn);

      backBtn.addEventListener('click', () => {
        window.open('/order', '_self');
      });
    });
}

get_order();
