import { templates, select, classNames } from '../settings.js'
import utils from '../utils.js'
import AmountWidget from './AmountWidget.js'

class Product {
  constructor(id, data) {
    const thisProduct = this
    thisProduct.id = id
    thisProduct.data = data

    thisProduct.renderInMenu()
    thisProduct.getElements()
    thisProduct.initAccordion()
    thisProduct.initOrderForm()
    thisProduct.initAmountWidget()
    thisProduct.processOrder()
    //console.log(this)
  }

  renderInMenu() {
    const thisProduct = this
    const generatedHTML = templates.menuProduct(thisProduct.data)

    thisProduct.element = utils.createDOMFromHTML(generatedHTML)

    const menuContainer = document.querySelector(select.containerOf.menu)

    menuContainer.appendChild(thisProduct.element)
  }
  initAmountWidget() {
    const thisProduct = this
    thisProduct.amountWidget = new AmountWidget(
      thisProduct.dom.amountWidgetElem
    )
    thisProduct.dom.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder()
    })
  }
  getElements() {
    const thisProduct = this
    thisProduct.dom = {}
    thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
    )

    thisProduct.dom.imageWrapper = thisProduct.element.querySelector(
      select.menuProduct.imageWrapper
    )

    thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(
      select.menuProduct.clickable
    )
    thisProduct.dom.form = thisProduct.element.querySelector(
      select.menuProduct.form
    )
    //console.log(thisProduct.form)
    thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(
      select.all.formInputs
    )
    //console.log(thisProduct.formInputs)
    thisProduct.dom.cartButton = thisProduct.element.querySelector(
      select.menuProduct.cartButton
    )
    thisProduct.dom.priceElem = thisProduct.element.querySelector(
      select.menuProduct.priceElem
    )
  }
  initAccordion() {
    const thisProduct = this
    /* find the clickable trigger (the element that should react to clicking) */

    /* START: add event listener to clickable trigger on event click */
    thisProduct.dom.accordionTrigger.addEventListener(
      'click',
      function (event) {
        /* prevent default action for event */
        event.preventDefault()
        /* find active product (product that has active class) */
        const activeProduct = document.querySelector('article.active')
        //console.log(activeProduct)
        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if (activeProduct && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove('active')
        }
        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle('active')
      }
    )
  }
  initOrderForm() {
    const thisProduct = this
    //console.log('initOrderForm')
    thisProduct.dom.form.addEventListener('submit', function (event) {
      event.preventDefault()
      thisProduct.processOrder()
    })

    for (let input of thisProduct.dom.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder()
      })
    }

    thisProduct.dom.cartButton.addEventListener('click', function (event) {
      event.preventDefault()
      thisProduct.processOrder()
      thisProduct.addToCart()
    })
  }

  processOrder() {
    const thisProduct = this

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.dom.form)
    //console.log('formData', formData)

    // set price to default price
    let price = thisProduct.data.price

    // for every category (param)...
    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId]
      //console.log(paramId, param)

      // for every option in this category
      for (let optionId in param.options) {
        const condition =
          formData[paramId] && formData[paramId].includes(optionId)
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId]
        //console.log(optionId, option)

        // check if there is param with a name of paramId in formData and if it includes optionId
        if (condition) {
          // check if the option is not default
          if (!option.default) {
            // add option price to price variable
            price += option.price
            //console.log(price)
          }
        } else {
          // check if the option is default
          if (option.default) {
            // reduce price variable
            price -= option.price
            //console.log(price)
          }
        }
        const optionImage = thisProduct.dom.imageWrapper.querySelector(
          `.${paramId}-${optionId}`
        )
        //console.log(optionImage)
        if (optionImage) {
          if (condition) {
            optionImage.classList.add(classNames.menuProduct.imageVisible)
          } else {
            optionImage.classList.remove(classNames.menuProduct.imageVisible)
          }
        }
      }
    }

    // update calculated price in the HTML
    thisProduct.priceSingle = price
    price *= thisProduct.amountWidget.value

    thisProduct.dom.priceElem.innerHTML = price
  }
  addToCart() {
    // app.cart to instancja klasy Cart, tak więc mozemy odwołać się do metody add
    //app.cart.add(this.prepareCartProduct(this.prepareCartProductParams()))

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: this.prepareCartProduct(this.prepareCartProductParams()),
      },
    })

    this.element.dispatchEvent(event)
  }
  prepareCartProduct(params) {
    const thisProduct = this
    const productSummary = {
      params: params,
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.priceSingle * thisProduct.amountWidget.value,
    }
    return productSummary
  }
  prepareCartProductParams() {
    const thisProduct = this
    const formData = utils.serializeFormToObject(thisProduct.dom.form)
    const params = {}
    //console.log(formData)
    // for every category (param)...
    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId]
      params[paramId] = {
        label: param.label,
        options: {},
      }

      for (let optionId in param.options) {
        const option = param.options[optionId]

        const condition =
          formData[paramId] && formData[paramId].includes(optionId)

        if (condition) {
          //console.log(option)
          params[paramId].options[optionId] = option.label
        }
      }
    }
    //console.log(params)
    return params
  }
}

export default Product
