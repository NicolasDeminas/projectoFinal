Para poder usar los endpoints hay que crear un archivo .env con los siguiente datos:

MONGO_CNX = mongodb+srv://Nico:SnZtUcHWXy8KRj8Y@ecommerceatlas.zbptj.mongodb.net/coder_ecommerce?retryWrites=true&w=majority
SESSION_SECRET = secreto123456session
PRIVATE_KEY = llaveprivadaparajwt
MAIL = deminas.nicolas@gmail.com
MODE = FORK
ACCOUNTSID = ACc212e539d6e34724834e1e5b8456bacf
AUTHTOKEN = d36fa8281efbd49b4f938d7e835eb775

Las rutas son:
POST/api/usuarios/login ----> devuelve un token, necesario para acceder a las demas rutas
POST/api/usuarios/signup
GET/api/usuarios ----> obtiene los datos del usuario una vez logueado (importante el id de carrito)
GET /api/productos ----> devuelve todos los productos
POST/api/carrito/?idcarrito/productos ---> Agrega un producto al carrito (pasar el id de producto en el body)
GET /api/carrito/comprar/?idcarrito -----> envia los productos del carrito por mail y lo devuelve vacio
