'use strict';




//Gameクラス
class Game {
	constructor( width, height ) {
		this.objs = [];

		this.frame = 0;

		//もしもwidthやheightに何も代入されていなければ、320を代入する
		this.width = width || 320;
		this.height = height || 320;

		this.canvas = document.getElementById( 'canvas' );
		//canvasの横幅とたて幅
		canvas.width = this.width;
		canvas.height = this.height;

		this.ctx = canvas.getContext( '2d' );
	}

	area(){
		this.ctx.clearRect(0, 0, canvas.width, canvas.height)
		this.ctx.fillStyle = "rgba(" + [0, 0, 0, 1] + ")";
		this.ctx.globalAlpha = 0.6;
		this.ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	//start()を呼び出すことで、メインループが開始される。
	start() {
		this._main();
	}

	//メインループ
	_main() {
		//背景を黒く塗りつぶす
        // this.ctx.fillStyle = "#000";
		// this.ctx.globalAlpha = 0.5;//文字のみかかった
		// this.ctx.globalAlpha = 0.5;//文字のみかかった
		// this.ctx.fillStyle = 'pink';
		// this.ctx.globalAlpha = 0.2;
		// this.ctx.fillStyle = "white"F
		// this.ctx.fillStyle = "rgb(255, 0, 0)";
		// this.ctx.globalAlpha = 0.3;

		// this.ctx.fillStyle = 'rgb(160, 160, 255)';
		// this.ctx.globalAlpha = 0.2;
		// this.ctx.fillRect(0, 0, 150,150);

		// this.ctx.fillStyle = 'rgb(155, 155, 0)';
		// this.ctx.globalAlpha = 0.1;
		// this.ctx.fillRect(0, 0, canvas.width,canvas.height);


		// this.ctx.fillRect(0, 0,this.width,this.height);
	

        //半透明(透明度50%)の青い四角を表示
        // this.ctx.beginPath();
        // this.ctx.fillStyle = "rgba(" + [0, 0, 255, 0.5] + ")";
        // this.ctx.fillRect(0, 0, this.width, this.height);

        //無透明(透明度0%)の青い四角を表示  
        // this.ctx.beginPath();
        // this.ctx.fillStyle = "rgba(" + [0, 0, 255, 1] + ")";
        // this.ctx.fillRect(this.width, this.height, this.width, this.height);

		//ゲームに登場するものの数だけ繰り返す
		for (let i=0; i<this.objs.length; i++) {
			//ゲームに登場するもののクラスから、render()を呼び出す
			this.objs[i].render( this.ctx, this.frame );
			// console.log(this.objs[i], "vvv")
		}

		//フレーム
		this.frame++;

		//_main()を呼び出す（ループさせる）
		requestAnimationFrame(this._main.bind(this));
	}

	//ゲームにテキストなどを表示するための関数
	add( obj, x, y ) {
		obj.x = x || 0;
		obj.y = y || 0;
		this.objs.push( obj );
	}
}

//Labelクラス
class Label {
	//Labelの初期設定
	constructor( label ) {
		this._text = [];
		//表示している文字列の長さ
		this._displayLength = 0;
		//表示している場所の行数（追加）
		this._visibleLine = 0;
		this._line = 0;
		this.label = label;
		this.font = "28px 'ヒラギノ角ゴ Pro', 'Hiragino Kaku Gothic Pro', 'ＭＳ ゴシック', 'MS Gothic', sans-serif";
		this.color = '#fff';
		this.maxLength = 30;
		this.baseline = 'top';
		this.interval = 0;
	}

	//次の行への切り替え機能
	next() {
		this._visibleLine++;
		this._text = [];
		this._displayLength = 0;
	}

