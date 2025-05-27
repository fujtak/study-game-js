class characterClass {//キャラクター用のクラス
    constructor() {//コンストラクター
        this.name  = null;
        this.level = 0;
        this.exp   = 0;
        this.lfmax = 0;
        this.life  = 0;
        this.stren = 0;
        this.defen = 0;
        this.agili = 0;
        this.pos   = 0;
        this.dmg   = 0;
        this.efct  = 0;
        this.etime = 0;
    }

    join(n) {//初期値の代入
        n = n*6;
        this.name  = CHR_DATA[n];
        this.level = CHR_DATA[n+1];
        this.exp   = 10*(this.level-1)*(this.level-1);
        this.lfmax = CHR_DATA[n+2];
        this.life  = this.lfmax;
        this.stren = CHR_DATA[n+3];
        this.defen = CHR_DATA[n+4];
        this.agili = CHR_DATA[n+5];
        this.pos   = 0;
        this.dmg   = 0;
        this.efct  = 0;
        this.etime = 0;
    }

    levelup() {//レベルアップ
        this.level += 1;
        this.lfmax += (10+rnd(10));
        this.stren += rnd(10);
        this.defen += rnd(5);
        this.agili += rnd(5);
    }
}

function setup() {
    canvasSize(800, 1000);
    var IMG = ["title", "bg", "character0", "character1", "character2", "enemy"];
    for(var i=0; i<IMG.length; i++) loadImg(i, "image/" + IMG[i] + ".png");
}

