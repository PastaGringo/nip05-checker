#!/bin/bash

# Script d'arrêt pour NIP-05 Checker
# Usage: ./stop.sh

set -e

echo "🛑 NIP-05 Checker - Script d'arrêt"
echo "==================================="

# Vérifier si Docker est disponible
if command -v docker &> /dev/null && docker info &> /dev/null; then
    echo "🐳 Arrêt des conteneurs Docker..."
    
    # Essayer d'arrêter avec docker-compose d'abord
    if [ -f "docker-compose.yml" ] && command -v docker-compose &> /dev/null; then
        echo "📦 Arrêt avec docker-compose..."
        docker-compose down
        echo "✅ Conteneurs arrêtés avec docker-compose"
    else
        echo "🐋 Arrêt du conteneur Docker..."
        # Arrêter et supprimer le conteneur
        if docker ps -q -f name=nip05-checker | grep -q .; then
            docker stop nip05-checker
            docker rm nip05-checker
            echo "✅ Conteneur nip05-checker arrêté et supprimé"
        else
            echo "ℹ️  Aucun conteneur nip05-checker en cours d'exécution"
        fi
    fi
    
    # Nettoyer les images orphelines (optionnel)
    echo "🧹 Nettoyage des ressources Docker..."
    docker system prune -f --volumes 2>/dev/null || true
    
else
    echo "ℹ️  Docker n'est pas disponible ou n'est pas en cours d'exécution"
fi

echo "✅ Arrêt terminé"
echo "💡 Pour redémarrer: ./start.sh [docker|local]"