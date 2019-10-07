"use strict";
jQuery(function(a) {
    a.fn.vcParticlesBackground = function() {
        var e = a(this),
            i = e.attr("id"),
            r = t(e);
			
        function t(a) {
			var classname = e.attr("data-particles-compatibility-customclass") ? e.attr("data-particles-compatibility-customclass") : ".boomapps_vcrow, .vc_row, .wpb_row";
            return a.parents(classname).eq(0);
        }
				
		var zindex = e.attr("data-particles-compatibility-zindex") ? e.attr("data-particles-compatibility-zindex") : "2";
        r.css("position", "relative"), r.prepend('<div id="' + i + '" class="vc-particles-background-bg" style="top: 0;  position: absolute; left: 0; width: 100%; height: 100%; z-index:' + zindex + ';"></div>'), particlesJS(i, {
            particles: {
                number: {
                    value: e.attr("data-particles-number-value") ? e.attr("data-particles-number-value") : "80",
                    density: {
                        enable: 1,
                        value_area: e.attr("data-particles-density-value") ? e.attr("data-particles-density-value") : "800"
                    }
                },
                color: {
                    value: e.attr("data-particles-color") ? e.attr("data-particles-color") : "#000000"
                },
                shape: {
                    type: e.attr("data-particles-shape-type") ? e.attr("data-particles-shape-type").toLowerCase() : "circle",
                    stroke: {
                        width: e.attr("data-particles-shape-stroke-width") ? e.attr("data-particles-shape-stroke-width") : "0",
                        color: e.attr("data-particles-shape-stroke-color") ? e.attr("data-particles-shape-stroke-color") : "#000000"
                    },
                    polygon: {
                        nb_sides: e.attr("data-particles-shape-polygon-nb-sides") ? e.attr("data-particles-shape-polygon-nb-sides") : "5"
                    },
                    image: {
                        src: e.attr("data-particles-shape-image-src") ? e.attr("data-particles-shape-image-src") : !1,
                        width: e.attr("data-particles-shape-image-width") ? e.attr("data-particles-shape-image-width") : !1,
                        height: e.attr("data-particles-shape-image-height") ? e.attr("data-particles-shape-image-height") : !1
                    }
                },
                opacity: {
                    value: e.attr("data-particles-opacity-value") ? e.attr("data-particles-opacity-value") : "0.5",
                    random: "true" == e.attr("data-particles-opacity-random"),
                    anim: {
                        enable: "true" == e.attr("data-particles-opacity-anim-enable"),
                        speed: e.attr("data-particles-opacity-anim-speed") ? e.attr("data-particles-opacity-anim-speed") : "1",
                        opacity_min: e.attr("data-particles-opacity-anim-opacity-min") ? e.attr("data-particles-opacity-anim-opacity-min") : "0.1",
                        sync: "true" == e.attr("data-particles-opacity-anim-sync")
                    }
                },
                size: {
                    value: e.attr("data-particles-size-value") ? e.attr("data-particles-size-value") : "5",
                    random: "true" == e.attr("data-particles-size-random"),
                    anim: {
                        enable: "true" == e.attr("data-particles-size-anim-enable"),
                        speed: e.attr("data-particles-size-anim-speed") ? e.attr("data-particles-size-anim-speed") : "40",
                        size_min: e.attr("data-particles-size-anim-size-min") ? e.attr("data-particles-size-anim-size-min") : "0.1",
                        sync: "true" == e.attr("data-particles-size-anim-sync")
                    }
                },
                line_linked: {
                    enable: "true" == e.attr("data-particles-line-linked-enable-auto"),
                    distance: e.attr("data-particles-line-linked-distance") ? e.attr("data-particles-line-linked-distance") : "150",
                    color: e.attr("data-particles-line-linked-color") ? e.attr("data-particles-line-linked-color") : "#000000",
                    opacity: e.attr("data-particles-line-linked-opacity") ? e.attr("data-particles-line-linked-opacity") : "0.4",
                    width: e.attr("data-particles-line-linked-width") ? e.attr("data-particles-line-linked-width") : "1"
                },
                move: {
                    enable: "true" == e.attr("data-particles-move-enabled"),
                    speed: e.attr("data-particles-move-speed") ? e.attr("data-particles-move-speed") : "6",
                    direction: e.attr("data-particles-move-direction") ? e.attr("data-particles-move-direction") : "none",
                    random: "true" == e.attr("data-particles-move-random"),
                    straight: "true" == e.attr("data-particles-move-straight"),
                    out_mode: e.attr("data-particles-move-out-mode") ? e.attr("data-particles-move-out-mode") : "bounce",
                    attract: {
                        enable: !1,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "window", /*anvas*/
                events: {
                    onhover: {
                        enable: "true" == e.attr("data-particles-interactivity-onhover-enable"),
                        mode: e.attr("data-particles-interactivity-onhover-mode") ? e.attr("data-particles-interactivity-onhover-mode") : "grab"
                    },
                    onclick: {
                        enable: !1,
                        mode: "push"
                    },
                    resize: !0
                },
                modes: {
                    grab: {
                        distance: e.attr("data-particles-interactivity-modes-grab-distance") ? e.attr("data-particles-interactivity-modes-grab-distance") : "312",
                        line_linked: {
                            opacity: e.attr("data-particles-interactivity-modes-grab-line-linked-opacity") ? e.attr("data-particles-interactivity-modes-grab-line-linked-opacity") : "0.7"
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: e.attr("data-particles-interactivity-modes-repulse-distance") ? e.attr("data-particles-interactivity-modes-repulse-distance") : "312"
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: !0
        }), e.remove()
    }, a(".vc-particles-background").each(function() {
        a(this).vcParticlesBackground()
    })
});