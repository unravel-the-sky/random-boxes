const makeRandomLetter = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const getRandomLetter = () => {
    return makeRandomLetter(1);
}

const mouse = {
  x: 0,
  y: 0
}
let hueShift = 0;
let waveOffset = 0;

const updateElementsScale = () => {
  const maxDistance = 200; // threshold, change later
  const minScale = 1;
  const maxScale = 3;

  const minAngle = 0;
  const maxAngle = 0;

  const minBrightness = 0.9;   
  const maxBrightness = 1;   

  const elements = document.querySelectorAll('.el');
  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const elCenterX = rect.left + rect.width / 2;
    const elCenterY = rect.top + rect.height / 2;

    const distance = Math.hypot(mouse.x - elCenterX, mouse.y - elCenterY);

    const scaleFactor = Math.max(minScale, maxScale - (distance / maxDistance));

    const angleStrength = (maxAngle - minAngle) / maxDistance; 
    const angleFactor = Math.max(minAngle, Math.min(maxAngle, minAngle + (maxAngle - minAngle) * (1 - distance / maxDistance)));

    // Add some randomness or directionality
    const rotationDirection = (mouse.x < elCenterX) ? -1 : 1; 
    const finalAngle = angleFactor * rotationDirection;

    // const angleFactor = Math.max(minAngle, maxAngle - (distance / maxDistance));
    // console.log(angleFactor)

    const brightnessFactor = Math.max(minBrightness, maxBrightness - (distance / maxDistance) * (maxBrightness - minBrightness));

    const waveStrength = Math.max(5, 20 - (distance / maxDistance) * 20); // Stronger waves when closer
    const waveX = Math.sin((waveOffset + index) * 0.2) * waveStrength;
    const waveY = Math.cos((waveOffset + index) * 0.2) * waveStrength;
    
    el.style.transform = `scale(${scaleFactor}) rotate(${angleFactor}deg)`;
    el.style.filter = `brightness(${brightnessFactor})`;
    
    // const hue = (hueShift + index * 7) % 360;
    // el.style.backgroundColor = `hsl(${hue}, 100%, ${brightnessFactor}%)`
  });
}

const updateLetters = (elements) => {
  elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(mouse.x - elCenterX, mouse.y - elCenterY);

      // Only update letter if cursor is NOT near the center
      if (distance > 40) {
          el.textContent = makeRandomLetter(1);
      }
  });
};

window.onmousemove = (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  // console.log(`x: ${mouse.x} y: ${mouse.y}`)

  updateElementsScale();
}

window.onload = () => {
    const elementsHolder = document.getElementById('all-elements');
    const elements = []

    for (let i = 0; i < 500 ; i++) {
      const span = document.createElement('span');
      const randomChar = getRandomLetter(1);
      span.className = `el text_${randomChar}`
      const text = document.createTextNode(randomChar);
      span.appendChild(text);
      span.onclick = () => {
        span.style.visibility = 'hidden'
      }
      elements.push(span);
      elementsHolder.appendChild(span);
    }

    setInterval(() => {
      // updateLetters(elements)
      waveOffset += 0.1
    }, 100);
}