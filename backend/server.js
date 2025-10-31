const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Token de acesso do Instagram - substitua pelo seu token real
const ACCESS_TOKEN = 'SEU_TOKEN_DE_ACESSO_AQUI';

// Endpoint para buscar postagens do Instagram
app.get('/api/instagram-posts', async (req, res) => {
  try {
    console.log('Requisição recebida para /api/instagram-posts');
    // Para teste, retornar dados mockados já que o token não está configurado
    const mockData = {
      data: [
        {
          id: '1',
          caption: 'Postagem de teste 1',
          media_url: 'https://via.placeholder.com/400x400?text=Post+1',
          permalink: 'https://instagram.com/p/test1',
          like_count: 10,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          caption: 'Postagem de teste 2',
          media_url: 'https://via.placeholder.com/400x400?text=Post+2',
          permalink: 'https://instagram.com/p/test2',
          like_count: 5,
          timestamp: new Date().toISOString()
        }
      ]
    };

    console.log('Token:', ACCESS_TOKEN);
    // Se o token estiver configurado, usar a API real
    if (ACCESS_TOKEN !== 'SEU_TOKEN_DE_ACESSO_AQUI') {
      console.log('Usando API real do Instagram');
      const fields = 'id,caption,media_url,permalink,like_count,timestamp';
      const url = 'https://graph.instagram.com/me/media?fields=' + fields + '&access_token=' + ACCESS_TOKEN;

      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Erro ao buscar dados do Instagram' });
      }

      const data = await response.json();
      return res.json(data);
    }

    console.log('Retornando dados mockados');
    // Retornar dados mockados para teste
    res.json(mockData);
  } catch (error) {
    console.error('Erro na API do backend:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor backend rodando na porta ' + PORT);
});
