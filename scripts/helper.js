const formSec = document.getElementById("form-sec");
const inputs = formSec.querySelectorAll("input");
const table = document.getElementById("table");
const recName = "student_records";
const data = JSON.parse(localStorage.getItem(recName)) ?? [];
let currentRec = null;

/**
 * Fetches data from data object & show it in a tabular form
 */
function showData() {
  table.innerHTML = "";
  if (data.length > 0) {
    for (const rec of data) {
      addToTable(rec);
    }
  } else {
    table.innerHTML = `<div class='error'>No Records Found !!!</div>`;
  }
}

/**
 * show alert message after some time
 * @param {string} msg alert message
 * @param {number} ms  microsecond
 */
const showDelayAlert = (msg, ms = 100) => {
  setTimeout(() => {
    alert(msg);
  }, ms);
};

/**
 * show or hides the enrollment form
 * @returns {boolean}
 */
const showHideForm = () => formSec.classList.toggle("hide");

/**
 * check for record in the data using id & return the index
 * @param {number} id
 * @return {number}
 */
const getRecordIndex = (id) => {
  return data.findIndex((ele) => ele.id === id);
};

/**
 * Performing **ADD, UPDATE & DELETE** operaion on data & updates it to localStorage
 * - **ADD** - updateData(pos, 0, insertedObj)
 * - **UPDATE** - updateData(pos, 1, updatedObj)
 * - **DELETE** - updateData(pos, delCount)
 *
 * @param {number} pos index position where to perform operation
 * @param {number} delCount count of elements to be deleted before operation
 * @param {object} obj element to insert at given position after deletion
 */
const updateData = (pos, delCount, obj = null) => {
  obj ? data.splice(pos, delCount, obj) : data.splice(pos, delCount);
  localStorage.setItem(recName, JSON.stringify(data));
};

/**
 * Checks for vertical scroll is needed or not on records table
 */
const scrollRecord = () => {
  if (table.parentElement.clientHeight < table.parentElement.scrollHeight) {
    table.parentElement.style.overflowY = "scroll";
  } else {
    table.parentElement.style.overflow = "hidden";
  }
};

/**
 * Adds the record to the table
 * @param {object} studentObj Object to be inserted
 */
function addToTable({ id, name, email, contact }) {
  table.innerHTML += `
    <div class="gridRow" id="stuRec-${id}"->
      <div class="id-col"><b>${id}</b></div>
      <div class="name-col">${name}</div>
      <div class="email-col">${email}</div>
      <div class="contact-col">${contact}</div>
      <div class="action-col">
          <i class="icon fas fa-edit" title="Edit" onclick='editRecord(${id})'><span class="sr-only">Edit</span></i>
          <i class="icon fas fa-minus-square" title="Delete" onclick='deleteRecord(${id})'><span class="sr-only">Delete</span></i>
      </div>
    </div>
    `;
  scrollRecord();
}

/**
 * Edits the record of the data
 * @param {number} id id of the object to be updated
 */
const editRecord = (id) => {
  const index = getRecordIndex(id);
  if (index !== -1) {
    currentRec = data[index];
    inputs.forEach((input) => {
      input.value = currentRec[input.name];
    });
    submitBtn.innerText = "Update";
    showHideForm();
  } else {
    alert("Invalid Record !!!");
  }
};

/**
 *  Deletes the record after confirmation
 * @param {number} id id of the object to be deleted
 */
const deleteRecord = (id) => {
  const index = getRecordIndex(id);
  if (
    index !== -1 &&
    confirm(
      `Do you really want to delete the record?
        \nRecord:\n${JSON.stringify(data[index]).replaceAll(",", "\n")}`,
    )
  ) {
    table.querySelector(`#stuRec-${id}`).remove();
    updateData(index, 1);
    scrollRecord();
    if (!data.length) showData();
    showDelayAlert("Record Deleted Successfully !!!");
  }
};

/**
 * resets the enrollment form
 */
const reset = () => {
  inputs.forEach((input) => {
    input.value = "";
    input.setCustomValidity("");
  });
  submitBtn.innerText = "Submit";
  currentRec = null;
  showHideForm();
};

/**
 * checks for validity of input & show the validity message
 * @param {Event | any} event
 */
const showValidityMsg = (event) => {
  if (!event.target.checkValidity()) {
    event.target.reportValidity();
  }
};
