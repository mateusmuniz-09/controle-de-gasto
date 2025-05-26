const transactionService = {
  findByUser: (user) => {
    return firebase
      .firestore()
      .collection("transiction")
      .where("user.uid", "==", user.uid)
      .orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }));
      });
  },
  findByUid: (uid) => {
    return firebase
      .firestore()
      .collection("transiction")
      .doc(uid)
      .get()
      .then((doc) => {
        return doc.data();
      });
  },

  remove: (transaction) => {
    return firebase
      .firestore()
      .collection("transiction")
      .doc(transaction.uid)
      .delete();
  },

  save: (transaction) => {
    return firebase.firestore().collection("transiction").add(transaction);
  },
  update: (transaction) => {
    return firebase
      .firestore()
      .collection("transiction")
      .doc(getTransactionUid())
      .update(transaction);
  },
};
