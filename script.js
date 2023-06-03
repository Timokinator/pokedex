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
let listOfIds = [];
let listOfIdsFiltered = [];
let listOfNames = [];
let allNames = [];

let start_i = 1;
let end_i = 21;


// Funktion um ALLE Namen der API zu laden 

async function loadAllnamesFromApi() { // atm not included...adds the possibility to load the names of all pokemon from the API

    for (let a = 1; a < 1009; a++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${a}`
        let response = await fetch(url);
        let responseAsJson = await response.json();

        allNames.push(responseAsJson['name']);
    };
};






async function loadPokemon(start, end) {

    for (let i = start; i < end; i++) {

        if (!listOfIds.includes(i)) {

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

            checkLanguage(responseDescriptionAsJson);

            for (let t = 0; t < responseAsJson['types'].length; t++) {
                const element = responseAsJson['types'][t];
                types.push(element['type']['name']);
            };
            pushToJson(i, name, id, img, hp, attack, defense, special_attack, special_defense, speed, weight, height, description, types, id_first_evolution, id_second_evolution, id_third_evolution);
        };
    };
    sortPokemon();
    pushIdandNameToList();
    renderPokemonInfo();
};


// Filterfunktion:

async function searchPokemon() {
    event.preventDefault();
    toggleLoadButton(0);
    document.getElementById("button_search").disabled = true;
    loadedPokemons = [];
    renderPokemonInfo();
    let search = document.getElementById('input_search').value.toLowerCase();
    listOfIdsFiltered = [];

    for (let f = 0; f < listOfNames.length; f++) {
        const name = listOfNames[f];

        if (name.includes(search)) {
            listOfIdsFiltered.push(listOfIds[listOfNames.indexOf(name)]);
        };
    };
    listOfNames = [];
    for (let f = 0; f < listOfIds.length; f++) {
        const number = listOfIds[f];

        if (number.toString().includes(search)) {
            listOfIdsFiltered.push(listOfIds[listOfIds.indexOf(number)]);
        };
    }
    listOfIds = [];
    if (listOfIdsFiltered.length > 0) {
        for (let l = 0; l < listOfIdsFiltered.length; l++) {
            const pokemon = listOfIdsFiltered[l];
            await loadPokemon(pokemon, pokemon + 1);
        };
    } else {
        const content = document.getElementById('pokedex');
        content.innerHTML = "";
        content.innerHTML += /*html*/`
            <div class="no-pokemon">
                <h3>No Pokemon found - try again</h3>
            </div>
        `;
    };
};


// function to check if search-field value contains only numbers

function containsOnlyNumbers(str) {
    return /^[0-9]+$/.test(str);
};




/* backup search function

async function searchPokemon() { //
    toggleLoadButton(0);
    document.getElementById("button_search").disabled = true;
    listOfIdsFiltered = [];
    listOfIds = [];
    loadedPokemons = [];
    let search = document.getElementById('input_search').value.toLowerCase();

    if (typeof search == 'string') {
        for (let f = 0; f < listOfNames.length; f++) {
            const name = listOfNames[f];

            if (name.includes(search)) {
                listOfIdsFiltered.push(listOfNames.indexOf(name) + 1);
            };
        };
        if (listOfIdsFiltered.length > 0) {
            for (let l = 0; l < listOfIdsFiltered.length; l++) {
                const pokemon = listOfIdsFiltered[l];
                await loadPokemon(pokemon, pokemon + 1);
            };
        } else {
            renderPokemonInfo();
            // noch html einfügen: "Kein Pokemon gefunden"
        };
    } else if (typeof search == 'number') {
        console.log('number!')
    };
};


*/











async function deleteSearch() {
    document.getElementById('input_search').value = '';
    document.getElementById("button_search").disabled = false;
    toggleLoadButton(0);
    listOfIds = [];
    listOfIdsFiltered = [];
    loadedPokemons = [];
    await loadPokemon(start_i, end_i);
};


function checkLanguage(responseDescriptionAsJson) {
    for (let j = 0; j < responseDescriptionAsJson['flavor_text_entries'].length; j++) {
        let language = responseDescriptionAsJson['flavor_text_entries'][j]['language']['name'];
        if (language == 'en') {
            description = responseDescriptionAsJson['flavor_text_entries'][j]['flavor_text'];
            return description
        };
    };
};


async function load20More() {
    toggleLoadButton(0);
    end_i += 20;
    await loadPokemon(end_i - 20, end_i);
    toggleLoadButton(1000);
};


function toggleLoadButton(time) {
    let button = document.getElementById('button-load-more');
    setTimeout(function () { button.disabled = !button.disabled; }, time);
};


function addLoadButton() {
    document.getElementById('container-button-load-more').innerHTML = /*html*/`
        <button id="button-load-more" onclick="load20More()" class="btn btn-primary button-load-more">Load more</button>
    `;
};


function sortPokemon() {
    loadedPokemons.sort(function (a, b) {
        return a.id - b.id;
    });
};


function pushIdandNameToList() {
    listOfNames = [];
    listOfIds = [];
    for (let i = 0; i < loadedPokemons.length; i++) {
        const pokemon = loadedPokemons[i];

        listOfIds.push(pokemon['id']);
        listOfNames.push(pokemon['name']);
    };
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
        insertTypes(i, `typesCard${i}`);
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
                        <div id="typesCard${i}" class="type_container small-350px">
                        </div>
                    </div>
                    <p class="card-text">${loadedPokemons[i]['description']}</p>
                </div>
            </div>
        </div>
    `;
};


function insertTypes(i, id_div) {
    let content = document.getElementById(id_div);
    content.innerHTML = '';

    for (let t = 0; t < loadedPokemons[i]['types'].length; t++) {
        const type = loadedPokemons[i]['types'][t];

        content.innerHTML += /*html*/`
            <p class="type ${type}">${type}</p>
        `;
    };
};


function showDetails(i) {
    closeDetails();
    const content = document.getElementById('singlePokemon');
    content.innerHTML = '';
    content.classList.remove('d-none');
    content.innerHTML = templateDetails(i);
    insertTypes(i, `typesCardDetail${i}`);
    addCloseWithEscape();
    createCanvas(i);
    insertFirstEvolution(i);
    getImagesSecondEvolution(i);
    getImagesThirdEvolution(i);
};


function addCloseWithEscape() { //adds the possibility to close the details with the escape-key
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
                                        <div id="typesCardDetail${i}" class="type_container small-350px">
                                       </div>
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
      <button class="btn-detail btn btn-danger hover-effect" onclick="closeDetails()">X</button>
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
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
        <b>Description</b>
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <p class="card-text">${loadedPokemons[i]['description']}</p>
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
      <div class="accordion-body accordion-body-evolution">
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
            <div id="container_first_evolution" class="first-evolution">
            </div>
            <p id="arrow_1" class="arrow-evolution">></p>
            <div id="container_second_evolution" class="second-evolution">
            </div>
            <p id="arrow_2" class="arrow-evolution">></p>
            <div id="container_third_evolution" class="third-evolution">
            </div>
        </div>
    `;
};


function showDetailsfromEvolution(i) {
    closeDetails();
    pushIdandNameToList();
    showDetails(i);
};


async function insertFirstEvolution(i) {
    const pokemon = loadedPokemons[i]['id_first_evolution'];

    content_evolution1 = document.getElementById('container_first_evolution');
    content_evolution1.innerHTML = '';

    if (!listOfIds.includes(pokemon)) {
        await loadPokemon(pokemon, pokemon + 1);
    };

    pushIdandNameToList();

    const pokemonId = listOfIds.indexOf(pokemon);

    content_evolution1.innerHTML = /*html*/`
    <div onclick="showDetailsfromEvolution(${pokemonId})" class="container-img-evolution-detail ${loadedPokemons[pokemonId]['types'][0]}">
        <img class="img-evolution-detail hover-effect-small" src="${loadedPokemons[pokemonId]['img']}" alt="">
    </div>   
    `;
};


async function getImagesSecondEvolution(i) {
    content_evolution2 = document.getElementById('container_second_evolution');
    content_evolution2.innerHTML = '';

    const pokemon = loadedPokemons[i]['id_second_evolution'];

    if (pokemon.length > 0) {
        for (let p = 0; p < pokemon.length; p++) {
            const element = pokemon[p];
            if (!listOfIds.includes(element)) {
                await loadPokemon(element, element + 1);
            } else {
                sortPokemon();
                pushIdandNameToList();
            };

            const pokemonId = listOfIds.indexOf(element);

            content_evolution2.innerHTML += /*html*/`
        <div onclick="showDetailsfromEvolution(${pokemonId})" id="img_second_evolution${i}" class="container-img-evolution-detail ${loadedPokemons[pokemonId]['types'][0]}">
            <img class="img-evolution-detail hover-effect-small" src= "${loadedPokemons[pokemonId]['img']}" alt="">   
        </div>
    `;
        };
    } else {
        // document.getElementById('arrow_1').classList.add('d-none');
        content_evolution2.innerHTML += /*html*/`
         <div class="container-no-evolution">
             <p class="no-evolution-p">No evolution</p>
             <img class="img-no-evolution" src="./img/no-evolution.png" alt="">
         </div>    
     `;
    };
};


async function getImagesThirdEvolution(i) {
    content_evolution3 = document.getElementById('container_third_evolution');
    content_evolution3.innerHTML = '';
    const pokemon = loadedPokemons[i]['id_third_evolution'];

    if (pokemon.length > 0) {
        for (let p = 0; p < pokemon.length; p++) {
            const element = pokemon[p];
            if (!listOfIds.includes(element)) {
                await loadPokemon(element, element + 1);
            };

            const pokemonId = listOfIds.indexOf(element);

            content_evolution3.innerHTML += /*html*/`
            <div onclick="showDetailsfromEvolution(${pokemonId})" id="img_second_evolution${i}" class="container-img-evolution-detail ${loadedPokemons[pokemonId]['types'][0]}">
                <img class="img-evolution-detail hover-effect-small" src= "${loadedPokemons[pokemonId]['img']}" alt="">   
            </div>
            `;
        };
    } else {
        document.getElementById('arrow_2').classList.add('d-none');
        content_evolution3.classList.add('d-none');
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


/* Versuch next and previous Pokemon
async function previousPokemon(i) {
    await loadPokemon((listOfIds.indexOf(i+1)), listOfIds.indexOf(i) + 2);
    i--;
    showDetails(listOfIds.indexOf(i+1));
};


async function nextPokemon(i) {
    await loadPokemon((listOfIds.indexOf(i) + 3), listOfIds.indexOf(i) + 4);
    i++;
    showDetails(listOfIds.indexOf(i + 1));
};
*/

function closeDetails() {
    const content = document.getElementById('singlePokemon');
    content.innerHTML = '';
    content.classList.add('d-none');
    document.getElementById('random_button').disabled = false;
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


// functions for random Pokemon

async function randomPokemon() {
    document.getElementById('random_button').disabled = true;
    let randomNumnber = Math.floor(Math.random() * 1000);
    await loadPokemon(randomNumnber, randomNumnber + 1);

    let toLoad = loadedPokemons[listOfIds.indexOf(randomNumnber)]['id_first_evolution'];
    await loadPokemon(toLoad, toLoad + 1)

    await randomSecondEvolution(randomNumnber);
    await randomThirdEvolution(randomNumnber);

    let id = listOfIds.indexOf(randomNumnber);
    pushIdandNameToList();
    renderPokemonInfo();
    showDetails(id);
    
};

async function randomSecondEvolution(randomNumnber) {
    let array = loadedPokemons[listOfIds.indexOf(randomNumnber)]['id_second_evolution'];

    for (let e = 0; e < array.length; e++) {
        const element = array[e];
        await loadPokemon(element, element + 1)
    };
};

async function randomThirdEvolution(randomNumnber) {
    let array = loadedPokemons[listOfIds.indexOf(randomNumnber)]['id_third_evolution'];

    for (let e = 0; e < array.length; e++) {
        const element = array[e];
        await loadPokemon(element, element + 1)
    };
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




