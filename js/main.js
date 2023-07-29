enchant();

const reader = new FileReader();

var nexted_flag = false;
var preved_flag = false;
var right_count = 0;
var left_count = 0;
var point = 0;
var log;
var turn;
var cool;
var hot;

window.onload = function() {
	let input = document.getElementById('file');

	input.addEventListener('change', () => {
		console.log(input.files[0]);
		reader.readAsText(input.files[0]);
	});
};

document.onkeyup = function (e) {
	if (e.key == "ArrowRight") nexted_flag = false;
	if (e.key == "ArrowLeft") preved_flag = false;
}

reader.onload = () => {
	console.log(reader.result.split(/\n/));
	log = reader.result.split(/\n/);
	View();
}

function View() {
	function MapView()
	{
		var scene = new Scene();
		for (let y=0; y < size_y; y++) {
			var line = log[pointer+y].split(/,/).map( str => parseInt(str, 10));

			for (let x=0; x < size_x; x++) {
				var object = new Sprite(32, 32);
				var img_path = ""
				switch (line[x]) {
					case 0:
						img_path = '../img/None.png';
						break;
					case 2:
						img_path = '../img/Block.png';
						break;
					case 3:
						img_path = '../img/Item.png';
						break;
				}
				object.image = core.assets[img_path];
				object.x = x*32;
				object.y = y*32;
				scene.addChild(object);
			}
		}

		pointer = pointer + size_y;

		cool = new Sprite(32, 32);
		cool.image = core.assets['../img/Cool.png'];
		var [ cool_x, cool_y ] = log[pointer].split(/,/).map( str => parseInt(str, 10));
		console.log(cool_x);
		console.log(cool_y);
		cool.x = cool_x*32;
		cool.y = cool_y*32;
		scene.addChild(cool);
		pointer++;

		hot = new Sprite(32, 32);
		hot.image = core.assets['../img/Hot.png'];
		var [ hot_x, hot_y ] = log[pointer].split(/,/).map( str => parseInt(str, 10));
		console.log(hot_x);
		console.log(hot_y);
		hot.x = hot_x*32;
		hot.y = hot_y*32;
		scene.addChild(hot);
		pointer++;

		if (pointer == size_y + 2)
		{
			[ cool_name, hot_name ] = log[pointer].split(/,/);
		}
		else
		{
			[ cool_item, hot_item ] = log[pointer].split(/,/).map( str => parseInt(str,10));
		}

		scene.addEventListener('enterframe', function() 
		{
			if(core.input.right)
			{
				right_count++;
			}
			if(!nexted_flag)
			{
				right_count = 0;
			}
			if(core.input.right && right_count%10 == 0 && log[pointer+1] !== 'gameend')
			{
				pointer++;
				nexted_flag = true;
				console.log(log[pointer]);
				MapView();
			}
			if(core.input.left)
			{
				left_count++;
			}
			if(!preved_flag)
			{
				left_count = 0;
			}
			if(core.input.left && left_count%10 == 0 && pointer >= 39)
			{
				pointer -= 39;
				preved_flag = true;
				console.log(log[pointer]);
				MapView();
			}
		})

		console.log(pointer);
		core.replaceScene(scene);
	}

	var pointer = 0;
	var cool_name;
	var hot_name;
	var cool_item;
	var hot_item;
	var map_name = log[0];
	turn = log[1];
	var [ size_x, size_y ] = log[2].split(/,/).map( str => parseInt(str, 10));

	console.log(map_name);
	console.log(turn);
	console.log(size_x);
	console.log(size_y);

	var core = new Core(672, 672);
	core.preload(['../img/None.png','../img/Block.png','../img/Item.png','../img/Cool.png','../img/Hot.png']);
	core.onload = function() {
		log = log.slice(3);
		MapView(0);
	};


	core.start();
}
