const signupButton = document.querySelector('.sign-up-button')
const errorDiv = document.querySelector('.sign-up .error-message')
signupButton.addEventListener('click', signUp)
document.addEventListener("keyup", (e) => {
  const form = document.querySelector('form') || null
  if (!form) return
  const formData = new FormData(form)
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    passwordCheck: formData.get('passwordCheck')
  }
  if (!data.email && !data.password) return
  if (e.key === 'Enter') {
    signUp()
  }
})

async function signUp() {
  const form = document.querySelector('form') || null
  if (!form) return
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

