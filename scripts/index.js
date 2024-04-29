const submitBtn = document.getElementById("submit-btn");
const closeBtn = document.getElementById("close-btn");
const addRecBtn = document.getElementById("add-rec-btn");
const delAllBtn = document.getElementById("del-all-btn");

// input regex for validating the inputs
const inputRegex = {
  id: {
    pattern: /^[1-9]\d*$/,
    title: "must be greater than 0",
  },
  name: {
    pattern: /^[a-zA-Z]+$/,
    title: "Enter only firstname (only letters)",
  },
  email: {
    pattern: /^\S+@\S+\.\S{2,3}$/,
    title: "Enter a valid email",
  },
  contact: {
    pattern: /^[6-9][0-9]{9}$/,
    title: "Enter a valid contact (only 10 digits)",
  },
};

// for showing data on window load
showData();

/**
 * Checks for empty inputs
 *
 * returns the object constructed by inputs if error does not exist
 * @returns {null | object}
 */
function validateInputs() {
  let hasError = false;
  inputs.forEach((input) => {
    const val = input.value.trim();
    if (!val) {
      hasError = true;
      input.setCustomValidity(`Enter the ${input.name.toUpperCase()}`);
    }
  });

  return hasError
    ? null
    : {
        id: inputs[0].valueAsNumber,
        name: inputs[1].value.trim().toUpperCase(),
        email: inputs[2].value.trim().toLowerCase(),
        contact: inputs[3].value.trim(),
      };
}

/**
 * Compare the property value from obj1 with obj2
 *
 * return true if both are different else false
 *
 * @param {object} obj1
 * @param {object} obj2
 * @returns {boolean}
 */
const checkForUpdate = (obj1, obj2) => {
  let isNotEqual = false;
  if (obj2) {
    for (const key in obj1) {
      isNotEqual ||= obj1[key] !== obj2[key];
    }
  }
  return isNotEqual;
};

/**
 * Checks for duplicate value & return true if exists or false
 * @param {boolean} isEditing
 * @param {number} id1
 * @param {null | number} id2
 * @returns {boolean}
 */

const checkDuplicate = (isEditing, id1, id2) => {
  return isEditing && id1 === id2 ? false : getRecordIndex(id1) !== -1;
};

/**
 * Invokes all user validations on inputs for adding or updating record accordingly
 * @param {Event} event
 */
function handleSubmit(event) {
  event.preventDefault();

  const studentObj = validateInputs();
  const isUpdated = checkForUpdate(studentObj, currentRec);
  const updateAt = isUpdated ? getRecordIndex(currentRec.id) : data.length;
  const delCount = isUpdated ? 1 : 0;

  // Checking that any updates have been made or not
  if (currentRec && !isUpdated) {
    reset();
  }
  // Record Duplicacy Check
  else if (checkDuplicate(isUpdated, studentObj.id, currentRec?.id)) {
    alert("Duplicate ID Found !!!");
    inputs[0].setCustomValidity("Enter a unique ID !!!");
    inputs[0].focus();
  }
  // Checking for right object
  else if (studentObj) {
    if (table.lastElementChild?.classList.contains("error")) {
      table.lastElementChild.remove();
    }
    addToTable(studentObj);
    updateData(updateAt, delCount, studentObj);
    reset();
    if (isUpdated) {
      showData();
      showDelayAlert("Record updated successfully !!!");
    }
  }
}

// Event Listeners
// listener for error checking on every input
inputs.forEach((input) => {
  input.oninput = () => {
    if (!inputRegex[input.name].pattern.test(input.value)) {
      input.setCustomValidity(inputRegex[input.name].title);
    } else {
      input.setCustomValidity("");
    }
  };
  input.addEventListener("mousedown", showValidityMsg);
  input.addEventListener("focus", showValidityMsg);
});

addRecBtn.onclick = showHideForm;

// Delete all data from local storage
delAllBtn.onclick = () => {
  if (confirm("Do you really want to delete all the records ?")) {
    updateData(0, data.length);
    showData();
    showDelayAlert("All Records Deleted Succeessfully !!!");
  }
};

closeBtn.onclick = reset;

formSec
  .querySelector("#student-register-form")
  .addEventListener("submit", handleSubmit);
