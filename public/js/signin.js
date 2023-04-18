const signinButton = document.querySelector('.sign-in-button')
const errorDiv = document.querySelector('.sign-in .error-message')
signinButton.addEventListener('click', signIn)
document.addEventListener("keyup", (e) => {
  const form = document.querySelector('form') || null
  const formData = new FormData(form)
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  }
  if (!data.email && !data.password) return
  if (e.key === 'Enter') {
    signIn()
  }
})

async function signIn() {
  const form = document.querySelector('form') || null
  if (!form) return { code: 400, message: 'lack form in webpage' }
  const formData = new FormData(form)
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  }
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



