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
            return originalValue > currentValue ? -(originalValue/currentValue) : currentValue/originalValue;
        }
    };

    var Bike = {
        image: "./assets/images/bikes.png",

        setStartPosition: function() {
            return [ Bike.positions[0][0] * bgImage.clientWidth * Terrain.scale, vh - ( Bike.positions[0][1] * bgImage.clientHeight * Terrain.scale ) ];
        },

        positions: [
            [ 0.3985, 0.0079 ]
        ],

        /** TODO: set dimensions using a bike in the atlas sheet */
        dimensions: {
            width: 98,
            height: 219,
            normal: {
                cx: 49,
                cy: 109.5
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

        render: function() {
            if ( Game.background ) {
                var startPos = Bike.setStartPosition();
                bikeAtlas.style.transform = "translate("+ ( startPos[0] - Bike.dimensions.normal.cx ) +"px, " + ( startPos[1] - Bike.dimensions.normal.cy ) + "px)";
                Game.arena.appendChild(bikeAtlas);
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

        scale: 1,

        render: function() {
            
            Game.arena.appendChild(bgImage);

            Terrain.scale = Util.getScale(bgImage.naturalHeight, bgImage.clientHeight);

            startPos = -( bgImage.height - vh );
            bgImage.style.transform = "translate(0px, " + startPos + "px)";
            setTimeout(Game.run, 5000);
        }
    };

    var Game = {
        rider: "",

        arena: document.getElementById("game"),

        background: false,

        bike: false,

        render: function() {
            
        },

        run: function() {
            TweenMax.to(bgImage, 10, { ease: Power4.easeOut, css: { transform: "translate(0px, 0px)" }, onComplete: Game.complete });
        },

        levelUp: function() {

        },

        turnBike: function(direction) {

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