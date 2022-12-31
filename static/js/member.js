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

function member_check() {
  fetch('/api/user/auth')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      if (!result.data) {
        window.open('/', '_self');
      } else {
        update_get();
      }
    });
}

member_check();

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


  
const userSubmit = document.querySelector('.user-submit');
userSubmit.setAttribute('disabled', true);
const input1 = document.getElementById('input1');
const input10 = document.getElementById('input10');

document
  .querySelectorAll(
    'input[type=text], input[type=date], input[type=tel], input[type=email], select'
  )
  .forEach((input) => {
    input.addEventListener('input', () => {
      if (input.value && input1.value && input10.value) {
        userSubmit.removeAttribute('disabled');
      } else {
        userSubmit.setAttribute('disabled', true);
      }
    });
  });

input1.addEventListener('blur', () => {
  if (input1.value.trim() === '') {
    document.querySelector('.required').style.visibility = 'visible';
  } else {
    document.querySelector('.required').style.visibility = 'hidden';
  }
});

input10.addEventListener('blur', () => {
  if (input10.value.trim() === '') {
    document.querySelector('.required1').style.visibility = 'visible';
  } else {
    document.querySelector('.required1').style.visibility = 'hidden';
  }
});

const inputs = document.querySelectorAll('input, select');

userSubmit.addEventListener('click', () => {
  userSubmit.setAttribute('disabled', true);
  const data = {};

  inputs.forEach((input) => {
    if (input.value) {
      data[input.name] = input.value;
    }
  });
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const isValidEmail = emailRegex.test(input10.value);
  if (!isValidEmail) {
    document.querySelector('.required1').style.visibility = 'visible';
    document.querySelector('.required1').innerText = 'email格式錯誤';
  } else {
    fetch('/update-database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          document.querySelector('.submit').style.display = 'flex';
        } else {
          document.querySelector('.submit').style.display = 'flex';
          document.querySelector('.submit-message').innerText = data.message;
        }
      });
  }
});

function update_get() {
  fetch('/update-database')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      document.querySelector('.member-name').innerText = result.name;
      document.querySelector('.input-name').value = result.name;
      document.querySelector('.input-email').value = result.email;
      if (result.ids) {
        document.getElementById('input2').value = result.ids;
      }
      if (result.phone) {
        document.getElementById('input9').value = result.phone;
      }
      if (result.gender) {
        document.getElementById('input3').value = result.gender;
      }
      if (result.last) {
        document.getElementById('input5').value = result.last;
      }
      if (result.first) {
        document.getElementById('input4').value = result.first;
      }
      if (result.passport) {
        document.getElementById('input6').value = result.passport;
      }
      if (result.birth) {
        document.getElementById('input7').value = result.birth;
      }
      if (result.country) {
        document.getElementById('input8').value = result.country;
      }
    });
}
const submitClose = document.querySelector('.submit-close');
submitClose.addEventListener('click', () => {
  document.querySelector('.submit').style.display = 'none';
});
