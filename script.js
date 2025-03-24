document.addEventListener('DOMContentLoaded', function() {
    const RSS_FEED_URL = 'https://www.cgesp.org/v3/feed_rss.jsp';
    const CORS_PROXY = 'https://api.allorigins.win/get?url=';
    
    // Atualizar a cada 5 minutos (300000 ms)
    const UPDATE_INTERVAL = 300000;
    
    let allAlerts = [];
    
    // Função para buscar e processar o feed RSS
    async function fetchAlerts() {
        try {
            const response = await fetch(`${CORS_PROXY}${encodeURIComponent(RSS_FEED_URL)}`);
            const data = await response.json();
            
            if (data.contents) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, "text/xml");
                const items = xmlDoc.querySelectorAll('item');
                
                allAlerts = Array.from(items).map(item => {
                    const title = item.querySelector('title').textContent;
                    const description = item.querySelector('description').textContent;
                    const pubDate = new Date(item.querySelector('pubDate').textContent);
                    
                    // Extrair informações do título
                    const match = title.match(/(.*?): (.*?) - (.*?) - (.*)/);
                    if (!match) return null;
                    
                    const [_, status, region, street, severityText] = match;
                    const isResolved = status.toLowerCase().includes('encerrado');
                    
                    // Determinar nível de criticidade
                    let severity, severityClass;
                    if (isResolved) {
                        severity = 'resolved';
                        severityClass = 'resolved';
                    } else {
                        if (severityText.toLowerCase().includes('grande')) {
                            severity = 'critical';
                            severityClass = 'critical';
                        } else if (severityText.toLowerCase().includes('médio')) {
                            severity = 'moderate';
                            severityClass = 'moderate';
                        } else {
                            severity = 'light';
                            severityClass = 'light';
                        }
                    }
                    
                    return {
                        title,
                        description,
                        pubDate,
                        region: region.trim(),
                        street: street.trim(),
                        severity,
                        severityClass,
                        severityText: severityText.trim(),
                        isResolved
                    };
                }).filter(alert => alert !== null);
                
                updateUI();
                updateStats();
                updateTime();
            }
        } catch (error) {
            console.error('Erro ao buscar alertas:', error);
        }
    }
    
    // Atualizar a interface com os alertas
    function updateUI() {
        const container = document.getElementById('alerts-container');
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const severityFilter = document.getElementById('severity-filter').value;
        
        // Filtrar alertas
        const filteredAlerts = allAlerts.filter(alert => {
            const matchesSearch = alert.region.toLowerCase().includes(searchTerm) || 
                                 alert.street.toLowerCase().includes(searchTerm);
            const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
            return matchesSearch && matchesSeverity;
        });
        
        // Ordenar por data (mais recente primeiro)
        filteredAlerts.sort((a, b) => b.pubDate - a.pubDate);
        
        // Gerar HTML dos alertas
        container.innerHTML = filteredAlerts.map(alert => `
            <div class="alert-card ${alert.severityClass}">
                <span class="severity ${alert.severityClass}">${alert.severityText.toUpperCase()}</span>
                <h3>${alert.region}</h3>
                <p><strong>Local:</strong> ${alert.street}</p>
                <p><strong>Início:</strong> ${formatDate(alert.pubDate)}</p>
                ${alert.isResolved ? `<p><strong>Fim:</strong> ${formatDate(new Date(alert.description.match(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/)[0]))}</p>` : ''}
                <p>${alert.description}</p>
            </div>
        `).join('');
    }
    
    // Atualizar estatísticas
    function updateStats() {
        document.getElementById('critical-count').textContent = 
            allAlerts.filter(a => a.severity === 'critical' && !a.isResolved).length;
        
        document.getElementById('moderate-count').textContent = 
            allAlerts.filter(a => a.severity === 'moderate' && !a.isResolved).length;
        
        document.getElementById('light-count').textContent = 
            allAlerts.filter(a => a.severity === 'light' && !a.isResolved).length;
        
        document.getElementById('resolved-count').textContent = 
            allAlerts.filter(a => a.isResolved).length;
    }
    
    // Atualizar hora da última atualização
    function updateTime() {
        document.getElementById('update-time').textContent = new Date().toLocaleString('pt-BR');
    }
    
    // Formatar data
    function formatDate(date) {
        return date.toLocaleString('pt-BR');
    }
    
    // Event listeners para filtros
    document.getElementById('search').addEventListener('input', updateUI);
    document.getElementById('severity-filter').addEventListener('change', updateUI);
    
    // Buscar alertas inicialmente e configurar intervalo de atualização
    fetchAlerts();
    setInterval(fetchAlerts, UPDATE_INTERVAL);
});
