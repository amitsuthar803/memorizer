"use strict";

// importin module
import { activeNotebook, makeElemEditable } from "./utils.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { Tooltip } from "./components/Tooltip.js";
import { NoteModal } from "./components/Modal.js";

const sidebar = document.querySelector("[data-sidebar]");
const sidebarTogglers = document.querySelectorAll("[data-sidebar-toggler]");
const overlay = document.querySelector("[data-sidebar-overlay]");

// toggling sidebar
sidebarTogglers.forEach((el) => {
  el.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
});

// showing tooltip
const tooltipElems = document.querySelectorAll("[data-tooltip]");
tooltipElems.forEach((el) => Tooltip(el));

const getGreetingMsg = function (currentHour) {
  const greeting =
    currentHour < 5
      ? "Night"
      : currentHour < 12
      ? "Morning"
      : currentHour < 15
      ? "Noon"
      : currentHour < 17
      ? "Afternoon"
      : currentHour < 20
      ? "Eveninng"
      : "Night";

  return `Good ${greeting}`;
};

// showing greeting above the time
const greetElem = document.querySelector("[data-greeting]");
const currentHour = new Date().getHours();

greetElem.textContent = getGreetingMsg(currentHour);

// showing current data on homePage
const currentDateElem = document.querySelector("[data-current-date]");
currentDateElem.textContent = new Date().toDateString().replace(" ", ", ");

//

// sidebar note list
const sidebarList = document.querySelector("[data-sidebar-list]");
const addNotebookBtn = document.querySelector("[data-add-notebook]");

const showNotebookField = function () {
  const navItem = document.createElement("div");
  navItem.classList.add("nav-item");

  navItem.innerHTML = `
  <span class="text text-label-large" data-notebook-field></span>
  <div class="state-layer"></div>
  `;

  sidebarList.appendChild(navItem);

  const navItemField = navItem.querySelector("[data-notebook-field]");

  // activate newly created notebook and remove active from last active element
  // adding active class to currently active nav item
  activeNotebook.call(navItem);

  // make notebook field content editable and focus
  makeElemEditable(navItemField);

  //   when use press Enter craete note
  navItemField.addEventListener("keydown", createNotebook);
};

addNotebookBtn.addEventListener("click", showNotebookField);

const createNotebook = function (event) {
  if (event.key === "Enter") {
    // store new created notebook in database
    //     this: navItemField
    const notebookData = db.post.notebook(this.textContent || "Untitled");
    this.parentElement.remove();

    // rendering the navItem
    client.notebook.create(notebookData);
  }
};

// render all existing notes from local storage
const renderExistedNotebook = function () {
  const notebookList = db.get.notebook();
  client.notebook.read(notebookList);
};

renderExistedNotebook();

// creating new Note
const noteCreateBtns = document.querySelectorAll("[data-note-create-btn]");

noteCreateBtns.forEach((el) => {
  el.addEventListener("click", function () {
    // create and open a new modal
    const modal = NoteModal();
    modal.open();

    // Handle the submission of the new note to the database and client.
    modal.onSubmit((noteObj) => {
      const activeNotebookId = document.querySelector("[data-notebook].active")
        .dataset.notebook;
      const noteData = db.post.note(activeNotebookId, noteObj);

      console.log(noteData);
      client.note.create(noteData);
      modal.close();
    });
  });
});

// renders existing notes in the active notebook. retrieves note data from the database based on the  active notebook's ID and uses the client to display the notes

const renderExistedNote = function () {
  const activeNotebookId = document.querySelector("[data-notebook].active")
    ?.dataset.notebook;

  if (activeNotebookId) {
    const noteList = db.get.note(activeNotebookId);
    // Display existing note
    client.note.read(noteList);
  }
};

renderExistedNote();
