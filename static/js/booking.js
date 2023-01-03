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
        document.querySelector('.load').style.display = 'block';
        get_data();
      }
    });
}

booking_check();
/* -------------------------抓取資料------------------------ */
const bookingSection = document.querySelector('.booking-section');
let totalCost = 0;
let tripObj = [];

function get_data() {
  fetch('/api/booking')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      let array = result.data;
      console.log(array);
      document.querySelector('.load').style.display = 'none';
      const title = document.querySelector('.title');
      title.innerText = `你好，${nameData}，待預定的行程如下：`;

      if (!array) {
        noBooking();
      } else {
        Booking();
        array.forEach((e) => {
          let { id, name, address, image } = e.attraction;
          let { date, time } = e;
          let obj = {
            id: id,
            name: name,
            address: address,
            image: image,
          };
          let obj2 = {
            attraction: obj,
            date: date,
            time: time,
          };
          tripObj.push(obj2);

          const area = document.createElement('div');
          area.classList.add('booking-area');
          const pic = document.createElement('div');
          pic.classList.add('booking-pic');
          const detail = document.createElement('div');
          detail.classList.add('booking-detail');
          const deleteImg = document.createElement('div');
          deleteImg.classList.add('delete-img');
          const img = document.createElement('img');
          img.src = image;
          img.setAttribute(
            'onclick',
            `window.open('/attraction/${id}','_self')`
          );
          img.style.cursor = 'pointer';

          const detailTitle = document.createElement('h3');
          detailTitle.innerText = `台北一日遊： ${name}`;

          const detailDate = document.createElement('h4');
          detailDate.innerText = '日期：';
          const dateSpan = document.createElement('span');
          dateSpan.innerText = date;
          detailDate.append(dateSpan);

          const detailTime = document.createElement('h4');
          detailTime.innerText = '時間：';
          const timeSpan = document.createElement('span');
          timeSpan.innerText =
            time == 'morning' ? '早上9點到中午12點' : '下午1點到下午4點';
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
          addressSpan.innerText = address;
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

/* ----------------------TapPay串接設定------------------------ */
TPDirect.setupSDK(
  126892,
  'app_kob1LK4ila5XS2Gb1KxejJzwxfkgpWTLRM3I0qje5lRSyXELDYBsOpcoAKnf',
  'sandbox'
);

let fields = {
  number: {
    // css selector
    element: '#card-number',
    placeholder: '**** **** **** ****',
  },
  expirationDate: {
    // DOM object
    element: document.getElementById('card-expiration-date'),
    placeholder: 'MM / YY',
  },
  ccv: {
    element: '#card-ccv',
    placeholder: '後三碼',
  },
};

TPDirect.card.setup({
  fields: fields,
  styles: {
    // Style all elements
    input: {
      color: 'gray',
    },
    // Styling ccv field
    'input.ccv': {
      'font-size': '16px',
    },
    // Styling expiration-date field
    'input.expiration-date': {
      'font-size': '16px',
    },
    // Styling card-number field
    'input.card-number': {
      'font-size': '16px',
    },
    // style focus state
    ':focus': {
      color: 'black',
    },
    // style valid state
    '.valid': {
      color: 'green',
    },
    // style invalid state
    '.invalid': {
      color: 'red',
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    '@media screen and (max-width: 400px)': {
      input: {
        color: 'orange',
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

const submitButton = document.querySelector('.submit-button');

TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    submitButton.removeAttribute('disabled');
  } else {
    // Disable submit Button to get prime.
    submitButton.setAttribute('disabled', true);
  }
});

/* -------------------付款button------------- */

submitButton.addEventListener('click', (e) => {
  document.querySelector('.submit').style.display = 'flex';
  document.querySelector('.schedule').style.visibility = 'visible';

  e.preventDefault();
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    alert('can not get prime');
    return;
  }

  // Get prime
  let prime = '';
  TPDirect.card.getPrime(function (result) {
    if (result.status !== 0) {
      console.err('getPrime 錯誤');

      return;
    } else {
      prime = result.card.prime;

      fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          prime: prime,
          order: {
            price: totalCost,
            trip: tripObj,
          },
          contact: {
            name: document.querySelector('input[name="contactName"]').value,
            email: document.querySelector('input[name="contactEmail"]').value,
            phone: document.querySelector('input[name="contactPhone"]').value,
          },
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then(function (result) {
          if (result.error) {
            document.querySelector('.submit-message').style.visibility =
              'visible';
            document.querySelector('.submit-message').innerText =
              result.message;
            document.querySelector('.schedule').style.visibility = 'hidden';
          } else {
            let order_number = result.data.number;
            window.open(`/thankyou?number=${order_number}`, '_self');
          }
        });
    }
  });
});

function close_error() {
  document.querySelector('.submit').style.display = 'none';
  document.querySelector('.submit-message').style.visibility = 'hidden';
}

const contactPhone = document.querySelector('.contactPhone');

contactPhone.addEventListener('blur', () => {
  const phoneRegex = /^\d{6,14}$/;
  const isValidPhone = phoneRegex.test(contactPhone.value);
  if (!isValidPhone) {
    document.querySelector('.failMessage').innerText = '手機格式錯誤';
  }
});
