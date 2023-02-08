import { templates, select, classNames } from '../settings.js'

class Home {
  constructor(element) {
    this.render(element)
    this.initPages()
  }

  render(element) {
    const generatedHTML = templates.homePage()
    this.dom = {}
    this.dom.wrapper = element

    this.dom.wrapper.innerHTML = generatedHTML
  }

  activatePage(pageId) {
    const thisApp = this

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId)
    }

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      )
    }
  }

  initPages() {
    const thisApp = this

    thisApp.pages = document.querySelector(select.containerOf.pages).children
    thisApp.navLinks = document.querySelectorAll(select.nav.homepage)

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
  }
}

export default Home
