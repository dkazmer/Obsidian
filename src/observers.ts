export class Observer {
	#observer: MutationObserver;
	#notify: Notify = {};
	#isSuspended = true;

	constructor(
		private target: Node,
		private settings?: MutationObserverInit
	) {
		this.#observer = new MutationObserver((list, obs) => {
			for (const mutation of list) {
				switch (mutation.type) {
					case 'childList':
						{
							const { addedNodes, removedNodes } = mutation;
							addedNodes.length && this.#notify.added?.(addedNodes);
							removedNodes.length && this.#notify.removed?.(removedNodes);
						}
						break;

					case 'attributes':
						{
							const { target: t, attributeName } = mutation;
							this.#notify.attr?.({ attribute: attributeName, target: t });
						}
						break;

					default:
						break;
				}
			}
		});

		this.restart();
	}

	/**
	 * restart
	 */
	public restart() {
		if (this.#isSuspended === false) {
			console.warn('Observer is already running...');
			return;
		}

		this.#observer.observe(this.target, { attributes: true, childList: true, subtree: true, ...this.settings });
		this.#isSuspended = false;
	}

	/**
	 * suspend
	 */
	public suspend() {
		if (this.#isSuspended === true) {
			console.warn('Observer is already suspended...');
			return;
		}

		this.#observer.disconnect();
		this.#isSuspended = true;
	}

	/**
	 * kill
	 */
	public kill() {
		this.suspend();

		for (const prop in this) {
			Object.hasOwn(this, prop) && delete this[prop];
		}
	}

	/**
	 * on
	 */
	public on(name: keyof Notify, fn: Fn) {
		this.#notify[name] = (e: any) => fn.call(this, e);
		return this;
	}
}

interface Notify<T = void> {
	attr?: Fn<T, { attribute: string | null; target: Node }>;
	added?: Fn<T, NodeList>;
	removed?: Fn<T, NodeList>;
}

type Fn<T = void, U = any> = (...args: U[]) => T;
