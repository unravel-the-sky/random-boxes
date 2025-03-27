const makeRandomLetter = (length) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
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
let lastHoveredCol = -1;

const THRESHOLD = 20;

const highlightColumn = () => {
  const elements = document.querySelectorAll('.el');
  let colIndex = -1;

  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const elCenterX = rect.left + rect.width / 2;
    const elCenterY = rect.top + rect.height / 2;
    const distance = Math.hypot(mouse.x - elCenterX, mouse.y - elCenterY);

    if (distance < THRESHOLD) {
      colIndex = index % GRID_SIZE;
    }
  });

  if (colIndex !== -1 && colIndex !== lastHoveredCol) {
    if (lastHoveredCol !== -1) {
      for (let i = lastHoveredCol ; i < elements.length ; i += GRID_SIZE) {
        elements[i].style.backgroundColor = '';
      }
    }

    for (let i = colIndex ; i < elements.length ; i += GRID_SIZE) {
      // console.log('i shall be colored: ', colIndex)
      elements[i].style.backgroundColor = 'rgba(50, 50, 50)'
    }

    lastHoveredCol = colIndex;
  }
}

const updateLetters = (elements) => {
  elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(mouse.x - elCenterX, mouse.y - elCenterY);

      // Only update letter if cursor is NOT near the center
      if (distance > 40 && el.dataset.isfixed !== 'true') {
          el.textContent = makeRandomLetter(1);
      }
  });
};

const animateCharSize = (elements) => {
  let scaleDir = 1;

  elements.forEach(el => {
    let base = parseFloat(el.dataset.base) || 1;

    if (scaleDir === 1) {
      base += 0.05;
      if (base > 2) scaleDir = -1;
    } else {
      base -= 0.05;
      if (base < 1.2) scaleDir = 1;
    }

    el.dataset.base = base.toFixed(3);

    // console.log(base.toFixed(3))

    // el.style.transform = `scale(${base.toFixed(3)})`;
  })
  setInterval(() => {
  }, 250);
}

const mainHolder = document.getElementById('main');

let scale = 0.5;
const zoom = (event) => {
  event.preventDefault();

  scale += event.deltaY * -0.01;

  // Restrict scale
  scale = Math.min(Math.max(0.5, scale), 2);

  // Apply scale transform
  // mainHolder.style.transform = `scale(${scale})`;
  // mainHolder.animate({
  //   transform: `scale(${scale})`,
  //   opacity: scale - 0.5
  // }, { duration: 300, fill: 'forwards' })
}
document.onwheel = zoom;

const glowingCursor = document.getElementById('glowing-cursor')

window.onmousemove = (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  glowingCursor.style.left = `${mouse.x}px`
  glowingCursor.style.top = `${mouse.y + window.scrollY}px`

  // glowingCursor.animate({
  //   left: `${mouse.x}px`,
  //   top: `${mouse.y}px`
  // }, { duration: 1000, fill: 'forwards'})

  console.log(`x: ${mouse.x} y: ${mouse.y}`)

  updateElementsScale();
  // highlightColumn();
}

window.onscroll = (event) => {
  console.log(event)
}

const GRID_SIZE = 11; // 10x10 grid
const MESSAGE_ROWS = {
  2: "WELCOME",
  6: "TO",
  7: "MY",
  10: "GALLERY"
};

const elBbCache = [];

const updateElementsScale = () => {
  const maxDistance = 210; // threshold, change later
  const minScale = 1;
  const maxScale = 2;

  const elements = document.querySelectorAll('.el');
  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    // const rect = elBbCache[index] ? elBbCache[index] : el.getBoundingClientRect();
    const elCenterX = rect.left + rect.width / 2;
    const elCenterY = rect.top + rect.height / 2;

    const distance = Math.hypot(mouse.x - elCenterX, mouse.y - elCenterY) ; 

    // Cursor scaling effect
    const cursorScale = Math.max(minScale, maxScale - (distance / maxDistance) * (maxScale - minScale));

    // Get base animation scale
    const baseScale = parseFloat(el.dataset.baseScale) || 1;

    // Combine both effects
    // el.style.transform = `scale(${baseScale * cursorScale})`;
    el.style.transform = `translateX(+${baseScale * cursorScale * 10}px) translateZ(-${baseScale * cursorScale * 5}px)`;
    el.style.opacity = baseScale * cursorScale - 0.5;

    elBbCache[index] = rect;
  });
}

const element = document.getElementById("motion-demo");
let start;
const temp = { x: 0, y: 0 }

// function step(timestamp) {
//   if (start === undefined) {
//     start = timestamp;
//   }
//   const elapsed = timestamp - start;

