#!/bin/bash

# Script de démarrage pour NIP-05 Checker
# Usage: ./start.sh [docker|local]

set -e

MODE=${1:-docker}

echo "🔐 NIP-05 Checker - Script de démarrage"
echo "======================================"

if [ "$MODE" = "docker" ]; then
    echo "🐳 Mode Docker sélectionné"
    
    # Vérifier si Docker est installé
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
        echo "   Téléchargez Docker Desktop: https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    
    # Vérifier si Docker est en cours d'exécution
    if ! docker info &> /dev/null; then
        echo "❌ Docker n'est pas en cours d'exécution."
        echo "   Veuillez démarrer Docker Desktop et réessayer."
        exit 1
    fi
    
    echo "✅ Docker est disponible"
    
    # Vérifier si docker-compose est disponible
    if command -v docker-compose &> /dev/null; then
        echo "🚀 Démarrage avec docker-compose..."
        docker-compose up -d
        echo "✅ Application démarrée sur http://localhost:8080"
    else
        echo "🚀 Démarrage avec Docker..."
        # Arrêter le conteneur s'il existe déjà
        docker stop nip05-checker 2>/dev/null || true
        docker rm nip05-checker 2>/dev/null || true
        
        # Construire et démarrer
        docker build -t nip05-checker .
        docker run -d -p 8080:80 --name nip05-checker nip05-checker
        echo "✅ Application démarrée sur http://localhost:8080"
    fi
    
elif [ "$MODE" = "local" ]; then
    echo "💻 Mode développement local sélectionné"
    
    # Vérifier si Python est disponible
    if command -v python3 &> /dev/null; then
        echo "🐍 Démarrage avec Python 3..."
        echo "✅ Application démarrée sur http://localhost:8000"
        echo "   Appuyez sur Ctrl+C pour arrêter"
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "🐍 Démarrage avec Python..."
        echo "✅ Application démarrée sur http://localhost:8000"
        echo "   Appuyez sur Ctrl+C pour arrêter"
        python -m http.server 8000
    elif command -v php &> /dev/null; then
        echo "🐘 Démarrage avec PHP..."
        echo "✅ Application démarrée sur http://localhost:8000"
        echo "   Appuyez sur Ctrl+C pour arrêter"
        php -S localhost:8000
    else
        echo "❌ Aucun serveur web disponible (Python ou PHP requis)"
        echo "   Installez Python 3 ou PHP pour le mode local"
        exit 1
    fi
    
else
    echo "❌ Mode non reconnu: $MODE"
    echo "Usage: $0 [docker|local]"
    echo "  docker - Utilise Docker/Docker Compose (recommandé)"
    echo "  local  - Serveur de développement local"
    exit 1
fi