function mainloop() {
    var i, x, y, w, h, col, btn;//汎用的に使う変数
    counter++;
    if(scene < 40) {//背景の表示
        drawImgTS(1, 0, 0, 800, 1000, 0, 0, 800, 1000);//居住ドーム
    }
    else {
        drawImgTS(1, 800, 0, 800, 1000, 0, 0, 800, 1000);//探索するドーム
        setAlp(30);
        fRect(0, 0, 800, 1000, DOME_COLOR[sel_dome]);
        setAlp(100);
    }
    if(scene == 1) {
        fText(digit0(int(gtime/30/60/60),2)+":"+digit0(int(gtime/30/60),2)+":"+digit0(int(gtime/30)%60,2), 700, 30, 30, "white");
    }
    if(scene > 0) {
        btn = menuBtn();//メニューボタン
        gtime++;
    }

    switch(scene) {
        case 0://タイトル画面
        drawImg(0, 0, 50);//タイトルロゴ
        if(counter%40 < 20) fText("CLICK TO START.", 400, 600, 40, "white");
        if(tapC > 0) {
            tapC = 0;
            initVar();
            autoLoad();
            toHome();
        }
        break;

        case 1://ホーム画面
        fText("ホーム画面に戻るとセーブされます。", 400, 360, 36, "gold");
        fText("再起動して続きを確認しましょう。", 400, 440, 36, "lime");
        putMsg(400, 680);//メッセージの表示
        if(counter == 1) {
            clrMsg();
            autoSave();
        }
        for(i=0; i<3; i++) {//行き先のボタン
            if(hexaBtn(150+i*250, 110, 220, 60, 20, DOME_NAME[i])) {
                clrMsg();
                sel_dome = i;
                scene = 40;
                counter = 0;
                break;
            }
        }
        if(btn > 1) {//メニューボタンが押されたら各画面へ遷移する
            clrMsg();
            scene = (btn-1)*10;
            counter = 0;
        }
        break;

        case 10://パーティ画面
        for(i=0; i<MEMBER_MAX; i++) {
            x = 160+i*240;
            y = 50;
            if(tapC==1 && x-100<tapX && tapX<x+100 && y-30<tapY && tapY<y+30) {
                tapC = 0;
                sel_member = i;
            }
            col = "black";
            if(i == sel_member) col = "navy";
            drawFrame(x-100, y-30, 200, 60, col);
            fText(chara[i].name, x, y, 30, "white");
        }
        drawFrame(20, 100, 760, 690, "black");
        n = 2+sel_member;
        w = img[n].width;
        h = img[n].height;
        drawImgTS(n, 0, 0, w, h, 60, 100, w*0.85, h*0.85);
        var nexp = chara[sel_member].level*chara[sel_member].level*10;
        x = 460;
        y = 150;
        fText("レベル", x, y, 30, "white");
        fText("経験値", x, y+60, 30, "white");
        fText("次のレベルアップ", x, y+120, 20, "white");
        fText("ライフ", x, y+240, 30, "white");
        fText("攻撃力", x, y+300, 30, "white");
        fText("防御力", x, y+360, 30, "white");
        fText("素早さ", x, y+420, 30, "white");
        x = 620;
        fText(chara[sel_member].level, x, y, 30, "white");
        fText(chara[sel_member].exp,   x, y+60, 30, "white");
        fText(nexp, x, y+120, 30, "white");
        fText(chara[sel_member].life + "/" + chara[sel_member].lfmax, x, y+240, 30, "white");
        fText(chara[sel_member].stren, x, y+300, 30, "white");
        fText(chara[sel_member].defen, x, y+360, 30, "white");
        fText(chara[sel_member].agili, x, y+420, 30, "white");
        if(btn == 1) toHome();//ホーム画面に戻る
        break;

        case 20://クリーチャー画面トップ
        case 21://クリーチャーの説明
        for(i=0; i<CREATURE_MAX; i++) {
            x = 266*(i%3);
            y = 266*int(i/3);
            if(tapC==1 && x<tapX && tapX<x+266 && y<tapY && tapY<y+266) {
                tapC = 0;
                sel_creature = i;
            }
            col = "black";
            if(i == sel_creature) col = "navy";
            drawFrame(x+8, y+8, 250, 250, col);
            if(flg[FLG_CREATURE+i] == 0) {
                fText("No Data", x+133, y+133, 24, "white");
            }
            else {
                var sx = 400*int(i/3);
                var sy = 400*(i%3);
                drawImgTS(5, sx, sy, 400, 400, x+8, y+8, 250, 250);
                fText(CREATURE[i*2],   x+110, y+240, 24, "white");
                fText("x"+creature[i], x+230, y+240, 24, "white");
            }
        }
        if(scene == 21) {//クリーチャーの能力
            y = 266*(1+int(sel_creature/3));
            if(sel_creature >= 6) y -= 470;
            drawFrame(40, y, 720, 210, "black");
            if(flg[FLG_CREATURE+sel_creature] > 0) {
                setCreature(0, sel_creature);
                fText(chara[EMY_TOP].name, 220, y+30, 30, "yellow");
                fText("ライフ " + chara[EMY_TOP].lfmax, 220, y+80, 30, "white");
                fText("経験値 "+chara[EMY_TOP].exp, 220, y+130, 30, "white");
                fText("攻撃力 " + chara[EMY_TOP].stren, 580, y+ 30, 30, "white");
                fText("防御力 " + chara[EMY_TOP].defen, 580, y+ 80, 30, "white");
                fText("素早さ " + chara[EMY_TOP].agili, 580, y+130, 30, "white");
                fText(CREATURE[sel_creature*2+1], 400, y+180, 30, "cyan");//説明文
            }
            if(tapC>0 || btn>0) {
                tapC = 0;
                btn = 0;
                scene = 20;
            }
        }
        if(btn == 1) toHome();//ホーム画面に戻る
        if(btn == 2) scene = 21;//データの表示
        if(btn == 3) {//転送
            if(creature[sel_creature] > 0) {
                if(confirm("このクリーチャーを研究施設に送りますか？") == true) {
                    labo += creature[sel_creature];
                    creature[sel_creature] = 0;
                    alert(CREATURE[sel_creature*2] + "を研究施設に送った。");
                }
            }
        }
        break;

        case 30://研究施設画面トップ
        case 31://研究施設　アイテム完成
        drawFrame(10, 10, 780, 60, "black");
        fText("研究進捗度", 100, 40, 30, "white");
        n = labo;
        if(n > ITEM_MAX*10) n = ITEM_MAX*10;
        drawBar(200, 30, 480, 20, n, ITEM_MAX*10);
        fText(int(100*n/(ITEM_MAX*10))+"\%", 730, 40, 30, "white");
        drawFrame(10, 80, 780, 700, "black");
        fText("開発済みアイテム", 400, 120, 30, "yellow");
        for(i=0; i<ITEM_MAX; i++) {
            y = 200+60*i;
            if(tapC==1 && 100<tapX && tapX<700 && y-30<tapY && tapY<y+30) {
                tapC = 0;
                sel_item = i;
            }
            col = "white";
            if(i == sel_item) col = "cyan";
            if(flg[FLG_ITEM+i] == 0) {
                fText("?", 200, y, 30, col);
                fText("--", 600, y, 30, col);
            }
            else {
                fText(ITEM[i*3], 200, y, 30, col);
                fText("x"+item[i], 600, y, 30, col);
            }
        }
        drawFrame(30, 700, 740, 60, "black");//説明文の枠、↓説明文
        if(flg[FLG_ITEM+sel_item] > 0) fText(ITEM[sel_item*3+1], 400, 730, 30, "white");
        if(scene == 30) {
            if(counter == 10) {
                n = int(labo/10);
                if(n > ITEM_MAX) n = ITEM_MAX;
                for(i=0; i<n; i++) {
                    if(flg[FLG_ITEM+i] == 0) {
                        flg[FLG_ITEM+i] = 1;
                        item[i] = 1;
                        setMsg(ITEM[i*3]+"が完成した！");
                        scene = 31;
                        break;
                    }
                }
            }
            if(counter > 10 && btn == 1) toHome();//ホーム画面に戻る
        }
        if(scene == 31) {
            putMsg(400, 680);//メッセージの表示
            if(btn == 1) scene = 30;
        }
        break;

        case 40://探索画面
        ptyLife();
        putMsg(400, 680);//メッセージの表示
        if(btn == 1) toHome();//ホーム画面に戻る
        if(btn == 2) {
            setMsg("探索中...");
            scene = 41;
            counter = 0;
        }
        break;

        case 41://探索中
        if(counter < 40) {//背景を動かす演出
            x = -20*counter;
            drawImgTS(1, 800, 448, 800, 552, x, 448, 800, 552);
            drawImgTS(1, 800, 448, 800, 552, x+800, 448, 800, 552);
            setAlp(30);
            fRect(0, 448, 800, 552, DOME_COLOR[sel_dome]);
            setAlp(100);
        }
        ptyLife();
        putMsg(400, 680);//メッセージの表示
        if(counter < 40) break;
        if(counter == 40) {
            if(rnd(100)<50) {
                setMsg("クリーチャーを発見！");
                scene = 50;
                counter = 0;
                break;
            }
        }
        if(btn == 1) {
            setMsg("探索を中断します。");
            scene = 40;
        }
        if(btn == 2) {
            setMsg("探索中...");
            counter = 0;
        }
        break;

        case 50://戦闘開始
        ptyLife();
        putMsg(400, 680);//メッセージの表示
        if(counter%6 < 3) {
            setAlp(30);
            fRect(0, 0, 800, 1000, "black");
        }
        if(counter == 30) {
            initBtl();
            scene = 51;
        }
        break;

        case 51://戦う順番を決める
        case 52://順に行動していく
        case 53://戦いを行う
        case 54://勝利
        case 55://敗北
        case 56://レベルアップ
        case 57://撤退
        for(i=0; i<3; i++) {//敵の表示
            x = -60+260*i;
            y = 180;
            if(chara[EMY_TOP+i].life > 0) {
                n = chara[EMY_TOP+i].level;
                var sx = 400*int(n/3);
                var sy = 400*(n%3);
                drawImgTS(5, sx, sy, 400, 400, x, y + chara[EMY_TOP+i].pos, 400, 400);
                drawBar(x+90, y-30, 220, 16, chara[EMY_TOP+i].life, chara[EMY_TOP+i].lfmax);
                fText(CREATURE[n*2], x+200, y-60, 30, "white");
            }
            if(chara[EMY_TOP+i].etime > 0) {//エフェクトの表示
                btlEffect(chara[EMY_TOP+i].efct, x+200, y+200, 1.0, chara[EMY_TOP+i].etime);
                chara[EMY_TOP+i].etime--;
            }
        }
        ptyLife();
        putMsg(400, 680);//メッセージの表示
        if(scene == 51) {
            btlOrder();
            scene = 52;
        }
        else if(scene == 52) {
            btl_turn++;
            if(btl_turn == 6) {
                scene = 51;
            }
            else {
                if(order[btl_turn] > 0) {
                    btl_char = order[btl_turn]%10;
                    if(chara[btl_char].life > 0) {
                        while(true) {//攻撃相手を決める
                            def_char = rnd(3);
                            if(btl_char < 3) def_char += 3;
                            if(chara[def_char].life > 0) break;
                        }
                        scene = 53;
                        counter = 0;
                    }
                }
            }
        }
        else if(scene == 53) {
            if(counter == 10) setMsg(chara[btl_char].name + "の攻撃！");
            if(counter == 20) {
                chara[btl_char].pos = 40;//敵が攻撃する演出
                chara[def_char].efct = 0;
                chara[def_char].etime = 15;
                //ダメージ値の計算
                chara[def_char].dmg = chara[btl_char].stren - chara[def_char].defen;
                if(chara[def_char].dmg < 0) chara[def_char].dmg = 0;
            }
            if(counter == 40) {
                chara[def_char].life -= chara[def_char].dmg;
                if(chara[def_char].life <= 0) chara[def_char].life = 0;
                setMsg(chara[def_char].name + "は" + chara[def_char].dmg + "のダメージを受けた！");
                chara[btl_char].pos = 0;
            }
            if(counter == 60) {
                if(chara[def_char].life == 0) {
                    if(def_char < 3) {
                        setMsg(chara[def_char].name + "は倒れた");
                    }
                    else {
                        setMsg(chara[def_char].exp + "の経験値を獲得！");
                        setMsg(chara[def_char].name + "を捕獲した！");
                        chara[btl_char].exp += chara[def_char].exp;
                        n = chara[def_char].level;
                        creature[n]++;
                        flg[FLG_CREATURE+n] = 1;
                    }
                }
            }
            if(counter == 80) {
                scene = 52;
                if(chara[3].life+chara[4].life+chara[5].life == 0) { scene = 54; counter = 0; break; }
                if(chara[0].life+chara[1].life+chara[2].life == 0) { scene = 55; counter = 0; break; }
            }
            if(counter<20) {//撤退を受け付けるタイミング
                fTri(85, 840, 100, 860, 115, 840, "gold");
                if(btn == 1) {//撤退
                    scene = 57;
                    counter = 0;
                }
            }
            if(counter<20 || 60<counter) {//回復を受け付けるタイミング
                if(item[0]+item[1]+item[2] > 0) fTri(285, 840, 300, 860, 315, 840, "lime");
                if(btn == 2) {//回復
                    for(i=0; i<3; i++) {
                        if(chara[i].life>0 && chara[i].life<chara[i].lfmax && item[i]>0) {
                            item[i]--;
                            chara[i].life += ITEM[i*3+2];
                            if(chara[i].life > chara[i].lfmax) chara[i].life = chara[i].lfmax;
                            chara[i].efct = 1;
                            chara[i].etime = 15;
                        }
                    }
                }
            }
        }
        else if(scene == 54) {//勝利
            if(counter == 30) setMsg("戦いに勝った！");
            if(counter == 150) {
                lvup = 0;
                scene = 56;//レベルアップの確認へ
                counter = 0;
            }
        }
        else if(scene == 55) {//敗北
            if(counter == 30) setMsg("負けてしまった...");
            if(counter == 120) setMsg("捕獲済みのクリーチャーが逃げ出した。");
            if(counter == 210) setMsg("居住ドームに強制送還されます。");
            if(counter == 300) {
                for(i=0; i<CREATURE_MAX; i++) creature[i] = int(creature[i]*rnd(10)/10);
                toHome();
            }
        }
        else if(scene == 56) {//レベルアップ
            if(counter == 1) {
                if(chara[lvup].life>0 && chara[lvup].exp>=10*chara[lvup].level*chara[lvup].level) {
                    chara[lvup].levelup();
                    setMsg(chara[lvup].name+"はレベルアップした！");
                    setMsg("LEVEL "+(chara[lvup].level-1)+" → "+chara[lvup].level);
                    counter = -90;//【重要】連続してレベルアップするかを確認
                }
            }
            if(counter == 2) {
                lvup++;
                if(lvup < MEMBER_MAX) counter = 0;//次のメンバーを確認する
            }
            if(counter == 90) {
                setMsg("探索を続けますか？");
                scene = 40;
                counter = 10;
            }
        }
        else if(scene == 57) {//撤退
            if(counter == 1) setMsg("撤退した");
            if(counter == 30 && rnd(100) < 50) {
                setMsg("しかし敵に回り込まれた！");
                scene = 52;
            }
            if(counter == 90) {
                setMsg("探索を続けますか？");
                scene = 40;
                counter = 10;
            }
        }
        break;
    }
}

