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
let listOfAllNames = [];
let allPokemon = [];
let allSpecies = [];
let evolutionChain = [];
let allIds = [];
let start_i = 0;
let end_i = 20;


function fillAllIds() { // Function to load ALL IDs 

    for (let i = 1; i < 1009; i++) {
        allIds.push(i);
    };
};


function fillAllNames() { // Function to load ALL names
    for (let i = 0; i < allPokemon.length; i++) {
        const name = allPokemon[i]['name'];

        listOfAllNames.push(name);
    };
};


async function fillAllPokemon() { // load all Pokemon from API at once
    allPokemon = await Promise.all(
        allIds.map(async id => {
            const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${id}`
            );
            return await res.json();
        })
    );
};


async function getAllSpecies() { // load all Species from API at once
    allSpecies = await Promise.all(
        allIds.map(async id => {
            const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon-species/${id}/`
            );
            return await res.json();
        })
    );
};


async function getAllEvolution() { // load all Evolution from API at once
    evolutionChain = await Promise.all(
        allIds.map(async id => {
            const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon-species/${id}/`
            );
            return await res.json();
        })
    );
};


async function getStarted() { // onload page
    await fillAllIds();
    await fillAllPokemon();
    await fillAllNames();
    await getAllSpecies();
    await fillJson(start_i, end_i);
    await renderPokemonInfo();
    toggleLoadButton(0);
    enableButtons();
    enableTooltips();
};


function enableButtons() { // enable buttons AFTER page is loaded
    document.getElementById('random_button').disabled = false;
    document.getElementById('button_search').disabled = false;
    document.getElementById('delete_search').disabled = false;
};


async function fillJson(start, end) {
    for (let i = start; i <= end; i++) {
        if (!listOfIds.includes(i + 1)) {
            const pokemon = allPokemon[i];
            const species = allSpecies[i];
            let name = pokemon['name'];
            let id = pokemon['id'];
            let img = pokemon['sprites']['other']['official-artwork']['front_default'];
            let hp = pokemon['stats'][0]['base_stat'];
            let attack = pokemon['stats'][1]['base_stat'];
            let defense = pokemon['stats'][2]['base_stat'];
            let special_attack = pokemon['stats'][3]['base_stat'];
            let special_defense = pokemon['stats'][4]['base_stat'];
            let speed = pokemon['stats'][5]['base_stat'];
            let weight = pokemon['weight'];
            let height = pokemon['height'];
            let id_second_evolution = [];
            let id_third_evolution = [];
            let id_first_evolution = await getFirstEvolution(species);
            let abilities = await getAbilities(pokemon);

            let types = getTypes(pokemon);
            checkLanguage(allSpecies[i])

            let url_evolutionChain = species['evolution_chain']['url'];
            let responseEvolutionChain = await fetch(url_evolutionChain);
            let responseEvolutionChainAsJson = await responseEvolutionChain.json();

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
            pushToJson(i, name, id, img, hp, attack, defense, special_attack, special_defense, speed, weight, height, description, types, id_first_evolution, id_second_evolution, id_third_evolution, abilities);
        };
    };
    sortPokemon();
    pushIdandNameToList();
    renderPokemonInfo();
};


async function getFirstEvolution(species) {
    let url_evolutionChain = species['evolution_chain']['url'];
    let responseEvolutionChain = await fetch(url_evolutionChain);
    let responseEvolutionChainAsJson = await responseEvolutionChain.json();
    let urlFirstEvolution = responseEvolutionChainAsJson['chain']['species']['url'];
    let responseFirstEvolution = await fetch(urlFirstEvolution);
    let responseFirstEvolutionAsJson = await responseFirstEvolution.json();
    let id_first_evolution = responseFirstEvolutionAsJson['id'];
    return id_first_evolution;
};


async function getAbilities(pokemon) {
    let listOfAbilities = [];
    for (let a = 0; a < pokemon['abilities'].length; a++) {
        const element = pokemon['abilities'][a];
        let url = element['ability']['url'];
        let response = await fetch(url);
        let responseAsJson = await response.json();
        await checkLanguageAbilities(responseAsJson)
        listOfAbilities.push(
            {
                'ability_name': element['ability']['name'],
                'ability_url': element['ability']['url'],
                'short_effect': short_effect
            }
        );
    };
    return listOfAbilities;
};


function checkLanguageAbilities(responseAsJson) {
    for (let j = 0; j < responseAsJson['effect_entries'].length; j++) {
        let language = responseAsJson['effect_entries'][j]['language']['name'];
        if (language == 'en') {
            short_effect = responseAsJson['effect_entries'][j]['short_effect'];
            return short_effect;
        };
    };
};


function getTypes(pokemon) {
    let types = [];
    for (let t = 0; t < pokemon['types'].length; t++) {
        const type = pokemon['types'][t];
        types.push(type['type']['name']);
    };
    return types;
};


function checkLanguage(Species) {
    for (let j = 0; j < Species['flavor_text_entries'].length; j++) {
        let language = Species['flavor_text_entries'][j]['language']['name'];
        if (language == 'en') {
            description = Species['flavor_text_entries'][j]['flavor_text'];
            return description
        };
    };
};


// Filterfunktion:

async function searchPokemon() {
    toggleLoadButton(0);
    document.getElementById("button_search").disabled = true;
    loadedPokemons = [];
    renderPokemonInfo();
    let search = document.getElementById('input_search').value.toLowerCase();
    listOfIdsFiltered = [];
    for (let f = 0; f < listOfAllNames.length; f++) {
        const name = listOfAllNames[f];

        if (name.includes(search)) {
            listOfIdsFiltered.push(allIds[listOfAllNames.indexOf(name)]);
        };
    };
    listOfNames = [];
    for (let f = 0; f < allIds.length; f++) {
        const number = allIds[f];

        if (number.toString().includes(search)) {
            listOfIdsFiltered.push(allIds[allIds.indexOf(number)]);
        };
    }
    listOfIds = [];
    if (listOfIdsFiltered.length > 0) {
        for (let l = 0; l < listOfIdsFiltered.length; l++) {
            const pokemon = listOfIdsFiltered[l];
            await fillJson(pokemon - 1, pokemon - 1);
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


function enableTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
};


// function to check if search-field value contains only numbers

function containsOnlyNumbers(str) {
    return /^[0-9]+$/.test(str);
};


async function deleteSearch() {
    document.getElementById('input_search').value = '';
    document.getElementById("button_search").disabled = false;
    toggleLoadButton(0);
    listOfIds = [];
    listOfIdsFiltered = [];
    loadedPokemons = [];
    await fillJson(0, end_i);
};


async function load20More() {
    toggleLoadButton(0);
    start_i += 20;
    end_i += 20;
    await fillJson(start_i + 1, end_i);
    toggleLoadButton(1000);
};


function toggleLoadButton(time) {
    let button = document.getElementById('button-load-more');
    setTimeout(function () { button.disabled = !button.disabled; }, time);
};


function addLoadButton() {
    document.getElementById('container-button-load-more').innerHTML = /*html*/`
        <button id="button-load-more" onclick="load20More()" disabled="true" class="btn btn-primary button-load-more">Load more</button>
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


function pushToJson(i, name, id, img, hp, attack, defense, special_attack, special_defense, speed, weight, height, description, types, id_first_evolution, id_second_evolution, id_third_evolution, abilities) {
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
            'description': description,
            'abilities': abilities
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
    renderAbilities(i);
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


function renderAbilities(i) {
    let content = document.getElementById('container_abilities')
    content.innerHTML = '';
    for (let a = 0; a < loadedPokemons[i]['abilities'].length; a++) {
        const ability = loadedPokemons[i]['abilities'][a];
        content.innerHTML += templateAbilities(ability);
    };
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
        await fillJson(pokemon - 1, pokemon - 1);
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
                await fillJson(element - 1, element - 1);
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
                await fillJson(element - 1, element - 1);
            } else {
                sortPokemon();
                pushIdandNameToList();
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


function closeDetails() {
    const content = document.getElementById('singlePokemon');
    content.innerHTML = '';
    content.classList.add('d-none');
    document.getElementById('random_button').disabled = false;
};


function doNotClose(event) {
    event.stopPropagation();
};


// Create Canvas for Stats in Details:

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
    await fillJson(randomNumnber - 1, randomNumnber - 1);

    let toLoad = loadedPokemons[listOfIds.indexOf(randomNumnber)]['id_first_evolution']; //noch prüfen ob random bereits erste evolution
    await fillJson(toLoad - 1, toLoad - 1);

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
        await fillJson(element - 1, element - 1)
    };
};


async function randomThirdEvolution(randomNumnber) {
    let array = loadedPokemons[listOfIds.indexOf(randomNumnber)]['id_third_evolution'];

    for (let e = 0; e < array.length; e++) {
        const element = array[e];
        await fillJson(element - 1, element - 1)
    };
};