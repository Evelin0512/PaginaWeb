// Reemplaza este objeto con tu configuración de Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyAN01-giSTPTeQfiK_LLXaeLB2SC4cWYSQ",
  authDomain: "sistemaaccesovehicular.firebaseapp.com",
  projectId: "sistemaaccesovehicular",
  storageBucket: "sistemaaccesovehicular.firebasestorage.app",
  messagingSenderId: "1094694092805",
  appId: "1:1094694092805:web:92f9e536cbfa484cb75c6c"
};

console.log("Firebase configurado correctamente");

// Aquí irá la lógica de Firestore.
// Este proyecto es la estructura base para continuar la integración.
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
// REGISTRAR ENTRADA
// =========================

btnEntrada.addEventListener("click", async () => {

    if (
        placa.value.trim() === "" ||
        propietario.value.trim() === "" ||
        marca.value.trim() === ""
    ) {

        alert("Completa todos los campos.");

        return;

    }

    await guardarRegistro("Entrada");

});


// =========================
// REGISTRAR SALIDA
// =========================

btnSalida.addEventListener("click", async () => {

    if (
        placa.value.trim() === "" ||
        propietario.value.trim() === "" ||
        marca.value.trim() === ""
    ) {

        alert("Completa todos los campos.");

        return;

    }

    await guardarRegistro("Salida");

});

// =========================
// GUARDAR REGISTRO
// =========================

async function guardarRegistro(accion) {

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

    }

    catch (error) {

        console.error(error);

        alert("Error al guardar el registro.");

    }

}


// =========================
// CARGAR REGISTROS
// =========================

const consulta = query(
    vehiculos,
    orderBy("timestamp", "desc")
);

onSnapshot(consulta, (snapshot) => {

    tabla.innerHTML = "";

    let contador = 0;

    snapshot.forEach((documento) => {

        contador++;

        const datos = documento.data();

        tabla.innerHTML += `

        <tr>

            <td>${datos.placa}</td>

            <td>${datos.propietario}</td>

            <td>${datos.marca}</td>

            <td>${datos.tipo}</td>

            <td>${datos.fecha}</td>

            <td>${datos.accion}</td>

            <td>

                <button
                    class="eliminar"
                    onclick="eliminarRegistro('${documento.id}')">

                    Eliminar

                </button>

            </td>

        </tr>

        `;

    });

    total.textContent = contador;

});

// =========================
// ELIMINAR REGISTRO
// =========================

window.eliminarRegistro = async function(id) {

    const confirmar = confirm("¿Deseas eliminar este registro?");

    if (!confirmar) return;

    try {

        await deleteDoc(doc(db, "vehiculos", id));

    } catch (error) {

        console.error(error);

        alert("No se pudo eliminar el registro.");

    }

};


// =========================
// BUSCAR POR PLACA
// =========================

buscar.addEventListener("keyup", () => {

    const texto = buscar.value.toLowerCase();

    const filas = tabla.getElementsByTagName("tr");

    for (let fila of filas) {

        const placa = fila.cells[0].textContent.toLowerCase();

        if (placa.includes(texto)) {

            fila.style.display = "";

        } else {

            fila.style.display = "none";

        }

    }

});


// =========================
// FIREBASE CONECTADO
// =========================

console.log("✅ Sistema conectado con Firebase correctamente.");