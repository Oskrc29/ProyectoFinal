import { waitForDelay } from "./delay.js"; // Importo la promesa desde delay.js

// Almaceno los Pokémon
let allPokemons = [];
let filteredPokemons = [];

// Defino colores para tipos de pokemones
const typeColors = {
  fire: "#f57c00",
  water: "#2196f3",
  grass: "#4caf50",
  electric: "#ffeb3b",
  psychic: "#9c27b0",
  ghost: "#673ab7",
  normal: "#9e9e9e",
  flying: "#00bcd4",
  fighting: "#ff5722",
  poison: "#9c27b0",
  bug: "#8bc34a",
  rock: "#795548",
  ice: "#00bcd4",
  dragon: "#e91e63",
  dark: "#3e2723",
  fairy: "#f8bbd0",
  steel: "#607d8b",
  ground: "#8d6e63",
};

// Función principal para traer y mostrar resultados
async function fetchPokemons() {
  const container = document.getElementById("pokemon-container"); // Creo contenedor para las tarjetas
  const totalPokemons = 151;  // cantidad de pokemones
  const apiURL = `https://pokeapi.co/api/v2/pokemon?limit=${totalPokemons}&offset=0`; // Llamo la API para traer 151 pokemones

  try {
    const response = await fetch(apiURL); // Llamo la API

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`); // Valido errores en la respuesta
    }

    const data = await response.json(); // Convertimos en JSON
    const pokemonPromises = data.results.map(async (pokemon) => {
      try {
        const res = await fetch(pokemon.url); // Ocupo fetch para cada Pokémon
        return res.json(); // Retorno el Pokémon
      } catch (error) {
        console.error(`Error al obtener el Pokémon ${pokemon.name}:`, error.message);
        return null; // Si tengo error, devuelvo null para ese Pokémon
      }
    });

    // Espero promesa para obtener los resultaddos
    const pokemons = await Promise.all(pokemonPromises);

    // Filtramos los resultados 
    allPokemons = pokemons.filter(pokemon => pokemon !== null);

    // Llamo la promesa adicional para hacer una espera antes del render
    await waitForDelay(1000); // Genero espera de 1 seg

    // Inicializamos los Pokémon filtrados con todos los Pokémon al principio
    filteredPokemons = allPokemons;
    
    renderPokemons(filteredPokemons, container); // Renderizamos las tarjetas de Pokémon
  } catch (error) {
    console.error("Error al obtener datos:", error.message);
    container.innerHTML = `<p>Ocurrió un error al cargar los Pokémon. </p>`;
  }
}

// Función para renderizar las tarjetas
function renderPokemons(pokemons, container) {
  container.innerHTML = ""; // Limpiamos el contenedor antes de mostrar los resultados

  pokemons.forEach((pokemon) => {
    try {
      const card = document.createElement("div");
      card.classList.add("card");

      // Obtenemos el tipo principal del Pokémon
      const primaryType = pokemon.types[0].type.name;

      // Asignamos un color de fondo según el tipo 
      const cardColor = typeColors[primaryType] || "#9e9e9e"; // Si no tiene color, usamos gris
      card.style.backgroundColor = cardColor;

      card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="card__img">
        <h3 class="card__title">${pokemon.name}</h3>
      `;

      container.appendChild(card);
    } catch (error) {
      console.error("Error al renderizar el Pokémon:", pokemon.name, error.message);
    }
  });
}

// Función para filtrar los Pokémon por tipo 
function filterPokemonsByType(type) {
  try {
    // Filtramos los Pokémon que tengan el tipo seleccionado
    filteredPokemons = allPokemons.filter((pokemon) => 
      pokemon.types[0].type.name === type 
    );

    // Actualizamos la vista con los Pokémon filtrados
    const container = document.getElementById("pokemon-container");
    renderPokemons(filteredPokemons, container);

    // Cambiar el fondo del body a un tono más claro
    const selectedColor = typeColors[type] || "#9e9e9e"; // Si no tiene color, usamos gris
    document.body.style.backgroundColor = lightenColor(selectedColor, 30); // Aplicamos un tono más claro al fondo
  } catch (error) {
    console.error("Error al filtrar los Pokémon:", error.message);
  }
}

// Función para aclarar un color
function lightenColor(color, percent) {
  try {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.min(255, r + (255 - r) * percent / 100);
    g = Math.min(255, g + (255 - g) * percent / 100);
    b = Math.min(255, b + (255 - b) * percent / 100);

    return `rgb(${r}, ${g}, ${b})`;
  } catch (error) {
    console.error("Error al aclarar el color:", error.message);
    return color; // Devuelve el color original en caso de error
  }
}

// Configurar los eventos del navbar para cada tipo de Pokémon
document.getElementById("agua").addEventListener("click", () => filterPokemonsByType("water"));
document.getElementById("bicho").addEventListener("click", () => filterPokemonsByType("bug"));
document.getElementById("dragon").addEventListener("click", () => filterPokemonsByType("dragon"));
document.getElementById("electrico").addEventListener("click", () => filterPokemonsByType("electric"));
document.getElementById("fantasma").addEventListener("click", () => filterPokemonsByType("ghost"));
document.getElementById("fuego").addEventListener("click", () => filterPokemonsByType("fire"));
document.getElementById("hada").addEventListener("click", () => filterPokemonsByType("fairy"));
document.getElementById("hielo").addEventListener("click", () => filterPokemonsByType("ice"));
document.getElementById("lucha").addEventListener("click", () => filterPokemonsByType("fighting"));
document.getElementById("normal").addEventListener("click", () => filterPokemonsByType("normal"));
document.getElementById("planta").addEventListener("click", () => filterPokemonsByType("grass"));
document.getElementById("psiquico").addEventListener("click", () => filterPokemonsByType("psychic"));
document.getElementById("roca").addEventListener("click", () => filterPokemonsByType("rock"));
document.getElementById("tierra").addEventListener("click", () => filterPokemonsByType("ground"));
document.getElementById("veneno").addEventListener("click", () => filterPokemonsByType("poison"));

// Invocamos la función para cargar los Pokémon
fetchPokemons();
