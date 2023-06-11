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
        <div id="container_abilities" class="container-abilities"></div>
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


function templateAbilities(ability) {
    return /*html*/`
        <div class="container-single-ability">
            <h5>${ability['ability_name'].slice(0, 1).toUpperCase()}${ability['ability_name'].slice(1)}:</h5>
            <p>${ability['short_effect']}</p>
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


