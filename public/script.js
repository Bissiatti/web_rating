const rating = document.querySelector('#rating');
const names = document.querySelector('#names');

let buttons = [];


fetch('/tables').then(response => response.json()).then(data => {
  console.log(data);
  data.forEach(table => {
    const b = document.createElement('button');
    buttons.push(b);
    b.addEventListener('click', () => {
      // change the button color to #ededed and the others to white
      buttons.forEach(button => {
        button.style.backgroundColor = '#3d71a2';
        button.style.color = 'white';
      });
      b.style.backgroundColor = '#012B39';
      b.style.color = '#E2B842';
      fetch('/rating?table=' + table).then(response => response.json()).then(data => {
        rating.innerHTML = '';
        
        // Cria a tabela e adiciona cabeçalho
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headerRow = document.createElement('tr');
        
        ['Position', 'Name', 'Rating'].forEach(text => {
            const th = document.createElement('th');
            th.appendChild(document.createTextNode(text));
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Adiciona os dados à tabela
        data.forEach((item, i) => {
            const row = document.createElement('tr');
            
            [i+1, item.index, Number(item.Rating).toFixed(2)].forEach(text => {
                const td = document.createElement('td');
                td.appendChild(document.createTextNode(text));
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        rating.appendChild(table);
    });
    });
    const t = document.createTextNode(table);
    b.appendChild(t);
    names.appendChild(b);
  });
});

// Cria o botão
let button = document.createElement('button');

// Define o texto do botão
button.textContent = 'Compare players evolutions';

// Define o evento de clique do botão
button.onclick = function() {
    window.location.href = '/search';
};

// Adiciona o botão ao cabeçalho
let header = document.querySelector('header'); // Substitua 'header' pelo seletor correto do seu cabeçalho
header.appendChild(button);

const h1 = document.querySelector('h1');

h1.addEventListener('click', () => {
  window.location.href = '/';
});
