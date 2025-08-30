class InstagramFeed {
    constructor() {
        this.feedContainer = document.getElementById('instagram-feed');
        this.apiUrl = 'http://localhost:4000/api/instagram-posts'; // Endpoint do backend
        this.maxPosts = 6; // Número máximo de postagens a exibir
        this.init();
    }

    async init() {
        try {
            this.showLoading();
            const posts = await this.fetchInstagramPosts();
            this.displayPosts(posts);
        } catch (error) {
            console.error('Erro ao carregar postagens do Instagram:', error);
            this.showError();
        }
    }

    async fetchInstagramPosts() {
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do backend');
        }
        const data = await response.json();
        // Mapear dados para o formato esperado
        return data.data.slice(0, this.maxPosts).map(post => ({
            id: post.id,
            image: post.media_url,
            caption: post.caption || '',
            likes: post.like_count || 0,
            timestamp: this.formatTime(post.timestamp),
            link: post.permalink
        }));
    }

    displayPosts(posts) {
        this.feedContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            this.feedContainer.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'instagram-post';
        postDiv.innerHTML = 
            '<a href="' + post.link + '" target="_blank" class="post-link">' +
                '<div class="post-image">' +
                    '<img src="' + post.image + '" alt="Postagem do Instagram" loading="lazy">' +
                    '<div class="post-overlay">' +
                        '<span class="likes">❤️ ' + post.likes + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="post-content">' +
                    '<p class="post-caption">' + post.caption + '</p>' +
                    '<span class="post-time">' + post.timestamp + '</span>' +
                '</div>' +
            '</a>';
        return postDiv;
    }

    showLoading() {
        this.feedContainer.innerHTML = 
            '<div class="loading">' +
                '<div class="loading-spinner"></div>' +
                '<p>Carregando postagens do Instagram...</p>' +
            '</div>';
    }

    showError() {
        this.feedContainer.innerHTML = 
            '<div class="error">' +
                '<p>😕 Não foi possível carregar as postagens do Instagram.</p>' +
                '<p>Visite nosso <a href="https://instagram.com/web.pro.studio" target="_blank">perfil diretamente</a>.</p>' +
            '</div>';
    }

    formatTime(timestamp) {
        const postDate = new Date(timestamp);
        const now = new Date();
        const diff = now - postDate;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 24) {
            return hours + ' hora' + (hours !== 1 ? 's' : '') + ' atrás';
        } else {
            const days = Math.floor(hours / 24);
            return days + ' dia' + (days !== 1 ? 's' : '') + ' atrás';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new InstagramFeed();
});
