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
	// splitで改行区切りにし、filterで空行を無視している
	log = reader.result.split(/\r\n/).filter(v => v);
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
						img_path = 'img/None.png';
						break;
					case 2:
						img_path = 'img/Block.png';
						break;
					case 3:
						img_path = 'img/Item.png';
						break;
				}
				object.image = core.assets[img_path];
				object.x = x*32;
				object.y = y*32;
				scene.addChild(object);
			}
		}

		pointer += size_y;

		var [ cool_x, cool_y ] = log[pointer].split(/,/).map( str => parseInt(str, 10));
		pointer++;

		var [ hot_x, hot_y ] = log[pointer].split(/,/).map( str => parseInt(str, 10));
		pointer++;

		[ cool_item, hot_item ] = log[pointer].split(/,/).map( str => parseInt(str,10));

		if (log[pointer + 1] == "gameend")
		{
			end_caution = "game end !!";
		}
		else
		{
			end_caution = "";
		}

		var test_data = [`map: ${map_name}`,`remain turn: ${turn}`,`cool: ${cool_name} item: ${cool_item}`,`hot: ${hot_name} item ${hot_item}`,`result: ${result_text}`,reason,end_caution];

		test_data.forEach((elem, index) => {
			var label = new Label(elem);
			label.font = "24px Palatino";
			label.x = size_x*32 + 10;
			label.y = 20*index+10;
			scene.addChild(label);
		})

		cool = new Sprite(32, 32);
		cool.image = core.assets['img/Cool.png'];
		cool.x = cool_x*32;
		cool.y = cool_y*32;
		scene.addChild(cool);

		hot = new Sprite(32, 32);
		hot.image = core.assets['img/Hot.png'];
		hot.x = hot_x*32;
		hot.y = hot_y*32;
		scene.addChild(hot);

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
			if(core.input.right && right_count%10 == 0)
			{
				if (log[pointer+1] == "gameend")
				{
					end_caution = "game end!!";
					pointer -= size_y + 2;
				}
				else
				{
					end_caution = "";
					turn--;
					pointer++;
				}

				nexted_flag = true;
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
				end_caution = "";
				turn++;
				pointer -= size_y*2 + 5;
				preved_flag = true;
				MapView();
			}
		})

		core.replaceScene(scene);
	}

	var pointer = 0;
	var result_text, end_caution;
	var cool_item = 0;
	var hot_item = 0;
	var [ cool_name, hot_name ] = log[0].split(/,/);
	var map_name = log[1];
	turn = log[2];
	var [ size_x, size_y ] = log[3].split(/,/).map( str => parseInt(str, 10));
	var [ winner, result, reason ]  = log.pop().split(/,/);
	if (winner)
	{
		result_text = `${winner} win`;
	}
	else
	{
		result_text = result;
	}

	console.log(`map name: ${map_name}`);
	console.log(`turn: ${turn}`);
	console.log(`map size x: ${size_x}`);
	console.log(`map size y: ${size_y}`);
	console.log(`cool name: ${cool_name}`);
	console.log(`hot name: ${hot_name}`);
	console.log(`result: ${result_text}`);

	var core = new Core(960, 960);
	core.preload(['img/None.png','img/Block.png','img/Item.png','img/Cool.png','img/Hot.png']);
	core.onload = function() {
		log = log.slice(4);
		MapView(0);
	};


	core.start();
}
