require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// 🔹 Inicializa el bot con el token desde .env
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

async function enviarAlerta(texto) {
    try {
        await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, texto);
        console.log("Telegram enviado");
    } catch (err) {
        console.log("Error al enviar Telegram:", err.message);
    }
}

module.exports = {
    enviarAlerta
};
