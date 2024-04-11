import { tick } from 'svelte';

const portal = (el: HTMLElement, target: HTMLElement | string = 'body') => {
	let targetEl;
	const update = async (newTarget: HTMLElement | string) => {
		target = newTarget;
		if (typeof target === 'string') {
			targetEl = document.querySelector(target);
			if (targetEl === null) {
				await tick();
				targetEl = document.querySelector(target);
			}
			if (targetEl === null) {
				throw new Error(`No element found matching css selector: "${target}"`);
			}
		} else if (target instanceof HTMLElement) {
			targetEl = target;
		} else {
			throw new TypeError(
				`Unknown portal target type: ${
					target === null ? 'null' : typeof target
				}. Allowed types: string (CSS selector) or HTMLElement.`
			);
		}

		targetEl.appendChild(el);
		const body = targetEl as HTMLBodyElement;

		body.style.touchAction = 'none';
		body.style.overflow = 'hidden';
		body.style.overscrollBehavior = 'contain';
		el.hidden = false;
	};
	const destroy = () => {
		if (el.parentNode) {
			const body = el.parentNode as HTMLBodyElement;

			body.style.removeProperty('touch-action');
			body.style.removeProperty('overflow');
			body.style.removeProperty('overscroll-behavior');
			el.parentNode.removeChild(el);
		}
		document.body.style.removeProperty('touch-action');
		document.body.style.removeProperty('overflow');
		document.body.style.removeProperty('overscroll-behavior');
	};

	update(target);
	return {
		update,
		destroy
	};
};

export default portal;
