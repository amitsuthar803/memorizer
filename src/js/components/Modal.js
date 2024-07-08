"use strict";

const overlay = document.createElement("div");
overlay.classList.add("overlay", "modal-overlay");

// create and manage modal for adding or editing notes.  this allow user to input a note's title and text. and provide functionality to submit and save the note.
const NoteModal = function (
  title = "Untitled",
  text = "Add your note...",
  time = ""
) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <button class="icon-btn large" aria-label="Close modal">
      <span class="material-symbols-rounded"
      data-close-btn aria-hidden="true">close</span>

      <div class="state-layer"></div>
    </button>

    <input
      type="text"
      placeholder="Untitled"
      value="${title}"
      id="Untitled"
      class="modal-title text-title-medium"
      data-note-field
    />

    <textarea
      placeholder="Take a note..."
      class="modal-text text-body-large custom-scrollbar"
      data-note-field
    >${text}</textarea>

    <div class="modal-footer">
      <span class="time text-label-large">${time}</span>

      <button class="btn text" data-submit-btn>
        <span class="text-label-large">Save</span>

        <div class="state-layer"></div>
      </button>
    </div>
  `;

  const submitBtn = modal.querySelector("[data-submit-btn]");
  submitBtn.disabled = true;
  const [titleField, textField] = modal.querySelectorAll("[data-note-field]");

  const enableSubmit = function () {
    submitBtn.disabled = !textField.value && !textField.value;
  };

  textField.addEventListener("keyup", enableSubmit);
  titleField.addEventListener("keyup", enableSubmit);

  const open = function () {
    document.body.appendChild(modal);
    document.body.appendChild(overlay);
    titleField.focus();
  };

  const close = function () {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  };

  // when click close click call the closeModal function

  const closeBtn = modal.querySelector("[data-close-btn]");
  closeBtn.addEventListener("click", close);

  // handle note submit within the modal

  const onSubmit = function (callback) {
    submitBtn.addEventListener("click", function () {
      const noteData = {
        title: titleField.value,
        text: textField.value,
      };

      callback(noteData);
    });
  };

  return { open, close, onSubmit };
};

// opens the note modal by append it to body and setting focus on title field

const DeleteConfirmModal = function (title) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <h3 class="modal-title text-title-medium">
      Are you sure you want to delete <strong>"${title}"</strong>?
    </h3>

    <div class="modal-footer">
      <button class="btn text" data-action-btn="false">
        <span class="text-label-large">Cancel</span>

        <div class="state-layer"></div>
      </button>

      <button class="btn fill" data-action-btn="true">
        <span class="text-label-large" >Delete</span>

        <div class="state-layer"></div>
      </button>
    </div>
  `;

  // open the delete confirm modal by append it to document body
  const open = function () {
    document.body.appendChild(modal);
    document.body.appendChild(overlay);
  };

  // closing the delete confirm modal
  const close = function () {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  };

  const actionBtns = modal.querySelectorAll("[data-action-btn]");

  // handling the submittion of delete confirm
  const onSubmit = function (callback) {
    actionBtns.forEach((btn) =>
      btn.addEventListener("click", function () {
        const isConfirm = this.dataset.actionBtn === "true" ? true : false;

        callback(isConfirm);
      })
    );
  };

  return { open, close, onSubmit };
};

export { DeleteConfirmModal, NoteModal };
