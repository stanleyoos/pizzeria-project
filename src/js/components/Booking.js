import { templates, select } from '../settings.js'
import AmountWidget from './AmountWidget.js'
import DatePicker from './DatePicker.js'
import HourPicker from './HourPicker.js'

class Booking {
  constructor(element) {
    this.render(element)
    this.initWidgets()
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
  }

  initWidgets() {
    this.peopleAmount = new AmountWidget(this.dom.peopleAmount)
    this.hoursAmount = new AmountWidget(this.dom.hoursAmount)
    this.datePicker = new DatePicker(this.dom.datePicker)
    this.hourPicker = new HourPicker(this.dom.hourPicker)

    this.dom.peopleAmount.addEventListener('click', function (e) {
      e.preventDefault()
      console.log('People: click')
    })

    this.dom.hoursAmount.addEventListener('click', function (e) {
      e.preventDefault()
      console.log('Hours: click')
    })
  }
}

export default Booking
