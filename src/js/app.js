import { settings, select } from './settings.js'
import Product from './components/Product.js'
import Cart from './components/Cart.js'

const app = {
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
    this.initData()
    // this.initMenu()
    this.initCart()
  },
}

app.init()
//console.log(app.cart)
