document.querySelector("#language").addEventListener("change", (e) => {
  switch (e.target.value) {
    case "ru": {
      window.location.href = "../index.ru.html";
      break;
    }
    case "en": {
      window.location.href = "../index.html";
      break;
    }
  }
})