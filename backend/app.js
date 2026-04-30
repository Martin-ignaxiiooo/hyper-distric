const express = require("express");
const path = require("path");
const connection = require("./config/db.js");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  connection.query(sql, (error, results) => {
    if (error) {
      console.log("Error al obtener productos:", error);
      return res.status(500).json({
        mensaje: "Error al obtener los productos"
      });
    }

    res.json(results);
  });
});

app.get("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM productos WHERE id = ?";

  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.log("Error al obtener producto:", error);
      return res.status(500).json({
        mensaje: "Error al obtener el producto"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});