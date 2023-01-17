/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  ;('use strict')

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice:
        '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  }

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  }

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  }

  const templates = {
    menuProduct: Handlebars.compile(
      document.querySelector(select.templateOf.menuProduct).innerHTML
    ),
    // CODE ADDED START
    cartProduct: Handlebars.compile(
      document.querySelector(select.templateOf.cartProduct).innerHTML
    ),
    // CODE ADDED END
  }

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
      app.cart.add(this.prepareCartProduct(this.prepareCartProductParams()))
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
      //console.log(this.dom.productList)

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
    update() {
      const thisCart = this
      const deliveryFee = settings.cart.defaultDeliveryFee
      let totalNumber = 0
      let subtotalPrice = 0

      for (let product of thisCart.products) {
        totalNumber += product.amount
        subtotalPrice += product.price
      }
      //thisCart.totalPrice = subtotalPrice == 0 ? 0 : subtotalPrice + deliveryFee

      //.innerText = subtotalPrice + deliveryFee
      for (let singleTotalPrice of thisCart.dom.totalPrice) {
        singleTotalPrice.innerHTML = subtotalPrice + deliveryFee
      }
      console.log(this.dom.totalPrice)
      thisCart.dom.totalNumber.innerHTML = totalNumber

      thisCart.dom.subtotalPrice.innerHTML = subtotalPrice
      thisCart.dom.deliveryFee.innerHTML = totalNumber == 0 ? 0 : deliveryFee
    }
  }

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
      thisCartProduct.dom.price = element.querySelector(
        select.cartProduct.price
      )
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit)
      thisCartProduct.dom.remove = element.querySelector(
        select.cartProduct.remove
      )
    }
    initAmountWidget() {
      const thisCartProduct = this
      thisCartProduct.amountWidget = new AmountWidget(
        thisCartProduct.dom.amountWidget
      )

      console.log('Price:', thisCartProduct.price)
      console.log('Amount:', thisCartProduct.amount)

      thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
        thisCartProduct.amount = thisCartProduct.amountWidget.value
        thisCartProduct.price =
          thisCartProduct.amount * thisCartProduct.priceSingle
        console.log('Price:', thisCartProduct.price)
        console.log('Amount:', thisCartProduct.amount)
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price
      })
    }
  }

  const app = {
    initMenu: function () {
      //console.log(this.data)
      for (let productData in this.data.products) {
        // console.log(productData)
        // console.log(this.data.products[productData])
        new Product(productData, this.data.products[productData])
      }
    },
    initData: function () {
      this.data = dataSource
    },
    initCart: function () {
      const thisApp = this
      const cartElement = document.querySelector(select.containerOf.cart)
      thisApp.cart = new Cart(cartElement)
    },
    init: function () {
      //const thisApp = this
      // console.log('*** App starting ***')
      // console.log('thisApp:', thisApp)
      // console.log('classNames:', classNames)
      // console.log('settings:', settings)
      // console.log('templates:', templates)
      this.initData()
      this.initMenu()
      this.initCart()
    },
  }

  app.init()
  //console.log(app.cart)
}
