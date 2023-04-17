export interface IComponent {
    render(parent: HTMLElement): void
}

type EventListeners = { [index: string]: (this: GlobalEventHandlers, ev: SubmitEvent) => any }

abstract class BaseComponent implements IComponent {
    componentName: string
    classes: string[]
    children: IComponent[]
    attributes: { [index: string]: string }
    eventListeners: EventListeners

    constructor(componentName: string, classes: string[], attributes: { [index: string]: string }, children: IComponent[], eventListeners: EventListeners) {
        this.componentName = componentName
        this.classes = classes
        this.children = children
        this.attributes = attributes
        this.eventListeners = eventListeners
    }

    render(parent: HTMLElement) {
        const component = document.createElement(this.componentName)

        this.classes.forEach(c => component.classList.add(c))

        for (const attribute in this.attributes) {
            component.setAttribute(attribute, this.attributes[attribute])
        }
        for (const event in this.eventListeners) {
            (component as any)[event] = this.eventListeners[event]
        }

        parent.appendChild(component)

        this.children.forEach(c => c.render(component))
    }
}

export class TextComponent implements IComponent {
    text: string

    constructor(text: string) {
        this.text = text
    }

    render(parent: HTMLElement): void {
        parent.innerText += this.text
    }

}

export class Div extends BaseComponent {
    constructor(classes: string[] = [], attributes: {} = {}, children: IComponent[] = [], eventListeners: EventListeners = {}) {
        super("div", classes, attributes, children, eventListeners)
    }
}

export class Label extends BaseComponent {
    constructor(classes: string[] = [], attributes: {} = {}, children: IComponent[] = [], eventListeners: EventListeners = {}) {
        super("label", classes, attributes, children, eventListeners)
    }
}

export class Form extends BaseComponent {
    constructor(classes: string[] = [], attributes: {}, children: IComponent[] = [], eventListeners: EventListeners = {}) {
        super("form", classes, attributes, children, eventListeners)
    }
}

export class Input extends BaseComponent {
    constructor(classes: string[] = [], attributes: {}, children: IComponent[] = [], eventListeners: EventListeners = {}) {
        super("input", classes, attributes, children, eventListeners)
    }
}

export class Button extends BaseComponent {
    constructor(classes: string[] = [], attributes: {}, children: IComponent[] = [], eventListeners: EventListeners = {}) {
        super("button", classes, attributes, children, eventListeners)
    }
}
