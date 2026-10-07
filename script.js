// ---------- Key map: keyboard letter -> note info ----------
const notes = {
  a: { name: "C",  solfege: "Do",  freq: 262 },
  s: { name: "D",  solfege: "Re",  freq: 294 },
  d: { name: "E",  solfege: "Mi",  freq: 330 },
  f: { name: "F",  solfege: "Fa",  freq: 349 },
  g: { name: "G",  solfege: "Sol", freq: 392 },
  h: { name: "A",  solfege: "La",  freq: 440 },
  j: { name: "B",  solfege: "Ti",  freq: 494 },
  k: { name: "C",  solfege: "Do",  freq: 523 },
  // Bonus: black keys (sharps)
  w: { name: "C#", solfege: "",    freq: 277 },
  e: { name: "D#", solfege: "",    freq: 311 },
  t: { name: "F#", solfege: "",    freq: 370 },
  y: { name: "G#", solfege: "",    freq: 415 },
  u: { name: "A#", solfege: "",    freq: 466 }
};

const waveSelect = document.querySelector("#wave");
const lastNote = document.querySelector("#last-note");

// ---------- Sound helper ----------
const ctx = new AudioContext();

function playNote(freq) {
  // Browsers keep audio paused until the user interacts with the page
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  osc.type = waveSelect.value;          // Bonus: sound selector
  osc.frequency.value = freq;
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

// ---------- Shared actions (used by keyboard AND mouse) ----------
function pressKey(letter) {
  const note = notes[letter];
  if (!note) return;                    // not a piano key: do nothing

  const keyElement = document.querySelector('[data-key="' + letter + '"]');
  if (!keyElement) return;

  keyElement.classList.add("active");
  playNote(note.freq);
  lastNote.textContent = note.solfege ? note.name + " (" + note.solfege + ")" : note.name;
}

function releaseKey(letter) {
  const keyElement = document.querySelector('[data-key="' + letter + '"]');
  if (keyElement) keyElement.classList.remove("active");
}

// ---------- Keyboard listeners (on document, so they work anywhere on the page) ----------
document.addEventListener("keydown", function (e) {
  console.log(e.key);                   // handy for testing in DevTools
  if (e.repeat) return;                 // ignore auto-repeat while holding a key
  if (e.ctrlKey || e.metaKey || e.altKey) return;  // leave shortcuts like Ctrl+R alone
  pressKey(e.key.toLowerCase());        // works with Caps Lock too
});

document.addEventListener("keyup", function (e) {
  releaseKey(e.key.toLowerCase());
});

// ---------- Bonus: mouse / touch support ----------
document.querySelectorAll(".key").forEach(function (keyElement) {
  const letter = keyElement.dataset.key;
  keyElement.addEventListener("mousedown", function () { pressKey(letter); });
  keyElement.addEventListener("mouseup", function () { releaseKey(letter); });
  keyElement.addEventListener("mouseleave", function () { releaseKey(letter); });
});

// Safety: if the window loses focus while a key is held, clear all lit keys
window.addEventListener("blur", function () {
  document.querySelectorAll(".key.active").forEach(function (k) {
    k.classList.remove("active");
  });
});
