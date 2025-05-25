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
  firebase
    .firestore()
    .collection("transiction")
    .where("user.uid", "==", user.uid)
    .orderBy("hours", "desc")
    .get()
    .then((snapshot) => {
      hideLoading();
      console.log(snapshot);
      const transactions = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));
      addTransictionsToScreen(transactions);
    })
    .catch((error) => {
      hideLoading();
      console.log("Error", error);
      alert("Erro ao recuperar transações");
    });
}

function addTransictionsToScreen(transactions) {
  const ordenadList = document.getElementById("trasactions");
  console.log(transactions);
  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    li.classList.add(transaction.type);
    li.id = transaction.uid;

    li.addEventListener("click", () => {
      window.location.href = "../pages/transacoes.html?uid=" + transaction.uid;
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Remover";
    deleteButton.classList.add("outline", "danger");
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      askRemoveTransaction(transaction);
    });
    li.appendChild(deleteButton);

    const data = document.createElement("b");
    data.innerHTML = formatdate(transaction.date) + " " + transaction.hours;
    li.appendChild(data);
    const money = document.createElement("p");
    money.innerHTML = formatMoney(transaction.money);
    li.appendChild(money);
    const formpag = document.createElement("p");
    formpag.innerHTML = transaction.formaPagamento;

    li.appendChild(formpag);

    const typeTransaction = document.createElement("p");
    typeTransaction.innerHTML = transaction.typeTransaction;
    li.appendChild(typeTransaction);

    if (transaction.description) {
      const descr = document.createElement("p");
      descr.innerHTML = transaction.description;
      li.appendChild(descr);
    }

    ordenadList.appendChild(li);
  });
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

  firebase
    .firestore()
    .collection("transiction")
    .doc(transaction.uid)
    .delete()
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
