const letters = [
	'_1', '_2', '_3',
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
	'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
	'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export default class Site
{
	constructor(x, y)
	{
		this.x = x
		this.y = y

		this.id = letters[Site.id++]
	}
}

Site.id = 0