const API_KEY = '1586d02d6fe881149459f0651ca8e73b';
const difKelvin = 273.15;

// Barra de progreso
const barraProgreso = document.getElementById('barra');
function actualizarBarraProgreso() {
    const porcentajeProgreso = (climaActual.temperaturaMaxima / climaActual.temperaturaMinima) * 100;
    barraProgreso.style.width = `${porcentajeProgreso}%`;
}

// Modelado
const climaActual = {
    _nombre: null,
    _temperaturaMinima: '',
    _temperaturaMaxima: '',
    _temperaturaActual: 0,
    _descripcion: '',
    _viento: '',
    _chanceLluvia: '',
    _humedad: '',
    _unidadTemperatura: '°C',
    _unidadViento: 'm/s',

    // GETTERS Y SETTERS
    get nombre(){
        return this._nombre;
    },

    set nombre(name){
        this._nombre = name; 
    },

    get temperaturaMinima(){
        return this._temperaturaMinima;
    },

    set temperaturaMinima(newTemp){ // Recibe int
        this._temperaturaMinima = newTemp;
        document.getElementById("temperatura-mínima").innerHTML = newTemp + this._unidadTemperatura;
    },
    
    get temperaturaMaxima(){
        return this._temperaturaMinima;
    },

    set temperaturaMaxima(newTemp){ // Recibe int
        this._temperaturaMaxima = newTemp;
        document.getElementById("temperatura-máxima").innerHTML = newTemp + this._unidadTemperatura;
    },
    
    get temperaturaActual(){
        return this._temperaturaActual;
    },

    set temperaturaActual(newTemp){ // Recibe int
        this._temperaturaActual = newTemp;
        document.getElementById("temperatura-actual").innerHTML = newTemp + this._unidadTemperatura;
    },

    get descripcion(){
        return this._descripcion;
    },

    set descripcion(newDes){
        this._descripcion = newDes;
        document.getElementById("estado-clima").innerHTML = newDes;
    },

    set viento(newViento){ // Recibe int
        this._viento = newViento;
        document.getElementById("viento").innerHTML = newViento + this._unidadViento;
    },
    
    get viento(){
        return this._viento;
    },
    
    set chanceLluvia(newLluvia){ // Recibe int
        this._chanceLluvia = newLluvia;
        document.getElementById("chances-lluvia").innerHTML = newLluvia + '%';
    },
    
    get chanceLluvia(){
        return this._chanceLluvia;
    },
    
    set humedad(newHumedad){ // Recibe int
        this._humedad = newHumedad;
        document.getElementById("humedad").innerHTML = newHumedad + '%';
    },

    get humedad(){
        return this._humedad;
    },

    get unidadTemperatura(){
        return this._unidadTemperatura;
    },
    
    set imagen(nueva){
        const imagen = document.getElementById("foto-clima");
        imagen.src = `https://openweathermap.org/img/wn/${nueva}@2x.png`;
        imagen.style.display = 'block';
    },
    


    actualizarUnidadAF(){
        if(this._unidadTemperatura == '°C'){
            this._unidadTemperatura = '°F';
            if(this._temperaturaActual == 0){
                this.temperaturaMinima = this._temperaturaMinima;
                this.temperaturaMaxima = this._temperaturaMaxima;
                this.temperaturaActual = this._temperaturaActual;
            }else{
                this.temperaturaMinima = Math.round((this._temperaturaMinima * (9/5)) + 32)
                this.temperaturaMaxima = Math.round((this._temperaturaMaxima * (9/5)) + 32)
                this.temperaturaActual = Math.round((this._temperaturaActual * (9/5)) + 32)
                this.viento = this._viento;
            }
        }
    },
    
    actualizarUnidadAC(){
        if(this._unidadTemperatura == '°F'){
            this._unidadTemperatura = '°C';
            if(this._temperaturaActual == 0){
                this.temperaturaMinima = this._temperaturaMinima;
                this.temperaturaMaxima = this._temperaturaMaxima;
                this.temperaturaActual = this._temperaturaActual;
            }else{
                this.temperaturaMinima = Math.round((this._temperaturaMinima - 32) * 5/9)
                this.temperaturaMaxima = Math.round((this._temperaturaMaxima - 32) * 5/9)
                this.temperaturaActual = Math.round((this._temperaturaActual - 32) * 5/9)
                this.viento = this._viento;
            }
            
        }
    }
}

// ESCUCHAR BUSQUEDA
const botonBusqueda = document.getElementById("boton-buscar");
botonBusqueda.addEventListener("click", function(){
    const ciudad = document.getElementById("buscador-ciudad").value;
    if(ciudad){
        fetchweather(ciudad); 
    }
    else{
        alert("Ingrese una ciudad válida");
    }

});

// API
function fetchweather(city){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    .then(data => data.json())
    .then(data => mostrarClima(data));
}

function mostrarClima(data){
    climaActual.nombre = data.name + ", " + data.sys.country;
    if(climaActual.unidadTemperatura == '°F'){
        climaActual.temperaturaMinima = Math.round((data.main.temp_min - difKelvin) * (9/5) + 32);
        climaActual.temperaturaMaxima = Math.round((data.main.temp_max - difKelvin) * (9/5) + 32);
        climaActual.temperaturaActual = Math.round((data.main.temp - difKelvin) * (9/5) + 32);
    }else{
        climaActual.temperaturaMinima = Math.round(data.main.temp_min - difKelvin);
        climaActual.temperaturaMaxima = Math.round(data.main.temp_max - difKelvin);
        climaActual.temperaturaActual = Math.round(data.main.temp - difKelvin);
    }
    climaActual.descripcion = (data.weather[0].description).charAt(0).toUpperCase() + (data.weather[0].description).slice(1);
    climaActual.viento = Math.round(data.wind.speed);
    climaActual.chanceLluvia = Math.round(data.clouds.all);
    climaActual.humedad = Math.round(data.main.humidity);
    climaActual.imagen = data.weather[0].icon;
    actualizarBarraProgreso();
}


// ESCUCHAR CAMBIO DE UNIDAD
const cambioC = document.getElementById("boton-unidad-temperatura-C");
cambioC.addEventListener("click", function(){
    climaActual.actualizarUnidadAC();
});

const cambioF = document.getElementById("boton-unidad-temperatura-F");
cambioF.addEventListener("click", function(){
    climaActual.actualizarUnidadAF();
});