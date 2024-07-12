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
        const parsedText = parseColoredText(text);
        const textObj = new fabric.Text(parsedText.text, {
            left: position.left,
            top: position.top,
            fill: parsedText.color,
            fontSize: fontSize,
            fontFamily: 'Arial'
        });
        canvas.add(textObj);
    });
}

function parseColoredText(text) {
    const colorRegex = /<#([0-9a-fA-F]{3,6})>/g;
    let matches;
    let parsedText = '';
    let color = '#32291E'; // Default color
    while ((matches = colorRegex.exec(text)) !== null) {
        color = `#${matches[1]}`;
        parsedText += text.substring(colorRegex.lastIndex);
    }
    return { text: parsedText, color: color };
}

function toggleImage() {
    currentOverlayImage = (currentOverlayImage === oculusImageUrl) ? steamImageUrl : oculusImageUrl;
    loadOverlayImage();
}

function loadOverlayImage() {
    fabric.Image.fromURL(currentOverlayImage, (img) => {
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
