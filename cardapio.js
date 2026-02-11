// Pega os produtos do localStorage adicionados pelo admin
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let carrinho = []; // cada item: {produto, quantidade}

// Renderizar cardápio
function renderizarCardapio() {
  const cardapioDiv = document.getElementById("cardapio");
  cardapioDiv.innerHTML = "";

  produtos.forEach((produto, index) => {
    if(!produto.ativo || produto.quantidade <= 0) return; // só produtos ativos com estoque

    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <strong>${produto.nome}</strong><br>
      <small>${produto.descricao}</small><br>
      R$ ${parseFloat(produto.preco).toFixed(2)}<br>
      Estoque: ${produto.quantidade}<br>
      <button onclick="adicionarAoCarrinho(${index})">Adicionar ao Carrinho</button>
    `;
    cardapioDiv.appendChild(div);
  });
}

// Adicionar produto ao carrinho respeitando estoque
function adicionarAoCarrinho(index) {
  const produto = produtos[index];
  if(produto.quantidade <= 0) {
    alert("Produto sem estoque!");
    return;
  }

  const itemExistente = carrinho.find(item => item.produto.nome === produto.nome);

  if(itemExistente) {
    if(itemExistente.quantidade < produto.quantidade) {
      itemExistente.quantidade += 1;
    } else {
      alert("Não há mais unidades disponíveis!");
      return;
    }
  } else {
    carrinho.push({ produto, quantidade: 1 });
  }

  renderizarCarrinho();
  document.getElementById("carrinho").style.display = "block";
}

// Renderizar carrinho
function renderizarCarrinho() {
  const carrinhoDiv = document.getElementById("itens-carrinho");
  const totalSpan = document.getElementById("total");
  carrinhoDiv.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, i) => {
    total += parseFloat(item.produto.preco) * item.quantidade;

    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <strong>${item.produto.nome}${item.quantidade > 1 ? ' (' + item.quantidade + ')' : ''}</strong> - R$ ${(parseFloat(item.produto.preco) * item.quantidade).toFixed(2)}
      <div class="botoes-quantidade">
        <button onclick="alterarQuantidade(${i}, -1)">-</button>
        <button onclick="alterarQuantidade(${i}, 1)">+</button>
      </div>
    `;
    carrinhoDiv.appendChild(div);
  });

  totalSpan.textContent = total.toFixed(2);
}

// Alterar quantidade de um item no carrinho
function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;

  if(carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }

  renderizarCarrinho();
}

// Abrir modal de checkout
function finalizarCompra() {
  if(carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  document.getElementById("checkout").style.display = "block";
}

// Fechar modal
function fecharCheckout() {
  document.getElementById("checkout").style.display = "none";
}

// Enviar pedido via WhatsApp
function enviarPedido() {
  const metodoPagamento = document.getElementById("metodoPagamento").value;
  const tipoEntrega = document.getElementById("tipoEntrega").value;

  let mensagem = "Olá! Gostaria de fazer o pedido:\n";
  let total = 0;

  carrinho.forEach(item => {
    const precoTotal = parseFloat(item.produto.preco) * item.quantidade;
    total += precoTotal;
    mensagem += `- ${item.produto.nome}${item.quantidade > 1 ? ' (' + item.quantidade + ')' : ''} - R$ ${precoTotal.toFixed(2)}\n`;
  });

  mensagem += `\nTotal: R$ ${total.toFixed(2)}`;
  mensagem += `\nPagamento: ${metodoPagamento}`;
  mensagem += `\nEntrega: ${tipoEntrega}`;

  const mensagemURL = encodeURIComponent(mensagem);
  const numeroWhatsApp = "5511999999999"; // coloque seu número real
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemURL}`, "_blank");

  carrinho = [];
  renderizarCarrinho();
  fecharCheckout();
}

// Inicializar
renderizarCardapio();
renderizarCarrinho();
