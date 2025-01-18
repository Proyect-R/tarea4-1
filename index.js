// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");
const cliente = require("./utils");
// Importamos el objeto id para las peticiones por id
const { ObjectId } = require("mongodb");
// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.DB_PORT;
// Base de datos y colección
let db;

// Inicializar la conexión con MongoDB al arrancar la app
cliente
  .connect()
  .then(() => {
    db = cliente.db("Concesionarios");
    concesionariosCollection = db.collection("concesionarios");
    console.log("Conexión exitosa a MongoDB");
  })
  .catch((err) => console.error("Error conectando a MongoDB:", err));
// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Lista todos los concesionarios
app.get("/concesionarios", async (request, response) => {
  try {
    await cliente.connect(); // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios"); // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios"); // Nombre de la colección
    const concesionarios = await concesionariosCollection.find().toArray(); // Obtener todos los concesionarios
    response.json(concesionarios); // Enviar los concesionarios como respuesta
  } catch (err) {
    console.error("Error al obtener los concesionarios:", err);
    response.status(500).json({ error: "Error al obtener concesionarios" }); // Enviar error si algo falla
  } finally {
    await cliente.close(); // Cerrar la conexión
  }
});

// Añadir un nuevo concesionario
app.post("/concesionarios", async (request, response) => {
  const nuevoConcesionario = request.body; // Obtener el nuevo concesionario desde el cuerpo de la solicitud

  try {
    await cliente.connect(); // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios"); // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios"); // Nombre de la colección

    // Insertar el nuevo concesionario en la base de datos
    const result = await concesionariosCollection.insertOne(nuevoConcesionario);

    // Obtener el concesionario completo que fue insertado
    const insertedConcesionario = await concesionariosCollection.findOne({
      _id: result.insertedId,
    });

    // Enviar respuesta con el mensaje de éxito y el concesionario insertado
    response.json({
      message: "Concesionario agregado",
      concesionario: insertedConcesionario,
    });
  } catch (err) {
    console.error("Error al agregar el concesionario:", err);
    response.status(500).json({ error: "Error al agregar concesionario" }); // Enviar error si algo falla
  } finally {
    await cliente.close(); // Cerrar la conexión
  }
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", async (request, response) => {
  const { id } = request.params; // Obtener el id desde los parámetros de la URL
  try {
    await cliente.connect(); // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios"); // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios"); // Nombre de la colección

    // Buscar el concesionario por su _id
    const concesionario = await concesionariosCollection.findOne({
      _id: new ObjectId(id),
    });

    if (concesionario) {
      response.json({ concesionario }); // Enviar el concesionario encontrado
    } else {
      response.status(404).json({ error: "Concesionario no encontrado" }); // Si no se encuentra, enviar error 404
    }
  } catch (err) {
    console.error("Error al obtener el concesionario:", err);
    response.status(500).json({ error: "Error al obtener el concesionario" }); // Enviar error si algo falla
  } finally {
    await cliente.close(); // Cerrar la conexión
  }
});

// Actualizar un solo concesionario
app.put("/concesionarios/:id", async (request, response) => {
  const { id } = request.params;  // Obtener el id desde los parámetros de la URL
  const actualizarConcesionario = request.body;  // Obtener el nuevo concesionario desde el cuerpo de la solicitud
  try {
    await cliente.connect();  // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios");  // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios");  // Nombre de la colección

    // Buscar el concesionario por su _id y actualizarlo
    const result = await concesionariosCollection.updateOne(
      { _id: new ObjectId(id) },  // Filtrar por _id
      { $set: actualizarConcesionario }  // Actualizar los campos con los datos recibidos
    );

    // Verificar si se realizó la actualización
    if (result.modifiedCount > 0) {
      response.json({ message: "Concesionario actualizado", concesionario: actualizarConcesionario });
    } else {
      response.status(404).json({ error: "Concesionario no encontrado" });  // Si no se encuentra, enviar error 404
    }
  } catch (err) {
    console.error("Error al actualizar el concesionario:", err);
    response.status(500).json({ error: "Error al actualizar el concesionario" });  // Enviar error si algo falla
  } finally {
    await cliente.close();  // Cerrar la conexión
  }
});


// Borrar un concesionario
app.delete("/concesionarios/:id", async(request, response) => {
  const { id } = request.params; // Obtener el id desde los parámetros de la URL
  try {
    await cliente.connect(); // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios"); // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios"); // Nombre de la colección

    // Buscar el concesionario por su _id
    const concesionario = await concesionariosCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (concesionario) {
      response.json({ concesionario }); // Enviar el concesionario encontrado
    } else {
      response.status(404).json({ error: "Concesionario no encontrado" }); // Si no se encuentra, enviar error 404
    }
  } catch (err) {
    console.error("Error al obtener el concesionario:", err);
    response.status(500).json({ error: "Error al obtener el concesionario" }); // Enviar error si algo falla
  } finally {
    await cliente.close(); // Cerrar la conexión
  }
});

// Devuelve todos los coches del concesionario pasado por id (solo los coches)
app.get("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  response.json(concesionarios[id].listaCoches);
});

// Añade un nuevo coche al concesionario pasado por id.
app.post("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  concesionarios[id].listaCoches.push(request.body);
  response.json({
    message: "ok",
    concesionarios: concesionarios[id].listaCoches,
  });
});

// Obtiene el coche cuyo id sea cocheId, del concesionario pasado por id
app.get("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  const result = concesionarios[id].listaCoches[cocheId];
  response.json({ result });
});

// Actualiza el coche cuyo id sea cocheId, del concesionario pasado por id
app.put("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  concesionarios[id].listaCoches[cocheId] = request.body;
  response.json({
    message: "ok",
    concesionarios: concesionarios[id].listaCoches[cocheId],
  });
});

// Borra el coche cuyo id sea cocheId, del concesionario pasado por id
app.delete("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  concesionarios[id].listaCoches.splice(cocheId, 1);
  response.json({
    message: "ok",
    concesionarios: concesionarios[id].listaCoches,
  });
});
