class Auth {
  constructor({ loginBtn, registerBtn, form, errorField }) {
    this.loginBtn = loginBtn;
    this.registerBtn = registerBtn;
    this.form = form;
    this.errorField = errorField;

    this.form.onsubmit = () => false;
    this.loginHandler = this.loginHandler.bind(this);
    this.registerHandler = this.registerHandler.bind(this);

    firebase.auth().onAuthStateChanged((user) => {
      user ? this.stateChangeHandler(true) : this.stateChangeHandler(false);
    });

    this.loginBtn.addEventListener("click", this.loginHandler);
    this.registerBtn.addEventListener("click", this.registerHandler);
  }
  loginHandler() {
    const email = this.form.login.value;
    const password = this.form.password.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        this.showMsg(user.email, "green");
      })
      .catch((error) => {
        let errorMessage = error.message;
        this.showMsg(errorMessage, "red");
      });
  }
  registerHandler() {
    const email = this.form.login.value;
    const password = this.form.password.value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        this.showMsg(user.email, "green");
      })
      .catch((error) => {
        let errorMessage = error.message;
        this.showMsg(errorMessage, "red");
      });
  }
  async logoutHandler() {
    await firebase.auth().signOut();
  }
  stateChangeHandler(login) {
    const headerLink = document.querySelector(".navmenu__login-link");
    if (login) {
      headerLink.textContent = "Profile";
      headerLink.href = "#profile";
      window.location.hash = 'profile';
    } else {
      headerLink.textContent = "Login";
      headerLink.href = "#login";
      window.location.hash = 'login';
    }
  }
  showMsg(msg, color) {
    this.errorField.style.color = color;
    this.errorField.innerHTML = msg;
  }
  clearEror() {
    this.errorField.innerHTML = "";
  }
  setLogoutBtn(btn) {
    this.logoutBtn = btn;
    this.logoutBtn.addEventListener("click", this.logoutHandler);
  }
  async isAdmin() {
    const adminUID = "qRgqa9keKEeqAaCU0EYXv0AYlwg1";
    const userUID = await firebase.auth().currentUser.uid;

    if (adminUID === userUID) return true;
    window.location.hash = "landing";
  }
}