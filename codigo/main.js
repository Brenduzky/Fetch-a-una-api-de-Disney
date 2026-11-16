let personajes = [];

const buscador = document.getElementById("buscador");
const filtroAparece = document.getElementById("filtroAparece");
const orden = document.getElementById("orden");
const container = document.getElementById("personajeContainer");
const agregarForm = document.getElementById("agregarPersonaje");

// personajes del JSON
fetch("../info/personaje.json")
  .then(response => response.json())
  .then(data => {
    personajes = data;
    aplicar();
  })
  .catch(error => {
    console.error("Error al leer el archivo JSON:", error);
  });

buscador.addEventListener("input", aplicar);
filtroAparece.addEventListener("change", aplicar);
orden.addEventListener("change", aplicar);

//filtro y de la az
function aplicar() {
  const texto = buscador.value.toLowerCase();
  const campo = filtroAparece.value;

  let lista = personajes.filter(p => {
    const coincideTexto = p.name.toLowerCase().includes(texto);
    const coincideCampo = campo === "" || (p[campo] && p[campo].length > 0);
    return coincideTexto && coincideCampo;
  });

  lista.sort((a, b) => a.name.localeCompare(b.name));
  if (orden.value === "desc") lista.reverse();

  mostrarPersonajes(lista);
}

function seccion(titulo, items) {
  if (!items || items.length === 0) return "";
  return `
    <h3>${titulo}</h3>
    <ul class="detalle">${items.map(i => `<li>${i}</li>`).join("")}</ul>
  `;
}

function mostrarPersonajes(lista) {
  container.innerHTML = "";
  lista.forEach(p => {
    const imagen = p.imageUrl
      ? `<img class="foto" src="${p.imageUrl}" alt="${p.name}"
              onerror="this.outerHTML='<div class=&quot;foto sin-foto&quot;>Sin imagen</div>'">`
      : `<div class="foto sin-foto">Sin imagen</div>`;

    container.innerHTML += `
      <article class="Card">
        ${imagen}
        <h2 class="nombre">${p.name}</h2>
        ${seccion("Películas", p.films)}
        ${seccion("Cortos", p.shortFilms)}
        ${seccion("Series", p.tvShows)}
        ${seccion("Videojuegos", p.videoGames)}
        ${seccion("Atracciones", p.parkAttractions)}
        ${seccion("Aliados", p.allies)}
        ${seccion("Enemigos", p.enemies)}
      </article>
    `;
  });
}

// Agregar personaje nuevo
function aLista(texto) {
  return texto.split(",").map(t => t.trim()).filter(t => t !== "");
}

agregarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nuevo = {
    _id: Date.now(),
    name: event.target.nombre.value,
    imageUrl: event.target.imagen.value,
    films: aLista(event.target.films.value),
    shortFilms: [],
    tvShows: aLista(event.target.tvShows.value),
    videoGames: aLista(event.target.videoGames.value),
    parkAttractions: [],
    allies: [],
    enemies: []
  };

  personajes.push(nuevo);
  aplicar();
  event.target.reset();
});