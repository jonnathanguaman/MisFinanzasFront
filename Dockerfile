FROM nginx:alpine

# Copiar los archivos construidos a la carpeta de Nginx
COPY dist/MisFinanzas/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
