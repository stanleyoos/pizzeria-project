import { settings, select, classNames } from './settings.js'
import Product from './components/Product.js'
import Cart from './components/Cart.js'
import Booking from './components/Booking.js'
import Home from './components/Home.js'

const app = {
  initPages: function () {
    const thisApp = this

    thisApp.pages = document.querySelector(select.containerOf.pages).children
    thisApp.navLinks = document.querySelectorAll(select.nav.links)

    const idFromHash = window.location.hash.replace('#/', '')
    //console.log(idFromHash)

    let pageMatchingHash = thisApp.pages[0].id

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id
        break
      }
    }

    thisApp.activatePage(pageMatchingHash)

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (e) {
        e.preventDefault()
        const clickedElement = this

        // get id from href attribute
        const id = clickedElement.getAttribute('href').replace('#', '')
        // run thisApp.activatePage with that id
        thisApp.activatePage(id)

        // change URL hash
        window.location.hash = '#/' + id
      })
    }
  },
  activatePage: function (pageId) {
    const thisApp = this

    /* add class 'active' to matching page, remove from non-matcing */
    for (let page of thisApp.pages) {
      // if (page.id == pageId) {
      //   page.classList.add(classNames.pages.active)
      // } else {
      //   page.classList.remove(classNames.pages.active)
      // }
      page.classList.toggle(classNames.pages.active, page.id == pageId)
    }

    /* add class 'active' to matching link, remove from non-matcing */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      )
    }
  },
  initBookig: function () {
    const bookingContainer = document.querySelector(select.containerOf.booking)
    new Booking(bookingContainer)
  },
  initHomePage: function () {
    const homePageContainer = document.querySelector(
      select.containerOf.homePage
    )
    new Home(homePageContainer)
  },
  initMenu: function () {
    //console.log(this.data)
    for (let productData in this.data.products) {
      // console.log(productData)
      // console.log(this.data.products[productData])
      new Product(
        this.data.products[productData].id,
        this.data.products[productData]
      )
    }
  },
  initData: function () {
    this.data = {}
    const url = settings.db.url + '/' + settings.db.products

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.data.products = data
        this.initMenu()
      })

    //console.log(this.data)
  },
  initCart: function () {
    const thisApp = this
    const cartElement = document.querySelector(select.containerOf.cart)
    thisApp.cart = new Cart(cartElement)

    this.productList = document.querySelector(select.containerOf.menu)

    this.productList.addEventListener('add-to-cart', function (e) {
      app.cart.add(e.detail.product)
    })
  },
  init: function () {
    //const thisApp = this
    // console.log('*** App starting ***')
    // console.log('thisApp:', thisApp)
    // console.log('classNames:', classNames)
    // console.log('settings:', settings)
    // console.log('templates:', templates)
    this.initPages()
    this.initData()
    // this.initMenu()
    this.initHomePage()
    this.initCart()
    this.initBookig()
  },
}

app.init()
//console.log(app.cart)
