/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  ;('use strict')

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  }

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  }

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
  }

  const templates = {
    menuProduct: Handlebars.compile(
      document.querySelector(select.templateOf.menuProduct).innerHTML
    ),
  }

  class Product {
    constructor(id, data) {
      this.id = id
      this.data = data

      this.renderInMenu()
      this.initAccordion()
    }

    renderInMenu() {
      const generatedHTML = templates.menuProduct(this.data)

      this.element = utils.createDOMFromHTML(generatedHTML)

      const menuContainer = document.querySelector(select.containerOf.menu)

      menuContainer.appendChild(this.element)
    }
    initAccordion() {
      const thisProduct = this
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = this.element.querySelector(
        select.menuProduct.clickable
      )
      console.log(clickableTrigger)

      /* START: add event listener to clickable trigger on event click */
      clickableTrigger.addEventListener('click', function (event) {
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
      })
    }
  }

  const app = {
    initMenu: function () {
      console.log(this.data)
      for (let productData in this.data.products) {
        // console.log(productData)
        // console.log(this.data.products[productData])
        new Product(productData, this.data.products[productData])
      }
    },
    initData: function () {
      this.data = dataSource
    },
    init: function () {
      const thisApp = this
      console.log('*** App starting ***')
      console.log('thisApp:', thisApp)
      console.log('classNames:', classNames)
      console.log('settings:', settings)
      console.log('templates:', templates)
      this.initData()
      this.initMenu()
    },
  }

  app.init()
}
