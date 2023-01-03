//會員登入註冊
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const close = document.querySelector('.close');
const closeSignup = document.querySelector('.close-signup');
const signupText = document.querySelector('.signup-text');
const loginText = document.querySelector('.login-text');
loginBtn.addEventListener('click', () => {
  document.getElementById('login').style.display = 'flex';
});
signupBtn.addEventListener('click', () => {
  document.getElementById('signup').style.display = 'flex';
});
close.addEventListener('click', () => {
  document.getElementById('login').style.display = 'none';
  document.querySelector('.login-message').style.display = 'none';
  document.querySelector('.login-container').style.height = '275px';
});
closeSignup.addEventListener('click', () => {
  document.getElementById('signup').style.display = 'none';
  document.querySelector('.signup-message').style.display = 'none';
  document.getElementById('signup-container').style.height = '332px';
});
signupText.addEventListener('click', () => {
  document.getElementById('login').style.display = 'none';
  document.getElementById('signup').style.display = 'flex';
  document.querySelector('.login-message').style.display = 'none';
  document.querySelector('.login-container').style.height = '275px';
});
loginText.addEventListener('click', () => {
  document.getElementById('signup').style.display = 'none';
  document.getElementById('login').style.display = 'flex';
  document.querySelector('.signup-message').style.display = 'none';
  document.getElementById('signup-container').style.height = '332px';
});

/* ---------------------fetch signup註冊 api-------------------------- */
const signupSubmit = document.querySelector('.signup-submit');
const signupName = document.querySelector('.signup-name');
const signupEmail = document.querySelector('.signup-email');
const signupPassword = document.querySelector('.signup-password');

document
  .querySelectorAll('input[type=text],input[type=email],input[type=password]')
  .forEach((input) => {
    input.addEventListener('input', () => {
      if (signupName.value && signupEmail.value && signupPassword.value) {
        signupSubmit.removeAttribute('disabled');
      } else {
        signupSubmit.setAttribute('disabled', true);
      }
    });
  });

signupSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  signupSubmit.setAttribute('disabled', true);
  let signupNameVl = signupName.value;
  let signupEmailVl = signupEmail.value;
  let signupPasswordVl = signupPassword.value;
  signupName.value = '';
  signupEmail.value = '';
  signupPassword.value = '';

  const email = signupEmailVl;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const isValidEmail = emailRegex.test(email);

  if (signupEmailVl === '' || signupNameVl === '' || signupPasswordVl === '') {
    document.querySelector('.signup-message').style.display = 'block';
    document.querySelector('.signup-message').innerText = '有欄位未填寫';
    document.querySelector('.signup-message').style.color = '#68B984';

    document.getElementById('signup-container').style.height = '360px';
  } else if (!isValidEmail) {
    document.querySelector('.signup-message').style.display = 'block';
    document.querySelector('.signup-message').innerText =
      '註冊失敗,請提供正確email';
    document.querySelector('.signup-message').style.color = '#68B984';

    document.getElementById('signup-container').style.height = '360px';
  } else {
    fetch(`/api/user`, {
      method: 'POST',
      body: JSON.stringify({
        name: `${signupNameVl}`,
        email: `${signupEmailVl}`,
        password: `${signupPasswordVl}`,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(function (result) {
        if (result.ok) {
          document.querySelector('.signup-message').style.display = 'block';
          document.querySelector('.signup-message').innerText = '註冊會員成功';
          document.querySelector('.signup-message').style.color = '#FF6464';

          document.getElementById('signup-container').style.height = '360px';
        } else {
          document.querySelector('.signup-message').style.display = 'block';
          document.querySelector('.signup-message').innerText = result.message;
          document.querySelector('.signup-message').style.color = '#68B984';

          document.getElementById('signup-container').style.height = '360px';
        }
      });
  }
});

const signupTarget = document.querySelectorAll('.signup-target');

signupTarget.forEach((target) => {
  target.addEventListener('blur', () => {
    if (signupName.value.trim() === '') {
      document.querySelector('.signup-message').style.display = 'block';
      document.querySelector('.signup-message').innerText = '此欄位必填';
      document.querySelector('.signup-message').style.color = '#68B984';

      document.getElementById('signup-container').style.height = '360px';
    }
  });
});

/* -------------------------fetch login 登入 api------------------------------ */
const loginSubmit = document.querySelector('.login-submit');
const nav = document.querySelector('.nav');
let loginEmail = document.querySelector('.login-email');
let loginPassword = document.querySelector('.login-password');
let navList = document.querySelector('.nav-list');
const logoutBtn = document.querySelector('.logout-btn');
const booking = document.querySelector('.booking');

document
  .querySelectorAll('input[type=email],input[type=password]')
  .forEach((input) => {
    input.addEventListener('input', () => {
      if (loginEmail.value && loginPassword.value) {
        loginSubmit.removeAttribute('disabled');
      } else {
        loginSubmit.setAttribute('disabled', true);
      }
    });
  });

loginSubmit.addEventListener('click', (e) => {
  loginSubmit.setAttribute('disabled', true);
  e.preventDefault();
  let loginEmailVl = loginEmail.value;
  let loginPasswordVl = loginPassword.value;
  loginEmail.value = '';
  loginPassword.value = '';
  fetch('/api/user/auth', {
    method: 'PUT',
    body: JSON.stringify({
      email: `${loginEmailVl}`,
      password: `${loginPasswordVl}`,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then(function (result) {
      if (result.ok) {
        document.getElementById('login').style.display = 'none';
        check();
      } else {
        document.querySelector('.login-message').style.display = 'block';
        document.querySelector('.login-message').innerText =
          '會員登入失敗,帳號或密碼錯誤';

        document.querySelector('.login-message').style.color = '#68B984';
        document.querySelector('.login-container').style.height = '300px';
      }
    });
});
/* -------------------------fetch logout 登出 api------------------------------ */
function logout() {
  fetch('/api/user/auth', {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then(function (result) {
      window.open('/', '_self');
    });
}

/* -----------------------確認登入與否,顯示登入登出鍵-------------------------- */
let nameData;
let emailData;

const account = document.querySelector('.account');

async function check() {
  const response = await fetch('/api/user/auth');
  const result = await response.json();
  if (result.data) {
    nameData = result.data.name;
    emailData = result.data.email;

    booking.classList.add('show-icon');
    account.classList.add('show-icon');
    nav.classList.remove('show');
    // logoutBtn.classList.add('show');
  } else {
    booking.classList.add('show-icon');
    nav.classList.add('show');
    // logoutBtn.classList.remove('show');
    account.classList.remove('show-icon');
  }
}

check();

/* --------------------預定行程 button 確認是否登入------------------- */

async function booking_to() {
  const response = await fetch('/api/user/auth');
  const result = await response.json();
  if (result.data) {
    window.open('/booking', '_self');
  } else {
    document.getElementById('login').style.display = 'flex';
  }
}

async function member() {
  const response = await fetch('/api/user/auth');
  const result = await response.json();
  if (result.data) {
    window.open('/member', '_self');
  } else {
    window.open('/', '_self');
 
  }
}
async function order() {
  const response = await fetch('/api/user/auth');
  const result = await response.json();
  if (result.data) {
    window.open('/order', '_self');
  } else {
    window.open('/', '_self');
   
  }
}

const secondUl = document.querySelector('.second-ul');

document.addEventListener('click', (e) => {
  if (e.target === account || e.target === secondUl) {
    secondUl.style.visibility = 'visible';
  } else {
    secondUl.style.visibility = 'hidden';
  }
});
