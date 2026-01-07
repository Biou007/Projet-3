const form = document.querySelector(".login form");
const errorDiv = document.querySelector(".messageErreur");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  errorDiv.textContent = "";

  if (!email || !password) {
    errorDiv.textContent = "Veuillez remplir tous les champs";
    return;
  }

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else if (response.status === 401) {
      errorDiv.textContent = "Email ou mot de passe incorrect";
    } else {
      errorDiv.textContent = "Une erreur est survenue";
    }
  } catch (error) {
    console.error(error);
    errorDiv.textContent = "Impossible de se connecter pour le moment";
  }
});
