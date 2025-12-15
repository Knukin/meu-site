const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');

const loginForm = document.getElementById('login-form');
const loginUser = document.getElementById('login-username');
const loginPass = document.getElementById('login-password');

const logoutBtn = document.getElementById('logout-btn');

const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const tableInfo = document.getElementById('table-info');

const USER = "admin";
const PASS = "1234";
let editIndex = -1;

function loadBooks(){
  return JSON.parse(localStorage.getItem("livros") || "[]");
}
function saveBooks(b){
  localStorage.setItem("livros", JSON.stringify(b));
}

function render(){
  const livros = loadBooks();
  bookList.innerHTML = "";

  if(livros.length === 0){
    tableInfo.style.display="block";
    return;
  }
  tableInfo.style.display="none";

  livros.forEach((l,i)=>{
    bookList.innerHTML += `
      <tr>
        <td>${l.titulo}</td>
        <td>${l.autor}</td>
        <td>${l.data || "-"}</td>
        <td>${l.local || "-"}</td>
        <td>${l.status}</td>
        <td>
          <button class="table-action edit" onclick="edit(${i})">Editar</button>
          <button class="table-action delete" onclick="del(${i})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

loginForm.onsubmit = e =>{
  e.preventDefault();
  if(loginUser.value === USER && loginPass.value === PASS){
    localStorage.setItem("logged","1");
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    render();
  }else{
    alert("Usuário ou senha incorretos");
  }
};

logoutBtn.onclick = ()=>{
  localStorage.setItem("logged","0");
  location.reload();
};

bookForm.onsubmit = e =>{
  e.preventDefault();
  const livros = loadBooks();
  const livro = {
    titulo: titulo.value,
    autor: autor.value,
    data: acquisitionDate.value,
    local: location.value,
    status: status.value
  };
  editIndex === -1 ? livros.unshift(livro) : livros[editIndex]=livro;
  editIndex=-1;
  saveBooks(livros);
  bookForm.reset();
  render();
};

function edit(i){
  const l = loadBooks()[i];
  titulo.value=l.titulo;
  autor.value=l.autor;
  acquisitionDate.value=l.data;
  location.value=l.local;
  status.value=l.status;
  editIndex=i;
}

function del(i){
  if(confirm("Excluir livro?")){
    const l=loadBooks();
    l.splice(i,1);
    saveBooks(l);
    render();
  }
}

if(localStorage.getItem("logged")==="1"){
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  render();
}
