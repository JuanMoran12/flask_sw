from flask import Flask, render_template, jsonify, request
import requests
import json
import imagenes
import random

class inicio:

    def personajes():
        nombres = ["luke skywalker", "yoda", "obi-wan", "anakin skywalker", "dooku", "han solo", "Leia Organa", "Owen Lars", "R2-D2", "C-3PO"]
        people = []

        while len(people) <= 5:
            nom = random.choice(nombres)
            if nom not in people:
                people.append(nom.capitalize())      

        return people
    
    def movies():
        nombres = ["The Empire Strikes Back", "The Phantom Menace", "Attack of the Clones", "Return of the Jedi", "Revenge of the Sith", "A new Hope"]
        pelis = []

        while len(pelis) <= 5:
            nom = random.choice(nombres)
            if nom not in pelis:
                pelis.append(nom)

        return pelis
    
    def naves():
        nombres = ["Death Start", "Millenium Falcom", "Sentinel-class landing craft", "CR90 corvette", "Star Destroyer", "Y-wing", "X-wing", "TIE Advanced x1"]
        pelis = []

        while len(pelis) <= 5:
            nom = random.choice(nombres)
            if nom not in pelis:
                pelis.append(nom)

        return pelis
    
    def planetas():
        nombres = ["Alderaan", "Yavin IV", "Tatooine", "Hoth", "Dagobah", "Endor", "Naboo", "Bespin", "Kamino"]
        pelis = []

        while len(pelis) <= 5:
            nom = random.choice(nombres)
            if nom not in pelis:
                pelis.append(nom)

        return pelis
    
    def especies():
        nombres = ["Human", "Droid", "Wookie", "Yoda's species", "Rodian", "Ewok", "Hutt", "Sullustan"]
        especie = []

        while len(especie) <= 5:
            nom = random.choice(nombres)
            if nom not in especie:
                especie.append(nom)

        return especie

aplicacion = Flask(__name__)
IMAGENES = imagenes
API = "https://www.swapi.tech/api/"

@aplicacion.route("/")
def buscador():
    identificador = 1
    return render_template("home.html", identificador=identificador, gente=inicio.personajes(), movies=inicio.movies(), naves=inicio.naves(), planetas=inicio.planetas(), especies=inicio.especies())

@aplicacion.get("/api/personaje/")
def get_personajes_json():
    nombre_personaje = request.args.get("name") 
    print('dato recibido',nombre_personaje)

    if not nombre_personaje:
        return jsonify({"success": False, "error": "Falta el nombre del personaje"}), 400

    peticion = f'{API}people/?name={nombre_personaje}'
    respuesta = requests.get(url=peticion)

    if respuesta.status_code == 200:
        datos = respuesta.json()
        if datos.get("result"):
            lista = datos["result"][0]
            rs = {
                'Name': lista['properties']['name'],
                'Gender': lista['properties']['gender'],
                'Skin color': lista['properties']['skin_color'],
                'Hair color': lista['properties']['hair_color'],
                'height': lista['properties']['height'],
                'Eyes color': lista['properties']['eye_color'],
                'Birth year': lista['properties']['birth_year']
            }

            """imagen_url = ""
            if rs["nombre"].lower() in imagenes.personajes:
                imagen_url = imagenes.personajes[rs["nombre"].lower()]"""

            return jsonify({"success": True, "datos": rs})
        else:
            return jsonify({"success": False, "error": "Personaje no encontrado"}), 404
    else:
        return jsonify({"success": False, "error": f"Error al consultar la API externa: {respuesta.status_code}"}), respuesta.status_code

@aplicacion.route("/personajes", methods=['POST', "GET"])
def personajes():
    data = inicio.personajes()
    colores = ["sith" ,"jedi", "normal", 'rose']

    datos = []

    for valor in data:
        a = random.choice(colores)
        par = (valor, a)
        datos.append(par)
    return render_template('personajes.html', datos=data)

@aplicacion.get('/api/pelicula/')
def consultar_pelis():
    entrada = request.args.get("titulo")

    peticion = f'{API}films/?title={entrada}'
    respuesta = requests.get(url=peticion)

    if respuesta.status_code == 200:
        datos = respuesta.json()
        clave = datos.get('result')
        valor = clave[0]['properties']

        rs = {
            'title' : valor['title'],
            'director' : valor['director'],
            'productor' : valor['producer'],
            'release date' : valor['release_date'],
            'episode' : valor['episode_id']
        }

        premisa = valor['opening_crawl']

        return jsonify({'success' : True , 'datos' : rs, 'premisa' : premisa})
    else:
        return jsonify({"success": False, "error": f"Error al consultar la API externa: {respuesta.status_code}"}), respuesta.status_code


