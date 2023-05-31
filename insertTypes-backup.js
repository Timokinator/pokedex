
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