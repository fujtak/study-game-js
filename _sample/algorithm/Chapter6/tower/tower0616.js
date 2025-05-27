//起動時の処理
function setup() {
    canvasSize(1080, 1264);
    var IMG = ["bg1", "enemy", "castle", "card", "soldier"];
    for(var i=0; i<IMG.length; i++) loadImg(i, "image/" + IMG[i] + ".png");
    initVar();
}

//メインループ
function mainloop() {
    tmr++;
    if(tmr%10 < 5) card_power[rnd(CARD_MAX)] += 1;
    if(tapC == 1 && tapY > 864) {//カードをクリックしたか
        tapC = 0;
        var c = int(tapX/270);
        if(0<=c && c<CARD_MAX) sel_card = c;
    }
    var x = int(tapX/SIZE);//┬マウスポインタのマス
    var y = int(tapY/SIZE);//┘
    if(0<=x && x<15 && 0<=y && y<12) {//盤面上
        var n = troop[y][x];//その位置の兵
        if(tapC == 1) {//クリックした時
            tapC = 0;
            if(n == 0 && stage[y][x] == 0) {//兵はおらず配置できる場所なら
                if(card_power[sel_card] >= 100) {//カードの魔力が満タンなら
                    troop[y][x] = sel_card+1;//兵を配置
                    tr_life[y][x] = CARD_LIFE[sel_card];//体力値を代入
                    card_power[sel_card] = 0;
                }
            }
            if(n > 0) {//兵がいる場合
                card_power[n-1] += 50;
                troop[y][x] = 0;//兵を回収
            }
        }
    }
    for(var i=0; i<CARD_MAX; i++) {//魔力が上限を超えていないか
        if(card_power[i] > 100) card_power[i] = 100;
    }
    drawBG();
    drawCard();
    action();
    if(tmr%30 == 0) setEnemy();
    castle_x = 7*SIZE;
    castle_y = 10*SIZE;
    moveEnemy();
    var cp = 0;//城のパタン
    if(damage >= 30) cp = 1;
    if(damage >= 60) cp = 2;
    if(damage >= 90) cp = 3;
    drawImgTS(2, cp*96, 0, 96, 96, castle_x-12, castle_y-24, 96, 96);
    fText("DMG "+damage, 540, 820, 30, "white");
}

