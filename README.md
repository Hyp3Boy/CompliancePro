# CompliancePro Search Tool

![Project Demo GIF](https://via.placeholder.com/800x400.gif?text=Añade+un+GIF+de+demostración+aquí)

CompliancePro es una herramienta de software integral diseñada para automatizar la búsqueda de entidades en listas de alto riesgo y gestionar una base de datos de proveedores. Este proyecto nació como solución a una prueba técnica para desarrolladores .NET, demostrando habilidades en desarrollo de API REST, web scraping, gestión de bases de datos y desarrollo de frontend.

---

## 📋 Tabla de Contenidos
- [CompliancePro](#compliancepro)
    - [**Cómo Usarlo**](#cómo-usarlo)
- [CompliancePro Search Tool](#compliancepro-search-tool)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [Acerca del Proyecto](#acerca-del-proyecto)
  - [✨ Características Principales](#-características-principales)
  - [🛠️ Stack Tecnológico](#️-stack-tecnológico)
    - [Backend (`ComplianceCoreApi`)](#backend-compliancecoreapi)
    - [Frontend (`ComplianceProUI`)](#frontend-complianceproui)
  - [🚀 Getting Started](#-getting-started)
    - [Prerrequisitos](#prerrequisitos)
    - [Instalación y Configuración](#instalación-y-configuración)
  - [▶️ Ejecutando la Aplicación](#️-ejecutando-la-aplicación)
  - [🔑 Endpoints de la API](#-endpoints-de-la-api)


## Acerca del Proyecto

En el sector financiero y en muchas otras industrias, es crucial verificar que las entidades (clientes, proveedores, etc.) no figuren en listas de sanciones internacionales, listas de vigilancia u otras bases de datos de riesgo. Este proyecto automatiza ese proceso mediante:

1.  **Un potente backend (.NET 8)** que expone una API REST para realizar búsquedas y gestionar datos.
2.  **Un sistema de Web Scraping** que extrae información en tiempo real de fuentes públicas como The World Bank, OFAC (Oficina de Control de Activos Extranjeros de EE.UU.) y la base de datos de Offshore Leaks del ICIJ.
3.  **Un frontend moderno (React + Vite)** que proporciona una interfaz de usuario intuitiva para interactuar con el sistema.

## ✨ Características Principales

- **Búsqueda Agregada**: Busca una entidad en múltiples fuentes de datos con una sola llamada a la API.
- **Gestión de Proveedores**: Sistema CRUD (Crear, Leer, Actualizar, Borrar) completo para una base de datos de proveedores.
- **Autenticación Segura**:
    - **JWT (JSON Web Tokens)** para proteger los endpoints de gestión de datos (proveedores).
    - **API Key** para proteger y controlar el acceso a los endpoints de búsqueda, que consumen más recursos.
- **Control de Peticiones**: Implementa un límite de 20 peticiones por minuto (Rate Limiting) para evitar abusos.
- **Base de Datos Robusta**: Utiliza SQL Server para el almacenamiento persistente de datos de usuarios y proveedores.

## 🛠️ Stack Tecnológico

### Backend (`ComplianceCoreApi`)
- **Framework**: .NET 8 (ASP.NET Core Minimal APIs)
- **Acceso a Datos**: Dapper
- **Web Scraping**: Playwright, HtmlAgilityPack
- **Autenticación**: JWT Bearer Tokens
- **Base de Datos**: SQL Server

### Frontend (`ComplianceProUI` - *ajusta el nombre si es diferente*)
- **Framework**: React
- **Build Tool**: Vite
- **Lenguaje**: TypeScript/JavaScript

## 🚀 Getting Started

Sigue estos pasos para tener una copia del proyecto funcionando en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

- **.NET SDK 8.0** o superior.
- **Node.js y npm/yarn**.
- Una instancia de **SQL Server** (puede ser una instalación local, Express, o una instancia en Docker).
- Un editor de código como **Visual Studio Code**.

### Instalación y Configuración

1.  **Clona el repositorio**
    ```bash
    git clone https://github.com/Hyp3Boy/CompliancePro.git
    cd CompliancePro
    ```

2.  **Configuración de la Base de Datos**
    a. Abre tu gestor de SQL Server (como SSMS o Azure Data Studio).
    b. Crea una nueva base de datos. Por ejemplo: `ComplianceDb`.
    c. Ejecuta el script SQL que se encuentra en el repositorio para crear las tablas necesarias:
    ```
    sql_table_creation.sql
    ```

3.  **Configuración del Backend (`/ComplianceCoreApi`)**
    a. Navega a la carpeta del backend.
    b. **Crea un archivo de configuración local**: Copia el contenido de `appsettings.json` y pégalo en un nuevo archivo llamado `appsettings.Development.json`. **Este archivo no debe ser subido a Git.**
    c. **Edita `appsettings.Development.json`**:
        - **Cadena de Conexión**: Actualiza `ConnectionStrings.DefaultConnection` con los datos de tu base de datos SQL Server.
        - **API Key**: Cambia el valor de `ApiKey` por una clave secreta larga y aleatoria.
        - **Clave JWT**: Cambia el valor de `Jwt.Key` por otra clave secreta.
    
    ```json
    {
      //...
      "ApiKey": "...",
      "ConnectionStrings": {
        "DefaultConnection": "Server=SERVIDOR;Database=ComplianceDb;User Id=USUARIO;Password=CONTRASEÑA;TrustServerCertificate=True;"
      },
      "Jwt": {
        "Key": "...",
        //...
      }
    }
    ```

4.  **Configuración del Frontend (`/ComplianceProUI`)**
    a. Navega a la carpeta del frontend.
    b. **Crea un archivo de entorno**: Crea un archivo `.env.local` en la raíz de la carpeta del frontend.
    c. **Añade la URL de la API**: Dentro de `.env.local`, especifica la URL donde se está ejecutando tu backend.
    
    ```
    VITE_API_BASE_URL=http://localhost:5234
    ```

## ▶️ Ejecutando la Aplicación

Debes tener dos terminales abiertas, una para el backend y otra para el frontend.

1.  **Iniciar el Backend**
    ```bash
    # Navega a la carpeta del backend
    cd ComplianceCoreApi

    # Instala las dependencias de .NET
    dotnet restore

    # Ejecuta la aplicación
    dotnet run
    ```
    ✨ El backend estará disponible en `http://localhost:5234` (o el puerto que se indique en la terminal).

2.  **Iniciar el Frontend**
    ```bash
    # Navega a la carpeta del frontend
    cd ComplianceProUI

    # Instala las dependencias de Node
    npm install

    # Ejecuta el servidor de desarrollo
    npm run dev
    ```
    🚀 La aplicación de React estará disponible en `http://localhost:5173` (o el puerto que indique Vite). ¡Abre esta URL en tu navegador!

## 🔑 Endpoints de la API

La API está documentada con Swagger y se puede acceder en `http://localhost:5234/swagger` mientras el backend está en ejecución.

| Método | Endpoint                    | Seguridad          | Descripción                                        |
|--------|-----------------------------|--------------------|----------------------------------------------------|
| `POST` | `/api/auth/register`        | Pública            | Registra un nuevo usuario.                         |
| `POST` | `/api/auth/login`           | Pública            | Inicia sesión y devuelve un token JWT.             |
| `GET`  | `/api/search?entityName=`   | **API Key**        | Busca una entidad en todas las fuentes externas.   |
| `GET`  | `/api/proveedores`          | **JWT Bearer Token** | Obtiene la lista de todos los proveedores.         |
| `GET`  | `/api/proveedores/{id}`     | **JWT Bearer Token** | Obtiene un proveedor por su ID.                    |
| `POST` | `/api/proveedores`          | **JWT Bearer Token** | Crea un nuevo proveedor.                           |
| `PUT`  | `/api/proveedores/{id}`     | **JWT Bearer Token** | Actualiza un proveedor existente.                  |
| `DELETE`| `/api/proveedores/{id}`   | **JWT Bearer Token** | Elimina un proveedor.                              |
