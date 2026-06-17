// Obtener las referencias de los elementos del DOM (no sus valores al cargar la página)
const firstNameInput = document.getElementById("firstName");
const secondNameInput = document.getElementById("secondName");
const firstLastNameInput = document.getElementById("firstLastName");
const secondLastNameInput = document.getElementById("secondLastName");
const emailInput = document.getElementById("email"); // Corregido: en register.html es "companyEmail"
const companyInput = document.getElementById("company");
const passwordInput = document.getElementById("password");
const passwordConfirmationInput = document.getElementById("passwordConfirmation");
const form = document.getElementById("registerForm");
const submitButton = document.getElementById("submit");

const urlApi = "http://localhost:3520/api/auth/register";

form.addEventListener("submit", (e) => {
    e.preventDefault();
    registerOwnerAndCompany();
});

const fetchRegister = async (url, data, method) => {
    try {
        const options = {
            method: method || "POST",
            headers: { // Corregido: "headers" en minúsculas
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Fallo la petición.");
        }

        return result;
    } catch (error) {
        console.error("Error al registrar el usuario.", error);
        throw error;
    }
}

const validatePassword = () => {
    
    const errorDiv = document.getElementById("passwordError");

    const password = passwordInput.value.trim();
    const passwordConfirmation = passwordConfirmationInput.value.trim();
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if(!regex.test(password) || password.length < 8){
        errorDiv.innerHTML = `<span class="textError">La contraseña debe tener almenos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial.</span>`
        return false;
    }
    if(password !== passwordConfirmation){
        errorDiv.innerHTML = `<span class="textError">Las contraseñas no coinciden.</span>`
        return false;
    }
    
    errorDiv.innerHTML = "";
    return true;
   
}

async function registerOwnerAndCompany() {

    const isValid = validatePassword();
    if(!isValid) return;

    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = "Registrando...";

    const dataToSend = {
        firstName: firstNameInput.value.trim(),
        secondName:secondNameInput.value.trim(),
        firstLastName: firstLastNameInput.value.trim(),
        secondLastName: secondLastNameInput.value.trim(),
        email: emailInput.value.trim(),
        company: {
             companyName: companyInput.value.trim(),
        },
        password: passwordInput.value.trim(),
    }

    try {
        const response = await fetchRegister(urlApi, dataToSend, "POST");
        if(!response.success) throw new Error(response.message);

        alert("Usuario registrado exitosamente, redirigiendo a pagina de inicio sesion...");

        return setTimeout(() =>{
            window.location.href = "/frontend/pages/login.html";
        }, 2000);
    } catch (error) {
        console.error("Error al registrar el usuario y la empresa.", error);
        alert("Error al registrar:" + error.message); 
        submitButton.disabled = false;
        submitButton.textContent = originalText;     
    }
    
}



