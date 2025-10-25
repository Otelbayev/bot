import TelegramBot from "node-telegram-bot-api";

const token = "8099275705:AAESdauszIWDn-g_4wqxdXDK2RPhflsgvOk";
const bot = new TelegramBot(token, { polling: true });

const requiredChannels = ["forcheckingb"];

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
        "✅ Rahmat! Siz barcha kanallarga obuna bo‘lgansiz.\nEndi botdan foydalanishingiz mumkin 🎉"
      );
    } else {
      const text =
        "❌ Botdan foydalanishdan oldin quyidagi kanallarga obuna bo‘ling:\n\n";

      const buttons = requiredChannels.map((ch) => [
        {
          text: `📢 ${ch} kanaliga obuna bo‘lish`,
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
          "✅ Rahmat! Siz barcha kanallarga obuna bo‘lgansiz.\nEndi botdan foydalanishingiz mumkin 🎉"
        );
      } else {
        bot.sendMessage(
          chatId,
          "🚫 Siz hali barcha kanallarga obuna bo‘lmagansiz!\nIltimos, avval barcha kanallarga obuna bo‘ling va keyin qayta tekshirib ko‘ring."
        );
      }
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "⚠️ Xatolik yuz berdi, keyinroq urinib ko‘ring.");
    }
  }
});
