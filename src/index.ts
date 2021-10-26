import { Telegraf, session, Markup } from "telegraf";
import dotenv from "dotenv";
const configOutput = dotenv.config();

if (configOutput.error) {
    throw new Error("Config not loaded");
}

const post_keyboard = (link_id: string) => Markup.inlineKeyboard([
    Markup.button.url(`Go to site ${link_id}`, 'https://zvykach.ml'),
    Markup.button.callback('Remove link', `delete:${link_id}`)
]);

const confirm_removing_keyboard = (link_id: string) => Markup.inlineKeyboard([
    Markup.button.callback('Yes', `confirm:${link_id}`),
    Markup.button.callback('Cancel', `cancel:${link_id}`)
])



const bot = new Telegraf(process.env.TOKEN!);
bot.use(session());

bot.command('start', ctx => {
    ctx.reply('Welcome', post_keyboard('test'));
});

bot.action(/^delete:[a-zA-Z0-9]+$/, async ctx => {
    await ctx.answerCbQuery();
    const id = (<any>ctx.callbackQuery).data.split(':');
    if (!id) return;
    return ctx.editMessageText('Sure?', confirm_removing_keyboard(id[1]))
});

bot.action(/^confirm:[a-zA-Z0-9]+$/, async ctx => {
    await ctx.answerCbQuery();
    const id = (<any>ctx.callbackQuery).data.split(':')[1];
});

bot.action(/^cancel:[a-zA-Z0-9]+$/, async ctx => {
    await ctx.answerCbQuery();
    const id = (<any>ctx.callbackQuery).data.split(':')[1];
    if (!id) return;
    return ctx.editMessageText('Welcome', post_keyboard(id))
});

bot.inlineQuery('goto', ctx => {
    ctx.inlineQuery.query
    ctx.editMessageText('Lel, okay');
})

bot.launch();
  
