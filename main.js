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
                    platform = pltfrm;
                    break;
                }
            }

            return Terrain.images[platform];
        },

        getScale: function(originalValue, currentValue) {
            return ( originalValue > currentValue ? -1 : 1 ) * ( Math.min(originalValue, currentValue) / ( Math.max(originalValue, currentValue) ) );
        }
    };

    var Bike = {
        image: "./assets/images/bikes.png",

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

        getStartPosition: function() {
            return [ Bike.positions[0][0] * bgImage.clientWidth, Bike.positions[0][1] * bgImage.clientHeight ];
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
            TweenMax.to(Bike.container, 0.5, { css: { transform: "scale(" + bgImage.clientHeight / 25083 + ") translate("+ Bike.position[0] +"px, " + Bike.position[1] + "px)" }, onComplete: Bike.setToNormal });
        },

        renderOnStartPosition: function() {
            var startPos = Bike.getStartPosition();
            Bike.position = [startPos[0] - Bike.dimensions.normal.cx, startPos[1] - Bike.dimensions.normal.cy];
            var bike = Bike.container;

            bike.style.background = "url(" + Bike.image + ") " + Bike.rider[Bike.selectedRider].image[Bike.orientation][0] + "px " + Bike.rider[Bike.selectedRider].image[Bike.orientation][1] + "px";
            bike.style.bottom = Bike.position[1] + "px";
            bike.className = "bike";
            bike.style.width = "121px";
            bike.style.height = "188px";
            bike.style.transform = "scale(" + bgImage.clientHeight / 25083 + ")";
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
            "largeDesktop": "./assets/images/race_background_large_desktop.png",
            "desktop": "./assets/images/race_background_desktop.png",
            "mobile": "./assets/images/race_background_mobile.png",
            "tablet": "./assets/images/race_background_tablet.png"
        },

        // easeAnimation: CustomEase.create("custom", "M0,0 C0.017,0 0.034,0.017 0.051,0.018 0.092,0.019 0.168,0.063 0.21,0.05 0.281,0.059 0.297,0.105 0.349,0.124 0.434,0.154 0.498,0.224 0.55,0.248 0.613,0.277 0.617,0.388 0.662,0.416 0.715,0.449 0.745,0.497 0.796,0.544 0.856,0.599 0.936,0.673 1,1"),

        easeAnimation: Power1.easeIn,

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
            TweenMax.to(bgImage, 2, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" } });
        },

        levelUp: function() {
            var yPos = Terrain.position = -(Math.abs(Terrain.position) - Terrain.step);
            Game.level++;
            Bike.orientation = Game.level % 2 === 0 ? "left" : "right"; // TODO: random or according to path
            setTimeout(Bike.sway, 2000);
            if (Game.level === 10) {
                TweenMax.to(bgImage, 4, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" }, onComplete: Game.complete });    
            } else {
                TweenMax.to(bgImage, 4, { ease: Terrain.easeAnimation, css: { transform: "translate(0px, " + yPos + "px)" } });
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

    /** TODO: Remove these lines */
    window.Game = Game;
    window.Bike = Bike;
    window.Terrain = Terrain;

})();