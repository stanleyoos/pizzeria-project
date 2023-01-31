import { templates, select, settings, classNames } from '../settings.js'
import utils from '../utils.js'
import AmountWidget from './AmountWidget.js'
import DatePicker from './DatePicker.js'
import HourPicker from './HourPicker.js'

class Booking {
  constructor(element) {
    this.render(element)
    this.initWidgets()
    this.getData()
  }

  getData() {
    const thisBooking = this

    const startDateParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.minDate)

    const endDateParam =
      settings.db.dateEndParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.maxDate)

    const params = {
      booking: [startDateParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam],
    }

    const urls = {
      booking:
        settings.db.url +
        '/' +
        settings.db.bookings +
        '?' +
        params.booking.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsCurrent.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsRepeat.join('&'),
    }

    // fetch(urls.booking)
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then((responses) => {
        return Promise.all([
          responses[0].json(),
          responses[1].json(),
          responses[2].json(),
        ])
      })
      .then(([bookings, eventsCurrent, eventsRepeat]) => {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat)
      })
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this

    thisBooking.booked = {}

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table)
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table)
    }

    const minDate = thisBooking.datePicker.minDate
    const maxDate = thisBooking.datePicker.maxDate

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          )
        }
      }
    }

    //console.log(thisBooking.booked)
    //console.log(utils.hourToNumber('12:30'))
    thisBooking.updateDOM()
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this

    const startHour = utils.hourToNumber(hour)

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {}
    }

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      //console.log(hourBlock)
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = []
      }

      thisBooking.booked[date][hourBlock].push(table)
    }
  }

  updateDOM() {
    const thisBooking = this

    thisBooking.date = thisBooking.datePicker.value
    //console.log(thisBooking.hourPicker.value)
    thisBooking.hour = thisBooking.hourPicker.value

    let allAvailable = false

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ==
        'undefined'
    ) {
      allAvailable = true
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute)
      if (!isNaN(tableId)) {
        // !isNaN("3") => true
        tableId = parseInt(tableId)
      }

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked)
      } else {
        table.classList.remove(classNames.booking.tableBooked)
      }
    }
  }

  render(element) {
    const generatedHTML = templates.bookingWidget()
    this.dom = {}
    this.dom.wrapper = element

    this.dom.wrapper.innerHTML = generatedHTML

    // inputs

    this.dom.peopleAmount = element.querySelector(select.booking.peopleAmount)
    this.dom.hoursAmount = element.querySelector(select.booking.hoursAmount)

    // date picker
    this.dom.datePicker = element.querySelector(
      select.widgets.datePicker.wrapper
    )

    // hour picker
    this.dom.hourPicker = element.querySelector(
      select.widgets.hourPicker.wrapper
    )

    this.dom.tables = element.querySelectorAll(select.booking.tables)

    //console.log(this.dom.tables)
  }

  initWidgets() {
    const thisBooking = this
    this.peopleAmount = new AmountWidget(this.dom.peopleAmount)
    this.hoursAmount = new AmountWidget(this.dom.hoursAmount)
    this.datePicker = new DatePicker(this.dom.datePicker)
    this.hourPicker = new HourPicker(this.dom.hourPicker)

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM()
    })
  }
}

export default Booking
