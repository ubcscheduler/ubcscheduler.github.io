/**
 * Module to connect blocksections that have pointer-events set to none with calendarTable
 */
class BreakDragHelper {
    constructor() {
       this.foregroundElements = []
       this.mousedown = false
    }

    setMousedown(mousedown) {
        this.mousedown = mousedown
    }
    getMousedown() {
        return this.mousedown
    }

    addForegroundElement(element) {
        this.foregroundElements.push(element)
    }

    resetBlockSections() {
        if (this.mousedown) {
            this.foregroundElements.forEach(element => {
                element.style.pointerEvents = 'auto'
            })
            this.foregroundElements = []
            this.mousedown = false
        }

    }
}

export default new BreakDragHelper()