# Sistema de Gestion de Biblioteca Universitaria UNCP

Aplicacion local para una evaluacion parcial de Desarrollo de Aplicaciones Web. Usa React, Vite, TypeScript, React Router, Local Storage y jsPDF.

## Equipo de trabajo

Examen elaborado en equipo de 4 estudiantes usando GitHub para la organizacion del proyecto.

| Estudiante | Backlog desarrollado |
| --- | --- |
| CASTILLO LAVADO FAVIO SAMIR | Implementacion del modulo administrador de categorias y libros: formularios, listado, edicion, eliminacion, validaciones de duplicados, restricciones de stock e integracion con Local Storage. |
| NAHUINRIPA ZAMUDIO JESUS | Implementacion del acceso tipo intranet, rutas protegidas, layout institucional UNCP, navegacion por rol y gestion de sesion local para administrador y usuario registrado. |
| SAMANIEGO QUISPE DEIVID | Implementacion del modulo de usuarios: registro, edicion, eliminacion, usuario y contrasena, validaciones de correo, codigo universitario, usuario duplicado y restricciones de campos. |
| HUAYTA HINOJOSA HENRY | Implementacion del catalogo, solicitud de prestamos, historial, devoluciones, comprobante digital, generacion PDF con jsPDF y actualizacion coherente de stock. |

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

Para generar una version de produccion:

```bash
npm run build
```

Tambien se puede revisar el codigo con:

```bash
npm run lint
```

## Acceso de demostracion tipo intranet

La pantalla `/acceso` simula un login de intranet UNCP con usuario y contrasena, pero sigue siendo acceso local sin backend.

- Administrador demo: usuario `admin`, contrasena `admin123`.
- Usuario estudiante demo: usuario `ana.torres`, contrasena `uncp2026`.
- Usuario docente demo: usuario `carlos.mendoza`, contrasena `uncp2026`.
- Los nuevos usuarios se registran desde el modulo administrador `/admin/usuarios`, incluyendo su usuario y contrasena.

Este acceso es una simulacion local para la evaluacion. No debe considerarse autenticacion real.

## Identidad visual

La interfaz usa una referencia visual institucional inspirada en la UNCP: azul predominante, blanco, acento verde y dorado, barra superior sobria y tipografia de sistema tipo portal administrativo. La referencia se tomo del manual corporativo de marca UNCP y de su acceso de intranet.

## Datos demo

La primera vez que se abre la aplicacion se cargan datos ficticios:

- Categorias: Literatura, Ciencias y Tecnologia.
- Libros: 6 registros demo, incluyendo un libro sin stock.
- Usuarios: Ana Torres Ruiz como estudiante y Carlos Mendoza Vega como docente.

Los datos solo se inicializan si no existe almacenamiento previo en Local Storage. Si se eliminan registros, la aplicacion no los repone automaticamente.

## Reglas asumidas

- La duracion de un prestamo es de 7 dias, definida en `src/utils/dates.ts`.
- El codigo universitario no tiene formato obligatorio; solo se valida que no este vacio y que no se duplique tras normalizar espacios y mayusculas.
- El comprobante conserva copia del nombre del usuario y del titulo del libro al momento del prestamo para mantener historial aunque luego cambien los registros.

## Estructura

- `src/types`: interfaces y tipos principales.
- `src/context`: estado compartido, sesion local y reglas de negocio.
- `src/utils`: Local Storage, fechas, normalizacion y PDF.
- `src/components`: layout, rutas protegidas, formularios, avisos y comprobantes.
- `src/pages`: vistas de acceso, administracion, catalogo, prestamos, historial y comprobantes.

## Rutas

- `/acceso`: login tipo intranet y credenciales demo.
- `/admin/categorias`: CRUD de categorias.
- `/admin/libros`: CRUD de libros.
- `/admin/usuarios`: registro, edicion, eliminacion y listado de usuarios.
- `/admin/prestamos`: listado general y registro de devoluciones.
- `/catalogo`: busqueda, filtros y solicitud de prestamos.
- `/mis-prestamos`: prestamos activos del usuario autenticado.
- `/historial`: historial propio del usuario autenticado.
- `/comprobante/:id`: consulta y descarga PDF del comprobante.

## Criterios del examen

| Criterio | Paginas y funcionalidades |
| --- | --- |
| Gestion de categorias y libros | `/admin/categorias` y `/admin/libros`: registrar, listar, editar, eliminar, validar duplicados, stock, categoria existente y bloqueos por uso o prestamos activos. |
| Gestion de usuarios | `/admin/usuarios`: registrar, editar y eliminar usuarios con usuario y contrasena, validar correo, campos obligatorios, codigo universitario duplicado y usuario de acceso duplicado. No elimina usuarios con prestamos registrados. |
| Solicitud y prestamo de libros | `/catalogo` y `/mis-prestamos`: busqueda por titulo, filtro por categoria, estados de stock, solicitud de prestamo y descuento de inventario. |
| Comprobante digital | `/comprobante/:id`: comprobante en pantalla, persistencia en Local Storage y descarga PDF real con jsPDF. |
| Historial de prestamos | `/historial` y `/admin/prestamos`: historial por usuario, prestamos activos, devoluciones, fechas reales y control para no devolver dos veces. |

## Como probar paso a paso

1. Abra `/acceso` y entre como administrador con `admin` / `admin123`.
2. Vaya a `/admin/categorias`, registre una categoria, edite su nombre y recargue para comprobar persistencia.
3. Vaya a `/admin/libros`, registre un libro con la categoria creada, edite sus datos y recargue.
4. Vaya a `/admin/usuarios`, registre un usuario con usuario/contrasena, edite sus datos y luego intente registrar otro con el mismo codigo o usuario usando diferentes mayusculas o espacios.
5. Salga, entre como usuario con `ana.torres` / `uncp2026` o con el usuario que creo el administrador, y vaya al catalogo.
6. En `/catalogo`, busque por titulo, filtre por categoria y combine ambos filtros.
7. Solicite un prestamo de un libro con stock. El stock debe bajar exactamente una unidad y aparecer el enlace al comprobante.
8. Intente solicitar un libro con stock cero. El sistema debe bloquear la operacion.
9. Abra el comprobante, revise los datos y descargue el PDF.
10. Recargue el navegador y confirme que el prestamo y el comprobante siguen disponibles.
11. Entre como administrador en `/admin/prestamos`, registre la devolucion y confirme que el stock sube una unidad.
12. Intente registrar la devolucion otra vez. El boton queda deshabilitado para prestamos devueltos.
13. Cambie a otro usuario desde `/acceso` y compruebe que `/historial` solo muestra sus propios prestamos.
14. Reduzca el ancho del navegador para comprobar tablas desplazables y formularios responsivos.

## Comprobaciones realizadas

- `npm run build`: correcto.
- `npm run lint`: correcto.
- No se realizo verificacion manual en navegador dentro de esta sesion. La aplicacion queda lista para ejecutarse localmente con `npm run dev`.