//各種の変数
var scene = 0;
var counter = 0;
var sel_member = 0;
var sel_creature = 0;
var sel_item = 0;
var sel_dome = 0;

//保存が必要な変数
var gtime = 0;
var labo = 0;

//フラグ管理
var FLG_MAX      = 500;
var FLG_EVENT    =   0;
var FLG_DOME     = 100;
var FLG_CREATURE = 200;
var FLG_ITEM     = 300;
var flg = new Array(FLG_MAX);

//戦闘用の変数、配列
var order = [0, 0, 0, 0, 0, 0];//戦闘の順番を決めるための配列
var btl_turn = 0;//順に行動するために用いる
var btl_char = 0;//誰が行動するか
var def_char = 0;//攻撃する相手
var lvup = 0;//レベルアップ用の変数

var MENU = [//メニューボタン
"HOME", "パーティ", "クリーチャー", "研究施設",
"HOME", null, null, null,
"HOME", "データ", "転送", null,
"HOME", null, null, null,
"戻る", "探索", null, null,
"撤退", "回復", null, null
];

//キャラクターの管理
var MEMBER_MAX = 3;//パーティメンバーの人数
var CHARACTER_MAX = 6;//キャラクターの総数（戦闘に参加する味方＋敵の数）
var EMY_TOP = 3;//敵の添え字の開始番号
var chara = new Array(CHARACTER_MAX);
for(var i=0; i<CHARACTER_MAX; i++) chara[i] = new characterClass();

