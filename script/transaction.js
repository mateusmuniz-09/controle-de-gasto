if (!isNewTransaction()) {
  const uid = getTransactionUid();
  findTransictionsByUid(uid);
}

function getTransactionUid() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("uid");
}

function isNewTransaction() {
  return getTransactionUid() ? false : true;
}

function findTransictionsByUid(uid) {
  showLoading();
  firebase
    .firestore()
    .collection("transiction")
    .doc(uid)
    .get()
    .then((doc) => {
      hideLoading();
      if (doc.exists) {
        fillTransactionScreen(doc.data());
        toogleButtonSaveDisabled();
      } else {
        alert("Documento não encontrado");
        window.location.href = "../pages/home.html";
      }
    })
    .catch(() => {
      hideLoading();
      alert("Erro ao recuperar");
      window.location.href = "../pages/home.html";
    });
}

function fillTransactionScreen(transiction) {
  if (transiction.type == "expense") {
    form.typeExpense().checked = true;
  } else {
    form.typeIncome.checked = true;
  }
  form.value().value = transiction.money.value;
  form.formaDePagamento().value = transiction.formaPagamento;
  form.select().value = transiction.typeTransaction;

  if (transiction.description) {
    form.description().value = transiction.description;
  }
}

function saveTransaction() {
  showLoading();
  const transaction = createTrasaction();
  if (isNewTransaction()) {
    save(transaction);
  } else {
    update(transaction);
  }
}

function save(transaction) {
  showLoading();
  firebase
    .firestore()
    .collection("transiction")
    .add(transaction)
    .then(() => {
      hideLoading();
      window.location.href = "../pages/home.html";
    })
    .catch(() => {
      hideLoading();
      alert("Erro ao salvar transação");
    });
}

function update(transaction) {
  showLoading();
  firebase
    .firestore()
    .collection("transiction")
    .doc(getTransactionUid())
    .update(transaction)
    .then(() => {
      hideLoading();
      window.location.href = "../pages/home.html";
    })
    .catch(() => {
      hideLoading();
      alert("Erro ao atualizar transaçao");
    });
}

function createTrasaction() {
  return {
    type: form.typeExpense().checked ? "expense" : "income",
    date: hoje(),
    money: {
      currency: "R$",
      value: parseFloat(form.value().value),
    },
    typeTransaction: form.select().value,
    description: form.description().value,
    formaPagamento: form.formaDePagamento().value,
    hours: agora(),
    user: {
      uid: firebase.auth().currentUser.uid,
    },
  };
}
function agora() {
  const agora = new Date();
  const hour = String(agora.getHours()).padStart(2, "0");
  const minutes = String(agora.getMinutes()).padStart(2, "0");
  const seconds = String(agora.getSeconds()).padStart(2, "0");
  return `${hour}:${minutes}:${seconds}`;
}

function hoje() {
  const hoje = new Date();

  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();

  return `${ano}-${mes}-${dia}`;
}

function logout() {
  window.location.href = "../pages/home.html";
}

function onChangeValue() {
  const value = form.value().value;

  form.valueRequiredError().style.display = !value ? "block" : "none";
  form.valueInvalidError().style.display = value <= 0 ? "block" : "none";
  toogleButtonSaveDisabled();
}

function onChangeSelect() {
  const select = form.select().value;

  form.selectRequiredError().style.display = !select ? "block" : "none";
  toogleButtonSaveDisabled();
}

function toogleButtonSaveDisabled() {
  form.buttonAdd().disabled = !invalidForm();
}

function invalidForm() {
  const value = form.value().value;
  if (!value || value <= 0) {
    return false;
  }
  const select = form.select().value;
  if (!select) {
    return false;
  }

  return true;
}

const form = {
  value: () => document.getElementById("value"),
  valueRequiredError: () => document.getElementById("value-required-error"),
  valueInvalidError: () => document.getElementById("value-invalid-error"),
  select: () => document.getElementById("select"),
  selectRequiredError: () => document.getElementById("select-required-error"),
  buttonAdd: () => document.getElementById("buttonAdd"),
  typeExpense: () => document.getElementById("expense"),
  typeIncome: () => document.getElementById("income"),
  formaDePagamento: () => document.getElementById("forma-de-pagamento"),
  description: () => document.getElementById("description"),
};
