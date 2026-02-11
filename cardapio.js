import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCzbARMpHLybFuU-1xFqH0QIc-MuoeRIRE",
  authDomain: "dd-bolos.firebaseapp.com",
  projectId: "dd-bolos",
  storageBucket: "dd-bolos.firebasestorage.app",
  messagingSenderId: "887742402793",
  appId: "1:887742402793:web:e13d26f8e9ca28a94f2078"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let produtos = [];
let carrinho = [];

const loginScreen = document.getElementById("loginScreen");
const mainScreen = document.getElementById("mainScreen");
const nomeUserSpan = document.getElementById("nomeUser");
const botaoEstoque = document.getElementById("botaoEstoque");
const cardapioDiv = document.getElementById("cardapio");
const carrinhoDiv = document.getElementById("carrinho");
const totalSpan = document.getElementById("total");

// LOGIN SIMPLES
window.logar = async function() {
  const nome = document.getElementById("loginNome").value.trim();
  const senha = document.getElementById("loginSenha").value;

  if(nome === "" || senha === "") { alert("Preencha nome e senha!"); return; }

  loginScreen.style.display = "none";
  mainScreen.style.display = "block";

  if(nome === "administrador D&D" && senha === "182112") {
    botaoEstoque.style.display = "inline-block";
    nomeUserSpan.textContent = "Administrador D&D";
  } else {
    nomeUserSpan.textContent = nome;
  }

  await carregarProdutos();
};

// MOSTRAR CARDÁPIO / CARRINHO
window.mostrarCardapio = function() { cardapioDiv.style.display="grid"; carrinhoDiv.style.display="none"; }
window.mostrarCarrinho = function() { cardapioDiv.style.display="none"; carrinhoDiv.style.display="block"; }

// CARREGAR PRODUTOS DO FIRESTORE
async function carregarProdutos() {
  const snapshot = await getDocs(collection(db,"produtos"));
  produtos = [];
  cardapioDiv.innerHTML="";
  
  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    p.id = docSnap.id;
    produtos.push(p);
  });

  renderizarCardapio();
}

// RENDER CARDÁPIO
function renderizarCardapio() {
  cardapioDiv.innerHTML="";
  const categorias = [...new Set(produtos.map(p=>p.categoria || "Outros"))];

  categorias.forEach(cat=>{
    const divCat = document.createElement("div");
    divCat.className="categoria";
    divCat.innerHTML=`<h3>${cat}</h3>`;
    produtos.filter(p=>p.categoria===cat || (!p.categoria && cat==="Outros"))
            .forEach(prod=>{
      const div = document.createElement("div");
      div.className="produto";
      div.innerHTML = `
        <h4>${prod.nome}</h4>
        <p>${prod.descricao || ""}</p>
        <p>R$ ${Number(prod.preco).toFixed(2)}</p>
        <p>Estoque: ${prod.quantidade}</p>
        <button onclick="adicionarCarrinho('${prod.id}')">Adicionar</button>
      `;
      divCat.appendChild(div);
    });
    cardapioDiv.appendChild(divCat);
  });
}

// ADICIONAR AO CARRINHO
window.adicionarCarrinho = function(id) {
  const produto = produtos.find(p=>p.id===id);
  if(!produto || produto.quantidade<=0){ alert("Produto sem estoque!"); return; }

  let item = carrinho.find(p=>p.id===id);
  if(item) {
    if(item.quantidade<produto.quantidade) item.quantidade++;
    else { alert("Limite atingido!"); return; }
  } else {
    carrinho.push({...produto, quantidade:1});
  }

  atualizarCarrinho();
  mostrarCarrinho();
}

// ATUALIZAR CARRINHO
function atualizarCarrinho() {
  carrinhoDiv.innerHTML="";
  let total = 0;
  carrinho.forEach(item=>{
    total += item.preco*item.quantidade;
    carrinhoDiv.innerHTML+=`
      <div class="produto-carrinho">
        <p>${item.nome} - ${item.quantidade}x - R$ ${(item.preco*item.quantidade).toFixed(2)}</p>
        <button onclick="alterarQtd('${item.id}',-1)">-</button>
        <button onclick="alterarQtd('${item.id}',1)">+</button>
      </div>
    `;
  });
  totalSpan.textContent = total.toFixed(2);
}

// ALTERAR QUANTIDADE
window.alterarQtd=function(id,delta){
  const item = carrinho.find(p=>p.id===id);
  if(!item) return;
  item.quantidade += delta;
  if(item.quantidade<=0) carrinho = carrinho.filter(p=>p.id!==id);
  atualizarCarrinho();
}

// FINALIZAR COMPRA (WHATSAPP + ATUALIZA ESTOQUE)
window.finalizarCompra = async function() {
  if(carrinho.length===0){ alert("Carrinho vazio!"); return; }
  let mensagem="Olá! Gostaria de fazer o pedido:\n";
  let total=0;
  for(const item of carrinho){
    const produtoRef=doc(db,"produtos",item.id);
    const original=produtos.find(p=>p.id===item.id);
    const novoEstoque = original.quantidade-item.quantidade;
    await updateDoc(produtoRef,{quantidade:novoEstoque});
    mensagem+=`${item.nome} - ${item.quantidade}x\n`;
    total += item.preco*item.quantidade;
  }
  mensagem+=`\nTotal: R$ ${total.toFixed(2)}`;
  window.open(`https://wa.me/5521976152436?text=${encodeURIComponent(mensagem)}`,"_blank");
  carrinho=[];
  atualizarCarrinho();
  carregarProdutos();
}
