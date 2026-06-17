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


const urlApi = "http://localhost:3520/api/users/create";

employeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createEmployee(); 
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

const validateForm = () => {
    const  email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleInput.value.trim();
    const firstName = firstNameInput.value.trim();
    const firstLastName = firstLastNameInput.value.trim();
    
    if (!firstName || !firstLastName || !email || !password || !role) {
        showError("Complete todos los campos requeridos.");
        return false;
    }
    if(!validatePassword()) return false;    
    return true;
}


async function createEmployee() {

    const isValid = validateForm();
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