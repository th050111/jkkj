
let currentTheme = "white";
let docList = [];
let isSubmit = false;

init();
console.log(dbService)

async function init() {
  const form = document.querySelector(".chat-form")
  form.addEventListener("submit", (event) => onSubmit(event))
  document.querySelector(".reload-btn").addEventListener("click", () => getData());
  document.querySelector(".theme").addEventListener("click", () => {
    modal("container_2")
  })
  document.querySelector(".the2e").addEventListener("submit", (event) => onThemeSubmit(event))

  await getData();
  dbService.collection("docs").doc("articles").onSnapshot(snapshot => {
    const modal = document.querySelector(".chat-modal");
    if (snapshot.data().articles.length > docList.length && !isSubmit){
      document.querySelector('.modal_close_btn').addEventListener('click', function () {
        modal.style.display = 'none';
      });

    modal.style.display = "block";
    }
  })
}


function onThemeSubmit(e) {
  e.preventDefault();
  const radioList = document.querySelectorAll(" input[name='theme']")
  let checkedRadio;
  radioList.forEach((radio) => {
    if (radio.checked)
      checkedRadio = radio.value;
  })
  document.body.className = checkedRadio;
  document.querySelector(".container_2").style.display = "none";
}

async function getData() {
  document.querySelector(".chat-modal").style.display = 'none';
  await dbService.collection("docs").doc("articles").get().then((snap) => {
    docList = snap.data().articles;
  })
  writeDocs();
}

function writeDocs() {
  const chatList = document.querySelector("#chat-list");
  chatList.innerHTML = "";
  if (!docList)
    return;
  docList.forEach((doc) => {
    const div = document.createElement("div");
    div.className = "chat_box"
    console.log(doc)
    div.innerHTML = `${doc.date} ${doc.body}`
    chatList.appendChild(div)
  })
}

async function onSubmit(e) {
  isSubmit = true;
  const newArticle = document.querySelector(".sodyddlqfur").value
  document.querySelector(".sodyddlqfur").value = "";
  e.preventDefault()
  await dbService.collection("docs").doc("articles").get().then(async (snap) => {
    let articles;
    console.log(snap.data().articles)
    if (snap.data().articles.length > 0) {
      articles = snap.data().articles
    } else {
      articles = [];
    }
    console.log(articles)
    const now = new Date();
    articles.unshift({
      body: newArticle,
      date: `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}.${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    })
    await dbService.collection("docs").doc("articles").set({
      articles: articles
    })
  })
  await getData()
  isSubmit = false;
}

function modal(id) {
  var zIndex = 9999;
  var modal = document.querySelector(`.${id}`);

  // 닫기 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
  document.querySelector(`.${id} .back-layer`).addEventListener('click', function () {
    modal.style.display = 'none';
  });

  modal.style.display = "block";
}
