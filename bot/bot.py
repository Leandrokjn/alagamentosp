import os
import requests
from bs4 import BeautifulSoup
from telegram import Update, Bot
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext
from datetime import datetime, timedelta
import pytz

# Configurações
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
CHANNEL_ID = os.getenv('CHANNEL_ID')  # Opcional: ID do canal para enviar alertas públicos
RSS_FEED_URL = 'https://www.cgesp.org/v3/feed_rss.jsp'
TIMEZONE = pytz.timezone('America/Sao_Paulo')

# Dicionário para armazenar usuários inscritos
subscribers = set()

# Dicionário para armazenar os últimos alertas enviados
last_alerts = {}

def start(update: Update, context: CallbackContext) -> None:
    user = update.effective_user
    subscribers.add(user.id)
    update.message.reply_text(
        f"Olá {user.first_name}!\n\n"
        "Você foi inscrito para receber alertas de alagamentos em São Paulo.\n\n"
        "Você receberá notificações sempre que houver novos alagamentos ou quando eles forem encerrados.\n\n"
        "Use /stop para parar de receber alertas."
    )

def stop(update: Update, context: CallbackContext) -> None:
    user = update.effective_user
    if user.id in subscribers:
        subscribers.remove(user.id)
    update.message.reply_text(
        "Você não receberá mais alertas de alagamentos.\n\n"
        "Use /start para se inscrever novamente."
    )

def fetch_alerts():
    try:
        response = requests.get(RSS_FEED_URL)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'xml')
        items = soup.find_all('item')
        
        alerts = []
        
        for item in items:
            title = item.title.text
            description = item.description.text
            pub_date = datetime.strptime(item.pubDate.text, '%a, %d %b %Y %H:%M:%S %z')
            pub_date = pub_date.astimezone(TIMEZONE)
            
            # Extrair informações do título
            parts = title.split(':')
            if len(parts) < 4:
                continue
                
            status = parts[0].strip()
            region = parts[1].strip()
            street = parts[2].strip()
            severity = parts[3].strip()
            
            is_resolved = 'encerrado' in status.lower()
            
            alert_id = f"{region}:{street}"
            
            alerts.append({
                'id': alert_id,
                'title': title,
                'description': description,
                'pub_date': pub_date,
                'region': region,
                'street': street,
                'severity': severity,
                'is_resolved': is_resolved
            })
        
        return alerts
    
    except Exception as e:
        print(f"Erro ao buscar alertas: {e}")
        return []

def check_for_new_alerts(context: CallbackContext):
    print("Verificando novos alertas...")
    alerts = fetch_alerts()
    now = datetime.now(TIMEZONE)
    
    for alert in alerts:
        alert_id = alert['id']
        
        # Verificar se é um alerta novo ou atualizado
        if alert_id not in last_alerts or last_alerts[alert_id]['is_resolved'] != alert['is_resolved']:
            send_alert(context, alert)
            last_alerts[alert_id] = alert
        # Se o alerta já existe mas é mais recente (atualização de gravidade)
        elif alert_id in last_alerts and alert['pub_date'] > last_alerts[alert_id]['pub_date']:
            send_alert(context, alert)
            last_alerts[alert_id] = alert

def send_alert(context: CallbackContext, alert):
    message = format_alert_message(alert)
    
    # Enviar para todos os assinantes
    for user_id in subscribers:
        try:
            context.bot.send_message(chat_id=user_id, text=message, parse_mode='HTML')
        except Exception as
