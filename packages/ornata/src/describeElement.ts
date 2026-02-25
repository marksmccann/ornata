/**
 * Describes an element in a human-readable format (e.g. "div", "input[name="name"]", "button.btn.btn-primary")
 * @param element The element to describe.
 * @returns The description of the element.
 * @private
 */
export default function describeElement(element: Element): string {
    let description = element.tagName.toLowerCase();

    if (element.id) {
        description += `#${element.id}`;
    } else if (element.hasAttribute('name')) {
        description += `[name="${element.getAttribute('name')}"]`;
    } else if (element.classList.length > 0) {
        const classes = Array.from(element.classList).slice(0, 3);
        description += `.${classes.join('.')}`;
    }

    return description;
}
