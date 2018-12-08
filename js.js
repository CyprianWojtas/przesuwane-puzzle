let url = "https://picsum.photos/1000?v=" + Date.now();
let rozmiarX = 4,
		rozmiarY = 4;

let proporcjaObr = 1;

var style = document.createElement('style');
document.body.appendChild(style);

var href = new URL(location.href);
if(href.searchParams.get("o") != null)
	url = href.searchParams.get("o");

if(href.searchParams.get("r") != null)
{
	rozmiarX = parseInt(href.searchParams.get("r"));
	rozmiarY = parseInt(href.searchParams.get("r"));
}

if(href.searchParams.get("rx") != null)
	rozmiarX = parseInt(href.searchParams.get("rx"));

if(href.searchParams.get("ry") != null)
	rozmiarY = parseInt(href.searchParams.get("ry"));

if (rozmiarX < 2)
	rozmiarX = 2;
if (rozmiarY < 2)
	rozmiarY = 2;

$("<img/>")
	.on('load', function()
	{
		proporcjaObr = this.naturalWidth / this.naturalHeight;
		zmienRozmiar();
		utworzPuzzle();
	})
	.on('error', function() { console.log("Błąd wczytywania obrazu"); })
	.attr("src", url);

let puzzle = [];
let puste = {x: rozmiarX - 1, y: rozmiarY - 1};

function Puzel(url, x, y)
{
	this.x = 0;
	this.y = 0;
	this.ukryty = false;

	this.elementHTML = $('<div onClick="przesuwanie(' + x+ ', ' + y + ', true)"></div>');
	this.elementHTML.css(
		{
			"background-image": 'url(' + url + ')',
			"background-position": ((100 / (rozmiarX - 1)) * x) + '% ' + ((100 / (rozmiarY - 1)) * y) + '%',
			"background-size": (100 * rozmiarX) + "% " + (100 * rozmiarY) + "%",
			"width": (100 / rozmiarX) + '%',
			"height": (100 / rozmiarY) + '%',
			"left": ((100 / rozmiarX) * x) + "%",
			"top": ((100 / rozmiarY) * y) + "%",
			"display": "none"
		});

	this.przesun = function (x, y)
	{
		this.elementHTML.css({"left": ((100 / rozmiarX) * x) + "%", "top": ((100 / rozmiarY) * y) + "%"});
		this.x = x;
		this.y = y;
	}
	this.ukryj = function ()
	{
		this.elementHTML.fadeOut();
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
		this.elementHTML.fadeIn();
	}
}

function utworzPuzzle()
{
	for (let i = 0; i < rozmiarX; i++)
	{
		puzzle[i] = [];

		for (let j = 0; j < rozmiarY; j++)
		{
			puzzle[i][j] = new Puzel(url, i, j);
			puzzle[i][j].stworz();
		}
	}

	let dostepnePola = [];
	for (let i = 0; i < rozmiarX; i++)
		for (let j = 0; j < rozmiarY; j++)
			dostepnePola.push({x: i, y: j});

	for (let i = 0; i < rozmiarX; i++)
	{
		for (let j = 0; j < rozmiarY; j++)
		{
			let pole = dostepnePola.splice(Math.random() * dostepnePola.length | 0, 1)[0];

			//puzzle[i][j].przesun(pole.x, pole.y);
			puzzle[i][j].przesun(i, j);
		}
	}

	//puzzle[Math.random() * rozmiar | 0][Math.random() * rozmiar | 0].ukryj();

	function mieszaj(ile)
	{
		if (ile > 0)
		{
			if (ile%2)
			{
				let nx = Math.random() * rozmiarX | 0;
				przesuwanie(nx, puzzle[puste.x][puste.y].y, false);
			}
			else
			{
				let ny = Math.random() * rozmiarY | 0;
				przesuwanie(puzzle[puste.x][puste.y].x, ny, false);
			}

			if (ile%(rozmiarX * 5))
				mieszaj(ile - 1);
			else
				setTimeout(() => { mieszaj(ile - 1); }, 100);
		}
		else
		{
			style.innerHTML = ".puzzle div {cursor: pointer;}";
		}
	}
	setTimeout(() =>
	{
		puzzle[puste.x][puste.y].ukryj();
		setTimeout(() => { mieszaj(rozmiarX * rozmiarY * 50); }, 500);
	}, 1000);

}


function przesuwanie(x, y, sprawdzanie)
{
	function przesunLinie(xp, yp, xo, yo, xd, yd)
	{
		for (let i = 0; i < rozmiarX; i++)
		{
			for (let j = 0; j < rozmiarY; j++)
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
			puste.x = -1;
			puste.y = -1;
			setTimeout(() =>
			{
				puzzle[px][py].pokaz();
				style.innerHTML = ".puzzle div {box-shadow: none; cursor: initial;}";
				$(".odNowa").delay(750).fadeIn();
			}, 500);
		}
	}
}
function czyUlozono()
{
	for (let i = 0; i < rozmiarX; i++)
	{
		for (let j = 0; j < rozmiarY; j++)
		{
			if(puzzle[i][j].x != i || puzzle[i][j].y != j)
				return false;
		}
	}
	return true;
}
function zmienRozmiar()
{
	let proporcjaOkn = window.innerWidth / window.innerHeight;
	if (proporcjaOkn > proporcjaObr)
	{
		$(".puzzle").css(
		{
			"width": 100 * proporcjaObr + "vh",
			"height": "100vh",
			"margin-top": "0"
		});
	}
	else
	{
		$(".puzzle").css(
		{
			"width": "100vw",
			"height": 100 / proporcjaObr + "vw",
			"margin-top": "calc(50vh - " + 100 / proporcjaObr + "vw / 2)"
		});
	}
}

window.addEventListener("resize", zmienRozmiar);
