(function() {
    /**
     * Creates a WURFL object globally, of the structure
     * {
     *      is_mobile: <boolean>,
     *      complete_device_name: <String>,
     *      form_factor: <String>
     * }
     */
    eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('8 7={"6":5,"4":"3 2","1":"0"};',9,9,'Desktop|form_factor|Chrome|Google|complete_device_name|false|is_mobile|WURFL|var'.split('|'),0,{}))

    var bgImage = new Image(),
        bikeAtlas = new Image(),
        startPos = 0,
        vw = "100%",
        vh = window.innerHeight,
        bgImageSrc = "",
        terrain = document.getElementById("game");

    var Util = {
        getBackgroundImage: function() {
            var platform = WURFL.form_factor.toLowerCase();
            
            return Terrain.images[platform];
        },

        getScale: function(originalValue, currentValue) {
            return ( originalValue > currentValue ? -1 : 1 ) * ( Math.min(originalValue, currentValue) / ( Math.max(originalValue, currentValue) ) );
        }
    };

    var Bike = {
        image: "./assets/images/bikes.png",

        setStartPosition: function() {
            // return [ Bike.positions[0][0] * bgImage.clientWidth * Math.abs(Terrain.scale), vh - ( Bike.positions[0][1] * bgImage.clientHeight * Math.abs(Terrain.scale) ) ];
            return [ Bike.positions[0][0] * bgImage.clientWidth, vh - ( Bike.positions[0][1] * bgImage.clientHeight ) ];
        },

        position: [0, 0],

        positions: [
            [ 0.47011, 0.00707 ]
        ],

        rider: [
            {
                name: "C S Santhosh",
                image: {
                    normal: [-98, 0],
                    left: [0, 0],
                    right: [-218, 0]
                }
            }
        ],

        container: document.createElement("div"),

        selectedRider: 0,

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

        scaleBike: function() {

        },

        setToNormal: function() {
            var bike = Bike.container;
            Bike.orientation = "normal";

            bike.style.background = "url(" + Bike.image + ") " + Bike.rider[Bike.selectedRider].image[Bike.orientation][0] + "px " + Bike.rider[Bike.selectedRider].image[Bike.orientation][1] + "px";
        },

        sway: function() {
            var bike = Bike.container;

            bike.style.background = "url(" + Bike.image + ") " + Bike.rider[Bike.selectedRider].image[Bike.orientation][0] + "px " + Bike.rider[Bike.selectedRider].image[Bike.orientation][1] + "px";
            bike.style.width = "121px";
            bike.style.height = "188px";
            Bike.turn();
        },

        turn: function() {
            console.log(Bike.position);
            Bike.position = [ ( Bike.orientation === "left" ? Bike.position[0] - (0.05 * bgImage.clientWidth) : Bike.position[0] + (0.05 * bgImage.clientWidth) ), Bike.position[1]];
            console.log(Bike.position);
            TweenMax.to(Bike.container, 0.5, { css: { transform: "translate("+ Bike.position[0] +"px, " + Bike.position[1] + "px)" }, onComplete: Bike.setToNormal });
        },

        firstLevel: function() {
            var startPos = Bike.setStartPosition();
            Bike.position = [startPos[0] - Bike.dimensions.normal.cx, startPos[1] - Bike.dimensions.normal.cy];
            var bike = Bike.container;

            bike.style.background = "url(" + Bike.image + ") " + Bike.rider[Bike.selectedRider].image[Bike.orientation][0] + "px " + Bike.rider[Bike.selectedRider].image[Bike.orientation][1] + "px";
            bike.style.transform = "translate("+ Bike.position[0] +"px, " + Bike.position[1] + "px)";
            bike.className = "bike";
            bike.style.width = "121px";
            bike.style.height = "188px";
            Game.arena.appendChild(bike);
        },

        render: function() {
            if ( Game.background ) {
                Bike.firstLevel();
            } else {
                setTimeout(Bike.render, 100);
            }
        },
    };

    var Terrain = {
        images: {
            "desktop": "./assets/images/race_background_desktop.png",
            "mobile": "./assets/images/race_background_mobile.png",
            "smartphone": "./assets/images/race_background_tablet.png"
        },

        // easeAnimation: CustomEase.create("custom", "M0,0,C0.266,0.412,0.453,0.831,0.582,0.952,0.626,0.993,0.78,1,1,1"),

        step: 0,

        position: 0,

        scale: 1,

        render: function() {
            
            Game.arena.appendChild(bgImage);

            Terrain.scale = Util.getScale(bgImage.naturalHeight, bgImage.clientHeight);
            Terrain.step = bgImage.clientHeight / 10;

            startPos = -( bgImage.height - vh );
            Terrain.position = startPos;
            bgImage.style.transform = "translate(0px, " + startPos + "px)";
            setTimeout(Game.run, 2000);
        }
    };

    var Game = {
        rider: "",

        arena: document.getElementById("game"),

        background: false,

        bike: false,

        level: 0,

        render: function() {
            
        },

        run: function() {
            Game.firstLevel();    
        },

        firstLevel: function() {
            var yPos = -(bgImage.clientHeight - Terrain.step);
            Terrain.position = yPos;
            Game.level++;
            TweenMax.to(bgImage, 2, { ease: Power4.easeOut, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.levelUp });
        },

        levelUp: function() {
            var yPos = Terrain.position = -(Math.abs(Terrain.position) - Terrain.step);
            Game.level++;
            Bike.orientation = Game.level % 2 === 0 ? "left" : "right"; // TODO: random or according to path
            Bike.sway();
            if (Game.level === 10) {
                TweenMax.to(bgImage, 4, { ease: Power4.easeOut, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.complete });    
            } else {
                TweenMax.to(bgImage, 4, { ease: Power4.easeOut, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.levelUp });
            }
        },

        complete: function() {
            console.log("done");
        }
    };

    bgImage.onload = function() {
        Game.background = true;
        Terrain.render();
    };
    bgImage.src = Util.getBackgroundImage();
    bgImage.className = "terrain";

    bikeAtlas.onload = function() {
        Game.bike = true;
        Bike.render();
    };
    bikeAtlas.className = "bike";
    bikeAtlas.src = Bike.image;

})();