import { select, classNames, settings, templates } from '../settings.js'
import utils from '../utils.js'
import CartProduct from './CartProduct.js'

class Cart {
  constructor(element) {
    this.products = []
    this.getElements(element)
    this.initActions()
    //console.log('new Cart', this)
  }

  getElements(element) {
    this.dom = []
    this.dom.wrapper = element
    this.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger)
    this.dom.productList = element.querySelector(select.cart.productList)
    this.dom.form = element.querySelector(select.cart.form)
    this.dom.address = element.querySelector(select.cart.address)
    this.dom.phone = element.querySelector(select.cart.phone)

    this.dom.deliveryFee = element.querySelector(select.cart.deliveryFee)
    this.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice)
    this.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice)
    this.dom.totalNumber = element.querySelector(select.cart.totalNumber)
  }

  initActions() {
    const thisCart = this
    thisCart.dom.toggleTrigger.addEventListener('click', () => {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive)
    })
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update()
    })
    thisCart.dom.productList.addEventListener('remove', function (e) {
      thisCart.remove(e.detail.cartProduct)
    })
    thisCart.dom.form.addEventListener('submit', function (e) {
      e.preventDefault()
      thisCart.sendOrder()
    })
  }

  sendOrder() {
    const thisCart = this
    const url = settings.db.url + '/' + settings.db.orders
    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.totalNumber == 0 ? 0 : 20,
      products: [],
    }

    for (let product of thisCart.products) {
      payload.products.push(product.getData())
    }
    //console.log(payload)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }

  add(menuProduct) {
    //console.log('adding product', menuProduct)
    const generatedHTML = templates.cartProduct(menuProduct)
    const generatedDOM = utils.createDOMFromHTML(generatedHTML)
    this.dom.productList.appendChild(generatedDOM)
    this.products.push(new CartProduct(menuProduct, generatedDOM))
    //console.log(this.products)
    this.update()
  }

  remove(cartProduct) {
    // console.log('test')
    cartProduct.dom.wrapper.remove()
    console.log(this.products)
    console.log(cartProduct)
    const index = this.products.indexOf(cartProduct)
    console.log(index)
    this.products.splice(index, 1)
    this.update()
  }
  update() {
    const thisCart = this
    const deliveryFee = settings.cart.defaultDeliveryFee
    let totalNumber = 0
    let subtotalPrice = 0

    for (let product of thisCart.products) {
      totalNumber += product.amount
      subtotalPrice += product.price
    }

    thisCart.totalPrice = subtotalPrice == 0 ? 0 : subtotalPrice + deliveryFee
    thisCart.totalNumber = totalNumber
    thisCart.subtotalPrice = subtotalPrice

    thisCart.dom.totalNumber.innerHTML = totalNumber
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice
    thisCart.dom.deliveryFee.innerHTML = totalNumber == 0 ? 0 : deliveryFee

    //.innerText = subtotalPrice + deliveryFee
    for (let singleTotalPrice of thisCart.dom.totalPrice) {
      thisCart.totalNumber === 0
        ? (singleTotalPrice.innerHTML = 0)
        : (singleTotalPrice.innerHTML = subtotalPrice + deliveryFee)
    }
  }
}

export default Cart