	//Labelを表示するための関数（メインループから呼び出される）
	render( ctx, frame ) {

		// moji
		// ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.font = this.font;
		ctx.textBaseline = this.baseline;
		// ctx.closePath();

		//文字を表示する間隔（はやさ）が0の場合は、文字を一気に表示
		if ( this.interval === 0 ) {
			//表示する文字数を、１行に表示する最大の文字数で割り、切り上げることで、その文字列が何行になるのかが分かる
			this._line = Math.ceil( this.label[ this._visibleLine ].length/this.maxLength );
			//文字列の行数だけ繰り返す
			for( var i=0; i<this._line; i++ ) {
				this._text[i] = this._text[i] || '';
				this._text[i] = this.label[ this._visibleLine ].substr( i*this.maxLength, this.maxLength );
				//文字列の表示
				ctx.fillText( this._text[i], this.x, this.y + ( i * 25 ) );
			}
		}
		//文字を表示する間隔（はやさ）が0以外の場合、一文字ずつ表示していく
		else {
			if( this._displayLength < this.label[ this._visibleLine ].length && frame%this.interval === 0 ) {
				this._text[this._line] = this._text[this._line] || '';
				//this.labelに代入されている文字列を、this._text[this._line]に一文字ずつ入れていく
				this._text[this._line] += this.label[ this._visibleLine ].charAt( this._displayLength );
				this._displayLength++;
				if ( this._displayLength % this.maxLength === 0 ) {
					this._line++;
				}
			}

			for( var i=0; i<this._line+1; i++ ) {
				this._text[i] = this._text[i] || '';
				ctx.fillText( this._text[i], this.x, this.y + ( i * 25 ) );
			}
		}
	}
}





const str = [
    'ぼくたちは駅近のおしゃれなカフェに入ってランチをしている。',
    'カフェに入って15分が経ち、注文したメニューが運ばれてきた。',
    'ぼくと◯◯はそれぞれ自分の料理を食べ始めた。',
    'さて、アイスブレイクも終盤に差しかかっているな。'
];

//ゲームのオブジェクトを640×480サイズで作る
let game = new Game( 1000, 200 );
// let game = new Game( 640, 480 );
 
//ラベルオブジェクトを作る
let label = new Label( str );
label.interval = 5;
label.maxLength = 32;
 
//add()を使って、ゲームにラベルを表示
game.add( label, 0, 0 );

//キーボードが押された時
// const abc = document.querySelector('.page00__inner');
// if(abc.css.display != none){}
// const abc = document.querySelector('#canvas');
addEventListener( "keydown", (event) => {
	const key_code = event.keyCode;
	//先ほど登録したスペースキーが押された時、label.next()を実行
	if( key_code === 32) {
		game.area();
		label.next();
	}
	//方向キーでブラウザがスクロールしないようにする
	// event.preventDefault();
}, false);

//ゲームスタート
game.area();
game.start();






// 選択肢表示のギミック
$('.js-display-choices-button').on('click', function(){
    // $('.page00__choices').css('display', 'block');
	$('.page00__words-and-deeds').css('display', 'flex');
    $('.page00__inner').css('display', 'none');
    $('.page00__button-area').css('display', 'none');
});



// グローバルナビゲーションのギミック
$(".page00__global-nav-button").click(function () {//ボタンがクリックされたら
	$(this).toggleClass('active');//ボタン自身に activeクラスを付与し
    $(".page00__global-nav").toggleClass('panelactive');//ナビゲーションにpanelactiveクラスを付与
});



// グローバルナビゲーション内の画面遷移
$(".js-lists-of-done").click(function () {
	$('.js-gnav-lists').css('display', 'none');
	$('.js-lists-of-done-div').css('display', 'block');
});
$(".js-lists-of-done-button").click(function () {
	$('.js-lists-of-done-div').css('display', 'none');
	$('.js-gnav-lists').css('display', 'block');
});



// 入力した言動をローカルストレージに保存するギミック
$(".js-words-and-deeds-button").on("click", function(){
	let titleAsKey = $(".js-words-and-deeds-title").val();
	let value = {
		cards: $(".js-words-and-deeds-cards").val(),
		text: $(".js-words-and-deeds-text").val()
		// ranking: $("#ranking").val(),
		// player_name: $("#player_name").val(),
		// memo: $("#memo").val(),
	};
	localStorage.setItem(titleAsKey, JSON.stringify(value));//JSONに変換
	//変数を渡すときは、ダブルクオーテーション等でくくらないこと！！
	// const html = '<tr><th>'+key+'</th><td>'+value.ranking+'</td><td>'+value.player_name+'</td><td>'+value.memo+'</td></tr>';
	// $("#list").append(html);
});



function alertDebug(arg) {
	//alert(arg);   // ﾃﾞﾊﾞｯｸﾞ時に有効化すると良い
 }

function save_restore1_checkbox(target_class) {
	var cbstate;

	window.addEventListener('load', function () {
		cbstate = JSON.parse(localStorage['CBState'] || '{}');
		alertDebug('cbstate = ' + JSON.stringify(cbstate));
		for (var key in cbstate) { // cbstateはobjectで、このようにforﾙｰﾌﾟすると var key はobjectのｷｰが来るのだ。知らなんだ。
			alertDebug('key=' + key);
			var el_lst = document.querySelectorAll('input[data-savekey="' + key + '"].' + target_class);
			set_checkbox_checked_all(el_lst, true);
		}

		var cb = document.getElementsByClassName(target_class);
		alertDebug('cb = ' + JSON.stringify(cb));

		for (var c = 0; c < cb.length; c++) {
			alertDebug('cb[' + c + ']:name=' + cb[c].name + ', value=' + cb[c].value);

			cb[c].addEventListener('click', function (evt) {
				var savekey = this.getAttribute('data-savekey');
				alertDebug('click:savekey_value=' + savekey + ', checked=' + this.checked);
				if (this.checked) {
				cbstate[savekey] = true;
				}
				else if (cbstate[savekey]) {
				delete cbstate[savekey];
				}
				localStorage['CBState'] = JSON.stringify(cbstate);
			});
		}
	});

	function set_checkbox_checked_all(el_lst, checked) {
		for (var c = 0; c < el_lst.length; c++) {
			var el = el_lst[c];
			alertDebug('el=' + JSON.stringify(el) + ' ,el.name=' + el.name);
			if (el) {
				alertDebug('el.checked=' + el.checked);
				el.checked = checked;
			}
		}
	}
}
save_restore1_checkbox('js-words-and-deeds-cards');