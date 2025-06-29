async function carregarCapitais() {
  const response = await fetch('/capitais');
  const capitais = await response.json();
  const origem = document.getElementById('origem');
  const destino = document.getElementById('destino');

  capitais.forEach(c => {
    origem.innerHTML += `<option value="${c}">${c}</option>`;
    destino.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const origem = document.getElementById('origem').value;
  const destino = document.getElementById('destino').value;
  const preco = document.getElementById('preco').value;
  const autonomia = document.getElementById('autonomia').value;

  const res = await fetch('/rota', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origem, destino, precoCombustivel: preco, autonomia })
  });

  const resultado = document.getElementById('resultado');
  const data = await res.json();

  if (res.ok) {
    resultado.innerText = `Melhor rota: ${data.path.join(' → ')}\nCusto total: R$ ${data.cost}`;
  } else {
    resultado.innerText = data.error;
  }
});

carregarCapitais();
