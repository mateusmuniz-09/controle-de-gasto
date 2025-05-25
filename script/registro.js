firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "../pages/home.html";
  }
});

function onChangeEmail() {
  const email = form.email().value;
  form.emailRequired().style.display = email ? "none" : "block";
  form.emailInvalid().style.display = validateEmail(email) ? "none" : "block";
  toggleRegisterButtonDisable();
}

function onChangePassword() {
  const password = form.password().value;
  form.passwordRequired().style.display = password ? "none" : "block";
  form.minPassword().style.display = password.length >= 6 ? "none" : "block";
  validadeConfirPasswor();
  toggleRegisterButtonDisable();
}

function onChangeConfirm() {
  validadeConfirPasswor();
  toggleRegisterButtonDisable();
}

function validadeConfirPasswor() {
  const password = form.password().value;
  const passwordConfirm = form.confirmPassword().value;

  form.confirmErrorPassword().style.display =
    password == passwordConfirm ? "none" : "block";
}

function toggleRegisterButtonDisable() {
  form.registerButton().disabled = !isFormValid();
}
function isFormValid() {
  const email = form.email().value;
  if (!email || !validateEmail(email)) {
    return false;
  }

  const password = form.password().value;
  if (!password || password.length < 6) {
    return false;
  }

  const confirmPassword = form.confirmPassword().value;
  if (password != confirmPassword) {
    return false;
  }

  return true;
}

function register() {
  showLoading();
  const email = form.email().value;
  const password = form.password().value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      hideLoading();
      window.location.href = "../pages/home.html";
    })
    .catch((error) => {
      hideLoading();
      alert(getErrorMessage(error));
      window.location.href = "../index.html";
    });
}

function getErrorMessage(error) {
  if (error.code == "auth/email-already-in-use") {
    return "Email já está em uso";
  }
  return error.message;
}

const form = {
  email: () => document.getElementById("email"),
  password: () => document.getElementById("password"),
  emailRequired: () => document.getElementById("email-required-error"),
  emailInvalid: () => document.getElementById("email-invalid-error"),
  confirmErrorPassword: () =>
    document.getElementById("password-doesnt-match-error"),
  passwordRequired: () => document.getElementById("password-required-error"),
  minPassword: () => document.getElementById("password-min-length-error"),
  confirmPassword: () => document.getElementById("confirm-password"),
  registerButton: () => document.getElementById("regiter-button"),
};
