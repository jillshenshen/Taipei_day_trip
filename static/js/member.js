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
        document.querySelector('.member-name').innerText = nameData;
        document.querySelector('.input-name').value = nameData;
        document.querySelector('.input-email').value=emailData
      }
    });
}

member_check();
