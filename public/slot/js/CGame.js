function CGame(oData) {
  var _bInitGame;
  var _bPlayerWins;

  var _iTimeIdle;
  var _iTimeWin;
  var _iCurAnim;
  var _iGameState;
  var _iCurWin;
  var _iAdCounter;
  var _iNumSpin;

  var _aProbability;

  var _oInterface;
  var _oEndPanel = null;
  var _oParent;
  var _oWheelContainer;
  var _oWheel;
  var _oLeds;

  var _oDebug;

  this._init = function () {
    _bPlayerWins = false;

    _iTimeIdle = 0;
    _iTimeWin = 0;
    _iCurWin = -1;
    _iGameState = STATE_IDLE;
    _iAdCounter = 0;
    _iNumSpin = NUM_INSTANT_SPIN;

    var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
    s_oStage.addChild(oBg);

    _aProbability = new Array();

    _bInitGame = true;

    _oWheelContainer = new createjs.Container();
    s_oStage.addChild(_oWheelContainer);

    this.attachWheel();

    _oInterface = new CInterface();

    new CHelpPanel();

    this._initProbability();
  };

  this.attachWheel = function () {
    var pCenterWheel = { x: CANVAS_WIDTH / 2 + 140, y: CANVAS_HEIGHT / 2 + 30 };
    s_oWheel.attachWheel(pCenterWheel.x, pCenterWheel.y, _oWheelContainer);

    _oLeds = new CLeds(pCenterWheel.x, pCenterWheel.y, _oWheelContainer);
    _iCurAnim = _oLeds.getState();

    _oWheel = s_oWheel;
  };

  this._initProbability = function () {
    var aPrizeLength = new Array();

    for (var i = 0; i < INSTANT_WHEEL_SETTINGS.length; i++) {
      aPrizeLength[i] = INSTANT_WHEEL_SETTINGS[i].win_occurrence;
    }

    for (var i = 0; i < aPrizeLength.length; i++) {
      for (var j = 0; j < aPrizeLength[i]; j++) {
        _aProbability.push(i);
      }
    }
  };

  this.tryShowAd = function () {
    _iAdCounter++;
    if (_iAdCounter === AD_SHOW_COUNTER) {
      _iAdCounter = 0;
      $(s_oMain).trigger("show_interlevel_ad");
    }
  };

  this._getInstantWinPrize = function () {
    var iPrizeToChoose =
      _aProbability[Math.floor(Math.random() * _aProbability.length)];

    return iPrizeToChoose;
  };

  this.spinWheel = function () {
    _oInterface.disableSpin(true);
    _iGameState = STATE_SPIN;
    _iTimeWin = 0;

    _iNumSpin--;
    _oInterface.refreshNumSpin(_iNumSpin);
    _iCurWin = this._getInstantWinPrize();

    //SPIN
    _oWheel.spin(_iCurWin);

    playSound("start_reel", 1, false);
    playSound("reel", 0.2, true);
  };

  this.releaseWheel = function () {
    this.tryShowAd();
    $(s_oMain).trigger("use_ticket", _iCurWin); // CHECK : 티켓사용 트리거 추가
    _oInterface.disableSpin(false);

    stopSound("reel");

    _iGameState = STATE_LOSE;

    if (INSTANT_WHEEL_SETTINGS[_iCurWin].prizewinning) {
      _iGameState = STATE_WIN;
      this._instantWinPanel();

      playSound("win", 1, false);
    } else {
      playSound("game_over", 1, false);

      if (_iNumSpin === 0) {
        this._instantLosePanel();
      }
    }
  };

  this._instantWinPanel = function () {
    $(s_oMain).trigger("save_score", _iCurWin);

    var oInstantWinPanel = new CInstantWinPanel(_iCurWin);
    var oSprite = "image_" + _iCurWin;
    oInstantWinPanel.show(oSprite);
  };

  this._instantLosePanel = function () {
    $(s_oMain).trigger("save_score", _iCurWin);

    var oInstantLosePanel = new CInstantLosePanel(_iCurWin);
    var oSprite = "image_" + _iCurWin;
    oInstantLosePanel.show(oSprite);
  };

  this.unload = function () {
    _bInitGame = false;

    _oInterface.unload();
    if (_oEndPanel !== null) {
      _oEndPanel.unload();
    }
    s_oWheel.unload();
    createjs.Tween.removeAllTweens();
    s_oStage.removeAllChildren();

    stopSound("reel");
  };

  this.onExit = function () {
    window.parent.postMessage({ type: "REDIRECT", url: "/slot" }, "*");
    // CHECK: 나가는 동작이 끄는거하고 당첨됬을때? 이렇게 두개인듯 남은 카드가 반영이안되서 추가함
    $(s_oMain).trigger("end_session");
    $(s_oMain).trigger("share_event", _iCurWin);

    this.unload();
    s_oMain.gotoMenu();
  };

  this._animLedIdle = function () {
    _iTimeIdle += s_iTimeElaps;

    if (_iTimeIdle > TIME_ANIM_IDLE) {
      _iTimeIdle = 0;

      var iRandAnim = Math.floor(Math.random() * _oLeds.getNumAnim());

      while (iRandAnim === _iCurAnim) {
        iRandAnim = Math.floor(Math.random() * _oLeds.getNumAnim());
      }
      _oLeds.changeAnim(iRandAnim);
      _iCurAnim = iRandAnim;
    }
  };

  this._animLedSpin = function () {
    _oLeds.changeAnim(LED_SPIN);
    _iGameState = -1;
  };

  this._animLedWin = function () {
    if (_iTimeWin === 0) {
      var iRandomWinAnim = LED_SPIN + 1 + Math.round(Math.random());
      _oLeds.changeAnim(iRandomWinAnim);
    } else if (_iTimeWin > TIME_ANIM_WIN) {
      _iTimeIdle = TIME_ANIM_IDLE;
      _iGameState = STATE_IDLE;

      _iTimeWin = 0;
    }
    _iTimeWin += s_iTimeElaps;
  };

  this._animLedLose = function () {
    if (_iTimeWin === 0) {
      _oLeds.changeAnim(7);
    } else if (_iTimeWin > TIME_ANIM_LOSE) {
      _iTimeIdle = TIME_ANIM_IDLE;
      _iGameState = STATE_IDLE;

      _iTimeWin = 0;
    }
    _iTimeWin += s_iTimeElaps;
  };

  this.startUpdate = function () {
    _bInitGame = true;
  };

  this.stopUpdate = function () {
    _bInitGame = false;
  };

  this.update = function () {
    if (_bInitGame) {
      _oLeds.update();

      switch (_iGameState) {
        case STATE_IDLE: {
          this._animLedIdle();
          break;
        }
        case STATE_SPIN: {
          this._animLedSpin();
          break;
        }
        case STATE_WIN: {
          this._animLedWin();
          break;
        }
        case STATE_LOSE: {
          this._animLedLose();
          break;
        }
      }

      _oWheel.update();
    }
  };

  s_oGame = this;

  WHEEL_SPIN_TIME = oData.wheel_spin_time;
  NUM_INSTANT_SPIN = oData.num_instant_spin;
  AD_SHOW_COUNTER = oData.ad_show_counter;

  _oParent = this;
  this._init();
}

var s_oGame;
