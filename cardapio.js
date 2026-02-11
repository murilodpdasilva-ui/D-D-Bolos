let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let carrinho = [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];

function mostrarAba(id) {
  document.querySelectorAll(".aba").forEach(secao => {
    secao.classList.remove("ativa");
  });
  document.getElementById(id).classList.add("ativa");
}

function renderizarCardapio() {
  const lista = document.getElementById("lista-produtos");
  lista.innerHTML = "";

  produtos.forEach((produto, index) => {
    if(!produto.ativo || produto.quantidade <= 0) return;

    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <strong>${produto.nome}</strong><br>
      ${produto.descricao}<br>
      R$ ${parseFloat(produto.preco).toFixed(2)}<br>
      Estoque: ${produto.quantidade}<br>
      <button onclick="adicionarAoCarrinho(${index})">Adicionar</button>
    `;
    lista.appendChild(div);
  });
}

function adicionarAoCarrinho(index) {
  const produto = produtos[index];
  const existente = carrinho.find(p => p.nome === produto.nome);

  if(existente) {
    existente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  renderizarCarrinho();
  mostrarAba("carrinho");
}

function renderizarCarrinho() {
  const div = document.getElementById("itens-carrinho");
  const totalSpan = document.getElementById("total");
  div.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, i) => {
    total += item.preco * item.quantidade;

    div.innerHTML += `
      <div class="produto">
        ${item.nome} (${item.quantidade})<br>
        R$ ${(item.preco * item.quantidade).toFixed(2)}
        <button onclick="removerItem(${i})">Remover</button>
      </div>
    `;
  });

  totalSpan.textContent = total.toFixed(2);
}

function removerItem(index) {
  carrinho.splice(index, 1);
  renderizarCarrinho();
}

function finalizarCompra() {
  if(carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  historico.push([...carrinho]);
  localStorage.setItem("historico", JSON.stringify(historico));

  carrinho = [];
  renderizarCarrinho();
  renderizarHistorico();

  alert("Pedido finalizado com sucesso!");
}

function renderizarHistorico() {
  const div = document.getElementById("lista-historico");
  div.innerHTML = "";

  historico.forEach((pedido, i) => {
    div.innerHTML += `<div class="produto"><strong>Pedido ${i + 1}</strong><br>`;
    pedido.forEach(item => {
      div.innerHTML += `${item.nome} (${item.quantidade})<br>`;
    });
    div.innerHTML += `</div>`;
  });
}

renderizarCardapio();
renderizarCarrinho();
renderizarHistorico();
