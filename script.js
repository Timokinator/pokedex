const backgroundColorCanvas = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
];

const borderColorCanvas = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
];

let loadedPokemons = [];


async function loadPokemon() {

    for (let i = 1; i < 161; i++) {

        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let responseAsJson = await response.json();

        let url_description = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;
        let responseDescription = await fetch(url_description);
        let responseDescriptionAsJson = await responseDescription.json();

        let url_evolutionChain = responseDescriptionAsJson['evolution_chain']['url'];
        let responseEvolutionChain = await fetch(url_evolutionChain);
        let responseEvolutionChainAsJson = await responseEvolutionChain.json();

        let urlFirstEvolution = responseEvolutionChainAsJson['chain']['species']['url'];
        let responseFirstEvolution = await fetch(urlFirstEvolution);
        let responseFirstEvolutionAsJson = await responseFirstEvolution.json();
        let id_first_evolution = responseFirstEvolutionAsJson['id'];

        let name = responseAsJson['forms'][0]['name'];
        let id = responseAsJson['id'];
        let img = responseAsJson['sprites']['other']['official-artwork']['front_default'];
        let hp = responseAsJson['stats'][0]['base_stat'];
        let attack = responseAsJson['stats'][1]['base_stat'];
        let defense = responseAsJson['stats'][2]['base_stat'];
        let special_attack = responseAsJson['stats'][3]['base_stat'];
        let special_defense = responseAsJson['stats'][4]['base_stat'];
        let speed = responseAsJson['stats'][5]['base_stat'];
        let types = [];
        let id_second_evolution = [];
        let id_third_evolution = [];
        let weight = responseAsJson['weight'];
        let height = responseAsJson['height'];

        let possibleSecondEvolutions = responseEvolutionChainAsJson['chain']['evolves_to'];

        for (let e = 0; e < possibleSecondEvolutions.length; e++) {
            let urlSecondEvolution = responseEvolutionChainAsJson['chain']['evolves_to'][e]['species']['url'];
            let responseSecondEvolution = await fetch(urlSecondEvolution);
            let responseSecondEvolutionAsJson = await responseSecondEvolution.json();
            let idSecondEvolution = responseSecondEvolutionAsJson['id'];

            id_second_evolution.push(idSecondEvolution);

            let possibleThirdEvolutions = responseEvolutionChainAsJson['chain']['evolves_to'][e]['evolves_to'];

            for (let f = 0; f < possibleThirdEvolutions.length; f++) {
                let urlThirdEvolution = responseEvolutionChainAsJson['chain']['evolves_to'][e]['evolves_to'][f]['species']['url'];
                let responseThirdEvolution = await fetch(urlThirdEvolution);
                let responseThirdEvolutionAsJson = await responseThirdEvolution.json();
                let idThirdEvolution = responseThirdEvolutionAsJson['id'];

                id_third_evolution.push(idThirdEvolution);
            };
        };

        for (let j = 0; j < responseDescriptionAsJson['flavor_text_entries'].length; j++) {
            let language = responseDescriptionAsJson['flavor_text_entries'][j]['language']['name'];
            if (language == 'en') {
                description = responseDescriptionAsJson['flavor_text_entries'][j]['flavor_text'];
            };
        };

        for (let t = 0; t < responseAsJson['types'].length; t++) {
            const element = responseAsJson['types'][t];
            types.push(element['type']['name']);
        };
        pushToJson(i, name, id, img, hp, attack, defense, special_attack, special_defense, speed, weight, height, description, types, id_first_evolution, id_second_evolution, id_third_evolution);
    };
    renderPokemonInfo();
};


function pushToJson(i, name, id, img, hp, attack, defense, special_attack, special_defense, speed, weight, height, description, types, id_first_evolution, id_second_evolution, id_third_evolution) {
    loadedPokemons.push(
        {
            'name': name,
            'id': id,
            'img': img,
            'hp': hp,
            'attack': attack,
            'defense': defense,
            'special_attack': special_attack,
            'special_defense': special_defense,
            'speed': speed,
            'types': types,
            'id_first_evolution': id_first_evolution,
            'id_second_evolution': id_second_evolution,
            'id_third_evolution': id_third_evolution,
            'weight': weight,
            'height': height,
            'i': i,
            'description': description
        }
    );
};


function renderPokemonInfo() {
    const content = document.getElementById('pokedex');
    content.innerHTML = '';

    for (let i = 0; i < loadedPokemons.length; i++) {
        content.innerHTML += templatePokemonCard(i);
    };
};


