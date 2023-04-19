const showTime = document.querySelector('.show-time')
const today = dayjs()
console.log(today.year(), today.month() + 1, today.date(), today.hour(), today.minute(), today.second())

setInterval(() => {
  const today = dayjs()
  showTime.innerHTML = `${today.year()}/${today.month() + 1}/${today.date()} ${today.hour() < 10 ? '0' + today.hour() : today.hour()}:${today.minute() < 10 ? '0' + today.minute() : today.minute()}:${today.second() < 10 ? '0' + today.second() : today.second()}`
}, 1000)