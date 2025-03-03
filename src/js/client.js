"use strict";

import { NavItem } from "./components/NavItem.js";
import { activeNotebook } from "./utils.js";
import { Card } from "./components/Card.js";

const sidebarList = document.querySelector("[data-sidebar-list]");
const notePanelTitle = document.querySelector("[data-note-panel-title]");
const notePanel = document.querySelector("[data-note-panel]");
const noteCreateBtns = document.querySelectorAll("[data-note-create-btn]");
const emptyNotesTemplate = `
<div class="empty-notes">
        <span class="material-symbols-rounded" aria-hidden="true"
          >note_stack</span
        >
        <div class="text-headline-small">No notes</div>
      </div>
`;

const disableNoteCreateBtns = function (isThereAnyNotebooks) {
  noteCreateBtns.forEach((item) => {
    item[isThereAnyNotebooks ? "removeAttribute" : "setAttribute"](
      "disabled",
      ""
    );
  });
};

export const client = {
  notebook: {
    create(notebookData) {
      const navItem = NavItem(notebookData.id, notebookData.name);
      sidebarList.appendChild(navItem);
      activeNotebook.call(navItem);
      notePanelTitle.textContent = notebookData.name;
      notePanel.innerHTML = emptyNotesTemplate;
      disableNoteCreateBtns(true);
    },
    // read and display list of all notebook in UI
    read(notebookList) {
      disableNoteCreateBtns(notebookList.length);
      notebookList.forEach((notebookData, index) => {
        const navItem = NavItem(notebookData.id, notebookData.name);

        if (index === 0) {
          activeNotebook.call(navItem);
          notePanelTitle.textContent = notebookData.name;
        }
        sidebarList.appendChild(navItem);
      });
    },

    // read and display list of all notebook in UI
    update(notebookId, notebookData) {
      const oldNotebook = document.querySelector(
        `[data-notebook="${notebookId}"`
      );
      const newNotebook = NavItem(notebookData.id, notebookData.name);
      notePanelTitle.textContent = notebookData.name;
      sidebarList.replaceChild(newNotebook, oldNotebook);
      activeNotebook.call(newNotebook);
    },
    // delete a notebook from UI
    delete(notebookId) {
      const deletedNotebook = document.querySelector(
        `[data-notebook="${notebookId}"]`
      );
      const activeNavItem =
        deletedNotebook.nextElementSibling ??
        deletedNotebook.previousElementSibling;

      if (activeNavItem) {
        activeNavItem.click();
      } else {
        notePanelTitle.innerHTML = "";
        notePanel.innerHTML = "";
        disableNoteCreateBtns(false);
      }

      deletedNotebook.remove();
    },
  },
  // create a new note card in the UI and update the UI
  note: {
    create(noteData) {
      // clear emptynotes template from notepanel if their any note exist

      if (!notePanel.querySelector("[data-note]")) notePanel.innerHTML = "";

      const card = Card(noteData);
      notePanel.prepend(card);
    },
    read(noteList) {
      if (noteList.length) {
        notePanel.innerHTML = "";

        noteList.forEach((noteData) => {
          const card = Card(noteData);
          notePanel.appendChild(card);
        });
      } else {
        notePanel.innerHTML = emptyNotesTemplate;
      }
    },

    // Updates a note card in the UI based on provided note data.
    update(noteId, noteData) {
      const oldCard = document.querySelector(`[data-note="${noteId}"]`);

      const newCard = Card(noteData);
      notePanel.replaceChild(newCard, oldCard);
    },

    // deletes a note card from the UI
    delete(noteId, isNoteExists) {
      document.querySelector(`[data-note="${noteId}"]`).remove();

      if (!isNoteExists) notePanel.innerHTML = emptyNotesTemplate;
    },
  },
};
