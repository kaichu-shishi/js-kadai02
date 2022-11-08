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
			console.log(this.objs[i], "vvv")
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
addEventListener( "keydown", (event) => {
	const key_code = event.keyCode;
	//先ほど登録したスペースキーが押された時、label.next()を実行
	if( key_code === 32) {
		game.area();
		label.next();
	}
	event.preventDefault();		//方向キーでブラウザがスクロールしないようにする
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

// $("#g-nav a").click(function () {//ナビゲーションのリンクがクリックされたら
//     $(".openbtn").removeClass('active');//ボタンの activeクラスを除去し
//     $("#g-nav").removeClass('panelactive');//ナビゲーションのpanelactiveクラスも除去
// });

//canvasでは消すのはclearRectしかない！！