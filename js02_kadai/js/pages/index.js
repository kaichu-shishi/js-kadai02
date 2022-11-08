// 画面遷移のギミック
// $('.js-game-start').on('click', function(){
//     $('.js-first-page').css('display','none');
// });

// 文字送りのギミック


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

	//start()を呼び出すことで、メインループが開始される。
	start() {
		this._main();
	}

	//メインループ
	_main() {
		//背景を黒く塗りつぶす
        this.ctx.fillStyle = "#000";
		// this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
		this.ctx.fillRect( 0, 0, this.width, this.height );

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
		ctx.fillStyle = this.color;
		ctx.font = this.font;
		ctx.textBaseline = this.baseline;

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
    '僕は◯◯。',
    '今日は生まれて初めての日だ。',
    '僕は今日、生まれて初めて女性とデートしに行く。',
    'でも、一発でうまくいこうなんてハナから考えちゃいない。',
    '挑戦しまくって、失敗から学ぶ。',
    '経験値を積み重ねて、男としてのレベルを上げていくんだ。',
    'そして最終的には、圧倒的なオスである「ライオンキング」になるんだ。',
    'バカにするやつにはそのまま笑わせておけばいい。',
    '自分と向き合い、自分を超えていく。',
    '他人なんか関係ない。僕がそれをやりたいからやるだけだ。',
    'それじゃあ、自分磨きの旅に出発だ！！'
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
addEventListener( "keydown", () => {
	const key_code = event.keyCode;
	//先ほど登録したスペースキーが押された時、label.next()を実行
	if( key_code === 32) label.next();
	event.preventDefault();		//方向キーでブラウザがスクロールしないようにする
}, false);

//ゲームスタート
game.start();
