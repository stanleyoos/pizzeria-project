class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this

    thisWidget.dom = {}
    thisWidget.dom.wrapper = wrapperElement
    thisWidget.correctValue = initialValue
  }

  get value() {
    return this.correctValue
  }

  set value(value) {
    const thisWidget = this
    const newValue = thisWidget.parseValue(value)

    // add validation
    if (thisWidget.correctValue !== newValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue
      thisWidget.announce()
    }

    thisWidget.renderValue()
  }

  setValue(value) {
    this.value = value
  }

  parseValue(value) {
    return parseInt(value)
  }

  isValid(value) {
    return !isNaN(value)
  }

  renderValue() {
    this.dom.innerHTML = this.value
  }

  announce() {
    const thisWidget = this
    const event = new CustomEvent('updated', {
      bubbles: true,
    })

    thisWidget.dom.wrapper.dispatchEvent(event)
  }
}

export default BaseWidget
