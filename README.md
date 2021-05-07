# Gerente de restaurantes

Sistema para la administración de los procesos que se llevan a cabo en un restaurante tales como: compra de insumos, administración de inventario, ventas, pedidos, etc.

## Requisitos
nodejs 14.x

## Instalación
```
cp src/env.example.js src/env.js
npm i
npm run start
```
## Ayuda
* Configuración en servidor NGINX
```
server {
    root /var/www/gerente/build;
    index index.php index.html index.htm index.nginx-debian.html;
    server_name example.com;

    location / {
        try_files $uri /index.html;
    }
}
```