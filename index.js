/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
let concesionarios = [
  {
    nombre: "Pepe Abichuela",
    direccion: "Jerez",
    listaCoches: [
      { modelo: "Clio", cv: 230, precio: 3000 },
      { modelo: "Skyline R34", cv: 210, precio: 2500 },
    ],
  },
  {
    nombre: "Paco Car",
    direccion: "Chiclana",
    listaCoches: [
      { modelo: "Z4", cv: 220, precio: 2800 },
      { modelo: "Benz", cv: 240, precio: 3500 },
    ],
  },
];

// Lista todos los concesionarios
app.get("/concesionarios", (request, response) => {
  response.json(concesionarios);
});

// Añadir un nuevo concesionario
app.post("/concesionarios", (request, response) => {
  concesionarios.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id];
  response.json({ message: "ok" });
});

// Actualizar un solo concesionario
app.put("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un concesionario
app.delete("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios = concesionarios.filter(
    (item) => concesionarios.indexOf(item) !== id
  );

  response.json({ message: "ok" });
});

// Devuelve todos los coches del concesionario pasado por id (solo los coches)
app.get("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  const concesionarios = concesionarios[id];
  response.json(concesionarios.listaCoches);
  response.json(concesionarios.coches);
});

// Añade un nuevo coche al concesionario pasado por id.
app.post("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  const concesionario = concesionarios[id];
  concesionario.listaCoches.push(request.body);
  response.json({ message: "ok" });
});

// Obtiene el coche cuyo id sea cocheId, del concesionario pasado por id
app.get("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  const concesionario = concesionarios[id];
  const result = concesionario.listaCoches[cocheId];
  response.json({ result });
});

// Actualiza el coche cuyo id sea cocheId, del concesionario pasado por id
app.put("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  const concesionario = concesionarios[id];
  const coche = concesionario.listaCoches[cocheId];
  concesionario.listaCoches[cocheId] = request.body;
  response.json({ message: "ok" });
});

// Borra el coche cuyo id sea cocheId, del concesionario pasado por id
app.delete("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  const concesionario = concesionarios[id];
  if (concesionario) {
    concesionario.listaCoches = concesionario.listaCoches.filter(
      (item, index) => index !== parseInt(cocheId)
    );
    response.json({ message: "ok" });
  } else {
    response.status(404).json({ message: "ok" });
  }
});
