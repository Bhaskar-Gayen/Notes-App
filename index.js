const submit = document.getElementById("submit");
const empty = document.querySelector("#remove");
const mainContainer = document.querySelector(".main-container");
const addNoteBtn = document.querySelector("#addNotes");
const notesContainer = document.querySelector(".notes-container");
const textContainer = document.querySelector(".containers");
let textareaValue = textContainer.querySelector("#note-text");

addNoteBtn.addEventListener("click", () => {
  textareaValue.value = "";
  textContainer.classList.toggle("none");
});

empty.addEventListener("click", (e) => {
  e.preventDefault();
  textareaValue.value = "";
});

function getRandomLightColor() {
  const threshold = 150;
  const red = Math.floor(Math.random() * (255 - threshold) + threshold);
  const green = Math.floor(Math.random() * (255 - threshold) + threshold);
  const blue = Math.floor(Math.random() * (255 - threshold) + threshold);
  const redDiff = 255 - red;
  const greenDiff = 255 - green;
  const blueDiff = 255 - blue;
  const lightRed = red + Math.floor(Math.random() * redDiff);
  const lightGreen = green + Math.floor(Math.random() * greenDiff);
  const lightBlue = blue + Math.floor(Math.random() * blueDiff);
  const color = `rgb(${lightRed}, ${lightGreen}, ${lightBlue})`;
  return color;
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  if (textareaValue.value != "") {
    fetch("http://localhost:3000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: textareaValue.value }),
    })
      .then((response) => response.json())
      .then((data) => {
        displayNote(data);
        textContainer.classList.toggle("none");
      })
      .catch((error) => {
        console.error("Error adding note:", error);
      });
  }
});

function displayNote(note) {
  const randomRotation = (Math.random() - 0.5) * 100;
  const color = getRandomLightColor();
  const noteElement = document.createElement("div");
  noteElement.classList.add("box-container");
  noteElement.style.transform = `rotate(${randomRotation}deg)`;
  noteElement.innerHTML = `
    <textarea disabled style="background-color:${color};">${note.content}</textarea>
    <button class="delete" data-id="${note._id}">x</button>
  `;
  notesContainer.appendChild(noteElement);
  noteElement.querySelector(".delete").addEventListener("click", deleteNote);
}

function deleteNote() {
  const noteId = this.getAttribute("data-id");
  fetch(`http://localhost:3000/delete/${noteId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      this.parentElement.remove();
    })
    .catch((error) => {
      console.error("Error deleting note:", error);
    });
}

function loadTasks() {
  fetch("http://localhost:3000/notes")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((note) => {
        displayNote(note);
      });
    })
    .catch((error) => {
      console.error("Error loading notes:", error);
    });
}

loadTasks();
