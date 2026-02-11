let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let carrinho = [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];

function mostrarAba(id){
  document.querySelectorAll(".aba").forEach(secao=>secao.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

function renderizarCardapio(){
  produtos = JSON.parse(localStorage.getItem("produtos"))||[];
  const lista = document.getElementById("lista-produtos");
  if(!lista) return;
  lista.innerHTML="";

  produtos.forEach((produto,index)=>{
    if(!produto.ativo || produto.quantidade<=0) return;
    const div=document.createElement("div");
    div.className="produto";
    div.innerHTML=`
      <strong>${produto.nome}</strong><br>
      <small>${produto.descricao}</small><br>
      R$ ${parseFloat(produto.preco).toFixed(2)}<br>
      Estoque: ${produto.quantidade}<br>
      <button onclick="adicionarAoCarrinho(${index})">Adicionar</button>
    `;
    lista.appendChild(div);
  });
}

function adicionarAoCarrinho(index){
  produtos = JSON.parse(localStorage.getItem("produtos"))||[];
  const produto=produtos[index];
  if(produto.quantidade<=0){alert("Produto sem estoque!"); return;}

  const existente=carrinho.find(item=>item.produto.nome===produto.nome);
  if(existente){
    if(existente.quantidade<produto.quantidade) existente.quantidade++;
    else {alert("Limite de estoque atingido!"); return;}
  } else {carrinho.push({produto,quantidade:1});}

  renderizarCarrinho(); mostrarAba("carrinho");
}

function renderizarCarrinho(){
  const div=document.getElementById("itens-carrinho");
  const totalSpan=document.getElementById("total");
  if(!div||!totalSpan) return;
  div.innerHTML="";
  let total=0;

  carrinho.forEach((item,i)=>{
    total+=parseFloat(item.produto.preco)*item.quantidade;
    div.innerHTML+=`
      <div class="produto">
        <strong>${item.produto.nome}</strong> (${item.quantidade})<br>
        R$ ${(item.produto.preco*item.quantidade).toFixed(2)}<br>
        <button onclick="alterarQuantidade(${i},-1)">-</button>
        <button onclick="alterarQuantidade(${i},1)">+</button>
      </div>
    `;
  });

  totalSpan.textContent=total.toFixed(2);
}

function alterarQuantidade(index,delta){
  carrinho[index].quantidade+=delta;
  if(carrinho[index].quantidade<=0) carrinho.splice(index,1);
  renderizarCarrinho();
}

function finalizarCompra(){
  if(carrinho.length===0){alert("Carrinho vazio!"); return;}
  let mensagem="Olá! Gostaria de fazer o pedido:\n";
  let total=0;

  carrinho.forEach(item=>{
    const subtotal=item.produto.preco*item.quantidade;
    total+=subtotal;
    mensagem+=`- ${item.produto.nome} (${item.quantidade}) - R$ ${subtotal.toFixed(2)}\n`;
  });

  mensagem+=`\nTotal: R$ ${total.toFixed(2)}`;
  const numeroWhatsApp="5521976152436";
  const mensagemURL=encodeURIComponent(mensagem);

  carrinho.forEach(item=>{
    const indexProduto=produtos.findIndex(p=>p.nome===item.produto.nome);
    if(indexProduto!==-1) produtos[indexProduto].quantidade-=item.quantidade;
  });

  localStorage.setItem("produtos",JSON.stringify(produtos));
  historico.push(carrinho);
  localStorage.setItem("historico",JSON.stringify(historico));

  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemURL}`,"_blank");
  carrinho=[];
  renderizarCarrinho();
  renderizarCardapio();
}

function renderizarHistorico(){
  const div=document.getElementById("lista-historico");
  if(!div) return;
  div.innerHTML="";
  historico.forEach((pedido,i)=>{
    div.innerHTML+=`<div class="produto"><strong>Pedido ${i+1}</strong><br>`;
    pedido.forEach(item=>{
      div.innerHTML+=`${item.produto.nome} (${item.quantidade})<br>`;
    });
    div.innerHTML+=`</div>`;
  });
}

renderizarCardapio();
renderizarCarrinho();
renderizarHistorico();
