const getTemplate = (data) => {
  const item = data.map((item) => {
    return `<li class="select__item" data-type="item" data-id="${item.id}">${item.value}</li>`
  })
  return ` 
    <div class="select__overlay" data-type="overlay"></div>
    <div class="select__input" data-type="input">
    <span class="select__text" data-type="value">React</span>
    <i class="fas fa-chevron-down" data-type="arrow"></i>
    </div>
  <div class="select__dropdown">
    <ul class="select__list">
      ${item.join(" ")}

    </ul>
  </div>
  `
}

export class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector)
    this.options = options
    this.selectedId = null
    this.#render()
    this.#setup()
  }

  #render() {
    const { data } = this.options
    this.$el.classList.add("select")
    this.$el.innerHTML = getTemplate(data)
  }

  #setup() {
    this.clickHandler = this.clickHandler.bind(this)
    this.$el.addEventListener("click", this.clickHandler)
    this.$ico = this.$el.querySelector('[data-type="arrow"]')
    this.$value = this.$el.querySelector('[data-type="value"]')
  }

  clickHandler(event) {
    const { type } = event.target.dataset
    if (type === "input") {
      this.toggle()
    } else if (type === "item") {
      const id = event.target.dataset.id
      this.select(id)
    } else if (type === "overlay") {
      this.close()
    }
  }

  get isOpen() {
    return this.$el.classList.contains("open")
  }

  get current() {
    return this.options.data.find((item) => item.id === +this.selectedId)
  }

  select(id) {
    this.selectedId = id
    this.$value.textContent = this.current.value
    this.$el
      .querySelectorAll('[data-type="item"]')
      .forEach((item) => item.classList.remove("selected"))
    this.$el.querySelector(`[data-id="${id}"]`).classList.add("selected")
    this.close()
  }

  toggle() {
    this.isOpen ? this.close() : this.open()
  }

  open() {
    this.$el.classList.add("open")
    this.$ico.classList.remove("fa-chevron-down")
    this.$ico.classList.add("fa-chevron-up")
    console.log(this.$ico)
  }

  close() {
    this.$el.classList.remove("open")
    this.$ico.classList.add("fa-chevron-down")
    this.$ico.classList.remove("fa-chevron-up")
  }
}
