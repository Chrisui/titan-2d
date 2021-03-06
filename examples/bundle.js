/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };
	
	var Master = _interopRequireWildcard(__webpack_require__(1));
	
	Master.render(document.getElementById("container"));
	
	__webpack_require__(2);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	exports.render = render;
	exports.cleanup = cleanup;
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var Engine = _interopRequire(__webpack_require__(4));
	
	var Entity = _interopRequire(__webpack_require__(5));
	
	var Input = _interopRequire(__webpack_require__(6));
	
	var _matter = __webpack_require__(9);
	
	var World = _matter.World;
	var Bodies = _matter.Bodies;
	var Body = _matter.Body;
	var Vector = _matter.Vector;
	
	var Mousetrap = _interopRequire(__webpack_require__(8));
	
	var values = _interopRequire(__webpack_require__(10));
	
	function render(renderTo) {
	
	  var engine = Engine.create({
	    render: {
	      element: renderTo
	    }
	  });
	
	  var player = Bodies.circle(100, 100, 30, { restitution: 0.6, friction: 0.1 });
	  var crosshairs = Bodies.circle(300, 300, 5, { isStatic: true });
	
	  World.add(engine.world, [player, crosshairs]);
	
	  var offset = 5;
	  World.add(engine.world, [Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }), Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }), Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }), Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true })]);
	
	  var jump = Input.create(null, [Input.KEYBOARD_UP, Input.KEYBOARD_W, Input.GAMEPAD_A]);
	  var runRight = Input.create(null, [Input.KEYBOARD_RIGHT, Input.KEYBOARD_D, Input.GAMEPAD_L_RIGHT]);
	  var runLeft = Input.create(null, [Input.KEYBOARD_LEFT, Input.KEYBOARD_A, Input.GAMEPAD_L_LEFT]);
	  var aimUp = Input.create(null, [Input.GAMEPAD_R_UP]);
	  var aimRight = Input.create(null, [Input.GAMEPAD_R_RIGHT]);
	  var aimDown = Input.create(null, [Input.GAMEPAD_R_DOWN]);
	  var aimLeft = Input.create(null, [Input.GAMEPAD_R_LEFT]);
	  var toggleTime = Input.create(null, [Input.GAMEPAD_X]);
	
	  var AIM_SENSITIVITY = 10;
	  var RUN_FORCE = 0.01;
	  var JUMP_FORCE = 0.1;
	  var RUN_THRESHOLD = 5;
	  var JUMP_THRESHOLD = 3;
	  var Y_TO_MOVE_THRESHOLD = 0.5;
	
	  var canJump = true;
	
	  Engine.run(engine, function () {
	
	    if (jump.value && Math.abs(player.velocity.y) < JUMP_THRESHOLD && jump.hasChanged) {
	      Body.applyForce(player, Vector.sub(player.position, { x: player.position.y, y: player.position.y + 15 }), { x: 0, y: -JUMP_FORCE * jump.value });
	    }
	
	    if (runRight.value && player.velocity.x < RUN_THRESHOLD) {
	      Body.applyForce(player, Vector.sub(player.position, { x: player.position.x - 15, y: player.position.y }), { x: RUN_FORCE * runRight.value, y: 0 });
	    }
	
	    if (runLeft.value && player.velocity.x > -RUN_THRESHOLD) {
	      Body.applyForce(player, Vector.sub(player.position, { x: player.position.x + 15, y: player.position.y }), { x: -RUN_FORCE * runLeft.value, y: 0 });
	    }
	
	    if (aimUp.value) {
	      Body.translate(crosshairs, { x: 0, y: -AIM_SENSITIVITY * aimUp.value });
	    }
	
	    if (aimRight.value) {
	      Body.translate(crosshairs, { x: AIM_SENSITIVITY * aimRight.value, y: 0 });
	    }
	
	    if (aimDown.value) {
	      Body.translate(crosshairs, { x: 0, y: AIM_SENSITIVITY * aimDown.value });
	    }
	
	    if (aimLeft.value) {
	      Body.translate(crosshairs, { x: -AIM_SENSITIVITY * aimLeft.value, y: 0 });
	    }
	
	    if (toggleTime.value && toggleTime.hasChanged) {
	      engine.timeScale = engine.timeScale === 1 ? 0.1 : 1;
	    }
	  });
	
	  // debug
	  window.engine = engine;
	  window.world = engine.world;
	  window.player = player;
	}
	
	function cleanup(cleanFrom) {}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./style.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(14)();
	exports.push([module.id, "* {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: \"Helvetica Neue\", Arial, sans-serif;\n  margin: 0;\n}\n\ncanvas {\n  position: absolute;\n}", ""]);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var assign = _interopRequire(__webpack_require__(11));
	
	var _matter = __webpack_require__(9);
	
	var MatterEngine = _matter.Engine;
	var RenderPixi = _matter.RenderPixi;
	
	var World = _interopRequire(__webpack_require__(12));
	
	var Entity = _interopRequire(__webpack_require__(5));
	
	var Runner = _interopRequire(__webpack_require__(13));
	
	var _Input = __webpack_require__(6);
	
	var observeInput = _Input.observe;
	var updateInput = _Input.update;
	
	var Engine = {};
	
	Engine.create = function () {
	  var state = arguments[0] === undefined ? {} : arguments[0];
	
	  var engine = assign({
	    timeScale: 1,
	    inputs: {}
	  }, state);
	
	  engine.world = World.create(engine.world);
	
	  engine.physics = MatterEngine.create(engine.physics);
	  engine.physics.world = engine.world;
	
	  engine.render = RenderPixi.create(engine.render);
	
	  return engine;
	};
	
	Engine.update = function (engine, deltaTime, correction) {
	  var entities = World.allEntities(engine.world);
	  var numEntities = entities.length;
	
	  updateInput();
	
	  for (var i = 0; i < numEntities; i++) {
	    Entity.update(entities[i], deltaTime, engine.timeScale, correction);
	  }
	
	  engine.physics.timing.timeScale = engine.timeScale;
	  MatterEngine.update(engine.physics, deltaTime, correction);
	};
	
	Engine.run = function (engine, tick) {
	  engine.runner = Runner.create(null, function (delta, correction) {
	    if (tick) {
	      tick(delta, correction);
	    }
	
	    Engine.update(engine, delta, correction);
	
	    RenderPixi.world(engine);
	  });
	
	  observeInput();
	};
	
	Engine.stop = function (engine) {
	  Runner.destroy(engine.runner);
	};
	
	module.exports = Engine;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var assign = _interopRequire(__webpack_require__(11));
	
	var Composite = __webpack_require__(9).Composite;
	
	var Entity = {};
	
	Entity.create = function () {
	  var state = arguments[0] === undefined ? {} : arguments[0];
	
	  var entity = Composite.create(assign({
	    label: "TIEntity"
	  }, state));
	
	  return entity;
	};
	
	Entity.update = function (entity, deltaTime, timeScale, correction) {};
	
	module.exports = Entity;
	
	// Note: This is pre physics update

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	// Kick off input tracking
	exports.observe = observe;
	
	// Update next tick - after this, checking inputs will be accurate within this frame
	exports.update = update;
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var assign = _interopRequire(__webpack_require__(11));
	
	/**
	 * This is a quick drop in file which may have to be changed later to fit our needs.
	 * it is basically just taken from http://gamedevelopment.tutsplus.com/tutorials/game-input-simplified--cms-19759
	 * with a few modifications to fit the rest of the engine public api
	 * Note: the state within this file is contained as a global singleton so would only really work with one engine
	 *       which with blind foresight seems fine?
	 * Usage: var jump = Input.create(null, [Input.KEYBOARD_UP, GAMEPAD_A]);
	 *        update() { if (jump.value) {} }
	 * 
	 * TODO: Not sure this currently has great support for action/state differentiation
	 *   SEE: http://www.gamedev.net/blog/355/entry-2250186-designing-a-robust-input-handling-system-for-games/
	 */
	var KEYBOARD = 1;
	var POINTER = 2;
	var GAMEPAD = 3;
	var DEVICE = 16;
	var CODE = 8;
	
	var __pointer = {
	  currentX: 0,
	  currentY: 0,
	  previousX: 0,
	  previousY: 0,
	  distanceX: 0,
	  distanceY: 0,
	  identifier: -1,
	  moved: false,
	  pressed: false
	};
	
	var __keyboard = {};
	var __inputs = [];
	var __channels = [];
	
	var __mouseDetected = false;
	var __touchDetected = false;
	
	// Updates a GameInput instance.
	function updateInput(input, channels) {
	  var i = channels.length;
	  var channel = 0;
	  var device = 0;
	  var code = 0;
	  var threshold = 0;
	  var gamepad = null;
	
	  input.oldValue = input.value;
	  input.value = 0;
	
	  while (i-- > 0) {
	    channel = channels[i];
	    device = channel >>> DEVICE & 255;
	    code = channel >>> CODE & 255;
	
	    if (device === KEYBOARD) {
	      if (__keyboard[code] === true) {
	        updateValue(input, 1);
	      }
	      continue;
	    }
	
	    if (device === POINTER) {
	      if (code === 0) {
	        if (__pointer.distanceY < 0) {
	          updateValue(input, -__pointer.distanceY);
	        }
	        continue;
	      }
	
	      if (code === 1) {
	        if (__pointer.distanceY > 0) {
	          updateValue(input, __pointer.distanceY);
	        }
	        continue;
	      }
	
	      if (code === 2) {
	        if (__pointer.distanceX < 0) {
	          updateValue(input, -__pointer.distanceX);
	        }
	        continue;
	      }
	
	      if (code === 3) {
	        if (__pointer.distanceX > 0) {
	          updateValue(input, __pointer.distanceX);
	        }
	        continue;
	      }
	
	      if (code === 4) {
	        if (__pointer.pressed) {
	          updateValue(input, 1);
	        }
	        continue;
	      }
	
	      continue;
	    }
	
	    if (device === GAMEPAD) {
	      if (gamepad === null) {
	        // W3C
	        if (navigator.getGamepads !== undefined) {
	          gamepad = navigator.getGamepads()[0];
	        }
	        // Webkit (non-standard)
	        else if (navigator.webkitGetGamepads !== undefined) {
	          gamepad = navigator.webkitGetGamepads()[0];
	        } else {
	          gamepad = undefined;
	        }
	      }
	
	      if (gamepad === undefined || gamepad.connected === false) {
	        continue;
	      }
	
	      // Set the threshold for analog buttons.
	      threshold = 0.05;
	
	      if (code < 16) {
	        if (gamepad.buttons[code] !== undefined) {
	          // W3C
	          if (gamepad.buttons[code].value !== undefined) {
	            updateValue(input, gamepad.buttons[code].value, threshold);
	          }
	          // Webkit (non-standard)
	          else {
	            updateValue(input, gamepad.buttons[code], threshold);
	          }
	        }
	        continue;
	      }
	
	      // Set the threshold for analog sticks.
	      threshold = 0.18;
	
	      if (code === 16) {
	        if (gamepad.axes[1] < 0) {
	          updateValue(input, -gamepad.axes[1], threshold);
	        }
	        continue;
	      }
	
	      if (code === 17) {
	        if (gamepad.axes[1] > 0) {
	          updateValue(input, gamepad.axes[1], threshold);
	        }
	        continue;
	      }
	
	      if (code === 18) {
	        if (gamepad.axes[0] < 0) {
	          updateValue(input, -gamepad.axes[0], threshold);
	        }
	        continue;
	      }
	
	      if (code === 19) {
	        if (gamepad.axes[0] > 0) {
	          updateValue(input, gamepad.axes[0], threshold);
	        }
	        continue;
	      }
	
	      if (code === 20) {
	        if (gamepad.axes[3] < 0) {
	          updateValue(input, -gamepad.axes[3], threshold);
	        }
	        continue;
	      }
	
	      if (code === 21) {
	        if (gamepad.axes[3] > 0) {
	          updateValue(input, gamepad.axes[3], threshold);
	        }
	        continue;
	      }
	
	      if (code === 22) {
	        if (gamepad.axes[2] < 0) {
	          updateValue(input, -gamepad.axes[2], threshold);
	        }
	        continue;
	      }
	
	      if (code === 23) {
	        if (gamepad.axes[2] > 0) {
	          updateValue(input, gamepad.axes[2], threshold);
	        }
	        continue;
	      }
	
	      continue;
	    }
	
	    // If we are here the device is unknown.
	  }
	}
	
	// Updates the value of a GameInput instance.
	function updateValue(input, value, threshold) {
	  if (threshold !== undefined) {
	    if (value < threshold) {
	      value = 0;
	    }
	  }
	
	  // The highest value has priority.
	  if (input.value < value) {
	    input.value = value;
	  }
	
	  if (input.oldValue !== input.value) {
	    input.hasChanged = true;
	  } else {
	    input.hasChanged = false;
	  }
	}
	
	// Updates the pointer values.
	function updatePointer() {
	  // Clamp the pointer's horizontal position.
	  if (__pointer.currentX < 0) {
	    __pointer.currentX = 0;
	  } else if (__pointer.currentX >= window.innerWidth) {
	    __pointer.currentX = window.innerWidth - 1;
	  }
	
	  // Clamp the pointer's vertical position.
	  if (__pointer.currentY < 0) {
	    __pointer.currentY = 0;
	  } else if (__pointer.currentY >= window.innerHeight) {
	    __pointer.currentY = window.innerHeight - 1;
	  }
	
	  // Make sure the pointer speed is in range.
	  if (GameInput.pointerSpeed < 1) {
	    GameInput.pointerSpeed = 1;
	  }
	
	  __pointer.distanceX = (__pointer.currentX - __pointer.previousX) / GameInput.pointerSpeed;
	  __pointer.distanceY = (__pointer.currentY - __pointer.previousY) / GameInput.pointerSpeed;
	
	  __pointer.previousX = __pointer.currentX;
	  __pointer.previousY = __pointer.currentY;
	
	  // Clamp the pointer's horizontal distance.
	  if (__pointer.distanceX > 1) {
	    __pointer.distanceX = 1;
	  } else if (__pointer.distanceX < -1) {
	    __pointer.distanceX = -1;
	  }
	
	  // Clamp the pointer's vertical distance.
	  if (__pointer.distanceY > 1) {
	    __pointer.distanceY = 1;
	  } else if (__pointer.distanceY < -1) {
	    __pointer.distanceY = -1;
	  }
	
	  GameInput.pointerX = __pointer.currentX;
	  GameInput.pointerY = __pointer.currentY;
	}
	
	// Called when a mouse input device is detected.
	function mouseDetected() {
	  if (__mouseDetected === false) {
	    __mouseDetected = true;
	
	    // Ignore touch events if a mouse is being used.
	    removeTouchListeners();
	  }
	}
	
	// Called when a touch-screen input device is detected.
	function touchDetected() {
	  if (__touchDetected === false) {
	    __touchDetected = true;
	
	    // Ignore mouse events if a touch-screen is being used.
	    removeMouseListeners();
	  }
	}
	
	// Called when a pointer-like input device is pressed.
	function pointerPressed(x, y, identifier) {
	  __pointer.identifier = identifier;
	  __pointer.pressed = true;
	
	  pointerMoved(x, y);
	}
	
	// Called when a pointer-like input device is released.
	function pointerReleased() {
	  __pointer.identifier = 0;
	  __pointer.pressed = false;
	}
	
	// Called when a pointer-like input device is moved.
	function pointerMoved(x, y) {
	  __pointer.currentX = x >>> 0;
	  __pointer.currentY = y >>> 0;
	
	  if (__pointer.moved === false) {
	    __pointer.moved = true;
	    __pointer.previousX = __pointer.currentX;
	    __pointer.previousY = __pointer.currentY;
	  }
	}
	
	// Kills an event.
	function killEvent(event) {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}
	
	// Called when a mouse button is pressed.
	function onMouseDown(event) {
	  mouseDetected();
	
	  if (event.button === 0) {
	    pointerPressed(event.clientX, event.clientY, 0);
	  }
	
	  //killEvent( event );
	}
	
	// Called when a mouse button is released.
	function onMouseUp(event) {
	  mouseDetected();
	
	  if (event.button === 0) {
	    pointerReleased();
	  }
	
	  //killEvent( event );
	}
	
	// Called when a mouse is moused.
	function onMouseMove(event) {
	  mouseDetected();
	
	  pointerMoved(event.clientX, event.clientY);
	
	  //killEvent( event );
	}
	
	// Called when a touch-screen is pressed.
	function onTouchStart(event) {
	  touchDetected();
	
	  var touch = event.touches[0];
	
	  if (__pointer.pressed === false) {
	    pointerPressed(touch.clientX, touch.clientY, touch.identifier);
	  }
	
	  //killEvent( event );
	}
	
	// Called when a touch-screen is released.
	function onTouchEnd(event) {
	  touchDetected();
	
	  var list = event.changedTouches;
	  var touch = list[0];
	
	  if (touch.identifier === __pointer.identifier) {
	    pointerReleased();
	  } else {
	    var i = 1;
	    var n = list.length;
	
	    while (i < n) {
	      touch = list[i];
	
	      if (touch.identifier === __pointer.identifier) {
	        pointerReleased();
	        break;
	      }
	
	      i++;
	    }
	  }
	
	  //killEvent( event );
	}
	
	// Called when a touch-point is moved.
	function onTouchMove(event) {
	  touchDetected();
	
	  var list = event.touches;
	  var touch = list[0];
	
	  if (touch.identifier === __pointer.identifier) {
	    pointerMoved(touch.clientX, touch.clientY);
	  } else {
	    var i = 1;
	    var n = list.length;
	
	    while (i < n) {
	      touch = list[i];
	
	      if (touch.identifier === __pointer.identifier) {
	        pointerMoved(touch.clientX, touch.clientY);
	        break;
	      }
	
	      i++;
	    }
	  }
	
	  //killEvent( event );
	}
	
	// Called when a keyboard key is pressed.
	function onKeyDown(event) {
	  __keyboard[event.keyCode] = true;
	
	  //killEvent( event );
	}
	
	// Called when a keyboard key is released.
	function onKeyUp(event) {
	  __keyboard[event.keyCode] = false;
	
	  //killEvent( event );
	}
	
	// Mouse listeners.
	function addMouseListeners() {
	  window.addEventListener("mousedown", onMouseDown, true);
	  window.addEventListener("mouseup", onMouseUp, true);
	  window.addEventListener("mousemove", onMouseMove, true);
	}
	
	// Mouse listeners.
	function removeMouseListeners() {
	  window.removeEventListener("mousedown", onMouseDown, true);
	  window.removeEventListener("mouseup", onMouseUp, true);
	  window.removeEventListener("mousemove", onMouseMove, true);
	}
	
	// Touch-screen listeners.
	function addTouchListeners() {
	  window.addEventListener("touchstart", onTouchStart, true);
	  window.addEventListener("touchend", onTouchEnd, true);
	  window.addEventListener("touchmove", onTouchMove, true);
	}
	
	// Touch-screen listeners.
	function removeTouchListeners() {
	  window.removeEventListener("touchstart", onTouchStart, true);
	  window.removeEventListener("touchend", onTouchEnd, true);
	  window.removeEventListener("touchmove", onTouchMove, true);
	}
	
	// Touch-screen listeners.
	function addKeyboardListeners() {
	  window.addEventListener("keydown", onKeyDown, true);
	  window.addEventListener("keyup", onKeyUp, true);
	}
	
	// Touch-screen listeners.
	function removeKeyboardListeners() {
	  window.removeEventListener("keydown", onKeyDown, true);
	  window.removeEventListener("keyup", onKeyUp, true);
	}
	
	// Exported GameInput domain
	// Note: GameInput actions will peer into a singleton input state
	// - See exported observe and update functions for usage
	var GameInput = {};
	
	GameInput.create = function (state, channels) {
	  var input = assign({
	    value: 0,
	    enabled: true,
	    changed: false
	  }, state);
	
	  for (var i = 0; i < channels.length; ++i) {
	    GameInput.add(input, channels[i]);
	  }
	
	  return input;
	};
	
	GameInput.add = function (input, channel) {
	  var i = __inputs.indexOf(input);
	
	  if (i === -1) {
	    __inputs.push(input);
	    __channels.push([channel]);
	    return;
	  }
	
	  var ca = __channels[i];
	  var ci = ca.indexOf(channel);
	
	  if (ci === -1) {
	    ca.push(channel);
	  }
	};
	
	GameInput.remove = function (input, channel) {
	  var i = __inputs.indexOf(input);
	
	  if (i === -1) {
	    return;
	  }
	
	  var ca = __channels[i];
	  var ci = ca.indexOf(channel);
	
	  if (ci !== -1) {
	    ca.splice(ci, 1);
	
	    if (ca.length === 0) {
	      __inputs.splice(i, 1);
	      __channels.splice(i, 1);
	    }
	  }
	};
	
	GameInput.reset = function (input) {
	  var i = __inputs.indexOf(input);
	
	  if (i !== -1) {
	    __inputs.splice(i, 1);
	    __channels.splice(i, 1);
	  }
	
	  input.value = 0;
	  input.enabled = true;
	};
	
	// The X position of the pointer, in pixels, within the window viewport.
	GameInput.pointerX = 0;
	
	// The Y position of the pointer, in pixels, within the window viewport.
	GameInput.pointerY = 0;
	
	// The distance the pointer has to move, in pixels per frame, to
	// cause the value of a GameInput instance to equal 1.0.
	GameInput.pointerSpeed = 10;
	
	GameInput.KEYBOARD_A = KEYBOARD << DEVICE | 65 << CODE;
	GameInput.KEYBOARD_B = KEYBOARD << DEVICE | 66 << CODE;
	GameInput.KEYBOARD_C = KEYBOARD << DEVICE | 67 << CODE;
	GameInput.KEYBOARD_D = KEYBOARD << DEVICE | 68 << CODE;
	GameInput.KEYBOARD_E = KEYBOARD << DEVICE | 69 << CODE;
	GameInput.KEYBOARD_F = KEYBOARD << DEVICE | 70 << CODE;
	GameInput.KEYBOARD_G = KEYBOARD << DEVICE | 71 << CODE;
	GameInput.KEYBOARD_H = KEYBOARD << DEVICE | 72 << CODE;
	GameInput.KEYBOARD_I = KEYBOARD << DEVICE | 73 << CODE;
	GameInput.KEYBOARD_J = KEYBOARD << DEVICE | 74 << CODE;
	GameInput.KEYBOARD_K = KEYBOARD << DEVICE | 75 << CODE;
	GameInput.KEYBOARD_L = KEYBOARD << DEVICE | 76 << CODE;
	GameInput.KEYBOARD_M = KEYBOARD << DEVICE | 77 << CODE;
	GameInput.KEYBOARD_N = KEYBOARD << DEVICE | 78 << CODE;
	GameInput.KEYBOARD_O = KEYBOARD << DEVICE | 79 << CODE;
	GameInput.KEYBOARD_P = KEYBOARD << DEVICE | 80 << CODE;
	GameInput.KEYBOARD_Q = KEYBOARD << DEVICE | 81 << CODE;
	GameInput.KEYBOARD_R = KEYBOARD << DEVICE | 82 << CODE;
	GameInput.KEYBOARD_S = KEYBOARD << DEVICE | 83 << CODE;
	GameInput.KEYBOARD_T = KEYBOARD << DEVICE | 84 << CODE;
	GameInput.KEYBOARD_U = KEYBOARD << DEVICE | 85 << CODE;
	GameInput.KEYBOARD_V = KEYBOARD << DEVICE | 86 << CODE;
	GameInput.KEYBOARD_W = KEYBOARD << DEVICE | 87 << CODE;
	GameInput.KEYBOARD_X = KEYBOARD << DEVICE | 88 << CODE;
	GameInput.KEYBOARD_Y = KEYBOARD << DEVICE | 89 << CODE;
	GameInput.KEYBOARD_Z = KEYBOARD << DEVICE | 90 << CODE;
	
	GameInput.KEYBOARD_0 = KEYBOARD << DEVICE | 48 << CODE;
	GameInput.KEYBOARD_1 = KEYBOARD << DEVICE | 49 << CODE;
	GameInput.KEYBOARD_2 = KEYBOARD << DEVICE | 50 << CODE;
	GameInput.KEYBOARD_3 = KEYBOARD << DEVICE | 51 << CODE;
	GameInput.KEYBOARD_4 = KEYBOARD << DEVICE | 52 << CODE;
	GameInput.KEYBOARD_5 = KEYBOARD << DEVICE | 53 << CODE;
	GameInput.KEYBOARD_6 = KEYBOARD << DEVICE | 54 << CODE;
	GameInput.KEYBOARD_7 = KEYBOARD << DEVICE | 55 << CODE;
	GameInput.KEYBOARD_8 = KEYBOARD << DEVICE | 56 << CODE;
	GameInput.KEYBOARD_9 = KEYBOARD << DEVICE | 57 << CODE;
	
	GameInput.KEYBOARD_UP = KEYBOARD << DEVICE | 38 << CODE;
	GameInput.KEYBOARD_DOWN = KEYBOARD << DEVICE | 40 << CODE;
	GameInput.KEYBOARD_LEFT = KEYBOARD << DEVICE | 37 << CODE;
	GameInput.KEYBOARD_RIGHT = KEYBOARD << DEVICE | 39 << CODE;
	GameInput.KEYBOARD_SPACE = KEYBOARD << DEVICE | 32 << CODE;
	GameInput.KEYBOARD_SHIFT = KEYBOARD << DEVICE | 16 << CODE;
	
	GameInput.POINTER_UP = POINTER << DEVICE | 0 << CODE;
	GameInput.POINTER_DOWN = POINTER << DEVICE | 1 << CODE;
	GameInput.POINTER_LEFT = POINTER << DEVICE | 2 << CODE;
	GameInput.POINTER_RIGHT = POINTER << DEVICE | 3 << CODE;
	GameInput.POINTER_PRESS = POINTER << DEVICE | 4 << CODE;
	
	GameInput.GAMEPAD_A = GAMEPAD << DEVICE | 0 << CODE;
	GameInput.GAMEPAD_B = GAMEPAD << DEVICE | 1 << CODE;
	GameInput.GAMEPAD_X = GAMEPAD << DEVICE | 2 << CODE;
	GameInput.GAMEPAD_Y = GAMEPAD << DEVICE | 3 << CODE;
	GameInput.GAMEPAD_LB = GAMEPAD << DEVICE | 4 << CODE;
	GameInput.GAMEPAD_RB = GAMEPAD << DEVICE | 5 << CODE;
	GameInput.GAMEPAD_LT = GAMEPAD << DEVICE | 6 << CODE;
	GameInput.GAMEPAD_RT = GAMEPAD << DEVICE | 7 << CODE;
	GameInput.GAMEPAD_START = GAMEPAD << DEVICE | 8 << CODE;
	GameInput.GAMEPAD_SELECT = GAMEPAD << DEVICE | 9 << CODE;
	GameInput.GAMEPAD_L = GAMEPAD << DEVICE | 10 << CODE;
	GameInput.GAMEPAD_R = GAMEPAD << DEVICE | 11 << CODE;
	GameInput.GAMEPAD_UP = GAMEPAD << DEVICE | 12 << CODE;
	GameInput.GAMEPAD_DOWN = GAMEPAD << DEVICE | 13 << CODE;
	GameInput.GAMEPAD_LEFT = GAMEPAD << DEVICE | 14 << CODE;
	GameInput.GAMEPAD_RIGHT = GAMEPAD << DEVICE | 15 << CODE;
	GameInput.GAMEPAD_L_UP = GAMEPAD << DEVICE | 16 << CODE;
	GameInput.GAMEPAD_L_DOWN = GAMEPAD << DEVICE | 17 << CODE;
	GameInput.GAMEPAD_L_LEFT = GAMEPAD << DEVICE | 18 << CODE;
	GameInput.GAMEPAD_L_RIGHT = GAMEPAD << DEVICE | 19 << CODE;
	GameInput.GAMEPAD_R_UP = GAMEPAD << DEVICE | 20 << CODE;
	GameInput.GAMEPAD_R_DOWN = GAMEPAD << DEVICE | 21 << CODE;
	GameInput.GAMEPAD_R_LEFT = GAMEPAD << DEVICE | 22 << CODE;
	GameInput.GAMEPAD_R_RIGHT = GAMEPAD << DEVICE | 23 << CODE;
	
	exports["default"] = GameInput;
	
	function observe() {
	  // Add the event listeners.
	  addMouseListeners();
	  addTouchListeners();
	  addKeyboardListeners();
	
	  // Some UI actions we should prevent.
	  window.addEventListener("contextmenu", killEvent, true);
	  window.addEventListener("selectstart", killEvent, true);
	}
	
	function update() {
	  updatePointer();
	
	  var i = __inputs.length;
	  var input = null;
	  var channels = null;
	
	  while (i-- > 0) {
	    input = __inputs[i];
	    channels = __channels[i];
	
	    if (input.enabled === true) {
	      updateInput(input, channels);
	    } else {
	      input.value = 0;
	    }
	  }
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*global define:false */
	/**
	 * Copyright 2015 Craig Campbell
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * Mousetrap is a simple keyboard shortcut library for Javascript with
	 * no external dependencies
	 *
	 * @version 1.5.2
	 * @url craig.is/killing/mice
	 */
	(function(window, document, undefined) {
	
	    /**
	     * mapping of special keycodes to their corresponding keys
	     *
	     * everything in this dictionary cannot use keypress events
	     * so it has to be here to map to the correct keycodes for
	     * keyup/keydown events
	     *
	     * @type {Object}
	     */
	    var _MAP = {
	        8: 'backspace',
	        9: 'tab',
	        13: 'enter',
	        16: 'shift',
	        17: 'ctrl',
	        18: 'alt',
	        20: 'capslock',
	        27: 'esc',
	        32: 'space',
	        33: 'pageup',
	        34: 'pagedown',
	        35: 'end',
	        36: 'home',
	        37: 'left',
	        38: 'up',
	        39: 'right',
	        40: 'down',
	        45: 'ins',
	        46: 'del',
	        91: 'meta',
	        93: 'meta',
	        224: 'meta'
	    };
	
	    /**
	     * mapping for special characters so they can support
	     *
	     * this dictionary is only used incase you want to bind a
	     * keyup or keydown event to one of these keys
	     *
	     * @type {Object}
	     */
	    var _KEYCODE_MAP = {
	        106: '*',
	        107: '+',
	        109: '-',
	        110: '.',
	        111 : '/',
	        186: ';',
	        187: '=',
	        188: ',',
	        189: '-',
	        190: '.',
	        191: '/',
	        192: '`',
	        219: '[',
	        220: '\\',
	        221: ']',
	        222: '\''
	    };
	
	    /**
	     * this is a mapping of keys that require shift on a US keypad
	     * back to the non shift equivelents
	     *
	     * this is so you can use keyup events with these keys
	     *
	     * note that this will only work reliably on US keyboards
	     *
	     * @type {Object}
	     */
	    var _SHIFT_MAP = {
	        '~': '`',
	        '!': '1',
	        '@': '2',
	        '#': '3',
	        '$': '4',
	        '%': '5',
	        '^': '6',
	        '&': '7',
	        '*': '8',
	        '(': '9',
	        ')': '0',
	        '_': '-',
	        '+': '=',
	        ':': ';',
	        '\"': '\'',
	        '<': ',',
	        '>': '.',
	        '?': '/',
	        '|': '\\'
	    };
	
	    /**
	     * this is a list of special strings you can use to map
	     * to modifier keys when you specify your keyboard shortcuts
	     *
	     * @type {Object}
	     */
	    var _SPECIAL_ALIASES = {
	        'option': 'alt',
	        'command': 'meta',
	        'return': 'enter',
	        'escape': 'esc',
	        'plus': '+',
	        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
	    };
	
	    /**
	     * variable to store the flipped version of _MAP from above
	     * needed to check if we should use keypress or not when no action
	     * is specified
	     *
	     * @type {Object|undefined}
	     */
	    var _REVERSE_MAP;
	
	    /**
	     * loop through the f keys, f1 to f19 and add them to the map
	     * programatically
	     */
	    for (var i = 1; i < 20; ++i) {
	        _MAP[111 + i] = 'f' + i;
	    }
	
	    /**
	     * loop through to map numbers on the numeric keypad
	     */
	    for (i = 0; i <= 9; ++i) {
	        _MAP[i + 96] = i;
	    }
	
	    /**
	     * cross browser add event method
	     *
	     * @param {Element|HTMLDocument} object
	     * @param {string} type
	     * @param {Function} callback
	     * @returns void
	     */
	    function _addEvent(object, type, callback) {
	        if (object.addEventListener) {
	            object.addEventListener(type, callback, false);
	            return;
	        }
	
	        object.attachEvent('on' + type, callback);
	    }
	
	    /**
	     * takes the event and returns the key character
	     *
	     * @param {Event} e
	     * @return {string}
	     */
	    function _characterFromEvent(e) {
	
	        // for keypress events we should return the character as is
	        if (e.type == 'keypress') {
	            var character = String.fromCharCode(e.which);
	
	            // if the shift key is not pressed then it is safe to assume
	            // that we want the character to be lowercase.  this means if
	            // you accidentally have caps lock on then your key bindings
	            // will continue to work
	            //
	            // the only side effect that might not be desired is if you
	            // bind something like 'A' cause you want to trigger an
	            // event when capital A is pressed caps lock will no longer
	            // trigger the event.  shift+a will though.
	            if (!e.shiftKey) {
	                character = character.toLowerCase();
	            }
	
	            return character;
	        }
	
	        // for non keypress events the special maps are needed
	        if (_MAP[e.which]) {
	            return _MAP[e.which];
	        }
	
	        if (_KEYCODE_MAP[e.which]) {
	            return _KEYCODE_MAP[e.which];
	        }
	
	        // if it is not in the special map
	
	        // with keydown and keyup events the character seems to always
	        // come in as an uppercase character whether you are pressing shift
	        // or not.  we should make sure it is always lowercase for comparisons
	        return String.fromCharCode(e.which).toLowerCase();
	    }
	
	    /**
	     * checks if two arrays are equal
	     *
	     * @param {Array} modifiers1
	     * @param {Array} modifiers2
	     * @returns {boolean}
	     */
	    function _modifiersMatch(modifiers1, modifiers2) {
	        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
	    }
	
	    /**
	     * takes a key event and figures out what the modifiers are
	     *
	     * @param {Event} e
	     * @returns {Array}
	     */
	    function _eventModifiers(e) {
	        var modifiers = [];
	
	        if (e.shiftKey) {
	            modifiers.push('shift');
	        }
	
	        if (e.altKey) {
	            modifiers.push('alt');
	        }
	
	        if (e.ctrlKey) {
	            modifiers.push('ctrl');
	        }
	
	        if (e.metaKey) {
	            modifiers.push('meta');
	        }
	
	        return modifiers;
	    }
	
	    /**
	     * prevents default for this event
	     *
	     * @param {Event} e
	     * @returns void
	     */
	    function _preventDefault(e) {
	        if (e.preventDefault) {
	            e.preventDefault();
	            return;
	        }
	
	        e.returnValue = false;
	    }
	
	    /**
	     * stops propogation for this event
	     *
	     * @param {Event} e
	     * @returns void
	     */
	    function _stopPropagation(e) {
	        if (e.stopPropagation) {
	            e.stopPropagation();
	            return;
	        }
	
	        e.cancelBubble = true;
	    }
	
	    /**
	     * determines if the keycode specified is a modifier key or not
	     *
	     * @param {string} key
	     * @returns {boolean}
	     */
	    function _isModifier(key) {
	        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
	    }
	
	    /**
	     * reverses the map lookup so that we can look for specific keys
	     * to see what can and can't use keypress
	     *
	     * @return {Object}
	     */
	    function _getReverseMap() {
	        if (!_REVERSE_MAP) {
	            _REVERSE_MAP = {};
	            for (var key in _MAP) {
	
	                // pull out the numeric keypad from here cause keypress should
	                // be able to detect the keys from the character
	                if (key > 95 && key < 112) {
	                    continue;
	                }
	
	                if (_MAP.hasOwnProperty(key)) {
	                    _REVERSE_MAP[_MAP[key]] = key;
	                }
	            }
	        }
	        return _REVERSE_MAP;
	    }
	
	    /**
	     * picks the best action based on the key combination
	     *
	     * @param {string} key - character for key
	     * @param {Array} modifiers
	     * @param {string=} action passed in
	     */
	    function _pickBestAction(key, modifiers, action) {
	
	        // if no action was picked in we should try to pick the one
	        // that we think would work best for this key
	        if (!action) {
	            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
	        }
	
	        // modifier keys don't work as expected with keypress,
	        // switch to keydown
	        if (action == 'keypress' && modifiers.length) {
	            action = 'keydown';
	        }
	
	        return action;
	    }
	
	    /**
	     * Converts from a string key combination to an array
	     *
	     * @param  {string} combination like "command+shift+l"
	     * @return {Array}
	     */
	    function _keysFromString(combination) {
	        if (combination === '+') {
	            return ['+'];
	        }
	
	        combination = combination.replace(/\+{2}/g, '+plus');
	        return combination.split('+');
	    }
	
	    /**
	     * Gets info for a specific key combination
	     *
	     * @param  {string} combination key combination ("command+s" or "a" or "*")
	     * @param  {string=} action
	     * @returns {Object}
	     */
	    function _getKeyInfo(combination, action) {
	        var keys;
	        var key;
	        var i;
	        var modifiers = [];
	
	        // take the keys from this pattern and figure out what the actual
	        // pattern is all about
	        keys = _keysFromString(combination);
	
	        for (i = 0; i < keys.length; ++i) {
	            key = keys[i];
	
	            // normalize key names
	            if (_SPECIAL_ALIASES[key]) {
	                key = _SPECIAL_ALIASES[key];
	            }
	
	            // if this is not a keypress event then we should
	            // be smart about using shift keys
	            // this will only work for US keyboards however
	            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
	                key = _SHIFT_MAP[key];
	                modifiers.push('shift');
	            }
	
	            // if this key is a modifier then add it to the list of modifiers
	            if (_isModifier(key)) {
	                modifiers.push(key);
	            }
	        }
	
	        // depending on what the key combination is
	        // we will try to pick the best event for it
	        action = _pickBestAction(key, modifiers, action);
	
	        return {
	            key: key,
	            modifiers: modifiers,
	            action: action
	        };
	    }
	
	    function _belongsTo(element, ancestor) {
	        if (element === document) {
	            return false;
	        }
	
	        if (element === ancestor) {
	            return true;
	        }
	
	        return _belongsTo(element.parentNode, ancestor);
	    }
	
	    function Mousetrap(targetElement) {
	        var self = this;
	
	        targetElement = targetElement || document;
	
	        if (!(self instanceof Mousetrap)) {
	            return new Mousetrap(targetElement);
	        }
	
	        /**
	         * element to attach key events to
	         *
	         * @type {Element}
	         */
	        self.target = targetElement;
	
	        /**
	         * a list of all the callbacks setup via Mousetrap.bind()
	         *
	         * @type {Object}
	         */
	        self._callbacks = {};
	
	        /**
	         * direct map of string combinations to callbacks used for trigger()
	         *
	         * @type {Object}
	         */
	        self._directMap = {};
	
	        /**
	         * keeps track of what level each sequence is at since multiple
	         * sequences can start out with the same sequence
	         *
	         * @type {Object}
	         */
	        var _sequenceLevels = {};
	
	        /**
	         * variable to store the setTimeout call
	         *
	         * @type {null|number}
	         */
	        var _resetTimer;
	
	        /**
	         * temporary state where we will ignore the next keyup
	         *
	         * @type {boolean|string}
	         */
	        var _ignoreNextKeyup = false;
	
	        /**
	         * temporary state where we will ignore the next keypress
	         *
	         * @type {boolean}
	         */
	        var _ignoreNextKeypress = false;
	
	        /**
	         * are we currently inside of a sequence?
	         * type of action ("keyup" or "keydown" or "keypress") or false
	         *
	         * @type {boolean|string}
	         */
	        var _nextExpectedAction = false;
	
	        /**
	         * resets all sequence counters except for the ones passed in
	         *
	         * @param {Object} doNotReset
	         * @returns void
	         */
	        function _resetSequences(doNotReset) {
	            doNotReset = doNotReset || {};
	
	            var activeSequences = false,
	                key;
	
	            for (key in _sequenceLevels) {
	                if (doNotReset[key]) {
	                    activeSequences = true;
	                    continue;
	                }
	                _sequenceLevels[key] = 0;
	            }
	
	            if (!activeSequences) {
	                _nextExpectedAction = false;
	            }
	        }
	
	        /**
	         * finds all callbacks that match based on the keycode, modifiers,
	         * and action
	         *
	         * @param {string} character
	         * @param {Array} modifiers
	         * @param {Event|Object} e
	         * @param {string=} sequenceName - name of the sequence we are looking for
	         * @param {string=} combination
	         * @param {number=} level
	         * @returns {Array}
	         */
	        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
	            var i;
	            var callback;
	            var matches = [];
	            var action = e.type;
	
	            // if there are no events related to this keycode
	            if (!self._callbacks[character]) {
	                return [];
	            }
	
	            // if a modifier key is coming up on its own we should allow it
	            if (action == 'keyup' && _isModifier(character)) {
	                modifiers = [character];
	            }
	
	            // loop through all callbacks for the key that was pressed
	            // and see if any of them match
	            for (i = 0; i < self._callbacks[character].length; ++i) {
	                callback = self._callbacks[character][i];
	
	                // if a sequence name is not specified, but this is a sequence at
	                // the wrong level then move onto the next match
	                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
	                    continue;
	                }
	
	                // if the action we are looking for doesn't match the action we got
	                // then we should keep going
	                if (action != callback.action) {
	                    continue;
	                }
	
	                // if this is a keypress event and the meta key and control key
	                // are not pressed that means that we need to only look at the
	                // character, otherwise check the modifiers as well
	                //
	                // chrome will not fire a keypress if meta or control is down
	                // safari will fire a keypress if meta or meta+shift is down
	                // firefox will fire a keypress if meta or control is down
	                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {
	
	                    // when you bind a combination or sequence a second time it
	                    // should overwrite the first one.  if a sequenceName or
	                    // combination is specified in this call it does just that
	                    //
	                    // @todo make deleting its own method?
	                    var deleteCombo = !sequenceName && callback.combo == combination;
	                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
	                    if (deleteCombo || deleteSequence) {
	                        self._callbacks[character].splice(i, 1);
	                    }
	
	                    matches.push(callback);
	                }
	            }
	
	            return matches;
	        }
	
	        /**
	         * actually calls the callback function
	         *
	         * if your callback function returns false this will use the jquery
	         * convention - prevent default and stop propogation on the event
	         *
	         * @param {Function} callback
	         * @param {Event} e
	         * @returns void
	         */
	        function _fireCallback(callback, e, combo, sequence) {
	
	            // if this event should not happen stop here
	            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
	                return;
	            }
	
	            if (callback(e, combo) === false) {
	                _preventDefault(e);
	                _stopPropagation(e);
	            }
	        }
	
	        /**
	         * handles a character key event
	         *
	         * @param {string} character
	         * @param {Array} modifiers
	         * @param {Event} e
	         * @returns void
	         */
	        self._handleKey = function(character, modifiers, e) {
	            var callbacks = _getMatches(character, modifiers, e);
	            var i;
	            var doNotReset = {};
	            var maxLevel = 0;
	            var processedSequenceCallback = false;
	
	            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
	            for (i = 0; i < callbacks.length; ++i) {
	                if (callbacks[i].seq) {
	                    maxLevel = Math.max(maxLevel, callbacks[i].level);
	                }
	            }
	
	            // loop through matching callbacks for this key event
	            for (i = 0; i < callbacks.length; ++i) {
	
	                // fire for all sequence callbacks
	                // this is because if for example you have multiple sequences
	                // bound such as "g i" and "g t" they both need to fire the
	                // callback for matching g cause otherwise you can only ever
	                // match the first one
	                if (callbacks[i].seq) {
	
	                    // only fire callbacks for the maxLevel to prevent
	                    // subsequences from also firing
	                    //
	                    // for example 'a option b' should not cause 'option b' to fire
	                    // even though 'option b' is part of the other sequence
	                    //
	                    // any sequences that do not match here will be discarded
	                    // below by the _resetSequences call
	                    if (callbacks[i].level != maxLevel) {
	                        continue;
	                    }
	
	                    processedSequenceCallback = true;
	
	                    // keep a list of which sequences were matches for later
	                    doNotReset[callbacks[i].seq] = 1;
	                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
	                    continue;
	                }
	
	                // if there were no sequence matches but we are still here
	                // that means this is a regular match so we should fire that
	                if (!processedSequenceCallback) {
	                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
	                }
	            }
	
	            // if the key you pressed matches the type of sequence without
	            // being a modifier (ie "keyup" or "keypress") then we should
	            // reset all sequences that were not matched by this event
	            //
	            // this is so, for example, if you have the sequence "h a t" and you
	            // type "h e a r t" it does not match.  in this case the "e" will
	            // cause the sequence to reset
	            //
	            // modifier keys are ignored because you can have a sequence
	            // that contains modifiers such as "enter ctrl+space" and in most
	            // cases the modifier key will be pressed before the next key
	            //
	            // also if you have a sequence such as "ctrl+b a" then pressing the
	            // "b" key will trigger a "keypress" and a "keydown"
	            //
	            // the "keydown" is expected when there is a modifier, but the
	            // "keypress" ends up matching the _nextExpectedAction since it occurs
	            // after and that causes the sequence to reset
	            //
	            // we ignore keypresses in a sequence that directly follow a keydown
	            // for the same character
	            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
	            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
	                _resetSequences(doNotReset);
	            }
	
	            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
	        };
	
	        /**
	         * handles a keydown event
	         *
	         * @param {Event} e
	         * @returns void
	         */
	        function _handleKeyEvent(e) {
	
	            // normalize e.which for key events
	            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
	            if (typeof e.which !== 'number') {
	                e.which = e.keyCode;
	            }
	
	            var character = _characterFromEvent(e);
	
	            // no character found then stop
	            if (!character) {
	                return;
	            }
	
	            // need to use === for the character check because the character can be 0
	            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
	                _ignoreNextKeyup = false;
	                return;
	            }
	
	            self.handleKey(character, _eventModifiers(e), e);
	        }
	
	        /**
	         * called to set a 1 second timeout on the specified sequence
	         *
	         * this is so after each key press in the sequence you have 1 second
	         * to press the next key before you have to start over
	         *
	         * @returns void
	         */
	        function _resetSequenceTimer() {
	            clearTimeout(_resetTimer);
	            _resetTimer = setTimeout(_resetSequences, 1000);
	        }
	
	        /**
	         * binds a key sequence to an event
	         *
	         * @param {string} combo - combo specified in bind call
	         * @param {Array} keys
	         * @param {Function} callback
	         * @param {string=} action
	         * @returns void
	         */
	        function _bindSequence(combo, keys, callback, action) {
	
	            // start off by adding a sequence level record for this combination
	            // and setting the level to 0
	            _sequenceLevels[combo] = 0;
	
	            /**
	             * callback to increase the sequence level for this sequence and reset
	             * all other sequences that were active
	             *
	             * @param {string} nextAction
	             * @returns {Function}
	             */
	            function _increaseSequence(nextAction) {
	                return function() {
	                    _nextExpectedAction = nextAction;
	                    ++_sequenceLevels[combo];
	                    _resetSequenceTimer();
	                };
	            }
	
	            /**
	             * wraps the specified callback inside of another function in order
	             * to reset all sequence counters as soon as this sequence is done
	             *
	             * @param {Event} e
	             * @returns void
	             */
	            function _callbackAndReset(e) {
	                _fireCallback(callback, e, combo);
	
	                // we should ignore the next key up if the action is key down
	                // or keypress.  this is so if you finish a sequence and
	                // release the key the final key will not trigger a keyup
	                if (action !== 'keyup') {
	                    _ignoreNextKeyup = _characterFromEvent(e);
	                }
	
	                // weird race condition if a sequence ends with the key
	                // another sequence begins with
	                setTimeout(_resetSequences, 10);
	            }
	
	            // loop through keys one at a time and bind the appropriate callback
	            // function.  for any key leading up to the final one it should
	            // increase the sequence. after the final, it should reset all sequences
	            //
	            // if an action is specified in the original bind call then that will
	            // be used throughout.  otherwise we will pass the action that the
	            // next key in the sequence should match.  this allows a sequence
	            // to mix and match keypress and keydown events depending on which
	            // ones are better suited to the key provided
	            for (var i = 0; i < keys.length; ++i) {
	                var isFinal = i + 1 === keys.length;
	                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
	                _bindSingle(keys[i], wrappedCallback, action, combo, i);
	            }
	        }
	
	        /**
	         * binds a single keyboard combination
	         *
	         * @param {string} combination
	         * @param {Function} callback
	         * @param {string=} action
	         * @param {string=} sequenceName - name of sequence if part of sequence
	         * @param {number=} level - what part of the sequence the command is
	         * @returns void
	         */
	        function _bindSingle(combination, callback, action, sequenceName, level) {
	
	            // store a direct mapped reference for use with Mousetrap.trigger
	            self._directMap[combination + ':' + action] = callback;
	
	            // make sure multiple spaces in a row become a single space
	            combination = combination.replace(/\s+/g, ' ');
	
	            var sequence = combination.split(' ');
	            var info;
	
	            // if this pattern is a sequence of keys then run through this method
	            // to reprocess each pattern one key at a time
	            if (sequence.length > 1) {
	                _bindSequence(combination, sequence, callback, action);
	                return;
	            }
	
	            info = _getKeyInfo(combination, action);
	
	            // make sure to initialize array if this is the first time
	            // a callback is added for this key
	            self._callbacks[info.key] = self._callbacks[info.key] || [];
	
	            // remove an existing match if there is one
	            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);
	
	            // add this call back to the array
	            // if it is a sequence put it at the beginning
	            // if not put it at the end
	            //
	            // this is important because the way these are processed expects
	            // the sequence ones to come first
	            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
	                callback: callback,
	                modifiers: info.modifiers,
	                action: info.action,
	                seq: sequenceName,
	                level: level,
	                combo: combination
	            });
	        }
	
	        /**
	         * binds multiple combinations to the same callback
	         *
	         * @param {Array} combinations
	         * @param {Function} callback
	         * @param {string|undefined} action
	         * @returns void
	         */
	        self._bindMultiple = function(combinations, callback, action) {
	            for (var i = 0; i < combinations.length; ++i) {
	                _bindSingle(combinations[i], callback, action);
	            }
	        };
	
	        // start!
	        _addEvent(targetElement, 'keypress', _handleKeyEvent);
	        _addEvent(targetElement, 'keydown', _handleKeyEvent);
	        _addEvent(targetElement, 'keyup', _handleKeyEvent);
	    }
	
	    /**
	     * binds an event to mousetrap
	     *
	     * can be a single key, a combination of keys separated with +,
	     * an array of keys, or a sequence of keys separated by spaces
	     *
	     * be sure to list the modifier keys first to make sure that the
	     * correct key ends up getting bound (the last key in the pattern)
	     *
	     * @param {string|Array} keys
	     * @param {Function} callback
	     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
	     * @returns void
	     */
	    Mousetrap.prototype.bind = function(keys, callback, action) {
	        var self = this;
	        keys = keys instanceof Array ? keys : [keys];
	        self._bindMultiple.call(self, keys, callback, action);
	        return self;
	    };
	
	    /**
	     * unbinds an event to mousetrap
	     *
	     * the unbinding sets the callback function of the specified key combo
	     * to an empty function and deletes the corresponding key in the
	     * _directMap dict.
	     *
	     * TODO: actually remove this from the _callbacks dictionary instead
	     * of binding an empty function
	     *
	     * the keycombo+action has to be exactly the same as
	     * it was defined in the bind method
	     *
	     * @param {string|Array} keys
	     * @param {string} action
	     * @returns void
	     */
	    Mousetrap.prototype.unbind = function(keys, action) {
	        var self = this;
	        return self.bind.call(self, keys, function() {}, action);
	    };
	
	    /**
	     * triggers an event that has already been bound
	     *
	     * @param {string} keys
	     * @param {string=} action
	     * @returns void
	     */
	    Mousetrap.prototype.trigger = function(keys, action) {
	        var self = this;
	        if (self._directMap[keys + ':' + action]) {
	            self._directMap[keys + ':' + action]({}, keys);
	        }
	        return self;
	    };
	
	    /**
	     * resets the library back to its initial state.  this is useful
	     * if you want to clear out the current keyboard shortcuts and bind
	     * new ones - for example if you switch to another page
	     *
	     * @returns void
	     */
	    Mousetrap.prototype.reset = function() {
	        var self = this;
	        self._callbacks = {};
	        self._directMap = {};
	        return self;
	    };
	
	    /**
	     * should we stop this event before firing off callbacks
	     *
	     * @param {Event} e
	     * @param {Element} element
	     * @return {boolean}
	     */
	    Mousetrap.prototype.stopCallback = function(e, element) {
	        var self = this;
	
	        // if the element has the class "mousetrap" then no need to stop
	        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
	            return false;
	        }
	
	        if (_belongsTo(element, self.target)) {
	            return false;
	        }
	
	        // stop for input, select, and textarea
	        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
	    };
	
	    /**
	     * exposes _handleKey publicly so it can be overwritten by extensions
	     */
	    Mousetrap.prototype.handleKey = function() {
	        var self = this;
	        return self._handleKey.apply(self, arguments);
	    };
	
	    /**
	     * Init the global mousetrap functions
	     *
	     * This method is needed to allow the global mousetrap functions to work
	     * now that mousetrap is a constructor function.
	     */
	    Mousetrap.init = function() {
	        var documentMousetrap = Mousetrap(document);
	        for (var method in documentMousetrap) {
	            if (method.charAt(0) !== '_') {
	                Mousetrap[method] = (function(method) {
	                    return function() {
	                        return documentMousetrap[method].apply(documentMousetrap, arguments);
	                    };
	                } (method));
	            }
	        }
	    };
	
	    Mousetrap.init();
	
	    // expose mousetrap to the global object
	    window.Mousetrap = Mousetrap;
	
	    // expose as a common js module
	    if (typeof module !== 'undefined' && module.exports) {
	        module.exports = Mousetrap;
	    }
	
	    // expose mousetrap as an AMD module
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return Mousetrap;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}) (window, document);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	* matter.js 0.8.0-edge 2015-01-21
	* http://brm.io/matter-js/
	* License: MIT
	*/
	
	/**
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2014 Liam Brummitt
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
	
	(function() {
	
	var Matter = {};
	
	// Begin Matter namespace closure
	
	// All Matter modules are included below during build
	// Outro.js then closes at the end of the file
	
	
	// Begin src/body/Body.js
	
	/**
	* The `Matter.Body` module contains methods for creating and manipulating body models.
	* A `Matter.Body` is a rigid body that can be simulated by a `Matter.Engine`.
	* Factories for commonly used body configurations (such as rectangles, circles and other polygons) can be found in the module `Matter.Bodies`.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	
	* @class Body
	*/
	
	var Body = {};
	
	(function() {
	
	    Body._inertiaScale = 4;
	
	    var _nextCollidingGroupId = 1,
	        _nextNonCollidingGroupId = -1,
	        _nextCategory = 0x0001;
	
	    /**
	     * Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properites section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {} options
	     * @return {body} body
	     */
	    Body.create = function(options) {
	        var defaults = {
	            id: Common.nextId(),
	            type: 'body',
	            label: 'Body',
	            angle: 0,
	            vertices: Vertices.fromPath('L 0 0 L 40 0 L 40 40 L 0 40'),
	            position: { x: 0, y: 0 },
	            force: { x: 0, y: 0 },
	            torque: 0,
	            positionImpulse: { x: 0, y: 0 },
	            constraintImpulse: { x: 0, y: 0, angle: 0 },
	            speed: 0,
	            angularSpeed: 0,
	            velocity: { x: 0, y: 0 },
	            angularVelocity: 0,
	            isStatic: false,
	            isSleeping: false,
	            motion: 0,
	            sleepThreshold: 60,
	            density: 0.001,
	            restitution: 0,
	            friction: 0.1,
	            frictionAir: 0.01,
	            collisionFilter: {
	                category: 0x0001,
	                mask: 0xFFFFFFFF,
	                group: 0
	            },
	            slop: 0.05,
	            timeScale: 1,
	            render: {
	                visible: true,
	                sprite: {
	                    xScale: 1,
	                    yScale: 1
	                },
	                lineWidth: 1.5
	            }
	        };
	
	        var body = Common.extend(defaults, options);
	
	        _initProperties(body, options);
	
	        return body;
	    };
	
	    /**
	     * Returns the next unique group index for which bodies will collide.
	     * If `isNonColliding` is `true`, returns the next unique group index for which bodies will _not_ collide.
	     * See `body.collisionFilter` for more information.
	     * @method nextGroup
	     * @param {bool} [isNonColliding=false]
	     * @return {Number} Unique group index
	     */
	    Body.nextGroup = function(isNonColliding) {
	        if (isNonColliding)
	            return _nextNonCollidingGroupId--;
	
	        return _nextCollidingGroupId++;
	    };
	
	    /**
	     * Returns the next unique category bitfield (starting after the initial default category `0x0001`).
	     * There are 32 available. See `body.collisionFilter` for more information.
	     * @method nextCategory
	     * @return {Number} Unique category bitfield
	     */
	    Body.nextCategory = function() {
	        _nextCategory = _nextCategory << 1;
	        return _nextCategory;
	    };
	
	    /**
	     * Initialises body properties.
	     * @method _initProperties
	     * @private
	     * @param {body} body
	     * @param {} options
	     */
	    var _initProperties = function(body, options) {
	        // init required properties
	        Body.set(body, {
	            bounds: body.bounds || Bounds.create(body.vertices),
	            positionPrev: body.positionPrev || Vector.clone(body.position),
	            anglePrev: body.anglePrev || body.angle,
	            vertices: body.vertices,
	            isStatic: body.isStatic,
	            isSleeping: body.isSleeping
	        });
	
	        Vertices.rotate(body.vertices, body.angle, body.position);
	        Axes.rotate(body.axes, body.angle);
	        Bounds.update(body.bounds, body.vertices, body.velocity);
	
	        // allow options to override the automatically calculated properties
	        Body.set(body, {
	            axes: options.axes || body.axes,
	            area: options.area || body.area,
	            mass: options.mass || body.mass,
	            inertia: options.inertia || body.inertia
	        });
	
	        // render properties
	        var defaultFillStyle = (body.isStatic ? '#eeeeee' : Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'])),
	            defaultStrokeStyle = Common.shadeColor(defaultFillStyle, -20);
	        body.render.fillStyle = body.render.fillStyle || defaultFillStyle;
	        body.render.strokeStyle = body.render.strokeStyle || defaultStrokeStyle;
	    };
	
	    /**
	     * Given a property and a value (or map of), sets the property(s) on the body, using the appropriate setter functions if they exist.
	     * Prefer to use the actual setter functions in performance critical situations.
	     * @method set
	     * @param {body} body
	     * @param {} settings A property name (or map of properties and values) to set on the body.
	     * @param {} value The value to set if `settings` is a single property name.
	     */
	    Body.set = function(body, settings, value) {
	        var property;
	
	        if (typeof settings === 'string') {
	            property = settings;
	            settings = {};
	            settings[property] = value;
	        }
	
	        for (property in settings) {
	            value = settings[property];
	
	            if (!settings.hasOwnProperty(property))
	                continue;
	
	            switch (property) {
	
	            case 'isStatic':
	                Body.setStatic(body, value);
	                break;
	            case 'isSleeping':
	                Sleeping.set(body, value);
	                break;
	            case 'mass':
	                Body.setMass(body, value);
	                break;
	            case 'density':
	                Body.setDensity(body, value);
	                break;
	            case 'inertia':
	                Body.setInertia(body, value);
	                break;
	            case 'vertices':
	                Body.setVertices(body, value);
	                break;
	            case 'position':
	                Body.setPosition(body, value);
	                break;
	            case 'angle':
	                Body.setAngle(body, value);
	                break;
	            case 'velocity':
	                Body.setVelocity(body, value);
	                break;
	            case 'angularVelocity':
	                Body.setAngularVelocity(body, value);
	                break;
	            default:
	                body[property] = value;
	
	            }
	        }
	    };
	
	    /**
	     * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
	     * @method setStatic
	     * @param {body} body
	     * @param {bool} isStatic
	     */
	    Body.setStatic = function(body, isStatic) {
	        body.isStatic = isStatic;
	
	        if (isStatic) {
	            body.restitution = 0;
	            body.friction = 1;
	            body.mass = body.inertia = body.density = Infinity;
	            body.inverseMass = body.inverseInertia = 0;
	
	            body.positionPrev.x = body.position.x;
	            body.positionPrev.y = body.position.y;
	            body.anglePrev = body.angle;
	            body.angularVelocity = 0;
	            body.speed = 0;
	            body.angularSpeed = 0;
	            body.motion = 0;
	        }
	    };
	
	    /**
	     * Sets the mass of the body. Inverse mass and density are automatically updated to reflect the change.
	     * @method setMass
	     * @param {body} body
	     * @param {number} mass
	     */
	    Body.setMass = function(body, mass) {
	        body.mass = mass;
	        body.inverseMass = 1 / body.mass;
	        body.density = body.mass / body.area;
	    };
	
	    /**
	     * Sets the density of the body. Mass is automatically updated to reflect the change.
	     * @method setDensity
	     * @param {body} body
	     * @param {number} density
	     */
	    Body.setDensity = function(body, density) {
	        Body.setMass(body, density * body.area);
	        body.density = density;
	    };
	
	    /**
	     * Sets the moment of inertia (i.e. second moment of area) of the body of the body. 
	     * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
	     * @method setInertia
	     * @param {body} body
	     * @param {number} inertia
	     */
	    Body.setInertia = function(body, inertia) {
	        body.inertia = inertia;
	        body.inverseInertia = 1 / body.inertia;
	    };
	
	    /**
	     * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
	     * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
	     * They are then automatically translated to world space based on `body.position`.
	     *
	     * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
	     * Vertices must form a convex hull, concave hulls are not supported.
	     *
	     * @method setVertices
	     * @param {body} body
	     * @param {vector[]} vertices
	     */
	    Body.setVertices = function(body, vertices) {
	        // change vertices
	        if (vertices[0].body === body) {
	            body.vertices = vertices;
	        } else {
	            body.vertices = Vertices.create(vertices, body);
	        }
	
	        // update properties
	        body.axes = Axes.fromVertices(body.vertices);
	        body.area = Vertices.area(body.vertices);
	        Body.setMass(body, body.density * body.area);
	
	        // orient vertices around the centre of mass at origin (0, 0)
	        var centre = Vertices.centre(body.vertices);
	        Vertices.translate(body.vertices, centre, -1);
	
	        // update inertia while vertices are at origin (0, 0)
	        Body.setInertia(body, Body._inertiaScale * Vertices.inertia(body.vertices, body.mass));
	
	        // update geometry
	        Vertices.translate(body.vertices, body.position);
	        Bounds.update(body.bounds, body.vertices, body.velocity);
	    };
	
	    /**
	     * Sets the position of the body instantly. Velocity, angle, force etc. are unchanged.
	     * @method setPosition
	     * @param {body} body
	     * @param {vector} position
	     */
	    Body.setPosition = function(body, position) {
	        var delta = Vector.sub(position, body.position);
	
	        body.position.x = position.x;
	        body.position.y = position.y;
	        body.positionPrev.x += delta.x;
	        body.positionPrev.y += delta.y;
	
	        Vertices.translate(body.vertices, delta);
	        Bounds.update(body.bounds, body.vertices, body.velocity);
	    };
	
	    /**
	     * Sets the angle of the body instantly. Angular velocity, position, force etc. are unchanged.
	     * @method setAngle
	     * @param {body} body
	     * @param {number} angle
	     */
	    Body.setAngle = function(body, angle) {
	        var delta = angle - body.angle;
	
	        body.angle = angle;
	        body.anglePrev += delta;
	
	        Vertices.rotate(body.vertices, delta, body.position);
	        Axes.rotate(body.axes, delta);
	        Bounds.update(body.bounds, body.vertices, body.velocity);
	    };
	
	    /**
	     * Sets the linear velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
	     * @method setVelocity
	     * @param {body} body
	     * @param {vector} velocity
	     */
	    Body.setVelocity = function(body, velocity) {
	        body.positionPrev.x = body.position.x - velocity.x;
	        body.positionPrev.y = body.position.y - velocity.y;
	        body.velocity.x = velocity.x;
	        body.velocity.y = velocity.y;
	        body.speed = Vector.magnitude(body.velocity);
	    };
	
	    /**
	     * Sets the angular velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
	     * @method setAngularVelocity
	     * @param {body} body
	     * @param {number} velocity
	     */
	    Body.setAngularVelocity = function(body, velocity) {
	        body.anglePrev = body.angle - velocity;
	        body.angularVelocity = velocity;
	        body.angularSpeed = Math.abs(body.angularVelocity);
	    };
	
	    /**
	     * Moves a body by a given vector relative to its current position, without imparting any velocity.
	     * @method translate
	     * @param {body} body
	     * @param {vector} translation
	     */
	    Body.translate = function(body, translation) {
	        Body.setPosition(body, Vector.add(body.position, translation));
	    };
	
	    /**
	     * Rotates a body by a given angle relative to its current angle, without imparting any angular velocity.
	     * @method rotate
	     * @param {body} body
	     * @param {number} rotation
	     */
	    Body.rotate = function(body, rotation) {
	        Body.setAngle(body, body.angle + rotation);
	    };
	
	    /**
	     * Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
	     * @method scale
	     * @param {body} body
	     * @param {number} scaleX
	     * @param {number} scaleY
	     * @param {vector} [point]
	     */
	    Body.scale = function(body, scaleX, scaleY, point) {
	        // scale vertices
	        Vertices.scale(body.vertices, scaleX, scaleY, point);
	
	        // update properties
	        body.axes = Axes.fromVertices(body.vertices);
	        body.area = Vertices.area(body.vertices);
	        Body.setMass(body, body.density * body.area);
	
	        // update inertia (requires vertices to be at origin)
	        Vertices.translate(body.vertices, { x: -body.position.x, y: -body.position.y });
	        Body.setInertia(body, Vertices.inertia(body.vertices, body.mass));
	        Vertices.translate(body.vertices, { x: body.position.x, y: body.position.y });
	
	        // update bounds
	        Bounds.update(body.bounds, body.vertices, body.velocity);
	    };
	
	    /**
	     * Performs a simulation step for the given `body`, including updating position and angle using Verlet integration.
	     * @method update
	     * @param {body} body
	     * @param {number} deltaTime
	     * @param {number} timeScale
	     * @param {number} correction
	     */
	    Body.update = function(body, deltaTime, timeScale, correction) {
	        var deltaTimeSquared = Math.pow(deltaTime * timeScale * body.timeScale, 2);
	
	        // from the previous step
	        var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale,
	            velocityPrevX = body.position.x - body.positionPrev.x,
	            velocityPrevY = body.position.y - body.positionPrev.y;
	
	        // update velocity with verlet integration
	        body.velocity.x = (velocityPrevX * frictionAir * correction) + (body.force.x / body.mass) * deltaTimeSquared;
	        body.velocity.y = (velocityPrevY * frictionAir * correction) + (body.force.y / body.mass) * deltaTimeSquared;
	
	        body.positionPrev.x = body.position.x;
	        body.positionPrev.y = body.position.y;
	        body.position.x += body.velocity.x;
	        body.position.y += body.velocity.y;
	
	        // update angular velocity with verlet integration
	        body.angularVelocity = ((body.angle - body.anglePrev) * frictionAir * correction) + (body.torque / body.inertia) * deltaTimeSquared;
	        body.anglePrev = body.angle;
	        body.angle += body.angularVelocity;
	
	        // track speed and acceleration
	        body.speed = Vector.magnitude(body.velocity);
	        body.angularSpeed = Math.abs(body.angularVelocity);
	
	        // transform the body geometry
	        Vertices.translate(body.vertices, body.velocity);
	        if (body.angularVelocity !== 0) {
	            Vertices.rotate(body.vertices, body.angularVelocity, body.position);
	            Axes.rotate(body.axes, body.angularVelocity);
	        }
	        Bounds.update(body.bounds, body.vertices, body.velocity);
	    };
	
	    /**
	     * Applies a force to a body from a given world-space position, including resulting torque.
	     * @method applyForce
	     * @param {body} body
	     * @param {vector} position
	     * @param {vector} force
	     */
	    Body.applyForce = function(body, position, force) {
	        body.force.x += force.x;
	        body.force.y += force.y;
	        var offset = { x: position.x - body.position.x, y: position.y - body.position.y };
	        body.torque += (offset.x * force.y - offset.y * force.x) * body.inverseInertia;
	    };
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * An integer `Number` uniquely identifying number generated in `Body.create` by `Common.nextId`.
	     *
	     * @property id
	     * @type number
	     */
	
	    /**
	     * A `String` denoting the type of object.
	     *
	     * @property type
	     * @type string
	     * @default "body"
	     */
	
	    /**
	     * An arbitrary `String` name to help the user identify and manage bodies.
	     *
	     * @property label
	     * @type string
	     * @default "Body"
	     */
	
	    /**
	     * A `Number` specifying the angle of the body, in radians.
	     *
	     * @property angle
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * An array of `Vector` objects that specify the convex hull of the rigid body.
	     * These should be provided about the origin `(0, 0)`. E.g.
	     *
	     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
	     *
	     * When passed via `Body.create`, the verticies are translated relative to `body.position` (i.e. world-space, and constantly updated by `Body.update` during simulation).
	     * The `Vector` objects are also augmented with additional properties required for efficient collision detection. 
	     *
	     * Other properties such as `inertia` and `bounds` are automatically calculated from the passed vertices (unless provided via `options`).
	     * Concave hulls are not currently supported. The module `Matter.Vertices` contains useful methods for working with vertices.
	     *
	     * @property vertices
	     * @type vector[]
	     */
	
	    /**
	     * A `Vector` that specifies the current world-space position of the body.
	     *
	     * @property position
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Vector` that specifies the force to apply in the current step. It is zeroed after every `Body.update`. See also `Body.applyForce`.
	     *
	     * @property force
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Number` that specifies the torque (turning force) to apply in the current step. It is zeroed after every `Body.update`.
	     *
	     * @property torque
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Number` that _measures_ the current speed of the body after the last `Body.update`. It is read-only and always positive (it's the magnitude of `body.velocity`).
	     *
	     * @readOnly
	     * @property speed
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Number` that _measures_ the current angular speed of the body after the last `Body.update`. It is read-only and always positive (it's the magnitude of `body.angularVelocity`).
	     *
	     * @readOnly
	     * @property angularSpeed
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Vector` that _measures_ the current velocity of the body after the last `Body.update`. It is read-only. 
	     * If you need to modify a body's velocity directly, you should either apply a force or simply change the body's `position` (as the engine uses position-Verlet integration).
	     *
	     * @readOnly
	     * @property velocity
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Number` that _measures_ the current angular velocity of the body after the last `Body.update`. It is read-only. 
	     * If you need to modify a body's angular velocity directly, you should apply a torque or simply change the body's `angle` (as the engine uses position-Verlet integration).
	     *
	     * @readOnly
	     * @property angularVelocity
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
	     * If you need to set a body as static after its creation, you should use `Body.setStatic` as this requires more than just setting this flag.
	     *
	     * @property isStatic
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * A flag that indicates whether the body is considered sleeping. A sleeping body acts similar to a static body, except it is only temporary and can be awoken.
	     * If you need to set a body as sleeping, you should use `Sleeping.set` as this requires more than just setting this flag.
	     *
	     * @property isSleeping
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * A `Number` that _measures_ the amount of movement a body currently has (a combination of `speed` and `angularSpeed`). It is read-only and always positive.
	     * It is used and updated by the `Matter.Sleeping` module during simulation to decide if a body has come to rest.
	     *
	     * @readOnly
	     * @property motion
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Number` that defines the number of updates in which this body must have near-zero velocity before it is set as sleeping by the `Matter.Sleeping` module (if sleeping is enabled by the engine).
	     *
	     * @property sleepThreshold
	     * @type number
	     * @default 60
	     */
	
	    /**
	     * A `Number` that defines the density of the body, that is its mass per unit area.
	     * If you pass the density via `Body.create` the `mass` property is automatically calculated for you based on the size (area) of the object.
	     * This is generally preferable to simply setting mass and allows for more intuitive definition of materials (e.g. rock has a higher density than wood).
	     *
	     * @property density
	     * @type number
	     * @default 0.001
	     */
	
	    /**
	     * A `Number` that defines the mass of the body, although it may be more appropriate to specify the `density` property instead.
	     * If you modify this value, you must also modify the `body.inverseMass` property (`1 / mass`).
	     *
	     * @property mass
	     * @type number
	     */
	
	    /**
	     * A `Number` that defines the inverse mass of the body (`1 / mass`).
	     * If you modify this value, you must also modify the `body.mass` property.
	     *
	     * @property inverseMass
	     * @type number
	     */
	
	    /**
	     * A `Number` that defines the moment of inertia (i.e. second moment of area) of the body.
	     * It is automatically calculated from the given convex hull (`vertices` array) and density in `Body.create`.
	     * If you modify this value, you must also modify the `body.inverseInertia` property (`1 / inertia`).
	     *
	     * @property inertia
	     * @type number
	     */
	
	    /**
	     * A `Number` that defines the inverse moment of inertia of the body (`1 / inertia`).
	     * If you modify this value, you must also modify the `body.inertia` property.
	     *
	     * @property inverseInertia
	     * @type number
	     */
	
	    /**
	     * A `Number` that defines the restitution (elasticity) of the body. The value is always positive and is in the range `(0, 1)`.
	     * A value of `0` means collisions may be perfectly inelastic and no bouncing may occur. 
	     * A value of `0.8` means the body may bounce back with approximately 80% of its kinetic energy.
	     * Note that collision response is based on _pairs_ of bodies, and that `restitution` values are _combined_ with the following formula:
	     *
	     *     Math.max(bodyA.restitution, bodyB.restitution)
	     *
	     * @property restitution
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Number` that defines the friction of the body. The value is always positive and is in the range `(0, 1)`.
	     * A value of `0` means that the body may slide indefinitely.
	     * A value of `1` means the body may come to a stop almost instantly after a force is applied.
	     *
	     * The effects of the value may be non-linear. 
	     * High values may be unstable depending on the body.
	     * The engine uses a Coulomb friction model including static and kinetic friction.
	     * Note that collision response is based on _pairs_ of bodies, and that `friction` values are _combined_ with the following formula:
	     *
	     *     Math.min(bodyA.friction, bodyB.friction)
	     *
	     * @property friction
	     * @type number
	     * @default 0.1
	     */
	
	    /**
	     * A `Number` that defines the air friction of the body (air resistance). 
	     * A value of `0` means the body will never slow as it moves through space.
	     * The higher the value, the faster a body slows when moving through space.
	     * The effects of the value are non-linear. 
	     *
	     * @property frictionAir
	     * @type number
	     * @default 0.01
	     */
	
	    /**
	     * An `Object` that specifies the collision filtering properties of this body.
	     *
	     * Collisions between two bodies will obey the following rules:
	     * - If the two bodies have the same non-zero value of `collisionFilter.group`,
	     *   they will always collide if the value is positive, and they will never collide
	     *   if the value is negative.
	     * - If the two bodies have different values of `collisionFilter.group` or if one
	     *   (or both) of the bodies has a value of 0, then the category/mask rules apply as follows:
	     *
	     * Each body belongs to a collision category, given by `collisionFilter.category`. This
	     * value is used as a bit field and the category should have only one bit set, meaning that
	     * the value of this property is a power of two in the range [1, 2^31]. Thus, there are 32
	     * different collision categories available.
	     *
	     * Each body also defines a collision bitmask, given by `collisionFilter.mask` which specifies
	     * the categories it collides with (the value is the bitwise AND value of all these categories).
	     *
	     * Using the category/mask rules, two bodies `A` and `B` collide if each includes the other's
	     * category in its mask, i.e. `(categoryA & maskB) !== 0` and `(categoryB & maskA) !== 0`
	     * are both true.
	     *
	     * @property collisionFilter
	     * @type object
	     */
	
	    /**
	     * An Integer `Number`, that specifies the collision group this body belongs to.
	     * See `body.collisionFilter` for more information.
	     *
	     * @property collisionFilter.group
	     * @type object
	     * @default 0
	     */
	
	    /**
	     * A bit field that specifies the collision category this body belongs to.
	     * The category value should have only one bit set, for example `0x0001`.
	     * This means there are up to 32 unique collision categories available.
	     * See `body.collisionFilter` for more information.
	     *
	     * @property collisionFilter.category
	     * @type object
	     * @default 1
	     */
	
	    /**
	     * A bit mask that specifies the collision categories this body may collide with.
	     * See `body.collisionFilter` for more information.
	     *
	     * @property collisionFilter.mask
	     * @type object
	     * @default -1
	     */
	
	    /**
	     * A `Number` that specifies a tolerance on how far a body is allowed to 'sink' or rotate into other bodies.
	     * Avoid changing this value unless you understand the purpose of `slop` in physics engines.
	     * The default should generally suffice, although very large bodies may require larger values for stable stacking.
	     *
	     * @property slop
	     * @type number
	     * @default 0.05
	     */
	
	    /**
	     * A `Number` that allows per-body time scaling, e.g. a force-field where bodies inside are in slow-motion, while others are at full speed.
	     *
	     * @property timeScale
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
	     *
	     * @property render
	     * @type object
	     */
	
	    /**
	     * A flag that indicates if the body should be rendered.
	     *
	     * @property render.visible
	     * @type boolean
	     * @default true
	     */
	
	    /**
	     * An `Object` that defines the sprite properties to use when rendering, if any.
	     *
	     * @property render.sprite
	     * @type object
	     */
	
	    /**
	     * An `String` that defines the path to the image to use as the sprite texture, if any.
	     *
	     * @property render.sprite.texture
	     * @type string
	     */
	     
	    /**
	     * A `Number` that defines the scaling in the x-axis for the sprite, if any.
	     *
	     * @property render.sprite.xScale
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * A `Number` that defines the scaling in the y-axis for the sprite, if any.
	     *
	     * @property render.sprite.yScale
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * A `Number` that defines the line width to use when rendering the body outline (if a sprite is not defined).
	     * A value of `0` means no outline will be rendered.
	     *
	     * @property render.lineWidth
	     * @type number
	     * @default 1.5
	     */
	
	    /**
	     * A `String` that defines the fill style to use when rendering the body (if a sprite is not defined).
	     * It is the same as when using a canvas, so it accepts CSS style property values.
	     *
	     * @property render.fillStyle
	     * @type string
	     * @default a random colour
	     */
	
	    /**
	     * A `String` that defines the stroke style to use when rendering the body outline (if a sprite is not defined).
	     * It is the same as when using a canvas, so it accepts CSS style property values.
	     *
	     * @property render.strokeStyle
	     * @type string
	     * @default a random colour
	     */
	
	    /**
	     * An array of unique axis vectors (edge normals) used for collision detection.
	     * These are automatically calculated from the given convex hull (`vertices` array) in `Body.create`.
	     * They are constantly updated by `Body.update` during the simulation.
	     *
	     * @property axes
	     * @type vector[]
	     */
	     
	    /**
	     * A `Number` that _measures_ the area of the body's convex hull, calculated at creation by `Body.create`.
	     *
	     * @property area
	     * @type string
	     * @default 
	     */
	
	    /**
	     * A `Bounds` object that defines the AABB region for the body.
	     * It is automatically calculated from the given convex hull (`vertices` array) in `Body.create` and constantly updated by `Body.update` during simulation.
	     *
	     * @property bounds
	     * @type bounds
	     */
	
	})();
	
	
	;   // End src/body/Body.js
	
	
	// Begin src/body/Composite.js
	
	/**
	* The `Matter.Composite` module contains methods for creating and manipulating composite bodies.
	* A composite body is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite`, therefore composites form a tree structure.
	* It is important to use the functions in this module to modify composites, rather than directly modifying their properties.
	* Note that the `Matter.World` object is also a type of `Matter.Composite` and as such all composite methods here can also operate on a `Matter.World`.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Composite
	*/
	
	var Composite = {};
	
	(function() {
	
	    /**
	     * Creates a new composite. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properites section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {} [options]
	     * @return {composite} A new composite
	     */
	    Composite.create = function(options) {
	        return Common.extend({ 
	            id: Common.nextId(),
	            type: 'composite',
	            parent: null,
	            isModified: false,
	            bodies: [], 
	            constraints: [], 
	            composites: [],
	            label: 'Composite'
	        }, options);
	    };
	
	    /**
	     * Sets the composite's `isModified` flag. 
	     * If `updateParents` is true, all parents will be set (default: false).
	     * If `updateChildren` is true, all children will be set (default: false).
	     * @method setModified
	     * @param {composite} composite
	     * @param {boolean} isModified
	     * @param {boolean} [updateParents=false]
	     * @param {boolean} [updateChildren=false]
	     */
	    Composite.setModified = function(composite, isModified, updateParents, updateChildren) {
	        composite.isModified = isModified;
	
	        if (updateParents && composite.parent) {
	            Composite.setModified(composite.parent, isModified, updateParents, updateChildren);
	        }
	
	        if (updateChildren) {
	            for(var i = 0; i < composite.composites.length; i++) {
	                var childComposite = composite.composites[i];
	                Composite.setModified(childComposite, isModified, updateParents, updateChildren);
	            }
	        }
	    };
	
	    /**
	     * Generic add function. Adds one or many body(s), constraint(s) or a composite(s) to the given composite.
	     * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
	     * @method add
	     * @param {composite} composite
	     * @param {} object
	     * @return {composite} The original composite with the objects added
	     */
	    Composite.add = function(composite, object) {
	        var objects = [].concat(object);
	
	        Events.trigger(composite, 'beforeAdd', { object: object });
	
	        for (var i = 0; i < objects.length; i++) {
	            var obj = objects[i];
	
	            switch (obj.type) {
	
	            case 'body':
	                Composite.addBody(composite, obj);
	                break;
	            case 'constraint':
	                Composite.addConstraint(composite, obj);
	                break;
	            case 'composite':
	                Composite.addComposite(composite, obj);
	                break;
	            case 'mouseConstraint':
	                Composite.addConstraint(composite, obj.constraint);
	                break;
	
	            }
	        }
	
	        Events.trigger(composite, 'afterAdd', { object: object });
	
	        return composite;
	    };
	
	    /**
	     * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
	     * Optionally searching its children recursively.
	     * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
	     * @method remove
	     * @param {composite} composite
	     * @param {} object
	     * @param {boolean} [deep=false]
	     * @return {composite} The original composite with the objects removed
	     */
	    Composite.remove = function(composite, object, deep) {
	        var objects = [].concat(object);
	
	        Events.trigger(composite, 'beforeRemove', { object: object });
	
	        for (var i = 0; i < objects.length; i++) {
	            var obj = objects[i];
	
	            switch (obj.type) {
	
	            case 'body':
	                Composite.removeBody(composite, obj, deep);
	                break;
	            case 'constraint':
	                Composite.removeConstraint(composite, obj, deep);
	                break;
	            case 'composite':
	                Composite.removeComposite(composite, obj, deep);
	                break;
	            case 'mouseConstraint':
	                Composite.removeConstraint(composite, obj.constraint);
	                break;
	
	            }
	        }
	
	        Events.trigger(composite, 'afterRemove', { object: object });
	
	        return composite;
	    };
	
	    /**
	     * Adds a composite to the given composite
	     * @private
	     * @method addComposite
	     * @param {composite} compositeA
	     * @param {composite} compositeB
	     * @return {composite} The original compositeA with the objects from compositeB added
	     */
	    Composite.addComposite = function(compositeA, compositeB) {
	        compositeA.composites.push(compositeB);
	        compositeB.parent = compositeA;
	        Composite.setModified(compositeA, true, true, false);
	        return compositeA;
	    };
	
	    /**
	     * Removes a composite from the given composite, and optionally searching its children recursively
	     * @private
	     * @method removeComposite
	     * @param {composite} compositeA
	     * @param {composite} compositeB
	     * @param {boolean} [deep=false]
	     * @return {composite} The original compositeA with the composite removed
	     */
	    Composite.removeComposite = function(compositeA, compositeB, deep) {
	        var position = Common.indexOf(compositeA.composites, compositeB);
	        if (position !== -1) {
	            Composite.removeCompositeAt(compositeA, position);
	            Composite.setModified(compositeA, true, true, false);
	        }
	
	        if (deep) {
	            for (var i = 0; i < compositeA.composites.length; i++){
	                Composite.removeComposite(compositeA.composites[i], compositeB, true);
	            }
	        }
	
	        return compositeA;
	    };
	
	    /**
	     * Removes a composite from the given composite
	     * @private
	     * @method removeCompositeAt
	     * @param {composite} composite
	     * @param {number} position
	     * @return {composite} The original composite with the composite removed
	     */
	    Composite.removeCompositeAt = function(composite, position) {
	        composite.composites.splice(position, 1);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Adds a body to the given composite
	     * @private
	     * @method addBody
	     * @param {composite} composite
	     * @param {body} body
	     * @return {composite} The original composite with the body added
	     */
	    Composite.addBody = function(composite, body) {
	        composite.bodies.push(body);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Removes a body from the given composite, and optionally searching its children recursively
	     * @private
	     * @method removeBody
	     * @param {composite} composite
	     * @param {body} body
	     * @param {boolean} [deep=false]
	     * @return {composite} The original composite with the body removed
	     */
	    Composite.removeBody = function(composite, body, deep) {
	        var position = Common.indexOf(composite.bodies, body);
	        if (position !== -1) {
	            Composite.removeBodyAt(composite, position);
	            Composite.setModified(composite, true, true, false);
	        }
	
	        if (deep) {
	            for (var i = 0; i < composite.composites.length; i++){
	                Composite.removeBody(composite.composites[i], body, true);
	            }
	        }
	
	        return composite;
	    };
	
	    /**
	     * Removes a body from the given composite
	     * @private
	     * @method removeBodyAt
	     * @param {composite} composite
	     * @param {number} position
	     * @return {composite} The original composite with the body removed
	     */
	    Composite.removeBodyAt = function(composite, position) {
	        composite.bodies.splice(position, 1);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Adds a constraint to the given composite
	     * @private
	     * @method addConstraint
	     * @param {composite} composite
	     * @param {constraint} constraint
	     * @return {composite} The original composite with the constraint added
	     */
	    Composite.addConstraint = function(composite, constraint) {
	        composite.constraints.push(constraint);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Removes a constraint from the given composite, and optionally searching its children recursively
	     * @private
	     * @method removeConstraint
	     * @param {composite} composite
	     * @param {constraint} constraint
	     * @param {boolean} [deep=false]
	     * @return {composite} The original composite with the constraint removed
	     */
	    Composite.removeConstraint = function(composite, constraint, deep) {
	        var position = Common.indexOf(composite.constraints, constraint);
	        if (position !== -1) {
	            Composite.removeConstraintAt(composite, position);
	        }
	
	        if (deep) {
	            for (var i = 0; i < composite.composites.length; i++){
	                Composite.removeConstraint(composite.composites[i], constraint, true);
	            }
	        }
	
	        return composite;
	    };
	
	    /**
	     * Removes a body from the given composite
	     * @private
	     * @method removeConstraintAt
	     * @param {composite} composite
	     * @param {number} position
	     * @return {composite} The original composite with the constraint removed
	     */
	    Composite.removeConstraintAt = function(composite, position) {
	        composite.constraints.splice(position, 1);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Removes all bodies, constraints and composites from the given composite
	     * Optionally clearing its children recursively
	     * @method clear
	     * @param {world} world
	     * @param {boolean} keepStatic
	     * @param {boolean} [deep=false]
	     */
	    Composite.clear = function(composite, keepStatic, deep) {
	        if (deep) {
	            for (var i = 0; i < composite.composites.length; i++){
	                Composite.clear(composite.composites[i], keepStatic, true);
	            }
	        }
	        
	        if (keepStatic) {
	            composite.bodies = composite.bodies.filter(function(body) { return body.isStatic; });
	        } else {
	            composite.bodies.length = 0;
	        }
	
	        composite.constraints.length = 0;
	        composite.composites.length = 0;
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /**
	     * Returns all bodies in the given composite, including all bodies in its children, recursively
	     * @method allBodies
	     * @param {composite} composite
	     * @return {body[]} All the bodies
	     */
	    Composite.allBodies = function(composite) {
	        var bodies = [].concat(composite.bodies);
	
	        for (var i = 0; i < composite.composites.length; i++)
	            bodies = bodies.concat(Composite.allBodies(composite.composites[i]));
	
	        return bodies;
	    };
	
	    /**
	     * Returns all constraints in the given composite, including all constraints in its children, recursively
	     * @method allConstraints
	     * @param {composite} composite
	     * @return {constraint[]} All the constraints
	     */
	    Composite.allConstraints = function(composite) {
	        var constraints = [].concat(composite.constraints);
	
	        for (var i = 0; i < composite.composites.length; i++)
	            constraints = constraints.concat(Composite.allConstraints(composite.composites[i]));
	
	        return constraints;
	    };
	
	    /**
	     * Returns all composites in the given composite, including all composites in its children, recursively
	     * @method allComposites
	     * @param {composite} composite
	     * @return {composite[]} All the composites
	     */
	    Composite.allComposites = function(composite) {
	        var composites = [].concat(composite.composites);
	
	        for (var i = 0; i < composite.composites.length; i++)
	            composites = composites.concat(Composite.allComposites(composite.composites[i]));
	
	        return composites;
	    };
	
	    /**
	     * Searches the composite recursively for an object matching the type and id supplied, null if not found
	     * @method get
	     * @param {composite} composite
	     * @param {number} id
	     * @param {string} type
	     * @return {object} The requested object, if found
	     */
	    Composite.get = function(composite, id, type) {
	        var objects,
	            object;
	
	        switch (type) {
	        case 'body':
	            objects = Composite.allBodies(composite);
	            break;
	        case 'constraint':
	            objects = Composite.allConstraints(composite);
	            break;
	        case 'composite':
	            objects = Composite.allComposites(composite).concat(composite);
	            break;
	        }
	
	        if (!objects)
	            return null;
	
	        object = objects.filter(function(object) { 
	            return object.id.toString() === id.toString(); 
	        });
	
	        return object.length === 0 ? null : object[0];
	    };
	
	    /**
	     * Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add)
	     * @method move
	     * @param {compositeA} compositeA
	     * @param {object[]} objects
	     * @param {compositeB} compositeB
	     * @return {composite} Returns compositeA
	     */
	    Composite.move = function(compositeA, objects, compositeB) {
	        Composite.remove(compositeA, objects);
	        Composite.add(compositeB, objects);
	        return compositeA;
	    };
	
	    /**
	     * Assigns new ids for all objects in the composite, recursively
	     * @method rebase
	     * @param {composite} composite
	     * @return {composite} Returns composite
	     */
	    Composite.rebase = function(composite) {
	        var objects = Composite.allBodies(composite)
	                        .concat(Composite.allConstraints(composite))
	                        .concat(Composite.allComposites(composite));
	
	        for (var i = 0; i < objects.length; i++) {
	            objects[i].id = Common.nextId();
	        }
	
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /**
	     * Translates all children in the composite by a given vector relative to their current positions, 
	     * without imparting any velocity.
	     * @method translate
	     * @param {composite} composite
	     * @param {vector} translation
	     * @param {bool} [recursive=true]
	     */
	    Composite.translate = function(composite, translation, recursive) {
	        var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
	
	        for (var i = 0; i < bodies.length; i++) {
	            Body.translate(bodies[i], translation);
	        }
	
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /**
	     * Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
	     * @method rotate
	     * @param {composite} composite
	     * @param {number} rotation
	     * @param {vector} point
	     * @param {bool} [recursive=true]
	     */
	    Composite.rotate = function(composite, rotation, point, recursive) {
	        var cos = Math.cos(rotation),
	            sin = Math.sin(rotation),
	            bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                dx = body.position.x - point.x,
	                dy = body.position.y - point.y;
	                
	            Body.setPosition(body, {
	                x: point.x + (dx * cos - dy * sin),
	                y: point.y + (dx * sin + dy * cos)
	            });
	
	            Body.rotate(body, rotation);
	        }
	
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /**
	     * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
	     * @method scale
	     * @param {composite} composite
	     * @param {number} scaleX
	     * @param {number} scaleY
	     * @param {vector} point
	     * @param {bool} [recursive=true]
	     */
	    Composite.scale = function(composite, scaleX, scaleY, point, recursive) {
	        var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                dx = body.position.x - point.x,
	                dy = body.position.y - point.y;
	                
	            Body.setPosition(body, {
	                x: point.x + dx * scaleX,
	                y: point.y + dy * scaleY
	            });
	
	            Body.scale(body, scaleX, scaleY);
	        }
	
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /*
	    *
	    *  Events Documentation
	    *
	    */
	
	    /**
	    * Fired when a call to `Composite.add` is made, before objects have been added.
	    *
	    * @event beforeAdd
	    * @param {} event An event object
	    * @param {} event.object The object(s) to be added (may be a single body, constraint, composite or a mixed array of these)
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when a call to `Composite.add` is made, after objects have been added.
	    *
	    * @event afterAdd
	    * @param {} event An event object
	    * @param {} event.object The object(s) that have been added (may be a single body, constraint, composite or a mixed array of these)
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when a call to `Composite.remove` is made, before objects have been removed.
	    *
	    * @event beforeRemove
	    * @param {} event An event object
	    * @param {} event.object The object(s) to be removed (may be a single body, constraint, composite or a mixed array of these)
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when a call to `Composite.remove` is made, after objects have been removed.
	    *
	    * @event afterRemove
	    * @param {} event An event object
	    * @param {} event.object The object(s) that have been removed (may be a single body, constraint, composite or a mixed array of these)
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
	     *
	     * @property id
	     * @type number
	     */
	
	    /**
	     * A `String` denoting the type of object.
	     *
	     * @property type
	     * @type string
	     * @default "composite"
	     */
	
	    /**
	     * An arbitrary `String` name to help the user identify and manage composites.
	     *
	     * @property label
	     * @type string
	     * @default "Composite"
	     */
	
	    /**
	     * A flag that specifies whether the composite has been modified during the current step.
	     * Most `Matter.Composite` methods will automatically set this flag to `true` to inform the engine of changes to be handled.
	     * If you need to change it manually, you should use the `Composite.setModified` method.
	     *
	     * @property isModified
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * The `Composite` that is the parent of this composite. It is automatically managed by the `Matter.Composite` methods.
	     *
	     * @property parent
	     * @type composite
	     * @default null
	     */
	
	    /**
	     * An array of `Body` that are _direct_ children of this composite.
	     * To add or remove bodies you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
	     * If you wish to recursively find all descendants, you should use the `Composite.allBodies` method.
	     *
	     * @property bodies
	     * @type body[]
	     * @default []
	     */
	
	    /**
	     * An array of `Constraint` that are _direct_ children of this composite.
	     * To add or remove constraints you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
	     * If you wish to recursively find all descendants, you should use the `Composite.allConstraints` method.
	     *
	     * @property constraints
	     * @type constraint[]
	     * @default []
	     */
	
	    /**
	     * An array of `Composite` that are _direct_ children of this composite.
	     * To add or remove composites you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
	     * If you wish to recursively find all descendants, you should use the `Composite.allComposites` method.
	     *
	     * @property composites
	     * @type composite[]
	     * @default []
	     */
	
	})();
	
	;   // End src/body/Composite.js
	
	
	// Begin src/body/World.js
	
	/**
	* The `Matter.World` module contains methods for creating and manipulating the world composite.
	* A `Matter.World` is a `Matter.Composite` body, which is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite`.
	* A `Matter.World` has a few additional properties including `gravity` and `bounds`.
	* It is important to use the functions in the `Matter.Composite` module to modify the world composite, rather than directly modifying its properties.
	* There are also a few methods here that alias those in `Matter.Composite` for easier readability.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class World
	*/
	
	var World = {};
	
	(function() {
	
	    /**
	     * Creates a new world composite. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properites section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @constructor
	     * @param {} options
	     * @return {world} A new world
	     */
	    World.create = function(options) {
	        var composite = Composite.create();
	
	        var defaults = {
	            label: 'World',
	            gravity: { x: 0, y: 1 },
	            bounds: { 
	                min: { x: 0, y: 0 }, 
	                max: { x: 800, y: 600 } 
	            }
	        };
	        
	        return Common.extend(composite, defaults, options);
	    };
	
	    // World is a Composite body
	    // see src/module/Outro.js for these aliases:
	    
	    /**
	     * An alias for Composite.clear since World is also a Composite
	     * @method clear
	     * @param {world} world
	     * @param {boolean} keepStatic
	     */
	
	    /**
	     * An alias for Composite.add since World is also a Composite
	     * @method addComposite
	     * @param {world} world
	     * @param {composite} composite
	     * @return {world} The original world with the objects from composite added
	     */
	    
	     /**
	      * An alias for Composite.addBody since World is also a Composite
	      * @method addBody
	      * @param {world} world
	      * @param {body} body
	      * @return {world} The original world with the body added
	      */
	
	     /**
	      * An alias for Composite.addConstraint since World is also a Composite
	      * @method addConstraint
	      * @param {world} world
	      * @param {constraint} constraint
	      * @return {world} The original world with the constraint added
	      */
	
	})();
	
	;   // End src/body/World.js
	
	
	// Begin src/collision/Contact.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Contact
	*/
	
	var Contact = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @param {vertex} vertex
	     * @return {contact} A new contact
	     */
	    Contact.create = function(vertex) {
	        return {
	            id: Contact.id(vertex),
	            vertex: vertex,
	            normalImpulse: 0,
	            tangentImpulse: 0
	        };
	    };
	    
	    /**
	     * Description
	     * @method id
	     * @param {vertex} vertex
	     * @return {string} Unique contactID
	     */
	    Contact.id = function(vertex) {
	        return vertex.body.id + '_' + vertex.index;
	    };
	
	})();
	
	
	;   // End src/collision/Contact.js
	
	
	// Begin src/collision/Detector.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Detector
	*/
	
	// TODO: speculative contacts
	
	var Detector = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method collisions
	     * @param {pair[]} broadphasePairs
	     * @param {engine} engine
	     * @return {array} collisions
	     */
	    Detector.collisions = function(broadphasePairs, engine) {
	        var collisions = [],
	            metrics = engine.metrics,
	            pairsTable = engine.pairs.table;
	
	        for (var i = 0; i < broadphasePairs.length; i++) {
	            var bodyA = broadphasePairs[i][0], 
	                bodyB = broadphasePairs[i][1];
	
	            if ((bodyA.isStatic || bodyA.isSleeping) && (bodyB.isStatic || bodyB.isSleeping))
	                continue;
	            
	            if (!Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter))
	                continue;
	
	            metrics.midphaseTests += 1;
	
	            // mid phase
	            if (Bounds.overlaps(bodyA.bounds, bodyB.bounds)) {
	
	                // find a previous collision we could reuse
	                var pairId = Pair.id(bodyA, bodyB),
	                    pair = pairsTable[pairId],
	                    previousCollision;
	
	                if (pair && pair.isActive) {
	                    previousCollision = pair.collision;
	                } else {
	                    previousCollision = null;
	                }
	
	                // narrow phase
	                var collision = SAT.collides(bodyA, bodyB, previousCollision);
	
	                metrics.narrowphaseTests += 1;
	
	                if (collision.reused)
	                    metrics.narrowReuseCount += 1;
	
	                if (collision.collided) {
	                    collisions.push(collision);
	                    metrics.narrowDetections += 1;
	                }
	            }
	        }
	
	        return collisions;
	    };
	
	    /**
	     * Description
	     * @method bruteForce
	     * @param {body[]} bodies
	     * @param {engine} engine
	     * @return {array} collisions
	     */
	    Detector.bruteForce = function(bodies, engine) {
	        var collisions = [],
	            metrics = engine.metrics,
	            pairsTable = engine.pairs.table;
	
	        for (var i = 0; i < bodies.length; i++) {
	            for (var j = i + 1; j < bodies.length; j++) {
	                var bodyA = bodies[i], 
	                    bodyB = bodies[j];
	
	                // NOTE: could share a function for the below, but may drop performance?
	
	                if ((bodyA.isStatic || bodyA.isSleeping) && (bodyB.isStatic || bodyB.isSleeping))
	                    continue;
	                
	                if (!Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter))
	                    continue;
	
	                metrics.midphaseTests += 1;
	
	                // mid phase
	                if (Bounds.overlaps(bodyA.bounds, bodyB.bounds)) {
	
	                    // find a previous collision we could reuse
	                    var pairId = Pair.id(bodyA, bodyB),
	                        pair = pairsTable[pairId],
	                        previousCollision;
	
	                    if (pair && pair.isActive) {
	                        previousCollision = pair.collision;
	                    } else {
	                        previousCollision = null;
	                    }
	
	                    // narrow phase
	                    var collision = SAT.collides(bodyA, bodyB, previousCollision);
	
	                    metrics.narrowphaseTests += 1;
	
	                    if (collision.reused)
	                        metrics.narrowReuseCount += 1;
	
	                    if (collision.collided) {
	                        collisions.push(collision);
	                        metrics.narrowDetections += 1;
	                    }
	                }
	            }
	        }
	
	        return collisions;
	    };
	
	    /**
	     * Returns `true` if both supplied collision filters will allow a collision to occur.
	     * See `body.collisionFilter` for more information.
	     * @method canCollide
	     * @param {} filterA
	     * @param {} filterB
	     * @return {bool} `true` if collision can occur
	     */
	    Detector.canCollide = function(filterA, filterB) {
	        if (filterA.group === filterB.group && filterA.group !== 0)
	            return filterA.group > 0;
	
	        return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
	    };
	
	})();
	
	
	;   // End src/collision/Detector.js
	
	
	// Begin src/collision/Grid.js
	
	/**
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Grid
	*/
	
	var Grid = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @param {} options
	     * @return {grid} A new grid
	     */
	    Grid.create = function(options) {
	        var defaults = {
	            controller: Grid,
	            detector: Detector.collisions,
	            buckets: {},
	            pairs: {},
	            pairsList: [],
	            bucketWidth: 48,
	            bucketHeight: 48
	        };
	
	        return Common.extend(defaults, options);
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {grid} grid
	     * @param {body[]} bodies
	     * @param {engine} engine
	     * @param {boolean} forceUpdate
	     */
	    Grid.update = function(grid, bodies, engine, forceUpdate) {
	        var i, col, row,
	            world = engine.world,
	            buckets = grid.buckets,
	            bucket,
	            bucketId,
	            metrics = engine.metrics,
	            gridChanged = false;
	
	        metrics.broadphaseTests = 0;
	
	        for (i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.isSleeping && !forceUpdate)
	                continue;
	
	            // don't update out of world bodies
	            if (body.bounds.max.x < 0 || body.bounds.min.x > world.bounds.width
	                || body.bounds.max.y < 0 || body.bounds.min.y > world.bounds.height)
	                continue;
	
	            var newRegion = _getRegion(grid, body);
	
	            // if the body has changed grid region
	            if (!body.region || newRegion.id !== body.region.id || forceUpdate) {
	
	                metrics.broadphaseTests += 1;
	
	                if (!body.region || forceUpdate)
	                    body.region = newRegion;
	
	                var union = _regionUnion(newRegion, body.region);
	
	                // update grid buckets affected by region change
	                // iterate over the union of both regions
	                for (col = union.startCol; col <= union.endCol; col++) {
	                    for (row = union.startRow; row <= union.endRow; row++) {
	                        bucketId = _getBucketId(col, row);
	                        bucket = buckets[bucketId];
	
	                        var isInsideNewRegion = (col >= newRegion.startCol && col <= newRegion.endCol
	                                                && row >= newRegion.startRow && row <= newRegion.endRow);
	
	                        var isInsideOldRegion = (col >= body.region.startCol && col <= body.region.endCol
	                                                && row >= body.region.startRow && row <= body.region.endRow);
	
	                        // remove from old region buckets
	                        if (!isInsideNewRegion && isInsideOldRegion) {
	                            if (isInsideOldRegion) {
	                                if (bucket)
	                                    _bucketRemoveBody(grid, bucket, body);
	                            }
	                        }
	
	                        // add to new region buckets
	                        if (body.region === newRegion || (isInsideNewRegion && !isInsideOldRegion) || forceUpdate) {
	                            if (!bucket)
	                                bucket = _createBucket(buckets, bucketId);
	                            _bucketAddBody(grid, bucket, body);
	                        }
	                    }
	                }
	
	                // set the new region
	                body.region = newRegion;
	
	                // flag changes so we can update pairs
	                gridChanged = true;
	            }
	        }
	
	        // update pairs list only if pairs changed (i.e. a body changed region)
	        if (gridChanged)
	            grid.pairsList = _createActivePairsList(grid);
	    };
	
	    /**
	     * Description
	     * @method clear
	     * @param {grid} grid
	     */
	    Grid.clear = function(grid) {
	        grid.buckets = {};
	        grid.pairs = {};
	        grid.pairsList = [];
	    };
	
	    /**
	     * Description
	     * @method _regionUnion
	     * @private
	     * @param {} regionA
	     * @param {} regionB
	     * @return CallExpression
	     */
	    var _regionUnion = function(regionA, regionB) {
	        var startCol = Math.min(regionA.startCol, regionB.startCol),
	            endCol = Math.max(regionA.endCol, regionB.endCol),
	            startRow = Math.min(regionA.startRow, regionB.startRow),
	            endRow = Math.max(regionA.endRow, regionB.endRow);
	
	        return _createRegion(startCol, endCol, startRow, endRow);
	    };
	
	    /**
	     * Description
	     * @method _getRegion
	     * @private
	     * @param {} grid
	     * @param {} body
	     * @return CallExpression
	     */
	    var _getRegion = function(grid, body) {
	        var bounds = body.bounds,
	            startCol = Math.floor(bounds.min.x / grid.bucketWidth),
	            endCol = Math.floor(bounds.max.x / grid.bucketWidth),
	            startRow = Math.floor(bounds.min.y / grid.bucketHeight),
	            endRow = Math.floor(bounds.max.y / grid.bucketHeight);
	
	        return _createRegion(startCol, endCol, startRow, endRow);
	    };
	
	    /**
	     * Description
	     * @method _createRegion
	     * @private
	     * @param {} startCol
	     * @param {} endCol
	     * @param {} startRow
	     * @param {} endRow
	     * @return ObjectExpression
	     */
	    var _createRegion = function(startCol, endCol, startRow, endRow) {
	        return { 
	            id: startCol + ',' + endCol + ',' + startRow + ',' + endRow,
	            startCol: startCol, 
	            endCol: endCol, 
	            startRow: startRow, 
	            endRow: endRow 
	        };
	    };
	
	    /**
	     * Description
	     * @method _getBucketId
	     * @private
	     * @param {} column
	     * @param {} row
	     * @return BinaryExpression
	     */
	    var _getBucketId = function(column, row) {
	        return column + ',' + row;
	    };
	
	    /**
	     * Description
	     * @method _createBucket
	     * @private
	     * @param {} buckets
	     * @param {} bucketId
	     * @return bucket
	     */
	    var _createBucket = function(buckets, bucketId) {
	        var bucket = buckets[bucketId] = [];
	        return bucket;
	    };
	
	    /**
	     * Description
	     * @method _bucketAddBody
	     * @private
	     * @param {} grid
	     * @param {} bucket
	     * @param {} body
	     */
	    var _bucketAddBody = function(grid, bucket, body) {
	        // add new pairs
	        for (var i = 0; i < bucket.length; i++) {
	            var bodyB = bucket[i];
	
	            if (body.id === bodyB.id || (body.isStatic && bodyB.isStatic))
	                continue;
	
	            // keep track of the number of buckets the pair exists in
	            // important for Grid.update to work
	            var pairId = Pair.id(body, bodyB),
	                pair = grid.pairs[pairId];
	
	            if (pair) {
	                pair[2] += 1;
	            } else {
	                grid.pairs[pairId] = [body, bodyB, 1];
	            }
	        }
	
	        // add to bodies (after pairs, otherwise pairs with self)
	        bucket.push(body);
	    };
	
	    /**
	     * Description
	     * @method _bucketRemoveBody
	     * @private
	     * @param {} grid
	     * @param {} bucket
	     * @param {} body
	     */
	    var _bucketRemoveBody = function(grid, bucket, body) {
	        // remove from bucket
	        bucket.splice(Common.indexOf(bucket, body), 1);
	
	        // update pair counts
	        for (var i = 0; i < bucket.length; i++) {
	            // keep track of the number of buckets the pair exists in
	            // important for _createActivePairsList to work
	            var bodyB = bucket[i],
	                pairId = Pair.id(body, bodyB),
	                pair = grid.pairs[pairId];
	
	            if (pair)
	                pair[2] -= 1;
	        }
	    };
	
	    /**
	     * Description
	     * @method _createActivePairsList
	     * @private
	     * @param {} grid
	     * @return pairs
	     */
	    var _createActivePairsList = function(grid) {
	        var pairKeys,
	            pair,
	            pairs = [];
	
	        // grid.pairs is used as a hashmap
	        pairKeys = Common.keys(grid.pairs);
	
	        // iterate over grid.pairs
	        for (var k = 0; k < pairKeys.length; k++) {
	            pair = grid.pairs[pairKeys[k]];
	
	            // if pair exists in at least one bucket
	            // it is a pair that needs further collision testing so push it
	            if (pair[2] > 0) {
	                pairs.push(pair);
	            } else {
	                delete grid.pairs[pairKeys[k]];
	            }
	        }
	
	        return pairs;
	    };
	    
	})();
	
	;   // End src/collision/Grid.js
	
	
	// Begin src/collision/Pair.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Pair
	*/
	
	var Pair = {};
	
	(function() {
	    
	    /**
	     * Description
	     * @method create
	     * @param {collision} collision
	     * @return {pair} A new pair
	     */
	    Pair.create = function(collision, timestamp) {
	        var bodyA = collision.bodyA,
	            bodyB = collision.bodyB;
	
	        var pair = {
	            id: Pair.id(bodyA, bodyB),
	            bodyA: bodyA,
	            bodyB: bodyB,
	            contacts: {},
	            activeContacts: [],
	            separation: 0,
	            isActive: true,
	            timeCreated: timestamp,
	            timeUpdated: timestamp,
	            inverseMass: bodyA.inverseMass + bodyB.inverseMass,
	            friction: Math.min(bodyA.friction, bodyB.friction),
	            restitution: Math.max(bodyA.restitution, bodyB.restitution),
	            slop: Math.max(bodyA.slop, bodyB.slop)
	        };
	
	        Pair.update(pair, collision, timestamp);
	
	        return pair;
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {pair} pair
	     * @param {collision} collision
	     */
	    Pair.update = function(pair, collision, timestamp) {
	        var contacts = pair.contacts,
	            supports = collision.supports,
	            activeContacts = pair.activeContacts;
	        
	        pair.collision = collision;
	        pair.inverseMass = collision.bodyA.inverseMass + collision.bodyB.inverseMass;
	        pair.friction = Math.min(collision.bodyA.friction, collision.bodyB.friction);
	        pair.restitution = Math.max(collision.bodyA.restitution, collision.bodyB.restitution);
	        pair.slop = Math.max(collision.bodyA.slop, collision.bodyB.slop);
	        activeContacts.length = 0;
	        
	        if (collision.collided) {
	            for (var i = 0; i < supports.length; i++) {
	                var support = supports[i],
	                    contactId = Contact.id(support),
	                    contact = contacts[contactId];
	
	                if (contact) {
	                    activeContacts.push(contact);
	                } else {
	                    activeContacts.push(contacts[contactId] = Contact.create(support));
	                }
	            }
	
	            pair.separation = collision.depth;
	            Pair.setActive(pair, true, timestamp);
	        } else {
	            if (pair.isActive === true)
	                Pair.setActive(pair, false, timestamp);
	        }
	    };
	    
	    /**
	     * Description
	     * @method setActive
	     * @param {pair} pair
	     * @param {bool} isActive
	     */
	    Pair.setActive = function(pair, isActive, timestamp) {
	        if (isActive) {
	            pair.isActive = true;
	            pair.timeUpdated = timestamp;
	        } else {
	            pair.isActive = false;
	            pair.activeContacts.length = 0;
	        }
	    };
	
	    /**
	     * Description
	     * @method id
	     * @param {body} bodyA
	     * @param {body} bodyB
	     * @return {string} Unique pairId
	     */
	    Pair.id = function(bodyA, bodyB) {
	        if (bodyA.id < bodyB.id) {
	            return bodyA.id + '_' + bodyB.id;
	        } else {
	            return bodyB.id + '_' + bodyA.id;
	        }
	    };
	
	})();
	
	
	;   // End src/collision/Pair.js
	
	
	// Begin src/collision/Pairs.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Pairs
	*/
	
	var Pairs = {};
	
	(function() {
	    
	    var _pairMaxIdleLife = 1000;
	
	    /**
	     * Creates a new pairs structure
	     * @method create
	     * @param {object} options
	     * @return {pairs} A new pairs structure
	     */
	    Pairs.create = function(options) {
	        return Common.extend({ 
	            table: {},
	            list: [],
	            collisionStart: [],
	            collisionActive: [],
	            collisionEnd: []
	        }, options);
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {object} pairs
	     * @param {collision[]} collisions
	     */
	    Pairs.update = function(pairs, collisions, timestamp) {
	        var pairsList = pairs.list,
	            pairsTable = pairs.table,
	            collisionStart = pairs.collisionStart,
	            collisionEnd = pairs.collisionEnd,
	            collisionActive = pairs.collisionActive,
	            activePairIds = [],
	            collision,
	            pairId,
	            pair,
	            i;
	
	        // clear collision state arrays, but maintain old reference
	        collisionStart.length = 0;
	        collisionEnd.length = 0;
	        collisionActive.length = 0;
	
	        for (i = 0; i < collisions.length; i++) {
	            collision = collisions[i];
	
	            if (collision.collided) {
	                pairId = Pair.id(collision.bodyA, collision.bodyB);
	                activePairIds.push(pairId);
	
	                pair = pairsTable[pairId];
	                
	                if (pair) {
	                    // pair already exists (but may or may not be active)
	                    if (pair.isActive) {
	                        // pair exists and is active
	                        collisionActive.push(pair);
	                    } else {
	                        // pair exists but was inactive, so a collision has just started again
	                        collisionStart.push(pair);
	                    }
	
	                    // update the pair
	                    Pair.update(pair, collision, timestamp);
	                } else {
	                    // pair did not exist, create a new pair
	                    pair = Pair.create(collision, timestamp);
	                    pairsTable[pairId] = pair;
	
	                    // push the new pair
	                    collisionStart.push(pair);
	                    pairsList.push(pair);
	                }
	            }
	        }
	
	        // deactivate previously active pairs that are now inactive
	        for (i = 0; i < pairsList.length; i++) {
	            pair = pairsList[i];
	            if (pair.isActive && Common.indexOf(activePairIds, pair.id) === -1) {
	                Pair.setActive(pair, false, timestamp);
	                collisionEnd.push(pair);
	            }
	        }
	    };
	    
	    /**
	     * Description
	     * @method removeOld
	     * @param {object} pairs
	     */
	    Pairs.removeOld = function(pairs, timestamp) {
	        var pairsList = pairs.list,
	            pairsTable = pairs.table,
	            indexesToRemove = [],
	            pair,
	            collision,
	            pairIndex,
	            i;
	
	        for (i = 0; i < pairsList.length; i++) {
	            pair = pairsList[i];
	            collision = pair.collision;
	            
	            // never remove sleeping pairs
	            if (collision.bodyA.isSleeping || collision.bodyB.isSleeping) {
	                pair.timeUpdated = timestamp;
	                continue;
	            }
	
	            // if pair is inactive for too long, mark it to be removed
	            if (timestamp - pair.timeUpdated > _pairMaxIdleLife) {
	                indexesToRemove.push(i);
	            }
	        }
	
	        // remove marked pairs
	        for (i = 0; i < indexesToRemove.length; i++) {
	            pairIndex = indexesToRemove[i] - i;
	            pair = pairsList[pairIndex];
	            delete pairsTable[pair.id];
	            pairsList.splice(pairIndex, 1);
	        }
	    };
	
	    /**
	     * Clears the given pairs structure
	     * @method create
	     * @param {object} options
	     * @param {pairs} pairs
	     */
	    Pairs.clear = function(pairs) {
	        pairs.table = {};
	        pairs.list.length = 0;
	        pairs.collisionStart.length = 0;
	        pairs.collisionActive.length = 0;
	        pairs.collisionEnd.length = 0;
	        return pairs;
	    };
	
	})();
	
	;   // End src/collision/Pairs.js
	
	
	// Begin src/collision/Query.js
	
	/**
	* The `Matter.Query` module contains methods for performing collision queries.
	*
	* @class Query
	*/
	
	var Query = {};
	
	(function() {
	
	    /**
	     * Casts a ray segment against a set of bodies and returns all collisions, ray width is optional. Intersection points are not provided.
	     * @method ray
	     * @param {body[]} bodies
	     * @param {vector} startPoint
	     * @param {vector} endPoint
	     * @param {number} [rayWidth]
	     * @return {object[]} Collisions
	     */
	    Query.ray = function(bodies, startPoint, endPoint, rayWidth) {
	        rayWidth = rayWidth || Number.MIN_VALUE;
	
	        var rayAngle = Vector.angle(startPoint, endPoint),
	            rayLength = Vector.magnitude(Vector.sub(startPoint, endPoint)),
	            rayX = (endPoint.x + startPoint.x) * 0.5,
	            rayY = (endPoint.y + startPoint.y) * 0.5,
	            ray = Bodies.rectangle(rayX, rayY, rayLength, rayWidth, { angle: rayAngle }),
	            collisions = [];
	
	        for (var i = 0; i < bodies.length; i++) {
	            var bodyA = bodies[i];
	
	            if (Bounds.overlaps(bodyA.bounds, ray.bounds)) {
	                var collision = SAT.collides(bodyA, ray);
	                if (collision.collided) {
	                    collision.body = collision.bodyA = collision.bodyB = bodyA;
	                    collisions.push(collision);
	                }
	            }
	        }
	
	        return collisions;
	    };
	
	    /**
	     * Returns all bodies whose bounds are inside (or outside if set) the given set of bounds, from the given set of bodies.
	     * @method region
	     * @param {body[]} bodies
	     * @param {bounds} bounds
	     * @param {bool} [outside=false]
	     * @return {body[]} The bodies matching the query
	     */
	    Query.region = function(bodies, bounds, outside) {
	        var result = [];
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                overlaps = Bounds.overlaps(body.bounds, bounds);
	            if ((overlaps && !outside) || (!overlaps && outside))
	                result.push(body);
	        }
	
	        return result;
	    };
	
	})();
	
	;   // End src/collision/Query.js
	
	
	// Begin src/collision/Resolver.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Resolver
	*/
	
	var Resolver = {};
	
	(function() {
	
	    var _restingThresh = 4,
	        _positionDampen = 0.2,
	        _positionWarming = 0.6;
	
	    /**
	     * Description
	     * @method solvePosition
	     * @param {pair[]} pairs
	     * @param {number} timeScale
	     */
	    Resolver.solvePosition = function(pairs, timeScale) {
	        var i,
	            pair,
	            collision,
	            bodyA,
	            bodyB,
	            vertex,
	            vertexCorrected,
	            normal,
	            bodyBtoA;
	
	        // find impulses required to resolve penetration
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	            
	            if (!pair.isActive)
	                continue;
	            
	            collision = pair.collision;
	            bodyA = collision.bodyA;
	            bodyB = collision.bodyB;
	            vertex = collision.supports[0];
	            vertexCorrected = collision.supportCorrected;
	            normal = collision.normal;
	
	            // get current separation between body edges involved in collision
	            bodyBtoA = Vector.sub(Vector.add(bodyB.positionImpulse, vertex), 
	                                    Vector.add(bodyA.positionImpulse, vertexCorrected));
	
	            pair.separation = Vector.dot(normal, bodyBtoA);
	        }
	        
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	            
	            if (!pair.isActive)
	                continue;
	            
	            collision = pair.collision;
	            bodyA = collision.bodyA;
	            bodyB = collision.bodyB;
	            normal = collision.normal;
	            positionImpulse = ((pair.separation * _positionDampen) - pair.slop) * timeScale;
	        
	            if (bodyA.isStatic || bodyB.isStatic)
	                positionImpulse *= 2;
	            
	            if (!(bodyA.isStatic || bodyA.isSleeping)) {
	                bodyA.positionImpulse.x += normal.x * positionImpulse;
	                bodyA.positionImpulse.y += normal.y * positionImpulse;
	            }
	
	            if (!(bodyB.isStatic || bodyB.isSleeping)) {
	                bodyB.positionImpulse.x -= normal.x * positionImpulse;
	                bodyB.positionImpulse.y -= normal.y * positionImpulse;
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method postSolvePosition
	     * @param {body[]} bodies
	     */
	    Resolver.postSolvePosition = function(bodies) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.positionImpulse.x !== 0 || body.positionImpulse.y !== 0) {
	                // move the body without changing velocity
	                body.position.x += body.positionImpulse.x;
	                body.position.y += body.positionImpulse.y;
	                body.positionPrev.x += body.positionImpulse.x;
	                body.positionPrev.y += body.positionImpulse.y;
	
	                // update body geometry
	                Vertices.translate(body.vertices, body.positionImpulse);
	                Bounds.update(body.bounds, body.vertices, body.velocity);
	                
	                // dampen accumulator to warm the next step
	                body.positionImpulse.x *= _positionWarming;
	                body.positionImpulse.y *= _positionWarming;
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method preSolveVelocity
	     * @param {pair[]} pairs
	     */
	    Resolver.preSolveVelocity = function(pairs) {
	        var impulse = {},
	            i,
	            j,
	            pair,
	            contacts,
	            collision,
	            bodyA,
	            bodyB,
	            normal,
	            tangent,
	            contact,
	            contactVertex,
	            normalImpulse,
	            tangentImpulse,
	            offset;
	        
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	            
	            if (!pair.isActive)
	                continue;
	            
	            contacts = pair.activeContacts;
	            collision = pair.collision;
	            bodyA = collision.bodyA;
	            bodyB = collision.bodyB;
	            normal = collision.normal;
	            tangent = collision.tangent;
	                
	            // resolve each contact
	            for (j = 0; j < contacts.length; j++) {
	                contact = contacts[j];
	                contactVertex = contact.vertex;
	                normalImpulse = contact.normalImpulse;
	                tangentImpulse = contact.tangentImpulse;
	                
	                // total impulse from contact
	                impulse.x = (normal.x * normalImpulse) + (tangent.x * tangentImpulse);
	                impulse.y = (normal.y * normalImpulse) + (tangent.y * tangentImpulse);
	                
	                // apply impulse from contact
	                if (!(bodyA.isStatic || bodyA.isSleeping)) {
	                    offset = Vector.sub(contactVertex, bodyA.position);
	                    bodyA.positionPrev.x += impulse.x * bodyA.inverseMass;
	                    bodyA.positionPrev.y += impulse.y * bodyA.inverseMass;
	                    bodyA.anglePrev += Vector.cross(offset, impulse) * bodyA.inverseInertia;
	                }
	
	                if (!(bodyB.isStatic || bodyB.isSleeping)) {
	                    offset = Vector.sub(contactVertex, bodyB.position);
	                    bodyB.positionPrev.x -= impulse.x * bodyB.inverseMass;
	                    bodyB.positionPrev.y -= impulse.y * bodyB.inverseMass;
	                    bodyB.anglePrev -= Vector.cross(offset, impulse) * bodyB.inverseInertia;
	                }
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method solveVelocity
	     * @param {pair[]} pairs
	     */
	    Resolver.solveVelocity = function(pairs, timeScale) {
	        var impulse = {},
	            timeScaleSquared = timeScale * timeScale;
	        
	        for (var i = 0; i < pairs.length; i++) {
	            var pair = pairs[i];
	            
	            if (!pair.isActive)
	                continue;
	            
	            var collision = pair.collision,
	                bodyA = collision.bodyA,
	                bodyB = collision.bodyB,
	                normal = collision.normal,
	                tangent = collision.tangent,
	                contacts = pair.activeContacts,
	                contactShare = 1 / contacts.length;
	
	            // update body velocities
	            bodyA.velocity.x = bodyA.position.x - bodyA.positionPrev.x;
	            bodyA.velocity.y = bodyA.position.y - bodyA.positionPrev.y;
	            bodyB.velocity.x = bodyB.position.x - bodyB.positionPrev.x;
	            bodyB.velocity.y = bodyB.position.y - bodyB.positionPrev.y;
	            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
	            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
	
	            // resolve each contact
	            for (var j = 0; j < contacts.length; j++) {
	                var contact = contacts[j],
	                    contactVertex = contact.vertex,
	                    offsetA = Vector.sub(contactVertex, bodyA.position),
	                    offsetB = Vector.sub(contactVertex, bodyB.position),
	                    velocityPointA = Vector.add(bodyA.velocity, Vector.mult(Vector.perp(offsetA), bodyA.angularVelocity)),
	                    velocityPointB = Vector.add(bodyB.velocity, Vector.mult(Vector.perp(offsetB), bodyB.angularVelocity)), 
	                    relativeVelocity = Vector.sub(velocityPointA, velocityPointB),
	                    normalVelocity = Vector.dot(normal, relativeVelocity);
	
	                var tangentVelocity = Vector.dot(tangent, relativeVelocity),
	                    tangentSpeed = Math.abs(tangentVelocity),
	                    tangentVelocityDirection = Common.sign(tangentVelocity);
	
	                // raw impulses
	                var normalImpulse = (1 + pair.restitution) * normalVelocity,
	                    normalForce = Common.clamp(pair.separation + normalVelocity, 0, 1);
	
	                // coulomb friction
	                var tangentImpulse = tangentVelocity;
	                if (tangentSpeed > normalForce * pair.friction * timeScaleSquared)
	                    tangentImpulse = normalForce * pair.friction * timeScaleSquared * tangentVelocityDirection;
	
	                // modify impulses accounting for mass, inertia and offset
	                var oAcN = Vector.cross(offsetA, normal),
	                    oBcN = Vector.cross(offsetB, normal),
	                    share = contactShare / (pair.inverseMass + bodyA.inverseInertia * oAcN * oAcN  + bodyB.inverseInertia * oBcN * oBcN);
	                normalImpulse *= share;
	                tangentImpulse *= share;
	                
	                // handle high velocity and resting collisions separately
	                if (normalVelocity < 0 && normalVelocity * normalVelocity > _restingThresh * timeScaleSquared) {
	                    // high velocity so clear cached contact impulse
	                    contact.normalImpulse = 0;
	                    contact.tangentImpulse = 0;
	                } else {
	                    // solve resting collision constraints using Erin Catto's method (GDC08)
	
	                    // impulse constraint, tends to 0
	                    var contactNormalImpulse = contact.normalImpulse;
	                    contact.normalImpulse = Math.min(contact.normalImpulse + normalImpulse, 0);
	                    normalImpulse = contact.normalImpulse - contactNormalImpulse;
	                    
	                    // tangent impulse, tends to -maxFriction or maxFriction
	                    var contactTangentImpulse = contact.tangentImpulse;
	                    contact.tangentImpulse = Common.clamp(contact.tangentImpulse + tangentImpulse, -tangentSpeed, tangentSpeed);
	                    tangentImpulse = contact.tangentImpulse - contactTangentImpulse;
	                }
	                
	                // total impulse from contact
	                impulse.x = (normal.x * normalImpulse) + (tangent.x * tangentImpulse);
	                impulse.y = (normal.y * normalImpulse) + (tangent.y * tangentImpulse);
	                
	                // apply impulse from contact
	                if (!(bodyA.isStatic || bodyA.isSleeping)) {
	                    bodyA.positionPrev.x += impulse.x * bodyA.inverseMass;
	                    bodyA.positionPrev.y += impulse.y * bodyA.inverseMass;
	                    bodyA.anglePrev += Vector.cross(offsetA, impulse) * bodyA.inverseInertia;
	                }
	
	                if (!(bodyB.isStatic || bodyB.isSleeping)) {
	                    bodyB.positionPrev.x -= impulse.x * bodyB.inverseMass;
	                    bodyB.positionPrev.y -= impulse.y * bodyB.inverseMass;
	                    bodyB.anglePrev -= Vector.cross(offsetB, impulse) * bodyB.inverseInertia;
	                }
	            }
	        }
	    };
	
	})();
	
	;   // End src/collision/Resolver.js
	
	
	// Begin src/collision/SAT.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class SAT
	*/
	
	// TODO: true circles and curves
	
	var SAT = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method collides
	     * @param {body} bodyA
	     * @param {body} bodyB
	     * @param {collision} previousCollision
	     * @return {collision} collision
	     */
	    SAT.collides = function(bodyA, bodyB, previousCollision) {
	        var overlapAB,
	            overlapBA, 
	            minOverlap,
	            collision,
	            prevCol = previousCollision,
	            canReusePrevCol = false;
	
	        if (prevCol) {
	            // estimate total motion
	            var motion = bodyA.speed * bodyA.speed + bodyA.angularSpeed * bodyA.angularSpeed
	                       + bodyB.speed * bodyB.speed + bodyB.angularSpeed * bodyB.angularSpeed;
	
	            // we may be able to (partially) reuse collision result 
	            // but only safe if collision was resting
	            canReusePrevCol = prevCol && prevCol.collided && motion < 0.2;
	
	            // reuse collision object
	            collision = prevCol;
	        } else {
	            collision = { collided: false, bodyA: bodyA, bodyB: bodyB };
	        }
	
	        if (prevCol && canReusePrevCol) {
	            // if we can reuse the collision result
	            // we only need to test the previously found axis
	            var axes = [prevCol.bodyA.axes[prevCol.axisNumber]];
	
	            minOverlap = _overlapAxes(prevCol.bodyA.vertices, prevCol.bodyB.vertices, axes);
	            collision.reused = true;
	
	            if (minOverlap.overlap <= 0) {
	                collision.collided = false;
	                return collision;
	            }
	        } else {
	            // if we can't reuse a result, perform a full SAT test
	
	            overlapAB = _overlapAxes(bodyA.vertices, bodyB.vertices, bodyA.axes);
	
	            if (overlapAB.overlap <= 0) {
	                collision.collided = false;
	                return collision;
	            }
	
	            overlapBA = _overlapAxes(bodyB.vertices, bodyA.vertices, bodyB.axes);
	
	            if (overlapBA.overlap <= 0) {
	                collision.collided = false;
	                return collision;
	            }
	
	            if (overlapAB.overlap < overlapBA.overlap) {
	                minOverlap = overlapAB;
	                collision.bodyA = bodyA;
	                collision.bodyB = bodyB;
	            } else {
	                minOverlap = overlapBA;
	                collision.bodyA = bodyB;
	                collision.bodyB = bodyA;
	            }
	
	            // important for reuse later
	            collision.axisNumber = minOverlap.axisNumber;
	        }
	
	        collision.collided = true;
	        collision.normal = minOverlap.axis;
	        collision.depth = minOverlap.overlap;
	        
	        bodyA = collision.bodyA;
	        bodyB = collision.bodyB;
	
	        // ensure normal is facing away from bodyA
	        if (Vector.dot(collision.normal, Vector.sub(bodyB.position, bodyA.position)) > 0) 
	            collision.normal = Vector.neg(collision.normal);
	
	        collision.tangent = Vector.perp(collision.normal);
	
	        collision.penetration = { 
	            x: collision.normal.x * collision.depth, 
	            y: collision.normal.y * collision.depth 
	        };
	
	        // find support points, there is always either exactly one or two
	        var verticesB = _findSupports(bodyA, bodyB, collision.normal),
	            supports = collision.supports || [];
	        supports.length = 0;
	
	        // find the supports from bodyB that are inside bodyA
	        if (Vertices.contains(bodyA.vertices, verticesB[0]))
	            supports.push(verticesB[0]);
	
	        if (Vertices.contains(bodyA.vertices, verticesB[1]))
	            supports.push(verticesB[1]);
	
	        // find the supports from bodyA that are inside bodyB
	        if (supports.length < 2) {
	            var verticesA = _findSupports(bodyB, bodyA, Vector.neg(collision.normal));
	                
	            if (Vertices.contains(bodyB.vertices, verticesA[0]))
	                supports.push(verticesA[0]);
	
	            if (supports.length < 2 && Vertices.contains(bodyB.vertices, verticesA[1]))
	                supports.push(verticesA[1]);
	        }
	
	        // account for the edge case of overlapping but no vertex containment
	        if (supports.length < 2)
	            supports = [verticesB[0]];
	        
	        collision.supports = supports;
	        collision.supportCorrected = Vector.sub(supports[0], collision.penetration);
	
	        return collision;
	    };
	
	    /**
	     * Description
	     * @method _overlapAxes
	     * @private
	     * @param {} verticesA
	     * @param {} verticesB
	     * @param {} axes
	     * @return result
	     */
	    var _overlapAxes = function(verticesA, verticesB, axes) {
	        var projectionA = {}, 
	            projectionB = {},
	            result = { overlap: Number.MAX_VALUE },
	            overlap,
	            axis;
	
	        for (var i = 0; i < axes.length; i++) {
	            axis = axes[i];
	
	            _projectToAxis(projectionA, verticesA, axis);
	            _projectToAxis(projectionB, verticesB, axis);
	
	            overlap = projectionA.min < projectionB.min 
	                        ? projectionA.max - projectionB.min 
	                        : projectionB.max - projectionA.min;
	
	            if (overlap <= 0) {
	                result.overlap = overlap;
	                return result;
	            }
	
	            if (overlap < result.overlap) {
	                result.overlap = overlap;
	                result.axis = axis;
	                result.axisNumber = i;
	            }
	        }
	
	        return result;
	    };
	
	    /**
	     * Description
	     * @method _projectToAxis
	     * @private
	     * @param {} projection
	     * @param {} vertices
	     * @param {} axis
	     */
	    var _projectToAxis = function(projection, vertices, axis) {
	        var min = Vector.dot(vertices[0], axis),
	            max = min;
	
	        for (var i = 1; i < vertices.length; i += 1) {
	            var dot = Vector.dot(vertices[i], axis);
	
	            if (dot > max) { 
	                max = dot; 
	            } else if (dot < min) { 
	                min = dot; 
	            }
	        }
	
	        projection.min = min;
	        projection.max = max;
	    };
	    
	    /**
	     * Description
	     * @method _findSupports
	     * @private
	     * @param {} bodyA
	     * @param {} bodyB
	     * @param {} normal
	     * @return ArrayExpression
	     */
	    var _findSupports = function(bodyA, bodyB, normal) {
	        var nearestDistance = Number.MAX_VALUE,
	            vertexToBody = { x: 0, y: 0 },
	            vertices = bodyB.vertices,
	            bodyAPosition = bodyA.position,
	            distance,
	            vertex,
	            vertexA = vertices[0],
	            vertexB = vertices[1];
	
	        // find closest vertex on bodyB
	        for (var i = 0; i < vertices.length; i++) {
	            vertex = vertices[i];
	            vertexToBody.x = vertex.x - bodyAPosition.x;
	            vertexToBody.y = vertex.y - bodyAPosition.y;
	            distance = -Vector.dot(normal, vertexToBody);
	
	            if (distance < nearestDistance) {
	                nearestDistance = distance;
	                vertexA = vertex;
	            }
	        }
	
	        // find next closest vertex using the two connected to it
	        var prevIndex = vertexA.index - 1 >= 0 ? vertexA.index - 1 : vertices.length - 1;
	        vertex = vertices[prevIndex];
	        vertexToBody.x = vertex.x - bodyAPosition.x;
	        vertexToBody.y = vertex.y - bodyAPosition.y;
	        nearestDistance = -Vector.dot(normal, vertexToBody);
	        vertexB = vertex;
	
	        var nextIndex = (vertexA.index + 1) % vertices.length;
	        vertex = vertices[nextIndex];
	        vertexToBody.x = vertex.x - bodyAPosition.x;
	        vertexToBody.y = vertex.y - bodyAPosition.y;
	        distance = -Vector.dot(normal, vertexToBody);
	        if (distance < nearestDistance) {
	            vertexB = vertex;
	        }
	
	        return [vertexA, vertexB];
	    };
	
	})();
	
	
	;   // End src/collision/SAT.js
	
	
	// Begin src/constraint/Constraint.js
	
	/**
	* The `Matter.Constraint` module contains methods for creating and manipulating constraints.
	* Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
	* The stiffness of constraints can be modified to create springs or elastic.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Constraint
	*/
	
	// TODO: fix instabillity issues with torque
	// TODO: linked constraints
	// TODO: breakable constraints
	// TODO: collidable constraints
	// TODO: allow constrained bodies to sleep
	// TODO: handle 0 length constraints properly
	// TODO: impulse caching and warming
	
	var Constraint = {};
	
	(function() {
	
	    var _minLength = 0.000001,
	        _minDifference = 0.001;
	
	    /**
	     * Creates a new constraint.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properites section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {} options
	     * @return {constraint} constraint
	     */
	    Constraint.create = function(options) {
	        var constraint = options;
	
	        // if bodies defined but no points, use body centre
	        if (constraint.bodyA && !constraint.pointA)
	            constraint.pointA = { x: 0, y: 0 };
	        if (constraint.bodyB && !constraint.pointB)
	            constraint.pointB = { x: 0, y: 0 };
	
	        // calculate static length using initial world space points
	        var initialPointA = constraint.bodyA ? Vector.add(constraint.bodyA.position, constraint.pointA) : constraint.pointA,
	            initialPointB = constraint.bodyB ? Vector.add(constraint.bodyB.position, constraint.pointB) : constraint.pointB,
	            length = Vector.magnitude(Vector.sub(initialPointA, initialPointB));
	    
	        constraint.length = constraint.length || length || _minLength;
	
	        // render
	        var render = {
	            visible: true,
	            lineWidth: 2,
	            strokeStyle: '#666'
	        };
	        
	        constraint.render = Common.extend(render, constraint.render);
	
	        // option defaults
	        constraint.id = constraint.id || Common.nextId();
	        constraint.label = constraint.label || 'Constraint';
	        constraint.type = 'constraint';
	        constraint.stiffness = constraint.stiffness || 1;
	        constraint.angularStiffness = constraint.angularStiffness || 0;
	        constraint.angleA = constraint.bodyA ? constraint.bodyA.angle : constraint.angleA;
	        constraint.angleB = constraint.bodyB ? constraint.bodyB.angle : constraint.angleB;
	
	        return constraint;
	    };
	
	    /**
	     * Description
	     * @private
	     * @method solveAll
	     * @param {constraint[]} constraints
	     * @param {number} timeScale
	     */
	    Constraint.solveAll = function(constraints, timeScale) {
	        for (var i = 0; i < constraints.length; i++) {
	            Constraint.solve(constraints[i], timeScale);
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method solve
	     * @param {constraint} constraint
	     * @param {number} timeScale
	     */
	    Constraint.solve = function(constraint, timeScale) {
	        var bodyA = constraint.bodyA,
	            bodyB = constraint.bodyB,
	            pointA = constraint.pointA,
	            pointB = constraint.pointB;
	
	        // update reference angle
	        if (bodyA && !bodyA.isStatic) {
	            constraint.pointA = Vector.rotate(pointA, bodyA.angle - constraint.angleA);
	            constraint.angleA = bodyA.angle;
	        }
	        
	        // update reference angle
	        if (bodyB && !bodyB.isStatic) {
	            constraint.pointB = Vector.rotate(pointB, bodyB.angle - constraint.angleB);
	            constraint.angleB = bodyB.angle;
	        }
	
	        var pointAWorld = pointA,
	            pointBWorld = pointB;
	
	        if (bodyA) pointAWorld = Vector.add(bodyA.position, pointA);
	        if (bodyB) pointBWorld = Vector.add(bodyB.position, pointB);
	
	        if (!pointAWorld || !pointBWorld)
	            return;
	
	        var delta = Vector.sub(pointAWorld, pointBWorld),
	            currentLength = Vector.magnitude(delta);
	
	        // prevent singularity
	        if (currentLength === 0)
	            currentLength = _minLength;
	
	        // solve distance constraint with Gauss-Siedel method
	        var difference = (currentLength - constraint.length) / currentLength,
	            normal = Vector.div(delta, currentLength),
	            force = Vector.mult(delta, difference * 0.5 * constraint.stiffness * timeScale * timeScale);
	        
	        // if difference is very small, we can skip
	        if (Math.abs(1 - (currentLength / constraint.length)) < _minDifference * timeScale)
	            return;
	
	        var velocityPointA,
	            velocityPointB,
	            offsetA,
	            offsetB,
	            oAn,
	            oBn,
	            bodyADenom,
	            bodyBDenom;
	    
	        if (bodyA && !bodyA.isStatic) {
	            // point body offset
	            offsetA = { 
	                x: pointAWorld.x - bodyA.position.x + force.x, 
	                y: pointAWorld.y - bodyA.position.y + force.y
	            };
	            
	            // update velocity
	            bodyA.velocity.x = bodyA.position.x - bodyA.positionPrev.x;
	            bodyA.velocity.y = bodyA.position.y - bodyA.positionPrev.y;
	            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
	            
	            // find point velocity and body mass
	            velocityPointA = Vector.add(bodyA.velocity, Vector.mult(Vector.perp(offsetA), bodyA.angularVelocity));
	            oAn = Vector.dot(offsetA, normal);
	            bodyADenom = bodyA.inverseMass + bodyA.inverseInertia * oAn * oAn;
	        } else {
	            velocityPointA = { x: 0, y: 0 };
	            bodyADenom = bodyA ? bodyA.inverseMass : 0;
	        }
	            
	        if (bodyB && !bodyB.isStatic) {
	            // point body offset
	            offsetB = { 
	                x: pointBWorld.x - bodyB.position.x - force.x, 
	                y: pointBWorld.y - bodyB.position.y - force.y 
	            };
	            
	            // update velocity
	            bodyB.velocity.x = bodyB.position.x - bodyB.positionPrev.x;
	            bodyB.velocity.y = bodyB.position.y - bodyB.positionPrev.y;
	            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
	
	            // find point velocity and body mass
	            velocityPointB = Vector.add(bodyB.velocity, Vector.mult(Vector.perp(offsetB), bodyB.angularVelocity));
	            oBn = Vector.dot(offsetB, normal);
	            bodyBDenom = bodyB.inverseMass + bodyB.inverseInertia * oBn * oBn;
	        } else {
	            velocityPointB = { x: 0, y: 0 };
	            bodyBDenom = bodyB ? bodyB.inverseMass : 0;
	        }
	        
	        var relativeVelocity = Vector.sub(velocityPointB, velocityPointA),
	            normalImpulse = Vector.dot(normal, relativeVelocity) / (bodyADenom + bodyBDenom);
	    
	        if (normalImpulse > 0) normalImpulse = 0;
	    
	        var normalVelocity = {
	            x: normal.x * normalImpulse, 
	            y: normal.y * normalImpulse
	        };
	
	        var torque;
	 
	        if (bodyA && !bodyA.isStatic) {
	            torque = Vector.cross(offsetA, normalVelocity) * bodyA.inverseInertia * (1 - constraint.angularStiffness);
	
	            Sleeping.set(bodyA, false);
	            
	            // clamp to prevent instabillity
	            // TODO: solve this properlly
	            torque = Common.clamp(torque, -0.01, 0.01);
	
	            // keep track of applied impulses for post solving
	            bodyA.constraintImpulse.x -= force.x;
	            bodyA.constraintImpulse.y -= force.y;
	            bodyA.constraintImpulse.angle += torque;
	
	            // apply forces
	            bodyA.position.x -= force.x;
	            bodyA.position.y -= force.y;
	            bodyA.angle += torque;
	        }
	
	        if (bodyB && !bodyB.isStatic) {
	            torque = Vector.cross(offsetB, normalVelocity) * bodyB.inverseInertia * (1 - constraint.angularStiffness);
	
	            Sleeping.set(bodyB, false);
	            
	            // clamp to prevent instabillity
	            // TODO: solve this properlly
	            torque = Common.clamp(torque, -0.01, 0.01);
	
	            // keep track of applied impulses for post solving
	            bodyB.constraintImpulse.x += force.x;
	            bodyB.constraintImpulse.y += force.y;
	            bodyB.constraintImpulse.angle -= torque;
	            
	            // apply forces
	            bodyB.position.x += force.x;
	            bodyB.position.y += force.y;
	            bodyB.angle -= torque;
	        }
	
	    };
	
	    /**
	     * Performs body updates required after solving constraints
	     * @private
	     * @method postSolveAll
	     * @param {body[]} bodies
	     */
	    Constraint.postSolveAll = function(bodies) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                impulse = body.constraintImpulse;
	
	            // update geometry and reset
	            Vertices.translate(body.vertices, impulse);
	
	            if (impulse.angle !== 0) {
	                Vertices.rotate(body.vertices, impulse.angle, body.position);
	                Axes.rotate(body.axes, impulse.angle);
	                impulse.angle = 0;
	            }
	
	            Bounds.update(body.bounds, body.vertices);
	
	            impulse.x = 0;
	            impulse.y = 0;
	        }
	    };
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
	     *
	     * @property id
	     * @type number
	     */
	
	    /**
	     * A `String` denoting the type of object.
	     *
	     * @property type
	     * @type string
	     * @default "constraint"
	     */
	
	    /**
	     * An arbitrary `String` name to help the user identify and manage bodies.
	     *
	     * @property label
	     * @type string
	     * @default "Constraint"
	     */
	
	    /**
	     * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
	     *
	     * @property render
	     * @type object
	     */
	
	    /**
	     * A flag that indicates if the constraint should be rendered.
	     *
	     * @property render.visible
	     * @type boolean
	     * @default true
	     */
	
	    /**
	     * A `Number` that defines the line width to use when rendering the constraint outline.
	     * A value of `0` means no outline will be rendered.
	     *
	     * @property render.lineWidth
	     * @type number
	     * @default 2
	     */
	
	    /**
	     * A `String` that defines the stroke style to use when rendering the constraint outline.
	     * It is the same as when using a canvas, so it accepts CSS style property values.
	     *
	     * @property render.strokeStyle
	     * @type string
	     * @default a random colour
	     */
	
	    /**
	     * The first possible `Body` that this constraint is attached to.
	     *
	     * @property bodyA
	     * @type body
	     * @default null
	     */
	
	    /**
	     * The second possible `Body` that this constraint is attached to.
	     *
	     * @property bodyB
	     * @type body
	     * @default null
	     */
	
	    /**
	     * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
	     *
	     * @property pointA
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
	     *
	     * @property pointB
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Number` that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`.
	     * A value of `1` means the constraint should be very stiff.
	     * A value of `0.2` means the constraint acts like a soft spring.
	     *
	     * @property stiffness
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * A `Number` that specifies the target resting length of the constraint. 
	     * It is calculated automatically in `Constraint.create` from intial positions of the `constraint.bodyA` and `constraint.bodyB`.
	     *
	     * @property length
	     * @type number
	     */
	
	})();
	
	;   // End src/constraint/Constraint.js
	
	
	// Begin src/constraint/MouseConstraint.js
	
	/**
	* The `Matter.MouseConstraint` module contains methods for creating mouse constraints.
	* Mouse constraints are used for allowing user interaction, providing the ability to move bodies via the mouse or touch.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class MouseConstraint
	*/
	
	var MouseConstraint = {};
	
	(function() {
	
	    /**
	     * Creates a new mouse constraint.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properites section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {engine} engine
	     * @param {} options
	     * @return {MouseConstraint} A new MouseConstraint
	     */
	    MouseConstraint.create = function(engine, options) {
	        var mouse = (engine ? engine.mouse : null) || (options ? options.mouse : null);
	
	        if (!mouse && engine && engine.render && engine.render.canvas) {
	            mouse = Mouse.create(engine.render.canvas);
	        } else {
	            mouse = Mouse.create();
	            Common.log('MouseConstraint.create: options.mouse was undefined, engine.render.canvas was undefined, may not function as expected', 'warn');
	        }
	
	        var constraint = Constraint.create({ 
	            label: 'Mouse Constraint',
	            pointA: mouse.position,
	            pointB: { x: 0, y: 0 },
	            length: 0.01, 
	            stiffness: 0.1,
	            angularStiffness: 1,
	            render: {
	                strokeStyle: '#90EE90',
	                lineWidth: 3
	            }
	        });
	
	        var defaults = {
	            type: 'mouseConstraint',
	            mouse: mouse,
	            body: null,
	            constraint: constraint,
	            collisionFilter: {
	                category: 0x0001,
	                mask: 0xFFFFFFFF,
	                group: 0
	            }
	        };
	
	        var mouseConstraint = Common.extend(defaults, options);
	
	        Events.on(engine, 'tick', function() {
	            var allBodies = Composite.allBodies(engine.world);
	            MouseConstraint.update(mouseConstraint, allBodies);
	            _triggerEvents(mouseConstraint);
	        });
	
	        return mouseConstraint;
	    };
	
	    /**
	     * Updates the given mouse constraint.
	     * @private
	     * @method update
	     * @param {MouseConstraint} mouseConstraint
	     * @param {body[]} bodies
	     */
	    MouseConstraint.update = function(mouseConstraint, bodies) {
	        var mouse = mouseConstraint.mouse,
	            constraint = mouseConstraint.constraint,
	            body = mouseConstraint.body;
	
	        if (mouse.button === 0) {
	            if (!constraint.bodyB) {
	                for (var i = 0; i < bodies.length; i++) {
	                    body = bodies[i];
	                    if (Bounds.contains(body.bounds, mouse.position) 
	                            && Vertices.contains(body.vertices, mouse.position)
	                            && Detector.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) {
	                       
	                        constraint.pointA = mouse.position;
	                        constraint.bodyB = mouseConstraint.body = body;
	                        constraint.pointB = { x: mouse.position.x - body.position.x, y: mouse.position.y - body.position.y };
	                        constraint.angleB = body.angle;
	
	                        Sleeping.set(body, false);
	                        Events.trigger(mouseConstraint, 'startdrag', { mouse: mouse, body: body });
	                    }
	                }
	            } else {
	                Sleeping.set(constraint.bodyB, false);
	                constraint.pointA = mouse.position;
	            }
	        } else {
	            constraint.bodyB = mouseConstraint.body = null;
	            constraint.pointB = null;
	
	            if (body)
	                Events.trigger(mouseConstraint, 'enddrag', { mouse: mouse, body: body });
	        }
	    };
	
	    /**
	     * Triggers mouse constraint events
	     * @method _triggerEvents
	     * @private
	     * @param {mouse} mouse
	     */
	    var _triggerEvents = function(mouseConstraint) {
	        var mouse = mouseConstraint.mouse,
	            mouseEvents = mouse.sourceEvents;
	
	        if (mouseEvents.mousemove)
	            Events.trigger(mouseConstraint, 'mousemove', { mouse: mouse });
	
	        if (mouseEvents.mousedown)
	            Events.trigger(mouseConstraint, 'mousedown', { mouse: mouse });
	
	        if (mouseEvents.mouseup)
	            Events.trigger(mouseConstraint, 'mouseup', { mouse: mouse });
	
	        // reset the mouse state ready for the next step
	        Mouse.clearSourceEvents(mouse);
	    };
	
	    /*
	    *
	    *  Events Documentation
	    *
	    */
	
	    /**
	    * Fired when the mouse has moved (or a touch moves) during the last step
	    *
	    * @event mousemove
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when the mouse is down (or a touch has started) during the last step
	    *
	    * @event mousedown
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when the mouse is up (or a touch has ended) during the last step
	    *
	    * @event mouseup
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when the user starts dragging a body
	    *
	    * @event startdrag
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {body} event.body The body being dragged
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when the user ends dragging a body
	    *
	    * @event enddrag
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {body} event.body The body that has stopped being dragged
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * A `String` denoting the type of object.
	     *
	     * @property type
	     * @type string
	     * @default "constraint"
	     */
	
	    /**
	     * The `Mouse` instance in use. If not supplied in `MouseConstraint.create`, one will be created.
	     *
	     * @property mouse
	     * @type mouse
	     * @default mouse
	     */
	
	    /**
	     * The `Body` that is currently being moved by the user, or `null` if no body.
	     *
	     * @property body
	     * @type body
	     * @default null
	     */
	
	    /**
	     * The `Constraint` object that is used to move the body during interaction.
	     *
	     * @property constraint
	     * @type constraint
	     */
	
	    /**
	     * An `Object` that specifies the collision filter properties.
	     * The collision filter allows the user to define which types of body this mouse constraint can interact with.
	     * See `body.collisionFilter` for more information.
	     *
	     * @property collisionFilter
	     * @type object
	     */
	
	})();
	
	
	;   // End src/constraint/MouseConstraint.js
	
	
	// Begin src/core/Common.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Common
	*/
	
	var Common = {};
	
	(function() {
	
	    Common._nextId = 0;
	    Common._seed = 0;
	
	    /**
	     * Description
	     * @method extend
	     * @param {} obj
	     * @param {boolean} deep
	     * @return {} obj extended
	     */
	    Common.extend = function(obj, deep) {
	        var argsStart,
	            args,
	            deepClone;
	
	        if (typeof deep === 'boolean') {
	            argsStart = 2;
	            deepClone = deep;
	        } else {
	            argsStart = 1;
	            deepClone = true;
	        }
	
	        args = Array.prototype.slice.call(arguments, argsStart);
	
	        for (var i = 0; i < args.length; i++) {
	            var source = args[i];
	
	            if (source) {
	                for (var prop in source) {
	                    if (deepClone && source[prop] && source[prop].constructor === Object) {
	                        if (!obj[prop] || obj[prop].constructor === Object) {
	                            obj[prop] = obj[prop] || {};
	                            Common.extend(obj[prop], deepClone, source[prop]);
	                        } else {
	                            obj[prop] = source[prop];
	                        }
	                    } else {
	                        obj[prop] = source[prop];
	                    }
	                }
	            }
	        }
	        
	        return obj;
	    };
	
	    /**
	     * Creates a new clone of the object, if deep is true references will also be cloned
	     * @method clone
	     * @param {} obj
	     * @param {bool} deep
	     * @return {} obj cloned
	     */
	    Common.clone = function(obj, deep) {
	        return Common.extend({}, deep, obj);
	    };
	
	    /**
	     * Description
	     * @method keys
	     * @param {} obj
	     * @return {string[]} keys
	     */
	    Common.keys = function(obj) {
	        if (Object.keys)
	            return Object.keys(obj);
	
	        // avoid hasOwnProperty for performance
	        var keys = [];
	        for (var key in obj)
	            keys.push(key);
	        return keys;
	    };
	
	    /**
	     * Description
	     * @method values
	     * @param {} obj
	     * @return {array} Array of the objects property values
	     */
	    Common.values = function(obj) {
	        var values = [];
	        
	        if (Object.keys) {
	            var keys = Object.keys(obj);
	            for (var i = 0; i < keys.length; i++) {
	                values.push(obj[keys[i]]);
	            }
	            return values;
	        }
	        
	        // avoid hasOwnProperty for performance
	        for (var key in obj)
	            values.push(obj[key]);
	        return values;
	    };
	
	    /**
	     * Description
	     * @method shadeColor
	     * @param {string} color
	     * @param {number} percent
	     * @return {string} A hex colour string made by lightening or darkening color by percent
	     */
	    Common.shadeColor = function(color, percent) {   
	        // http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color
	        var colorInteger = parseInt(color.slice(1),16), 
	            amount = Math.round(2.55 * percent), 
	            R = (colorInteger >> 16) + amount, 
	            B = (colorInteger >> 8 & 0x00FF) + amount, 
	            G = (colorInteger & 0x0000FF) + amount;
	        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R :255) * 0x10000 
	                + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 
	                + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
	    };
	
	    /**
	     * Description
	     * @method shuffle
	     * @param {array} array
	     * @return {array} array shuffled randomly
	     */
	    Common.shuffle = function(array) {
	        for (var i = array.length - 1; i > 0; i--) {
	            var j = Math.floor(Common.random() * (i + 1));
	            var temp = array[i];
	            array[i] = array[j];
	            array[j] = temp;
	        }
	        return array;
	    };
	
	    /**
	     * Description
	     * @method choose
	     * @param {array} choices
	     * @return {object} A random choice object from the array
	     */
	    Common.choose = function(choices) {
	        return choices[Math.floor(Common.random() * choices.length)];
	    };
	
	    /**
	     * Description
	     * @method isElement
	     * @param {object} obj
	     * @return {boolean} True if the object is a HTMLElement, otherwise false
	     */
	    Common.isElement = function(obj) {
	        // http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
	        try {
	            return obj instanceof HTMLElement;
	        }
	        catch(e){
	            return (typeof obj==="object") &&
	              (obj.nodeType===1) && (typeof obj.style === "object") &&
	              (typeof obj.ownerDocument ==="object");
	        }
	    };
	    
	    /**
	     * Description
	     * @method clamp
	     * @param {number} value
	     * @param {number} min
	     * @param {number} max
	     * @return {number} The value clamped between min and max inclusive
	     */
	    Common.clamp = function(value, min, max) {
	        if (value < min)
	            return min;
	        if (value > max)
	            return max;
	        return value;
	    };
	    
	    /**
	     * Description
	     * @method sign
	     * @param {number} value
	     * @return {number} -1 if negative, +1 if 0 or positive
	     */
	    Common.sign = function(value) {
	        return value < 0 ? -1 : 1;
	    };
	    
	    /**
	     * Description
	     * @method now
	     * @return {number} the current timestamp (high-res if avaliable)
	     */
	    Common.now = function() {
	        // http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
	        // https://gist.github.com/davidwaterston/2982531
	        
	        var perf = window.performance;
	
	        if (perf) {
	            perf.now = perf.now || perf.webkitNow || perf.msNow || perf.oNow || perf.mozNow;
	            return +(perf.now());
	        }
	        
	        return +(new Date());
	    };
	
	    
	    /**
	     * Description
	     * @method random
	     * @param {number} min
	     * @param {number} max
	     * @return {number} A random number between min and max inclusive
	     */
	    Common.random = function(min, max) {
	        min = (typeof min !== "undefined") ? min : 0;
	        max = (typeof max !== "undefined") ? max : 1;
	        return min + _seededRandom() * (max - min);
	    };
	
	    /**
	     * Converts a CSS hex colour string into an integer
	     * @method colorToNumber
	     * @param {string} colorString
	     * @return {number} An integer representing the CSS hex string
	     */
	    Common.colorToNumber = function(colorString) {
	        colorString = colorString.replace('#','');
	
	        if (colorString.length == 3) {
	            colorString = colorString.charAt(0) + colorString.charAt(0)
	                        + colorString.charAt(1) + colorString.charAt(1)
	                        + colorString.charAt(2) + colorString.charAt(2);
	        }
	
	        return parseInt(colorString, 16);
	    };
	
	    /**
	     * A wrapper for console.log, for providing errors and warnings
	     * @method log
	     * @param {string} message
	     * @param {string} type
	     */
	    Common.log = function(message, type) {
	        if (!console || !console.log || !console.warn)
	            return;
	
	        var style;
	
	        switch (type) {
	
	        case 'warn':
	            console.warn('Matter.js:', message);
	            break;
	        case 'error':
	            console.log('Matter.js:', message);
	            break;
	
	        }
	    };
	
	    /**
	     * Returns the next unique sequential ID
	     * @method nextId
	     * @return {Number} Unique sequential ID
	     */
	    Common.nextId = function() {
	        return Common._nextId++;
	    };
	
	    /**
	     * A cross browser compatible indexOf implementation
	     * @method indexOf
	     * @param {array} haystack
	     * @param {object} needle
	     */
	    Common.indexOf = function(haystack, needle) {
	        if (haystack.indexOf)
	            return haystack.indexOf(needle);
	
	        for (var i = 0; i < haystack.length; i++) {
	            if (haystack[i] === needle)
	                return i;
	        }
	
	        return -1;
	    };
	
	    var _seededRandom = function() {
	        // https://gist.github.com/ngryman/3830489
	        Common._seed = (Common._seed * 9301 + 49297) % 233280;
	        return Common._seed / 233280;
	    };
	
	})();
	
	;   // End src/core/Common.js
	
	
	// Begin src/core/Engine.js
	
	/**
	* The `Matter.Engine` module contains methods for creating and manipulating engines.
	* An engine is a controller that manages updating and rendering the simulation of the world.
	* See `Matter.Runner` for an optional game loop utility.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Engine
	*/
	
	var Engine = {};
	
	(function() {
	
	    var _fps = 60,
	        _delta = 1000 / _fps;
	
	    /**
	     * Creates a new engine. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properites section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {HTMLElement} element
	     * @param {object} [options]
	     * @return {engine} engine
	     */
	    Engine.create = function(element, options) {
	
	        // options may be passed as the first (and only) argument
	        options = Common.isElement(element) ? options : element;
	        element = Common.isElement(element) ? element : null;
	
	        var defaults = {
	            enabled: true,
	            positionIterations: 6,
	            velocityIterations: 4,
	            constraintIterations: 2,
	            enableSleeping: false,
	            events: [],
	            timing: {
	                fps: _fps,
	                timestamp: 0,
	                delta: _delta,
	                correction: 1,
	                deltaMin: 1000 / _fps,
	                deltaMax: 1000 / (_fps * 0.5),
	                timeScale: 1,
	                isFixed: false,
	                frameRequestId: 0
	            },
	            render: {
	                element: element,
	                controller: Render
	            },
	            broadphase: {
	                controller: Grid
	            }
	        };
	        
	        var engine = Common.extend(defaults, options);
	
	        engine.render = engine.render.controller.create(engine.render);
	        engine.world = World.create(engine.world);
	        engine.pairs = Pairs.create();
	        engine.metrics = engine.metrics || Metrics.create();
	        engine.broadphase = engine.broadphase.controller.create(engine.broadphase);
	
	        return engine;
	    };
	
	    /**
	     * Moves the simulation forward in time by `delta` ms. 
	     * Triggers `beforeUpdate` and `afterUpdate` events.
	     * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
	     * @method update
	     * @param {engine} engine
	     * @param {number} delta
	     * @param {number} [correction]
	     */
	    Engine.update = function(engine, delta, correction) {
	        correction = (typeof correction !== 'undefined') ? correction : 1;
	
	        var world = engine.world,
	            timing = engine.timing,
	            broadphase = engine.broadphase,
	            broadphasePairs = [],
	            i;
	
	        // increment timestamp
	        timing.timestamp += delta * timing.timeScale;
	        timing.correction = correction;
	
	        // create an event object
	        var event = {
	            timestamp: engine.timing.timestamp
	        };
	
	        Events.trigger(engine, 'beforeUpdate', event);
	
	        // get lists of all bodies and constraints, no matter what composites they are in
	        var allBodies = Composite.allBodies(world),
	            allConstraints = Composite.allConstraints(world);
	
	        // reset metrics logging
	        Metrics.reset(engine.metrics);
	
	        // if sleeping enabled, call the sleeping controller
	        if (engine.enableSleeping)
	            Sleeping.update(allBodies, timing.timeScale);
	
	        // applies gravity to all bodies
	        _bodiesApplyGravity(allBodies, world.gravity);
	
	        // update all body position and rotation by integration
	        _bodiesUpdate(allBodies, delta, timing.timeScale, correction, world.bounds);
	
	        // update all constraints
	        for (i = 0; i < engine.constraintIterations; i++) {
	            Constraint.solveAll(allConstraints, timing.timeScale);
	        }
	        Constraint.postSolveAll(allBodies);
	
	        // broadphase pass: find potential collision pairs
	        if (broadphase.controller) {
	
	            // if world is dirty, we must flush the whole grid
	            if (world.isModified)
	                broadphase.controller.clear(broadphase);
	
	            // update the grid buckets based on current bodies
	            broadphase.controller.update(broadphase, allBodies, engine, world.isModified);
	            broadphasePairs = broadphase.pairsList;
	        } else {
	
	            // if no broadphase set, we just pass all bodies
	            broadphasePairs = allBodies;
	        }
	
	        // narrowphase pass: find actual collisions, then create or update collision pairs
	        var collisions = broadphase.detector(broadphasePairs, engine);
	
	        // update collision pairs
	        var pairs = engine.pairs,
	            timestamp = timing.timestamp;
	        Pairs.update(pairs, collisions, timestamp);
	        Pairs.removeOld(pairs, timestamp);
	
	        // wake up bodies involved in collisions
	        if (engine.enableSleeping)
	            Sleeping.afterCollisions(pairs.list, timing.timeScale);
	
	        // trigger collision events
	        if (pairs.collisionStart.length > 0)
	            Events.trigger(engine, 'collisionStart', { pairs: pairs.collisionStart });
	
	        // iteratively resolve velocity between collisions
	        Resolver.preSolveVelocity(pairs.list);
	        for (i = 0; i < engine.velocityIterations; i++) {
	            Resolver.solveVelocity(pairs.list, timing.timeScale);
	        }
	        
	        // iteratively resolve position between collisions
	        for (i = 0; i < engine.positionIterations; i++) {
	            Resolver.solvePosition(pairs.list, timing.timeScale);
	        }
	        Resolver.postSolvePosition(allBodies);
	
	        // trigger collision events
	        if (pairs.collisionActive.length > 0)
	            Events.trigger(engine, 'collisionActive', { pairs: pairs.collisionActive });
	
	        if (pairs.collisionEnd.length > 0)
	            Events.trigger(engine, 'collisionEnd', { pairs: pairs.collisionEnd });
	
	        // update metrics log
	        Metrics.update(engine.metrics, engine);
	
	        // clear force buffers
	        _bodiesClearForces(allBodies);
	
	        // clear all composite modified flags
	        if (world.isModified)
	            Composite.setModified(world, false, false, true);
	
	        Events.trigger(engine, 'afterUpdate', event);
	
	        return engine;
	    };
	
	    /**
	     * Renders the world by calling its defined renderer `engine.render.controller`. Triggers `beforeRender` and `afterRender` events.
	     * @method render
	     * @param {engine} engineA
	     * @param {engine} engineB
	     */
	    Engine.render = function(engine) {
	        // create an event object
	        var event = {
	            timestamp: engine.timing.timestamp
	        };
	
	        Events.trigger(engine, 'beforeRender', event);
	        engine.render.controller.world(engine);
	        Events.trigger(engine, 'afterRender', event);
	    };
	    
	    /**
	     * Merges two engines by keeping the configuration of `engineA` but replacing the world with the one from `engineB`.
	     * @method merge
	     * @param {engine} engineA
	     * @param {engine} engineB
	     */
	    Engine.merge = function(engineA, engineB) {
	        Common.extend(engineA, engineB);
	        
	        if (engineB.world) {
	            engineA.world = engineB.world;
	
	            Engine.clear(engineA);
	
	            var bodies = Composite.allBodies(engineA.world);
	
	            for (var i = 0; i < bodies.length; i++) {
	                var body = bodies[i];
	                Sleeping.set(body, false);
	                body.id = Common.nextId();
	            }
	        }
	    };
	
	    /**
	     * Clears the engine including the world, pairs and broadphase.
	     * @method clear
	     * @param {engine} engine
	     */
	    Engine.clear = function(engine) {
	        var world = engine.world;
	        
	        Pairs.clear(engine.pairs);
	
	        var broadphase = engine.broadphase;
	        if (broadphase.controller) {
	            var bodies = Composite.allBodies(world);
	            broadphase.controller.clear(broadphase);
	            broadphase.controller.update(broadphase, bodies, engine, true);
	        }
	    };
	
	    /**
	     * Zeroes the `body.force` and `body.torque` force buffers.
	     * @method bodiesClearForces
	     * @private
	     * @param {body[]} bodies
	     */
	    var _bodiesClearForces = function(bodies) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            // reset force buffers
	            body.force.x = 0;
	            body.force.y = 0;
	            body.torque = 0;
	        }
	    };
	
	    /**
	     * Applys a mass dependant force to all given bodies.
	     * @method bodiesApplyGravity
	     * @private
	     * @param {body[]} bodies
	     * @param {vector} gravity
	     */
	    var _bodiesApplyGravity = function(bodies, gravity) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.isStatic || body.isSleeping)
	                continue;
	
	            // apply gravity
	            body.force.y += body.mass * gravity.y * 0.001;
	            body.force.x += body.mass * gravity.x * 0.001;
	        }
	    };
	
	    /**
	     * Applys `Body.update` to all given `bodies`.
	     * @method updateAll
	     * @private
	     * @param {body[]} bodies
	     * @param {number} deltaTime 
	     * The amount of time elapsed between updates
	     * @param {number} timeScale
	     * @param {number} correction 
	     * The Verlet correction factor (deltaTime / lastDeltaTime)
	     * @param {bounds} worldBounds
	     */
	    var _bodiesUpdate = function(bodies, deltaTime, timeScale, correction, worldBounds) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.isStatic || body.isSleeping)
	                continue;
	
	            // don't update out of world bodies
	            if (body.bounds.max.x < worldBounds.min.x || body.bounds.min.x > worldBounds.max.x
	                || body.bounds.max.y < worldBounds.min.y || body.bounds.min.y > worldBounds.max.y)
	                continue;
	
	            Body.update(body, deltaTime, timeScale, correction);
	        }
	    };
	
	    /**
	     * An alias for `Runner.run`, see `Matter.Runner` for more information.
	     * @method run
	     * @param {engine} engine
	     */
	
	    /*
	    *
	    *  Events Documentation
	    *
	    */
	
	    /**
	    * Fired at the start of a tick, before any updates to the engine or timing
	    *
	    * @event beforeTick
	    * @param {} event An event object
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine timing updated, but just before engine state updated
	    *
	    * @event tick
	    * @param {} event An event object
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired just before an update
	    *
	    * @event beforeUpdate
	    * @param {} event An event object
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update and all collision events
	    *
	    * @event afterUpdate
	    * @param {} event An event object
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired just before rendering
	    *
	    * @event beforeRender
	    * @param {} event An event object
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after rendering
	    *
	    * @event afterRender
	    * @param {} event An event object
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update and after rendering
	    *
	    * @event afterTick
	    * @param {} event An event object
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update, provides a list of all pairs that have started to collide in the current tick (if any)
	    *
	    * @event collisionStart
	    * @param {} event An event object
	    * @param {} event.pairs List of affected pairs
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update, provides a list of all pairs that are colliding in the current tick (if any)
	    *
	    * @event collisionActive
	    * @param {} event An event object
	    * @param {} event.pairs List of affected pairs
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update, provides a list of all pairs that have ended collision in the current tick (if any)
	    *
	    * @event collisionEnd
	    * @param {} event An event object
	    * @param {} event.pairs List of affected pairs
	    * @param {DOMHighResTimeStamp} event.timestamp The timestamp of the current tick
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * A flag that specifies whether the engine is running or not.
	     *
	     * @property enabled
	     * @type boolean
	     * @default true
	     */
	
	    /**
	     * An integer `Number` that specifies the number of position iterations to perform each update.
	     * The higher the value, the higher quality the simulation will be at the expense of performance.
	     *
	     * @property positionIterations
	     * @type number
	     * @default 6
	     */
	
	    /**
	     * An integer `Number` that specifies the number of velocity iterations to perform each update.
	     * The higher the value, the higher quality the simulation will be at the expense of performance.
	     *
	     * @property velocityIterations
	     * @type number
	     * @default 4
	     */
	
	    /**
	     * An integer `Number` that specifies the number of constraint iterations to perform each update.
	     * The higher the value, the higher quality the simulation will be at the expense of performance.
	     * The default value of `2` is usually very adequate.
	     *
	     * @property constraintIterations
	     * @type number
	     * @default 2
	     */
	
	    /**
	     * A flag that specifies whether the engine should allow sleeping via the `Matter.Sleeping` module.
	     * Sleeping can improve stability and performance, but often at the expense of accuracy.
	     *
	     * @property enableSleeping
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * An `Object` containing properties regarding the timing systems of the engine. 
	     *
	     * @property timing
	     * @type object
	     */
	
	    /**
	     * A `Number` that specifies the global scaling factor of time for all bodies.
	     * A value of `0` freezes the simulation.
	     * A value of `0.1` gives a slow-motion effect.
	     * A value of `1.2` gives a speed-up effect.
	     *
	     * @property timing.timeScale
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * A `Number` that specifies the current simulation-time in milliseconds starting from `0`. 
	     * It is incremented on every `Engine.update` by the `timing.delta`. 
	     *
	     * @property timing.timestamp
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Boolean` that specifies if the `Engine.run` game loop should use a fixed timestep (otherwise it is variable).
	     * If timing is fixed, then the apparant simulation speed will change depending on the frame rate (but behaviour will be deterministic).
	     * If the timing is variable, then the apparant simulation speed will be constant (approximately, but at the cost of determininism).
	     *
	     * @property timing.isFixed
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * A `Number` that specifies the time step between updates in milliseconds.
	     * If `engine.timing.isFixed` is set to `true`, then `delta` is fixed.
	     * If it is `false`, then `delta` can dynamically change to maintain the correct apparant simulation speed.
	     *
	     * @property timing.delta
	     * @type number
	     * @default 1000 / 60
	     */
	
	    /**
	     * A `Number` that specifies the time correction factor to apply to the current timestep.
	     * It is automatically handled when using `Engine.run`, but is also only optional even if you use your own game loop.
	     * The value is defined as `delta / lastDelta`, i.e. the percentage change of `delta` between steps.
	     * This value is always `1` (no correction) when frame rate is constant or `engine.timing.isFixed` is `true`.
	     * If the framerate and hence `delta` are changing, then correction should be applied to the current update to account for the change.
	     * See the paper on <a href="http://lonesock.net/article/verlet.html">Time Corrected Verlet</a> for more information.
	     *
	     * @property timing.correction
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * An instance of a `Render` controller. The default value is a `Matter.Render` instance created by `Engine.create`.
	     * One may also develop a custom renderer module based on `Matter.Render` and pass an instance of it to `Engine.create` via `options.render`.
	     *
	     * A minimal custom renderer object must define at least three functions: `create`, `clear` and `world` (see `Matter.Render`).
	     * It is also possible to instead pass the _module_ reference via `options.render.controller` and `Engine.create` will instantiate one for you.
	     *
	     * @property render
	     * @type render
	     * @default a Matter.Render instance
	     */
	
	    /**
	     * An instance of a broadphase controller. The default value is a `Matter.Grid` instance created by `Engine.create`.
	     *
	     * @property broadphase
	     * @type grid
	     * @default a Matter.Grid instance
	     */
	
	    /**
	     * A `World` composite object that will contain all simulated bodies and constraints.
	     *
	     * @property world
	     * @type world
	     * @default a Matter.World instance
	     */
	
	})();
	
	;   // End src/core/Engine.js
	
	
	// Begin src/core/Events.js
	
	/**
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Events
	*/
	
	var Events = {};
	
	(function() {
	
	    /**
	     * Subscribes a callback function to the given object's `eventName`.
	     * @method on
	     * @param {} object
	     * @param {string} eventNames
	     * @param {function} callback
	     */
	    Events.on = function(object, eventNames, callback) {
	        var names = eventNames.split(' '),
	            name;
	
	        for (var i = 0; i < names.length; i++) {
	            name = names[i];
	            object.events = object.events || {};
	            object.events[name] = object.events[name] || [];
	            object.events[name].push(callback);
	        }
	
	        return callback;
	    };
	
	    /**
	     * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all events.
	     * @method off
	     * @param {} object
	     * @param {string} eventNames
	     * @param {function} callback
	     */
	    Events.off = function(object, eventNames, callback) {
	        if (!eventNames) {
	            object.events = {};
	            return;
	        }
	
	        // handle Events.off(object, callback)
	        if (typeof eventNames === 'function') {
	            callback = eventNames;
	            eventNames = Common.keys(object.events).join(' ');
	        }
	
	        var names = eventNames.split(' ');
	
	        for (var i = 0; i < names.length; i++) {
	            var callbacks = object.events[names[i]],
	                newCallbacks = [];
	
	            if (callback) {
	                for (var j = 0; j < callbacks.length; j++) {
	                    if (callbacks[j] !== callback)
	                        newCallbacks.push(callbacks[j]);
	                }
	            }
	
	            object.events[names[i]] = newCallbacks;
	        }
	    };
	
	    /**
	     * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
	     * @method trigger
	     * @param {} object
	     * @param {string} eventNames
	     * @param {} event
	     */
	    Events.trigger = function(object, eventNames, event) {
	        var names,
	            name,
	            callbacks,
	            eventClone;
	
	        if (object.events) {
	            if (!event)
	                event = {};
	
	            names = eventNames.split(' ');
	
	            for (var i = 0; i < names.length; i++) {
	                name = names[i];
	                callbacks = object.events[name];
	
	                if (callbacks) {
	                    eventClone = Common.clone(event, false);
	                    eventClone.name = name;
	                    eventClone.source = object;
	
	                    for (var j = 0; j < callbacks.length; j++) {
	                        callbacks[j].apply(object, [eventClone]);
	                    }
	                }
	            }
	        }
	    };
	
	})();
	
	;   // End src/core/Events.js
	
	
	// Begin src/core/Metrics.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Metrics
	*/
	
	var Metrics = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @return {metrics} A new metrics
	     */
	    Metrics.create = function() {
	        return {
	            extended: false,
	            narrowDetections: 0,
	            narrowphaseTests: 0,
	            narrowReuse: 0,
	            narrowReuseCount: 0,
	            midphaseTests: 0,
	            broadphaseTests: 0,
	            narrowEff: 0.0001,
	            midEff: 0.0001,
	            broadEff: 0.0001,
	            collisions: 0,
	            buckets: 0,
	            bodies: 0,
	            pairs: 0
	        };
	    };
	
	    /**
	     * Description
	     * @method reset
	     * @param {metrics} metrics
	     */
	    Metrics.reset = function(metrics) {
	        if (metrics.extended) {
	            metrics.narrowDetections = 0;
	            metrics.narrowphaseTests = 0;
	            metrics.narrowReuse = 0;
	            metrics.narrowReuseCount = 0;
	            metrics.midphaseTests = 0;
	            metrics.broadphaseTests = 0;
	            metrics.narrowEff = 0;
	            metrics.midEff = 0;
	            metrics.broadEff = 0;
	            metrics.collisions = 0;
	            metrics.buckets = 0;
	            metrics.pairs = 0;
	            metrics.bodies = 0;
	        }
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {metrics} metrics
	     * @param {engine} engine
	     */
	    Metrics.update = function(metrics, engine) {
	        if (metrics.extended) {
	            var world = engine.world,
	                bodies = Composite.allBodies(world);
	
	            metrics.collisions = metrics.narrowDetections;
	            metrics.pairs = engine.pairs.list.length;
	            metrics.bodies = bodies.length;
	            metrics.midEff = (metrics.narrowDetections / (metrics.midphaseTests || 1)).toFixed(2);
	            metrics.narrowEff = (metrics.narrowDetections / (metrics.narrowphaseTests || 1)).toFixed(2);
	            metrics.broadEff = (1 - (metrics.broadphaseTests / (bodies.length || 1))).toFixed(2);
	            metrics.narrowReuse = (metrics.narrowReuseCount / (metrics.narrowphaseTests || 1)).toFixed(2);
	            //var broadphase = engine.broadphase[engine.broadphase.current];
	            //if (broadphase.instance)
	            //    metrics.buckets = Common.keys(broadphase.instance.buckets).length;
	        }
	    };
	
	})();
	
	
	;   // End src/core/Metrics.js
	
	
	// Begin src/core/Mouse.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Mouse
	*/
	
	var Mouse = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @param {HTMLElement} element
	     * @return {mouse} A new mouse
	     */
	    Mouse.create = function(element) {
	        var mouse = {};
	
	        if (!element) {
	            Common.log('Mouse.create: element was undefined, defaulting to document.body', 'warn');
	        }
	        
	        mouse.element = element || document.body;
	        mouse.absolute = { x: 0, y: 0 };
	        mouse.position = { x: 0, y: 0 };
	        mouse.mousedownPosition = { x: 0, y: 0 };
	        mouse.mouseupPosition = { x: 0, y: 0 };
	        mouse.offset = { x: 0, y: 0 };
	        mouse.scale = { x: 1, y: 1 };
	        mouse.wheelDelta = 0;
	        mouse.button = -1;
	        mouse.pixelRatio = mouse.element.getAttribute('data-pixel-ratio') || 1;
	
	        mouse.sourceEvents = {
	            mousemove: null,
	            mousedown: null,
	            mouseup: null,
	            mousewheel: null
	        };
	        
	        mouse.mousemove = function(event) { 
	            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
	                touches = event.changedTouches;
	
	            if (touches) {
	                mouse.button = 0;
	                event.preventDefault();
	            }
	
	            mouse.absolute.x = position.x;
	            mouse.absolute.y = position.y;
	            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	            mouse.sourceEvents.mousemove = event;
	        };
	        
	        mouse.mousedown = function(event) {
	            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
	                touches = event.changedTouches;
	
	            if (touches) {
	                mouse.button = 0;
	                event.preventDefault();
	            } else {
	                mouse.button = event.button;
	            }
	
	            mouse.absolute.x = position.x;
	            mouse.absolute.y = position.y;
	            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	            mouse.mousedownPosition.x = mouse.position.x;
	            mouse.mousedownPosition.y = mouse.position.y;
	            mouse.sourceEvents.mousedown = event;
	        };
	        
	        mouse.mouseup = function(event) {
	            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
	                touches = event.changedTouches;
	
	            if (touches) {
	                event.preventDefault();
	            }
	            
	            mouse.button = -1;
	            mouse.absolute.x = position.x;
	            mouse.absolute.y = position.y;
	            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	            mouse.mouseupPosition.x = mouse.position.x;
	            mouse.mouseupPosition.y = mouse.position.y;
	            mouse.sourceEvents.mouseup = event;
	        };
	
	        mouse.mousewheel = function(event) {
	            mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
	            event.preventDefault();
	        };
	
	        Mouse.setElement(mouse, mouse.element);
	
	        return mouse;
	    };
	
	    /**
	     * Sets the element the mouse is bound to (and relative to)
	     * @method setElement
	     * @param {mouse} mouse
	     * @param {HTMLElement} element
	     */
	    Mouse.setElement = function(mouse, element) {
	        mouse.element = element;
	
	        element.addEventListener('mousemove', mouse.mousemove);
	        element.addEventListener('mousedown', mouse.mousedown);
	        element.addEventListener('mouseup', mouse.mouseup);
	        
	        element.addEventListener("mousewheel", mouse.mousewheel);
	        element.addEventListener("DOMMouseScroll", mouse.mousewheel);
	
	        element.addEventListener('touchmove', mouse.mousemove);
	        element.addEventListener('touchstart', mouse.mousedown);
	        element.addEventListener('touchend', mouse.mouseup);
	    };
	
	    /**
	     * Clears all captured source events
	     * @method clearSourceEvents
	     * @param {mouse} mouse
	     */
	    Mouse.clearSourceEvents = function(mouse) {
	        mouse.sourceEvents.mousemove = null;
	        mouse.sourceEvents.mousedown = null;
	        mouse.sourceEvents.mouseup = null;
	        mouse.sourceEvents.mousewheel = null;
	        mouse.wheelDelta = 0;
	    };
	
	    /**
	     * Sets the offset
	     * @method setOffset
	     * @param {mouse} mouse
	     */
	    Mouse.setOffset = function(mouse, offset) {
	        mouse.offset.x = offset.x;
	        mouse.offset.y = offset.y;
	        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	    };
	
	    /**
	     * Sets the scale
	     * @method setScale
	     * @param {mouse} mouse
	     */
	    Mouse.setScale = function(mouse, scale) {
	        mouse.scale.x = scale.x;
	        mouse.scale.y = scale.y;
	        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	    };
	    
	    /**
	     * Description
	     * @method _getRelativeMousePosition
	     * @private
	     * @param {} event
	     * @param {} element
	     * @param {number} pixelRatio
	     * @return {}
	     */
	    var _getRelativeMousePosition = function(event, element, pixelRatio) {
	        var elementBounds = element.getBoundingClientRect(),
	            rootNode = (document.documentElement || document.body.parentNode || document.body),
	            scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : rootNode.scrollLeft,
	            scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : rootNode.scrollTop,
	            touches = event.changedTouches,
	            x, y;
	        
	        if (touches) {
	            x = touches[0].pageX - elementBounds.left - scrollX;
	            y = touches[0].pageY - elementBounds.top - scrollY;
	        } else {
	            x = event.pageX - elementBounds.left - scrollX;
	            y = event.pageY - elementBounds.top - scrollY;
	        }
	
	        return { 
	            x: x / (element.clientWidth / element.width * pixelRatio),
	            y: y / (element.clientHeight / element.height * pixelRatio)
	        };
	    };
	
	})();
	
	
	;   // End src/core/Mouse.js
	
	
	// Begin src/core/Runner.js
	
	/**
	* The `Matter.Runner` module is an optional utility which provides a game loop, 
	* that handles updating and rendering a `Matter.Engine` for you within a browser.
	* Note that the method `Engine.run` is an alias for `Runner.run`.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Runner
	*/
	
	var Runner = {};
	
	(function() {
	
	    var _fps = 60,
	        _deltaSampleSize = _fps,
	        _delta = 1000 / _fps;
	
	    var _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
	                                      || window.mozRequestAnimationFrame || window.msRequestAnimationFrame 
	                                      || function(callback){ window.setTimeout(function() { callback(Common.now()); }, _delta); };
	   
	    var _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame 
	                                      || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
	
	    /**
	     * Provides a basic game loop that handles updating the engine for you.
	     * Calls `Engine.update` and `Engine.render` on the `requestAnimationFrame` event automatically.
	     * Handles time correction and non-fixed dynamic timing (if enabled). 
	     * Triggers `beforeTick`, `tick` and `afterTick` events.
	     * @method run
	     * @param {engine} engine
	     */
	    Runner.run = function(engine) {
	        var counterTimestamp = 0,
	            frameCounter = 0,
	            deltaHistory = [],
	            timePrev,
	            timeScalePrev = 1;
	
	        (function render(time){
	            var timing = engine.timing,
	                delta,
	                correction = 1;
	
	            timing.frameRequestId = _requestAnimationFrame(render);
	
	            if (!engine.enabled)
	                return;
	
	            // create an event object
	            var event = {
	                timestamp: time
	            };
	
	            Events.trigger(engine, 'beforeTick', event);
	
	            if (timing.isFixed) {
	                // fixed timestep
	                delta = timing.delta;
	            } else {
	                // dynamic timestep based on wall clock between calls
	                delta = (time - timePrev) || timing.delta;
	                timePrev = time;
	
	                // optimistically filter delta over a few frames, to improve stability
	                deltaHistory.push(delta);
	                deltaHistory = deltaHistory.slice(-_deltaSampleSize);
	                delta = Math.min.apply(null, deltaHistory);
	                
	                // limit delta
	                delta = delta < timing.deltaMin ? timing.deltaMin : delta;
	                delta = delta > timing.deltaMax ? timing.deltaMax : delta;
	
	                // time correction for delta
	                correction = delta / timing.delta;
	
	                // update engine timing object
	                timing.delta = delta;
	            }
	
	            // time correction for time scaling
	            if (timeScalePrev !== 0)
	                correction *= timing.timeScale / timeScalePrev;
	
	            if (timing.timeScale === 0)
	                correction = 0;
	
	            timeScalePrev = timing.timeScale;
	            
	            // fps counter
	            frameCounter += 1;
	            if (time - counterTimestamp >= 1000) {
	                timing.fps = frameCounter * ((time - counterTimestamp) / 1000);
	                counterTimestamp = time;
	                frameCounter = 0;
	            }
	
	            Events.trigger(engine, 'tick', event);
	
	            // if world has been modified, clear the render scene graph
	            if (engine.world.isModified && engine.render.controller.clear)
	                engine.render.controller.clear(engine.render);
	
	            // update
	            Engine.update(engine, delta, correction);
	
	            // render
	            Engine.render(engine);
	
	            Events.trigger(engine, 'afterTick', event);
	        })();
	    };
	
	    /**
	     * Ends execution of `Runner.run` on the given `engine`, by canceling the animation frame request event loop.
	     * If you wish to only temporarily pause the engine, see `engine.enabled` instead.
	     * @method stop
	     * @param {engine} engine
	     */
	    Runner.stop = function(engine) {
	        _cancelAnimationFrame(engine.timing.frameRequestId);
	    };
	
	})();
	
	
	;   // End src/core/Runner.js
	
	
	// Begin src/core/Sleeping.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Sleeping
	*/
	
	var Sleeping = {};
	
	(function() {
	
	    Sleeping._motionWakeThreshold = 0.18;
	    Sleeping._motionSleepThreshold = 0.08;
	    Sleeping._minBias = 0.9;
	
	    /**
	     * Puts bodies to sleep or wakes them up depending on their motion.
	     * @method update
	     * @param {body[]} bodies
	     * @param {number} timeScale
	     */
	    Sleeping.update = function(bodies, timeScale) {
	        var timeFactor = timeScale * timeScale * timeScale;
	
	        // update bodies sleeping status
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                motion = body.speed * body.speed + body.angularSpeed * body.angularSpeed;
	
	            // wake up bodies if they have a force applied
	            if (body.force.x > 0 || body.force.y > 0) {
	                Sleeping.set(body, false);
	                continue;
	            }
	
	            var minMotion = Math.min(body.motion, motion),
	                maxMotion = Math.max(body.motion, motion);
	        
	            // biased average motion estimation between frames
	            body.motion = Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;
	            
	            if (body.sleepThreshold > 0 && body.motion < Sleeping._motionSleepThreshold * timeFactor) {
	                body.sleepCounter += 1;
	                
	                if (body.sleepCounter >= body.sleepThreshold)
	                    Sleeping.set(body, true);
	            } else if (body.sleepCounter > 0) {
	                body.sleepCounter -= 1;
	            }
	        }
	    };
	
	    /**
	     * Given a set of colliding pairs, wakes the sleeping bodies involved.
	     * @method afterCollisions
	     * @param {pair[]} pairs
	     * @param {number} timeScale
	     */
	    Sleeping.afterCollisions = function(pairs, timeScale) {
	        var timeFactor = timeScale * timeScale * timeScale;
	
	        // wake up bodies involved in collisions
	        for (var i = 0; i < pairs.length; i++) {
	            var pair = pairs[i];
	            
	            // don't wake inactive pairs
	            if (!pair.isActive)
	                continue;
	
	            var collision = pair.collision,
	                bodyA = collision.bodyA, 
	                bodyB = collision.bodyB;
	        
	            // don't wake if at least one body is static
	            if ((bodyA.isSleeping && bodyB.isSleeping) || bodyA.isStatic || bodyB.isStatic)
	                continue;
	        
	            if (bodyA.isSleeping || bodyB.isSleeping) {
	                var sleepingBody = (bodyA.isSleeping && !bodyA.isStatic) ? bodyA : bodyB,
	                    movingBody = sleepingBody === bodyA ? bodyB : bodyA;
	
	                if (!sleepingBody.isStatic && movingBody.motion > Sleeping._motionWakeThreshold * timeFactor) {
	                    Sleeping.set(sleepingBody, false);
	                }
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method set
	     * @param {body} body
	     * @param {boolean} isSleeping
	     */
	    Sleeping.set = function(body, isSleeping) {
	        if (isSleeping) {
	            body.isSleeping = true;
	            body.sleepCounter = body.sleepThreshold;
	
	            body.positionImpulse.x = 0;
	            body.positionImpulse.y = 0;
	
	            body.positionPrev.x = body.position.x;
	            body.positionPrev.y = body.position.y;
	
	            body.anglePrev = body.angle;
	            body.speed = 0;
	            body.angularSpeed = 0;
	            body.motion = 0;
	        } else {
	            body.isSleeping = false;
	            body.sleepCounter = 0;
	        }
	    };
	
	})();
	
	;   // End src/core/Sleeping.js
	
	
	// Begin src/factory/Bodies.js
	
	/**
	* The `Matter.Bodies` module contains factory methods for creating rigid body models 
	* with commonly used body configurations (such as rectangles, circles and other polygons).
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Bodies
	*/
	
	// TODO: true circle bodies
	
	var Bodies = {};
	
	(function() {
	
	    /**
	     * Creates a new rigid body model with a rectangle hull. 
	     * The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method rectangle
	     * @param {number} x
	     * @param {number} y
	     * @param {number} width
	     * @param {number} height
	     * @param {object} [options]
	     * @return {body} A new rectangle body
	     */
	    Bodies.rectangle = function(x, y, width, height, options) {
	        options = options || {};
	
	        var rectangle = { 
	            label: 'Rectangle Body',
	            position: { x: x, y: y },
	            vertices: Vertices.fromPath('L 0 0 L ' + width + ' 0 L ' + width + ' ' + height + ' L 0 ' + height)
	        };
	
	        if (options.chamfer) {
	            var chamfer = options.chamfer;
	            rectangle.vertices = Vertices.chamfer(rectangle.vertices, chamfer.radius, 
	                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
	            delete options.chamfer;
	        }
	
	        return Body.create(Common.extend({}, rectangle, options));
	    };
	    
	    /**
	     * Creates a new rigid body model with a trapezoid hull. 
	     * The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method trapezoid
	     * @param {number} x
	     * @param {number} y
	     * @param {number} width
	     * @param {number} height
	     * @param {number} slope
	     * @param {object} [options]
	     * @return {body} A new trapezoid body
	     */
	    Bodies.trapezoid = function(x, y, width, height, slope, options) {
	        options = options || {};
	
	        slope *= 0.5;
	        var roof = (1 - (slope * 2)) * width;
	        
	        var x1 = width * slope,
	            x2 = x1 + roof,
	            x3 = x2 + x1;
	
	        var trapezoid = { 
	            label: 'Trapezoid Body',
	            position: { x: x, y: y },
	            vertices: Vertices.fromPath('L 0 0 L ' + x1 + ' ' + (-height) + ' L ' + x2 + ' ' + (-height) + ' L ' + x3 + ' 0')
	        };
	
	        if (options.chamfer) {
	            var chamfer = options.chamfer;
	            trapezoid.vertices = Vertices.chamfer(trapezoid.vertices, chamfer.radius, 
	                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
	            delete options.chamfer;
	        }
	
	        return Body.create(Common.extend({}, trapezoid, options));
	    };
	
	    /**
	     * Creates a new rigid body model with a circle hull. 
	     * The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method circle
	     * @param {number} x
	     * @param {number} y
	     * @param {number} radius
	     * @param {object} [options]
	     * @param {number} maxSides
	     * @return {body} A new circle body
	     */
	    Bodies.circle = function(x, y, radius, options, maxSides) {
	        options = options || {};
	        options.label = 'Circle Body';
	        
	        // approximate circles with polygons until true circles implemented in SAT
	
	        maxSides = maxSides || 25;
	        var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));
	
	        // optimisation: always use even number of sides (half the number of unique axes)
	        if (sides % 2 === 1)
	            sides += 1;
	
	        // flag for better rendering
	        options.circleRadius = radius;
	
	        return Bodies.polygon(x, y, sides, radius, options);
	    };
	
	    /**
	     * Creates a new rigid body model with a regular polygon hull with the given number of sides. 
	     * The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method polygon
	     * @param {number} x
	     * @param {number} y
	     * @param {number} sides
	     * @param {number} radius
	     * @param {object} [options]
	     * @return {body} A new regular polygon body
	     */
	    Bodies.polygon = function(x, y, sides, radius, options) {
	        options = options || {};
	
	        if (sides < 3)
	            return Bodies.circle(x, y, radius, options);
	
	        var theta = 2 * Math.PI / sides,
	            path = '',
	            offset = theta * 0.5;
	
	        for (var i = 0; i < sides; i += 1) {
	            var angle = offset + (i * theta),
	                xx = Math.cos(angle) * radius,
	                yy = Math.sin(angle) * radius;
	
	            path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
	        }
	
	        var polygon = { 
	            label: 'Polygon Body',
	            position: { x: x, y: y },
	            vertices: Vertices.fromPath(path)
	        };
	
	        if (options.chamfer) {
	            var chamfer = options.chamfer;
	            polygon.vertices = Vertices.chamfer(polygon.vertices, chamfer.radius, 
	                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
	            delete options.chamfer;
	        }
	
	        return Body.create(Common.extend({}, polygon, options));
	    };
	
	})();
	
	
	;   // End src/factory/Bodies.js
	
	
	// Begin src/factory/Composites.js
	
	/**
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Composites
	*/
	
	var Composites = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method stack
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} columns
	     * @param {number} rows
	     * @param {number} columnGap
	     * @param {number} rowGap
	     * @param {function} callback
	     * @return {composite} A new composite containing objects created in the callback
	     */
	    Composites.stack = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
	        var stack = Composite.create({ label: 'Stack' }),
	            x = xx,
	            y = yy,
	            lastBody,
	            i = 0;
	
	        for (var row = 0; row < rows; row++) {
	            var maxHeight = 0;
	            
	            for (var column = 0; column < columns; column++) {
	                var body = callback(x, y, column, row, lastBody, i);
	                    
	                if (body) {
	                    var bodyHeight = body.bounds.max.y - body.bounds.min.y,
	                        bodyWidth = body.bounds.max.x - body.bounds.min.x; 
	
	                    if (bodyHeight > maxHeight)
	                        maxHeight = bodyHeight;
	                    
	                    Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });
	
	                    x = body.bounds.max.x + columnGap;
	
	                    Composite.addBody(stack, body);
	                    
	                    lastBody = body;
	                    i += 1;
	                }
	            }
	            
	            y += maxHeight + rowGap;
	            x = xx;
	        }
	
	        return stack;
	    };
	    
	    /**
	     * Description
	     * @method chain
	     * @param {composite} composite
	     * @param {number} xOffsetA
	     * @param {number} yOffsetA
	     * @param {number} xOffsetB
	     * @param {number} yOffsetB
	     * @param {object} options
	     * @return {composite} A new composite containing objects chained together with constraints
	     */
	    Composites.chain = function(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) {
	        var bodies = composite.bodies;
	        
	        for (var i = 1; i < bodies.length; i++) {
	            var bodyA = bodies[i - 1],
	                bodyB = bodies[i],
	                bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y,
	                bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x, 
	                bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y,
	                bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;
	        
	            var defaults = {
	                bodyA: bodyA,
	                pointA: { x: bodyAWidth * xOffsetA, y: bodyAHeight * yOffsetA },
	                bodyB: bodyB,
	                pointB: { x: bodyBWidth * xOffsetB, y: bodyBHeight * yOffsetB }
	            };
	            
	            var constraint = Common.extend(defaults, options);
	        
	            Composite.addConstraint(composite, Constraint.create(constraint));
	        }
	
	        composite.label += ' Chain';
	        
	        return composite;
	    };
	
	    /**
	     * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces
	     * @method mesh
	     * @param {composite} composite
	     * @param {number} columns
	     * @param {number} rows
	     * @param {boolean} crossBrace
	     * @param {object} options
	     * @return {composite} The composite containing objects meshed together with constraints
	     */
	    Composites.mesh = function(composite, columns, rows, crossBrace, options) {
	        var bodies = composite.bodies,
	            row,
	            col,
	            bodyA,
	            bodyB,
	            bodyC;
	        
	        for (row = 0; row < rows; row++) {
	            for (col = 0; col < columns; col++) {
	                if (col > 0) {
	                    bodyA = bodies[(col - 1) + (row * columns)];
	                    bodyB = bodies[col + (row * columns)];
	                    Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
	                }
	            }
	
	            for (col = 0; col < columns; col++) {
	                if (row > 0) {
	                    bodyA = bodies[col + ((row - 1) * columns)];
	                    bodyB = bodies[col + (row * columns)];
	                    Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
	
	                    if (crossBrace && col > 0) {
	                        bodyC = bodies[(col - 1) + ((row - 1) * columns)];
	                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
	                    }
	
	                    if (crossBrace && col < columns - 1) {
	                        bodyC = bodies[(col + 1) + ((row - 1) * columns)];
	                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
	                    }
	                }
	            }
	        }
	
	        composite.label += ' Mesh';
	        
	        return composite;
	    };
	    
	    /**
	     * Description
	     * @method pyramid
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} columns
	     * @param {number} rows
	     * @param {number} columnGap
	     * @param {number} rowGap
	     * @param {function} callback
	     * @return {composite} A new composite containing objects created in the callback
	     */
	    Composites.pyramid = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
	        return Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y, column, row, lastBody, i) {
	            var actualRows = Math.min(rows, Math.ceil(columns / 2)),
	                lastBodyWidth = lastBody ? lastBody.bounds.max.x - lastBody.bounds.min.x : 0;
	            
	            if (row > actualRows)
	                return;
	            
	            // reverse row order
	            row = actualRows - row;
	            
	            var start = row,
	                end = columns - 1 - row;
	
	            if (column < start || column > end)
	                return;
	            
	            // retroactively fix the first body's position, since width was unknown
	            if (i === 1) {
	                Body.translate(lastBody, { x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth, y: 0 });
	            }
	
	            var xOffset = lastBody ? column * lastBodyWidth : 0;
	            
	            return callback(xx + xOffset + column * columnGap, y, column, row, lastBody, i);
	        });
	    };
	
	    /**
	     * Description
	     * @method newtonsCradle
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} number
	     * @param {number} size
	     * @param {number} length
	     * @return {composite} A new composite newtonsCradle body
	     */
	    Composites.newtonsCradle = function(xx, yy, number, size, length) {
	        var newtonsCradle = Composite.create({ label: 'Newtons Cradle' });
	
	        for (var i = 0; i < number; i++) {
	            var separation = 1.9,
	                circle = Bodies.circle(xx + i * (size * separation), yy + length, size, 
	                            { inertia: 99999, restitution: 1, friction: 0, frictionAir: 0.0001, slop: 0.01 }),
	                constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle });
	
	            Composite.addBody(newtonsCradle, circle);
	            Composite.addConstraint(newtonsCradle, constraint);
	        }
	
	        return newtonsCradle;
	    };
	    
	    /**
	     * Description
	     * @method car
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} width
	     * @param {number} height
	     * @param {number} wheelSize
	     * @return {composite} A new composite car body
	     */
	    Composites.car = function(xx, yy, width, height, wheelSize) {
	        var group = Body.nextGroup(true),
	            wheelBase = -20,
	            wheelAOffset = -width * 0.5 + wheelBase,
	            wheelBOffset = width * 0.5 - wheelBase,
	            wheelYOffset = 0;
	    
	        var car = Composite.create({ label: 'Car' }),
	            body = Bodies.trapezoid(xx, yy, width, height, 0.3, { 
	                collisionFilter: {
	                    group: group
	                },
	                friction: 0.01,
	                chamfer: {
	                    radius: 10
	                }
	            });
	    
	        var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, { 
	            collisionFilter: {
	                group: group
	            },
	            restitution: 0.5, 
	            friction: 0.9,
	            density: 0.01
	        });
	                    
	        var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, { 
	            collisionFilter: {
	                group: group
	            },
	            restitution: 0.5, 
	            friction: 0.9,
	            density: 0.01
	        });
	                    
	        var axelA = Constraint.create({
	            bodyA: body,
	            pointA: { x: wheelAOffset, y: wheelYOffset },
	            bodyB: wheelA,
	            stiffness: 0.5
	        });
	                        
	        var axelB = Constraint.create({
	            bodyA: body,
	            pointA: { x: wheelBOffset, y: wheelYOffset },
	            bodyB: wheelB,
	            stiffness: 0.5
	        });
	        
	        Composite.addBody(car, body);
	        Composite.addBody(car, wheelA);
	        Composite.addBody(car, wheelB);
	        Composite.addConstraint(car, axelA);
	        Composite.addConstraint(car, axelB);
	
	        return car;
	    };
	
	    /**
	     * Creates a simple soft body like object
	     * @method softBody
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} columns
	     * @param {number} rows
	     * @param {number} columnGap
	     * @param {number} rowGap
	     * @param {boolean} crossBrace
	     * @param {number} particleRadius
	     * @param {} particleOptions
	     * @param {} constraintOptions
	     * @return {composite} A new composite softBody
	     */
	    Composites.softBody = function(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
	        particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
	        constraintOptions = Common.extend({ stiffness: 0.4 }, constraintOptions);
	
	        var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
	            return Bodies.circle(x, y, particleRadius, particleOptions);
	        });
	
	        Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
	
	        softBody.label = 'Soft Body';
	
	        return softBody;
	    };
	
	})();
	
	
	;   // End src/factory/Composites.js
	
	
	// Begin src/geometry/Axes.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Axes
	*/
	
	var Axes = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method fromVertices
	     * @param {vertices} vertices
	     * @return {axes} A new axes from the given vertices
	     */
	    Axes.fromVertices = function(vertices) {
	        var axes = {};
	
	        // find the unique axes, using edge normal gradients
	        for (var i = 0; i < vertices.length; i++) {
	            var j = (i + 1) % vertices.length, 
	                normal = Vector.normalise({ 
	                    x: vertices[j].y - vertices[i].y, 
	                    y: vertices[i].x - vertices[j].x
	                }),
	                gradient = (normal.y === 0) ? Infinity : (normal.x / normal.y);
	            
	            // limit precision
	            gradient = gradient.toFixed(3).toString();
	
	            axes[gradient] = normal;
	        }
	
	        return Common.values(axes);
	    };
	
	    /**
	     * Description
	     * @method rotate
	     * @param {axes} axes
	     * @param {number} angle
	     */
	    Axes.rotate = function(axes, angle) {
	        if (angle === 0)
	            return;
	        
	        var cos = Math.cos(angle),
	            sin = Math.sin(angle);
	
	        for (var i = 0; i < axes.length; i++) {
	            var axis = axes[i],
	                xx;
	            xx = axis.x * cos - axis.y * sin;
	            axis.y = axis.x * sin + axis.y * cos;
	            axis.x = xx;
	        }
	    };
	
	})();
	
	;   // End src/geometry/Axes.js
	
	
	// Begin src/geometry/Bounds.js
	
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Bounds
	*/
	
	var Bounds = {};
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @param {vertices} vertices
	     * @return {bounds} A new bounds object
	     */
	    Bounds.create = function(vertices) {
	        var bounds = { 
	            min: { x: 0, y: 0 }, 
	            max: { x: 0, y: 0 }
	        };
	
	        if (vertices)
	            Bounds.update(bounds, vertices);
	        
	        return bounds;
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {bounds} bounds
	     * @param {vertices} vertices
	     * @param {vector} velocity
	     */
	    Bounds.update = function(bounds, vertices, velocity) {
	        bounds.min.x = Number.MAX_VALUE;
	        bounds.max.x = Number.MIN_VALUE;
	        bounds.min.y = Number.MAX_VALUE;
	        bounds.max.y = Number.MIN_VALUE;
	
	        for (var i = 0; i < vertices.length; i++) {
	            var vertex = vertices[i];
	            if (vertex.x > bounds.max.x) bounds.max.x = vertex.x;
	            if (vertex.x < bounds.min.x) bounds.min.x = vertex.x;
	            if (vertex.y > bounds.max.y) bounds.max.y = vertex.y;
	            if (vertex.y < bounds.min.y) bounds.min.y = vertex.y;
	        }
	        
	        if (velocity) {
	            if (velocity.x > 0) {
	                bounds.max.x += velocity.x;
	            } else {
	                bounds.min.x += velocity.x;
	            }
	            
	            if (velocity.y > 0) {
	                bounds.max.y += velocity.y;
	            } else {
	                bounds.min.y += velocity.y;
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method contains
	     * @param {bounds} bounds
	     * @param {vector} point
	     * @return {boolean} True if the bounds contain the point, otherwise false
	     */
	    Bounds.contains = function(bounds, point) {
	        return point.x >= bounds.min.x && point.x <= bounds.max.x 
	               && point.y >= bounds.min.y && point.y <= bounds.max.y;
	    };
	
	    /**
	     * Description
	     * @method overlaps
	     * @param {bounds} boundsA
	     * @param {bounds} boundsB
	     * @return {boolean} True if the bounds overlap, otherwise false
	     */
	    Bounds.overlaps = function(boundsA, boundsB) {
	        return (boundsA.min.x <= boundsB.max.x && boundsA.max.x >= boundsB.min.x
	                && boundsA.max.y >= boundsB.min.y && boundsA.min.y <= boundsB.max.y);
	    };
	
	    /**
	     * Translates the bounds by the given vector
	     * @method translate
	     * @param {bounds} bounds
	     * @param {vector} vector
	     */
	    Bounds.translate = function(bounds, vector) {
	        bounds.min.x += vector.x;
	        bounds.max.x += vector.x;
	        bounds.min.y += vector.y;
	        bounds.max.y += vector.y;
	    };
	
	    /**
	     * Shifts the bounds to the given position
	     * @method shift
	     * @param {bounds} bounds
	     * @param {vector} position
	     */
	    Bounds.shift = function(bounds, position) {
	        var deltaX = bounds.max.x - bounds.min.x,
	            deltaY = bounds.max.y - bounds.min.y;
	            
	        bounds.min.x = position.x;
	        bounds.max.x = position.x + deltaX;
	        bounds.min.y = position.y;
	        bounds.max.y = position.y + deltaY;
	    };
	    
	})();
	
	;   // End src/geometry/Bounds.js
	
	
	// Begin src/geometry/Vector.js
	
	/**
	* The `Matter.Vector` module contains methods for creating and manipulating vectors.
	* Vectors are the basis of all the geometry related operations in the engine.
	* A `Matter.Vector` object is of the form `{ x: 0, y: 0 }`.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Vector
	*/
	
	// TODO: consider params for reusing vector objects
	
	var Vector = {};
	
	(function() {
	
	    /**
	     * Returns a new vector with `x` and `y` copied from the given `vector`.
	     * @method clone
	     * @param {vector} vector
	     * @return {vector} A new cloned vector
	     */
	    Vector.clone = function(vector) {
	        return { x: vector.x, y: vector.y };
	    };
	
	    /**
	     * Returns the magnitude (length) of a vector.
	     * @method magnitude
	     * @param {vector} vector
	     * @return {number} The magnitude of the vector
	     */
	    Vector.magnitude = function(vector) {
	        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
	    };
	
	    /**
	     * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
	     * @method magnitudeSquared
	     * @param {vector} vector
	     * @return {number} The squared magnitude of the vector
	     */
	    Vector.magnitudeSquared = function(vector) {
	        return (vector.x * vector.x) + (vector.y * vector.y);
	    };
	
	    /**
	     * Rotates the vector about (0, 0) by specified angle.
	     * @method rotate
	     * @param {vector} vector
	     * @param {number} angle
	     * @return {vector} A new vector rotated about (0, 0)
	     */
	    Vector.rotate = function(vector, angle) {
	        var cos = Math.cos(angle), sin = Math.sin(angle);
	        return {
	            x: vector.x * cos - vector.y * sin,
	            y: vector.x * sin + vector.y * cos
	        };
	    };
	
	    /**
	     * Rotates the vector about a specified point by specified angle.
	     * @method rotateAbout
	     * @param {vector} vector
	     * @param {number} angle
	     * @param {vector} point
	     * @return {vector} A new vector rotated about the point
	     */
	    Vector.rotateAbout = function(vector, angle, point) {
	        var cos = Math.cos(angle), sin = Math.sin(angle);
	        return {
	            x: point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin),
	            y: point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos)
	        };
	    };
	
	    /**
	     * Normalises a vector (such that its magnitude is `1`).
	     * @method normalise
	     * @param {vector} vector
	     * @return {vector} A new vector normalised
	     */
	    Vector.normalise = function(vector) {
	        var magnitude = Vector.magnitude(vector);
	        if (magnitude === 0)
	            return { x: 0, y: 0 };
	        return { x: vector.x / magnitude, y: vector.y / magnitude };
	    };
	
	    /**
	     * Returns the dot-product of two vectors.
	     * @method dot
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @return {number} The dot product of the two vectors
	     */
	    Vector.dot = function(vectorA, vectorB) {
	        return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
	    };
	
	    /**
	     * Returns the cross-product of two vectors.
	     * @method cross
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @return {number} The cross product of the two vectors
	     */
	    Vector.cross = function(vectorA, vectorB) {
	        return (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x);
	    };
	
	    /**
	     * Adds the two vectors.
	     * @method add
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @return {vector} A new vector of vectorA and vectorB added
	     */
	    Vector.add = function(vectorA, vectorB) {
	        return { x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y };
	    };
	
	    /**
	     * Subtracts the two vectors.
	     * @method sub
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @return {vector} A new vector of vectorA and vectorB subtracted
	     */
	    Vector.sub = function(vectorA, vectorB) {
	        return { x: vectorA.x - vectorB.x, y: vectorA.y - vectorB.y };
	    };
	
	    /**
	     * Multiplies a vector and a scalar.
	     * @method mult
	     * @param {vector} vector
	     * @param {number} scalar
	     * @return {vector} A new vector multiplied by scalar
	     */
	    Vector.mult = function(vector, scalar) {
	        return { x: vector.x * scalar, y: vector.y * scalar };
	    };
	
	    /**
	     * Divides a vector and a scalar.
	     * @method div
	     * @param {vector} vector
	     * @param {number} scalar
	     * @return {vector} A new vector divided by scalar
	     */
	    Vector.div = function(vector, scalar) {
	        return { x: vector.x / scalar, y: vector.y / scalar };
	    };
	
	    /**
	     * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
	     * @method perp
	     * @param {vector} vector
	     * @param {bool} [negate=false]
	     * @return {vector} The perpendicular vector
	     */
	    Vector.perp = function(vector, negate) {
	        negate = negate === true ? -1 : 1;
	        return { x: negate * -vector.y, y: negate * vector.x };
	    };
	
	    /**
	     * Negates both components of a vector such that it points in the opposite direction.
	     * @method neg
	     * @param {vector} vector
	     * @return {vector} The negated vector
	     */
	    Vector.neg = function(vector) {
	        return { x: -vector.x, y: -vector.y };
	    };
	
	    /**
	     * Returns the angle in radians between the two vectors relative to the x-axis.
	     * @method angle
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @return {number} The angle in radians
	     */
	    Vector.angle = function(vectorA, vectorB) {
	        return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
	    };
	
	})();
	
	;   // End src/geometry/Vector.js
	
	
	// Begin src/geometry/Vertices.js
	
	/**
	* The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
	* A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
	* A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Vertices
	*/
	
	// TODO: convex decomposition - http://mnbayazit.com/406/bayazit
	
	var Vertices = {};
	
	(function() {
	
	    /**
	     * Creates a new set of `Matter.Body` compatible vertices.
	     * The `points` argument accepts an array of `Matter.Vector` points orientated around the origin `(0, 0)`, for example:
	     *
	     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
	     *
	     * The `Vertices.create` method returns a new array of vertices, which are similar to Matter.Vector objects,
	     * but with some additional references required for efficient collision detection routines.
	     *
	     * Note that the `body` argument is not optional, a `Matter.Body` reference must be provided.
	     *
	     * @method create
	     * @param {vector[]} points
	     * @param {body} body
	     */
	    Vertices.create = function(points, body) {
	        var vertices = [];
	
	        for (var i = 0; i < points.length; i++) {
	            var point = points[i],
	                vertex = {};
	
	            vertex.x = point.x;
	            vertex.y = point.y;
	            vertex.index = i;
	            vertex.body = body;
	
	            vertices.push(vertex);
	        }
	
	        return vertices;
	    };
	
	    /**
	     * Parses a _simple_ SVG-style path into a `Matter.Vertices` object for the given `Matter.Body`.
	     * @method fromPath
	     * @param {string} path
	     * @param {body} body
	     * @return {vertices} vertices
	     */
	    Vertices.fromPath = function(path, body) {
	        var pathPattern = /L\s*([\-\d\.]*)\s*([\-\d\.]*)/ig,
	            points = [];
	
	        path.replace(pathPattern, function(match, x, y) {
	            points.push({ x: parseFloat(x), y: parseFloat(y) });
	        });
	
	        return Vertices.create(points, body);
	    };
	
	    /**
	     * Returns the centre (centroid) of the set of vertices.
	     * @method centre
	     * @param {vertices} vertices
	     * @return {vector} The centre point
	     */
	    Vertices.centre = function(vertices) {
	        var area = Vertices.area(vertices, true),
	            centre = { x: 0, y: 0 },
	            cross,
	            temp,
	            j;
	
	        for (var i = 0; i < vertices.length; i++) {
	            j = (i + 1) % vertices.length;
	            cross = Vector.cross(vertices[i], vertices[j]);
	            temp = Vector.mult(Vector.add(vertices[i], vertices[j]), cross);
	            centre = Vector.add(centre, temp);
	        }
	
	        return Vector.div(centre, 6 * area);
	    };
	
	    /**
	     * Returns the area of the set of vertices.
	     * @method area
	     * @param {vertices} vertices
	     * @param {bool} signed
	     * @return {number} The area
	     */
	    Vertices.area = function(vertices, signed) {
	        var area = 0,
	            j = vertices.length - 1;
	
	        for (var i = 0; i < vertices.length; i++) {
	            area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
	            j = i;
	        }
	
	        if (signed)
	            return area / 2;
	
	        return Math.abs(area) / 2;
	    };
	
	    /**
	     * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
	     * @method inertia
	     * @param {vertices} vertices
	     * @param {number} mass
	     * @return {number} The polygon's moment of inertia
	     */
	    Vertices.inertia = function(vertices, mass) {
	        var numerator = 0,
	            denominator = 0,
	            v = vertices,
	            cross,
	            j;
	
	        // find the polygon's moment of inertia, using second moment of area
	        // http://www.physicsforums.com/showthread.php?t=25293
	        for (var n = 0; n < v.length; n++) {
	            j = (n + 1) % v.length;
	            cross = Math.abs(Vector.cross(v[j], v[n]));
	            numerator += cross * (Vector.dot(v[j], v[j]) + Vector.dot(v[j], v[n]) + Vector.dot(v[n], v[n]));
	            denominator += cross;
	        }
	
	        return (mass / 6) * (numerator / denominator);
	    };
	
	    /**
	     * Translates the set of vertices in-place.
	     * @method translate
	     * @param {vertices} vertices
	     * @param {vector} vector
	     * @param {number} scalar
	     */
	    Vertices.translate = function(vertices, vector, scalar) {
	        var i;
	        if (scalar) {
	            for (i = 0; i < vertices.length; i++) {
	                vertices[i].x += vector.x * scalar;
	                vertices[i].y += vector.y * scalar;
	            }
	        } else {
	            for (i = 0; i < vertices.length; i++) {
	                vertices[i].x += vector.x;
	                vertices[i].y += vector.y;
	            }
	        }
	
	        return vertices;
	    };
	
	    /**
	     * Rotates the set of vertices in-place.
	     * @method rotate
	     * @param {vertices} vertices
	     * @param {number} angle
	     * @param {vector} point
	     */
	    Vertices.rotate = function(vertices, angle, point) {
	        if (angle === 0)
	            return;
	
	        var cos = Math.cos(angle),
	            sin = Math.sin(angle);
	
	        for (var i = 0; i < vertices.length; i++) {
	            var vertice = vertices[i],
	                dx = vertice.x - point.x,
	                dy = vertice.y - point.y;
	                
	            vertice.x = point.x + (dx * cos - dy * sin);
	            vertice.y = point.y + (dx * sin + dy * cos);
	        }
	
	        return vertices;
	    };
	
	    /**
	     * Returns `true` if the `point` is inside the set of `vertices`.
	     * @method contains
	     * @param {vertices} vertices
	     * @param {vector} point
	     * @return {boolean} True if the vertices contains point, otherwise false
	     */
	    Vertices.contains = function(vertices, point) {
	        for (var i = 0; i < vertices.length; i++) {
	            var vertice = vertices[i],
	                nextVertice = vertices[(i + 1) % vertices.length];
	            if ((point.x - vertice.x) * (nextVertice.y - vertice.y) + (point.y - vertice.y) * (vertice.x - nextVertice.x) > 0) {
	                return false;
	            }
	        }
	
	        return true;
	    };
	
	    /**
	     * Scales the vertices from a point (default is centre) in-place.
	     * @method scale
	     * @param {vertices} vertices
	     * @param {number} scaleX
	     * @param {number} scaleY
	     * @param {vector} point
	     */
	    Vertices.scale = function(vertices, scaleX, scaleY, point) {
	        if (scaleX === 1 && scaleY === 1)
	            return vertices;
	
	        point = point || Vertices.centre(vertices);
	
	        var vertex,
	            delta;
	
	        for (var i = 0; i < vertices.length; i++) {
	            vertex = vertices[i];
	            delta = Vector.sub(vertex, point);
	            vertices[i].x = point.x + delta.x * scaleX;
	            vertices[i].y = point.y + delta.y * scaleY;
	        }
	
	        return vertices;
	    };
	
	    /**
	     * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
	     * The radius parameter is a single number or an array to specify the radius for each vertex.
	     * @method chamfer
	     * @param {vertices} vertices
	     * @param {number[]} radius
	     * @param {number} quality
	     * @param {number} qualityMin
	     * @param {number} qualityMax
	     */
	    Vertices.chamfer = function(vertices, radius, quality, qualityMin, qualityMax) {
	        radius = radius || [8];
	
	        if (!radius.length)
	            radius = [radius];
	
	        // quality defaults to -1, which is auto
	        quality = (typeof quality !== 'undefined') ? quality : -1;
	        qualityMin = qualityMin || 2;
	        qualityMax = qualityMax || 14;
	
	        var newVertices = [];
	
	        for (var i = 0; i < vertices.length; i++) {
	            var prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1],
	                vertex = vertices[i],
	                nextVertex = vertices[(i + 1) % vertices.length],
	                currentRadius = radius[i < radius.length ? i : radius.length - 1];
	
	            if (currentRadius === 0) {
	                newVertices.push(vertex);
	                continue;
	            }
	
	            var prevNormal = Vector.normalise({ 
	                x: vertex.y - prevVertex.y, 
	                y: prevVertex.x - vertex.x
	            });
	
	            var nextNormal = Vector.normalise({ 
	                x: nextVertex.y - vertex.y, 
	                y: vertex.x - nextVertex.x
	            });
	
	            var diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2)),
	                radiusVector = Vector.mult(Common.clone(prevNormal), currentRadius),
	                midNormal = Vector.normalise(Vector.mult(Vector.add(prevNormal, nextNormal), 0.5)),
	                scaledVertex = Vector.sub(vertex, Vector.mult(midNormal, diagonalRadius));
	
	            var precision = quality;
	
	            if (quality === -1) {
	                // automatically decide precision
	                precision = Math.pow(currentRadius, 0.32) * 1.75;
	            }
	
	            precision = Common.clamp(precision, qualityMin, qualityMax);
	
	            // use an even value for precision, more likely to reduce axes by using symmetry
	            if (precision % 2 === 1)
	                precision += 1;
	
	            var alpha = Math.acos(Vector.dot(prevNormal, nextNormal)),
	                theta = alpha / precision;
	
	            for (var j = 0; j < precision; j++) {
	                newVertices.push(Vector.add(Vector.rotate(radiusVector, theta * j), scaledVertex));
	            }
	        }
	
	        return newVertices;
	    };
	
	})();
	
	
	;   // End src/geometry/Vertices.js
	
	
	// Begin src/render/Render.js
	
	/**
	* The `Matter.Render` module is the default `render.controller` used by a `Matter.Engine`.
	* This renderer is HTML5 canvas based and supports a number of drawing options including sprites and viewports.
	*
	* It is possible develop a custom renderer module based on `Matter.Render` and pass an instance of it to `Engine.create` via `options.render`.
	* A minimal custom renderer object must define at least three functions: `create`, `clear` and `world` (see `Matter.Render`).
	*
	* See also `Matter.RenderPixi` for an alternate WebGL, scene-graph based renderer.
	*
	* @class Render
	*/
	
	var Render = {};
	
	(function() {
	    
	    /**
	     * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properites section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {object} [options]
	     * @return {render} A new renderer
	     */
	    Render.create = function(options) {
	        var defaults = {
	            controller: Render,
	            element: null,
	            canvas: null,
	            options: {
	                width: 800,
	                height: 600,
	                pixelRatio: 1,
	                background: '#fafafa',
	                wireframeBackground: '#222',
	                hasBounds: false,
	                enabled: true,
	                wireframes: true,
	                showSleeping: true,
	                showDebug: false,
	                showBroadphase: false,
	                showBounds: false,
	                showVelocity: false,
	                showCollisions: false,
	                showAxes: false,
	                showPositions: false,
	                showAngleIndicator: false,
	                showIds: false,
	                showShadows: false
	            }
	        };
	
	        var render = Common.extend(defaults, options);
	
	        render.canvas = render.canvas || _createCanvas(render.options.width, render.options.height);
	        render.context = render.canvas.getContext('2d');
	        render.textures = {};
	
	        render.bounds = render.bounds || { 
	            min: { 
	                x: 0,
	                y: 0
	            }, 
	            max: { 
	                x: render.options.width,
	                y: render.options.height
	            }
	        };
	
	        if (render.options.pixelRatio !== 1) {
	            Render.setPixelRatio(render, render.options.pixelRatio);
	        }
	
	        if (Common.isElement(render.element)) {
	            render.element.appendChild(render.canvas);
	        } else {
	            Common.log('Render.create: options.element was undefined, render.canvas was created but not appended', 'warn');
	        }
	
	        return render;
	    };
	
	    /**
	     * Sets the pixel ratio of the renderer and updates the canvas.
	     * To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`.
	     * @method setPixelRatio
	     * @param {render} render
	     * @param {number} pixelRatio
	     */
	    Render.setPixelRatio = function(render, pixelRatio) {
	        var options = render.options,
	            canvas = render.canvas;
	
	        if (pixelRatio === 'auto') {
	            pixelRatio = _getPixelRatio(canvas);
	        }
	
	        options.pixelRatio = pixelRatio;
	        canvas.setAttribute('data-pixel-ratio', pixelRatio);
	        canvas.width = options.width * pixelRatio;
	        canvas.height = options.height * pixelRatio;
	        canvas.style.width = options.width + 'px';
	        canvas.style.height = options.height + 'px';
	        render.context.scale(pixelRatio, pixelRatio);
	    };
	
	    /**
	     * Renders the given `engine`'s `Matter.World` object.
	     * This is the entry point for all rendering and should be called every time the scene changes.
	     * @method world
	     * @param {engine} engine
	     */
	    Render.world = function(engine) {
	        var render = engine.render,
	            world = engine.world,
	            canvas = render.canvas,
	            context = render.context,
	            options = render.options,
	            allBodies = Composite.allBodies(world),
	            allConstraints = Composite.allConstraints(world),
	            background = options.wireframes ? options.wireframeBackground : options.background,
	            bodies = [],
	            constraints = [],
	            i;
	
	        // apply background if it has changed
	        if (render.currentBackground !== background)
	            _applyBackground(render, background);
	
	        // clear the canvas with a transparent fill, to allow the canvas background to show
	        context.globalCompositeOperation = 'source-in';
	        context.fillStyle = "transparent";
	        context.fillRect(0, 0, canvas.width, canvas.height);
	        context.globalCompositeOperation = 'source-over';
	
	        // handle bounds
	        if (options.hasBounds) {
	            var boundsWidth = render.bounds.max.x - render.bounds.min.x,
	                boundsHeight = render.bounds.max.y - render.bounds.min.y,
	                boundsScaleX = boundsWidth / options.width,
	                boundsScaleY = boundsHeight / options.height;
	
	            // filter out bodies that are not in view
	            for (i = 0; i < allBodies.length; i++) {
	                var body = allBodies[i];
	                if (Bounds.overlaps(body.bounds, render.bounds))
	                    bodies.push(body);
	            }
	
	            // filter out constraints that are not in view
	            for (i = 0; i < allConstraints.length; i++) {
	                var constraint = allConstraints[i],
	                    bodyA = constraint.bodyA,
	                    bodyB = constraint.bodyB,
	                    pointAWorld = constraint.pointA,
	                    pointBWorld = constraint.pointB;
	
	                if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
	                if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);
	
	                if (!pointAWorld || !pointBWorld)
	                    continue;
	
	                if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
	                    constraints.push(constraint);
	            }
	
	            // transform the view
	            context.scale(1 / boundsScaleX, 1 / boundsScaleY);
	            context.translate(-render.bounds.min.x, -render.bounds.min.y);
	        } else {
	            constraints = allConstraints;
	            bodies = allBodies;
	        }
	
	        if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
	            // fully featured rendering of bodies
	            Render.bodies(engine, bodies, context);
	        } else {
	            // optimised method for wireframes only
	            Render.bodyWireframes(engine, bodies, context);
	        }
	
	        if (options.showBounds)
	            Render.bodyBounds(engine, bodies, context);
	
	        if (options.showAxes || options.showAngleIndicator)
	            Render.bodyAxes(engine, bodies, context);
	        
	        if (options.showPositions)
	            Render.bodyPositions(engine, bodies, context);
	
	        if (options.showVelocity)
	            Render.bodyVelocity(engine, bodies, context);
	
	        if (options.showIds)
	            Render.bodyIds(engine, bodies, context);
	
	        if (options.showCollisions)
	            Render.collisions(engine, engine.pairs.list, context);
	
	        Render.constraints(constraints, context);
	
	        if (options.showBroadphase && engine.broadphase.controller === Grid)
	            Render.grid(engine, engine.broadphase, context);
	
	        if (options.showDebug)
	            Render.debug(engine, context);
	
	        if (options.hasBounds) {
	            // revert view transforms
	            context.setTransform(options.pixelRatio, 0, 0, options.pixelRatio, 0, 0);
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method debug
	     * @param {engine} engine
	     * @param {RenderingContext} context
	     */
	    Render.debug = function(engine, context) {
	        var c = context,
	            world = engine.world,
	            render = engine.render,
	            options = render.options,
	            bodies = Composite.allBodies(world),
	            space = "    ";
	
	        if (engine.timing.timestamp - (render.debugTimestamp || 0) >= 500) {
	            var text = "";
	            text += "fps: " + Math.round(engine.timing.fps) + space;
	
	            if (engine.metrics.extended) {
	                text += "delta: " + engine.timing.delta.toFixed(3) + space;
	                text += "correction: " + engine.timing.correction.toFixed(3) + space;
	                text += "bodies: " + bodies.length + space;
	
	                if (engine.broadphase.controller === Grid)
	                    text += "buckets: " + engine.metrics.buckets + space;
	
	                text += "\n";
	
	                text += "collisions: " + engine.metrics.collisions + space;
	                text += "pairs: " + engine.pairs.list.length + space;
	                text += "broad: " + engine.metrics.broadEff + space;
	                text += "mid: " + engine.metrics.midEff + space;
	                text += "narrow: " + engine.metrics.narrowEff + space;
	            }            
	
	            render.debugString = text;
	            render.debugTimestamp = engine.timing.timestamp;
	        }
	
	        if (render.debugString) {
	            c.font = "12px Arial";
	
	            if (options.wireframes) {
	                c.fillStyle = 'rgba(255,255,255,0.5)';
	            } else {
	                c.fillStyle = 'rgba(0,0,0,0.5)';
	            }
	
	            var split = render.debugString.split('\n');
	
	            for (var i = 0; i < split.length; i++) {
	                c.fillText(split[i], 50, 50 + i * 18);
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method constraints
	     * @param {constraint[]} constraints
	     * @param {RenderingContext} context
	     */
	    Render.constraints = function(constraints, context) {
	        var c = context;
	
	        for (var i = 0; i < constraints.length; i++) {
	            var constraint = constraints[i];
	
	            if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
	                continue;
	
	            var bodyA = constraint.bodyA,
	                bodyB = constraint.bodyB;
	
	            if (bodyA) {
	                c.beginPath();
	                c.moveTo(bodyA.position.x + constraint.pointA.x, bodyA.position.y + constraint.pointA.y);
	            } else {
	                c.beginPath();
	                c.moveTo(constraint.pointA.x, constraint.pointA.y);
	            }
	
	            if (bodyB) {
	                c.lineTo(bodyB.position.x + constraint.pointB.x, bodyB.position.y + constraint.pointB.y);
	            } else {
	                c.lineTo(constraint.pointB.x, constraint.pointB.y);
	            }
	
	            c.lineWidth = constraint.render.lineWidth;
	            c.strokeStyle = constraint.render.strokeStyle;
	            c.stroke();
	        }
	    };
	    
	    /**
	     * Description
	     * @private
	     * @method bodyShadows
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyShadows = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render;
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            if (body.circleRadius) {
	                c.beginPath();
	                c.arc(body.position.x, body.position.y, body.circleRadius, 0, 2 * Math.PI);
	                c.closePath();
	            } else {
	                c.beginPath();
	                c.moveTo(body.vertices[0].x, body.vertices[0].y);
	                for (var j = 1; j < body.vertices.length; j++) {
	                    c.lineTo(body.vertices[j].x, body.vertices[j].y);
	                }
	                c.closePath();
	            }
	
	            var distanceX = body.position.x - render.options.width * 0.5,
	                distanceY = body.position.y - render.options.height * 0.2,
	                distance = Math.abs(distanceX) + Math.abs(distanceY);
	
	            c.shadowColor = 'rgba(0,0,0,0.15)';
	            c.shadowOffsetX = 0.05 * distanceX;
	            c.shadowOffsetY = 0.05 * distanceY;
	            c.shadowBlur = 1 + 12 * Math.min(1, distance / 1000);
	
	            c.fill();
	
	            c.shadowColor = null;
	            c.shadowOffsetX = null;
	            c.shadowOffsetY = null;
	            c.shadowBlur = null;
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method bodies
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodies = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render,
	            options = render.options,
	            i;
	
	        for (i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            if (body.render.sprite && body.render.sprite.texture && !options.wireframes) {
	                // body sprite
	                var sprite = body.render.sprite,
	                    texture = _getTexture(render, sprite.texture);
	
	                if (options.showSleeping && body.isSleeping) 
	                    c.globalAlpha = 0.5;
	
	                c.translate(body.position.x, body.position.y); 
	                c.rotate(body.angle);
	
	                c.drawImage(texture, texture.width * -0.5 * sprite.xScale, texture.height * -0.5 * sprite.yScale, 
	                            texture.width * sprite.xScale, texture.height * sprite.yScale);
	
	                // revert translation, hopefully faster than save / restore
	                c.rotate(-body.angle);
	                c.translate(-body.position.x, -body.position.y); 
	
	                if (options.showSleeping && body.isSleeping) 
	                    c.globalAlpha = 1;
	            } else {
	                // body polygon
	                if (body.circleRadius) {
	                    c.beginPath();
	                    c.arc(body.position.x, body.position.y, body.circleRadius, 0, 2 * Math.PI);
	                } else {
	                    c.beginPath();
	                    c.moveTo(body.vertices[0].x, body.vertices[0].y);
	                    for (var j = 1; j < body.vertices.length; j++) {
	                        c.lineTo(body.vertices[j].x, body.vertices[j].y);
	                    }
	                    c.closePath();
	                }
	
	                if (!options.wireframes) {
	                    if (options.showSleeping && body.isSleeping) {
	                        c.fillStyle = Common.shadeColor(body.render.fillStyle, 50);
	                    } else {
	                        c.fillStyle = body.render.fillStyle;
	                    }
	
	                    c.lineWidth = body.render.lineWidth;
	                    c.strokeStyle = body.render.strokeStyle;
	                    c.fill();
	                    c.stroke();
	                } else {
	                    c.lineWidth = 1;
	                    c.strokeStyle = '#bbb';
	                    if (options.showSleeping && body.isSleeping)
	                        c.strokeStyle = 'rgba(255,255,255,0.2)';
	                    c.stroke();
	                }
	            }
	        }
	
	    };
	
	    /**
	     * Optimised method for drawing body wireframes in one pass
	     * @private
	     * @method bodyWireframes
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyWireframes = function(engine, bodies, context) {
	        var c = context,
	            i,
	            j;
	
	        c.beginPath();
	
	        for (i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            c.moveTo(body.vertices[0].x, body.vertices[0].y);
	
	            for (j = 1; j < body.vertices.length; j++) {
	                c.lineTo(body.vertices[j].x, body.vertices[j].y);
	            }
	            
	            c.lineTo(body.vertices[0].x, body.vertices[0].y);
	        }
	
	        c.lineWidth = 1;
	        c.strokeStyle = '#bbb';
	        c.stroke();
	    };
	
	    /**
	     * Draws body bounds
	     * @private
	     * @method bodyBounds
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyBounds = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render,
	            options = render.options;
	
	        c.beginPath();
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.render.visible)
	                c.rect(body.bounds.min.x, body.bounds.min.y, body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y);
	        }
	
	        if (options.wireframes) {
	            c.strokeStyle = 'rgba(255,255,255,0.08)';
	        } else {
	            c.strokeStyle = 'rgba(0,0,0,0.1)';
	        }
	
	        c.lineWidth = 1;
	        c.stroke();
	    };
	
	    /**
	     * Draws body angle indicators and axes
	     * @private
	     * @method bodyAxes
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyAxes = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render,
	            options = render.options,
	            i,
	            j;
	
	        c.beginPath();
	
	        for (i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            if (options.showAxes) {
	                // render all axes
	                for (j = 0; j < body.axes.length; j++) {
	                    var axis = body.axes[j];
	                    c.moveTo(body.position.x, body.position.y);
	                    c.lineTo(body.position.x + axis.x * 20, body.position.y + axis.y * 20);
	                }
	            } else {
	                // render a single axis indicator
	                c.moveTo(body.position.x, body.position.y);
	                c.lineTo((body.vertices[0].x + body.vertices[body.vertices.length-1].x) / 2, 
	                         (body.vertices[0].y + body.vertices[body.vertices.length-1].y) / 2);
	            }
	        }
	
	        if (options.wireframes) {
	            c.strokeStyle = 'indianred';
	        } else {
	            c.strokeStyle = 'rgba(0,0,0,0.3)';
	        }
	
	        c.lineWidth = 1;
	        c.stroke();
	    };
	
	    /**
	     * Draws body positions
	     * @private
	     * @method bodyPositions
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyPositions = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render,
	            options = render.options,
	            body,
	            i;
	
	        c.beginPath();
	
	        // render current positions
	        for (i = 0; i < bodies.length; i++) {
	            body = bodies[i];
	            if (body.render.visible) {
	                c.arc(body.position.x, body.position.y, 3, 0, 2 * Math.PI, false);
	                c.closePath();
	            }
	        }
	
	        if (options.wireframes) {
	            c.fillStyle = 'indianred';
	        } else {
	            c.fillStyle = 'rgba(0,0,0,0.5)';
	        }
	        c.fill();
	
	        c.beginPath();
	
	        // render previous positions
	        for (i = 0; i < bodies.length; i++) {
	            body = bodies[i];
	            if (body.render.visible) {
	                c.arc(body.positionPrev.x, body.positionPrev.y, 2, 0, 2 * Math.PI, false);
	                c.closePath();
	            }
	        }
	
	        c.fillStyle = 'rgba(255,165,0,0.8)';
	        c.fill();
	    };
	
	    /**
	     * Draws body velocity
	     * @private
	     * @method bodyVelocity
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyVelocity = function(engine, bodies, context) {
	        var c = context;
	
	        c.beginPath();
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            c.moveTo(body.position.x, body.position.y);
	            c.lineTo(body.position.x + (body.position.x - body.positionPrev.x) * 2, body.position.y + (body.position.y - body.positionPrev.y) * 2);
	        }
	
	        c.lineWidth = 3;
	        c.strokeStyle = 'cornflowerblue';
	        c.stroke();
	    };
	
	    /**
	     * Draws body ids
	     * @private
	     * @method bodyIds
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyIds = function(engine, bodies, context) {
	        var c = context;
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            c.font = "12px Arial";
	            c.fillStyle = 'rgba(255,255,255,0.5)';
	            c.fillText(body.id, body.position.x + 10, body.position.y - 10);
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method collisions
	     * @param {engine} engine
	     * @param {pair[]} pairs
	     * @param {RenderingContext} context
	     */
	    Render.collisions = function(engine, pairs, context) {
	        var c = context,
	            options = engine.render.options,
	            pair,
	            collision,
	            i,
	            j;
	
	        c.beginPath();
	
	        // render collision positions
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	            collision = pair.collision;
	            for (j = 0; j < pair.activeContacts.length; j++) {
	                var contact = pair.activeContacts[j],
	                    vertex = contact.vertex;
	                c.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5);
	            }
	        }
	
	        if (options.wireframes) {
	            c.fillStyle = 'rgba(255,255,255,0.7)';
	        } else {
	            c.fillStyle = 'orange';
	        }
	        c.fill();
	
	        c.beginPath();
	            
	        // render collision normals
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	            collision = pair.collision;
	
	            if (pair.activeContacts.length > 0) {
	                var normalPosX = pair.activeContacts[0].vertex.x,
	                    normalPosY = pair.activeContacts[0].vertex.y;
	
	                if (pair.activeContacts.length === 2) {
	                    normalPosX = (pair.activeContacts[0].vertex.x + pair.activeContacts[1].vertex.x) / 2;
	                    normalPosY = (pair.activeContacts[0].vertex.y + pair.activeContacts[1].vertex.y) / 2;
	                }
	                
	                c.moveTo(normalPosX - collision.normal.x * 8, normalPosY - collision.normal.y * 8);
	                c.lineTo(normalPosX, normalPosY);
	            }
	        }
	
	        if (options.wireframes) {
	            c.strokeStyle = 'rgba(255,165,0,0.7)';
	        } else {
	            c.strokeStyle = 'orange';
	        }
	
	        c.lineWidth = 1;
	        c.stroke();
	    };
	
	    /**
	     * Description
	     * @private
	     * @method grid
	     * @param {engine} engine
	     * @param {grid} grid
	     * @param {RenderingContext} context
	     */
	    Render.grid = function(engine, grid, context) {
	        var c = context,
	            options = engine.render.options;
	
	        if (options.wireframes) {
	            c.strokeStyle = 'rgba(255,180,0,0.1)';
	        } else {
	            c.strokeStyle = 'rgba(255,180,0,0.5)';
	        }
	
	        c.beginPath();
	
	        var bucketKeys = Common.keys(grid.buckets);
	
	        for (var i = 0; i < bucketKeys.length; i++) {
	            var bucketId = bucketKeys[i];
	
	            if (grid.buckets[bucketId].length < 2)
	                continue;
	
	            var region = bucketId.split(',');
	            c.rect(0.5 + parseInt(region[0], 10) * grid.bucketWidth, 
	                    0.5 + parseInt(region[1], 10) * grid.bucketHeight, 
	                    grid.bucketWidth, 
	                    grid.bucketHeight);
	        }
	
	        c.lineWidth = 1;
	        c.stroke();
	    };
	
	    /**
	     * Description
	     * @private
	     * @method inspector
	     * @param {inspector} inspector
	     * @param {RenderingContext} context
	     */
	    Render.inspector = function(inspector, context) {
	        var engine = inspector.engine,
	            selected = inspector.selected,
	            render = engine.render,
	            options = render.options,
	            bounds;
	
	        if (options.hasBounds) {
	            var boundsWidth = render.bounds.max.x - render.bounds.min.x,
	                boundsHeight = render.bounds.max.y - render.bounds.min.y,
	                boundsScaleX = boundsWidth / render.options.width,
	                boundsScaleY = boundsHeight / render.options.height;
	            
	            context.scale(1 / boundsScaleX, 1 / boundsScaleY);
	            context.translate(-render.bounds.min.x, -render.bounds.min.y);
	        }
	
	        for (var i = 0; i < selected.length; i++) {
	            var item = selected[i].data;
	
	            context.translate(0.5, 0.5);
	            context.lineWidth = 1;
	            context.strokeStyle = 'rgba(255,165,0,0.9)';
	            context.setLineDash([1,2]);
	
	            switch (item.type) {
	
	            case 'body':
	
	                // render body selections
	                bounds = item.bounds;
	                context.beginPath();
	                context.rect(Math.floor(bounds.min.x - 3), Math.floor(bounds.min.y - 3), 
	                             Math.floor(bounds.max.x - bounds.min.x + 6), Math.floor(bounds.max.y - bounds.min.y + 6));
	                context.closePath();
	                context.stroke();
	
	                break;
	
	            case 'constraint':
	
	                // render constraint selections
	                var point = item.pointA;
	                if (item.bodyA)
	                    point = item.pointB;
	                context.beginPath();
	                context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
	                context.closePath();
	                context.stroke();
	
	                break;
	
	            }
	
	            context.setLineDash([0]);
	            context.translate(-0.5, -0.5);
	        }
	
	        // render selection region
	        if (inspector.selectStart !== null) {
	            context.translate(0.5, 0.5);
	            context.lineWidth = 1;
	            context.strokeStyle = 'rgba(255,165,0,0.6)';
	            context.fillStyle = 'rgba(255,165,0,0.1)';
	            bounds = inspector.selectBounds;
	            context.beginPath();
	            context.rect(Math.floor(bounds.min.x), Math.floor(bounds.min.y), 
	                         Math.floor(bounds.max.x - bounds.min.x), Math.floor(bounds.max.y - bounds.min.y));
	            context.closePath();
	            context.stroke();
	            context.fill();
	            context.translate(-0.5, -0.5);
	        }
	
	        if (options.hasBounds)
	            context.setTransform(1, 0, 0, 1, 0, 0);
	    };
	
	    /**
	     * Description
	     * @method _createCanvas
	     * @private
	     * @param {} width
	     * @param {} height
	     * @return canvas
	     */
	    var _createCanvas = function(width, height) {
	        var canvas = document.createElement('canvas');
	        canvas.width = width;
	        canvas.height = height;
	        canvas.oncontextmenu = function() { return false; };
	        canvas.onselectstart = function() { return false; };
	        return canvas;
	    };
	
	    /**
	     * Gets the pixel ratio of the canvas.
	     * @method _getPixelRatio
	     * @private
	     * @param {HTMLElement} canvas
	     * @return {Number} pixel ratio
	     */
	    var _getPixelRatio = function(canvas) {
	        var context = canvas.getContext('2d'),
	            devicePixelRatio = window.devicePixelRatio || 1,
	            backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio
	                                      || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio
	                                      || context.backingStorePixelRatio || 1;
	
	        return devicePixelRatio / backingStorePixelRatio;
	    };
	
	    /**
	     * Gets the requested texture (an Image) via its path
	     * @method _getTexture
	     * @private
	     * @param {render} render
	     * @param {string} imagePath
	     * @return {Image} texture
	     */
	    var _getTexture = function(render, imagePath) {
	        var image = render.textures[imagePath];
	
	        if (image)
	            return image;
	
	        image = render.textures[imagePath] = new Image();
	        image.src = imagePath;
	
	        return image;
	    };
	
	    /**
	     * Applies the background to the canvas using CSS.
	     * @method applyBackground
	     * @private
	     * @param {render} render
	     * @param {string} background
	     */
	    var _applyBackground = function(render, background) {
	        var cssBackground = background;
	
	        if (/(jpg|gif|png)$/.test(background))
	            cssBackground = 'url(' + background + ')';
	
	        render.canvas.style.background = cssBackground;
	        render.canvas.style.backgroundSize = "contain";
	        render.currentBackground = background;
	    };
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * A back-reference to the `Matter.Render` module.
	     *
	     * @property controller
	     * @type render
	     */
	
	    /**
	     * A reference to the element where the canvas is to be inserted (if `render.canvas` has not been specified)
	     *
	     * @property element
	     * @type HTMLElement
	     * @default null
	     */
	
	    /**
	     * The canvas element to render to. If not specified, one will be created if `render.element` has been specified.
	     *
	     * @property canvas
	     * @type HTMLCanvasElement
	     * @default null
	     */
	
	    /**
	     * The configuration options of the renderer.
	     *
	     * @property options
	     * @type {}
	     */
	
	    /**
	     * The target width in pixels of the `render.canvas` to be created.
	     *
	     * @property options.width
	     * @type number
	     * @default 800
	     */
	
	    /**
	     * The target height in pixels of the `render.canvas` to be created.
	     *
	     * @property options.height
	     * @type number
	     * @default 600
	     */
	
	    /**
	     * A flag that specifies if `render.bounds` should be used when rendering.
	     *
	     * @property options.hasBounds
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * A `Bounds` object that specifies the drawing view region. 
	     * Rendering will be automatically transformed and scaled to fit within the canvas size (`render.options.width` and `render.options.height`).
	     * This allows for creating views that can pan or zoom around the scene.
	     * You must also set `render.options.hasBounds` to `true` to enable bounded rendering.
	     *
	     * @property bounds
	     * @type bounds
	     */
	
	    /**
	     * The 2d rendering context from the `render.canvas` element.
	     *
	     * @property context
	     * @type CanvasRenderingContext2D
	     */
	
	    /**
	     * The sprite texture cache.
	     *
	     * @property textures
	     * @type {}
	     */
	
	})();
	
	
	;   // End src/render/Render.js
	
	
	// Begin src/render/RenderPixi.js
	
	/**
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class RenderPixi
	*/
	
	var RenderPixi = {};
	
	(function() {
	    
	    /**
	     * Creates a new Pixi.js WebGL renderer
	     * @method create
	     * @param {object} options
	     * @return {RenderPixi} A new renderer
	     */
	    RenderPixi.create = function(options) {
	        var defaults = {
	            controller: RenderPixi,
	            element: null,
	            canvas: null,
	            options: {
	                width: 800,
	                height: 600,
	                background: '#fafafa',
	                wireframeBackground: '#222',
	                hasBounds: false,
	                enabled: true,
	                wireframes: true,
	                showSleeping: true,
	                showDebug: false,
	                showBroadphase: false,
	                showBounds: false,
	                showVelocity: false,
	                showCollisions: false,
	                showAxes: false,
	                showPositions: false,
	                showAngleIndicator: false,
	                showIds: false,
	                showShadows: false
	            }
	        };
	
	        var render = Common.extend(defaults, options),
	            transparent = !render.options.wireframes && render.options.background === 'transparent';
	
	        // init pixi
	        render.context = new PIXI.WebGLRenderer(render.options.width, render.options.height, render.canvas, transparent, true);
	        render.canvas = render.context.view;
	        render.container = new PIXI.DisplayObjectContainer();
	        render.stage = new PIXI.Stage();
	        render.stage.addChild(render.container);
	        render.bounds = render.bounds || { 
	            min: { 
	                x: 0,
	                y: 0
	            }, 
	            max: { 
	                x: render.options.width,
	                y: render.options.height
	            }
	        };
	
	        // caches
	        render.textures = {};
	        render.sprites = {};
	        render.primitives = {};
	
	        // use a sprite batch for performance
	        render.spriteBatch = new PIXI.SpriteBatch();
	        render.container.addChild(render.spriteBatch);
	
	        // insert canvas
	        if (Common.isElement(render.element)) {
	            render.element.appendChild(render.canvas);
	        } else {
	            Common.log('No "render.element" passed, "render.canvas" was not inserted into document.', 'warn');
	        }
	
	        // prevent menus on canvas
	        render.canvas.oncontextmenu = function() { return false; };
	        render.canvas.onselectstart = function() { return false; };
	
	        return render;
	    };
	
	    /**
	     * Clears the scene graph
	     * @method clear
	     * @param {RenderPixi} render
	     */
	    RenderPixi.clear = function(render) {
	        var container = render.container,
	            spriteBatch = render.spriteBatch;
	
	        // clear stage container
	        while (container.children[0]) { 
	            container.removeChild(container.children[0]); 
	        }
	
	        // clear sprite batch
	        while (spriteBatch.children[0]) { 
	            spriteBatch.removeChild(spriteBatch.children[0]); 
	        }
	
	        var bgSprite = render.sprites['bg-0'];
	
	        // clear caches
	        render.textures = {};
	        render.sprites = {};
	        render.primitives = {};
	
	        // set background sprite
	        render.sprites['bg-0'] = bgSprite;
	        if (bgSprite)
	            spriteBatch.addChildAt(bgSprite, 0);
	
	        // add sprite batch back into container
	        render.container.addChild(render.spriteBatch);
	
	        // reset background state
	        render.currentBackground = null;
	
	        // reset bounds transforms
	        container.scale.set(1, 1);
	        container.position.set(0, 0);
	    };
	
	    /**
	     * Sets the background of the canvas 
	     * @method setBackground
	     * @param {RenderPixi} render
	     * @param {string} background
	     */
	    RenderPixi.setBackground = function(render, background) {
	        if (render.currentBackground !== background) {
	            var isColor = background.indexOf && background.indexOf('#') !== -1,
	                bgSprite = render.sprites['bg-0'];
	
	            if (isColor) {
	                // if solid background color
	                var color = Common.colorToNumber(background);
	                render.stage.setBackgroundColor(color);
	
	                // remove background sprite if existing
	                if (bgSprite)
	                    render.spriteBatch.removeChild(bgSprite); 
	            } else {
	                // initialise background sprite if needed
	                if (!bgSprite) {
	                    var texture = _getTexture(render, background);
	
	                    bgSprite = render.sprites['bg-0'] = new PIXI.Sprite(texture);
	                    bgSprite.position.x = 0;
	                    bgSprite.position.y = 0;
	                    render.spriteBatch.addChildAt(bgSprite, 0);
	                }
	            }
	
	            render.currentBackground = background;
	        }
	    };
	
	    /**
	     * Description
	     * @method world
	     * @param {engine} engine
	     */
	    RenderPixi.world = function(engine) {
	        var render = engine.render,
	            world = engine.world,
	            context = render.context,
	            stage = render.stage,
	            container = render.container,
	            options = render.options,
	            bodies = Composite.allBodies(world),
	            allConstraints = Composite.allConstraints(world),
	            constraints = [],
	            i;
	
	        if (options.wireframes) {
	            RenderPixi.setBackground(render, options.wireframeBackground);
	        } else {
	            RenderPixi.setBackground(render, options.background);
	        }
	
	        // handle bounds
	        var boundsWidth = render.bounds.max.x - render.bounds.min.x,
	            boundsHeight = render.bounds.max.y - render.bounds.min.y,
	            boundsScaleX = boundsWidth / render.options.width,
	            boundsScaleY = boundsHeight / render.options.height;
	
	        if (options.hasBounds) {
	            // Hide bodies that are not in view
	            for (i = 0; i < bodies.length; i++) {
	                var body = bodies[i];
	                body.render.sprite.visible = Bounds.overlaps(body.bounds, render.bounds);
	            }
	
	            // filter out constraints that are not in view
	            for (i = 0; i < allConstraints.length; i++) {
	                var constraint = allConstraints[i],
	                    bodyA = constraint.bodyA,
	                    bodyB = constraint.bodyB,
	                    pointAWorld = constraint.pointA,
	                    pointBWorld = constraint.pointB;
	
	                if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
	                if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);
	
	                if (!pointAWorld || !pointBWorld)
	                    continue;
	
	                if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
	                    constraints.push(constraint);
	            }
	
	            // transform the view
	            container.scale.set(1 / boundsScaleX, 1 / boundsScaleY);
	            container.position.set(-render.bounds.min.x * (1 / boundsScaleX), -render.bounds.min.y * (1 / boundsScaleY));
	        } else {
	            constraints = allConstraints;
	        }
	
	        for (i = 0; i < bodies.length; i++)
	            RenderPixi.body(engine, bodies[i]);
	
	        for (i = 0; i < constraints.length; i++)
	            RenderPixi.constraint(engine, constraints[i]);
	
	        context.render(stage);
	    };
	
	
	    /**
	     * Description
	     * @method constraint
	     * @param {engine} engine
	     * @param {constraint} constraint
	     */
	    RenderPixi.constraint = function(engine, constraint) {
	        var render = engine.render,
	            bodyA = constraint.bodyA,
	            bodyB = constraint.bodyB,
	            pointA = constraint.pointA,
	            pointB = constraint.pointB,
	            container = render.container,
	            constraintRender = constraint.render,
	            primitiveId = 'c-' + constraint.id,
	            primitive = render.primitives[primitiveId];
	
	        // initialise constraint primitive if not existing
	        if (!primitive)
	            primitive = render.primitives[primitiveId] = new PIXI.Graphics();
	
	        // don't render if constraint does not have two end points
	        if (!constraintRender.visible || !constraint.pointA || !constraint.pointB) {
	            primitive.clear();
	            return;
	        }
	
	        // add to scene graph if not already there
	        if (Common.indexOf(container.children, primitive) === -1)
	            container.addChild(primitive);
	
	        // render the constraint on every update, since they can change dynamically
	        primitive.clear();
	        primitive.beginFill(0, 0);
	        primitive.lineStyle(constraintRender.lineWidth, Common.colorToNumber(constraintRender.strokeStyle), 1);
	        
	        if (bodyA) {
	            primitive.moveTo(bodyA.position.x + pointA.x, bodyA.position.y + pointA.y);
	        } else {
	            primitive.moveTo(pointA.x, pointA.y);
	        }
	
	        if (bodyB) {
	            primitive.lineTo(bodyB.position.x + pointB.x, bodyB.position.y + pointB.y);
	        } else {
	            primitive.lineTo(pointB.x, pointB.y);
	        }
	
	        primitive.endFill();
	    };
	    
	    /**
	     * Description
	     * @method body
	     * @param {engine} engine
	     * @param {body} body
	     */
	    RenderPixi.body = function(engine, body) {
	        var render = engine.render,
	            bodyRender = body.render;
	
	        if (!bodyRender.visible)
	            return;
	
	        if (bodyRender.sprite && bodyRender.sprite.texture) {
	            var spriteId = 'b-' + body.id,
	                sprite = render.sprites[spriteId],
	                spriteBatch = render.spriteBatch;
	
	            // initialise body sprite if not existing
	            if (!sprite)
	                sprite = render.sprites[spriteId] = _createBodySprite(render, body);
	
	            // add to scene graph if not already there
	            if (Common.indexOf(spriteBatch.children, sprite) === -1)
	                spriteBatch.addChild(sprite);
	
	            // update body sprite
	            sprite.position.x = body.position.x;
	            sprite.position.y = body.position.y;
	            sprite.rotation = body.angle;
	            sprite.scale.x = bodyRender.sprite.xScale || 1;
	            sprite.scale.y = bodyRender.sprite.yScale || 1;
	        } else {
	            var primitiveId = 'b-' + body.id,
	                primitive = render.primitives[primitiveId],
	                container = render.container;
	
	            // initialise body primitive if not existing
	            if (!primitive) {
	                primitive = render.primitives[primitiveId] = _createBodyPrimitive(render, body);
	                primitive.initialAngle = body.angle;
	            }
	
	            // add to scene graph if not already there
	            if (Common.indexOf(container.children, primitive) === -1)
	                container.addChild(primitive);
	
	            // update body primitive
	            primitive.position.x = body.position.x;
	            primitive.position.y = body.position.y;
	            primitive.rotation = body.angle - primitive.initialAngle;
	        }
	    };
	
	    /**
	     * Creates a body sprite
	     * @method _createBodySprite
	     * @private
	     * @param {RenderPixi} render
	     * @param {body} body
	     * @return {PIXI.Sprite} sprite
	     */
	    var _createBodySprite = function(render, body) {
	        var bodyRender = body.render,
	            texturePath = bodyRender.sprite.texture,
	            texture = _getTexture(render, texturePath),
	            sprite = new PIXI.Sprite(texture);
	
	        sprite.anchor.x = 0.5;
	        sprite.anchor.y = 0.5;
	
	        return sprite;
	    };
	
	    /**
	     * Creates a body primitive
	     * @method _createBodyPrimitive
	     * @private
	     * @param {RenderPixi} render
	     * @param {body} body
	     * @return {PIXI.Graphics} graphics
	     */
	    var _createBodyPrimitive = function(render, body) {
	        var bodyRender = body.render,
	            options = render.options,
	            primitive = new PIXI.Graphics();
	
	        primitive.clear();
	
	        if (!options.wireframes) {
	            primitive.beginFill(Common.colorToNumber(bodyRender.fillStyle), 1);
	            primitive.lineStyle(body.render.lineWidth, Common.colorToNumber(bodyRender.strokeStyle), 1);
	        } else {
	            primitive.beginFill(0, 0);
	            primitive.lineStyle(1, Common.colorToNumber('#bbb'), 1);
	        }
	
	        primitive.moveTo(body.vertices[0].x - body.position.x, body.vertices[0].y - body.position.y);
	
	        for (var j = 1; j < body.vertices.length; j++) {
	            primitive.lineTo(body.vertices[j].x - body.position.x, body.vertices[j].y - body.position.y);
	        }
	
	        primitive.lineTo(body.vertices[0].x - body.position.x, body.vertices[0].y - body.position.y);
	
	        primitive.endFill();
	
	        // angle indicator
	        if (options.showAngleIndicator || options.showAxes) {
	            primitive.beginFill(0, 0);
	
	            if (options.wireframes) {
	                primitive.lineStyle(1, Common.colorToNumber('#CD5C5C'), 1);
	            } else {
	                primitive.lineStyle(1, Common.colorToNumber(body.render.strokeStyle));
	            }
	
	            primitive.moveTo(0, 0);
	            primitive.lineTo(((body.vertices[0].x + body.vertices[body.vertices.length-1].x) / 2) - body.position.x, 
	                             ((body.vertices[0].y + body.vertices[body.vertices.length-1].y) / 2) - body.position.y);
	
	            primitive.endFill();
	        }
	
	        return primitive;
	    };
	
	    /**
	     * Gets the requested texture (a PIXI.Texture) via its path
	     * @method _getTexture
	     * @private
	     * @param {RenderPixi} render
	     * @param {string} imagePath
	     * @return {PIXI.Texture} texture
	     */
	    var _getTexture = function(render, imagePath) {
	        var texture = render.textures[imagePath];
	
	        if (!texture)
	            texture = render.textures[imagePath] = PIXI.Texture.fromImage(imagePath);
	
	        return texture;
	    };
	
	})();
	
	
	;   // End src/render/RenderPixi.js
	
	
	// aliases
	
	World.add = Composite.add;
	World.remove = Composite.remove;
	World.addComposite = Composite.addComposite;
	World.addBody = Composite.addBody;
	World.addConstraint = Composite.addConstraint;
	World.clear = Composite.clear;
	
	Engine.run = Runner.run;
	
	// exports
	
	Matter.Body = Body;
	Matter.Composite = Composite;
	Matter.World = World;
	Matter.Contact = Contact;
	Matter.Detector = Detector;
	Matter.Grid = Grid;
	Matter.Pairs = Pairs;
	Matter.Pair = Pair;
	Matter.Resolver = Resolver;
	Matter.SAT = SAT;
	Matter.Constraint = Constraint;
	Matter.MouseConstraint = MouseConstraint;
	Matter.Common = Common;
	Matter.Engine = Engine;
	Matter.Metrics = Metrics;
	Matter.Mouse = Mouse;
	Matter.Sleeping = Sleeping;
	Matter.Bodies = Bodies;
	Matter.Composites = Composites;
	Matter.Axes = Axes;
	Matter.Bounds = Bounds;
	Matter.Vector = Vector;
	Matter.Vertices = Vertices;
	Matter.Render = Render;
	Matter.RenderPixi = RenderPixi;
	Matter.Events = Events;
	Matter.Query = Query;
	Matter.Runner = Runner;
	
	// CommonJS module
	if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	        exports = module.exports = Matter;
	    }
	    exports.Matter = Matter;
	}
	
	// AMD module
	if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	        return Matter;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	// browser
	if (typeof window === 'object' && typeof window.document === 'object') {
	    window.Matter = Matter;
	}
	
	// End Matter namespace closure
	
	})();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var baseValues = __webpack_require__(17),
	    keys = __webpack_require__(18);
	
	/**
	 * Creates an array of the own enumerable property values of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property values.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.values(new Foo);
	 * // => [1, 2] (iteration order is not guaranteed)
	 *
	 * _.values('hi');
	 * // => ['h', 'i']
	 */
	function values(object) {
	  return baseValues(object, keys(object));
	}
	
	module.exports = values;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var baseAssign = __webpack_require__(15),
	    createAssigner = __webpack_require__(16);
	
	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it is invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments:
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * @static
	 * @memberOf _
	 * @alias extend
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigning values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	 * // => { 'user': 'fred', 'age': 40 }
	 *
	 * // using a customizer callback
	 * var defaults = _.partialRight(_.assign, function(value, other) {
	 *   return typeof value == 'undefined' ? other : value;
	 * });
	 *
	 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var assign = createAssigner(baseAssign);
	
	module.exports = assign;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var assign = _interopRequire(__webpack_require__(11));
	
	var Entity = _interopRequire(__webpack_require__(5));
	
	var Composite = __webpack_require__(9).Composite;
	
	var World = {};
	
	World.create = function () {
	  var state = arguments[0] === undefined ? {} : arguments[0];
	
	  var world = Entity.create(assign({
	    label: "TIWorld",
	    gravity: { x: 0, y: 1 },
	    bounds: {
	      min: { x: 0, y: 0 },
	      max: { x: 800, y: 600 }
	    }
	  }, state));
	
	  return world;
	};
	
	World.allEntities = function (world) {
	  return Composite.allComposites(world);
	};
	
	module.exports = World;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var _Common = __webpack_require__(19);
	
	var requestAnimFrame = _Common.requestAnimFrame;
	var cancelAnimFrame = _Common.cancelAnimFrame;
	
	var assign = _interopRequire(__webpack_require__(11));
	
	var FPS = 60;
	var DELTA_SAMPLE_SIZE = FPS;
	var DELTA = 1000 / FPS;
	
	var Runner = {};
	
	Runner.create = function (state, tick) {
	  var preTick = arguments[2] === undefined ? function (runner) {
	    return runner;
	  } : arguments[2];
	  return (function () {
	    var counterTimestamp = 0;
	    var frameCounter = 0;
	    var deltaHistory = [];
	    var timePrev = undefined;
	    var timeScalePrev = 1;
	
	    var runner = assign({
	      fps: FPS,
	      timestamp: 0,
	      delta: DELTA,
	      correction: 1,
	      deltaMin: 1000 / FPS,
	      deltaMax: 1000 / (FPS * 0.5),
	      timeScale: 1,
	      isFixed: false,
	      frameRequestId: 0,
	      enabled: true,
	      frameCount: 0
	    }, state);
	
	    function step(time) {
	      var delta = undefined;
	      var correction = 1;
	
	      runner.frameRequestId = requestAnimFrame(step);
	
	      if (!runner.enabled) {
	        return;
	      }
	
	      preTick(runner);
	
	      if (runner.isFixed) {
	        // fixed timestep
	        delta = runner.delta;
	      } else {
	        // dynamic timestep based on wall clock between calls
	        delta = time - timePrev || runner.delta;
	        timePrev = time;
	
	        // optimistically filter delta over a few frames, to improve stability
	        deltaHistory.push(delta);
	        deltaHistory = deltaHistory.slice(-DELTA_SAMPLE_SIZE);
	        delta = Math.min.apply(null, deltaHistory);
	
	        // limit delta
	        delta = delta < runner.deltaMin ? runner.deltaMin : delta;
	        delta = delta > runner.deltaMax ? runner.deltaMax : delta;
	
	        // time correction for delta
	        correction = delta / runner.delta;
	
	        // update engine timing object
	        runner.delta = delta;
	      }
	
	      // time correction for time scaling
	      if (timeScalePrev !== 0) {
	        correction *= runner.timeScale / timeScalePrev;
	      }
	
	      if (runner.timeScale === 0) {
	        correction = 0;
	      }
	
	      timeScalePrev = runner.timeScale;
	
	      // fps counter
	      frameCounter += 1;
	      if (time - counterTimestamp >= 1000) {
	        runner.fps = frameCounter * ((time - counterTimestamp) / 1000);
	        counterTimestamp = time;
	        frameCounter = 0;
	      }
	
	      runner.frameCount += 1;
	
	      tick(delta, correction, runner);
	    }
	
	    runner.frameRequestId = requestAnimFrame(step);
	
	    return runner;
	  })();
	};
	
	Runner.destroy = function (runner) {
	  cancelAnimFrame(runner.frameRequestId);
	};
	
	module.exports = Runner;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var baseCopy = __webpack_require__(26),
	    keys = __webpack_require__(18);
	
	/**
	 * The base implementation of `_.assign` without support for argument juggling,
	 * multiple sources, and `this` binding `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} [customizer] The function to customize assigning values.
	 * @returns {Object} Returns the destination object.
	 */
	function baseAssign(object, source, customizer) {
	  var props = keys(source);
	  if (!customizer) {
	    return baseCopy(source, object, props);
	  }
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index],
	        value = object[key],
	        result = customizer(value, source[key], key, object, source);
	
	    if ((result === result ? (result !== value) : (value === value)) ||
	        (typeof value == 'undefined' && !(key in object))) {
	      object[key] = result;
	    }
	  }
	  return object;
	}
	
	module.exports = baseAssign;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var bindCallback = __webpack_require__(20),
	    isIterateeCall = __webpack_require__(21);
	
	/**
	 * Creates a function that assigns properties of source object(s) to a given
	 * destination object.
	 *
	 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return function() {
	    var args = arguments,
	        length = args.length,
	        object = args[0];
	
	    if (length < 2 || object == null) {
	      return object;
	    }
	    var customizer = args[length - 2],
	        thisArg = args[length - 1],
	        guard = args[3];
	
	    if (length > 3 && typeof customizer == 'function') {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = (length > 2 && typeof thisArg == 'function') ? thisArg : null;
	      length -= (customizer ? 1 : 0);
	    }
	    if (guard && isIterateeCall(args[1], args[2], guard)) {
	      customizer = length == 3 ? null : customizer;
	      length = 2;
	    }
	    var index = 0;
	    while (++index < length) {
	      var source = args[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createAssigner;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.values` and `_.valuesIn` which creates an
	 * array of `object` property values corresponding to the property names
	 * returned by `keysFunc`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the array of property values.
	 */
	function baseValues(object, props) {
	  var index = -1,
	      length = props.length,
	      result = Array(length);
	
	  while (++index < length) {
	    result[index] = object[props[index]];
	  }
	  return result;
	}
	
	module.exports = baseValues;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(22),
	    isNative = __webpack_require__(23),
	    isObject = __webpack_require__(24),
	    shimKeys = __webpack_require__(25);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  if (object) {
	    var Ctor = object.constructor,
	        length = object.length;
	  }
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && (length && isLength(length)))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};
	
	module.exports = keys;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Common = {};
	
	Common.now = function () {
	    // http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
	    // https://gist.github.com/davidwaterston/2982531
	    var perf = window.performance;
	
	    if (perf) {
	        perf.now = perf.now || perf.webkitNow || perf.msNow || perf.oNow || perf.mozNow;
	        return +perf.now();
	    }
	
	    return +new Date();
	};
	
	Common.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) {
	    window.setTimeout(function () {
	        return cb(now());
	    }, DELTA);
	};
	
	Common.cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
	
	module.exports = Common;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(27);
	
	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (typeof thisArg == 'undefined') {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}
	
	module.exports = bindCallback;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var isIndex = __webpack_require__(28),
	    isLength = __webpack_require__(22),
	    isObject = __webpack_require__(24);
	
	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number') {
	    var length = object.length,
	        prereq = isLength(length) && isIndex(index, length);
	  } else {
	    prereq = type == 'string' && index in object;
	  }
	  if (prereq) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var escapeRegExp = __webpack_require__(29),
	    isObjectLike = __webpack_require__(30);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used to detect host constructors (Safari > 5). */
	var reHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reNative = RegExp('^' +
	  escapeRegExp(objToString)
	  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (objToString.call(value) == funcTag) {
	    return reNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reHostCtor.test(value);
	}
	
	module.exports = isNative;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return type == 'function' || (!!value && type == 'object');
	}
	
	module.exports = isObject;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(31),
	    isArray = __webpack_require__(32),
	    isIndex = __webpack_require__(28),
	    isLength = __webpack_require__(22),
	    keysIn = __webpack_require__(33),
	    support = __webpack_require__(34);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;
	
	  var allowIndexes = length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object)));
	
	  var index = -1,
	      result = [];
	
	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = shimKeys;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copies the properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Array} props The property names to copy.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, object, props) {
	  if (!props) {
	    props = object;
	    object = {};
	  }
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}
	
	module.exports = baseCopy;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = +value;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	module.exports = isIndex;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(35);
	
	/**
	 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
	 * In addition to special characters the forward slash is escaped to allow for
	 * easier `eval` use and `Function` compilation.
	 */
	var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	    reHasRegExpChars = RegExp(reRegExpChars.source);
	
	/**
	 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	 */
	function escapeRegExp(string) {
	  string = baseToString(string);
	  return (string && reHasRegExpChars.test(string))
	    ? string.replace(reRegExpChars, '\\$&')
	    : string;
	}
	
	module.exports = escapeRegExp;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(22),
	    isObjectLike = __webpack_require__(30);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  var length = isObjectLike(value) ? value.length : undefined;
	  return isLength(length) && objToString.call(value) == argsTag;
	}
	
	module.exports = isArguments;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(22),
	    isNative = __webpack_require__(23),
	    isObjectLike = __webpack_require__(30);
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};
	
	module.exports = isArray;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(31),
	    isArray = __webpack_require__(32),
	    isIndex = __webpack_require__(28),
	    isLength = __webpack_require__(22),
	    isObject = __webpack_require__(24),
	    support = __webpack_require__(34);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to detect DOM support. */
	var document = (document = global.window) && document.document;
	
	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * An object environment feature flags.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};
	
	(function(x) {
	
	  /**
	   * Detect if functions can be decompiled by `Function#toString`
	   * (all but Firefox OS certified apps, older Opera mobile browsers, and
	   * the PlayStation 3; forced `false` for Windows 8 apps).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcDecomp = /\bthis\b/.test(function() { return this; });
	
	  /**
	   * Detect if `Function#name` is supported (all but IE).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcNames = typeof Function.name == 'string';
	
	  /**
	   * Detect if the DOM is supported.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.dom = document.createDocumentFragment().nodeType === 11;
	  } catch(e) {
	    support.dom = false;
	  }
	
	  /**
	   * Detect if `arguments` object indexes are non-enumerable.
	   *
	   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	   * checks for indexes that exceed their function's formal parameters with
	   * associated values of `0`.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
	  } catch(e) {
	    support.nonEnumArgs = true;
	  }
	}(0, 0));
	
	module.exports = support;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Converts `value` to a string if it is not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  if (typeof value == 'string') {
	    return value;
	  }
	  return value == null ? '' : (value + '');
	}
	
	module.exports = baseToString;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map