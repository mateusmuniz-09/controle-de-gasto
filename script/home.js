function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch(() => {
      alert("Erro ao fazer logout");
    });
}

function newTransaction() {
  window.location.href = "../pages/transacoes.html";
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    findTransictions(user);
  }
});

function findTransictions(user) {
  showLoading();
  transactionService
    .findByUser(user)
    .then((transactions) => {
      hideLoading();
      addTransictionsToScreen(transactions);
    })
    .catch((error) => {
      hideLoading();
      console.log(error);
      alert("Erro ao recuperar transacoes");
    });
}

function addTransictionsToScreen(transactions) {
  const ordenadList = document.getElementById("trasactions");
  transactions.forEach((transaction) => {
    const li = createTransactionListItem(transaction);

    li.appendChild(createDeleteButton(transaction));

    li.appendChild(
      createParagraph(formatdate(transaction.date) + " " + transaction.hours)
    );

    li.appendChild(createParagraph(formatMoney(transaction.money)));

    li.appendChild(createParagraph(transaction.formaPagamento));

    li.appendChild(createParagraph(transaction.typeTransaction));

    if (transaction.description) {
      li.appendChild(createParagraph(transaction.description));
    }

    ordenadList.appendChild(li);
  });
}

function createTransactionListItem(transaction) {
  const li = document.createElement("li");
  li.classList.add(transaction.type);
  li.id = transaction.uid;

  li.addEventListener("click", () => {
    window.location.href = "../pages/transacoes.html?uid=" + transaction.uid;
  });
  return li;
}

function createDeleteButton(transaction) {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Remover";
  deleteButton.classList.add("outline", "danger");
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    askRemoveTransaction(transaction);
  });
  return deleteButton;
}

function createParagraph(value) {
  const element = document.createElement("p");
  element.innerHTML = value;
  return element;
}
function askRemoveTransaction(transaction) {
  const shouldRemove = confirm("Deseja remover a transaçao?");
  console.log(shouldRemove);
  if (shouldRemove) {
    removeTransaction(transaction);
  }
}

function removeTransaction(transaction) {
  showLoading();

  transactionService
    .remove(transaction)
    .then(() => {
      hideLoading();
      document.getElementById(transaction.uid).remove();
    })
    .catch((error) => {
      hideLoading();
      console.log(error);
      alert("Erro ao remover transaçao");
    });
}

function formatdate(date) {
  const [ano, mes, dia] = date.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatMoney(money) {
  return `${money.currency}${money.value.toFixed(2)}`;
}
