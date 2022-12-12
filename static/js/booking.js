/* -------------------------確認登入與否------------------------ */
function booking_check() {
  fetch('/api/user/auth')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      if (!result.data) {
        window.open('/', '_self');
      } else {
        get_data();
      }
    });
}

booking_check();
/* -------------------------抓取資料------------------------ */
const bookingSection = document.querySelector('.booking-section');
let totalCost = 0;

function get_data() {
  fetch('/api/booking')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      let array = result.data;
      const title = document.querySelector('.title');
      title.innerText = `你好，${nameData}，待預定的行程如下：`;

      if (!array) {
        noBooking();
      } else {
        Booking();
        array.forEach((e) => {
          const area = document.createElement('div');
          area.classList.add('booking-area');
          const pic = document.createElement('div');
          pic.classList.add('booking-pic');
          const detail = document.createElement('div');
          detail.classList.add('booking-detail');
          const deleteImg = document.createElement('div');
          deleteImg.classList.add('delete-img');
          const img = document.createElement('img');
          img.src = e.attraction.image;
          img.setAttribute(
            'onclick',
            `window.open('/attraction/${e.attraction.id}','_self')`
          );
          img.style.cursor = 'pointer';

          const detailTitle = document.createElement('h3');
          detailTitle.innerText = `台北一日遊： ${e.attraction.name}`;

          const detailDate = document.createElement('h4');
          detailDate.innerText = '日期：';
          const dateSpan = document.createElement('span');
          dateSpan.innerText = e.date;
          detailDate.append(dateSpan);

          const detailTime = document.createElement('h4');
          detailTime.innerText = '時間：';
          const timeSpan = document.createElement('span');
          timeSpan.innerText =
            e.time == 'morning' ? '早上9點到中午12點' : '下午1點到下午4點';
          detailTime.append(timeSpan);

          const detailCost = document.createElement('h4');
          detailCost.innerText = ' 費用：';
          const costSpan = document.createElement('span');
          costSpan.innerText = `新台幣 ${e.price} 元`;
          detailCost.append(costSpan);
          totalCost += e.price;

          const detailAddress = document.createElement('h4');
          detailAddress.innerText = ' 地點：';
          const addressSpan = document.createElement('span');
          addressSpan.innerText = e.attraction.address;
          detailAddress.append(addressSpan);

          const deleteIcon = document.createElement('img');
          deleteIcon.src = '/static/images/icon_delete.png';
          deleteIcon.setAttribute('onclick', `deleteThis(${e.bookingID})`);

          pic.append(img);
          detail.append(
            detailTitle,
            detailDate,
            detailTime,
            detailCost,
            detailAddress
          );
          deleteImg.append(deleteIcon);
          area.append(pic, detail, deleteImg);
          bookingSection.append(area);
        });

        document.querySelector(
          '.totalCost'
        ).innerText = `總價：新台幣${totalCost}元`;
      }
    });
}

const isBooking = document.querySelector('.isBooking');
const footer = document.querySelector('.footer');
function Booking() {
  isBooking.style.display = 'block';
  footer.style.position = 'relative';
  document.querySelector("input[name='contactName']").value = nameData;
  document.querySelector("input[name='contactEmail']").value = emailData;
}
function noBooking() {
  isBooking.style.display = 'none';
  const nothing = document.createElement('h1');
  nothing.innerText = '目前沒有任何待預定的行程';
  nothing.style.fontSize = '16px';
  nothing.style.marginTop = '20px';
  const bookingNow = document.createElement('img');
  bookingNow.classList.add('booking-now');
  bookingNow.src = '/static/images/booking.png';
  bookingNow.addEventListener('click', () => {
    window.open('/', '_self');
  });
  footer.style.display = 'absolute';

  bookingSection.append(nothing, bookingNow);
}

/* -----------------------刪除API request ------------------------- */
function deleteThis(id) {
  fetch('/api/booking', {
    method: 'DELETE',
    body: JSON.stringify({
      bookingID: `${id}`,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.ok) {
        window.open('/booking', '_self');
      } else {
        window.open('/', '_self');
      }
    });
}
