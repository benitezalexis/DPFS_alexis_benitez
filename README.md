# 🛒 E-commerce TuSuperAC

## 🧠 Temática del Marketplace
El sitio será un e-commerce de supermercado. El nombre del e-commerce se llamara **TuSuperAC** .El mismo Ofrecerá productos frescos, alimentos no perecederos, bebidas, productos de limpieza y artículos para el hogar.

El enfoque estará en brindar:
- Una experiencia rápida y fácil para hacer compras semanales.
- Promociones semanales destacadas.
- Envío a domicilio y retiro en tienda.

## 🎯 Público Objetivo
Está dirigido principalmente a:
- Familias que hacen compras mensuales o semanales.
- Personas mayores que prefieren evitar filas.
- Jóvenes ocupados que valoran el tiempo y prefieren comprar online.

## 📅 tablero de trabajo
https://trello.com/b/zQzPhYYc/fullstack-digital-house-ecommercer-tusuper

## 👨‍💻 Sobre mí
Soy Alexis Benitez, estudiante de desarrollo Full Stack. Me apasiona crear soluciones digitales que mejoren la vida de las personas. En este proyecto busco aplicar mis conocimientos de React y Node.js para resolver una necesidad real.

## 🔍 Sitios de referencia

1. **https://www.pedidosya.com.py/**
   - Ofrece una experiencia de supermercado online rápida y directa.
2. **https://www.carrefour.com.ar/**
   - Muy buen diseño de navegación por categorías y ofertas destacadas.
3. **https://superseis.com.py/**
   - Ejemplo local, útil para entender qué buscan los clientes paraguayos.
4. **https://www.arete.com.py/**
   - Excelente usabilidad móvil y carrito inteligente.
5. **https://cornershopapp.com/**
   - Proceso de checkout y experiencia de usuario muy fluida.
   - 
Estos sitios fueron seleccionados por su buena estética, funcionalidades, y su similitud con el tipo de e-commerce que quiero desarrollar.
## 🚀 Cómo instalar y correr los proyectos

### 1️⃣ Crear la base de datos

Antes de instalar los proyectos, es necesario tener **MySQL** corriendo en tu máquina o servidor.

1. Descargar el script tusuperac.sql de la carpeta db:

Se debe crear una db llamada "tusuperac"

📌 Nota: Si deseas usar otro nombre para la bases de datos, recordá cambiarlo en el archivo de configuración de Sequelize (/config/config.js o /config/database.js según tu estructura).
2️⃣ Descargar los proyectos
Cloná o descargá los dos proyectos desde tu repositorio o fuente:

🛒 TuSuperAC → Proyecto e-commerce backend y frontend MVC con Express Generator.

📊 reactDashboard → Proyecto de dashboard administrativo en React.

3️⃣ Instalar dependencias
Entrá en cada carpeta del proyecto y ejecutá:
`npm install` 

Ejemplo

`cd TuSuperAC`

`npm install`

`cd ../reactDashboard`

`npm install` 


4️⃣ Ejecutar los proyectos
Dentro de cada carpeta, ejecutá:

`npm run dev`

### Ingresar como Administrador en el E-commerce
La aplicación está diseñada únicamente para gestión interna, no como un marketplace. Por eso, existen dos tipos de acceso: uno para clientes y otro exclusivo para administradores.

El acceso para administradores está separado del login principal para evitar que los clientes puedan visualizar o acceder al formulario de inicio de sesión administrativo.

Para ingresar como administrador, se debe utilizar el siguiente endpoint:

http://localhost:3000/loginAdmin

usuario admin de ejemplo
usuario=pedro@example.com
contraseña=123456

## 📅 Alcance

El sistema no tiene en cuenta aun cobros de pedidos
