import { select } from '../settings.js'
import AmountWidget from './AmountWidget.js'

class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this
    thisCartProduct.id = menuProduct.id
    thisCartProduct.name = menuProduct.name
    thisCartProduct.amount = menuProduct.amount
    thisCartProduct.priceSingle = menuProduct.priceSingle
    thisCartProduct.price = menuProduct.price
    thisCartProduct.params = menuProduct.params
    this.getElements(element)
    this.initAmountWidget()
    this.initActions()
    //console.log('thisCartProduct', thisCartProduct)
  }
  getElements(element) {
    const thisCartProduct = this
    thisCartProduct.dom = {}
    // element = generatedDOM
    thisCartProduct.dom.wrapper = element
    thisCartProduct.dom.amountWidget = element.querySelector(
      select.cartProduct.amountWidget
    )
    thisCartProduct.dom.price = element.querySelector(select.cartProduct.price)
    thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit)
    thisCartProduct.dom.remove = element.querySelector(
      select.cartProduct.remove
    )
  }

  getData() {
    const data = {}
    data.id = this.id
    data.name = this.name
    data.amount = this.amount
    data.price = this.price
    data.priceSingle = this.priceSingle
    data.params = this.params
    return data
  }
  initAmountWidget() {
    const thisCartProduct = this
    thisCartProduct.amountWidget = new AmountWidget(
      thisCartProduct.dom.amountWidget
    )

    //console.log('Price:', thisCartProduct.price)
    //console.log('Amount:', thisCartProduct.amount)

    thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
      thisCartProduct.amount = thisCartProduct.amountWidget.value
      thisCartProduct.price =
        thisCartProduct.amount * thisCartProduct.priceSingle
      //console.log('Price:', thisCartProduct.price)
      //console.log('Amount:', thisCartProduct.amount)
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price
    })
  }
  remove() {
    const thisCartProduct = this

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    })

    thisCartProduct.dom.wrapper.dispatchEvent(event)
  }
  initActions() {
    const thisCartProduct = this
    thisCartProduct.dom.remove.addEventListener('click', function (e) {
      e.preventDefault()
      console.log('remove')
      thisCartProduct.remove()
    })
    thisCartProduct.dom.edit.addEventListener('click', function (e) {
      e.preventDefault()
      console.log('edit')
    })
  }
}

export default CartProduct
