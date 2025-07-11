# Utilise une image nginx légère pour servir les fichiers statiques
FROM nginx:alpine

# Copie les fichiers de l'application dans le répertoire de nginx
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY README.md /usr/share/nginx/html/

# Configuration nginx personnalisée pour gérer les CORS
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header Access-Control-Allow-Origin *;' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Expose le port 80
EXPOSE 80

# Démarre nginx
CMD ["nginx", "-g", "daemon off;"]