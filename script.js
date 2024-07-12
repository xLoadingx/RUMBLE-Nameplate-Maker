const canvas = new fabric.Canvas('nameplateCanvas');
const baseImageUrl = 'images/blankSlate.png';
const oculusImageUrl = 'images/Oculus.png';
const steamImageUrl = 'images/Steam.png';
let currentOverlayImage = oculusImageUrl;
let overlayImage;

const positions = [
    { left: 169, top: 27 },
    { left: 161, top: 134 },
    { left: 568, top: 128 }
];

const overlayPositions = {
    oculus: { left: 28, top: 39 },
    steam: { left: 31, top: 39 }
};

const fontSize = 106;
const overlayScale = 0.8;

fabric.Image.fromURL(baseImageUrl, (img) => {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
});

function drawText() {
    canvas.getObjects('text').forEach(obj => canvas.remove(obj));
    ['text1', 'text2', 'text3'].forEach((id, index) => {
        const text = document.getElementById(id).value;
        const position = positions[index];
        drawColoredText(text, position.left, position.top);
    });
}

function drawColoredText(text, x, y) {
    const colorRegex = /<#([0-9a-fA-F]{3,6})>/g;
    let segments = text.split(colorRegex);
    let defaultColor = '#32291E';
    let currentColor = defaultColor;

    segments.forEach((segment, index) => {
        if (index % 2 === 1) {
            currentColor = `#${segment}`;
        } else {
            if (segment) {
                const textObj = new fabric.Text(segment, {
                    left: x,
                    top: y,
                    fill: currentColor,
                    fontSize: fontSize,
                    fontFamily: 'Arial'
                });
                canvas.add(textObj);
                x += textObj.width;
            }
        }
    });
}

function toggleImage() {
    currentOverlayImage = (currentOverlayImage === oculusImageUrl) ? steamImageUrl : oculusImageUrl;
    loadOverlayImage();
}

function loadOverlayImage() {
    fabric.Image.fromURL(currentOverlayImage, (img) => {
        if (overlayImage) {
            canvas.remove(overlayImage);
        }
        overlayImage = img.set({
            scaleX: overlayScale,
            scaleY: overlayScale,
            left: overlayPositions[currentOverlayImage === oculusImageUrl ? 'oculus' : 'steam'].left,
            top: overlayPositions[currentOverlayImage === oculusImageUrl ? 'oculus' : 'steam'].top,
        });
        canvas.add(overlayImage);
        canvas.renderAll();
    });
}

document.getElementById('toggleButton').addEventListener('click', toggleImage);

document.querySelectorAll('.controls input').forEach(input => {
    input.addEventListener('input', drawText);
});

drawText();
loadOverlayImage();
