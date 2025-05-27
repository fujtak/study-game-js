var scene = 0;
var counter = 0;

function setup() {
    canvasSize(800, 1000);
    var IMG = ["title", "bg"];
    for(var i=0; i<IMG.length; i++) loadImg(i, "image/" + IMG[i] + ".png");
}

function mainloop() {
    counter++;
    if(scene < 40) {//背景の表示
        drawImgTS(1, 0, 0, 800, 1000, 0, 0, 800, 1000);//居住ドーム
    }
    else {
        drawImgTS(1, 800, 0, 800, 1000, 0, 0, 800, 1000);//探索するドーム
    }

    switch(scene) {
        case 0://タイトル画面
        drawImg(0, 0, 50);//タイトルロゴ
        if(counter%40 < 20) fText("CLICK TO START.", 400, 600, 40, "white");
        if(tapC > 0) {
            tapC = 0;
            scene = 1;
        }
        break;

        case 1://ホーム画面
        if(hexaBtn(400, 500, 240, 160, 30, "探索モードへ")) scene = 40;
        break;

        case 40://探索画面
        if(hexaBtn(400, 500, 240, 160, 30, "ホーム画面へ")) scene = 1;
        break;
    }
}

function hexaBtn(x, y, w, h, t, txt) {//六角形のボタン
    var ret = false;//クリックされたかを返す
    var xy = [//六角形の頂点を配列で定義
     x,     y-h/2-t,
     x+w/2, y-h/2,
     x+w/2, y+h/2,
     x,     y+h/2+t,
     x-w/2, y+h/2,
     x-w/2, y-h/2
    ];
    var col = "navy";
    if(x-w/2<tapX && tapX<x+w/2 && y-h/2-t/2<tapY && tapY<y+h/2+t/2) {
        col = "blue";
        if(tapC > 0) {
            tapC = 0;
            col = "white";
            ret = true;
        }
    }
    lineW(2);
    setAlp(50);
    fPol(xy, col);
    setAlp(100);
    sPol(xy, "white");
    fTextN(txt, x, y, h/2, 30, "white");
    return ret;
}
