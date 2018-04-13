(function() {

    var bgImage = new Image(),
        bikeAtlas = new Image(),
        vh = window.innerHeight;

    var Platform = {
        mobile: window.matchMedia("(max-width: 768px)"),
        tablet: window.matchMedia("(min-width: 768px) and (max-width: 1024px)"),
        desktop: window.matchMedia("(min-width: 1024px) and (max-width: 1440px)"),
        largeDesktop: window.matchMedia("(min-width: 1440px")
    };

    var Util = {
        getBackgroundImage: function() {
            var platform = "desktop";

            for ( var pltfrm in Platform ) {
                if ( Platform[pltfrm].matches ) {
                    Game.platform = platform = pltfrm;
                    break;
                }
            }

            return Terrain.images[platform];
        },

        getScale: function(originalValue, currentValue) {
            return ( originalValue > currentValue ? -1 : 1 ) * ( Math.min(originalValue, currentValue) / ( Math.max(originalValue, currentValue) ) );
        },

        randomize: function(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

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
            mobile: [ 0, 0.0029],
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

        getStartPosition: function() {
            return [ 0, Bike.positions[Game.platform][1] * bgImage.clientHeight ];
        },

        setToNormal: function() {
            var bike = Bike.container;
            Bike.orientation = "normal";

            bike.style.background = "url(" + Bike.image + ") " + Bike.rider[Bike.selectedRider].image[Bike.orientation][0] + "px " + Bike.rider[Bike.selectedRider].image[Bike.orientation][1] + "px";
        },

        sway: function() {
            var bikeContainer = Bike.container;

            bikeContainer.style.background = "url(" + Bike.image + ") " + Bike.rider[Bike.selectedRider].image[Bike.orientation][0] + "px " + Bike.rider[Bike.selectedRider].image[Bike.orientation][1] + "px";
            bikeContainer.style.width = "121px";
            bikeContainer.style.height = "188px";
            Bike.turn();
        },

        turn: function() {
            Bike.position = [ ( Bike.orientation === "left" ? -(0.05 * bgImage.clientWidth) : (0.05 * bgImage.clientWidth) ), 0];
            TweenMax.to(Bike.container, 1.5, { css: { transform: "scale(" + bgImage.clientHeight / 49047 + ") translate("+ Bike.position[0] +"px, " + Bike.position[1] + "px)" }, onComplete: Bike.setToNormal });
        },

        renderOnStartPosition: function() {
            var startPos = Bike.getStartPosition();
            Bike.position = [startPos[0], startPos[1]];
            var bike = Bike.container;

            bike.style.background = "url(" + Bike.image + ") " + Bike.rider[Bike.selectedRider].image[Bike.orientation][0] + "px " + Bike.rider[Bike.selectedRider].image[Bike.orientation][1] + "px";
            bike.style.bottom = Bike.position[1] + "px";
            bike.className = "bike";
            bike.style.width = "121px";
            bike.style.height = "188px";
            bike.style.transform = "scale(" + bgImage.clientHeight / 49047 + ")";
            Game.arena.appendChild(bike);
        },

        render: function() {
            if ( Game.background ) {
                Bike.renderOnStartPosition();
            } else {
                setTimeout(Bike.render, 100);
            }
        },
    };

    var Terrain = {
        images: {
            "largeDesktop": "./assets/images/race_background_large_desktop.jpg",
            "desktop": "./assets/images/race_background_desktop.jpg",
            "mobile": "./assets/images/race_background_mobile.jpg",
            "tablet": "./assets/images/race_background_tablet.jpg"
        },

        easeAnimation: Power1.easeInOut,

        step: 0,

        position: 0,

        scale: 1,

        render: function() {
            
            Game.arena.appendChild(bgImage);

            Terrain.scale = Util.getScale(bgImage.naturalHeight, bgImage.clientHeight);
            Terrain.step = bgImage.clientHeight / 10;

            var startPos = -( bgImage.height - vh );
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
            var elapsedTime =  ( now - Timer.currentQuestionTime ) / 1000;
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
            Data.fetch("/userData").then(function(response) {
                Game.userData = response.userInfo.shift();
                Game.questions = Util.randomize(response.userInfo);
                console.log("Game questions ready");
            }, function(err) {
                Game.error.questions = true;
                console.log("Error while fetching questions");
            })
        },

        run: function() {
            if ( !Game.error.questions && !Game.error.terrain && !Game.error.bike ) {
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
            console.log(Game.questions[Game.level - 1]);
            setTimeout(Timer.start, 0);
        },

        firstLevel: function() {
            var yPos = -(bgImage.clientHeight - Terrain.step);
            Terrain.position = yPos;
            Game.level++;
            TweenMax.to(bgImage, 2, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.showQuestion });
        },

        levelUp: function() {
            var yPos = Terrain.position = -(Math.abs(Terrain.position) - Terrain.step);
            Game.level++;
            Bike.orientation = Game.level % 2 === 0 ? "left" : "right"; // TODO: random or according to path
            setTimeout(Bike.sway, 1000);
            if (Game.level === 10) {
                TweenMax.to(bgImage, 4, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.complete });    
            } else {
                TweenMax.to(bgImage, 4, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.showQuestion });
            }
        },

        /** TODO: Remove keyup listeners */
        listeners: function() {
            document.addEventListener("keyup", function(e) {
                switch(e.which) {
                    case 37: Game.checkAnswer(true); break;
                    case 38: Game.run(); break;
                    case 39: Game.checkAnswer(false); break;
                    case 40: console.log(Timer.time); break;
                }
            });
        },

        selectRider: function(index) {
            Game.selectedRider = index;
        },

        complete: function() {
            var data = { userId: "123ABC", time: Timer.time }; /** TODO: Replace with actual data */
            data = encodeURIComponent(JSON.stringify(data));
            Data.post("/getscoredetails", data).then(function(response) {

            }, function(error) {
                Game.error.submit = true;
                /** TODO: Handle submit error */
            });
        }
    };

    var Data = {
        endpoint: "http://com.22feetlabs.com/heroBikeGame/api",

        fetch: function(url) {
            return new Promise(function( resolve, reject ) {

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
                        }
                        else if (xmlhttp.status == 400) {
                            
                            reject();
                        }
                        else {
                            reject();
                        }
                    }
                };

                xmlhttp.open("GET", Data.endpoint + url, true);
                xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                xmlhttp.setRequestHeader("Access-Control-Allow-Credentials", "true");
                xmlhttp.setRequestHeader("authToken", "Basic SGVyb21vdG9zcG9ydHM6SE1TQDIwMTgh")
                xmlhttp.send();
                
            });
        },

        post: function(url, data) {
            return new Promise(function( resolve, reject ) {

                var xmlhttp = new XMLHttpRequest();

                xmlhttp.onreadystatechange = function() {
                    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        console.log(xmlhttp.responseText);
                    }
                }

                xmlhttp.open("POST", Data.endpoint + url, true);
                xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                xmlhttp.setRequestHeader("Access-Control-Allow-Credentials", "true");
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send(data);

            });
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

    /** TODO: Remove these lines */
    window.Game = Game;
    window.Bike = Bike;
    window.Terrain = Terrain;
    window.Timer = Timer;

})();