var CHR_DATA = [
"マリヤ",    1, 500, 150, 40,  60,
"ゼノン",    5, 700, 200, 70,  60,
"ビーナス", 10, 600, 200, 70, 100
];

//クリーチャーの定義
var CREATURE_MAX = 9;
var creature = new Array(CREATURE_MAX);
var CREATURE = [
"キラーワスプ",   "人を頻繁に襲う危険な蜂",
"スパイダー",     "噛まれると痛い大型の蜘蛛",
"エイプ",         "気の荒い猿のような生物",
"バンパイヤ",     "群れで人を襲う厄介な蝙蝠",
"ゴブリン",       "好戦的な猿のような生物",
"バーバリアン",   "獰猛な類人猿型の生物",
"スライム",       "うねうねと気味の悪い粘菌生物",
"デススパイダー", "好戦的で危険な大型の蜘蛛",
"ヘルマン",       "極めて獰猛な類人猿型の生物"
];

//アイテムの管理
var ITEM_MAX = 8;
var item = new Array(ITEM_MAX);
var ITEM = [
"ポーション",       "マリヤのライフを回復",      100,
"リペアキット",     "ゼノンのライフを回復",      100,
"アニマルキュア",   "ビーナスのライフを回復",    100,
"ゲートキー７",     "DOME 7 へ行けるようになる",   0,
"エネミーサーチ",   "敵を発見しやすくなる",        0,
"ゲートキーＸ",     "DOME XXX へ行けるようになる", 0,
"エネミーサーチ２", "敵を更に発見しやすくなる",    0,
"ラストアイテム",   "このゲームの最後のアイテム",  0
];

