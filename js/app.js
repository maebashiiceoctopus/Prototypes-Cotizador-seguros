//variables

//constructores

function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.anio = year;
    this.tipo = tipo;
}

function UI() {}

//llenar los años usando un prototype

UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
        min = max - 20;

    const selectYear = document.querySelector("#year");

    for (let i = max; i > min; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
};

//prototype seguro para cotizar datos
Seguro.prototype.cotizarSeguro = function() {
        /*
             1 = americano 1.15
             2 = asiatico 1.05
             3 = europeo 1.35
        */
        let cantidad;
        const base = 2000;

        switch (this.marca) {
            case '1':
                cantidad = base * 1.15;
                break;
            case '2':
                cantidad = base * 1.05;
                break;
            case '3':
                cantidad = base * 1.35;
                break;
            default:
                break;
        }

        // Leer el año
        const diferencia = new Date().getFullYear() - this.anio;
        // Cada año de diferencia hay que reducir 3% el valor del seguro
        cantidad -= ((diferencia * 3) * cantidad) / 100;
        /*
             Si el seguro es básico se múltiplica por 30% mas
             Si el seguro es completo 50% mas
        */
        if (this.tipo === 'basico') {
            cantidad *= 1.30;
        } else {
            cantidad *= 1.50;
        }

        return cantidad;

    }
    //prototype mostrar alertas en pantalla

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement("div");

    if (tipo === "error") {
        div.classList.add("mensaje", "error");
    } else {
        div.classList.add("mensaje", "correcto");
    }
    div.classList.add("mensaje", "mt-10");
    div.textContent = mensaje;
    //insertar en html
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector("#resultado"));

    setTimeout(() => {
        div.remove();
    }, 3000);
};

//

UI.prototype.mostrarResultado = (seguro, total) => {
    const { marca, anio, tipo } = seguro;

    let textoMarca;
    //crear resultado
    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;


        default:
            break;

    }
    const div = document.createElement("div");
    div.classList.add("mt-10");
    div.innerHTML = `
<p class="header"> Tu resumen</p>
<p class="font-bold">Marca : <span class="font-normal">${textoMarca}</span> </p>
<p class="font-bold">Año : <span class="font-normal"> ${anio}</span> </p>
<p class="font-bold">Tipo : <span class="font-normal"> ${tipo}</span> </p>
<p class="font-bold">Total : <span class="font-normal">$ ${total}</span> </p>
`;
    const resultadoDiv = document.querySelector("#resultado");


    //mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000)

}

//instanciar ui
const ui = new UI();
console.log(ui);

document.addEventListener("DOMContentLoaded", () => {
    ui.llenarOpciones(); //llenar select con los años
});

// validar campos
eventListeners();

function eventListeners() {
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();
    //leer marca seleccionada
    const marca = document.querySelector("#marca").value;

    //leer año seleccionado
    const year = document.querySelector("#year").value;

    //leer tipo cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === "" || year === "" || tipo === "") {
        ui.mostrarMensaje("Todos los campos son obligarotios", "error");
        return;
    }

    ui.mostrarMensaje("Cotizando...", "exito");
    //ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if (resultados != null) {
        resultados.remove();
    }

    //instanciar el seguro

    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //utilizar el prototype que va a cotizar

    ui.mostrarResultado(seguro, total);
}