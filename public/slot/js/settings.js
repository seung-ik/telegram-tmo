var CANVAS_WIDTH = 768;
var CANVAS_HEIGHT = 1280;

var EDGEBOARD_X = 40;
var EDGEBOARD_Y = 160;

var FPS = 30;
var FPS_TIME = 1000 / FPS;
var DISABLE_SOUND_MOBILE = false;

var STATE_LOADING = 0;
var STATE_MENU = 1;
var STATE_HELP = 1;
var STATE_LOADING_WHEEL = 2;
var STATE_GAME = 3;

var PRIMARY_FONT = "Arial";
var SECONDARY_FONT = "impact";
var THIRD_FONT = "comfortaa-bold";

var ON_MOUSE_DOWN = 0;
var ON_MOUSE_UP = 1;
var ON_MOUSE_OVER = 2;
var ON_MOUSE_OUT = 3;
var ON_DRAG_START = 4;
var ON_DRAG_END = 5;

var GAME_MODE_BET = 0;
var GAME_MODE_INSTANT = 1;

var WHEEL_IDLE = 0;
var WHEEL_MOVEMENT = 1;

var TIME_ANIM_IDLE = 10000;
var ANIM_IDLE1_TIMESPEED = 250;
var ANIM_IDLE2_TIMESPEED = 50;
var ANIM_IDLE3_TIMESPEED = 1000;

var ANIM_SPIN_TIMESPEED = 50;

var TIME_ANIM_WIN = 5000;
var ANIM_WIN1_TIMESPEED = 50;
var ANIM_WIN2_TIMESPEED = 100;

var TIME_ANIM_LOSE = 5000;

var STATE_IDLE = 0;
var STATE_SPIN = 1;
var STATE_WIN = 2;
var STATE_LOSE = 3;

var LED_SPIN = 4;

var TIME_LOOP_WAIT = 1000;
var MIN_AI_THINKING = 1000;
var MAX_AI_THINKING = 1500;

var MIN_FAKE_SPIN = 3;
var WHEEL_SPIN_TIME; // IN SECONDS
var WHEEL_STRENGHT_ACTIVATION = 10;
var SOUNDTRACK_VOLUME_IN_GAME = 1;

var PRECISION;

var NUM_SEGMENT_TO_RENDER = 1230;

var LABEL_HEIGHT = 40;

var AD_SHOW_COUNTER = new Array();

var WIN_OCCURRENCE;

var ENABLE_CREDITS;
var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;

var NUM_IMAGES_BACKGROUNDS;

var WHEEL_TEXT_PIXEL_MAX_SIZE = 180;
