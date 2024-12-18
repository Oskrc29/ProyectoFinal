// main.js

import { waitForDelay } from "./delay.js"; // Importo la promesa desde delay.js

// Función principal para traer y mostrar resultados
async function fetchPokemons() {
  const container = document.getElementById("pokemon-container"); // creo contenedor para las tarjetas
  const apiURL = "https://pokeapi.co/api/v2/pokemon?limit=20";

  try {
      const response = await fetch(apiURL); // Llamo la API

      if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`); // Valido errores en la respuesta
      }

      const data = await response.json(); // Convertir a JSON
      const pokemons = data.results;

      // Llamada a la promesa independiente
      await waitForDelay(1000);
      console.log("Promesa adicional resuelta: Espera artificial completada.");

      const pokemonDetails = await Promise.all( // Obtener detalles por cada registro
          pokemons.map(async (pokemon) => {
              const res = await fetch(pokemon.url);
              return res.json();
          })
      );

      renderPokemons(pokemonDetails, container); // Render de las tarjetas
  } catch (error) {
      console.error("Error al obtener datos:", error.message);
      container.innerHTML = `<p>Ocurrió un error al cargar los Pokémon. </p>`;
  }
}

// Función para renderizar las tarjetas
function renderPokemons(pokemons, container) {
  pokemons.forEach((pokemon) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <h3>${pokemon.name}</h3>
      `;

      container.appendChild(card);
  });
}

// Invoco la función
fetchPokemons();
