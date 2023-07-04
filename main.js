const pregunta = document.getElementById("pregunta");
const categoria = document.getElementById("categoria");
const opciones = document.querySelector(".opciones");
const respuestacorrectas = document.getElementById("respuestascorrectas");
const totalpregunta = document.getElementById("totalpreguntas");
const siguiente = document.getElementById("siguiente");
const jugar = document.getElementById("jugar");
const resultado = document.getElementById("resultado");

let respuestacorrecta = "";
let puntajecorrecto = 0;
let contadorpregunta = 0;

async function cargarpregunta() {
    const baseURL = "https://opentdb.com/api.php?amount=10";
    const resultados = await fetch(`${baseURL}`);
    const info = await resultados.json();
    resultado.innerHTML = "";
    mostrarpregunta(info.results[0]);
}

function eventListeners() {
    siguiente.addEventListener("click", revisarrespuesta);
    jugar.addEventListener("click", reiniciarjuego)
}

document.addEventListener("DOMContentLoaded", function () {
    cargarpregunta();
    eventListeners();
    totalpregunta.textContent = 10;
    respuestacorrectas.textContent = puntajecorrecto;

})

function mostrarpregunta(info) {
    siguiente.disabled = false;
    respuestacorrecta = info.correct_answer;
    let respuestaincorrecta = info.incorrect_answers;
    let listaopciones = respuestaincorrecta;
    listaopciones.splice(Math.floor(Math.random() * (respuestaincorrecta.length + 1)), 0, respuestacorrecta);
    pregunta.innerHTML = `${info.question}`
    categoria.innerHTML = `${info.category}`
    opciones.innerHTML = `${listaopciones.map((option, index) => `
    <li> ${index + 1}. <span>${option}</span> </li>
    `).join("")
        }`;
    seleccionaropcion();
}

function seleccionaropcion() {
    opciones.querySelectorAll("li").forEach(function (option) {
        option.addEventListener("click", function () {
            if (opciones.querySelector(".selected")) {
                const opcionseleccionada = opciones.querySelector(".selected");
                opcionseleccionada.classList.remove("selected");
            }
            option.classList.add("selected");
        });
    });
}

function revisarrespuesta() {
    siguiente.disabled = true;
    if (opciones.querySelector(".selected")) {
        let respuestaseleccionada = opciones.querySelector(".selected span").textContent;
        if (respuestaseleccionada == HTMLDecode(respuestacorrecta)) {
            puntajecorrecto++;
            resultado.innerHTML = `<p><i class = "fas fa-check"></i>Respuesta correcta</p>`;
        } else {
            resultado.innerHTML = `<p><i class = "fas fa-times"></i>Respuesta incorrecta</p>`;
        }
        revisarcontador();
    } else {
        resultado.innerHTML = `<p><i class = "fas fa-question"></i>Seleccione una opción</p>`;
        siguiente.disabled = false;
    }
}

function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function revisarcontador() {
    contadorpregunta++;
    contador();
    if (contadorpregunta == 10) {
        setTimeout(function () {
            console.log("");
        }, 5000);

        resultado.innerHTML += `<p>Tu calificación es ${puntajecorrecto}/10.</p>`;
        jugar.style.display = "block";
        siguiente.style.display = "none";
    } else {
        setTimeout(function () {
            cargarpregunta();
        }, 300);
    }
}

function contador() {
    totalpregunta.textContent = 10;
    respuestacorrectas.textContent = puntajecorrecto;
}

function reiniciarjuego() {
    puntajecorrecto = 0;
    contadorpregunta = 0;
    jugar.style.display = "none";
    siguiente.style.display = "block";
    siguiente.disabled = false;
    contador();
    cargarpregunta();
}
