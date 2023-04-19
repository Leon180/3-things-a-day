const types = ["book", "sport", "relax"]
const apiLink = '/api/date'
const editApiLink = '/api/card'
const newApiLink = '/api/card'
const accessToken = getCookie('accessToken')
const fetchMethod = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  }
}
const editFetchMethod = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  }
}
const newFetchMethod = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  }
}
const showCardsArea = document.querySelector(".card-container")
const errorMessageArea = document.querySelector('.error-message')
const editCardClassPrefixName = 'today'
const newCardClassPrefixName = 'new'
getTodayCard(apiLink, fetchMethod, showCardsArea, errorMessageArea, editCardClassPrefixName, newCardClassPrefixName, editApiLink, newApiLink, editFetchMethod, newFetchMethod)

function cardName(prefix, i) {
  return `${prefix}-card-${i}`
}

async function getTodayCard(apiLink, fetchMethod, showCardsArea, errorMessageArea, editCardClassPrefixName, newCardClassPrefixName, editApiLink, newApiLink, editFetchMethod, newFetchMethod) {
  const today = dayjs()
  const todayApiLink = apiLink + `?year=${today.year()}&month=${today.month() + 1}&day=${today.date()}`
  const returnData = await fetch(todayApiLink, fetchMethod)
  const returnJson = await returnData.json()
  console.log(returnJson)
  if (returnData.status !== 200) return showErrorMessage(errorMessageArea, returnJson.message)
  const cards = []
  returnJson.data.forEach((data) => {
    cards.push(data.Cards)
  })
  let cardsHTML = []
  let cardsId = []
  if (cards.length > 0) cards.forEach((card, i) => {
    cardsHTML.push(`
    <div class="col mb-3">
      <div class="card ${cardName(editCardClassPrefixName, i)}">
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
  const repeat = 3 - cardsHTML.length
  for (let i = 0; i < repeat; i++) {
    cardsHTML.push(`
    <div class="col mb-3">
      <div class="card ${cardName(newCardClassPrefixName, i)}">
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
  const cardsHTMLString = cardsHTML.join(',').replace(/,/g, '')
  showCardsArea.innerHTML = cardsHTMLString
  for (let i = 0; i < cardsHTML.length; i++) {
    document.querySelector(`.${cardName(editCardClassPrefixName, i)} .btn`)?.addEventListener('click', () => editCard(i, cardsId[i], editCardClassPrefixName, editApiLink, editFetchMethod))
    document.querySelector(`.${cardName(newCardClassPrefixName, i)} .btn`)?.addEventListener('click', () => createCard(i, newCardClassPrefixName, newApiLink, newFetchMethod))
  }
}

async function editCard(i, id, editCardClassPrefixName, editApiLink, editFetchMethod) {
  const form = document.querySelector(`.${editCardClassPrefixName}-card-${i} form`) || null
  if (!form) return
  const formData = new FormData(form)
  let data = {}
  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1]
  }
  const today = dayjs()
  const todayApiLink = editApiLink + `/${id}?year=${today.year()}&month=${today.month() + 1}&day=${today.date()}`
  const returnData = await fetch(todayApiLink, {
    ...editFetchMethod,
    body: JSON.stringify(data)
  })
  const returnJson = await returnData.json()
  if (returnData.status === 200) renderForm(cardName(editCardClassPrefixName, i), returnJson.data.data)
  else showErrorMessage(
    document.querySelector(`.${cardName(editCardClassPrefixName, i)} .error-message`),
    returnJson.message
  )
}

async function createCard(i, newCardClassPrefixName, newApiLink, newFetchMethod) {
  const form = document.querySelector(`.${newCardClassPrefixName}-card-${i} form`) || null
  if (!form) return
  const formData = new FormData(form)
  let data = {}
  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1]
  }
  const today = dayjs()
  const todayApiLink = newApiLink + `?year=${today.year()}&month=${today.month() + 1}&day=${today.date()}`
  const returnData = await fetch(todayApiLink, {
    ...newFetchMethod,
    body: JSON.stringify(data)
  })
  const returnJson = await returnData.json()
  if (returnData.status === 200) renderForm(cardName(newCardClassPrefixName, i), returnJson.data.data)
  else showErrorMessage(
    document.querySelector(`.${cardName(newCardClassPrefixName, i)} .error-message`),
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
