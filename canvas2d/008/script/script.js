
// グローバル汚染を避けるために即時関数を使って全体を囲う
(() => {
    /**
     * 描画対象となる Canvas Element
     * @type {HTMLCanvasElement}
     */
    let canvas = null;
    /**
     * Canvas2D API のコンテキスト
     * @type {CanvasRenderingContext2D}
     */
    let ctx = null;
    /**
     * イメージのインスタンス
     * @type {Image}
     */
    let image = null;

    /**
     * ページのロードが完了したときに発火する load イベント
     */
    window.addEventListener('load', () => {
        // まず最初に画像の読み込みを開始する
        imageLoader('./image/color.jpg', (loadedImage) => {
            // 引数経由で画像を受け取り変数に代入しておく
            image = loadedImage;
            // 初期化処理を行う
            initialize();
            // 描画処理を行う
            render();
        });
    }, false);

    /**
     * canvas やコンテキストを初期化する
     */
    function initialize(){
        // querySelector を利用して canvas を参照
        canvas = document.body.querySelector('#main_canvas');
        // canvas の大きさをウィンドウ全体を覆うように変更する
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // canvas からコンテキストを取得する
        ctx = canvas.getContext('2d');
    }

    /**
     * 描画処理を行う
     */
    function render(){
        // 画像を描画する（等倍）
        ctx.drawImage(image, 100, 100);
        // 画像を描画する（大きさを指定）
        ctx.drawImage(image, 300, 100, 200, 200);
        // 画像を描画する（一部を切り出し＋大きさを指定）
        ctx.drawImage(image, 16, 16, 96, 96, 100, 300, 50, 50);
    }

    /**
     * 特定の範囲におけるランダムな整数の値を生成する
     * @param {number} range - 乱数を生成する範囲（0 以上 ～ range 未満）
     */
    function generateRandomInt(range){
        let random = Math.random();
        return Math.floor(random * range);
    }

    /**
     * 矩形を描画する
     * @param {number} x - 塗りつぶす矩形の左上角の X 座標
     * @param {number} y - 塗りつぶす矩形の左上角の Y 座標
     * @param {number} width - 塗りつぶす矩形の横幅
     * @param {number} height - 塗りつぶす矩形の高さ
     * @param {string} [color] - 矩形を塗りつぶす際の色
     */
    function drawRect(x, y, width, height, color){
        // 色が指定されている場合はスタイルを設定する
        if(color != null){
            ctx.fillStyle = color;
        }
        ctx.fillRect(x, y, width, height);
    }

    /**
     * 線分を描画する
     * @param {number} x1 - 線分の始点の X 座標
     * @param {number} y1 - 線分の始点の Y 座標
     * @param {number} x2 - 線分の終点の X 座標
     * @param {number} y2 - 線分の終点の Y 座標
     * @param {string} [color] - 線を描画する際の色
     * @param {number} [width=1] - 線幅
     */
    function drawLine(x1, y1, x2, y2, color, width = 1){
        // 色が指定されている場合はスタイルを設定する
        if(color != null){
            ctx.strokeStyle = color;
        }
        // 線幅を設定する
        ctx.lineWidth = width;
        // パスの設定を開始することを明示する
        ctx.beginPath();
        // パスの始点を設定する
        ctx.moveTo(x1, y1);
        // 直線のパスを終点座標に向けて設定する
        ctx.lineTo(x2, y2);
        // パスを閉じることを明示する
        ctx.closePath();
        // 設定したパスで線描画を行う
        ctx.stroke();
    }

    /**
     * 多角形を描画する
     * @param {Array<number>} points - 多角形の各頂点の座標
     * @param {string} [color] - 多角形を描画する際の色
     */
    function drawPolygon(points, color){
        // points が配列であるかどうか確認し、多角形を描くために
        // 十分な個数のデータが存在するか調べる
        if(Array.isArray(points) !== true || points.length < 6){
            return;
        }
        // 色が指定されている場合はスタイルを設定する
        if(color != null){
            ctx.fillStyle = color;
        }
        // パスの設定を開始することを明示する
        ctx.beginPath();
        // パスの始点を設定する
        ctx.moveTo(points[0], points[1]);
        // 各頂点を結ぶパスを設定する
        for(let i = 2; i < points.length; i += 2){
            ctx.lineTo(points[i], points[i + 1]);
        }
        // パスを閉じることを明示する
        ctx.closePath();
        // 設定したパスで多角形の描画を行う
        ctx.fill();
    }

    /**
     * 円を描画する
     * @param {number} x - 円の中心位置の X 座標
     * @param {number} y - 円の中心位置の Y 座標
     * @param {number} radius - 円の半径
     * @param {string} [color] - 円を描画する際の色
     */
    function drawCircle(x, y, radius, color){
        // 色が指定されている場合はスタイルを設定する
        if(color != null){
            ctx.fillStyle = color;
        }
        // パスの設定を開始することを明示する
        ctx.beginPath();
        // 円のパスを設定する
        ctx.arc(x, y, radius, 0.0, Math.PI * 2.0);
        // パスを閉じることを明示する
        ctx.closePath();
        // 設定したパスで円の描画を行う
        ctx.fill();
    }

    /**
     * 扇形を描画する
     * @param {number} x - 扇形を形成する円の中心位置の X 座標
     * @param {number} y - 扇形を形成する円の中心位置の Y 座標
     * @param {number} radius - 扇形を形成する円の半径
     * @param {number} startRadian - 扇形の開始角
     * @param {number} endRadian - 扇形の終了角
     * @param {string} [color] - 扇形を描画する際の色
     */
    function drawFan(x, y, radius, startRadian, endRadian, color){
        // 色が指定されている場合はスタイルを設定する
        if(color != null){
            ctx.fillStyle = color;
        }
        // パスの設定を開始することを明示する
        ctx.beginPath();
        // パスを扇形を形成する円の中心に移動する
        ctx.moveTo(x, y);
        // 円のパスを設定する
        ctx.arc(x, y, radius, startRadian, endRadian);
        // パスを閉じることを明示する
        ctx.closePath();
        // 設定したパスで扇形の描画を行う
        ctx.fill();
    }

    /**
     * 線分を二次ベジェ曲線で描画する
     * @param {number} x1 - 線分の始点の X 座標
     * @param {number} y1 - 線分の始点の Y 座標
     * @param {number} x2 - 線分の終点の X 座標
     * @param {number} y2 - 線分の終点の Y 座標
     * @param {number} cx - 制御点の X 座標
     * @param {number} cy - 制御点の Y 座標
     * @param {string} [color] - 線を描画する際の色
     * @param {number} [width=1] - 線幅
     */
    function drawQuadraticBezier(x1, y1, x2, y2, cx, cy, color, width = 1){
        // 色が指定されている場合はスタイルを設定する
        if(color != null){
            ctx.strokeStyle = color;
        }
        // 線幅を設定する
        ctx.lineWidth = width;
        // パスの設定を開始することを明示する
        ctx.beginPath();
        // パスの始点を設定する
        ctx.moveTo(x1, y1);
        // 二次ベジェ曲線の制御点と終点を設定する
        ctx.quadraticCurveTo(cx, cy, x2, y2);
        // パスを閉じることを明示する
        ctx.closePath();
        // 設定したパスで線描画を行う
        ctx.stroke();
    }

    /**
     * 線分を三次ベジェ曲線で描画する
     * @param {number} x1 - 線分の始点の X 座標
     * @param {number} y1 - 線分の始点の Y 座標
     * @param {number} x2 - 線分の終点の X 座標
     * @param {number} y2 - 線分の終点の Y 座標
     * @param {number} cx1 - 始点の制御点の X 座標
     * @param {number} cy1 - 始点の制御点の Y 座標
     * @param {number} cx2 - 終点の制御点の X 座標
     * @param {number} cy2 - 終点の制御点の Y 座標
     * @param {string} [color] - 線を描画する際の色
     * @param {number} [width=1] - 線幅
     */
    function drawCubicBezier(x1, y1, x2, y2, cx1, cy1, cx2, cy2, color, width = 1){
        // 色が指定されている場合はスタイルを設定する
        if(color != null){
            ctx.strokeStyle = color;
        }
        // 線幅を設定する
        ctx.lineWidth = width;
        // パスの設定を開始することを明示する
        ctx.beginPath();
        // パスの始点を設定する
        ctx.moveTo(x1, y1);
        // 三次ベジェ曲線の制御点と終点を設定する
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
        // パスを閉じることを明示する
        ctx.closePath();
        // 設定したパスで線描画を行う
        ctx.stroke();
    }

    /**
     * 画像をロードしてコールバック関数にロードした画像を与え呼び出す
     * @param {string} path - 画像ファイルのパス
     * @param {function} [callback] - コールバック関数
     */
    function imageLoader(path, callback){
        // 画像のインスタンスを生成する
        let target = new Image();
        // 画像がロード完了したときの処理を先に記述する
        target.addEventListener('load', () => {
            // もしコールバックがあれば呼び出す
            if(callback != null){
                // コールバック関数の引数に画像を渡す
                callback(target);
            }
        }, false);
        // 画像のロードを開始するためにパスを指定する
        target.src = path;
    }
})();
