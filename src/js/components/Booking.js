import { templates, select } from '../settings.js'
import AmountWidget from './AmountWidget.js'

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
  }

  initWidgets() {
    this.peopleAmount = new AmountWidget(this.dom.peopleAmount)
    this.hoursAmount = new AmountWidget(this.dom.hoursAmount)

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