//ドームの名称、色の定義
var DOME_NAME = ["DOME\nZero", "DOME\n7", "DOME\nXXX"];
var DOME_COLOR = ["#44f", "#480", "#c00"];

function initVar() {//ゲーム用の変数に初期値を代入
    var i;
    for(i=0; i<CREATURE_MAX; i++) creature[i] = 0;
    for(i=0; i<ITEM_MAX; i++) item[i] = 0;
    for(i=0; i<FLG_MAX; i++) flg[i] = 0;
    gtime = 0;
    labo = 0;
    clrMsg();
    chara[0].join(0);//マリヤのパラメーターを代入
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

function menuBtn() {//メニューボタン
    var btn = 0;
    var m = int(scene/10);
    for(var i=0; i<4; i++) {
        var x = 100+200*i;
        var y = 900;
        if(MENU[i+m*4] != null) {
            if(hexaBtn(x, y, 196, 100, 50, MENU[i+m*4])) btn = i+1;
        }
    }
    return btn;
}

function toHome() {//ホーム画面に戻る
    for(var i=0; i<MEMBER_MAX; i++) chara[i].life = chara[i].lfmax;
    scene = 1;
    counter = 0;
}

//メッセージ関連の処理
var MSG_MAX = 5;
var msg = new Array(MSG_MAX);

function clrMsg() {
    for(var i=0; i<MSG_MAX; i++) msg[i] = "";
}

function setMsg(ms) {
    for(var i=0; i<MSG_MAX; i++) {
        if(msg[i] == "") {
            msg[i] = ms;
            return;
        }
    }
    for(var i=0; i<MSG_MAX-1; i++) msg[i] = msg[i+1];
    msg[MSG_MAX-1] = ms;
}

function putMsg(x, y) {
    drawFrame(x-370, y-100, 740, 200, "black");
    for(var i=0; i<MSG_MAX; i++) fText(msg[i], x, y-80+i*40, 28, "white");
}

function drawFrame(x, y, w, h, col) {//枠を描く
    lineW(2);
    setAlp(60);
    fRect(x, y, w, h, col);
    setAlp(100);
    sRect(x, y, w, h, "white");
}

function drawBar(x, y, w, h, val, vmax) {//バーを描く
    var bw = int(w*val/vmax);
    if(val>0 && bw==0) bw = 1;
    fRect(x, y, w, h, "black");
    fRect(x, y, bw, h, "#04f");
    fRect(x, y+h/2, bw, h/2, "#028");
    sRect(x-1, y-1, w+1, h+1, "white");
}

function ptyLife() {//パーティメンバーのライフを表示
    var i, x, y;
    for(i=0; i<MEMBER_MAX; i++) {
        x = 480;
        y = 840+i*50;
        drawBar(x+70, y-12, 220, 24, chara[i].life, chara[i].lfmax);
        fText(chara[i].name, x, y, 28, "white");
        fText(chara[i].life, x+180, y, 20, "white");
        if(chara[i].etime > 0) {//エフェクトの表示
            btlEffect(chara[i].efct, x, y, 0.5, chara[i].etime);
            chara[i].etime--;
        }
    }
}

function setCreature(n, typ) {//クリーチャーのパラメーターを計算して代入
    chara[EMY_TOP+n].name  = CREATURE[typ*2];
    chara[EMY_TOP+n].level = typ;//この属性に敵の種類を代入しておく
    chara[EMY_TOP+n].exp   = (typ+1)*5;//倒した時にもらえる経験値を代入
    chara[EMY_TOP+n].lfmax = 40+typ*30;
    chara[EMY_TOP+n].life  = chara[EMY_TOP+n].lfmax;
    chara[EMY_TOP+n].stren = 50+typ*20;
    chara[EMY_TOP+n].defen = 10+typ*10;
    chara[EMY_TOP+n].agili = 30+typ*20;
    chara[EMY_TOP+n].pos   = 0;
    chara[EMY_TOP+n].dmg   = 0;
    chara[EMY_TOP+n].efct  = 0;
    chara[EMY_TOP+n].etime = 0;
}

function initBtl() {//戦闘に入る準備（敵をセットする）
    for(var i=0; i<3; i++) {
        chara[EMY_TOP+i].life = 0;
        if(rnd(100)<30 || i==1) setCreature(i, rnd(3)+sel_dome*3);
    }
}

function btlOrder() {//行動順番を決める
    var i, j, n;
    for(i=0; i<6; i++) {
        order[i] = 0;
        if(chara[i].life > 0) order[i] = chara[i].agili*10+i;
    }
    for(i=0; i<5; i++) {//素早さ順に並べ替える
        for(j=0; j<5-i; j++) {
            if(order[j]<order[j+1]) {//大きな値を左に移動
                n = order[j];
                order[j] = order[j+1];
                order[j+1] = n;
            }
        }
    }
    btl_turn = -1;
}

function btlEffect(typ, x, y, siz, tim) {//戦闘用のエフェクト
    var i, r, w;
    if(typ == 0) {//攻撃を受けた時のエフェクト
        r = int((1+(15-tim)*12)*siz);
        w = int(30*siz);
        setAlp(tim*6);
        lineW(w);     sCir(x, y, r, "red");
        lineW(w*0.8); sCir(x, y, r, "gold");
        lineW(w*0.6); sCir(x, y, r, "white");
    }
    if(typ == 1) {//回復する時のエフェクト
        r = int(100*siz);
        setAlp(tim*4);
        for(i=0; i<5; i++) fCir(x, y, r-r*i/10, "#48f");
    }
    setAlp(100);
    lineW(2);
}

//セーブ、ロード
function autoSave() {
    var i, p;
    saveLS(0, gtime);
    saveLS(1, labo);
    for(i=0; i<MEMBER_MAX; i++) {
        p = 10+20*i;
        saveLS(p+0, chara[i].name);
        saveLS(p+1, chara[i].level);
        saveLS(p+2, chara[i].exp);
        saveLS(p+3, chara[i].lfmax);
        saveLS(p+4, chara[i].life);
        saveLS(p+5, chara[i].stren);
        saveLS(p+6, chara[i].defen);
        saveLS(p+7, chara[i].agili);
    }
    for(i=0; i<ITEM_MAX; i++) saveLS(100+i, item[i]);
    for(i=0; i<CREATURE_MAX; i++) saveLS(200+i, creature[i]);
    for(i=0; i<FLG_MAX; i++) saveLS(300+i, flg[i]);
}

function autoLoad() {
    var i, p;
    if(loadLS(0) == null) return;//セーブデータが無い
    gtime = loadLS(0);
    labo = loadLS(1);
    for(i=0; i<MEMBER_MAX; i++) {
        p = 10+20*i;
        chara[i].name  = loadLS(p+0);
        chara[i].level = loadLS(p+1);
        chara[i].exp   = loadLS(p+2);
        chara[i].lfmax = loadLS(p+3);
        chara[i].life  = loadLS(p+4);
        chara[i].stren = loadLS(p+5);
        chara[i].defen = loadLS(p+6);
        chara[i].agili = loadLS(p+7);
    }
    for(i=0; i<ITEM_MAX; i++) item[i] = loadLS(100+i);
    for(i=0; i<CREATURE_MAX; i++) creature[i] = loadLS(200+i);
    for(i=0; i<FLG_MAX; i++) flg[i] = loadLS(300+i);
}
