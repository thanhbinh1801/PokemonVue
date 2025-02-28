<script setup>
import { ref, computed } from 'vue';
import PokemonList from '@/pokemon/PokemonList.vue';
import { fetchPromise } from '@/utils/fetchData';

// ref state
const valueSearch = ref('');
const filteredPokemons = ref([]);
const isLoadingPokemon = ref(false);

// end ref state

let pokemons = JSON.parse(sessionStorage.getItem("pokemonsData")) || [];
filteredPokemons.value = pokemons;

const offset = ref(0);
let limit = 36;

const renderPokemon = computed(() => {
    return filteredPokemons.value.slice(offset, offset.value+limit);
});

//begin getPokemon (refresh website => localStorage ....)
async function getPokemon() {
    const { results } = await fetchPromise(`https://pokeapi.co/api/v2/pokemon/?limit=898`);

    const pokemonData = await Promise.all(results.map(async (pokemon) => {
        const data = await fetchPromise(pokemon.url);
        const speciesData = await fetchPromise(data.species.url);

        let speciesText = "No description available";
        if (speciesData.flavor_text_entries && speciesData.flavor_text_entries.length > 0) {
            speciesText = speciesData.flavor_text_entries[0].flavor_text;
        }

        const evolutionChain = await fetchPromise(speciesData.evolution_chain.url);

        return {
            id: data.id,
            name: data.name,
            types: data.types.map(t => t.type.name),
            height: data.height,
            weight: data.weight,
            abilities: data.abilities,
            stats: data.stats,
            species: speciesText,
            evolution: evolutionChain.chain
        };

    }));
    console.log("Fetch access")
    pokemons = pokemonData;
    filteredPokemons.value = pokemons;
    sessionStorage.setItem('pokemonsData', JSON.stringify(pokemons));
}

if(pokemons.length > 0){
    console.log("pokemon data lấy từ session storage");
} else {
    console.log("pokemon data lấy bằng fetch ")
    getPokemon();
}
// end getPokemon


// begin event handler function
function handleSearch() {
    const query = valueSearch.value.toLowerCase(); 
    filteredPokemons.value = pokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query)
    );
    offset.value = 0;  
}

function handleLoadMore()
{
    offset.value += limit;
}
//end event handler function

setTimeout( () => {
    isLoadingPokemon.value = true;
}, 50)
</script>

<template>
    <div class="loading" v-if="!isLoadingPokemon">
        Getting Data From PokeDex...
    </div>
    <div class="container" v-if="isLoadingPokemon">
        <div class="header">
            <h2>Pokemon API</h2>
        </div>
        <input type="text" placeholder="Search some Pokemon" class="poke-search" v-model="valueSearch" @input="handleSearch">

        <PokemonList :pokemons = "renderPokemon" />
        
        <button 
        v-show="filteredPokemons.length > limit"
        class="load-page-btn" @click="handleLoadMore">Load More</button>
        
    </div>
</template>

<style>
.loading{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
}
.header h2
{
    font-weight: 100;
    font-family: sans-serif;
    font-size: 30px;
    margin-top: 50px;
}
.container
{
    max-width: 1200px;
    margin-inline: auto;
    text-align: center;
}
.poke-list
{
    display: grid;
    grid-template-columns: auto auto auto auto auto auto;
    /* justify-content: space-between; */
    margin-top: 40px;
}
.poke-search
{
    max-width: 500px;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 20px;
    border-radius: 30px;
    font-size: 16px;
    padding: 20px;
    border: none;
    outline: 1px solid #00000036;
    box-shadow: #0000001a 0 4px 12px;
}
.poke-search:focus
{
    outline: 1px solid #000000;
}
.load-page-btn
{
    border-radius: 10px;
    padding: 20px 25px;
    cursor: pointer;
    font-size: 16px;
    color: #fff;
    background-color: #ff4d4f;
    border: none;
    margin-top: 20px;
    margin-inline: auto;
}

.poke-item
{
    height: auto;
    border-radius: 15px;
    box-shadow: #0000001a 0 4px 12px;
    padding: 20px 0;
    margin: 10px 5px;
    text-transform: capitalize;
    cursor: pointer;
}

.back-btn{
    display: block;
    position: fixed;
    top: 5%;
    left: 5%;
    border-radius: 30px;
    padding: 5px 10px;
    box-shadow: #63636333 0 4px 8px;
    border: none;
    background-color: white;
    cursor: pointer;
}
</style>