//// Obtener las referencias de los elementos del DOM (no sus valores al cargar la página)
const firstNameInput = document.getElementById("firstName");
const secondNameInput = document.getElementById("secondName");
const firstLastNameInput = document.getElementById("firstLastName");
const secondLastNameInput = document.getElementById("secondLastName");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");
const passwordInput = document.getElementById("password");
const employeeForm = document.getElementById("employeeForm");
const submitButton = document.getElementById("submitBtn");
const cancelButton = document.getElementById("cancelBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const errorDiv = document.getElementById("textError");

//referencias para las tabas
const employeeListTableBody = document.getElementById("employeeList");


const urlApi = "http://localhost:3520/api/users/create";

//ejecutar al cargar pagina
document.addEventListener("DOMContentLoaded", ()=>{
    fetchListEmployees();
});

employeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editingId = employeeForm.dataset.editingId;
    if (editingId) {
        fetchUpdateEmployee(editingId);
    } else {
        createEmployee(); 
    }
});

cancelButton.addEventListener("click", () => {
    employeeForm.reset();
    delete employeeForm.dataset.editingId;
    submitButton.textContent = "Guardar Empleado";
    passwordInput.required = true;
    passwordInput.placeholder = "";
    clearError();
});

const fetchEmployees = async (url, data, companyId, method) => {
    const options = {
        method: method || "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    }
    try {
        const response = await fetch(
            `${url}/${companyId}`,
            options
        );
        const result = await response.json();

        if(!result.success) throw new Error(result.message || "Fallo la peticion");

        return result;
        
    } catch (error) {
        console.error("Error al registrar el usuario");
        throw error;
    }
}

const showError = (message) => {
    errorDiv.textContent = message;
    errorDiv.className = "textError";
    errorDiv.style.display = "block";
}

const clearError = () => {
    errorDiv.style.display = "none";
}

passwordInput.addEventListener("focus", clearError);
emailInput.addEventListener("focus", clearError);
roleInput.addEventListener("focus", clearError);

const validatePassword = () => {

    const password = passwordInput.value.trim();
    const regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if(!regex.test(password) || password.length < 8){
        showError( "La contraseña debe tener almenos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial.");
        return false;
    }

    return true;
}

const validateForm = (isEdit = false) => {
    const  email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleInput.value.trim();
    const firstName = firstNameInput.value.trim();
    const firstLastName = firstLastNameInput.value.trim();
    
    if (!firstName || !firstLastName || !email || (!isEdit && !password) || !role) {
        showError("Complete todos los campos requeridos.");
        return false;
    }
    if (!isEdit || password !== "") {
        if(!validatePassword()) return false;    
    }
    return true;
}


async function createEmployee() {

    const isValid = validateForm(false);
    if(!isValid) return;

    const textContentButtonActual = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";

    try {
        const userLogged = JSON.parse(localStorage.getItem("user"));
        if(!userLogged || !userLogged.companyId){
            showError("Sesion expirada, por favor inicia sesion nuevamente.");
            return;
        }
        
        const companyId = userLogged.companyId;

        const dataToSend = {
            firstName: firstNameInput.value.trim(),
            secondName: secondNameInput.value.trim(),
            firstLastName: firstLastNameInput.value.trim(),
            secondLastName: secondLastNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
            role: roleInput.value.trim(),
        }
        const response = await fetchEmployees(urlApi,dataToSend,companyId, "POST");

        if(!response.success) throw new Error(response.message || "Error al crear el usuario.");

        alert("Usuario creado exitosamente.");
        await fetchListEmployees();
        employeeForm.reset(); 

        return response;

    } catch (error) {
        console.error(error.message || "Fallo la peticion.");
        showError(error.message || "Fallo la peticion.");
        throw error;   
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = textContentButtonActual;
    }
}

async function fetchListEmployees(){

    const userLogged = JSON.parse(localStorage.getItem("user"));
    if(!userLogged || !userLogged.companyId){
        showError("Sesion expirada, por favor inicia sesion nuevamente.");
        return;
    }

    const companyId = userLogged.companyId;

    const url = `http://localhost:3520/api/users/load/${companyId}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        console.log("resut", result);

        if(!result.success) throw new Error(result.message || "Fallo al obtener la lista de empleados.");

        renderEmployeesTable(result.data || []);
        
    } catch (error) {
        console.error("Error al listar empleados: ", error);
        throw error;
    }
}

function renderEmployeesTable(employees){
   employeeListTableBody.innerHTML ="";

   employees.forEach(employee => {
    const row = document.createElement("tr");

    //celda ID
    const idCell = document.createElement("td");
    idCell.textContent = employee.id;
    row.appendChild(idCell);

    //celda nombre completo
    const fullNameCell = document.createElement("td");
    fullNameCell.textContent = `${employee.firstName} ${employee.secondName || ""}`;
    row.appendChild(fullNameCell);

    //celda aplleidos completos
    const fullLastName = document.createElement("td");
    fullLastName.textContent = `${employee.firstLastName} ${employee.secondLastName || ""}`;
    row.appendChild(fullLastName);

    //celda rol 
    const roleCell = document.createElement("td");
    roleCell.className = `badge badge-${employee.role === "admin" ? "admin" : employee.role === "supervisor" ? "supervisor" : "tecnico"}`;
    roleCell.textContent = employee.role;
    row.appendChild(roleCell);

    //celda email
    const emailCell = document.createElement("td");
    emailCell.textContent = employee.email;
    row.appendChild(emailCell);

    //celda boton de acciones 
    const actionCell = document.createElement("td");
    
    const editButton = document.createElement("button");
    editButton.className = "btn-edit";
    editButton.textContent = "Editar";
    editButton.dataset.id = employee.id;
    editButton.dataset.bsToggle="modal"
    editButton.dataset.bsTarget = "#editEmployeeModal";
    editButton.addEventListener("click", (e) =>{
        e.preventDefault();
        handleEditClick(employee.id, employee);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.dataset.id = employee.id;
    deleteBtn.addEventListener("click", async(e) => {
        const employeeId = e.target.dataset.id;
        await handleDeleteClick(employeeId);
    });

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteBtn);

    row.appendChild(actionCell);

    employeeListTableBody.appendChild(row);
    
   });
}

const handleDeleteClick = async (id) => {
    const url = `http://localhost:3520/api/users/delete/${id}`;

    const isConfirm = confirm("¿Estas seguro de eliminar el empleado?");
    if(!isConfirm) return;

    try {
        const response = await fetch(url,{
            method:"DELETE",
        });
        const result = await response.json();
        if(!result.success) throw new Error(result.message || "Fallo al eliminar el empleado");

        alert("Empleado eliminado correctamente");
        await fetchListEmployees();
    } catch (error) {
        console.error("Error al eliminar el empleado: ", error);
        throw error;
    }
} 


const handleEditClick = async (id, employeeData) => {
    
    const {firstName, secondName, firstLastName, secondLastName, email, role} = employeeData;

    firstNameInput.value = firstName || "";
    secondNameInput.value = secondName || "";
    firstLastNameInput.value = firstLastName || "";
    secondLastNameInput.value = secondLastName || ""; 
    emailInput.value = email || "";
    roleInput.value = role || "";

    passwordInput.required = false;
    passwordInput.placeholder = "•••••••• (dejar vacío si no cambia)";

    submitButton.textContent = "Actulizar Empleado";

    //Guardar el id que estamos editando en un atributo de datos del formulario para usarlo cuando se envie 
    employeeForm.dataset.editingId = id;
}

async function fetchUpdateEmployee(id) {
    const isValid = validateForm(true);
    if(!isValid) return;

    const url = `http://localhost:3520/api/users/update/${id}`;
    
    const isConfirm = confirm("¿Estas seguro de actualizar el empleado?");

    if(!isConfirm) return;

    const textContentButtonActual = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Actualizando...";

    try {
        const dataToSend = {
            firstName: firstNameInput.value.trim(),
            secondName: secondNameInput.value.trim(),
            firstLastName: firstLastNameInput.value.trim(),
            secondLastName: secondLastNameInput.value.trim(),
            email: emailInput.value.trim(),
            role: roleInput.value.trim(),
        }

        if(passwordInput.value.trim() !== "") {
            dataToSend.password = passwordInput.value.trim();
        }

        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(dataToSend)
        });
        const result = await response.json();

        if(!result.success) throw new Error(result.message || "Fallo al actualizar el empleado");

        alert("Empleado actualizado correctamente");
        await fetchListEmployees();
        employeeForm.reset();
        delete employeeForm.dataset.editingId;
        submitButton.textContent = "Guardar Empleado";
        passwordInput.required = true;
        passwordInput.placeholder = "";

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        showError(error.message || "Fallo al actualizar el empleado");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar Empleado";
    }
}
