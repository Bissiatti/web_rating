// var yourVlSpec = {
//     $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//     description: 'Um gráfico simples com pontos marcados.',
//     data: { url:},
//     mark: 'point',
//     encoding: {
//       x: {field: 'a', type: 'ordinal'},
//       y: {field: 'b', type: 'quantitative'}
//     }
//   };

// vegaEmbed('#vis', yourVlSpec);

const select = document.querySelector('#select');
const names = document.querySelector('#names');

const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.id = 'searchInput';
select.appendChild(searchInput);
const suggestionsList = document.createElement('div');
suggestionsList.id = 'suggestionsList';
select.appendChild(suggestionsList);

// pesquisar no banco de dados os nomes dos jogadores e adicionar ao select

function getMinMaxBound(data){
  let min = data[0].Rating;
  let max = data[0].Rating;
  data.forEach(row => {
    if (row.Rating < min) {
      min = row.Rating;
    }
    if (row.Rating > max) {
      max = row.Rating;
    }
  });
  return [min-50, max+50];
}

function searchPlayers(searchValue,data,selectedValues){
  // Percorre todas as checkboxes
  data.forEach(row => {
    const checkbox = document.getElementById(row.index);

    // Verifica se o valor da checkbox corresponde ao valor de pesquisa
    let checkboxValue = checkbox.value;
    // deixar em caixa alta
    checkboxValue = checkboxValue.toUpperCase();
    // remover espaços no início e no final
    checkboxValue = checkboxValue.trim();

    searchValue = searchValue.toUpperCase();
    searchValue = searchValue.trim();
    if (checkboxValue.includes(searchValue) && !selectedValues.includes(checkboxValue)) {
      // Marca a checkbox
      checkbox.checked = true;
      selectedValues.push(checkboxValue);
      // muda o display para block
      checkbox.parentElement.style.display = 'block';
      const queryString = selectedValues.join(',');
      fetch(`/query?data=${queryString}`)
      .then(response => response.json())
      .then(data => {
        minMaxBound = getMinMaxBound(data);
         var yourVlSpec = {
          "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
          "description": "Elo Rating evolution",
          "width": 600,
          "height": 400,
          "data": {
            "values": data.map(d => ({...d, Year: new Date(d.Year, 0)})) // Transforma "Year" em uma data
          },
          "transform": [{
            "pivot": "index",
            "value": "Rating",
            "groupby": ["Year"]
          }],
          "repeat": {
            "layer": selectedValues
          },
          "spec": {
            "layer": [{
              "mark": {"type": "line", "stroke": "white", "strokeWidth": 4},
              "encoding": {
                "x": {"field": "Year", "type": "temporal"}, // Adicionado timeUnit aqui
                "y": {"field": {"repeat": "layer"}, "type": "quantitative", "title": "Rating","scale": {"domain": minMaxBound}}
              }
            },{
              "mark": {"type": "line"},
              "encoding": {
                "x": {"field": "Year", "type": "temporal"}, // Adicionado timeUnit aqui
                "y": {"field": {"repeat": "layer"}, "type": "quantitative", "title": "Rating","scale": {"domain": minMaxBound}},
                "stroke": {"datum": {"repeat": "layer"}, "type": "nominal"}
              }
            }]
          }
        };
    
        vegaEmbed('#vis', yourVlSpec);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
    }
    suggestionsList.innerHTML = '';
    searchInput.value = '';
  });
}

let buttons = [];

function resetVis(){
  // vegaEmbed('#vis', {});
  // selectedValues = [];
  i = 2
  while(i < select.children.length){
    // remove todos os elementos do select
    select.removeChild(select.lastChild);
  }
}

fetch('/tables').then(response => response.json()).then(data => {
  console.log(data);
  data.forEach(table => {
    const b = document.createElement('button');
    b.addClassName = 'classSelect';
    buttons.push(b);
    b.addEventListener('click', () => {
      resetVis();
      // change the button color to #ededed and the others to white
      buttons.forEach(button => {
        button.style.backgroundColor = '#3d71a2';
        button.style.color = 'white';
      });
      b.style.backgroundColor = '#ededed';
      b.style.color = 'black';
      fetch('/data?table=' + table)
        .then(response => response.json())
        .then(data => {
          const selectedValues = [];
          data.forEach(row => {
            const checkbox = document.createElement('input');
            const p1 = document.createElement('div');
            checkbox.type = 'checkbox';
            checkbox.id = row.index;
            checkbox.value = row.index;
            checkbox.addEventListener('change', function() {
              if (this.checked) {
                selectedValues.push(this.value);
              } else {
                const index = selectedValues.indexOf(this.value);
                if (index > -1) {
                  selectedValues.splice(index, 1);
                  checkbox.parentElement.style.display = 'none';
                }
                // caso não haja mais valores selecionados, limpa o gráfico
                if (selectedValues.length === 0) {
                  vegaEmbed('#vis', {});
                }
              }
              
              const queryString = selectedValues.join(',');
              fetch(`/query?data=${queryString}`)
              .then(response => response.json())
              .then(data => {
                minMaxBound = getMinMaxBound(data);
                var yourVlSpec = {
                  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                  "description": "Elo Rating evolution",
                  "width": 600,
                  "height": 400,
                  "data": {
                    "values": data.map(d => ({...d, Year: new Date(d.Year, 0)})) // Transforma "Year" em uma data
                  },
                  "transform": [{
                    "pivot": "index",
                    "value": "Rating",
                    "groupby": ["Year"]
                  }],
                  "repeat": {
                    "layer": selectedValues
                  },
                  "spec": {
                    "layer": [{
                      "mark": {"type": "line", "stroke": "white", "strokeWidth": 4},
                      "encoding": {
                        "x": {"field": "Year", "type": "temporal"}, // Adicionado timeUnit aqui
                        "y": {"field": {"repeat": "layer"}, "type": "quantitative", "title": "Rating","scale": {"domain": minMaxBound}}
                      }
                    },{
                      "mark": {"type": "line"},
                      "encoding": {
                        "x": {"field": "Year", "type": "temporal"}, // Adicionado timeUnit aqui
                        "y": {"field": {"repeat": "layer"}, "type": "quantitative", "title": "Rating","scale": {"domain": minMaxBound}},
                        "stroke": {"datum": {"repeat": "layer"}, "type": "nominal"}
                      }
                    }]
                  }
                };
            
                vegaEmbed('#vis', yourVlSpec);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
            });

            const label = document.createElement('label');
            label.htmlFor = row.index;
            label.textContent = row.index;
            p1.appendChild(checkbox);
            p1.appendChild(label);
            // display none
            p1.style.display = 'none';
            select.appendChild(p1);
          });
            // Ouvinte de evento 'keyup'
          searchInput.addEventListener('keyup', function(event) {
            // Valor de pesquisa
          let searchValue = event.target.value.toUpperCase().trim();

          // Limpa a lista suspensa
          suggestionsList.innerHTML = '';

          // Percorre todas as checkboxes
          data.forEach(row => {
            const checkbox = document.getElementById(row.index);

            // Verifica se o valor da checkbox contém o valor de pesquisa
            let checkboxValue = checkbox.value.toUpperCase().trim();
            if (checkboxValue.includes(searchValue)) {
              // Cria uma nova opção
              const option = document.createElement('div');
              option.textContent = checkbox.value;

              // Adiciona um ouvinte de evento 'click' para a opção
              option.addEventListener('click', function() { 
                const clickedElementList = [row];
                searchPlayers(checkbox.value,clickedElementList,selectedValues);
              });

              // Adiciona a opção à lista suspensa
              suggestionsList.appendChild(option);
            }
            });
            // Verifica se a tecla pressionada foi 'Enter'
            if (event.key === 'Enter') {
              // Valor de pesquisa
              let searchValue = event.target.value;
              searchPlayers(searchValue,data,selectedValues);
            }
          });
        })

    });
    const t = document.createTextNode(table);
    b.appendChild(t);
    names.appendChild(b);
  });
});

const h1 = document.querySelector('h1');

h1.addEventListener('click', () => {
  window.location.href = '/';
});
