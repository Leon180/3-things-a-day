const cardContainer = document.querySelector(".card-container");
const accessToken = getCookie('accessToken');
const types = ["book", "sport", "relax"]

todayCard().then((cards) => {
  let cardsHTML = []
  let cardsId = []
  if (cards.length > 0) cards.forEach((card, i) => {
    cardsHTML.push(`
    <div class="col">
      <div class="card ${cardName('today', i)}">
        <div class="card-body">
          <form id="card" class="form-row mx-2" action="/" method="POST">
            <div class="row g-3 mt-1 mb-3">
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" name="title" class="form-control" id="floatingInput" placeholder="Title" value=${card.title}>
                  <label for="floatingInput">Title</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <select name="type" class="form-select" id="floatingSelectGrid"
                    aria-label="Floating label select example">
                    <option value=${types[0]} ${card.type === types[0] ? "selected" : ''}>Book</option>
                    <option value=${types[1]} ${card.type === types[1] ? "selected" : ''}>Sport</option>
                    <option value=${types[2]} ${card.type === types[2] ? "selected" : ''}>Relax</option>
                  </select>
                  <label for="floatingSelectGrid">Type</label>
                </div>
              </div>
            </div>
            <div class="row d-flex justify-content-between mb-3">
              <div class="col-md">
                <input type="time" name="start" style="width:100%;" value=${card.start}>
              </div>
              ~
              <div class="col-md">
                <input type="time" name="end" style="width:100%;" value=${card.end}>
              </div>
            </div>
            <div class="form-floating mb-4">
              <textarea name="record" class="form-control" placeholder="record here" id="floatingTextarea" style="min-height:23vh;">${card.record}</textarea>
              <label for="floatingTextarea">Record</label>
            </div>
            <div class="error-message mb-2 text-center"></div>
            <div class="d-flex align-items-center justify-content-end mb-3">
              <button type="button" class="btn btn-primary">Edit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `)
    cardsId.push(card.id)
  })
  for (let i = 0; i < 3 - cardsHTML.length; i++) {
    cardsHTML.push(`
    <div class="col">
      <div class="card ${cardName('new', i)}">
        <div class="card-body">
          <form id="card" class="form-row mx-2" action="/" method="POST">
            <div class="row g-3 mt-1 mb-3">
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" name="title" class="form-control" id="floatingInput" placeholder="Title">
                  <label for="floatingInput">Title</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <select name="type" class="form-select" id="floatingSelectGrid"
                    aria-label="Floating label select example">
                    <option value="book">Book</option>
                    <option value="sport">Sport</option>
                    <option value="relax">Relax</option>
                  </select>
                  <label for="floatingSelectGrid">Type</label>
                </div>
              </div>
            </div>
            <div class="row d-flex justify-content-between mb-3">
              <div class="col-md">
                <input type="time" name="start" style="width:100%;">
              </div>
              ~
              <div class="col-md">
                <input type="time" name="end" style="width:100%;">
              </div>
            </div>
            <div class="form-floating mb-4">
              <textarea name="record" class="form-control" placeholder="record here" id="floatingTextarea" style="min-height:23vh;"></textarea>
              <label for="floatingTextarea">Record</label>
            </div>
            <div class="error-message mb-2 text-center"></div>
            <div class="d-flex align-items-center justify-content-end mb-3">
              <button type="button" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `)
  }
  let cardsHTMLString = cardsHTML.join(',').replace(/,/g, '')
  cardContainer.innerHTML = cardsHTMLString
  for (let i = 0; i < cardsHTML.length; i++) {
    document.querySelector(`.${cardName('today', i)} .btn`)?.addEventListener('click', () => editCard(i, cardsId[i]))
    document.querySelector(`.${cardName('new', i)} .btn`)?.addEventListener('click', () => createCard(i))
  }
})

function cardName(prefix, i) {
  return `${prefix}-card-${i}`
}

async function todayCard() {
  const returnData = await fetch('/api/date', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
  const returnJson = await returnData.json()
  if (returnData.status === 200) {
    const cards = []
    for (let i = 0; i < returnJson.data.length; i++) {
      cards.push(returnJson.data[i].Cards)
    }
    return cards
  }
  return []
}

async function editCard(i, id) {
  const form = document.querySelector(`.today-card-${i} form`) || null
  if (!form) return { code: 400, message: 'lack form in webpage' }
  const formData = new FormData(form)
  const data = {
    title: formData.get('title'),
    type: formData.get('type'),
    start: formData.get('start'),
    end: formData.get('end'),
    record: formData.get('record')
  }
  const returnData = await fetch(`/api/card/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
  const returnJson = await returnData.json()
  if (returnData.status === 200) renderForm(cardName('today', i), returnJson.data.data)
  else showErrorMessage(
    document.querySelector(`.${cardName('today', i)} .error-message`),
    returnJson.message
  )
}

async function createCard(i) {
  const form = document.querySelector(`.new-card-${i} form`) || null
  if (!form) return { code: 400, message: 'lack form in webpage' }
  const formData = new FormData(form)
  const data = {
    title: formData.get('title'),
    type: formData.get('type'),
    start: formData.get('start'),
    end: formData.get('end'),
    record: formData.get('record')
  }
  const returnData = await fetch(`/api/card`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
  const returnJson = await returnData.json()

  if (returnData.status === 200) renderForm(cardName('new', i), returnJson.data.data)
  else showErrorMessage(
    document.querySelector(`.${cardName('today', i)} .error-message`),
    returnJson.message
  )
}

function renderForm(cardName, returnData) {

  document.querySelector(`.${cardName} input[name="title"]`).value = returnData.title
  document.querySelector(`.${cardName} select[name="type"]`).value = returnData.type
  document.querySelector(`.${cardName} input[name="start"]`).value = returnData.start
  document.querySelector(`.${cardName} input[name="end"]`).value = returnData.end
  document.querySelector(`.${cardName} textarea[name="record"]`).value = returnData.record
  document.querySelector(`.${cardName} .btn`).innerText = 'Edit'
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
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