


let carrinho = [];


const restaurante = {
  nome: "Meu Restaurante",
  whatsapp: "5511999999999"
};

document.querySelector("h1").innerText = restaurante.nome;

const lista = document.getElementById("lista-produtos");

const produtos =
  JSON.parse(localStorage.getItem("produtos")) || [];

produtos.forEach(produto => {
  const div = document.createElement("div");
  div.className = "produto";

  div.innerHTML = `
   <h3>${produto.nome}</h3>
  <p>${produto.descricao}</p>
  <p><strong>R$ ${produto.preco}</strong></p>
  <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco})">
  Adicionar ao carrinho
</button>

`;

  lista.appendChild(div);
});

function pedir(produto) {
  const mensagem = `Olá! Quero pedir um ${produto}`;
  window.open(
    `https://wa.me/${restaurante.whatsapp}?text=${encodeURIComponent(mensagem)}`,
    "_blank"
  );
}

function adicionarAoCarrinho(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome && item.observacao === "");

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1, observacao: "" });
  }

  atualizarCarrinho();
}



function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  const totalTexto = document.getElementById("totalCarrinho");
  if (!lista || !totalTexto) return;

  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nome}</strong> - R$ ${item.preco.toFixed(2)} x ${item.quantidade} = R$ ${(item.preco*item.quantidade).toFixed(2)}<br>
      
      <label>Observação: </label>
      <input type="text" value="${item.observacao || ''}" 
             oninput="editarObservacao(${index}, this.value)" 
             placeholder="Opcional"><br>

      <button onclick="diminuirQuantidade(${index})">−</button>
      <button onclick="aumentarQuantidade(${index})">+</button>
      <button onclick="removerDoCarrinho(${index})">❌</button>
    `;
    lista.appendChild(li);
  });

  totalTexto.innerText = "Total: R$ " + total.toFixed(2);
 
}




function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function enviarPedido() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  let mensagem = "Olá! Quero fazer o pedido:%0A";
  let total = 0;

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${item.preco.toFixed(2)} x ${item.quantidade} = R$ ${(item.preco*item.quantidade).toFixed(2)})`;
    if (item.observacao) {
      mensagem += ` | Observação: ${item.observacao}`;
    }
    mensagem += "%0A";
    total += item.preco * item.quantidade;
  });

  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  const telefone = "5521976152436"; // troque pelo seu número
  window.open(`https://wa.me/${telefone}?text=${mensagem}`);
}


function aumentarQuantidade(index) {
  carrinho[index].quantidade += 1;
  atualizarCarrinho();
}

function diminuirQuantidade(index) {
  if (carrinho[index].quantidade > 1) {
    carrinho[index].quantidade -= 1;
  } else {
    carrinho.splice(index, 1); // remove se chegar a zero
  }
  atualizarCarrinho();
}

function editarObservacao(index, valor) {
  carrinho[index].observacao = valor;
}


