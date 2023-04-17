const signinButton = document.querySelector('.sign-in-button')
const errorDiv = document.querySelector('.sign-in .error-message')
signinButton.addEventListener('click', signIn)

async function signIn() {
  const form = document.querySelector('form') || null
  if (!form) return { code: 400, message: 'lack form in webpage' }
  const formData = new FormData(form)
  const email = formData.get('email')
  const password = formData.get('password')
  const data = { email, password }
  const returnData = await fetch('/api/signin', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const returnJson = await returnData.json()
  if (returnData.status === 200) {
    document.cookie = `accessToken=${returnJson.data}`;
    window.location.reload()
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


