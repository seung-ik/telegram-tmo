function CMain(oData) {
  var _bUpdate;
  var _iCurResource = 0;
  var RESOURCE_TO_LOAD = 0;
  var _iState = STATE_LOADING;
  var _oData;

  var _oPreloader;
  var _oMenu;
  var _oHelp;
  var _oGame;

  this.initContainer = function () {
    s_oCanvas = document.getElementById("canvas");
    s_oStage = new createjs.Stage(s_oCanvas);
    createjs.Touch.enable(s_oStage, true);

    s_bMobile = isMobile();
    if (s_bMobile === false) {
      s_oStage.enableMouseOver(20);
      $("body").on("contextmenu", "#canvas", function (e) {
        return false;
      });
    }

    s_iPrevTime = new Date().getTime();

    createjs.Ticker.addEventListener("tick", this._update);
    createjs.Ticker.framerate = FPS;

    if (navigator.userAgent.match(/Windows Phone/i)) {
      DISABLE_SOUND_MOBILE = true;
    }

    s_oSpriteLibrary = new CSpriteLibrary();

    //ADD PRELOADER
    _oPreloader = new CPreloader();
  };

  this.preloaderReady = function () {
    this._loadImages();
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      this._initSounds();
    }

    _bUpdate = true;
  };

  this.soundLoaded = function () {
    _iCurResource++;
    var iPerc = Math.floor((_iCurResource / RESOURCE_TO_LOAD) * 100);
    _oPreloader.refreshLoader(iPerc);
  };

  this._initSounds = function () {
    Howler.mute(!s_bAudioActive);

    s_aSoundsInfo = new Array();
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "press_button",
      loop: false,
      volume: 1,
      ingamename: "click",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "game_over",
      loop: false,
      volume: 1,
      ingamename: "game_over",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "reel",
      loop: true,
      volume: 1,
      ingamename: "reel",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "start_reel",
      loop: false,
      volume: 1,
      ingamename: "start_reel",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "win",
      loop: false,
      volume: 1,
      ingamename: "win",
    });

    RESOURCE_TO_LOAD += s_aSoundsInfo.length;

    s_aSounds = new Array();
    for (var i = 0; i < s_aSoundsInfo.length; i++) {
      this.tryToLoadSound(s_aSoundsInfo[i], false);
    }
  };

  this.tryToLoadSound = function (oSoundInfo, bDelay) {
    setTimeout(
      function () {
        s_aSounds[oSoundInfo.ingamename] = new Howl({
          src: [oSoundInfo.path + oSoundInfo.filename + ".mp3"],
          autoplay: false,
          preload: true,
          loop: oSoundInfo.loop,
          volume: oSoundInfo.volume,
          onload: s_oMain.soundLoaded,
          onloaderror: function (szId, szMsg) {
            for (var i = 0; i < s_aSoundsInfo.length; i++) {
              if (
                szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id
              ) {
                s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                break;
              }
            }
          },
          onplayerror: function (szId) {
            for (var i = 0; i < s_aSoundsInfo.length; i++) {
              if (
                szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id
              ) {
                s_aSounds[s_aSoundsInfo[i].ingamename].once(
                  "unlock",
                  function () {
                    s_aSounds[s_aSoundsInfo[i].ingamename].play();
                    if (
                      s_aSoundsInfo[i].ingamename === "soundtrack" &&
                      s_oGame !== null
                    ) {
                      setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
                    }
                  }
                );
                break;
              }
            }
          },
        });
      },
      bDelay ? 200 : 0
    );
  };

  this._loadImages = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

    s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
    s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");

    s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
    s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
    s_oSpriteLibrary.addSprite("ctl_logo", "./sprites/ctl_logo.png");
    s_oSpriteLibrary.addSprite("credits_panel", "./sprites/credits_panel.png");
    s_oSpriteLibrary.addSprite(
      "instantwin_mode",
      "./sprites/instantwin_mode.png"
    );
    s_oSpriteLibrary.addSprite("money_mode", "./sprites/money_mode.png");
    s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
    s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");

    s_oSpriteLibrary.addSprite("logo_game", "./sprites/logo_game.png");
    s_oSpriteLibrary.addSprite("gui_panel", "./sprites/gui_panel.png");
    s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
    s_oSpriteLibrary.addSprite(
      "but_fullscreen",
      "./sprites/but_fullscreen.png"
    );
    s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
    s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
    s_oSpriteLibrary.addSprite("but_spin", "./sprites/but_spin.png");
    s_oSpriteLibrary.addSprite("but_plus", "./sprites/but_plus.png");
    s_oSpriteLibrary.addSprite("bet_panel", "./sprites/bet_panel.png");
    s_oSpriteLibrary.addSprite(
      "credits_money_panel",
      "./sprites/credits_money_panel.png"
    );
    s_oSpriteLibrary.addSprite("win_panel", "./sprites/win_panel.png");
    s_oSpriteLibrary.addSprite("leds", "./sprites/leds.png");
    s_oSpriteLibrary.addSprite("swipe_hand", "./sprites/swipe_hand.png");

    s_oSpriteLibrary.addSprite("but_long_text", "./sprites/but_long_text.png");
    s_oSpriteLibrary.addSprite("arrow", "./sprites/arrow.png");
    s_oSpriteLibrary.addSprite("wheel_shadow", "./sprites/wheel_shadow.png");
    s_oSpriteLibrary.addSprite("wheel_back", "./sprites/wheel_back.png");
    for (var i = 0; i < NUM_IMAGES_BACKGROUNDS; i++) {
      // CHECK: 이미지 로드부분 코드
      s_oSpriteLibrary.addSprite(
        "image_" + i,
        "./sprites/item_prize_images/image_" + i + ".png"
      );
    }

    s_oSpriteLibrary.addSprite("borderframe", "./sprites/borderframe.png");

    RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
    s_oSpriteLibrary.loadSprites();
  };

  this._onImagesLoaded = function () {
    _iCurResource++;
    var iPerc = Math.floor((_iCurResource / RESOURCE_TO_LOAD) * 100);
    _oPreloader.refreshLoader(iPerc);
  };

  this.onAllResourcesLoaded = function () {
    _oPreloader.unload();
    this.gotoMenu();

    new CWheel();
  };

  this._onAllImagesLoaded = function () {};

  this.gotoModeMenu = function () {
    _oMenu = new CModeMenu();
    _iState = STATE_MENU;
  };

  this.gotoMenu = function () {
    _oMenu = new CMenu();
    _iState = STATE_MENU;
  };

  this.gotoLoadingWheel = function () {
    _iState = STATE_LOADING_WHEEL;

    s_oLoadingPanel = new CLoadingPanel();
  };

  this.gotoGame = function () {
    _iState = STATE_GAME;

    _oGame = new CGame(_oData);

    $(s_oMain).trigger("game_start");
  };

  this.gotoHelp = function () {
    _oHelp = new CHelp();
    _iState = STATE_HELP;
  };

  this.stopUpdate = function () {
    _bUpdate = false;
    createjs.Ticker.paused = true;
    $("#block_game").css("display", "block");

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      Howler.mute(true);
    }
  };

  this.startUpdate = function () {
    s_iPrevTime = new Date().getTime();
    _bUpdate = true;
    createjs.Ticker.paused = false;
    $("#block_game").css("display", "none");

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      if (s_bAudioActive) {
        Howler.mute(false);
      }
    }
  };

  this._update = function (event) {
    if (_bUpdate === false) {
      return;
    }
    var iCurTime = new Date().getTime();
    s_iTimeElaps = iCurTime - s_iPrevTime;
    s_iCntTime += s_iTimeElaps;
    s_iCntFps++;
    s_iPrevTime = iCurTime;

    if (s_iCntTime >= 1000) {
      s_iCurFps = s_iCntFps;
      s_iCntTime -= 1000;
      s_iCntFps = 0;
    }

    switch (_iState) {
      case STATE_GAME: {
        _oGame.update();
        break;
      }
      case STATE_LOADING_WHEEL: {
        if (s_oLoadingPanel) {
          s_oLoadingPanel.update();
        }
        break;
      }
    }

    if (s_oWheel !== null && !s_oWheel.isLoaded()) {
      //trace("WHEEL LOADING...");
      s_oWheel.loading();
    }

    s_oStage.update(event);
  };

  s_oMain = this;

  _oData = oData;
  ENABLE_CREDITS = oData.show_credits;
  ENABLE_CHECK_ORIENTATION = oData.check_orientation;
  ENABLE_FULLSCREEN = oData.fullscreen;
  s_bAudioActive = oData.audio_enable_on_startup;

  INSTANT_WHEEL_SETTINGS = oData.instant_win_wheel_settings;

  NUM_IMAGES_BACKGROUNDS = oData.total_images_backgrounds_in_folder;

  this.initContainer();
}
var s_bMobile;
var s_bEasyMode;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oCanvas;
var s_bFullscreen = false;
var s_oLoadingPanel = null;
var s_aSounds;
var s_aSoundsInfo;
