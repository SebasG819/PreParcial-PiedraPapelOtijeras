const socket = io.connect('http://localhost:5500/', { path: '/real-time' });

let victorias = 0;
let derrotas = 0;

let selection = 1;
let t = 5;
let enemyselection = 1;

const x = 100;
const y = 100; // Ajusta esta posición según necesites
const size = 500;

let paperp = {
    x: x,
    y: y,
    size: 120
};

let rockp = {
    x: x,
    y: y + 150,
    size: 120
};

let scissorsp = {
    x: x,
    y: y + 300,
    size: 120
};
function preload() {
    scissors = loadImage('./images/scissors.png');
    paper = loadImage('./images/paper.png');
    rock = loadImage('./images/rock.png');
   
}

function setup() {
    frameRate(60);
    createCanvas(windowWidth, windowHeight);
    fill(255); // Establecer el color del texto en blanco
    textFont('Helvetica');
    textStyle(BOLD); // Establecer el estilo del texto en negrita
}

function draw() {
    background(0);

    // Timer
    textSize(35);
    fill(255); // Texto blanco
    text("TIEMPO: " + t, 800, 40);

    if (frameCount % 60 == 0 && t > 0) {
        t--;
        socket.emit('send-time', t);
    }

    if (t > 0) {
        seleccion();
    }

    textSize(35);
    text("Victorias: " + victorias, x + 200, 40);
    text("Derrotas: " + derrotas, x + 200, 80);

  
    let selectedX = x + 200; // Ajuste de la posición en X para la imagen seleccionada
    let selectedY = y + 20; // Ajuste de la posición en Y para la imagen seleccionada
    let selectedSize = size - 20; // Tamaño reducido de la imagen seleccionada

    switch (selection) {
        case 0:
            image(rock, selectedX, selectedY, selectedSize, selectedSize);
            break;
        case 1:
            image(paper, selectedX, selectedY, selectedSize, selectedSize);
            break;
        case 2:
            image(scissors, selectedX, selectedY, selectedSize, selectedSize);
            break;
        default:
            image(paper, selectedX, selectedY, selectedSize, selectedSize);
            break;
    }


    image(rock, rockp.x, rockp.y, rockp.size, rockp.size);
    image(paper, paperp.x, paperp.y, paperp.size, paperp.size);
    image(scissors, scissorsp.x, scissorsp.y, scissorsp.size, scissorsp.size);

    // Other user
    textSize(35);
    text("Victorias: " + derrotas, 1350, 40);
    text("Derrotas: " + victorias, 1350, 80);

    let enemyY = 110; // Ajuste según necesites

    if (t === 0) {
        Definirganador();
        MandarDatos(selection);
    }

    switch (enemyselection) {
        case 0:
            translate(rock.width, 0); // Mueve el punto de origen al final de la imagen original
            scale(-1, 1);
            image(rock, -800, enemyY, size, size);
            break;
        case 1:
            translate(paper.width, 0); // Mueve el punto de origen al final de la imagen original
            scale(-1, 1);
            image(paper, -800, enemyY, size, size);
            break;
        case 2:
            translate(scissors.width, 0); // Mueve el punto de origen al final de la imagen original
            scale(-1, 1);
            image(scissors, -800, enemyY, size, size);
            break;
        default:
            translate(paper.width, 0); // Mueve el punto de origen al final de la imagen original
            scale(-1, 1);
            image(paper, -800, enemyY, size, size);
            break;
    }
}

function seleccion() {
    if (mouseX >= paperp.x && mouseX <= paperp.x + paperp.size && mouseY >= paperp.y && mouseY <= paperp.y + paperp.size) {
        cursor(HAND);
    } else if (mouseX >= rockp.x && mouseX <= rockp.x + rockp.size && mouseY >= rockp.y && mouseY <= rockp.y + rockp.size) {
        cursor(HAND);
    } else if (mouseX >= scissorsp.x && mouseX <= scissorsp.x + scissorsp.size && mouseY >= scissorsp.y && mouseY <= scissorsp.y + scissorsp.size) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }
}

function mouseClicked() {
    if (t > 0) {
        if (mouseX >= paperp.x && mouseX <= paperp.x + paperp.size && mouseY >= paperp.y && mouseY <= paperp.y + paperp.size) {
            selection = 1;
        } else if (mouseX >= rockp.x && mouseX <= rockp.x + rockp.size && mouseY >= rockp.y && mouseY <= rockp.y + rockp.size) {
            selection = 0;
        } else if (mouseX >= scissorsp.x && mouseX <= scissorsp.x + scissorsp.size && mouseY >= scissorsp.y && mouseY <= scissorsp.y + scissorsp.size) {
            selection = 2;
        }
    }
}

async function SendData(selection) {
    socket.emit('send-element2', selection);
    console.log("element 2 send", selection);

    let puntaje = {
        victorias,
        derrotas
    };

    socket.emit('send-point', puntaje);

    await (socket.on('element1-received', (selecc) => {
        console.log("received1-element:", selecc);
        enemyselection = selecc;
    }));

    t = 5;
}

function ChooseWin() {
    if ((selection === 1 && enemyselection === 0) || (selection === 0 && enemyselection === 2) || (selection === 2 && enemyselection === 1)) {
        victorias++;
    } else if ((selection === 0 && enemyselection === 1) || (selection === 2 && enemyselection === 0) || (selection === 1 && enemyselection === 2)) {
        derrotas++;
    }
}

socket.on('element2-received', (selecc) => {
    console.log("received2-element:", selecc);
    selection = selecc;
});

socket.on('time-received', (ti) => {
    console.log("received-time:", ti);
    t = ti;
});

socket.on('point-received', (p) => {
    console.log("point-elements:", p);
    victorias = p.derrotas;
    derrotas = p.victorias;
});
