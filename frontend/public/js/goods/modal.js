import { getHtml } from "../router.js";

export const Modal = {
  async showModal({ edit = false, type, desc, price, photo, uid }) {
    this.modal.innerHTML = await getHtml("modal");
    document.body.style.overflow = "hidden";

    this.form = this.modal.querySelector(".modal__form");
    this.closeBtn = this.modal.querySelector(".close-modal");
    this.saveBtn = this.modal.querySelector(".add-good-btn");

    this._centerModal();

    if (edit) {
      this.form.goodType.value = type;
      this.form.goodDesc.value = desc;
      this.form.goodPrice.value = price;
    }

    this.form.onsubmit = (e) => e.preventDefault();

    this.closeBtn.addEventListener("click", this.hideModal);
    this.saveBtn.addEventListener("click", async () => {
      let photoBase64;
      try {
        photoBase64 = await this.getBase64(document.forms.modalForm.goodPhoto.files[0]);
      } catch (error) {
        photoBase64 = photo || "";
      }

      if (edit) {
        this.editHandler({
          uid,
          desc: document.forms.modalForm.goodDesc.value,
          price: document.forms.modalForm.goodPrice.value,
          photo: photoBase64 || photo,
          type: document.forms.modalForm.goodType.value,
        })
      } else {
        this.createHandler({
          desc: document.forms.modalForm.goodDesc.value,
          price: document.forms.modalForm.goodPrice.value,
          photo: photoBase64,
          type: document.forms.modalForm.goodType.value,
        })
      }
    });

  },
  _centerModal() {
    let scrolledPart = document.documentElement.scrollTop;
    document.querySelector(".overlay-modal").style.top = scrolledPart + "px";
  },
  async hideModal() {
    this.modal.innerHTML = "";
    document.body.style.overflow = "auto";
  }
}