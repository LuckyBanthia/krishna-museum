/**
 * Submit user registration details to the backend API.
 */
function register() {
    let user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
    .then(res => {
        if (res.ok) {
            return res.text().then(data => {
                showToast("Registered successfully", "success");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
            });
        } else {
            return res.text().then(error => {
                showToast(error || "Registration failed", "error");
            });
        }
    })
    .catch(err => {
        showToast("Registration failed: Network error", "error");
    });
}

/**
 * Authenticate user email and password against backend API.
 */
function login() {
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok || data.status === "INVALID") {
            showToast("Invalid credentials", "error");
            return;
        }

        sessionStorage.setItem("userId", data.email);
        sessionStorage.setItem("username", data.email);
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("role", data.role);

        showToast("Login successful", "success");
        
        setTimeout(() => {
            if (data.role === "ADMIN") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        }, 1500);
    })
    .catch(err => {
        showToast("Login failed: Network error", "error");
    });
}
