const signupButton = document.querySelector('.sign-up-button')
const errorDiv = document.querySelector('.sign-up .error-message')
signupButton.addEventListener('click', signUp)

async function signUp() {
  const form = document.querySelector('form') || null
  if (!form) return { code: 400, message: 'lack form in webpage' }
  const formData = new FormData(form)
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    passwordCheck: formData.get('passwordCheck')
  }
  const returnData = await fetch('/api/signup', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const returnJson = await returnData.json()
  if (returnData.status === 200) {
    window.location.href = "/signin?signup=success"
    showErrorMessage(edocument.querySelector('.sign-in .error-message'), returnJson.message)
  } else {
    showErrorMessage(errorDiv, returnJson.message)
  }
}

function showErrorMessage(errorDiv, message, display = "block", duration = 1000) {
  errorDiv.style.opacity = 1
  errorDiv.style.display = display
  errorDiv.style.color = "#dc3545"
  errorDiv.style.visibility = "visible"
  errorDiv.textContent = message
  setTimeout(function () {
    errorDiv.style.display = "none"
    errorDiv.style.visibility = "hidden"
    errorDiv.style.opacity = 0
    errorDiv.textContent = ""
  }, 5000)
}