function templatePokemonCard(i) {
    return /*html*/`
        <div class="col">
            <div onclick=showDetails(${i}) class="card h-100 hover-effect ${loadedPokemons[i]['types'][0]}">
                <img src="${loadedPokemons[i]['img']}" class="card-img-top" alt="Picture of ${loadedPokemons[i]['name']}">
                <div class="card-body">
                    <div class="card_headline">
                        <h5 class="card-title">${loadedPokemons[i]['name'].slice(0, 1).toUpperCase()}${loadedPokemons[i]['name'].slice(1)}</h5>
                        <p># ${loadedPokemons[i]['id']}</p>
                    </div>
                    <div class="types">
                        ${insertTypes(i)}
                    </div>
                    <p class="card-text">${loadedPokemons[i]['description']}</p>
                </div>
            </div>
        </div>
    `;
};


function insertTypes(i) {
    if (loadedPokemons[i]['types'].length == 1) {
        return oneType(i);
    } else if (loadedPokemons[i]['types'].length == 2) {
        return twoTypes(i);
    } else if (loadedPokemons[i]['types'].length == 3) {
        return threeTypes(i);
    };
};


function oneType(i) {
    return /*html*/`
    <div class="type_container small-350px">
        <p class="type ${loadedPokemons[i]['types'][0]}">${loadedPokemons[i]['types'][0]}</p>
    </div>`
};


function twoTypes(i) {
    return /*html*/`
    <div class="type_container small-350px">
        <p class="type ${loadedPokemons[i]['types'][0]}">${loadedPokemons[i]['types'][0]}</p>
        <p class="type ${loadedPokemons[i]['types'][1]}">${loadedPokemons[i]['types'][1]}</p>
    </div>`
};


function threeTypes(i) {
    return /*html*/`
    <div class="type_container small-350px">    
        <p class="type ${loadedPokemons[i]['types'][0]}">${loadedPokemons[i]['types'][0]}</p>
        <p class="type ${loadedPokemons[i]['types'][1]}">${loadedPokemons[i]['types'][1]}</p>
        <p class="type ${loadedPokemons[i]['types'][2]}">${loadedPokemons[i]['types'][3]}</p>
    </div>`
};


function showDetails(i) {
    const content = document.getElementById('singlePokemon');
    content.innerHTML = '';
    content.classList.remove('d-none');
    content.innerHTML = templateDetails(i);
    addCloseWithEscape();
    createCanvas(i);
    getImagesSecondEvolution(i);
    getImagesThirdEvolution(i);
};


function addCloseWithEscape() {
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeDetails();
        }
    });
};


function templateDetails(i) {
    return /*html*/`
        <div class="container-single-pokemon card-width-detail">
            <div class="container-container-card border-none margin-horizontal">
                <div onclick="doNotClose(event)" class="container-card">
                    <div class="${loadedPokemons[i]['types'][0]} card-body-details">
                        <img src="${loadedPokemons[i]['img']}" class="img-details" alt="...">
                        </div>
                            <div class="right-side-complete">
                                <div class="card_headline_details">
                                    <div class="types-details">
                                        <h5 class="card-title small-headline-350px">${loadedPokemons[i]['name'].slice(0, 1).toUpperCase()}${loadedPokemons[i]['name'].slice(1)}</h5>
                                        ${insertTypes(i)}
                                    </div>
                                    <p class="small-350px"># ${loadedPokemons[i]['id']}</p>
                                </div>
                                    <div class="sizes">
                                        <p class="small-350px">Weight: ${loadedPokemons[i]['weight'] / 10} kg</p>
                                        <p class="small-350px">Height: ${loadedPokemons[i]['height'] / 10} m</p>
                                    </div>
                                ${templateRightSideDetails(i)}
                        </div>
                </div>
            </div>
            ${templateButtonsDetails(i)}
        </div>
    `;
};


function templateButtonsDetails(i) {
    return /*html*/`
    <div class="btn-container-detail">
      <button class="btn-detail hover-effect ${loadedPokemons[i]['types'][0]}" onclick="previousPokemon(${i}); onclick=doNotClose(event)"><-</button>
      <button class="btn-detail hover-effect ${loadedPokemons[i]['types'][0]}" onclick="nextPokemon(${i}); onclick=doNotClose(event)">-></button>
   </div>
    `;
};



function templateRightSideDetails(i) {
    return /*html*/`
<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        <b>Stats</b>
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- Nachfolgend Einbettung Graph für Stats -->
        <div class="stats">
            <canvas id="myChart"></canvas>
        </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        <b>Abilities</b>
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Abilities
    </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        <b>Evolution</b>
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        ${templateEvolution(i)}
      </div>
    </div>
  </div>
</div>
    `;
};


function templateEvolution(i) {

    return /*html*/`
        <div class="container-evolution">
            <div class="first-evolution">
                ${insertFirstEvolution(i)}
            </div>

            <div id="container_second_evolution" class="second-evolution">
                
            </div>
           

            <div id="container_third_evolution" class="third-evolution">

            </div>


        </div>

    `;


};


function showDetailsfromEvolution(i) {
    closeDetails();
    showDetails(i);
};


