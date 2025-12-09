// ---------- Seletores ----------
const loginScreen = document.getElementById('login-screen');
const appScreen   = document.getElementById('app-screen');

const loginForm   = document.getElementById('login-form');
const loginUser   = document.getElementById('login-username');
const loginPass   = document.getElementById('login-password');

const logoutBtn   = document.getElementById('logout-btn');

const bookForm    = document.getElementById('book-form');
const inputTitle  = document.getElementById('titulo');
const inputAuthor = document.getElementById('autor');
const inputDate   = document.getElementById('acquisitionDate');
const inputPlace  = document.getElementById('location');
const inputStatus = document.getElementById('status');

const bookListTbody = document.getElementById('book-list');
const tableInfo      = document.getElementById('table-info');

const USER = 'admin';
const PASS = '1234';

let editingIndex = -1;

// ---------- Storage ----------
function loadBooks(){
  try {
    return JSON.parse(localStorage.getItem('livros') || '[]');
  } catch {
    return [];
  }
}
function saveBooks(arr){
  localStorage.setItem('livros', JSON.stringify(arr));
}

// ---------- Render ----------
function renderTable(){
  const livros = loadBooks();
  bookListTbody.innerHTML = '';

  if (livros.length === 0){
    tableInfo.style.display = 'block';
    return;
  } else {
    tableInfo.style.display = 'none';
  }

  livros.forEach((l, idx) => {
    const tr = document.createElement('tr');

    const dateStr = l.acquisitionDate ? new Date(l.acquisitionDate).toLocaleDateString() : '-';

    tr.innerHTML = `
      <td data-label="Título"><strong>${escapeHtml(l.titulo)}</strong></td>
      <td data-label="Autor">${escapeHtml(l.autor)}</td>
      <td data-label="Data">${dateStr}</td>
      <td data-label="Local">${escapeHtml(l.location || '')}</td>
      <td data-label="Status">${escapeHtml(l.status)}</td>
      <td data-label="Ações">
        <button class="table-action edit" data-idx="${idx}">Editar</button>
        <button class="table-action delete" data-idx="${idx}">Excluir</button>
      </td>
    `;

    bookListTbody.appendChild(tr);
  });
}

function escapeHtml(s){
  if (!s) return '';
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ---------- Login ----------
function showApp(){
  loginScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
}

function showLogin(){
  loginScreen.classList.remove('hidden');
  appScreen.classList.add('hidden');
  loginForm.reset();
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (loginUser.value === USER && loginPass.value === PASS){
    localStorage.setItem('acervo_logged', '1');
    showApp();
    renderTable();
  } else {
    alert("Usuário ou senha incorretos.");
  }
});

window.addEventListener('load', () => {
  if (localStorage.getItem('acervo_logged') === '1'){
    showApp();
    renderTable();
  } else {
    showLogin();
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.setItem('acervo_logged', '0');
  showLogin();
});

// ---------- Salvar Livro ----------
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = inputTitle.value.trim();
  const autor  = inputAuthor.value.trim();

  if (!titulo || !autor){
    alert("Preencha título e autor.");
    return;
  }

  const livro = {
    titulo,
    autor,
    acquisitionDate: inputDate.value || '',
    location: inputPlace.value.trim(),
    status: inputStatus.value,
    updatedAt: new Date().toISOString()
  };

  const livros = loadBooks();

  if (editingIndex === -1){
    livros.unshift(livro);
  } else {
    livros[editingIndex] = { ...livros[editingIndex], ...livro };
    editingIndex = -1;
    document.getElementById('save-btn').textContent = 'Salvar';
  }

  saveBooks(livros);
  renderTable();
  bookForm.reset();
});

// ---------- Editar / Excluir ----------
bookListTbody.addEventListener('click', (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const idx = Number(btn.dataset.idx);

  if (btn.classList.contains("edit")){
    startEdit(idx);
  } else if (btn.classList.contains("delete")){
    removeBook(idx);
  }
});

function startEdit(i){
  const livro = loadBooks()[i];
  editingIndex = i;

  inputTitle.value = livro.titulo;
  inputAuthor.value = livro.autor;
  inputDate.value = livro.acquisitionDate || "";
  inputPlace.value = livro.location || "";
  inputStatus.value = livro.status;

  document.getElementById("save-btn").textContent = "Atualizar";
  inputTitle.focus();
}

function removeBook(i){
  if (!confirm("Excluir este livro?")) return;
  const arr = loadBooks();
  arr.splice(i, 1);
  saveBooks(arr);
  renderTable();
}

// Inicializa
renderTable();
