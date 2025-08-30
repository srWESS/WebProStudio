const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Token de acesso do Instagram - substitua pelo seu token real
const ACCESS_TOKEN = 'SEU_TOKEN_DE_ACESSO_AQUI';

// Endpoint para buscar postagens do Instagram
app.get('/api/instagram-posts', async (req, res) => {
  try {
    const fields = 'id,caption,media_url,permalink,like_count,timestamp';
    const url = 'https://graph.instagram.com/me/media?fields=' + fields + '&access_token=' + ACCESS_TOKEN;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar dados do Instagram' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro na API do backend:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor backend rodando na porta ' + PORT);
});
