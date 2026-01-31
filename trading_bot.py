import smtplib
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Admin configuration
ADMIN_CHAT_ID = 'YOUR_ADMIN_CHAT_ID'
EMAIL_ADDRESS = 'YOUR_EMAIL@gmail.com'
EMAIL_PASSWORD = 'YOUR_EMAIL_PASSWORD'

def start(update: Update, context: CallbackContext):
    update.message.reply_text('Welcome to the Trading Bot!')

def admin_panel(update: Update, context: CallbackContext):
    if update.message.chat_id == ADMIN_CHAT_ID:
        update.message.reply_text('Welcome to the Admin Panel!')
    else:
        update.message.reply_text('You are not authorized to use the admin panel.')

def send_email(subject: str, body: str):
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        message = f'Subject: {subject}\n\n{body}'
        server.sendmail(EMAIL_ADDRESS, EMAIL_ADDRESS, message)

def main():
    updater = Updater("YOUR_TELEGRAM_BOT_TOKEN", use_context=True)
    
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("admin", admin_panel))
    
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()