const signoutButton = document.querySelector('.sign-out-button')
signoutButton.addEventListener('click', signOut)

async function signOut() {
  document.cookie = `accessToken=`;
  window.location.reload()
}
