// =========================
// IMPORTACIONES FIREBASE
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =========================
// CONFIGURACIÓN FIREBASE
// =========================

const firebaseConfig = {
    apiKey: "AIzaSyAN01-giSTPTeQfiK_LLXaeLB2SC4cWYSQ",
    authDomain: "sistemaaccesovehicular.firebaseapp.com",
    projectId: "sistemaaccesovehicular",
    storageBucket: "sistemaaccesovehicular.firebasestorage.app",
    messagingSenderId: "1094694092805",
    appId: "1:1094694092805:web:92f9e536cbfa484cb75c6c"
};

// =========================
// INICIALIZAR FIREBASE
// =========================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const vehiculos = collection(db, "vehiculos");

// =========================
// ELEMENTOS HTML
// =========================

const placa = document.getElementById("placa");
const propietario = document.getElementById("propietario");
const marca = document.getElementById("marca");
const tipo = document.getElementById("tipo");

const btnEntrada = document.getElementById("btnEntrada");
const btnSalida = document.getElementById("btnSalida");

const tabla = document.getElementById("tabla");
const buscar = document.getElementById("buscar");
const total = document.getElementById("total");

// =========================
// REGISTRAR
// =========================

btnEntrada.addEventListener("click", () => guardarRegistro("Entrada"));
btnSalida.addEventListener("click", () => guardarRegistro("Salida"));

async function guardarRegistro(accion) {

    if (
        placa.value.trim() === "" ||
        propietario.value.trim() === "" ||
        marca.value.trim() === ""
    ) {
        alert("Completa todos los campos.");
        return;
    }

    try {

        await addDoc(vehiculos, {

            placa: placa.value.toUpperCase(),

            propietario: propietario.value,

            marca: marca.value,

            tipo: tipo.value,

            accion: accion,

            fecha: new Date().toLocaleString(),

            timestamp: serverTimestamp()

        });

        placa.value = "";
        propietario.value = "";
        marca.value = "";
        tipo.selectedIndex = 0;

    } catch (error) {

        console.error(error);

        alert("Error al guardar.");

    }

}

// =========================
// MOSTRAR DATOS
// =========================

const consulta = query(
    vehiculos,
    orderBy("timestamp", "desc")
);

onSnapshot(consulta, (snapshot) => {

    tabla.innerHTML = "";

    total.textContent = snapshot.size;

    snapshot.forEach((docu) => {

        const datos = docu.data();

        tabla.innerHTML += `
        <tr>

        <td>${datos.placa}</td>

        <td>${datos.propietario}</td>

        <td>${datos.marca}</td>

        <td>${datos.tipo}</td>

        <td>${datos.fecha}</td>

        <td>${datos.accion}</td>

        <td>

        <button onclick="eliminarRegistro('${docu.id}')">
        Eliminar
        </button>

        </td>

        </tr>
        `;

    });

});

// =========================
// ELIMINAR
// =========================

window.eliminarRegistro = async function(id){

    if(confirm("¿Eliminar registro?")){

        await deleteDoc(doc(db,"vehiculos",id));

    }

}

// =========================
// BUSCADOR
// =========================

buscar.addEventListener("keyup", ()=>{

    const texto = buscar.value.toLowerCase();

    const filas = tabla.getElementsByTagName("tr");

    for(let fila of filas){

        const placa = fila.cells[0].textContent.toLowerCase();

        fila.style.display = placa.includes(texto) ? "" : "none";

    }

});

console.log("✅ Firebase conectado correctamente.");