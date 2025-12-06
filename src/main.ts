import { Observer } from './observers';

window.o = new Observer(document.body)
	.on('added', x => console.log('>> added!', x))
	.on('removed', y => console.log('>> remved!', y))
	.on('attr', z => console.log('>> attr!', z));

declare global {
	var o: Observer;
}
