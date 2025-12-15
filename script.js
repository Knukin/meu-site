const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');

const loginForm = document.getElementById('login-form');
const loginUser = document.getElementById('login-username');
const loginPass = document.getElementById('login-password');
const logoutBtn = document.getElementById('logout-btn');

const bookForm = document.getElementById('book-form');
const titulo = document.getElementById('titulo');
const autor = document.getElementById('autor');
const acquisitionDate = document.getElementById('acquisitionDate');
const inputLocation = document.getElementById('location');
const statusLivro = document.getElementById('status');

const bookList = document.getElementById('book-list');
const tableInfo = document.getElementById('table-info');

const USER = "admin";
const PASS = "1234";
let editIndex = -1;

function loadBooks(){
  return JSON.parse(localStorage.getItem("livros") || "[]");
}
function saveBooks(arr){
  localStorage.setItem("livros", JSON.stringify(arr));
}

function render(){
  const livros = loadBooks();
  bookList.innerHTML = "";

  tableInfo.style.display = livros.length ? "none" : "block";

  livros.forEach((l,i)=>{
    bookList.innerHTML += `
      <tr>
        <td data-label="Título">${l.titulo}</td>
        <td data-label="Autor">${l.autor}</td>
        <td data-label="Data">${l.data||"-"}</td>
        <td data-label="Local">${l.local||"-"}</td>
        <td data-label="Status">${l.status}</td>
        <td data-label="Ações">
          <button class="table-action edit" data-i="${i}">Editar</button>
          <button class="table-action delete" data-i="${i}">Excluir</button>
        </td>
      </tr>`;
  });
}

loginForm.onsubmit = e =>{
  e.preventDefault();
  if(loginUser.value===USER && loginPass.value===PASS){
    localStorage.setItem("logged","1");
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    render();
  } else alert("Usuário ou senha incorretos");
};

logoutBtn.onclick = ()=>{localStorage.setItem("logged","0");location.reload();};

bookForm.onsubmit = e =>{
  e.preventDefault();
  const livros = loadBooks();
  const livro = {
    titulo:titulo.value,
    autor:autor.value,
    data:acquisitionDate.value,
    local:inputLocation.value,
    status:statusLivro.value
  };
  editIndex<0?livros.unshift(livro):livros[editIndex]=livro;
  editIndex=-1;
  saveBooks(livros);
  bookForm.reset();
  render();
};

bookList.onclick = e =>{
  const i = e.target.dataset.i;
  if(e.target.classList.contains("edit")){
    const l = loadBooks()[i];
    titulo.value=l.titulo;
    autor.value=l.autor;
    acquisitionDate.value=l.data;
    inputLocation.value=l.local;
    statusLivro.value=l.status;
    editIndex=i;
  }
  if(e.target.classList.contains("delete")){
    if(confirm("Excluir livro?")){
      const l=loadBooks();l.splice(i,1);saveBooks(l);render();
    }
  }
};

if(localStorage.getItem("logged")==="1"){
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  render();
}
