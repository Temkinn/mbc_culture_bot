import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const token = process.env.BOT_TOKEN;
const api = process.env.API_URL;
const bot = new TelegramBot(token, { polling: true });
console.log("Bot is working!");

// requests.post(f"{api}/users/add", json = {
// 	"id": message.from_user.id,
// 	"name": message.from_user.first_name,
// 	"username": message.from_user.username
// })

// requests.put(f"{api}/users/update/{message.from_user.id}", json={
// 	"name": message.from_user.first_name,
// 	"username": message.from_user.username
// })

function start(chat) {
  	console.log(chat);

	axios.get(`${api}/user/${chat.id}`)
	.then((response) => {
		const user = response.data;
        console.log(user);
        if (user) {
            axios.put(`${api}/users/update/${chat.id}`, {
                name: chat.first_name,
                username: chat.username
            })
        } else {
            axios.post(`${api}/users/add`, {
                id: chat.id,
                name: chat.first_name,
                username: chat.username
            })
        }
    })

  bot.sendMessage(
    chat.id,
    `Здравствуйте, ${chat.first_name}!\nЯ рад приветствовать вас в нашем боте!\nЧем я могу вам помочь?`,
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "☕ Заглянуть в меню",
              web_app: { url: process.env.menuURL },
            },
            {
              text: "💌 Подписки",
              web_app: { url: process.env.subURL },
            },
            {
              text: "❓ Задать вопрос",
              web_app: { url: process.env.questionURL },
            },
          ],
          [
            {
              text: "❔ Часто задаваемые вопросы",
            },
          ],
        ],
        resize_keyboard: true,
      },
    }
  );
}

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // console.log(msg.chat);

  if (text === "/start") {
    start(msg.chat);
  } else if (text === "Hello") {
    bot.sendMessage(chatId, "Hi there!");
  } else {
    bot.sendMessage(
      chatId,
      "I don't understand that command. Type '/start' to start"
    );
  }
});
