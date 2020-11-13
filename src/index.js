import "./assets/scss/main.scss"
import "normalize.css"
import "@fortawesome/fontawesome-free/js/fontawesome"

import { library, dom } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { fab } from "@fortawesome/free-brands-svg-icons"

library.add(fas, far, fab)

dom.i2svg()

import { Select } from "./assets/js/select"

const select = new Select("#select", {
  data: [
    { id: 1, value: "React" },
    { id: 2, value: "Angular" },
    { id: 3, value: "Vue" },
    { id: 4, value: "Next" },
    { id: 5, value: "Express" },
  ],
})

window.select = select
