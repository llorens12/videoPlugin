
(function($)
{
    if(!$.LPons)
        $.LPons = {};

    $.LPons.videoPlayer = function(el, getData, options)
    {
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("LPons.videoPlayer", base);
        base.id = "lpons"+Math.floor(Math.random() * 5000);

        base.init = function()
        {
            base.getData = getData;
            base.options = $.extend({},$.LPons.videoPlayer.defaultOptions, options);

            base.$el.attr("id", base.id);
            base.setStructure();
        };

        /**
         * Append video nodes to the dom
         */
        base.setStructure = function()
        {
            base.$el.attr("hidden", true);
            base.addStructure(base.$el,base.nodes);
            base.$el.removeAttr("hidden");
        };


        /**
         * Append nodes at the element
         * @param element: element to append
         * @param nodes: object to append the element
         * @returns void
         */
        base.addStructure = function(element, nodes)
        {
            $.each(nodes, function(index, currentNode)
            {
                var currentElement = $("<"+currentNode.node+"></"+currentNode.node+">");
                if(!$.isEmptyObject(currentNode.attr))
                    currentElement.attr(currentNode.attr);
                if(!$.isEmptyObject(currentNode.text))
                    currentElement.text(currentNode.text);
                if(!$.isEmptyObject(currentNode.subnodes))
                    base.addStructure(currentElement,currentNode.subnodes);
                $(element).append(currentElement);
            });

        };


        /**
         * TIncludes all methods for generate default styles
         * @type object
         */
        base.defaultsStyles = {};

        /**
         * Generate the default style for buttons.
         * @param classbtn: includes the button class
         * @param icon: name class of icon
         * @param description: title of the button
         * @returns {node: string, attr: {type: string, class: string, data-toggle: string, data-placement: string, title: string}, subnodes: []}
         */
        base.defaultsStyles.button = function(classbtn, icon, description)
        {
            return {
                node:"button",
                attr:
                {
                    type: "button",
                    class: "lpons-"+classbtn,
                    "data-toggle": "tooltip",
                    "data-placement": "bottom",
                    title: description

                },
                subnodes:
                [
                    {
                        node: "span",
                        attr:
                        {
                            class: "glyphicon "+icon
                        }
                    }
                ]
            };
        };

        /**
         * Transform buttons array to subnode element
         * @param object: buttons array
         * @returns Array: subnode array
         */
        base.defaultsStyles.buttons = function(object)
        {
            var newObject = [];

            $.each(object, function(index, value)
            {
                newObject.push(base.defaultsStyles.button(value[0],value[1],value[2]));
            });

            return newObject;
        };

        /**
         * Create source nodes
         * @param link: video link
         * @returns {Array}: source nodes
         */
        base.defaultsStyles.getAllSources = function(link)
        {
            var sources = [];
            var simpleUrl = link.substring(0,link.indexOf("."));

            $.each(["mp4", "webm", "ogg"], function(index, typeVideo){
                sources.push(
                {
                    node:"source",
                    attr:
                    {
                        src: simpleUrl+"."+typeVideo,
                        type: "video/"+typeVideo
                    }
                });
            });
            return sources;
        };

        /**
         * Create all node video
         * @param link: video link
         * @returns {{node: string, attr: {class: string}, subnodes: *[]}}
         */
        base.defaultsStyles.getNodeVideo = function(link)
        {
            var sources = base.defaultsStyles.getAllSources(link);
            return {
                node:"video",
                attr:
                {
                    class:"lpons-video"
                },
                subnodes:
                [
                    sources[0],
                    sources[1],
                    sources[2],
                    {
                        node:"p",
                        text:"You can't play this video"
                    }
                ]
            }
        };

        /**
         * Create the progress bar
         * @returns {{node: string, attr: {class: string}, subnodes: *[]}}
         */
        base.defaultsStyles.getProgressBar = function ()
        {
            return {

                node: "div",
                attr:
                {
                    class: "progress lpons-progress"
                },
                subnodes:
                [
                    {
                        node: "div",
                        attr:
                        {
                            class:"progress-bar lpons-progressbar",
                            role: "progressbar",
                            "aria-valuenow": "0",
                            "aria-valuemin": "0",
                            "aria-valuemax": "100",
                            style: "width: 60%;"
                        }
                    }
                ]
            }
        };

        /**
         * Create the left bottom buttons
         * @returns {{node: string, attr: {class: string}, subnodes: Array}}
         */
        base.defaultsStyles.getLeftButtons = function()
        {
            var buttons = {
                node: "div",
                attr:
                {
                    class: "lpons-videoControls-left"
                },
                subnodes: []
            };

            $.each(base.defaultsStyles.buttons(
                [
                    ["play", "glyphicon-play", "Play"],
                    ["stop", "glyphicon-stop", "Stop"],
                    ["mute","glyphicon-volume-up","Mute"]
                ]
            ), function(index, button){
                buttons.subnodes.push(button);
            });

            buttons.subnodes.push(
                {
                    node: "div",
                    attr:
                    {
                        class: "lpons-controls-time"
                    },
                    subnodes:
                    [
                        {
                            node: "div",
                            attr: {
                                class: "lpons-contentTime"
                            },
                            subnodes: [
                                {
                                    node: "span",
                                    attr: {
                                        class: "lpons-videoControls-current-time",
                                        "data-toggle": "tooltip",
                                        "data-placement": "bottom",
                                        title: "Current time"
                                    },
                                    text: "0:00"
                                },
                                {node: "span", text: "/"},
                                {
                                    node: "span",
                                    attr: {
                                        class: "lpons-videoControls-finish-time",
                                        "data-toggle": "tooltip",
                                        "data-placement": "bottom",
                                        title: "Finish Time"
                                    },
                                    text: "15:00"
                                }
                            ]
                        }
                    ]
                });

            return buttons;
        };

        /**
         * Create the right bottom buttons
         * @returns {{node: string, attr: {class: string}, subnodes}}
         */
        base.defaultsStyles.getRightButtons = function()
        {
            return {
                node: "div",
                attr: {
                    class: "lpons-videoControls-right"
                },
                subnodes: (function()
                {
                    return base.defaultsStyles.buttons(
                        [
                            ["full-screen","glyphicon-film","Full Screen"],
                            ["config", "glyphicon-cog", "Configuration"],
                            ["help", "glyphicon-question-sign", "Help"]
                        ]
                    )
                })()
            }
        };

        /**
         * Example of structure:
         *
         * node: ""
         * attr: {}
         * text: ""
         * subnodes: []
         */
        base.nodes =
        [
            base.defaultsStyles.getNodeVideo(base.$el.attr("data-lpvideo")),
            {
                node: "div",
                attr:
                {
                    class: "lpons-content-videoControls"
                },
                subnodes:
                [
                    base.defaultsStyles.getProgressBar(),
                    {
                        node:"div",
                        attr:
                        {
                            class:"lpons-videoControls"
                        },
                        subnodes:
                        [
                            base.defaultsStyles.getLeftButtons(),
                            base.defaultsStyles.getRightButtons()
                        ]
                    }
                ]
            }

        ];

        base.init();
    };


    $.LPons.videoPlayer.defaultOptions =
    {

    };

    $.fn.LPons_videoPlayer = function(getData, options)
    {
        return this.each(function()
            {
                (new $.LPons.videoPlayer(this, getData, options));
            }
        );
    };

    $.fn.getLPons_videoPlayer = function()
    {
        this.data("LPons.videoPlayer");
    };
}
)(jQuery);