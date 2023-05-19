let currentPokemon;
let imgCurrentPokemon;


async function loadPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon/mewtwo`
    let response = await fetch(url);
    let responseAsJson = await response.json();
    console.log('loaded Pokemon', responseAsJson);
    currentPokemon = responseAsJson['forms'][0]['name'];
    console.log(currentPokemon);
    imgCurrentPokemon = responseAsJson['sprites']['other']['official-artwork']['front_default'];

    console.log(imgCurrentPokemon);


    renderPokemonInfo();

}

function renderPokemonInfo() {
    document.getElementById('pokemonName').innerHTML = currentPokemon;
    document.getElementById('img_current_pokemon').src = imgCurrentPokemon;
}