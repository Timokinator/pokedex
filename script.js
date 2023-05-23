let currentPokemon;
let currentPokemonId;
let imgCurrentPokemon;

let loadedPokemons = [];



async function loadPokemon() {

    for (let i = 1; i < 21; i++) {

        let url = `https://pokeapi.co/api/v2/pokemon/${i}`
        let response = await fetch(url);
        let responseAsJson = await response.json();

        let url_description = `https://pokeapi.co/api/v2/pokemon-species/${i}/`
        let responseDescription = await fetch(url_description)
        let responseDescriptionAsJson = await responseDescription.json();

        let url_types = ``

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
        let weight = responseAsJson['weight'];




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



        console.log(name);
        console.log(id);
        console.log(img);
        console.log(hp);
        console.log(attack);
        console.log(defense);
        console.log(special_attack);
        console.log(special_defense);
        console.log(speed);
        console.log(types);
        console.log(weight);
        console.log(description);

        pushToJson(i, name, id, img, hp, attack, defense, special_attack, special_defense, speed, weight, description, types);

    };

    renderPokemonInfo();
};




function pushToJson(i, name, id, img, hp, attack, defense, special_attack, special_defense, speed, weight, description, types) {

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
            'weight': weight,
            'i': i,
            'description': description
        }
    );
};



function renderPokemonInfo() {
    const content = document.getElementById('pokedex');
    content.innerHTML = '';

    for (let i = 0; i < loadedPokemons.length; i++) {
        const loadedPokemon = loadedPokemons[i];

        content.innerHTML += templatePokemonCard(i);



    }


}



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


    `
};


function insertTypes(i) {
    if (loadedPokemons[i]['types'].length == 1) {
        return /*html*/`
        <div class="type_container">
            <p class="${loadedPokemons[i]['types'][0]}">${loadedPokemons[i]['types'][0]}</p>
        </div>`
    } else if (loadedPokemons[i]['types'].length == 2) {
        return /*html*/`
        <div class="type_container">
            <p class="${loadedPokemons[i]['types'][0]}">${loadedPokemons[i]['types'][0]}</p>
            <p class="${loadedPokemons[i]['types'][1]}">${loadedPokemons[i]['types'][1]}</p>
        </div>`
    } else if (loadedPokemons[i]['types'].length == 3) {
        return /*html*/`
        <div class="type_container">    
            <p class="${loadedPokemons[i]['types'][0]}">${loadedPokemons[i]['types'][0]}</p>
            <p class="${loadedPokemons[i]['types'][1]}">${loadedPokemons[i]['types'][1]}</p>
            <p class="${loadedPokemons[i]['types'][2]}">${loadedPokemons[i]['types'][3]}</p>
        </div>`
    };
};


function showDetails(i) {
    alert(`working! ${i}`)


}