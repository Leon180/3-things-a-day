function showErrorMessage(errorDiv, message, display = "block", duration = 5000) {
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
  }, duration)
}