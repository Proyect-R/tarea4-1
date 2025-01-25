// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");
const cliente = require("./utils");
// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// Importamos el objeto id para las peticiones por id
const { ObjectId } = require("mongodb");
// Inicializamos la aplicación
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
    // Enviar respuesta con el mensaje de éxito y el concesionario insertado
    response.json({message: "Concesionario agregado"});
    
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
// listaConcesionarios de un concesionario
app.get("/concesionarios/:id/coches", async (request, response) => {
  const id = request.params.id;  // Obtener el id desde los parámetros de la URL

  try {
    await cliente.connect();  // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios");  // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios");  // Nombre de la colección

    // Buscar el concesionario por _id
    const concesionario = await concesionariosCollection.findOne({ _id: new ObjectId(id) });

    if (concesionario) {
      // Si el concesionario existe, devolver solo la lista de coches
      response.json(concesionario.listaCoches);
    } else {
      // Si no se encuentra el concesionario, devolver error
      response.status(404).json({ error: "Concesionario no encontrado" });
    }
  } catch (err) {
    console.error("Error al obtener los coches:", err);
    response.status(500).json({ error: "Error al obtener los coches" });
  } finally {
    await cliente.close();  // Cerrar la conexión
  }
});

// Añadir un nuevo coche al concesionario pasado por id
app.post("/concesionarios/:id/coches", async (request, response) => {
  const id = request.params.id;  // Obtener el id desde los parámetros de la URL
  const nuevoCoche = request.body;  // Obtener los datos del coche a añadir

  try {
    await cliente.connect();  // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios");  // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios");  // Nombre de la colección

    // Actualizar el concesionario con el nuevo coche
    const result = await concesionariosCollection.updateOne(
      { _id: new ObjectId(id) },  // Filtrar por _id
      { $push: { listaCoches: nuevoCoche } }  // Agregar el nuevo coche a la listaCoches
    );

    if (result.modifiedCount === 1) {
      // Si se modificó al menos un documento (es decir, el concesionario fue encontrado y actualizado)
      response.json({ message: "Coche añadido", concesionarioId: id });
    } else {
      // Si no se encuentra el concesionario con ese id
      response.status(404).json({ error: "Concesionario no encontrado" });
    }
  } catch (err) {
    console.error("Error al añadir el coche:", err);
    response.status(500).json({ error: "Error al añadir el coche" });
  } finally {
    await cliente.close();  // Cerrar la conexión
  }
});

// Obtiene el coche cuyo índice sea cocheId, del concesionario pasado por id
app.get("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  const id = request.params.id;  // Obtener el id del concesionario
  const cocheId = parseInt(request.params.cocheId, 10);  // Obtener el id del coche (convertido a número entero)

  try {
    await cliente.connect();  // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios");  // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios");  // Nombre de la colección

    // Buscar el concesionario por su _id
    const concesionario = await concesionariosCollection.findOne({ _id: new ObjectId(id) });

    if (!concesionario) {
      return response.status(404).json({ error: "Concesionario no encontrado" });  // Si no se encuentra el concesionario
    }

    // Verificar si la posición de cocheId existe en la lista de coches
    if (cocheId >= 0 && cocheId < concesionario.listaCoches.length) {
      const coche = concesionario.listaCoches[cocheId];  // Obtener el coche por índice
      response.json({ coche });  // Enviar la respuesta con el coche encontrado
    } else {
      response.status(404).json({ error: "Coche no encontrado" });  // Si no se encuentra el coche
    }
  } catch (err) {
    console.error("Error al obtener el coche:", err);
    response.status(500).json({ error: "Error al obtener el coche" });  // Enviar error si algo falla
  } finally {
    await cliente.close();  // Cerrar la conexión
  }
});



// Actualiza el coche cuyo id sea cocheId, del concesionario pasado por id
app.put("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  const concesionarioId = request.params.id;  // ID del concesionario
  const cocheId = parseInt(request.params.cocheId, 10);  // ID del coche (índice en el array de coches)
  const updatedCoche = request.body;  // Nuevo coche con los datos a actualizar

  try {
    await cliente.connect();  // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios");  // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios");  // Nombre de la colección

    // Buscar el concesionario por su _id
    const concesionario = await concesionariosCollection.findOne({ _id: new ObjectId(concesionarioId) });

    if (!concesionario) {
      return response.status(404).json({ error: "Concesionario no encontrado" });  // Si no se encuentra el concesionario
    }

    // Verificar si el cocheId existe dentro de la lista de coches
    if (cocheId >= 0 && cocheId < concesionario.listaCoches.length) {
      // Actualizar el coche en la posición indicada
      concesionario.listaCoches[cocheId] = updatedCoche;

      // Actualizar el concesionario en la base de datos con el coche modificado
      const result = await concesionariosCollection.updateOne(
        { _id: new ObjectId(concesionarioId) },
        { $set: { listaCoches: concesionario.listaCoches } }
      );

      if (result.modifiedCount > 0) {
        response.json({
          message: "Coche actualizado correctamente",
          concesionario: concesionario.listaCoches[cocheId],
        });
      } else {
        response.status(500).json({ error: "No se pudo actualizar el coche" });
      }
    } else {
      response.status(404).json({ error: "Coche no encontrado" });  // Si el coche no existe en la lista
    }
  } catch (err) {
    console.error("Error al actualizar el coche:", err);
    response.status(500).json({ error: "Error al actualizar el coche" });  // Enviar error si algo falla
  } finally {
    await cliente.close();  // Cerrar la conexión
  }
});


// Borra el coche cuyo id sea cocheId, del concesionario pasado por id
app.delete("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  const concesionarioId = request.params.id;  // ID del concesionario
  const cocheId = parseInt(request.params.cocheId, 10);  // ID del coche (índice en el array de coches)

  try {
    await cliente.connect();  // Conectar al servidor de MongoDB
    const database = cliente.db("concesionarios");  // Nombre de la base de datos
    const concesionariosCollection = database.collection("concesionarios");  // Nombre de la colección

    // Buscar el concesionario por su _id
    const concesionario = await concesionariosCollection.findOne({ _id: new ObjectId(concesionarioId) });

    if (!concesionario) {
      return response.status(404).json({ error: "Concesionario no encontrado" });  // Si no se encuentra el concesionario
    }

    // Verificar si el cocheId existe dentro de la lista de coches
    if (cocheId >= 0 && cocheId < concesionario.listaCoches.length) {
      // Eliminar el coche de la lista
      concesionario.listaCoches.splice(cocheId, 1);

      // Actualizar el concesionario en la base de datos con el coche eliminado
      const result = await concesionariosCollection.updateOne(
        { _id: new ObjectId(concesionarioId) },
        { $set: { listaCoches: concesionario.listaCoches } }
      );

      if (result.modifiedCount > 0) {
        response.json({
          message: "Coche eliminado correctamente",
          concesionario: concesionario.listaCoches,
        });
      } else {
        response.status(500).json({ error: "No se pudo eliminar el coche" });
      }
    } else {
      response.status(404).json({ error: "Coche no encontrado" });  // Si el coche no existe en la lista
    }
  } catch (err) {
    console.error("Error al eliminar el coche:", err);
    response.status(500).json({ error: "Error al eliminar el coche" });  // Enviar error si algo falla
  } finally {
    await cliente.close();  // Cerrar la conexión
  }
});