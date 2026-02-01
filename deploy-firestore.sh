#!/bin/bash

# Script para desplegar reglas de Firestore a Firebase
# Ejecuta: bash deploy-firestore.sh

echo "🚀 Desplegando reglas de Firestore a Firebase..."
echo ""

# Verificar que Firebase CLI esté instalado
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI no está instalado"
    echo "Instálalo con: npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI encontrado"
echo ""

# Login a Firebase (si es necesario)
echo "Verificando autenticación..."
firebase login:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "No estás autenticado. Iniciando login..."
    firebase login
fi

echo "✅ Autenticado en Firebase"
echo ""

# Seleccionar proyecto
echo "Seleccionando proyecto hoymismoapp..."
firebase use hoymismoapp

if [ $? -ne 0 ]; then
    echo "❌ No se pudo seleccionar el proyecto"
    echo "Ejecuta: firebase use --add"
    exit 1
fi

echo "✅ Proyecto seleccionado"
echo ""

# Desplegar solo las reglas de Firestore
echo "Desplegando reglas de Firestore..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Reglas desplegadas exitosamente!"
    echo ""
    echo "Puedes verificar las reglas en:"
    echo "https://console.firebase.google.com/project/hoymismoapp/firestore/rules"
else
    echo ""
    echo "❌ Error al desplegar las reglas"
    exit 1
fi

# Desplegar también los índices (opcional)
read -p "¿Desplegar también los índices de Firestore? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Desplegando índices..."
    firebase deploy --only firestore:indexes

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ ¡Índices desplegados exitosamente!"
    else
        echo ""
        echo "⚠️ Error al desplegar los índices (esto es opcional)"
    fi
fi

echo ""
echo "🎉 ¡Deployment completado!"