//   // Math.min() is used here to make sure the element stops at exactly 200px
//   const rect = element.getBoundingClientRect();
//   temp.x = rect.x;
//   temp.y = rect.y;
//   updateElementsScale()
//   requestAnimationFrame(step);
// }

// requestAnimationFrame(step);

window.onload = () => {
    const elementsHolder = document.getElementById('all-elements');
    const elements = [];
    const totalCells = GRID_SIZE * GRID_SIZE;
    // const messageStartIndex = Math.floor((totalCells - MESSAGE.length) / 2); // Center the message

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
          const index = row * GRID_SIZE + col;
          const span = document.createElement('span');
          span.className = "el";
          
          if (MESSAGE_ROWS[row]) {
              const word = MESSAGE_ROWS[row];
              const startCol = Math.floor((GRID_SIZE - word.length) / 2); // Centering the word
              
              if (col >= startCol && col < startCol + word.length) {
                  span.textContent = word[col - startCol];
                  span.style.fontSize = "5rem"; // Larger font for message
                  span.style.fontWeight = "bold";
                  span.dataset.isfixed = 'true';
              } else {
                  span.textContent = getRandomLetter(1);
              }
          } else {
              span.textContent = getRandomLetter(1);
          }

          elementsHolder.appendChild(span);
          elements.push(span);
      }
  }


    // for (let i = 0; i < totalCells ; i++) {
    //   const span = document.createElement('span');
    //   const randomChar = getRandomLetter(1);
    //   span.className = `el text_${randomChar}`

    //   // Place the message in the grid
    //   if (i >= messageStartIndex && i < messageStartIndex + MESSAGE.length) {
    //       span.textContent = MESSAGE[i - messageStartIndex]; // Insert message letters
    //   } else {
    //       span.textContent = getRandomLetter(1); // Random letters elsewhere
    //   }

    //   // const text = document.createTextNode(randomChar);
    //   // span.appendChild(text);
    //   span.onclick = () => {
    //     span.style.visibility = 'hidden'
    //   }
    //   elements.push(span);
    //   elementsHolder.appendChild(span);
    // }

    setInterval(() => {
      // updateLetters(elements)
      // waveOffset += 0.1
      // highlightColumn(elements)
      // animateCharSize(elements);
    }, 200);
}






// const updateElementsScale = () => {
//   const maxDistance = 210; // threshold, change later
//   const minScale = 1;
//   const maxScale = 3;

//   const fontWeight = 200;

//   const minAngle = 0;
//   const maxAngle = 0;

//   const minBrightness = 0.95;   
//   const maxBrightness = 1;   

//   const elements = document.querySelectorAll('.el');
//   elements.forEach((el, index) => {
//     const rect = el.getBoundingClientRect();
//     const elCenterX = rect.left + rect.width / 2;
//     const elCenterY = rect.top + rect.height / 2;

//     const distance = Math.hypot(mouse.x - elCenterX, mouse.y - elCenterY) ; 

//     const scaleFactor = Math.max(minScale, maxScale - (distance / maxDistance));

//     const angleStrength = (maxAngle - minAngle) / maxDistance; 
//     const angleFactor = Math.max(minAngle, Math.min(maxAngle, minAngle + (maxAngle - minAngle) * (1 - distance / maxDistance)));

//     // Add some randomness or directionality
//     const rotationDirection = (mouse.x < elCenterX) ? -1 : 1; 
//     const finalAngle = angleFactor * rotationDirection;

//     // const angleFactor = Math.max(minAngle, maxAngle - (distance / maxDistance));
//     // console.log(angleFactor)

//     const brightnessFactor = Math.max(minBrightness, maxBrightness - (distance / maxDistance) * (maxBrightness - minBrightness));

//     const waveStrength = Math.max(5, 20 - (distance / maxDistance) * 20); // Stronger waves when closer
//     const waveX = Math.sin((waveOffset + index) * 0.2) * waveStrength;
//     const waveY = Math.cos((waveOffset + index) * 0.2) * waveStrength;

//     // Cursor scaling effect
//     const cursorScale = Math.max(minScale, maxScale - (distance / maxDistance) * (maxScale - minScale));

//     // Get base animation scale
//     const baseScale = parseFloat(el.dataset.baseScale) || 1;

//     const fontWeightVal = Math.round((fontWeight * cursorScale) % 100) * 10;
//     // console.log(fontWeightVal)

//     // el.style.fontWeight = fontWeightVal;

//     // Combine both effects
//     el.style.transform = `scale(${baseScale * cursorScale})`;
    
//     // el.style.transform = `scale(${scaleFactor}) rotate(${angleFactor}deg)`;
//     el.style.filter = `brightness(${brightnessFactor})`;
    
//     // const hue = (hueShift + index * 7) % 360;
//     // el.style.backgroundColor = `hsl(${hue}, 100%, ${brightnessFactor}%)`
//   });
// }