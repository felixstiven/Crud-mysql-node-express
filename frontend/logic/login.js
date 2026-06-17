// Obtener las referencias de los elementos del DOM (no sus valores al cargar la página)
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDiv = document.getElementById("passwordError");
const form = document.getElementById("loginForm");
const submitButton = document.getElementById("submit");

const urlApi = "http://localhost:3520/api/auth/login";

form.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});

const fetchLogin = async(urlApi, data, method) => {
    const options = {
        method: method || 'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(data)
    }

    try {
        const response = await fetch(urlApi, options);
        const result = await response.json();

        if(!result?.success) throw new Error(result.message || 'Fallo la peticion.');
        return result;
    } catch (error) {
        console.error("Errro al iniciar sesion.", error);
        throw error;
    }
}


const showError = (message) => {
    errorDiv.textContent =  message;
    errorDiv.className ="textError";
    errorDiv.style.display = "block";
}

const clearError = () => {
    errorDiv.style.display = "none";
}

emailInput.addEventListener("focus", clearError);
passwordInput.addEventListener("focus", clearError);

const validateForm = () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if(!email || !password) {
        showError("Todos los campos son obligatorios.");
        return false;
    }

    return true;
}

async function login(){
    const isValid = validateForm();
    if(!isValid) return;

    const textContentButtonActual = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Iniciando sesion...";


    try {
        const dataToSend = {
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
        }
        const response = await fetchLogin(urlApi, dataToSend, "POST");

        if(response?.success){
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return setTimeout(() => {
            window.location.href = "/frontend/pages/dashboard.html"
        },2000)

    } catch (error) {
        console.error("Error al iniciar sesion: ", error);
        showError(error.message);  

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = textContentButtonActual;
    }
} 