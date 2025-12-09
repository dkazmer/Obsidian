import type { Mock } from 'vitest/dist/index';
import { Obsidium } from './obsidium';

const callbacks = {
	mo(nodes: NodeList) {
		return 'mutated!';
	},
	ro(entry: ResizeObserverEntry) {
		return 'resized!';
	},
	io(entry: IntersectionObserverEntry) {
		return 'intersected!';
	}
};

describe('Mutation Observer', () => {
	const elem = mockDOM();
	const mo = Obsidium.mutation(elem);

	it('should create', () => {
		expect<Obsidium>(mo).toBeTruthy();
	});

	it('should indicate a mutation: add', async () => {
		const spy = vi.spyOn(callbacks, 'mo');

		return new Promise<NodeList>(res => {
			mo.on('add', added => {
				callbacks.mo(added);
				res(added);
				setTimeout(() => mo.dump(), 0);
				// mo.suspend();
				document.body.removeChild(elem);
			});

			mockDOM(elem);
		}).then(nodes => {
			expect<Mock>(spy).toHaveBeenCalledExactlyOnceWith<NodeList[]>(nodes);
			expect<Node>(nodes[0]!).toBe<Node>(elem.childNodes[0]!);
		});
		/* .catch(() => {
				expect<Mock>(spy).toHaveBeenCalledTimes(0);
			}); */
	});
});

describe('Resize Observer', () => {
	const elem = mockDOM();
	const ro = Obsidium.resize(elem);

	it('should create', () => {
		expect<Obsidium>(ro).toBeTruthy();
	});

	it.skip('should indicate a resize', async () => {
		const spy = vi.spyOn(callbacks, 'ro');

		return new Promise<ResizeObserverEntry>(res => {
			ro.on('resize', entry => {
				callbacks.ro(entry);
				res(entry);
				setTimeout(() => ro.dump(), 0);
				// ro.suspend();
				document.body.removeChild(elem);
			});

			elem.style.height = '25px';
		}).then(entry => {
			expect<Mock>(spy).toHaveBeenCalledExactlyOnceWith<ResizeObserverEntry[]>(entry);
		});
	});
});

describe('Intersection Observer', () => {
	const elem = mockDOM();
	const io = Obsidium.intersection(elem);

	it('should create', () => {
		expect<Obsidium>(io).toBeTruthy();
	});

	it.skip('should indicate an intersection', async () => {
		const spy = vi.spyOn(callbacks, 'io');

		return new Promise<IntersectionObserverEntry>(res => {
			io.on('intersect', entry => {
				callbacks.io(entry);
				res(entry);
				setTimeout(() => io.dump(), 0);
				// io.suspend();
				document.body.removeChild(elem);
			});

			// elem.style.height = '25px';
		}).then(entry => {
			expect<Mock>(spy).toHaveBeenCalledExactlyOnceWith<IntersectionObserverEntry[]>(entry);
		});
	});
});

function mockDOM(container?: HTMLElement) {
	const div = document.createElement('div');
	container ? container.append(div) : document.body.append(div);
	return div;
}
