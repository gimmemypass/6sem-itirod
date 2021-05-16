export const GoodList = {
  showAll(types, isCrud) {
    this.insertedGoods = [];
    types.forEach(async (type, index) => {
      const dbRef = await firebase.database().ref(`goods/${type}`);
      const snapshot = await dbRef.get();
      if (snapshot.exists()) {
        const snapshotEntries = Object.entries(snapshot.val());
        this.insertedGoods = snapshotEntries;
        await this.getGoodsListElement(snapshotEntries, type, isCrud, index >= 1 ? false : true);
      }
    });
  },
  async getGoodsListElement(snapshotEntries, type, isCrud, isFirst) {
    const lis = [];
    snapshotEntries.forEach(async ([id, good]) => {
      const { desc, price, photo, overallRate } = good;
      lis.push(this.getGoodTemplate(desc, price, photo, id, type, overallRate, isCrud));
    })
    if (isFirst) {
      this.getGoodsList().innerHTML = lis.join("");
    } else {
      this.getGoodsList().innerHTML += lis.join("");
    }
    this.setRateInputs(document.querySelectorAll(".goods__action_rate"));
  },
  async showUserCart() {
    const lis = [];
    let totalPrice = 0;
    const userUID = await firebase.auth().currentUser.uid;
    const userGoods = await this.getDBInfo(`goods/${userUID}`);
    Object.entries(userGoods).forEach(async ([cartGoodUID, { goodUID, type }], index) => {
      const good = await this.getDBInfo(`goods/${type}/${goodUID}`);
      const { desc, price, photo, overallRate } = good;

      lis.push(this.getGoodTemplate(desc, price, photo, cartGoodUID, type, overallRate, false, true));

      totalPrice += +price;

      if (Object.entries(userGoods).length - 1 === index) {
        this.getGoodsList().innerHTML = lis.join("");
        this.setRateInputs(document.querySelectorAll(".goods__action_rate"));
        this.totalPriceNode.textContent = totalPrice;
      }

    });
  },
  showTotalPrice(price) {
    document.querySelector(".cart__price").textContent = price;
  },
  async getDBInfo(refTemplate) {
    return new Promise((resolve, reject) => {
      const dbRef = firebase.database().ref(refTemplate);
      dbRef.get().then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject("No data available");
        }
      }).catch((error) => {
        reject(error);
      });
    })
  },
  handleClicks(e) {
    const target = e.target;
    const good = target.closest(".goods__item");
    if (!good) return;

    const { uid, type } = good.dataset;

    if (target.classList.contains("goods__action_remove")) this.deleteHandler(uid, type);
    if (target.classList.contains("goods__action_edit")) {
      this.showModal({
        edit: true,
        type,
        desc: good.querySelector(".goods__desc").textContent,
        price: parseInt(good.querySelector(".info__price").textContent), //fix null
        photo: good.querySelector(".goods__img").src,
        uid,
      });
    };
    if (target.classList.contains("goods__action_add")) this.addToUserCartHandler(uid, type);
    if (target.classList.contains("goods__action_delete-from-cart")) this.deleteFromCartHandler(uid);
  },
  async getRate(type, goodUID) {
    try {
      let totalRate = 0;
      let amountOfRates = 0;
      const rates = await this.getDBInfo(`goods/${type}/${goodUID}/rates`);
      Object.entries(rates).forEach(([userUID, { rate }]) => {
        totalRate += +rate;
        amountOfRates++;
      })
      return totalRate / amountOfRates;
    } catch (error) {
      console.log(error);
    }
  },
  handleRateUpdate(e) {
    const good = e.target.closest(".goods__item");
    const { uid, type } = good.dataset;
    this.updateRate(uid, type, e.target.value);
  },
  getGoodTemplate(desc, price, photo, uid, type, rate, isCrud = false, isCart = false) {
    const crudButtonsTemplate = `
      <button class="goods__action goods__action_edit">${document.documentElement.lang === "ru" ? "Редакт." : "Edit"}</button>
      <button class='goods__action goods__action_remove'>${document.documentElement.lang === "ru" ? "Удалить" : "Delete"}</button>"
    `
    const shopButtonsTemplate = `
      <button class="goods__action goods__action_add">${document.documentElement.lang === "ru" ? "В корзину" : "Add to cart"}</button>
    `
    const userCartButtonsTemplate = `
      <button class="goods__action goods__action_delete-from-cart">${document.documentElement.lang === "ru" ? "Удалить" : "Remove"}</button>
    `
    return `
      <li class="goods__item" data-uid=${uid} data-type=${type}>
        <img class="goods__img" src="${photo}" alt="Good photo" />
        <div class="goods__info info">
          <p class="info__price">${price}$</p>
          <p class="info__rate">${rate}</p>
        </div>
        <p class="goods__desc">${desc}</p>    
        <div class="goods__overlay">
          <div class="goods__btn-container">
            ${isCrud ? crudButtonsTemplate :
        isCart ? userCartButtonsTemplate :
          shopButtonsTemplate}
          <select class="goods__action goods__action_rate">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          </div>
        </div>
      </li>
    `
  },
}