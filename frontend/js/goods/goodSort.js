export const GoodSort = {
  setSortSelect(sortSelect) {
    this.sortSelect = sortSelect;
    this.handleSortInput = this.handleSortInput.bind(this);
    this.sortSelect.addEventListener("input", this.handleSortInput);
  },
  handleSortInput(e) {
    const type = e.target.dataset.type;
    switch (e.target.value) {
      case "price": {
        this.sortByPriceAsc(type);
        break;
      }
      case "popularity": {
        this.sortByPopularity(type);
        break;
      }
      case "date": {
        this.sortByDate(type);
        break;
      }
      case "price desc": {
        this.sortByPriceDesc(type);
        break;
      }
    }
  },
  sortByDate(type) {
    this.showAll([type], false);
  },
  sortByPopularity(type) {
    this.insertedGoods.sort((a, b) => {
      const { overallRate: goodARate } = a[1];
      const { overallRate: goodBRate } = b[1];
      return +goodARate - +goodBRate;
    })
    this.getGoodsList().innerHTML = "";
    this.insertGoods(this.insertedGoods, type, false);
  },
  sortByPriceAsc(type) {
    this.insertedGoods.sort((a, b) => {
      const { price: goodAPrice } = a[1];
      const { price: goodBPrice } = b[1];
      return +goodAPrice - +goodBPrice;
    })
    this.getGoodsList().innerHTML = "";
    this.insertGoods(this.insertedGoods, type, false);
  },
  sortByPriceDesc(type) {
    this.insertedGoods.sort((a, b) => {
      const { price: goodAPrice } = a[1];
      const { price: goodBPrice } = b[1];
      return +goodBPrice - +goodAPrice;
    })
    this.getGoodsList().innerHTML = "";
    this.insertGoods(this.insertedGoods, type, false);
  }
}