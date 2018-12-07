let url = "https://placekitten.com/1200";
let rozmiar = 4;

var style = document.createElement('style');
document.body.appendChild(style);

var href = new URL(location.href);
if(href.searchParams.get("o") != null)
	url = href.searchParams.get("o");

if(href.searchParams.get("r") != null)
	rozmiar = parseInt(href.searchParams.get("r"));

let puzzle = [];

function Puzel(url, x, y)
{
	this.x = 0;
	this.y = 0;
	this.ukryty = false;

	this.elementHTML = $('<div style="background: url(' + url + '); background-position-x: ' + (- (100 / rozmiar) * x) + 'vh; background-position-y: ' + (- (100 / rozmiar) * y) + 'vh; top: 0; left: 0; width: ' + (100 / rozmiar) + 'vh; height: ' + (100 / rozmiar) + 'vh;" onClick="przesuwanie(' + x+ ', ' + y + ', true)"></div>');

	this.przesun = function (x, y)
	{
		this.elementHTML.css({"left": ((100 / rozmiar) * x) + "vh", "top": ((100 / rozmiar) * y) + "vh"});
		this.x = x;
		this.y = y;
	}
	this.ukryj = function ()
	{
		this.elementHTML.fadeOut(0);
		this.ukryty = true;
	}
	this.pokaz = function ()
	{
		this.elementHTML.fadeIn();
		this.ukryty = false;
	}
	this.stworz = function ()
	{
		$(".puzzle").append(this.elementHTML);
	}
}

for (let i = 0; i < rozmiar; i++)
{
	puzzle[i] = [];

	for (let j = 0; j < rozmiar; j++)
	{
		puzzle[i][j] = new Puzel(url, i, j);
		puzzle[i][j].stworz();
	}
}

let dostepnePola = [];
for (let i = 0; i < rozmiar; i++)
	for (let j = 0; j < rozmiar; j++)
		dostepnePola.push({x: i, y: j});

for (let i = 0; i < rozmiar; i++)
{
	for (let j = 0; j < rozmiar; j++)
	{
		let pole = dostepnePola.splice(Math.random() * dostepnePola.length | 0, 1)[0];

		//puzzle[i][j].przesun(pole.x, pole.y);
		puzzle[i][j].przesun(i, j);
	}
}

//puzzle[Math.random() * rozmiar | 0][Math.random() * rozmiar | 0].ukryj();
let puste = {x: rozmiar - 1, y: rozmiar - 1};
puzzle[puste.x][puste.y].ukryj();

function mieszaj(ile)
{
	if (ile > 0)
	{
		if (ile%2)
		{
			let nx = Math.random() * rozmiar | 0;
			przesuwanie(nx, puzzle[puste.x][puste.y].y, false);
		}
		else
		{
			let ny = Math.random() * rozmiar | 0;
			przesuwanie(puzzle[puste.x][puste.y].x, ny, false);
		}

		if (ile%(rozmiar * 5))
			mieszaj(ile - 1);
		else
			setTimeout(() => { mieszaj(ile - 1); }, 100);
	}
	else
	{
		style.innerHTML = ".puzzle div {cursor: pointer;}";
	}
}
setTimeout(() => { mieszaj(Math.pow(rozmiar, 2) * 50); }, 500);


function przesuwanie(x, y, sprawdzanie)
{
	function przesunLinie(xp, yp, xo, yo, xd, yd)
	{
		for (let i = 0; i < rozmiar; i++)
		{
			for (let j = 0; j < rozmiar; j++)
			{
				if
				(
					puzzle[i][j].x >= xo &&
					puzzle[i][j].x <= xd &&
					puzzle[i][j].y >= yo &&
					puzzle[i][j].y <= yd
				)
				puzzle[i][j].przesun(puzzle[i][j].x + xp, puzzle[i][j].y + yp);
			}
		}
	}

	let i = puste.x;
	let j = puste.y;

	if (i == -1 || j == -1)
		return;

	if (puzzle[i][j].x == puzzle[x][y].x)
	{
		if (puzzle[i][j].y > puzzle[x][y].y)
		{
			przesunLinie(0, 1, puzzle[x][y].x, puzzle[x][y].y, puzzle[i][j].x, puzzle[i][j].y);
			puzzle[i][j].przesun(puzzle[x][y].x, puzzle[x][y].y - 1);
		}
		else if (puzzle[i][j].y < puzzle[x][y].y)
		{
			przesunLinie(0, -1, puzzle[i][j].x, puzzle[i][j].y, puzzle[x][y].x, puzzle[x][y].y);
			puzzle[i][j].przesun(puzzle[x][y].x, puzzle[x][y].y + 1);
		}
	}
	else if (puzzle[i][j].y == puzzle[x][y].y)
	{
		if (puzzle[i][j].x > puzzle[x][y].x)
		{
			przesunLinie(1, 0, puzzle[x][y].x, puzzle[x][y].y, puzzle[i][j].x, puzzle[i][j].y);
			puzzle[i][j].przesun(puzzle[x][y].x - 1, puzzle[x][y].y);
		}
		else if (puzzle[i][j].x < puzzle[x][y].x)
		{
			przesunLinie(-1, 0, puzzle[i][j].x, puzzle[i][j].y, puzzle[x][y].x, puzzle[x][y].y);
			puzzle[i][j].przesun(puzzle[x][y].x + 1, puzzle[x][y].y);
		}
	}
	if (sprawdzanie)
	{
		if(czyUlozono())
		{
			let px = puste.x;
			let py = puste.y;
			setTimeout(() =>
			{
				puzzle[px][py].pokaz();
				style.innerHTML = ".puzzle div {box-shadow: none; cursor: initial;}";
				$(".odNowa").delay(750).fadeIn();
			}, 500);
			puste.x = -1;
			puste.y = -1;
		}
	}
}
function czyUlozono()
{
	for (let i = 0; i < rozmiar; i++)
	{
		for (let j = 0; j < rozmiar; j++)
		{
			if(puzzle[i][j].x != i || puzzle[i][j].y != j)
				return false;
		}
	}
	return true;
}
