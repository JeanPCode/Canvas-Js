//Seleccion a la Etiqueta Canvas y se le da un contexto 2D
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//Selecciona los botones como herramientas de opciones, para dibujar
const toolBtns = document.querySelectorAll(".tool");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");

//Variables predeterminadas para dibujar
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

//Variable para establecer el fondo del lienzo y el color inicial del pincel
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

//Variable para iniciar el dibujo
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; 
    prevMouseY = e.offsetY;
    ctx.beginPath(); 
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

//Variable para manejar el dibujo en tiempo real, dependiendo de la herramienta seleccionada
const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke(); 
    } else {
        drawTriangle(e);
    }
}

//Se crea evento para cambiar la herramienta selecciona  
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { 
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

//Se crea evento para ajustar el tamaño del pincel
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); 

//Se crea evento para los botones de color para cambiar el color predeterminado
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { 
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

//Se crea evento para cambiar el color predeterminado
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

//Por ultimo se crean eventos para manejar el inicio del dibujo, el dibujo y el fin del dibujo
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
