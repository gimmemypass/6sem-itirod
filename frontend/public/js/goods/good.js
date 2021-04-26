import { GoodList } from "./goodList.js"
import { GoodSort } from "./goodSort.js";
import { Modal } from "./modal.js"

class Good {
  constructor() {
    this.goodTypes = ["coffee", "dessert"];
    this.insertedGoods = [];

    this.createHandler = this.createHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);

    this.showAll = this.showAll.bind(this);
    this.handleClicks = this.handleClicks.bind(this);

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }
  createHandler({ desc, price, photo, type }) {
    const goodRef = firebase.database().ref(`goods/${type}/`);
    const newGood = goodRef.push();
    newGood.set({
      desc, price, photo, type, overallRate: 0
    })
      .then(() => {
        this.hideModal();
        this.showAll(this.goodTypes, true);
      });
  }
  getBase64(photo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })
  }
  editHandler({ uid, type, desc, price, photo }) {
    firebase.database().ref(`goods/${type}/${uid}`).update({
      desc, price, photo,
    })
      .then(() => {
        this.showAll(this.goodTypes, true);
        this.hideModal();
      });
  }
  deleteHandler(uid, type) {
    this.deleteAllRefs(uid);
    firebase.database().ref(`goods/${type}/${uid}`).remove()
      .then(() => this.showAll(this.goodTypes, true));
  }
  async deleteAllRefs(goodUID) {
    const userUID = await firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref(`goods/${userUID}`);
    dbRef.get().then((snapshot) => {
      if (snapshot.exists()) {
        Object.entries(snapshot.val()).forEach(([id, { userGoodUID }]) => {
          if (userGoodUID === goodUID) {
            firebase.database().ref(`goods/${userUID}/${id}`).remove();
          }
        })
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  setAddBtn(addBtn) {
    this.addBtn = addBtn;
    this.addBtn.addEventListener("click", this.showModal);
  }
  setGoodsList(goodsList) {
    this.goodsList = goodsList;
    this.goodsList.addEventListener("click", this.handleClicks);
  }
  setTotalPriceNode(totalPriceNode) {
    this.totalPriceNode = totalPriceNode;
  }
  setRateInputs(rateInputs) {
    this.rateInputs = rateInputs;
    this.handleRateUpdate = this.handleRateUpdate.bind(this);
    this.rateInputs.forEach((rateInput) => rateInput.addEventListener("input", this.handleRateUpdate));
  }
  setModal(modal) {
    this.modal = modal;
  }
  getGoodsList() {
    return this.goodsList;
  }
  getGoodTypes() {
    return this.goodTypes;
  }
  async addToUserCartHandler(goodUID, type) {
    const userUID = await firebase.auth().currentUser.uid;
    const userRef = firebase.database().ref(`goods/${userUID}/`);
    const newGoodInCart = userRef.push();
    newGoodInCart.set({
      goodUID, type
    })
  }
  async deleteFromCartHandler(goodUID) {
    const userUID = await firebase.auth().currentUser.uid;
    firebase.database().ref(`goods/${userUID}/${goodUID}`).remove()
      .then(() => this.showUserCart());
  }
  async updateRate(goodUID, type, rate) {
    const userUID = await firebase.auth().currentUser.uid;
    await firebase.database().ref(`goods/${type}/${goodUID}/rates/${userUID}`)
      .set({ rate });
    const overallRate = await this.getRate(type, goodUID);
    await firebase.database().ref(`goods/${type}/${goodUID}`)
      .update({ overallRate });
  }
}

Object.assign(Good.prototype, GoodList, Modal, GoodSort);

export { Good }