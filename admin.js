// Pega os produtos do localStorage ou cria vazio
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let editandoIndex = null;

const lista = document.getElementById("lista-admin");

// Salva produtos no localStorage
function salvar() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// Renderiza a lista de produtos
function renderizar() {
  lista.innerHTML = "";

  produtos.forEach((produto, index) => {
    const div = document.createElement("div");
    div.className = "produto";

    div.innerHTML = `
      <strong>${produto.nome}</strong> (${produto.quantidade} disponíveis)<br>
      <small>${produto.descricao}</small><br>
      R$ ${parseFloat(produto.preco).toFixed(2)}<br>
      Ativo no cardápio: ${produto.ativo ? "Sim" : "Não"}<br><br>
      <button onclick="editar(${index})">Editar</button>
      <button onclick="remover(${index})">Remover</button>
      <button onclick="toggleAtivo(${index})">${produto.ativo ? "Retirar do cardápio" : "Adicionar ao cardápio"}</button>
    `;

    lista.appendChild(div);
  });
}

// Adicionar novo produto ou salvar edição
function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const preco = document.getElementById("preco").value;
  const quantidade = document.getElementById("quantidade").value;

  if (!nome || !preco || !quantidade) {
    alert("Preencha todos os campos!");
    return;
  }

  if(editandoIndex !== null) {
    // Editar produto existente
    produtos[editandoIndex] = {
      ...produtos[editandoIndex],
      nome,
      descricao,
      preco,
      quantidade: parseInt(quantidade)
    };
    editandoIndex = null;
  } else {
    // Adicionar novo produto
    produtos.push({
      nome,
      descricao,
      preco,
      quantidade: parseInt(quantidade),
      ativo: true
    });
  }

  salvar();
  renderizar();

  // Limpa campos
  document.getElementById("nome").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("quantidade").value = "";
}

// Remover produto do estoque
function remover(index) {
  produtos.splice(index, 1);
  salvar();
  renderizar();
}

// Alternar se produto aparece no cardápio
function toggleAtivo(index) {
  produtos[index].ativo = !produtos[index].ativo;
  salvar();
  renderizar();
}

// Editar produto
function editar(index) {
  const produto = produtos[index];

  document.getElementById("nome").value = produto.nome;
  document.getElementById("descricao").value = produto.descricao;
  document.getElementById("preco").value = produto.preco;
  document.getElementById("quantidade").value = produto.quantidade;

  editandoIndex = index;
}

// Inicializa
renderizar();
