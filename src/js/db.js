"use strict";

import {
  findNote,
  findNotebook,
  findNotebookIndex,
  findNoteIndex,
  generateID,
} from "./utils.js";

// local database
//  initialize the local database, if the data exist in local storagem it is loaded
// otherwisem, a new empty database is created and stored

let notekeeperDB = {};

const initDB = function () {
  const db = localStorage.getItem("notekeeperDB");

  if (db) {
    notekeeperDB = JSON.parse(db);
  } else {
    notekeeperDB.notebooks = [];
    localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
    console.log("New database created and stored:", notekeeperDB);
  }
};

initDB();

// raed and loads the localstorage data into global variable
const readDB = function () {
  notekeeperDB = JSON.parse(localStorage.getItem("notekeeperDB"));
};

// writes the current state of the global variable 'notekeeper' to local storage
const writeDB = function () {
  localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
};

export const db = {
  post: {
    notebook(name) {
      readDB();
      const notebookData = {
        id: generateID(),
        name,
        notes: [],
      };

      notekeeperDB.notebooks.push(notebookData);
      writeDB();
      return notebookData;
    },
    // add a new note to a specific notebook based on id in the database
    note(notebookId, object) {
      readDB();
      const notebook = findNotebook(notekeeperDB, notebookId);

      const noteData = {
        id: generateID(),
        notebookId,
        ...object,
        postedOn: new Date().getTime(),
      };
      notebook.notes.unshift(noteData);
      writeDB();

      return noteData;
    },
  },

  get: {
    notebook() {
      readDB();

      return notekeeperDB.notebooks;
    },

    note(notebookId) {
      readDB();
      const notebook = findNotebook(notekeeperDB, notebookId);
      return notebook.notes;
    },
  },

  update: {
    notebook(notebookId, name) {
      readDB();
      const notebook = findNotebook(notekeeperDB, notebookId);
      notebook.name = name;
      writeDB();

      return notebook;
    },

    // update the content of a note in the database
    note(noteId, object) {
      readDB();

      const oldNote = findNote(notekeeperDB, noteId);
      const newNote = Object.assign(oldNote, object);
      writeDB();

      return newNote;
    },
  },

  delete: {
    notebook(notebookId) {
      readDB();
      const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
      notekeeperDB.notebooks.splice(notebookIndex, 1);
      writeDB();
    },
    // delete a note from a specific notebook in the database.
    note(notebookId, noteId) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);
      const noteIndex = findNoteIndex(notebook, noteId);

      notebook.notes.splice(noteIndex, 1);

      writeDB();

      return notebook.notes;
    },
  },
};
