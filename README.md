# alagamentosp

# Monitoramento de Alagamentos em São Paulo

![GitHub last commit](https://img.shields.io/github/last-commit/seu-usuario/alagamentos-sp)
![Netlify](https://img.shields.io/netlify/seu-id-do-site/netlify-app)
![Telegram](https://img.shields.io/badge/Telegram-Bot-blue)

Um sistema de monitoramento em tempo real de alagamentos na cidade de São Paulo, com visualização web e alertas via Telegram.

## ✨ Funcionalidades

- ✅ Monitoramento em tempo real dos alagamentos
- ✅ Classificação por nível de criticidade (leve, moderado, crítico)
- ✅ Informações detalhadas (local, horário, situação)
- ✅ Alertas automáticos via Telegram
- ✅ Estatísticas atualizadas
- ✅ Design responsivo

## 🌐 Acesso ao Site

O projeto está disponível em duas plataformas:

1. **GitHub Pages**: [https://seu-usuario.github.io/alagamentos-sp/](https://seu-usuario.github.io/alagamentos-sp/)
2. **Netlify**: [https://seusite-alagamentos-sp.netlify.app/](https://seusite-alagamentos-sp.netlify.app/)

## 🤖 Bot do Telegram

Para receber alertas no seu celular:

1. Acesse: [t.me/seu_bot_alagamentos_sp_bot](https://t.me/seu_bot_alagamentos_sp_bot)
2. Envie o comando `/start` para se inscrever
3. Receba alertas instantâneos sobre alagamentos

Comandos disponíveis:
- `/start` - Inscrever para receber alertas
- `/stop` - Parar de receber alertas

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - GitHub Pages (hospedagem)
  - Netlify (hospedagem alternativa)

- **Backend**:
  - Python 3.x
  - Biblioteca python-telegram-bot
  - BeautifulSoup (parser de RSS)
  - Netlify Functions (para rodar o bot)

## 🚀 Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/alagamentos-sp.git
   cd alagamentos-sp
   ```

2. Para o site:
   - Basta abrir o arquivo `index.html` no navegador

3. Para o bot (requer Python 3.8+):
   ```bash
   cd bot
   pip install -r requirements.txt
   python bot.py
   ```
   (Configure as variáveis de ambiente necessárias)

## 🔧 Configuração do Ambiente

1. Crie um arquivo `.env` na pasta `bot` com:
   ```
   TELEGRAM_TOKEN=seu_token_aqui
   CHANNEL_ID=opcional_id_do_canal
   ```

2. Para deploy no Netlify:
   - Conecte seu repositório GitHub
   - Adicione as variáveis de ambiente no painel do Netlify

## 📌 Dados Utilizados

Os dados são obtidos em tempo real do feed RSS oficial da CGESP:
[https://www.cgesp.org/v3/feed_rss.jsp](https://www.cgesp.org/v3/feed_rss.jsp)

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request



---

**Observação**: Este projeto não é afiliado à Prefeitura de São Paulo ou CGESP. Os dados são fornecidos como serviço público.
