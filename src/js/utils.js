"use strict";

const addEventOnElements = function (elements, eventType, callback) {
  elements.forEach((element) => element.addEventListener(eventType, callback));
};

let lastActiveNavItem;

const activeNotebook = function () {
  lastActiveNavItem?.classList.remove("active");
  //   this points to navItem
  this.classList.add("active");
  lastActiveNavItem = this;
};

const makeElemEditable = function (element) {
  element.setAttribute("contenteditable", true);
  element.focus();
};

const findNotebook = function (db, notebookId) {
  // find notebook by id
  return db.notebooks.find((notebook) => notebook.id === notebookId);
};

const findNotebookIndex = function (db, notebookId) {
  return db.notebooks.findIndex((item) => item.id === notebookId);
};

const generateID = function () {
  return new Date().getTime().toString();
};

// convert time to human readable string
const getRelativeTime = function (milliseconds) {
  const currentTime = new Date().getTime();
  const minute = Math.floor((currentTime - milliseconds) / 1000 / 60);

  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);

  return minute < 1
    ? "Just now"
    : minute < 60
    ? `${minute} min ago`
    : hour < 24
    ? `${hour} hour ago`
    : `${day} day ago`;
};

// finds a specific note by its ID within a database of notebooks and their notes.
const findNote = (db, noteId) => {
  let note;
  for (const notebook of db.notebooks) {
    note = notebook.notes.find((note) => note.id === noteId);

    if (note) break;
  }
  return note;
};

const findNoteIndex = function (notebook, noteId) {
  return notebook.notes.findIndex((note) => note.id === noteId);
};

export {
  addEventOnElements,
  activeNotebook,
  makeElemEditable,
  findNotebook,
  findNotebookIndex,
  generateID,
  getRelativeTime,
  findNote,
  findNoteIndex,
};
