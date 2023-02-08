import { templates } from '../settings.js'

class Home {
  constructor(element) {
    this.render(element)
  }

  render(element) {
    const generatedHTML = templates.homePage()
    this.dom = {}
    this.dom.wrapper = element

    this.dom.wrapper.innerHTML = generatedHTML
  }
}

export default Home
