const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hyper_distric"
});

connection.connect((error) => {
  if (error) {
    console.log("Error al conectar con MySQL:", error);
    return;
  }

  console.log("Conexión a MySQL exitosa");
});

module.exports = connection;