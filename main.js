(function() {
	var bgImage = new Image(),
		bikeAtlas = new Image(),
		vh = window.innerHeight;

	var Platform = {
		mobile: window.matchMedia("(max-width: 768px)"),
		tablet: window.matchMedia("(min-width: 768px) and (max-width: 1024px)"),
		desktop: window.matchMedia(
			"(min-width: 1024px) and (max-width: 1440px)"
		),
		largeDesktop: window.matchMedia("(min-width: 1440px")
	};

	var Util = {
		getBackgroundImage: function() {
			var platform = "desktop";

			for (var pltfrm in Platform) {
				if (Platform[pltfrm].matches) {
					Game.platform = platform = pltfrm;
					break;
				}
			}

			return Terrain.images[platform];
		},

		getScale: function(originalValue, currentValue) {
			return (
				(originalValue > currentValue ? -1 : 1) *
				(Math.min(originalValue, currentValue) /
					Math.max(originalValue, currentValue))
			);
		},

		randomize: function(array) {
			var currentIndex = array.length,
				temporaryValue,
				randomIndex;

			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		}
	};

	var Bike = {
		image: "./assets/images/bikes.png",

		position: [0, 0],

		positions: {
			mobile: [0, 0.0029],
			tablet: [0.47011, 0.0038],
			desktop: [0, 0.0045],
			largeDesktop: [0, 0.0045]
		},

		rider: [
			{
				name: "C S Santhosh",
				image: {
					normal: [-112, 0],
					left: [0, 0],
					right: [-230, 0]
				}
			},
			{
				name: "Oriel Meena",
				image: {
					normal: [-623, 0],
					left: [-517, 0],
					right: [-733, 0]
				}
			}
		],

		paths: [
			{ delay: 1, duration: 2, displacement: 0.25, direction: "left" },
			{ delay: 0.5, duration: 2, displacement: 0.05, direction: "right" },
			{ delay: 1.3, duration: 2, displacement: 0.102, direction: "left" },
			{ delay: 0.5, duration: 2, displacement: 0.102, direction: "right" },
			{ direction: "normal" },
			{ delay: 1.3, duration: 2, displacement: 0.102, direction: "left" },
			{ delay: 0.5, duration: 2, displacement: 0.05, direction: "right" },
			{ direction: "normal" },
			{ delay: 1.3, duration: 2, displacement: 0.102, direction: "left" },
            { direction: "normal" },
            { direction: "normal" }
		],

		container: document.createElement("div"),

		selectedRider: 1,

		/** TODO: set dimensions using a bike in the atlas sheet */
		dimensions: {
			width: 98,
			height: 219,
			normal: {
				cx: 32.5,
				cy: 49
			},
			left: {
				cx: 49,
				cy: 109.5
			},
			right: {
				cx: 49,
				cy: 109.5
			}
		},

		orientation: "normal",

		displacementX: 0,

		getStartPosition: function() {
			return [0, Bike.positions[Game.platform][1] * bgImage.clientHeight];
		},

		setToNormal: function() {
			var bike = Bike.container;
			Bike.orientation = "normal";

			bike.style.background =
				"url(" +
				Bike.image +
				") " +
				Bike.rider[Bike.selectedRider].image[Bike.orientation][0] +
				"px " +
				Bike.rider[Bike.selectedRider].image[Bike.orientation][1] +
				"px";
		},

		sway: function() {
			var bikeContainer = Bike.container;

			var path = Bike.paths[Game.level - 1];
			var direction = path.direction;
			bikeContainer.style.background =
				"url(" +
				Bike.image +
				") " +
				Bike.rider[Bike.selectedRider].image[direction][0] +
				"px " +
				Bike.rider[Bike.selectedRider].image[direction][1] +
				"px";
			bikeContainer.style.width = "121px";
			bikeContainer.style.height = "188px";
			Bike.turn(path.displacement, path.direction);
		},

		turn: function(displacement, direction) {
			console.log(displacement, direction);
			Bike.position = [
				direction === "left"
					? -(displacement * bgImage.clientWidth)
					: displacement * bgImage.clientWidth,
				0
			];
			TweenMax.to(Bike.container, 1.5, {
				css: {
					transform:
						"scale(" +
						bgImage.clientHeight / 49047 +
						") translate(" +
						Bike.position[0] +
						"px, " +
						Bike.position[1] +
						"px)"
				},
				onComplete: Bike.setToNormal
			});
		},

		renderOnStartPosition: function() {
			var startPos = Bike.getStartPosition();
			Bike.position = [startPos[0], startPos[1]];
			var bike = Bike.container;

			bike.style.background =
				"url(" +
				Bike.image +
				") " +
				Bike.rider[Bike.selectedRider].image[Bike.orientation][0] +
				"px " +
				Bike.rider[Bike.selectedRider].image[Bike.orientation][1] +
				"px";
			bike.style.bottom = Bike.position[1] + "px";
			bike.className = "bike";
			bike.style.width = "121px";
			bike.style.height = "188px";
			bike.style.transform =
				"scale(" + bgImage.clientHeight / 49047 + ")";
			if (Game.platform === "mobile") {
				bike.style.left = "38%";
			}
			Game.arena.appendChild(bike);
		},

		render: function() {
			if (Game.background) {
				Bike.renderOnStartPosition();
			} else {
				setTimeout(Bike.render, 100);
			}
		}
	};

	var Terrain = {
		images: {
			largeDesktop: "./assets/images/race_background_large_desktop.jpg",
			desktop: "./assets/images/race_background_desktop.jpg",
			mobile: "./assets/images/race_background_mobile.jpg",
			tablet: "./assets/images/race_background_tablet.jpg"
		},

		easeAnimation: Power1.easeInOut,

		step: 0,

		position: 0,

		scale: 1,

		render: function() {
			Game.arena.appendChild(bgImage);

			Terrain.scale = Util.getScale(
				bgImage.naturalHeight,
				bgImage.clientHeight
			);
			Terrain.step = bgImage.clientHeight / 11;

			var startPos = -(bgImage.height - vh);
			Terrain.position = startPos;
			bgImage.style.transform = "translate(0px, " + startPos + "px)";
		}
	};

	var Timer = {
		time: 0,

		currentQuestionTime: 0,

		start: function() {
			Timer.currentQuestionTime = new Date();
		},

		end: function() {
			var now = new Date();
			var elapsedTime = (now - Timer.currentQuestionTime) / 1000;
			Timer.time += elapsedTime;
		},

		penalty: function() {
			Timer.time += 15;
		},

		reset: function() {
			Timer.time = 0;
		}
	};

	var Game = {
		rider: "",

		userData: {},

		arena: document.getElementById("game"),

		background: false,

		bike: false,

		level: 0,

		questions: [],

		platform: "desktop",

		error: {
			questions: false,
			terrain: false,
			bike: false,
			submit: false
		},

		timer: Timer,

		fetchQuestions: function() {
			Data.fetch("/userData").then(
				function(response) {
					Game.userData = response.userInfo.shift();
					Game.questions = Util.randomize(response.userInfo);
					console.log("Game questions ready");
				},
				function(err) {
					Game.error.questions = true;
					console.log("Error while fetching questions");
				}
			);
		},

		run: function() {
			if (
				!Game.error.questions &&
				!Game.error.terrain &&
				!Game.error.bike
			) {
				Game.firstLevel();
			} else {
				/** TODO: Handle errors */
			}
		},

		checkAnswer: function(answer) {
			if (answer) {
				setTimeout(Timer.end, 0);
			} else {
				setTimeout(Timer.penalty, 0);
			}
			Game.levelUp();
		},

		showQuestion: function() {
			Question.show();
			setTimeout(Timer.start, 0);
		},

		firstLevel: function() {
			var yPos = -(bgImage.clientHeight - Terrain.step);
			Terrain.position = yPos;
			setTimeout(Bike.sway, Bike.paths[Game.level].delay * 1000);
			Game.level++;
			TweenMax.to(bgImage, 3, {
				ease: Terrain.easeAnimation,
				css: { transform: "translate(0px, " + yPos + "px)" },
				onComplete: Game.showQuestion
			});
			// TweenMax.to(bgImage, 3, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.levelUp });
			// TweenMax.to(bgImage, 3, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: function(){} });
		},

		levelUp: function() {
			if (Game.level === 11) {
				return false;
			}
			var yPos = (Terrain.position = -(
				Math.abs(Terrain.position) - Terrain.step
			));
			var path = Bike.paths[Game.level];
			if (path.direction !== "normal") {
				setTimeout(Bike.sway, path.delay * 1000);
			}
			if (Game.level === 10) {
				TweenMax.to(bgImage, 4, {
					ease: Terrain.easeAnimation,
					css: { transform: "translate(0px, " + yPos + "px)" },
					onComplete: Game.complete
				});
			} else {
				TweenMax.to(bgImage, 4, {
					ease: Terrain.easeAnimation,
					css: { transform: "translate(0px, " + yPos + "px)" },
					onComplete: Game.showQuestion
				});
                // TweenMax.to(bgImage, 4, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.levelUp });
                // TweenMax.to(bgImage, 4, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: function() {} });
			}
			Game.level++;
		},

		reset: function() {
			console.log("resetting");
			Terrain.render();
		},

		/** TODO: Remove keyup listeners */
		listeners: function() {
			document.addEventListener("keyup", function(e) {
				switch (e.which) {
					case 37:
						Game.checkAnswer(true);
						break;
					case 38:
						Game.run();
						break;
					case 39:
						Game.checkAnswer(false);
						break;
					case 40:
						console.log(Timer.time);
						break;
					case 82:
						Game.reset();
						break;
				}
			});
		},

		selectRider: function(index) {
			Game.selectedRider = index;
		},

		complete: function() {
            console.log();
			var data = {
				userId: "123ABC",
				time: Timer.time
			}; /** TODO: Replace with actual data */
			data = encodeURIComponent(JSON.stringify(data));
			Data.post("/getscoredetails", data).then(
				function(response) {},
				function(error) {
					Game.error.submit = true;
					/** TODO: Handle submit error */
				}
			);
		}
	};

	var Data = {
		endpoint: "http://com.22feetlabs.com/heroBikeGame/api",

		fetch: function(url) {
			return new Promise(function(resolve, reject) {
				var xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == XMLHttpRequest.DONE) {
						if (xmlhttp.status == 200) {
							try {
								var response = JSON.parse(xmlhttp.responseText);
								resolve(response);
							} catch (err) {
								reject();
							}
						} else if (xmlhttp.status == 400) {
							reject();
						} else {
							reject();
						}
					}
				};

				xmlhttp.open("GET", Data.endpoint + url, true);
				xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
				xmlhttp.setRequestHeader(
					"Access-Control-Allow-Credentials",
					"true"
				);
				xmlhttp.setRequestHeader(
					"authToken",
					"Basic SGVyb21vdG9zcG9ydHM6SE1TQDIwMTgh"
				);
				xmlhttp.send();
			});
		},

		post: function(url, data) {
			return new Promise(function(resolve, reject) {
				var xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						console.log(xmlhttp.responseText);
					}
				};

				xmlhttp.open("POST", Data.endpoint + url, true);
				xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
				xmlhttp.setRequestHeader(
					"Access-Control-Allow-Credentials",
					"true"
				);
				xmlhttp.setRequestHeader(
					"Content-type",
					"application/x-www-form-urlencoded"
				);
				xmlhttp.send(data);
			});
		}
	};

	var Question = {
		currentQuestion: "",

		questionNumberContainer: document.querySelector(".popup-header-wrap"),

		questionContainer: document.querySelector(".question-copy"),

		optionsContainers: {
			a: document.querySelector(".question-options.a"),
			b: document.querySelector(".question-options.b")
		},

		tween: new TimelineLite({ paused: true })
			.to(".question-popup", 0.5, {
				autoAlpha: 1,
				y: "0%",
				opacity: 1,
				display: "block",
				zIndex: 2
			})
			.from(".question-content-wrap", 0.4, { opacity: 0 })
			.from(".question-content-wrap-bg", 0.5, { height: 0, opacity: 0 })
			.from(".question-copy", 0.3, { opacity: 0 })
			.staggerFrom(
				".question-options",
				0.3,
				{ opacity: 0, scale: 0.8 },
				0.2
			),

		show: function() {
			var question = (Question.currentQuestion =
				Game.questions[Game.level - 1]);
			Question.questionNumberContainer.innerHTML =
				"Question " + Game.level;
			Question.questionContainer.innerHTML = question.question;
			Question.optionsContainers.a.innerHTML = question.optionA;
			Question.optionsContainers.b.innerHTML = question.optionB;
			Question.tween.play();
		},

		listeners: function() {
			document
				.querySelectorAll(".question-options")
				.forEach(function(element, index) {
					element.addEventListener("click", function(e) {
						var option = e.target.classList[1]; // the second class name is the option selected
                        var answer = Question.checkAnswer(option);
                        Question.hide();
						if (answer) {
							setTimeout(Timer.end, 0);
						} else {
							setTimeout(Timer.penalty, 0);
						}
						Game.levelUp();
					});
				});
		},

		hide: function() {
			Question.tween.reverse();
		},

		checkAnswer: function(option) {
			var answer =
				Game.userData.riderName === Question.currentQuestion.riderName
					? "a"
					: "b";
			return option === answer;
		}
	};

	bgImage.onload = function() {
		Game.background = true;
		Terrain.render();
	};
	bgImage.onerror = function() {
		Game.error.terrain = true;
	};
	bgImage.src = Util.getBackgroundImage();
	bgImage.className = "terrain";

	bikeAtlas.onload = function() {
		Game.bike = true;
		Bike.render();
	};
	bikeAtlas.onerror = function() {
		Game.error.bike = true;
	};
	bikeAtlas.className = "bike";
	bikeAtlas.src = Bike.image;

	Game.fetchQuestions();
	Game.listeners();
	Question.listeners();

	/** TODO: Remove these lines */
	window.Game = Game;
	window.Bike = Bike;
	window.Terrain = Terrain;
	window.Timer = Timer;
	window.Question = Question;
})();
