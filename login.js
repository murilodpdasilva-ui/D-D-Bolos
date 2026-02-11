function login() {
  const senha = document.getElementById("senhaAdmin").value;
  const erro = document.getElementById("erroLogin");

  if (senha === "1821") {
    window.location.href = "admin.html";
  } else {
    erro.innerText = "Senha incorreta!";
  }
}
