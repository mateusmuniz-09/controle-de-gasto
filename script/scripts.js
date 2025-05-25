firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "../pages/home.html";
  }
});

function validateChangeEmails() {
  toogleButtons();
  toogleEmailErrors();
}

function validateChangePassword() {
  toogleButtons();
  tooglePasswordErrors();
}

function toogleEmailErrors() {
  hideLoading();
  const email = form.email().value;
  form.emailRequired().style.display = email ? "none" : "block";
  form.emailInvalide().style.display = validateEmail(email) ? "none" : "block";
}

function tooglePasswordErrors() {
  hideLoading();
  const password = form.password().value;

  form.senhaRequired().style.display = !password ? "block" : "none";
}

function emailValido() {
  const email = form.email().value;

  if (!email) {
    return false;
  }
  return validateEmail(email);
}

function passwordValido() {
  const password = form.password().value;
  if (!password) {
    return false;
  }
  return true;
}

function toogleButtons() {
  const emailValidit = emailValido();
  form.recuperarSenha().disabled = !emailValidit;

  const passwordValidit = passwordValido();

  form.entrar().disabled = !emailValidit || !passwordValidit;
}

function login() {
  showLoading();
  firebase
    .auth()
    .signInWithEmailAndPassword(form.email().value, form.password().value)
    .then(() => {
      hideLoading();
      window.location.href = "pages/home.html";
    })
    .catch((error) => {
      console.log("error", error);
      hideLoading();
      alert(messageError(error));
    });
}

function messageError(error) {
  if (error.code == "auth/invalid-credential") {
    return "Usuário ou senha incorretos";
  }
  if (error.code == "") {
    return "Senha inválida";
  }
  return error.message;
}

function registration() {
  showLoading();
  window.location.href = "pages/registro.html";
}

function recoverPassword() {
  showLoading();
  firebase
    .auth()
    .sendPasswordResetEmail(form.email().value)
    .then(() => {
      hideLoading();
      alert("Email enviado com sucesso");
    })
    .catch((error) => {
      hideLoading();
      alert(messageError(error));
    });
}

const form = {
  email: () => document.getElementById("email"),
  password: () => document.getElementById("password"),
  entrar: () => document.getElementById("entrar"),
  recuperarSenha: () => document.getElementById("recuperar-senha"),
  senhaRequired: () => document.getElementById("senha-required"),
  emailRequired: () => document.getElementById("email-required"),
  emailInvalide: () => document.getElementById("email-invalide"),
};
