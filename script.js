// ---------- TELAS ----------
const loginScreen = document.getElementById('login-screen');
const appScreen   = document.getElementById('app-screen');

// ---------- LOGIN ----------
const loginForm = document.getElementById('login-form');
const loginUser = document.getElementById('login-username');
const loginPass = document.getElementById('login-password');
const logoutBtn = document.getElementById('logout-btn');

// ---------- FORM LIVROS ----------
const bookForm = document.getElementById('book-form');
const titulo = document.getElementById('titulo');
const autor = document.getElementById('autor');
const acquisitionDate = document.getElementById('acquisitionDate');
const inputLocation = document.getElementById('location');
const statusLivro = document.getElementById('status');

const bookList = document.getElementById('book-list');
const tableInfo = document.getElementById('table-info');

// ---------- LOGIN FIXO ----------
const USER = "admin";
const PASS = "1234";

let editIndex = -1;

// ---------- STORAGE ----------
function loadBooks(){
  return JSON.parse(localStorage.getItem("livros") || "[]");
}

function saveBooks(arr){
  localStorage.setItem("livros", JSON.stringify(arr));
}

// ---------- RENDER ----------
function render(){
  const livros = loadBooks();
  bookList.innerHTML = "";

  if(livros.length === 0){
    tableInfo.style.display = "block";
    return;
  }

  tableInfo.style.display = "none";

  livros.forEach((l, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${l.titulo}</td>
      <td>${l.autor}</td>
      <td>${l.data || "-"}</td>
      <td>${l.local || "-"}</td>
      <td>${l.status}</td>
      <td>
        <button class="table-action edit" data-index="${i}">Editar</button>
        <button class="table-action delete" data-index="${i}">Excluir</button>
      </td>
    `;

    bookList.appendChild(tr);
  });
}

// ---------- LOGIN ----------
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  if(loginUser.value === USER && loginPass.value === PASS){
    localStorage.setItem("logged", "1");
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    render();
  } else {
    alert("Usuário ou senha incorretos.");
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.setItem("logged", "0");
  location.reload();
});

// ---------- SALVAR LIVRO ----------
bookForm.addEventListener("submit", e => {
  e.preventDefault();

  if(!titulo.value || !autor.value){
    alert("Preencha título e autor.");
    return;
  }

  const livros = loadBooks();

  const livro = {
    titulo: titulo.value.trim(),
    autor: autor.value.trim(),
    data: acquisitionDate.value,
    local: inputLocation.value.trim(),
    status: statusLivro.value
  };

  if(editIndex === -1){
    livros.unshift(livro);
  } else {
    livros[editIndex] = livro;
    editIndex = -1;
    document.getElementById("save-btn").textContent = "Salvar";
  }

  saveBooks(livros);
  bookForm.reset();
  render();
});

// ---------- EDITAR / EXCLUIR ----------
bookList.addEventListener("click", e => {
  const btn = e.target;
  const index = btn.dataset.index;

  if(btn.classList.contains("edit")){
    startEdit(index);
  }

  if(btn.classList.contains("delete")){
    removeBook(index);
  }
});

function startEdit(i){
  const livro = loadBooks()[i];
  editIndex = i;

  titulo.value = livro.titulo;
  autor.value = livro.autor;
  acquisitionDate.value = livro.data;
  inputLocation.value = livro.local;
  statusLivro.value = livro.status;

  document.getElementById("save-btn").textContent = "Atualizar";
  titulo.focus();
}

function removeBook(i){
  if(!confirm("Deseja excluir este livro?")) return;

  const livros = loadBooks();
  livros.splice(i, 1);
  saveBooks(livros);
  render();
}

// ---------- AUTO LOGIN ----------
if(localStorage.getItem("logged") === "1"){
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  render();
}