var SIZE = 72;
var XP = [0, 0, 0,-1, 1];//┬上下左右の各方向の座標変化の基本値
var YP = [0,-1, 1, 0, 0];//┘
var CHR_ANIMA = [0, 1, 0, 2];//キャラクターのアニメーション
var FLASH = ["#2040ff", "#4080ff", "#80c0ff", "#c0e0ff", "#80c0ff", "#4080ff"];//明滅色
var stage = [//通路のデータ
    [0,0,0,0,2,0,0,0,0,0,2,0,0,0,0],
    [4,2,0,0,4,4,2,0,0,2,3,0,0,2,3],
    [0,2,0,0,0,0,2,0,0,2,0,0,0,2,0],
    [0,2,0,0,0,0,2,0,0,2,0,0,0,2,0],
    [0,4,4,2,0,2,3,0,0,4,2,0,0,2,0],
    [0,0,0,2,0,2,0,0,0,0,4,2,0,2,0],
    [0,2,3,3,0,4,4,2,0,0,0,2,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,3,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,0,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,0,0,2,0],
    [0,4,4,4,4,4,4,5,3,3,3,3,3,3,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
var ESET_X = [0, 4, 10, 14];//┬敵が出現するマス
var ESET_Y = [1, 0,  0,  1];//┘

var tmr = 0;
var castle_x = 0;
var castle_y = 0;
var damage = 0;

function drawBG() {//ゲーム画面を描く
    drawImg(0, 0, 0);
    lineW(1);
    for(var y=0; y<12; y++) {
        for(var x=0; x<15; x++) {
            var cx = x*SIZE;
            var cy = y*SIZE;
            if(stage[y][x] > 0) {
                setAlp(50);
                fRect(cx+1, cy+1, SIZE-3, SIZE-3, "#4000c0");
                setAlp(100);
                sRect(cx+1, cy+1, SIZE-3, SIZE-3, "#4060ff");
            }
            var n = troop[y][x];
            if(n > 0) {
                var a = 3;//アニメーション用
                var lif = tr_life[y][x];
                if(lif > 0) a = CHR_ANIMA[int(tmr/4)%4];//体力があるならアニメさせる
                drawSoldier(cx, cy, n, tr_dir[y][x], a);
                fText(lif, cx+SIZE/2, cy+56, 24, "white");
            }
        }
    }
}

//敵の管理
var EMAX = 100;
var emy_x = new Array(EMAX);
var emy_y = new Array(EMAX);
var emy_d = new Array(EMAX);//向き
var emy_s = new Array(EMAX);//移動速度
var emy_t = new Array(EMAX);//速度調整用
var emy_life = new Array(EMAX);//体力
var emy_species = new Array(EMAX);//敵の種類
var emy_dmg = new Array(EMAX);//敵にダメージを与える

function setEnemy() {//敵を出現させる
    var r = rnd(4);
    var sp = rnd(3);
    for(var i=0; i<EMAX; i++) {
        if(emy_life[i] == 0) {
            emy_x[i] = ESET_X[r]*SIZE+SIZE/2;
            emy_y[i] = ESET_Y[r]*SIZE+SIZE/2;
            emy_d[i] = 0;
            emy_s[i] = 1+sp;
            emy_t[i] = 0;
            emy_life[i] = 1+sp*2;
            emy_species[i] = sp;
            emy_dmg[i] = 0;
            break;
        }
    }
}

function moveEnemy() {//敵を動かす(表示も行う)
    for(var i=0; i<EMAX; i++) {
        if(emy_life[i] > 0) {
            if(emy_t[i] == 0) {
                var d = stage[int(emy_y[i]/SIZE)][int(emy_x[i]/SIZE)];
                if(d == 5) {
                    emy_life[i] = 0;
                    castle_x = castle_x + rnd(11)-5;
                    castle_y = castle_y + rnd(11)-5;
                    damage = damage + 1;
                }
                else {
                    emy_d[i] = d;//向き
                    emy_t[i] = int(SIZE/emy_s[i]);
                }
            }
            if(emy_t[i] > 0) {
                emy_x[i] += emy_s[i]*XP[emy_d[i]];
                emy_y[i] += emy_s[i]*YP[emy_d[i]];
                emy_t[i]--;
            }
            var sx = emy_species[i]*216 + CHR_ANIMA[int(tmr/4)%4]*72;
            var sy = (emy_d[i]-1)*72;
            drawImgTS(1, sx, sy, 72, 72, emy_x[i]-SIZE/2, emy_y[i]-SIZE/2, 72, 72);
            fText(emy_life[i], emy_x[i], emy_y[i]-48, 24, "white");//敵の体力
            if(emy_dmg[i] > 0) {
                emy_dmg[i]--;
                if(emy_dmg[i]%2 == 1) fCir(emy_x[i], emy_y[i], int(SIZE*0.6), "white");
                if(emy_dmg[i] == 0) emy_life[i]--;
            }
        }
    }
}

function initVar() {//配列、変数に初期値を代入
    var i, x, y;
    for(i=0; i<EMAX; i++) emy_life[i] = 0;
    for(i=0; i<CARD_MAX; i++) card_power[i] = 90;
    for(y=0; y<12; y++) {
        for(x=0; x<15; x++) {
            troop[y][x] = 0;
            tr_dir[y][x] = 1;
            tr_life[y][x] = 0;
        }
    }
}

//自軍の管理
var CARD_MAX = 4;
var CARD_NAME = ["warrior", "priest", "archer", "witch"];
var CARD_LIFE = [200, 80, 160, 120];//体力
var CARD_CURE = [0, 1, 0, 0];//回復能力があるか
var CARD_RADIUS = [108, 108, 144, 180];//攻撃範囲(半径)
var CARD_SPEED = [1, 6, 2, 3];//攻撃速度 1が一番速い
var card_power = [0, 0, 0, 0];//カードの魔力
var sel_card = 0;
var troop = new Array(12);
var tr_dir = new Array(12);
var tr_life = new Array(12);
for(var y=0; y<12; y++) {
    troop[y] = new Array(15);
    tr_dir[y] = new Array(15);
    tr_life[y] = new Array(15);
}

function drawCard() {//カードを描く
    drawImg(3, 0, 864);
    lineW(6);
    for(var i=0; i<CARD_MAX; i++) {
        var x = 270*i;
        var y = 864;
        var c = "#0040c0";//魔力のバーの色
        fText(CARD_NAME[i], x+135, y+320, 36, "white");
        setAlp(50);
        if(card_power[i] < 100)
            fRect(x, y, 270, 400, "black");
        else
            c = FLASH[tmr%6];
        fRect(x+34, y+349, 202, 18, "black");
        fRect(x+35, y+350, card_power[i]*2, 16, c);
        if(i == sel_card) sRect(x+3, y+3, 270-6, 400-6, "cyan");
        setAlp(100);
    }
}

function drawSoldier(x, y, n, d, a) {//兵を描く
    var sx = (n-1)*288 + a*72;
    var sy = (d-1)*72;
    drawImgTS(4, sx, sy, 72, 72, x, y, 72, 72);
    lineW(1);
    sCir(x+SIZE/2, y+SIZE/2, CARD_RADIUS[n-1], "cyan");//確認用に攻撃半径を表示
}

function action() {//兵の行動
    for(var y=0; y<12; y++) {
        for(var x=0; x<15; x++) {
            var n = troop[y][x];
            var l = tr_life[y][x];
            if(n>0 && l>0 && tmr%CARD_SPEED[n-1]==0) {
                var a = attack(x, y, n);
                if(a == true)//攻撃したらライフが減る
                    tr_life[y][x]--;
                else if(CARD_CURE[n-1] > 0)//回復能力がある
                    recover(x, y, n);
            }
        }
    }
}

function attack(x, y, n) {//敵を攻撃する
    var cx = x*SIZE + SIZE/2;//┬兵の中心座標
    var cy = y*SIZE + SIZE/2;//┘
    lineW(10);
    for(var i=0; i<EMAX; i++) {
        if(emy_life[i]>0 && emy_dmg[i]==0) {
            if(getDis(emy_x[i], emy_y[i], cx, cy) <= CARD_RADIUS[n-1]) {
                line(emy_x[i], emy_y[i], cx, cy, "white");
                emy_dmg[i] = 2;
                if(emy_y[i] < cy) tr_dir[y][x] = 1;//┬敵の方を向く
                if(emy_y[i] > cy) tr_dir[y][x] = 2;//│
                if(emy_x[i] < cx) tr_dir[y][x] = 3;//│
                if(emy_x[i] > cx) tr_dir[y][x] = 4;//┘
                return true;//trueを返す
            }
        }
    }
    return false;
}

function recover(x, y, n) {//仲間を回復する
    var d = 1+rnd(4);
    var tx = x + XP[d];
    var ty = y + YP[d];
    if(0<=tx && tx<15 && 0<=ty && ty<12) {
        var tr = troop[ty][tx];
        if(tr > 0) {
            if(tr_life[ty][tx] < CARD_LIFE[tr-1]) {
                tr_life[ty][tx] += CARD_CURE[n-1];
                if(tr_life[ty][tx] > CARD_LIFE[tr-1]) tr_life[ty][tx] = CARD_LIFE[tr-1];
                tr_dir[y][x] = d;
                lineW(8);
                sCir(tx*SIZE+SIZE/2, ty*SIZE+SIZE/2, int(SIZE*0.5), "blue");
            }
        }
    }
}