import Point from './Point.js'

const letters = [
	'_1', '_2', '_3',
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
	'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
	'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export default class Site extends Point
{
	/**
	 * @param {Number} x Site X position
	 * @param {Number} y Site Y position
	 */
	constructor(x, y)
	{
		super(x, y)

		this.id = letters[Site.id++]
	}
}

Site.id = 0
