import { settings, select } from '../settings.js'

class AmountWidget {
  constructor(element) {
    const thisWidget = this
    //console.log('AmountWidget: ', thisWidget)
    //console.log('constrctors arguments: ', element)
    thisWidget.getElements(element)
    thisWidget.setValue(settings.amountWidget.defaultValue)
    thisWidget.initActions()
  }

  getElements(element) {
    const thisWidget = this

    thisWidget.element = element
    thisWidget.input = thisWidget.element.querySelector(
      select.widgets.amount.input
    )
    //console.log(thisWidget.input)
    thisWidget.linkDecrease = thisWidget.element.querySelector(
      select.widgets.amount.linkDecrease
    )
    thisWidget.linkIncrease = thisWidget.element.querySelector(
      select.widgets.amount.linkIncrease
    )
  }

  setValue(value) {
    const thisWidget = this
    const newValue = parseInt(value)

    // add validation
    if (
      thisWidget.value !== newValue &&
      !isNaN(newValue) &&
      newValue >= settings.amountWidget.defaultMin &&
      newValue <= settings.amountWidget.defaultMax
    ) {
      thisWidget.value = newValue
      thisWidget.announce()
    }

    thisWidget.input.value = thisWidget.value
  }
  initActions() {
    const thisWidget = this
    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value)
    })
    thisWidget.linkIncrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value + 1)
    })
    thisWidget.linkDecrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value - 1)
    })
  }
  announce() {
    const thisWidget = this
    const event = new CustomEvent('updated', {
      bubbles: true,
    })

    thisWidget.element.dispatchEvent(event)
  }
}

export default AmountWidget