function insertFirstEvolution(i) { // noch Fehler bei onclick in div
    const pokemon = loadedPokemons[i]['id_first_evolution'];
    if (pokemon < loadedPokemons.length + 1) {
        return /*html*/`
            <div class="container-img-evolution-detail ${loadedPokemons[pokemon - 1]['types'][0]}">
                <img class="img-evolution-detail hover-effect" src="${loadedPokemons[pokemon - 1]['img']}" alt="">
            </div>   
        `;
    } else {
        return /*html*/`
            <p>Pokemon not yet loaded</p>
        `
    };
};



function getImagesSecondEvolution(i) {

    const pokemon = loadedPokemons[i]['id_second_evolution'];

    content_evolution2 = document.getElementById('container_second_evolution');
    content_evolution2.innerHTML = '';

    if (pokemon.length > 0) {
        for (let j = 0; j < loadedPokemons[i]['id_second_evolution'].length; j++) {
            if (pokemon[j] < loadedPokemons.length + 1) {
                content_evolution2.innerHTML += /*html*/`
                <div id="img_second_evolution${i}" class="container-img-evolution-detail ${loadedPokemons[pokemon[j] - 1]['types'][0]}">
                    <img class="img-evolution-detail" src= "${loadedPokemons[pokemon[j] - 1]['img']}" alt="">   
                </div>
            `;
            } else {
                content_evolution2.innerHTML += /*html*/`
        <p>Pokemon with ID <b>${pokemon[j]}</b> not yet loaded</p>
            `;
            };
        };
    } else {
        content_evolution2.innerHTML += /*html*/`
            <p>No evolution</p>
        `;
    };
};


function getImagesThirdEvolution(i) {

    const pokemon = loadedPokemons[i]['id_third_evolution'];

    content_evolution3 = document.getElementById('container_third_evolution');
    content_evolution3.innerHTML = '';

    if (pokemon.length > 0) {
        for (let j = 0; j < loadedPokemons[i]['id_third_evolution'].length; j++) {
            if (pokemon[j] < loadedPokemons.length + 1) {
                content_evolution3.innerHTML += /*html*/`
                <div id="img_third_evolution${i}" class="container-img-evolution-detail ${loadedPokemons[pokemon[j] - 1]['types'][0]}">
                    <img class="img-evolution-detail" src= "${loadedPokemons[pokemon[j] - 1]['img']}" alt="">   
                </div>
            `;
            } else {
                content_evolution3.innerHTML += /*html*/`
                <p>Pokemon with ID <b>${pokemon[j]}</b> not yet loaded</p>
            `;
            };
        };
    } else {
        content_evolution3.innerHTML += /*html*/`
        
        `;
    };
};


















function previousPokemon(i) {
    if (i == 0) {
        i = loadedPokemons.length - 1;
    } else {
        i--;
    };
    showDetails(i);
};


function nextPokemon(i) {
    if (i == loadedPokemons.length - 1) {
        i = 0;
    } else {
        i++;
    };
    showDetails(i);
};


function closeDetails() {
    const content = document.getElementById('singlePokemon');
    content.innerHTML = '';
    content.classList.add('d-none');
};


function doNotClose(event) {
    event.stopPropagation();
};


function createCanvas(i) {
    const ctx = document.getElementById('myChart');

    let hp = loadedPokemons[i]['hp'];
    let attack = loadedPokemons[i]['attack'];
    let defense = loadedPokemons[i]['defense'];
    let special_attack = loadedPokemons[i]['special_attack'];
    let special_defense = loadedPokemons[i]['special_defense'];
    let speed = loadedPokemons[i]['speed'];

    newChart(ctx, hp, attack, defense, special_attack, special_defense, speed);
};


function newChart(ctx, hp, attack, defense, special_attack, special_defense, speed) {
    Chart.defaults.font.size = 10;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HP', 'ATTACK', 'DEFENSE', 'SPECIAL-ATTACK', 'SPECIAL-DEFENSE', 'SPEED'],
            datasets: [{
                label: '',
                data: [hp, attack, defense, special_attack, special_defense, speed],
                backgroundColor: backgroundColorCanvas,
                borderColor: borderColorCanvas,
                borderWidth: 1
            }]
        },
        options: optionsCanvas(),
    });
};


function optionsCanvas() {
    return {
        scales: {
            y: {
                beginAtZero: true,
            }
        },
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2 / 1.2,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
            }
        }
    }
};



/* Test für swipe */


document.addEventListener('swiped', function (event) {
    console.log(event.target); // the element that was swiped
    console.log(event.detail.dir); // swiped direction
});

document.addEventListener('swiped-left', function (event) {
    console.log(event.target); // the element that was swiped
});

document.addEventListener('swiped-right', function (e) {
    console.log(event.target); // the element that was swiped
});



