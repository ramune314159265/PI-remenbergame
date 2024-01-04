class EventRegister {
    #events = {}

    on(name, func) {
        this.#events[name] ??= []
        this.#events[name].push(func)
    }
    emit(name, ...arg) {
        if (this.#events[name] === undefined) {
            return
        }

        this.#events[name].forEach(fn => fn(...arg))
    }
}

class KeyboardComponent extends EventRegister {
    constructor(layout) {
        super()
        const layouts = {
            'calc': document.querySelector('#calcKeyboard')
        }
        this.component = document.createElement('div')
        this.component.classList.add('keyboard')
        this.component.appendChild(layouts[layout].content.cloneNode(true))

        this.component.childNodes.forEach(node => {
            if (!node.dataset?.key) {
                return
            }

            node.addEventListener('click', e => {
                this.emit('keypress', e.target.dataset.key)
            })
        })
    }
    getKeyElements() {
        return this.component.querySelectorAll(`[data-key]`)
    }
    getKeyElement(number) {
        return this.component.querySelector(`[data-key="${number}"]`)
    }
}

class OutputComponent {
    constructor() {
        this.component = document.createElement('div')
        this.component.classList.add('keyboard')
        this.component.appendChild(document.querySelector('#output').content.cloneNode(true))
        this.output = this.component.querySelector('.output')
        this.complement = this.component.querySelector('.complement')
    }
    addToOutput(number) {
        this.output.textContent += number
        this.output.scrollIntoView(false)
    }
    setComplement(number = '') {
        this.complement.textContent = number
    }
}

class GameMainComponent extends EventRegister {
    constructor() {
        super()
        this.component = document.createElement('div')
        this.component.classList.add('gameMain')
        this.component.appendChild(document.querySelector('#gameMainUI').content.cloneNode(true))
        this.output = new OutputComponent()
        this.keyboard = new KeyboardComponent('calc')

        this.component.appendChild(this.output.component)
        this.component.appendChild(this.keyboard.component)
    }
}

class PIGameBase {
    constructor(numericalSequence) {
        this.UI = new GameMainComponent()
        this.numericalSequence = numericalSequence
        this.digit = 0

        document.body.appendChild(this.UI.component)
    }
    getDigitNumber(digit = this.digit) {
        return this.numericalSequence[digit]
    }
}

class MemorizeMode extends PIGameBase {
    constructor(numericalSequence) {
        super(numericalSequence)

        this.UI.keyboard.on('keypress', number => {
            if (this.getDigitNumber() === number) {
                this.UI.output.addToOutput(number)
                this.digit++
                this.initDigit()
            }
        })

        this.initDigit()
    }
    initDigit() {
        this.UI.keyboard.getKeyElements().forEach(node => {
            node.classList.remove('correct', 'incorrect')

            node.classList.add((node.dataset.key === this.getDigitNumber()) ? 'correct' : 'incorrect')
        })
    }
}