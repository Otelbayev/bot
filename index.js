import TelegramBot from "node-telegram-bot-api";

const token = "8443715913:AAE1UtcUhQiA5VTXyc803EkNG1zMaeL6cik";
const bot = new TelegramBot(token, { polling: true });

const requiredChannels = ["foydaliaipply"];

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    let allSubscribed = true;

    for (const channel of requiredChannels) {
      const member = await bot.getChatMember(`@${channel}`, userId);

      if (
        member.status !== "member" &&
        member.status !== "administrator" &&
        member.status !== "creator"
      ) {
        allSubscribed = false;
        break;
      }
    }

    if (allSubscribed) {
      bot.sendMessage(
        chatId,
        "🎉 Tabriklaymiz! Siz kanalimizga muvaffaqiyatli obuna bo‘ldingiz. Endi siz @foydaliaipply kanali orqali eng foydali postlar, AI bo‘yicha maslahatlar va ta’limga oid yangiliklarni birinchilardan bo‘lib olasiz 🚀"
      );
    } else {
      const text = "Foydali Aipply kanaliga obuna bo‘ling:\n\n";

      const buttons = requiredChannels.map((ch) => [
        {
          text: `📢 Obuna bo‘lish`,
          url: `https://t.me/${ch}`,
        },
      ]);

      buttons.push([
        {
          text: "✅ Obuna bo‘ldim",
          callback_data: "check_subscription",
        },
      ]);

      bot.sendMessage(chatId, text, {
        reply_markup: {
          inline_keyboard: buttons,
        },
      });
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "Xatolik yuz berdi. Keyinroq urinib ko‘ring.");
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  if (query.data === "check_subscription") {
    try {
      let allSubscribed = true;

      for (const channel of requiredChannels) {
        const member = await bot.getChatMember(`@${channel}`, userId);
        if (
          member.status !== "member" &&
          member.status !== "administrator" &&
          member.status !== "creator"
        ) {
          allSubscribed = false;
          break;
        }
      }

      if (allSubscribed) {
        bot.sendMessage(
          chatId,
          "🎉 Tabriklaymiz! Siz kanalimizga muvaffaqiyatli obuna bo‘ldingiz. Endi siz @foydaliaipply kanali orqali eng foydali postlar, AI bo‘yicha maslahatlar va ta’limga oid yangiliklarni birinchilardan bo‘lib olasiz 🚀"
        );
      } else {
        const text = "🚫 Siz hali kanalga obuna bo‘lmagansiz!\n\n";

        const buttons = requiredChannels.map((ch) => [
          {
            text: `📢 Obuna bo‘lish`,
            url: `https://t.me/${ch}`,
          },
        ]);

        buttons.push([
          {
            text: "✅ Obuna bo‘ldim",
            callback_data: "check_subscription",
          },
        ]);

        bot.sendMessage(chatId, text, {
          reply_markup: {
            inline_keyboard: buttons,
          },
        });
      }
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "⚠️ Xatolik yuz berdi, keyinroq urinib ko‘ring.");
    }
  }
});
