const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// Configuración de tu API de Meta
const token = "TU_TOKEN_DE_ACCESO";
const phoneNumberId = "TU_PHONE_NUMBER_ID";
const apiVersion = "v19.0"; // Usa la versión correspondiente

// Ruta para enviar mensajes
app.post("/send-message", async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({
      message: "Mensaje enviado correctamente",
      data: response.data,
    });
  } catch (error) {
    console.error("Error al enviar mensaje:", error.response?.data || error.message);
    res.status(500).json({
      error: "Error al enviar el mensaje",
      details: error.response?.data,
    });
  }
});

// Webhook de verificación (GET)
app.get("/webhook", (req, res) => {
  const verifyToken = "TOKEN_DE_VERIFICACION";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook de recepción de mensajes (POST)
app.post("/webhook", (req, res) => {
  const body = req.body;

  console.log("Webhook recibido:", JSON.stringify(body, null, 2));

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

