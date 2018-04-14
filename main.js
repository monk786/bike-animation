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

		paths: {
			mobile: [
				{
					delay: 1,
					duration: 2,
					displacement: 0.25,
					direction: "left"
				}, //1
				{
					delay: 1.5,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				},
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				}, //3
				{
					delay: 0.5,
					duration: 2,
					displacement: 0.102,
					direction: "right"
				},
				{ direction: "normal" }, //5
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				},
				{
					delay: 2,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				}, //7
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				},
				{
					delay: 1,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				}, //9
				{ direction: "normal" },
				{ direction: "normal" } //11
			],
			tablet: [
				{ delay: 1, duration: 2, displacement: 0.1, direction: "left" }, //1
				{
					delay: 1.8,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				},
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				}, //3
				{
					delay: 1,
					duration: 2,
					displacement: 0.102,
					direction: "right"
				},
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.05,
					direction: "left"
				}, //5
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				},
				{
					delay: 2,
					duration: 2,
					displacement: 0.005,
					direction: "right"
				}, //7
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				},
				{
					delay: 1.5,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				}, //9
				{ direction: "normal" },
				{ direction: "normal" } //11
			],
			desktop: [
				{
					delay: 0.5,
					duration: 2,
					displacement: 0.1,
					direction: "left"
				}, //1
				{
					delay: 1.8,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				},
				{
					delay: 0.8,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				}, //3
				{
					delay: 1,
					duration: 2,
					displacement: 0.02,
					direction: "right"
				},
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.05,
					direction: "left"
				}, //5
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				},
				{
					delay: 2.5,
					duration: 2,
					displacement: 0.002,
					direction: "right"
				}, //7
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				},
				{
					delay: 1.5,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				}, //9
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.05,
					direction: "left"
				},
				{ direction: "normal" } //11
			],
			largeDesktop: [
				{
					delay: 0.5,
					duration: 2,
					displacement: 0.1,
					direction: "left"
				}, //1
				{
					delay: 1.8,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				},
				{
					delay: 0.8,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				}, //3
				{
					delay: 1,
					duration: 2,
					displacement: 0.02,
					direction: "right"
				},
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.05,
					direction: "left"
				}, //5
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				},
				{
					delay: 2.5,
					duration: 2,
					displacement: 0.002,
					direction: "right"
				}, //7
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.102,
					direction: "left"
				},
				{
					delay: 1.5,
					duration: 2,
					displacement: 0.05,
					direction: "right"
				}, //9
				{
					delay: 1.3,
					duration: 2,
					displacement: 0.05,
					direction: "left"
				},
				{ direction: "normal" } //11
			]
		},

		container: document.createElement("div"),

		selectedRider: 1,

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

			var path = Bike.paths[Game.platform][Game.level - 1];
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

		moveToFinish() {},

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
            setTimeout(Timer.showCountdown, 1000);
		}
	};

	var Timer = {
		time: {
            hours: 0,
            minutes: 0,
            seconds: 0
        },

        currentQuestionTime: 0,

        container: document.querySelector(".timer-counter"),

        timeoutHandle: null,

        showCountdown: function() {
            var timer = Timer.container;
            timer.textContent = 3;

            function change(i) {
                return function() { 
                    timer.textContent = i !== 0 ? ( i !== 1 ? i - 1 : "GO!" ) : "";
                    if ( i === 0 ) {
                        Game.run();
                    } 
                };
            }

            for(var i = 3; i >= 0; i--) {
                var changeFunction = change(i);
                setTimeout(changeFunction, ( 3 - ( i - 1) ) * 1000);
            };
        },
        
        add: function(penalty) {
            var seconds = Timer.time.seconds;
            var minutes = Timer.time.minutes;
            var hours = Timer.time.hours;
            if ( !penalty ) {
                seconds++;
            } else {
                seconds += 15;
            }
            if (seconds >= 60) {
                seconds = seconds % 60;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
            Timer.time = {
                seconds: seconds,
                minutes: minutes,
                hours: hours
            };
            Timer.container.textContent = Timer.getTime();
            if ( Game.status === "pausedForQuestion" ) {
                Timer.timeoutHandle = setTimeout(Timer.add, 1000);
            }
        },

        getTime: function() {
            var seconds = Timer.time.seconds;
            var minutes = Timer.time.minutes;
            var hours = Timer.time.hours;
            return (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
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
        
        restartAttempts: 0,

        status: "countingDown",

		fetchQuestions: function() {
			Data.fetch("/userData").then(
				function(response) {
					Game.userData = response.userInfo.shift();
                    Game.questions = Util.randomize(response.userInfo);
                    Game.selectRider(Game.userData.riderName);
				},
				function(err) {
					Game.error.questions = true;
					/** TODO: Handle error */
				}
			);
		},

		run: function() {
			if (
				!Game.error.questions &&
				!Game.error.terrain &&
				!Game.error.bike
			) {
                Timer.container.textContent = "00:00:00";
                Game.status = "running";
				Game.firstLevel();
			} else {
                if ( Game.restartAttempts < 10 ) {
                    setTimeout(Game.run, 1000);
                } else {
                    /** TODO: Handle errors */
                }
			}
		},

		checkAnswer: function(answer) {
			if (answer) {
				setTimeout(Timer.end, 0);
			} else {
				setTimeout(function() {
					Timer.end();
					Timer.penalty();
				}, 0);
			}
			Game.levelUp();
		},

		showQuestion: function() {
            Game.status = "pausedForQuestion";
			Question.show();
			// setTimeout(Timer.start, 0);
		},

		firstLevel: function() {
			var yPos = -(bgImage.clientHeight - Terrain.step);
			Terrain.position = yPos;
			setTimeout(
				Bike.sway,
				Bike.paths[Game.platform][Game.level].delay * 1000
			);
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
			var path = Bike.paths[Game.platform][Game.level];
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

		selectRider: function(riderName) {
            Bike.selectedRider = riderName === "CS Santosh" ? 0 : 1;
            Bike.render();
		},

		complete: function() {
            var formData = new FormData();
            formData.set("userId", Game.userData.userId);
            formData.set("time", Timer.getTime());
			
			Data.post("/getscoredetails", formData).then(
				function(response) {
                    if ( response !== submit ) {
                        /** TODO: Handle submit error */
                    }
                },
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
					"authToken",
					"Basic SGVyb21vdG9zcG9ydHM6SE1TQDIwMTgh"
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
			.from(".question-content-wrap-bg", 0.5, { height: 0, opacity: 0, onComplete: Timer.add })
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
                        clearTimeout(Timer.timeoutHandle);
                        Game.status = "running";
						Question.hide();
						if (!answer) {
                            Timer.add(true); // first argument of Timer.add() is penalty
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
	};
	bikeAtlas.onerror = function() {
		Game.error.bike = true;
	};
	bikeAtlas.className = "bike";
	bikeAtlas.src = Bike.image;

	Game.fetchQuestions();
	Question.listeners();
})();
