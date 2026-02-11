let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

// Adicionar produto
function adicionarProduto(){
  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const preco = Number(document.getElementById("preco").value);
  const quantidade = Number(document.getElementById("quantidade").value);

  if(!nome || !descricao || !preco || !quantidade){ alert("Preencha todos os campos!"); return; }

  produtos.push({ nome, descricao, preco, quantidade, ativo:true });
  localStorage.setItem("produtos", JSON.stringify(produtos));
  renderizarAdmin();
  document.getElementById("nome").value="";
  document.getElementById("descricao").value="";
  document.getElementById("preco").value="";
  document.getElementById("quantidade").value="";
}

// Renderizar lista de produtos
function renderizarAdmin(){
  const lista = document.getElementById("lista-admin");
  lista.innerHTML="";
  produtos.forEach((p,index)=>{
    const div = document.createElement("div");
    div.className="produto";
    div.innerHTML = `
      <h3>${p.nome}</h3>
      <p>${p.descricao}</p>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <p>Qtd: ${p.quantidade}</p>
      <button onclick="removerProduto(${index})">Remover</button>
    `;
    lista.appendChild(div);
  });
}

// Remover produto
function removerProduto(index){
  produtos.splice(index,1);
  localStorage.setItem("produtos",JSON.stringify(produtos));
  renderizarAdmin();
}

// Inicializar
renderizarAdmin();
