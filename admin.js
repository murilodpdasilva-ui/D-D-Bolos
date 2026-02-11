import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

window.adicionarProduto = async function() {
  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const categoria = document.getElementById("categoria").value || "Outros";

  if(!nome||!descricao||isNaN(preco)||isNaN(quantidade)){
    alert("Preencha todos os campos corretamente!");
    return;
  }

  await addDoc(collection(db,"produtos"),{nome,descricao,preco,quantidade,categoria});
  document.getElementById("nome").value="";
  document.getElementById("descricao").value="";
  document.getElementById("preco").value="";
  document.getElementById("quantidade").value="";
  document.getElementById("categoria").value="";

  carregarProdutosAdmin();
}

async function carregarProdutosAdmin() {
  const lista = document.getElementById("lista-admin");
  lista.innerHTML="";
  const snapshot = await getDocs(collection(db,"produtos"));
  snapshot.forEach(docSnap=>{
    const p = docSnap.data();
    const id = docSnap.id;
    const div = document.createElement("div");
    div.className="produto";
    div.innerHTML=`<strong>${p.nome}</strong> (${p.categoria})<br>${p.descricao}<br>R$ ${p.preco}<br>Estoque: ${p.quantidade}<br>
      <button onclick="removerProduto('${id}')">Remover</button>`;
    lista.appendChild(div);
  });
}

window.removerProduto = async function(id){
  await deleteDoc(doc(db,"produtos",id));
  carregarProdutosAdmin();
}

carregarProdutosAdmin();
