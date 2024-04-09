const registerForm = document.getElementById("student-register-form");
const submitBtn = document.getElementById("");
const tBody = document.querySelector("#records tbody");
const recName = "student_records";
const dummyData = [
  { id: 1, name: "Avi", email: "Avi@gmail.com", contact: "34567727827" },
  { id: 2, name: "Aryan", email: "Aryan@gmail.com", contact: "277727827" },
  { id: 3, name: "Avnish", email: "Avnish@gmail.com", contact: "7772347827" },
  { id: 4, name: "Ai", email: "Ai@gmail.com", contact: "8822223827" },
];
const data = JSON.parse(localStorage.getItem(recName)) ?? dummyData;

const addToTable = ({ id, name, email, contact }) => {
  tBody.innerHTML += `
    <tr id='stuRec-${id}'>
    <td>${id}</td>
    <td>${name}</td>
    <td>${email}</td>
    <td>${contact}</td>
    <td><i onClick='editRecord(${id})'>Edit</i> <i onClick='deleteRecord(${id})'>Delete</i></td>
    </tr>
    `;
};

const getRecordIndex = (id) => {
  const index = data.findIndex((ele) => ele.id === id);
  if (index > -1) {
    return index;
  }
  throw new Error(`Invalid Record ID (${id}) !!!`);
};

const editRecord = (id) => {
  console.log(getRecordIndex(id));
};

const deleteRecord = (id) => {
  try {
    const index = getRecordIndex(id);
    if (
      confirm(
        `Do you really want to delete the record?
      \nRecord:\n${JSON.stringify(data[index]).replaceAll(",", "\n")}`
      ) === true
    ) {
      data.splice(index, 1);
      tBody.querySelector(`tr#stuRec-${id}`).remove();
      // localStorage.setItem(recName, JSON.stringify(data));
      console.log("Record Deleted Successfully !!!");
    } else {
      console.log("Record Not Deleted !!!");
    }
  } catch (error) {
    console.error(error);
  }
};

window.onload = () => {
  if (data.length > 0) {
    for (const rec of data) {
      addToTable(rec);
    }
  } else {
    tBody.innerHTML = `<tr> <td class='warning' colspan='5'> No Records Found </td> </tr>`;
  }
};

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // console.log(new FormData(registerForm).get('studentEmail'));
})