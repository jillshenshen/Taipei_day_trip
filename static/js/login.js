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
let signupName = document.querySelector('.signup-name');
let signupEmail = document.querySelector('.signup-email');
let signupPassword = document.querySelector('.signup-password');

signupSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  let signupNameVl = signupName.value;
  let signupEmailVl = signupEmail.value;
  let signupPasswordVl = signupPassword.value;
  signupName.value = '';
  signupEmail.value = '';
  signupPassword.value = '';
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
        document.querySelector('.signup-message').style.backgroundColor =
          '#FDFDBD';
        document.getElementById('signup-container').style.height = '360px';
        check();
      } else {
        document.querySelector('.signup-message').style.display = 'block';
        document.querySelector('.signup-message').innerText =
          '註冊會員失敗,請提供其他E-mail';
        document.querySelector('.signup-message').style.color = '#68B984';
        document.querySelector('.signup-message').style.backgroundColor =
          '#FDFDBD';
        document.getElementById('signup-container').style.height = '360px';
        check();
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

loginSubmit.addEventListener('click', (e) => {
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
        document.querySelector('.login-message').style.display = 'block';
        document.querySelector('.login-message').innerText = '會員登入成功';
        document.querySelector('.login-message').style.backgroundColor =
          '#FDFDBD';
        document.querySelector('.login-message').style.color = '#FF6464';
        document.querySelector('.login-container').style.height = '300px';

        check();
      } else {
        document.querySelector('.login-message').style.display = 'block';
        document.querySelector('.login-message').innerText =
          '會員登入失敗,帳號或密碼錯誤';
        document.querySelector('.login-message').style.backgroundColor =
          '#FDFDBD';
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
      check();
    });
}

function check() {
  fetch('/api/user/auth')
    .then((response) => response.json())
    .then(function (result) {
      console.log(result.data);
      if (result.data) {
        booking.classList.add('show');
        nav.classList.remove('show');
        logoutBtn.classList.add('show');
      } else {
        booking.classList.add('show');
        nav.classList.add('show');
        logoutBtn.classList.remove('show');
      }
    });
}

check();
