# Usa una imagen base de Python. Elige la versión que uses para tu proyecto.
# Alpine es una versión ligera, ideal para contenedores.
FROM python:3.9-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de requerimientos e instala las dependencias de Python
# Esto se hace primero para aprovechar el cache de Docker si tus dependencias no cambian.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el contenido de tu proyecto al directorio de trabajo en el contenedor
# Esto incluye tus archivos de Python, plantillas Jinja, estáticos, etc.
COPY . .

# Expone el puerto en el que Flask escuchará. Por defecto, Flask usa el puerto 5000.
EXPOSE 5000

# Define la variable de entorno para Flask. Asegúrate de que FLASK_APP apunte a tu archivo principal.
ENV FLASK_APP=star.py

# Comando para ejecutar la aplicación Flask.
# Usar gunicorn es una buena práctica para producción en lugar de flask run directamente.
# Si no lo tienes, puedes instalarlo en requirements.txt y usar "gunicorn --bind 0.0.0.0:5000 app:app" (si tu app está en 'app.py' y la instancia de Flask se llama 'app')
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "star:aplicacion"]