@aplicacion.route('/peliculas', methods=['POST', "GET"])
def peliculas():
    data = inicio.movies()
    colores = ["sith" ,"jedi", "normal", 'rose']

    datos = []

    for valor in data:
        a = random.choice(colores)
        par = (valor, a)
        datos.append(par)

    return render_template('peliculas.html', datos=data)

@aplicacion.get('/api/planets/')
def consultar_planetas():
    entrada = request.args.get("planeta")

    peticion = f'{API}planets/?name={entrada}'
    respuesta = requests.get(url=peticion) 

    if respuesta.status_code == 200:
        datos = respuesta.json()
        if datos.get("result"):
            lista = datos["result"][0]['properties']
            
            rs = {
                'Climate' : lista['climate'],
                'Name' : lista['name'],
                'Diameter' : lista['diameter'],
                'Rotation period' : lista['rotation_period'],
                'Terrain' : lista['terrain'],
                'Gravity' : lista['gravity'],
                'Population' : lista['population']
            }
            print(rs)

        return jsonify({'success' : True, 'datos' : rs})
    else:
        return jsonify({"success": False, "error": f"Error al consultar la API externa: {respuesta.status_code}"}), respuesta.status_code    
   
@aplicacion.route('/planetas', methods=['POST', "GET"])
def planetas():
    data = inicio.planetas()
    colores = ["sith" ,"jedi", "normal", 'rose']

    datos = []

    for valor in data:
        a = random.choice(colores)
        par = (valor, a)
        datos.append(par)
    return render_template('planetas.html', datos=data)

@aplicacion.get('/api/naves/')
def consultar_naves():
    entrada = request.args.get("nave")

    peticion = f'{API}starships?name={entrada}'
    respuesta = requests.get(url=peticion) 

    if respuesta.status_code == 200:
        datos = respuesta.json()
        if datos.get("result"):
            lista = datos["result"][0]
            res = lista['properties']
            
            rs = {
                'Name' : res['name'],
                'Cargo capacity' : res['cargo_capacity'],
                'Length' : res['length'],
                'Model' : res['model'],
                'Cost in credits' : res['cost_in_credits'],
                'Passegers' : res['passengers']
            }

        return jsonify({'success' : True, 'datos' : rs})
    else:
        return jsonify({"success": False, "error": f"Error al consultar la API externa: {respuesta.status_code}"}), respuesta.status_code    

@aplicacion.route('/starships')
def naves():
    data = inicio.naves()
    colores = ["sith" ,"jedi", "normal", 'rose']

    datos = []

    for valor in data:
        a = random.choice(colores)
        par = (valor, a)
        datos.append(par)

    return render_template('naves.html', datos=data)

@aplicacion.get('/api/especies/')
def consultar_especie():
    entrada = request.args.get("nombre")


    peticion = f'{API}species?name={entrada}'
    respuesta = requests.get(url=peticion) 

    if respuesta.status_code == 200:
        datos = respuesta.json()
        if datos.get("result"):
            lista = datos["result"][0]
            res = lista['properties']
            
            rs = {
                'Nome' : res['name'],
                'Eyes Color' : res['eye_colors'],
                'Skin Colors' : res['skin_colors'],
                'Lenguages' : res['language'],
                'Hair color' : res['hair_colors'],
                'Average height' : res['average_height'],
                'Average lifespan' : res['average_lifespan'],
                'clasification' : res['classification']
            }

        return jsonify({'success' : True, 'datos' : rs})
    else:
        return jsonify({"success": False, "error": f"Error al consultar la API externa: {respuesta.status_code}"}), respuesta.status_code    

@aplicacion.route('/especies')
def especies():
    data = inicio.especies()
    colores = ["sith" ,"jedi", "normal", 'rose']

    datos = []

    for valor in data:
        a = random.choice(colores)
        par = (valor, a)
        datos.append(par)
    return render_template('especies.html', datos=data)

if __name__ == "__main__":
    aplicacion.run(debug=True, host='0.0.0.0')

    
