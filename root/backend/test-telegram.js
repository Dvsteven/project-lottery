// Script para probar envío de Telegram
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

async function testTelegram() {
    try {
        console.log("🤖 Enviando mensaje de prueba a Telegram...");
        
        await bot.sendMessage(
            process.env.TELEGRAM_CHAT_ID,
            `✅ TEST BOT - Lottery Tracker Funcionando
            
📊 Datos de Prueba:
- Placa: HGS22E
- Coincidencias: 3
- Números: 022, 220, 22

🎯 Sistema funcionando correctamente en local
⏰ Hora: ${new Date().toLocaleString()}

✨ Dashboard: http://localhost:3000`
        );
        
        console.log("✅ Mensaje enviado correctamente a Telegram!");
        process.exit(0);
    } catch (err) {
        console.log("❌ Error enviando Telegram:", err.message);
        process.exit(1);
    }
}

testTelegram();
