/* --- CONTENTS OF ./javascripts/ajaxify.js --- */


var ajaxify = {
    initialised: false,
    axready: false,
    forcehash: false,
    posting: false,
    preloading: false,
    added_initial_click_events: false,
    strip_script: false,
    filter_response: true,
    auto_collect_links: true,
    http_host: window.location.host,
    protocol: window.location.protocol + '//',
    initial_path: '/',
    request_uri: '',
    url: '',
    last_uri: '',
    hash: '',
    page: '',
    is_homepage: 0,
    requests: 0,
    popstates: 0,
    loading_link: 'ajaxify-load',
    default_load_into: '#ajaxify-data',
    ajaxify_class: 'ajaxified',
    target: '',
    filter: '#ajaxify-data',
    homepage: 'home',
    ext: '/',
    selected_class: 'selected',
    selectors: [],
    exclude: [],
    preload: [],
    preloading_urls: [],
    links: [],
    cache: [],
    ready_events: [],
    on_before_ajax_events: [],
    on_after_ajax_events: [],
    on_ajax_click_events: [],
    relcache: [],
    last: {
        'rel': '',
        'href': ''
    },
    current: {},
    setup: function (args) {
        for (var key in args) {
            this[key] = args[key];
        }
    },
    classify: function () {
        document.documentElement.className += ' html-ajaxify';
    },
    start: function () {
        if (!ajaxify_running) {
            this.last_uri = this.make_ajax_url(this.homepage + this.ext);
            ajaxify_running = true;
            if (!this.initialised) {
                this.initialise();
            }
        }
    },
    hash_redirect: function () {
        if (!(history.pushState && !this.forcehash) && !window.location.hash && (window.location != this.protocol + this.http_host + this.initial_path)) {
            var url = window.location;
            url = this.make_hash_url(url);
            window.location = url;
        }
    },
    initialise: function () {
        this.initialise_state_from_url();
        this.initialised = true;
    },
    initialise_state_from_url: function () {
        if (history.pushState && !this.forcehash) {
            url = this.make_ajax_url(window.location);
            this.request_uri = url;
            if (!this.requests) this.last_uri = url;
            ajaxify_running = true;
            window.onpopstate = function (event) {
                if (ajaxify.popstates) {
                    ajaxify.initialise_state_from_url();
                }
                ajaxify.popstates++;
            };
            this.request(url);
        } else if (window.location.hash) {
            var url = window.location.hash;
            this.hash = url;
            url = url.split("#");
            url = url[1];
            url = this.make_ajax_url(url);
            this.request_uri = url;
            ajaxify_running = true;
            this.request(url);
        } else if ((window.location != this.protocol + this.http_host + this.initial_path)) {
            var url = window.location;
            url = this.make_hash_url(url);
            window.location = url;
        } else {
            var url = this.homepage + this.ext;
            url = this.make_hash_url(url);
            window.location = url;
            this.hash = url;
            url = url.split("#");
            url = url[1];
            url = this.make_ajax_url(url);
            this.request_uri = url;
            ajaxify_running = true;
            this.request(url);
        }
    },
    make_hash_url: function (url) {
        url = url.toString();
        url = url.replace(this.protocol, '');
        url = url.replace(this.http_host + this.initial_path, "");
        var parsed_url = (this.initial_path == '/') ? url : url.replace(this.initial_path, '');
        url = '/' + this.initial_path + "/#/" + parsed_url;
        url = url.replace(/\/+/g, '/');
        if (history.pushState && !this.forcehash) {
            url = url.replace('/#/', '/');
        }
        return url;
    },
    make_ajax_url: function (url) {
        url = url.toString();
        url = url.replace(this.protocol + this.http_host + this.initial_path, "");
        var parsed_url = (this.initial_path == '/') ? url : url.replace(this.initial_path, '');
        if (parsed_url == '' || parsed_url == this.initial_path) parsed_url = this.homepage + this.ext;
        url = this.http_host + '/' + this.initial_path + "/" + parsed_url;
        url = url.replace(/\/+/g, '/');
        return this.protocol + url;
    },
    start_timer: function () {
        setInterval(function () {
            if (window.location.hash.split('#')[1] != ajaxify.hash.split('#')[1] && (!ajaxify.posting)) {
                ajaxify.initialise_state_from_url();
            }
        }, 100);
    },
    request: function (url, load_into, absolute) {
        if (!this.posting || (this.posting === true && this.preloading == true)) {
            if (url == this.make_ajax_url(this.homepage + this.ext)) {
                this.is_homepage = 1;
            } else {
                this.is_homepage = 0;
            }
            if (!this.added_initial_click_events) {
                this.add_initial_click_events();
            }
            if (!this.axready) {
                var ajaxify = this;
                this.do_ready(function () {
                    ajaxify.request(url, load_into, absolute)
                });
                var ajaxify = this;
                $(window).load(function () {
                    ajaxify.preload_urls();
                });
                this.start_timer();
            } else {
                this.posting = true;
                var url = this.make_ajax_url(url);
                this.url = url;
                if (!load_into) {
                    var target = jQuery(this.default_load_into);
                } else {
                    var target = jQuery(load_into);
                }
                this.target = target;
                this.do_before_ajax(target);
            }
        }
    },
    on_ajax_click: function () { },
    do_ajax_click: function () { },
    on_before_ajax: function (fn) {
        this.on_before_ajax_events.push(fn);
    },
    do_before_ajax: function (target) {
        var ajaxify = this;
        if (this.on_before_ajax_events.length) {
            for (var i in this.on_before_ajax_events) {
                this.on_before_ajax_events[i](target);
            }
        } else {
            target.fadeOut(function () {
                ajaxify.load_url();
            });
        }
    },
    ready: function (fn) {
        this.ready_events.push(fn);
    },
    do_ready: function (continue_fn) {
        this.axready = true;
        if (this.ready_events.length) {
            for (var i in this.ready_events) {
                this.ready_events[i]();
            }
            continue_fn();
        } else {
            continue_fn();
        }
    },
    on_after_ajax: function (target) {
        var ajaxify = this;
        target.fadeIn(function () {
            ajaxify.on_after_fade_in();
        });
        this.add_new_click_events(target);
    },
    on_after_fade_in: function () { },
    load_url: function (return_data) {
        if (array_key_exists(this.url, this.cache)) {
            var data = this.cache[this.url]
            this.target.html(data);
            this.posting = false;
            this.requests = this.requests + 1;
            this.last_uri = this.url;
            this.on_after_ajax(this.target);
        } else if (this.url != this.last_uri) {
            var ajaxify = this;
            this.post(this.url, function (data) {
                ajaxify.posting = false;
                ajaxify.requests = ajaxify.requests + 1;
                if (!return_data) {
                    ajaxify.target.html(data);
                    ajaxify.on_after_ajax(ajaxify.target);
                    ajaxify.last_uri = this.url;
                } else {
                    return data;
                }
            });
        } else {
            var ajaxify = this;
            this.cache[this.url] = this.target.html();
            ajaxify.posting = false;
            ajaxify.requests = ajaxify.requests + 1;
            ajaxify.last_uri = this.url;
            this.on_after_ajax(this.target);
        }
    },
    post: function (url, callback) {
        var ajaxify = this;
        if (array_key_exists(url, ajaxify.cache)) {
            ajaxify.posting = false;
            callback(ajaxify.cache[url]);
        } else {
            jQuery.post(url, {
                'ajax': 'true'
            }, function (data) {
                if (typeof data != "string") data = '';
                data = ajaxify.strip_script ? data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") : data;
                if (ajaxify.filter_response) {
                    data = jQuery("<div>").append(data).find(ajaxify.filter).html();
                }
                ajaxify.cache[url] = data;
                ajaxify.posting = false;
                callback(data);
            });
        }
    },
    preload: function (selector) {
        var ajaxify = this;
        var abs_host = this.http_host + this.initial_path;
        ajaxify.loaded(selector, function () {
            jQuery(selector).find('a[href^="' + ajaxify.protocol + abs_host + '"], a[href^="' + ajaxify.initial_path + '"]').each(function () {
                ajaxify.preloading_urls.push(ajaxify.make_ajax_url(jQuery(this).attr('href')));
            });
            ajaxify.preload_url();
        });
    },
    preload_urls: function () {
        var ajaxify = this;
        var abs_host = this.http_host + this.initial_path;
        jQuery('a[href^="' + this.protocol + abs_host + '"], a[href^="' + ajaxify.initial_path + '"]').not(ajaxify.default_load_into + ' a').each(function () {
            ajaxify.preloading_urls.push(ajaxify.make_ajax_url(jQuery(this).attr('href')));
        });
        ajaxify.preload_url();
    },
    preload_url: function () {
        if (ajaxify.preloading_urls.length) {
            if (ajaxify.posting == true) {
                setTimeout(function () {
                    ajaxify.preload_url()
                }, 5000);
                return;
            } else {
                ajaxify.preloading = true;
                var url = ajaxify.preloading_urls.shift();
                this.post(url, function () {
                    ajaxify.preloading = false;
                    ajaxify.preload_url()
                });
            }
        }
    },
    add_initial_click_events: function () {
        var ajaxify = this;
        var abs_host = this.http_host + this.initial_path;
        abs_host = abs_host.replace(/\/+/g, '/');
        if (ajaxify.auto_collect_links) {
            jQuery('a[href^="' + this.protocol + abs_host + '"], a[href^="' + ajaxify.initial_path + '"]').each(function () {
                var ignore = false;
                if (ajaxify.exclude.length) {
                    for (var i in ajaxify.exclude) {
                        if (!jQuery(this).not(ajaxify.exclude[i]).length) {
                            ignore = true;
                        }
                    }
                }
                if (!ignore) {
                    jQuery(this).addClass(ajaxify.ajaxify_class);
                    ajaxify.handle_click(jQuery(this));
                }
            });
        }
        for (i in ajaxify.selectors) {
            var this_selector = ajaxify.selectors[i];
            jQuery('' + this_selector).each(function () {
                if (!jQuery(this).hasClass(ajaxify.ajaxify_class)) {
                    jQuery(this).addClass(ajaxify.ajaxify_class);
                    ajaxify.handle_click(jQuery(this));
                }
            });
        }
        ajaxify.added_initial_click_events = true;
    },
    add_new_click_events: function (target) {
        var ajaxify = this;
        var abs_host = this.http_host + this.initial_path;
        abs_host = abs_host.replace(/\/+/g, '/');
        if (ajaxify.auto_collect_links || !ajaxify.selectors.length) {
            target.find('a[href^="' + this.protocol + abs_host + '"], a[href^="' + this.initial_path + '"]').each(function () {
                if (!jQuery(this).hasClass(ajaxify.ajaxify_class)) {
                    var ignore = false;
                    if (ajaxify.exclude.length) {
                        for (var i in ajaxify.exclude) {
                            if (!jQuery(this).not(ajaxify.exclude[i]).length) {
                                ignore = true;
                            }
                        }
                    }
                    if (!ignore) {
                        jQuery(this).addClass(ajaxify.ajaxify_class);
                        ajaxify.handle_click(jQuery(this));
                    }
                }
            });
        }
        for (var i in ajaxify.selectors) {
            var this_selector = ajaxify.selectors[i];
            jQuery('' + this_selector).each(function () {
                if (!jQuery(this).hasClass(ajaxify.ajaxify_class)) {
                    var ignore = false;
                    if (ajaxify.exclude.length) {
                        for (var i in ajaxify.exclude) {
                            if (!jQuery(this).not(ajaxify.exclude[i]).length) {
                                ignore = true;
                            }
                        }
                    }
                    if (!ignore) {
                        jQuery(this).addClass(ajaxify.ajaxify_class);
                        ajaxify.handle_click(jQuery(this));
                    }
                }
            });
        }
    },
    handle_click: function (linkobj) {
        var href = linkobj.attr('href');
        linkobj.click(function (ev) {
            ev.preventDefault();
            ajaxify.handle_link(linkobj);
        });
    },
    handle_link: function (linkobj) {
        linkobj.blur();
        var url = linkobj.attr('href');
        if (typeof (url) != 'undefined' && url != '#') {
            jQuery('.' + ajaxify.selected_class).removeClass(ajaxify.selected_class);
            linkobj.addClass(ajaxify.selected_class);
            if (linkobj.parent('li').length) {
                linkobj.parent('li').addClass(ajaxify.selected_class);
            }
            var top_level = url.replace(ajaxify.protocol + ajaxify.http_host + ajaxify.initial_path, '');
            top_level = top_level.split('/');
            if (top_level[0] == '') {
                top_level = top_level[1];
            } else {
                top_level = top_level[0];
            }
            top_level = ajaxify.initial_path + top_level + ajaxify.ext;
            var top_level_obj = jQuery('a[href="' + top_level + '"]');
            top_level_obj.each(function () {
                jQuery(this).addClass(ajaxify.selected_class);
                if (jQuery(this).parent('li').length) {
                    jQuery(this).parent('li').addClass(ajaxify.selected_class);
                }
            });
            var hash_url = ajaxify.make_hash_url(url);
            var ajax_url = ajaxify.make_ajax_url(url);
            if (history.pushState && !ajaxify.forcehash) {
                history.pushState({}, null, hash_url);
            } else {
                window.location = hash_url;
            }
            ajaxify.hash = hash_url;
            ajaxify.on_ajax_click(linkobj);
            var rel = linkobj.attr('rel');
            ajaxify.relcache[ajax_url] = rel;
            ajaxify.last = ajaxify.current;
            ajaxify.current = {
                'rel': rel,
                'href': ajax_url
            };
            ajaxify.request(ajax_url);
        }
    },
    set_visible_uri: function (url) {
        var hash_url = ajaxify.make_hash_url(url);
        var ajax_url = ajaxify.make_ajax_url(url);
        if (history.pushState) {
            history.pushState({}, null, hash_url);
        } else {
            window.location = hash_url;
        }
        ajaxify.hash = hash_url;
    },
    uri: function () {
        return this.url.replace(this.protocol + this.http_host + this.initial_path, '');
    },
    segments: function () {
        return this.uri().split('/');
    },
    segment: function (n) {
        return this.segments()[n]
    },
    current_links: function () {
        var uri = this.initial_path + this.uri();
        var abs_uri = this.protocol + this.http_host + uri;
        return jQuery('a[href="' + uri + '"], a[href="' + abs_uri + '"]');
    },
    loaded: function (selector, callback) {
        var $this = jQuery(selector),
			$images = $this.find('img').add($this.filter('img')),
			len = $images.length,
			blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

        function triggerCallback() {
            callback.call($this, $images);
        }

        function imgLoaded() {
            if (--len <= 0 && this.src !== blank) {
                setTimeout(triggerCallback);
                $images.unbind('load error', imgLoaded);
            }
        }
        if (!len) {
            triggerCallback();
        }
        $images.bind('load error', imgLoaded).each(function () {
            if (this.complete || this.complete === undefined) {
                var src = this.src;
                this.src = blank;
                this.src = src;
            }
        });
        return $this;
    }
};
if (do_ajaxify || typeof do_ajaxify == "undefined") {
    ajaxify.hash_redirect();
    ajaxify.classify();
}
if (!ajaxify_running) {
    var ajaxify_running = false;
}

function strpos(haystack, needle, offset) {
    var i = (haystack + '').indexOf(needle, (offset ? offset : 0));
    return i === -1 ? false : i;
}

function in_array(needle, haystack, argStrict) {
    var key = '',
		strict = !!argStrict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
    return false;
}

function array_key_exists(key, search) {
    if (!search || (search.constructor !== Array && search.constructor !== Object)) {
        return false;
    }
    return key in search;
}

;

/* --- END CONTENTS OF ./javascripts/ajaxify.js --- */

/* --- CONTENTS OF ./javascripts/loading.js --- */


var loader = '<div id="loader" class="unit-type-title"><p>Loading...</p></div>';

function show_loader() {
    if (!$('#loader').length) $('#main_navigation').append(loader);
}

function hide_loader() {
    $('#loader').fadeOut(function () {
        $('#loader').remove();
    });
}
document.getElementById('main_navigation').innerHTML += loader;

;

/* --- END CONTENTS OF ./javascripts/loading.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.validate.js --- */


(function ($) {
    $.extend($.fn, {
        validate: function (options) {
            if (!this.length) {
                options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
                return;
            }
            var validator = $.data(this[0], 'validator');
            if (validator) {
                return validator;
            }
            this.attr('novalidate', 'novalidate');
            validator = new $.validator(options, this[0]);
            $.data(this[0], 'validator', validator);
            if (validator.settings.onsubmit) {
                var inputsAndButtons = this.find("input, button");
                inputsAndButtons.filter(".cancel").click(function () {
                    validator.cancelSubmit = true;
                });
                if (validator.settings.submitHandler) {
                    inputsAndButtons.filter(":submit").click(function () {
                        validator.submitButton = this;
                    });
                }
                this.submit(function (event) {
                    if (validator.settings.debug) event.preventDefault();

                    function handle() {
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {
                                var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm);
                            if (validator.submitButton) {
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }
            return validator;
        },
        valid: function () {
            if ($(this[0]).is('form')) {
                return this.validate().form();
            } else {
                var valid = true;
                var validator = $(this[0].form).validate();
                this.each(function () {
                    valid &= validator.element(this);
                });
                return valid;
            }
        },
        removeAttrs: function (attributes) {
            var result = {},
				$element = this;
            $.each(attributes.split(/\s/), function (index, value) {
                result[value] = $element.attr(value);
                $element.removeAttr(value);
            });
            return result;
        },
        rules: function (command, argument) {
            var element = this[0];
            if (command) {
                var settings = $.data(element.form, 'validator').settings;
                var staticRules = settings.rules;
                var existingRules = $.validator.staticRules(element);
                switch (command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));
                        staticRules[element.name] = existingRules;
                        if (argument.messages) settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
                        break;
                    case "remove":
                        if (!argument) {
                            delete staticRules[element.name];
                            return existingRules;
                        }
                        var filtered = {};
                        $.each(argument.split(/\s/), function (index, method) {
                            filtered[method] = existingRules[method];
                            delete existingRules[method];
                        });
                        return filtered;
                }
            }
            var data = $.validator.normalizeRules($.extend({}, $.validator.metadataRules(element), $.validator.classRules(element), $.validator.attributeRules(element), $.validator.staticRules(element)), element);
            if (data.required) {
                var param = data.required;
                delete data.required;
                data = $.extend({
                    required: param
                }, data);
            }
            return data;
        }
    });
    $.extend($.expr[":"], {
        blank: function (a) {
            return !$.trim("" + a.value);
        },
        filled: function (a) {
            return !!$.trim("" + a.value);
        },
        unchecked: function (a) {
            return !a.checked;
        }
    });
    $.validator = function (options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };
    $.validator.format = function (source, params) {
        if (arguments.length == 1) return function () {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.validator.format.apply(this, args);
        };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    };
    $.extend($.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            onfocusin: function (element, event) {
                this.lastActive = element;
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    this.addWrapper(this.errorsFor(element)).hide();
                }
            },
            onfocusout: function (element, event) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onkeyup: function (element, event) {
                if (element.name in this.submitted || element == this.lastElement) {
                    this.element(element);
                }
            },
            onclick: function (element, event) {
                if (element.name in this.submitted) this.element(element);
                else if (element.parentNode.name in this.submitted) this.element(element.parentNode);
            },
            highlight: function (element, errorClass, validClass) {
                if (element.type === 'radio') {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function (element, errorClass, validClass) {
                if (element.type === 'radio') {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },
        setDefaults: function (settings) {
            $.extend($.validator.defaults, settings);
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            accept: "Please enter a value with a valid extension.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: false,
        prototype: {
            init: function () {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();
                var groups = (this.groups = {});
                $.each(this.settings.groups, function (key, value) {
                    $.each(value.split(/\s/), function (index, name) {
                        groups[name] = key;
                    });
                });
                var rules = this.settings.rules;
                $.each(rules, function (key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });

                function delegate(event) {
                    var validator = $.data(this[0].form, "validator"),
						eventType = "on" + event.type.replace(/^validate/, "");
                    validator.settings[eventType] && validator.settings[eventType].call(validator, this[0], event);
                }
                $(this.currentForm).validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, " + "[type='number'], [type='search'] ,[type='tel'], [type='url'], " + "[type='email'], [type='datetime'], [type='date'], [type='month'], " + "[type='week'], [type='time'], [type='datetime-local'], " + "[type='range'], [type='color'] ", "focusin focusout keyup", delegate).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);
                if (this.settings.invalidHandler) $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
            },
            form: function () {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid()) $(this.currentForm).triggerHandler("invalid-form", [this]);
                this.showErrors();
                return this.valid();
            },
            checkForm: function () {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()) ; elements[i]; i++) {
                    this.check(elements[i]);
                }
                return this.valid();
            },
            element: function (element) {
                element = this.validationTargetFor(this.clean(element));
                this.lastElement = element;
                this.prepareElement(element);
                this.currentElements = $(element);
                var result = this.check(element);
                if (result) {
                    delete this.invalid[element.name];
                } else {
                    this.invalid[element.name] = true;
                }
                if (!this.numberOfInvalids()) {
                    this.toHide = this.toHide.add(this.containers);
                }
                this.showErrors();
                return result;
            },
            showErrors: function (errors) {
                if (errors) {
                    $.extend(this.errorMap, errors);
                    this.errorList = [];
                    for (var name in errors) {
                        this.errorList.push({
                            message: errors[name],
                            element: this.findByName(name)[0]
                        });
                    }
                    this.successList = $.grep(this.successList, function (element) {
                        return !(element.name in errors);
                    });
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors();
            },
            resetForm: function () {
                if ($.fn.resetForm) $(this.currentForm).resetForm();
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass);
            },
            numberOfInvalids: function () {
                return this.objectLength(this.invalid);
            },
            objectLength: function (obj) {
                var count = 0;
                for (var i in obj)
                    count++;
                return count;
            },
            hideErrors: function () {
                this.addWrapper(this.toHide).hide();
            },
            valid: function () {
                return this.size() == 0;
            },
            size: function () {
                return this.errorList.length;
            },
            focusInvalid: function () {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin");
                    } catch (e) { }
                }
            },
            findLastActive: function () {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function (n) {
                    return n.element.name == lastActive.name;
                }).length == 1 && lastActive;
            },
            elements: function () {
                var validator = this,
					rulesCache = {};
                return $(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () {
                    !this.name && validator.settings.debug && window.console && console.error("%o has no name assigned", this);
                    if (this.name in rulesCache || !validator.objectLength($(this).rules())) return false;
                    rulesCache[this.name] = true;
                    return true;
                });
            },
            clean: function (selector) {
                return $(selector)[0];
            },
            errors: function () {
                return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext);
            },
            reset: function () {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },
            prepareForm: function () {
                this.reset();
                this.toHide = this.errors().add(this.containers);
            },
            prepareElement: function (element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },
            check: function (element) {
                element = this.validationTargetFor(this.clean(element));
                var rules = $(element).rules();
                var dependencyMismatch = false;
                for (var method in rules) {
                    var rule = {
                        method: method,
                        parameters: rules[method]
                    };
                    try {
                        var result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters);
                        if (result == "dependency-mismatch") {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;
                        if (result == "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(element));
                            return;
                        }
                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    } catch (e) {
                        this.settings.debug && window.console && console.log("exception occured when checking element " + element.id + ", check the '" + rule.method + "' method", e);
                        throw e;
                    }
                }
                if (dependencyMismatch) return;
                if (this.objectLength(rules)) this.successList.push(element);
                return true;
            },
            customMetaMessage: function (element, method) {
                if (!$.metadata) return;
                var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();
                return meta && meta.messages && meta.messages[method];
            },
            customMessage: function (name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor == String ? m : m[method]);
            },
            findDefined: function () {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) return arguments[i];
                }
                return undefined;
            },
            defaultMessage: function (element, method) {
                return this.findDefined(this.customMessage(element.name, method), this.customMetaMessage(element, method), !this.settings.ignoreTitle && element.title || undefined, $.validator.messages[method], "<strong>Warning: No message defined for " + element.name + "</strong>");
            },
            formatAndAdd: function (element, rule) {
                var message = this.defaultMessage(element, rule.method),
					theregex = /\$?\{(\d+)\}/g;
                if (typeof message == "function") {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
                }
                this.errorList.push({
                    message: message,
                    element: element
                });
                this.errorMap[element.name] = message;
                this.submitted[element.name] = message;
            },
            addWrapper: function (toToggle) {
                if (this.settings.wrapper) toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                return toToggle;
            },
            defaultShowErrors: function () {
                for (var i = 0; this.errorList[i]; i++) {
                    var error = this.errorList[i];
                    this.settings.highlight && this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }
                if (this.settings.success) {
                    for (var i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (var i = 0, elements = this.validElements() ; elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },
            validElements: function () {
                return this.currentElements.not(this.invalidElements());
            },
            invalidElements: function () {
                return $(this.errorList).map(function () {
                    return this.element;
                });
            },
            showLabel: function (element, message) {
                var label = this.errorsFor(element);
                if (label.length) {
                    label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                    label.attr("generated") && label.html(message);
                } else {
                    label = $("<" + this.settings.errorElement + "/>").attr({
                        "for": this.idOrName(element),
                        generated: true
                    }).addClass(this.settings.errorClass).html(message || "");
                    if (this.settings.wrapper) {
                        label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if (!this.labelContainer.append(label).length) this.settings.errorPlacement ? this.settings.errorPlacement(label, $(element)) : label.insertAfter(element);
                }
                if (!message && this.settings.success) {
                    label.text("");
                    typeof this.settings.success == "string" ? label.addClass(this.settings.success) : this.settings.success(label);
                }
                this.toShow = this.toShow.add(label);
            },
            errorsFor: function (element) {
                var name = this.idOrName(element);
                return this.errors().filter(function () {
                    return $(this).attr('for') == name;
                });
            },
            idOrName: function (element) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },
            validationTargetFor: function (element) {
                if (this.checkable(element)) {
                    element = this.findByName(element.name).not(this.settings.ignore)[0];
                }
                return element;
            },
            checkable: function (element) {
                return /radio|checkbox/i.test(element.type);
            },
            findByName: function (name) {
                var form = this.currentForm;
                return $(document.getElementsByName(name)).map(function (index, element) {
                    return element.form == form && element.name == name && element || null;
                });
            },
            getLength: function (value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case 'select':
                        return $("option:selected", element).length;
                    case 'input':
                        if (this.checkable(element)) return this.findByName(element.name).filter(':checked').length;
                }
                return value.length;
            },
            depend: function (param, element) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
            },
            dependTypes: {
                "boolean": function (param, element) {
                    return param;
                },
                "string": function (param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function (param, element) {
                    return param(element);
                }
            },
            optional: function (element) {
                return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
            },
            startRequest: function (element) {
                if (!this.pending[element.name]) {
                    this.pendingRequest++;
                    this.pending[element.name] = true;
                }
            },
            stopRequest: function (element, valid) {
                this.pendingRequest--;
                if (this.pendingRequest < 0) this.pendingRequest = 0;
                delete this.pending[element.name];
                if (valid && this.pendingRequest == 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },
            previousValue: function (element) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(element, "remote")
                });
            }
        },
        classRuleSettings: {
            required: {
                required: true
            },
            email: {
                email: true
            },
            url: {
                url: true
            },
            date: {
                date: true
            },
            dateISO: {
                dateISO: true
            },
            dateDE: {
                dateDE: true
            },
            number: {
                number: true
            },
            numberDE: {
                numberDE: true
            },
            digits: {
                digits: true
            },
            creditcard: {
                creditcard: true
            }
        },
        addClassRules: function (className, rules) {
            className.constructor == String ? this.classRuleSettings[className] = rules : $.extend(this.classRuleSettings, className);
        },
        classRules: function (element) {
            var rules = {};
            var classes = $(element).attr('class');
            classes && $.each(classes.split(' '), function () {
                if (this in $.validator.classRuleSettings) {
                    $.extend(rules, $.validator.classRuleSettings[this]);
                }
            });
            return rules;
        },
        attributeRules: function (element) {
            var rules = {};
            var $element = $(element);
            for (var method in $.validator.methods) {
                var value;
                if (method === 'required' && typeof $.fn.prop === 'function') {
                    value = $element.prop(method);
                } else {
                    value = $element.attr(method);
                }
                if (value) {
                    rules[method] = value;
                } else if ($element[0].getAttribute("type") === method) {
                    rules[method] = true;
                }
            }
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }
            return rules;
        },
        metadataRules: function (element) {
            if (!$.metadata) return {};
            var meta = $.data(element.form, 'validator').settings.meta;
            return meta ? $(element).metadata()[meta] : $(element).metadata();
        },
        staticRules: function (element) {
            var rules = {};
            var validator = $.data(element.form, 'validator');
            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        },
        normalizeRules: function (rules, element) {
            $.each(rules, function (prop, val) {
                if (val === false) {
                    delete rules[prop];
                    return;
                }
                if (val.param || val.depends) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if (keepRule) {
                        rules[prop] = val.param !== undefined ? val.param : true;
                    } else {
                        delete rules[prop];
                    }
                }
            });
            $.each(rules, function (rule, parameter) {
                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
            });
            $.each(['minlength', 'maxlength', 'min', 'max'], function () {
                if (rules[this]) {
                    rules[this] = Number(rules[this]);
                }
            });
            $.each(['rangelength', 'range'], function () {
                if (rules[this]) {
                    rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                }
            });
            if ($.validator.autoCreateRanges) {
                if (rules.min && rules.max) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength && rules.maxlength) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }
            if (rules.messages) {
                delete rules.messages;
            }
            return rules;
        },
        normalizeRule: function (data) {
            if (typeof data == "string") {
                var transformed = {};
                $.each(data.split(/\s/), function () {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },
        addMethod: function (name, method, message) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
            if (method.length < 3) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },
        methods: {
            required: function (value, element, param) {
                if (!this.depend(param, element)) return "dependency-mismatch";
                switch (element.nodeName.toLowerCase()) {
                    case 'select':
                        var val = $(element).val();
                        return val && val.length > 0;
                    case 'input':
                        if (this.checkable(element)) return this.getLength(value, element) > 0;
                    default:
                        return $.trim(value).length > 0;
                }
            },
            remote: function (value, element, param) {
                if (this.optional(element)) return "dependency-mismatch";
                var previous = this.previousValue(element);
                if (!this.settings.messages[element.name]) this.settings.messages[element.name] = {};
                previous.originalMessage = this.settings.messages[element.name].remote;
                this.settings.messages[element.name].remote = previous.message;
                param = typeof param == "string" && {
                    url: param
                } || param;
                if (this.pending[element.name]) {
                    return "pending";
                }
                if (previous.old === value) {
                    return previous.valid;
                }
                previous.old = value;
                var validator = this;
                this.startRequest(element);
                var data = {};
                data[element.name] = value;
                $.ajax($.extend(true, {
                    url: param,
                    mode: "abort",
                    port: "validate" + element.name,
                    dataType: "json",
                    data: data,
                    success: function (response) {
                        validator.settings.messages[element.name].remote = previous.originalMessage;
                        var valid = response === true;
                        if (valid) {
                            var submitted = validator.formSubmitted;
                            validator.prepareElement(element);
                            validator.formSubmitted = submitted;
                            validator.successList.push(element);
                            validator.showErrors();
                        } else {
                            var errors = {};
                            var message = response || validator.defaultMessage(element, "remote");
                            errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                            validator.showErrors(errors);
                        }
                        previous.valid = valid;
                        validator.stopRequest(element, valid);
                    }
                }, param));
                return "pending";
            },
            minlength: function (value, element, param) {
                return this.optional(element) || this.getLength($.trim(value), element) >= param;
            },
            maxlength: function (value, element, param) {
                return this.optional(element) || this.getLength($.trim(value), element) <= param;
            },
            rangelength: function (value, element, param) {
                var length = this.getLength($.trim(value), element);
                return this.optional(element) || (length >= param[0] && length <= param[1]);
            },
            min: function (value, element, param) {
                return this.optional(element) || value >= param;
            },
            max: function (value, element, param) {
                return this.optional(element) || value <= param;
            },
            range: function (value, element, param) {
                return this.optional(element) || (value >= param[0] && value <= param[1]);
            },
            email: function (value, element) {
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },
            url: function (value, element) {
                return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },
            date: function (value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
            },
            dateISO: function (value, element) {
                return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
            },
            number: function (value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
            },
            digits: function (value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            creditcard: function (value, element) {
                if (this.optional(element)) return "dependency-mismatch";
                if (/[^0-9 -]+/.test(value)) return false;
                var nCheck = 0,
					nDigit = 0,
					bEven = false;
                value = value.replace(/\D/g, "");
                for (var n = value.length - 1; n >= 0; n--) {
                    var cDigit = value.charAt(n);
                    var nDigit = parseInt(cDigit, 10);
                    if (bEven) {
                        if ((nDigit *= 2) > 9) nDigit -= 9;
                    }
                    nCheck += nDigit;
                    bEven = !bEven;
                }
                return (nCheck % 10) == 0;
            },
            accept: function (value, element, param) {
                param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
                return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
            },
            equalTo: function (value, element, param) {
                var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
                    $(element).valid();
                });
                return value == target.val();
            }
        }
    });
    $.format = $.validator.format;
})(jQuery);;
(function ($) {
    var pendingRequests = {};
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function (settings, _, xhr) {
            var port = settings.port;
            if (settings.mode == "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        var ajax = $.ajax;
        $.ajax = function (settings) {
            var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
				port = ("port" in settings ? settings : $.ajaxSettings).port;
            if (mode == "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                return (pendingRequests[port] = ajax.apply(this, arguments));
            }
            return ajax.apply(this, arguments);
        };
    }
})(jQuery);;
(function ($) {
    if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
        $.each({
            focus: 'focusin',
            blur: 'focusout'
        }, function (original, fix) {
            $.event.special[fix] = {
                setup: function () {
                    this.addEventListener(original, handler, true);
                },
                teardown: function () {
                    this.removeEventListener(original, handler, true);
                },
                handler: function (e) {
                    arguments[0] = $.event.fix(e);
                    arguments[0].type = fix;
                    return $.event.handle.apply(this, arguments);
                }
            };

            function handler(e) {
                e = $.event.fix(e);
                e.type = fix;
                return $.event.handle.call(this, e);
            }
        });
    };
    $.extend($.fn, {
        validateDelegate: function (delegate, type, handler) {
            return this.bind(type, function (event) {
                var target = $(event.target);
                if (target.is(delegate)) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });
})(jQuery);

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.validate.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.masonry.js --- */


(function (window, $, undefined) {
    var $event = $.event,
		resizeTimeout;
    $event.special.smartresize = {
        setup: function () {
            $(this).bind("resize", $event.special.smartresize.handler);
        },
        teardown: function () {
            $(this).unbind("resize", $event.special.smartresize.handler);
        },
        handler: function (event, execAsap) {
            var context = this,
				args = arguments;
            event.type = "smartresize";
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function () {
                jQuery.event.handle.apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };
    $.fn.smartresize = function (fn) {
        return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]);
    };
    $.Mason = function (options, element) {
        this.element = $(element);
        this._create(options);
        this._init(options.callback);
    };
    var masonryContainerStyles = ['position', 'height'];
    $.Mason.isLayingOut = false;
    $.Mason.settings = {
        isResizable: true,
        isAnimated: false,
        animationOptions: {
            queue: false,
            duration: 500
        },
        gutterWidth: 0,
        isRTL: false,
        isFitWidth: false,
        ignore: 0,
        specialCount: 0,
        maintainOrder: false
    };
    $.Mason.prototype = {
        _filterFindBricks: function ($elems) {
            var selector = this.options.itemSelector;
            return !selector ? $elems : $elems.filter(selector).add($elems.find(selector));
        },
        _getBricks: function ($elems) {
            var $bricks = this._filterFindBricks($elems).css({
                position: 'absolute'
            }).addClass('masonry-brick');
            return $bricks;
        },
        _create: function (options) {
            this.options = $.extend(true, {}, $.Mason.settings, options);
            this.styleQueue = [];
            this.reloadItems();
            var elemStyle = this.element[0].style;
            this.originalStyle = {};
            for (var i = 0, len = masonryContainerStyles.length; i < len; i++) {
                var prop = masonryContainerStyles[i];
                this.originalStyle[prop] = elemStyle[prop] || '';
            }
            this.element.css({
                position: 'relative'
            });
            this.horizontalDirection = this.options.isRTL ? 'right' : 'left';
            this.offset = {};
            var $cursor = $(document.createElement('div'));
            this.element.prepend($cursor);
            this.offset.y = Math.round($cursor.position().top);
            if (!this.options.isRTL) {
                this.offset.x = Math.round($cursor.position().left);
            } else {
                $cursor.css({
                    'float': 'right',
                    display: 'inline-block'
                });
                this.offset.x = Math.round(this.element.outerWidth() - $cursor.position().left);
            }
            $cursor.remove();
            var instance = this;
            setTimeout(function () {
                instance.element.addClass('masonry');
            }, 0);
            if (this.options.isResizable) {
                $(window).bind('smartresize.masonry', function () {
                    instance.resize();
                });
            }
        },
        _init: function (callback) {
            this._getColumns('masonry');
            this._reLayout(callback);
        },
        option: function (key, value) {
            if ($.isPlainObject(key)) {
                this.options = $.extend(true, this.options, key);
            }
        },
        layout: function ($bricks, callback) {
            $.Mason.isLayingOut = true;
            this.currentY = 0;
            var $brick, colSpan, groupCount, groupY, groupColY, j;
            for (var i = 0, len = $bricks.length; i < len; i++) {
                $brick = $($bricks[i]);
                if ($brick.hasClass(this.options.ignore)) {
                    this._placeBrick($brick);
                }
            }
            for (var i = 0, len = $bricks.length; i < len; i++) {
                $brick = $($bricks[i]);
                if (!$brick.hasClass('inactive')) {
                    if (!$brick.hasClass(this.options.ignore)) {
                        colSpan = Math.ceil($brick.outerWidth(true) / this.columnWidth);
                        colSpan = Math.min(colSpan, this.cols);
                        if (colSpan === 1) {
                            this._placeBrick($brick, this.colYs);
                        } else {
                            groupCount = this.cols + 1 - colSpan;
                            groupY = [];
                            for (j = 0; j < groupCount; j++) {
                                groupColY = this.colYs.slice(j, j + colSpan);
                                groupY[j] = Math.max.apply(Math, groupColY);
                            }
                            this._placeBrick($brick, groupY);
                        }
                    } else { }
                }
            }
            var containerSize = {};
            containerSize.height = Math.max.apply(Math, this.colYs) - this.offset.y;
            if (this.options.isFitWidth) {
                containerSize.width = this.cols * this.columnWidth - this.options.gutterWidth;
            }
            this.styleQueue.push({
                $el: this.element,
                style: containerSize
            });
            var styleFn = !this.isLaidOut ? 'css' : (this.options.isAnimated ? 'animate' : 'css'),
				animOpts = this.options.animationOptions;
            var obj;
            for (i = 0, len = this.styleQueue.length; i < len; i++) {
                obj = this.styleQueue[i];
                try {
                    obj.$el[styleFn](obj.style, animOpts);
                } catch (err) { }
            }
            this.options.onHeightSet(containerSize.height);
            this.styleQueue = [];
            if (callback) {
                callback.call($bricks);
            } else if (this.options.callback) {
                this.options.callback('callback');
            }
            this.isLaidOut = true;
            $.Mason.isLayingOut = false;
            this.options.specialCount = 0;
        },
        _getColumns: function () {
            var container = this.options.isFitWidth ? this.element.parent() : this.element,
				containerWidth = container.width();
            this.columnWidth = this.options.columnWidth || this.$bricks.outerWidth(true) || containerWidth;
            this.columnWidth += this.options.gutterWidth;
            this.cols = Math.floor((containerWidth + this.options.gutterWidth) / this.columnWidth);
            this.cols = Math.max(this.cols, 1);
        },
        _placeBrick: function ($brick, setY) {
            if (setY) {
                var minimumY = Math.min.apply(Math, setY),
					shortCol = 0;
                if (this.options.maintainOrder && this.currentY > 0) {
                    var newYs = [];
                    for (var i = 0; i < setY.length; i++) {
                        if (setY[i] >= this.currentY) {
                            newYs.push(setY[i]);
                        }
                    }
                    minimumY = Math.min.apply(Math, newYs);
                }
                for (var i = 0, len = setY.length; i < len; i++) {
                    if (setY[i] === minimumY) {
                        shortCol = i;
                        break;
                    }
                }
                var lpos = this.columnWidth * shortCol + this.offset.x;
                var container = this.options.isFitWidth ? this.element.parent() : this.element,
					containerWidth = container.width();
                if ($brick.hasClass('special') && (minimumY > 145 || containerWidth < 1200)) {
                    minimumY = 580;
                    lpos = 0;
                    lpos += (400 + (this.options.specialCount * 200));
                    shortCol = lpos / this.columnWidth;
                    this.options.specialCount++;
                }
                var position = {
                    top: minimumY
                };
                this.currentY = minimumY;
                position[this.horizontalDirection] = lpos;
                this.styleQueue.push({
                    $el: $brick,
                    style: position
                });
            } else {
                var containerWidth = this.cols * this.columnWidth - this.options.gutterWidth;
                var right = parseInt($brick.css('right'));
                var left = parseInt($brick.css('left'));
                var useRight = $brick.attr('style').indexOf('right') == -1 ? false : true;
                if (!useRight) {
                    var l = parseInt($brick.css('left'));
                } else {
                    var l = containerWidth - (parseInt($brick.css('right')) + $brick.outerWidth(true));
                }
                if (isNaN(l)) l = 0;
                var shortCol = l / this.columnWidth;
                var minimumY = parseInt($brick.css('top'));
                if (isNaN(minimumY)) minimumY = 0;
                var len = (this.cols + 1) - ($brick.outerWidth(true) / this.columnWidth);
            }
            var setHeight = minimumY + $brick.outerHeight(true),
				setSpan = this.cols + 1 - len;
            for (i = 0; i < setSpan; i++) {
                this.colYs[shortCol + i] = setHeight;
            }
        },
        resize: function () {
            var prevColCount = this.cols;
            this._getColumns('masonry');
            if (this.cols !== prevColCount) {
                this._reLayout();
            }
        },
        _reLayout: function (callback) {
            var i = this.cols;
            this.colYs = [];
            while (i--) {
                this.colYs.push(this.offset.y);
            }
            this.layout(this.$bricks, callback);
        },
        reloadItems: function () {
            this.$bricks = this._getBricks(this.element.children());
        },
        reload: function (callback) {
            this.reloadItems();
            this._init(callback);
        },
        appended: function ($content, isAnimatedFromBottom, callback) {
            if (isAnimatedFromBottom) {
                this._filterFindBricks($content).css({
                    top: this.element.height()
                });
                var instance = this;
                setTimeout(function () {
                    instance._appended($content, callback);
                }, 1);
            } else {
                this._appended($content, callback);
            }
        },
        _appended: function ($content, callback) {
            var $newBricks = this._getBricks($content);
            this.$bricks = this.$bricks.add($newBricks);
            this.layout($newBricks, callback);
        },
        remove: function ($content) {
            this.$bricks = this.$bricks.not($content);
            $content.remove();
        },
        destroy: function () {
            this.$bricks.removeClass('masonry-brick').each(function () {
                this.style.position = '';
                this.style.top = '';
                this.style.left = '';
            });
            var elemStyle = this.element[0].style;
            for (var i = 0, len = masonryContainerStyles.length; i < len; i++) {
                var prop = masonryContainerStyles[i];
                elemStyle[prop] = this.originalStyle[prop];
            }
            this.element.unbind('.masonry').removeClass('masonry').removeData('masonry');
            $(window).unbind('.masonry');
        }
    };
    $.fn.imagesLoaded = function (callback) {
        var $this = this,
			$images = $this.find('img').add($this.filter('img')),
			len = $images.length,
			blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

        function triggerCallback() {
            callback.call($this, $images);
        }

        function imgLoaded() {
            if (--len <= 0 && this.src !== blank) {
                setTimeout(triggerCallback);
                $images.unbind('load error', imgLoaded);
            }
        }
        if (!len) {
            triggerCallback();
        }
        $images.bind('load error', imgLoaded).each(function () {
            if (this.complete || this.complete === undefined) {
                var src = this.src;
                this.src = blank;
                this.src = src;
            }
        });
        return $this;
    };
    var logError = function (message) {
        if (this.console) {
            console.error(message);
        }
    };
    $.fn.masonry = function (options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var instance = $.data(this, 'masonry');
                if (!instance) {
                    logError("cannot call methods on masonry prior to initialization; " + "attempted to call method '" + options + "'");
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for masonry instance");
                    return;
                }
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function () {
                var instance = $.data(this, 'masonry');
                if (instance) {
                    instance.option(options || {});
                    instance._init();
                } else {
                    $.data(this, 'masonry', new $.Mason(options, this));
                }
            });
        }
        return this;
    };
})(window, jQuery);

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.masonry.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.gridular.js --- */


(function ($) {
    $.fn.gridular = function (moduleWidth, moduleHeight) {
        return this.each(function () {
            $(this).addClass('gridular');
            $(this).attr('data-orig-height', $(this).height());
            $(this).height((Math.ceil(($(this).height() / moduleHeight)) * moduleHeight) + 'px');
            $(this).width((Math.ceil(($(this).width() / moduleWidth)) * moduleWidth) + 'px');
        });
    }
})(jQuery);

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.gridular.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.notdescenders.js --- */


(function ($) {
    $.fn.notdescenders = function (options) {
        var defaults = {
            spanclass: 'not-descender'
        };
        var options = $.extend(defaults, options);
        var items = [];
        this.each(function () {
            var $item = $(this);
            if (!$item.find('.' + options.spanclass).length) {
                var html = $item.html();
                html = html.replace(/([^qypgj]+)/g, '<span class="' + options.spanclass + '">$1</span>');
                $item.html(html);
            }
        });
    };
})(jQuery);

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.notdescenders.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.lightbox.js --- */


(function ($) {
    $.fn.lightBox = function (settings) {
        settings = jQuery.extend({
            overlayBgColor: '#FFF',
            overlayOpacity: 0.8,
            fixedNavigation: false,
            imageLoading: '',
            imageBtnPrev: '/images/lightbox-btn-prev.png',
            imageBtnNext: '/images/lightbox-btn-next.png',
            imageBtnClose: '/images/lightbox-btn-close.png',
            imageBlank: '/images/lightbox-blank.gif',
            containerBorderSize: 0,
            containerResizeSpeed: 100,
            txtImage: 'Image',
            txtOf: 'of',
            keyToClose: 'c',
            keyToPrev: 'p',
            keyToNext: 'n',
            imageArray: [],
            activeImage: 0,
            runOnce: false
        }, settings);
        var jQueryMatchedObj = this;

        function _initialize() {
            _start(this, jQueryMatchedObj);
            return false;
        }

        function _start(objClicked, jQueryMatchedObj) {
            $('embed, object, select').css({
                'visibility': 'hidden'
            });
            _set_interface();
            $('#lightbox-container-image-box,#lightbox-container-image-data-box').hide();
            settings.imageArray.length = 0;
            settings.activeImage = 0;
            if (jQueryMatchedObj.length == 1) {
                settings.imageArray.push(new Array(objClicked.getAttribute('href'), objClicked.getAttribute('title')));
            } else {
                for (var i = 0; i < jQueryMatchedObj.length; i++) {
                    settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'), jQueryMatchedObj[i].getAttribute('title')));
                }
            }
            while (settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href')) {
                settings.activeImage++;
            }
            _set_image_to_view();
        }

        function _set_interface() {
            $('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="jquery-lightbox-wrapper"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span></div><div id="lightbox-secNav"><span id="lightbox-image-details-currentNumber"></span><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div></div></div><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div>');
            var arrPageSizes = ___getPageSize();
            $('#jquery-overlay').css({
                backgroundColor: settings.overlayBgColor,
                opacity: settings.overlayOpacity,
                width: arrPageSizes[0],
                height: arrPageSizes[1]
            });
            var arrPageScroll = ___getPageScroll();
            $('#jquery-lightbox').css({
                top: arrPageScroll[1] + (arrPageSizes[3] / 10),
                left: arrPageScroll[0]
            });
            $('#jquery-overlay,#jquery-lightbox').click(function () {
                _finish();
            });
            $('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function () {
                _finish();
                return false;
            });
            $(window).resize(function () {
                var arrPageSizes = ___getPageSize();
                $('#jquery-overlay').css({
                    width: arrPageSizes[0],
                    height: arrPageSizes[1]
                });
                var arrPageScroll = ___getPageScroll();
                $('#jquery-lightbox').css({
                    top: arrPageScroll[1] + (arrPageSizes[3] / 10),
                    left: arrPageScroll[0]
                });
            });
        }

        function _set_image_to_view() {
            if (!settings.activeImage && !settings.runOnce) {
                settings.runOnce = true;
                if (settings.fixedNavigation) {
                    $('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
                } else {
                    $('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
                }
            } else {
                $('#lightbox-image').hide();
            }
            var objImagePreloader = new Image();
            objImagePreloader.onload = function () {
                $('#lightbox-image').attr('src', settings.imageArray[settings.activeImage][0]);
                var imgWidth = objImagePreloader.width;
                var imgHeight = objImagePreloader.height;
                var arrPageSizes = ___getPageSize();
                var windowHeight = arrPageSizes[3];
                var padding = 20;
                var details = 25;
                var gutter = padding + details;
                var resizeHeight = ((imgHeight + gutter) > (windowHeight - padding)) ? (windowHeight - gutter) : imgHeight;
                var ratio = (imgWidth / imgHeight);
                var resizeWidth = Math.round(resizeHeight * ratio);
                $('#jquery-overlay').css({
                    width: arrPageSizes[0],
                    height: arrPageSizes[1]
                });
                var arrPageScroll = ___getPageScroll();
                $('#jquery-lightbox').animate({
                    top: ((arrPageSizes[3] - (resizeHeight + details)) / 2) + arrPageScroll[1],
                    left: arrPageScroll[0]
                });
                $('#lightbox-image').css({
                    'width': resizeWidth,
                    'height': resizeHeight
                });
                _resize_container_image_box(resizeWidth, resizeHeight);
                objImagePreloader.onload = function () { };
            };
            if (settings.imageArray[settings.activeImage] != undefined) {
                objImagePreloader.src = settings.imageArray[settings.activeImage][0];
            } else {
                _finish();
            }
        };

        function _resize_container_image_box(intImageWidth, intImageHeight) {
            var intCurrentWidth = $('#lightbox-container-image-box').width();
            var intCurrentHeight = $('#lightbox-container-image-box').height();
            var intWidth = (intImageWidth + (settings.containerBorderSize * 2));
            var intHeight = (intImageHeight + (settings.containerBorderSize * 2));
            var intDiffW = intCurrentWidth - intWidth;
            var intDiffH = intCurrentHeight - intHeight;
            $('#lightbox-container-image-box').animate({
                width: intWidth,
                height: intHeight
            }, settings.containerResizeSpeed, 'easeInOutExpo', function () {
                _show_image();
                $('#lightbox-container-image-box,#lightbox-container-image-data-box').fadeIn();
            });
            if ((intDiffW == 0) && (intDiffH == 0)) {
                if ($.browser.msie) {
                    ___pause(250);
                } else {
                    ___pause(100);
                }
            }
            $('#jquery-lightbox-wrapper').animate({
                width: intImageWidth
            });
            $('#lightbox-container-image-data-box').animate({
                width: intImageWidth
            }, settings.containerResizeSpeed, 'easeInOutExpo');
            $('#lightbox-image-details').animate({
                width: (intImageWidth - 190)
            });
        };

        function _show_image() {
            $('#lightbox-loading').hide();
            $('#lightbox-image').fadeIn(function () {
                _show_image_data();
                _set_navigation();
            });
            _preload_neighbor_images();
        };

        function _show_image_data() {
            $('#lightbox-container-image-data-box').slideDown('fast');
            $('#lightbox-image-details-caption').hide();
            if (settings.imageArray[settings.activeImage][1]) {
                $('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();
            }
            if (settings.imageArray.length > 1) {
                $('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + (settings.activeImage + 1) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show();
            }
        }

        function _set_navigation() {
            $('#lightbox-nav').show();
            $('#lightbox-nav-btnPrev').css({
                'background': 'url(' + settings.imageBtnPrev + ') 3px 0 no-repeat'
            });
            $('#lightbox-nav-btnNext').css({
                'background': 'url(' + settings.imageBtnNext + ') 3px 0 no-repeat'
            });
            if (settings.activeImage != 0) {
                if (settings.fixedNavigation) {
                    $('#lightbox-nav-btnPrev').css({
                        'background': 'url(' + settings.imageBtnPrev + ') 3px 0 no-repeat'
                    }).unbind().bind('click', function () {
                        settings.activeImage = settings.activeImage - 1;
                        _set_image_to_view();
                        return false;
                    });
                } else {
                    $('#lightbox-nav-btnPrev').unbind().hover(function () {
                        $(this).css({
                            'background': 'url(' + settings.imageBtnPrev + ') 3px -17px no-repeat'
                        });
                    }, function () {
                        $(this).css({
                            'background': 'url(' + settings.imageBtnPrev + ') 3px 0 no-repeat'
                        });
                    }).show().bind('click', function () {
                        settings.activeImage = settings.activeImage - 1;
                        _set_image_to_view();
                        return false;
                    });
                }
            }
            if (settings.activeImage != (settings.imageArray.length - 1)) {
                if (settings.fixedNavigation) {
                    $('#lightbox-nav-btnNext').css({
                        'background': 'url(' + settings.imageBtnNext + ') 3px 0 no-repeat'
                    }).unbind().bind('click', function () {
                        settings.activeImage = settings.activeImage + 1;
                        _set_image_to_view();
                        return false;
                    });
                } else {
                    $('#lightbox-nav-btnNext').unbind().hover(function () {
                        $(this).css({
                            'background': 'url(' + settings.imageBtnNext + ') 3px -17px no-repeat'
                        });
                    }, function () {
                        $(this).css({
                            'background': 'url(' + settings.imageBtnNext + ') 3px 0 no-repeat'
                        });
                    }).show().bind('click', function () {
                        settings.activeImage = settings.activeImage + 1;
                        _set_image_to_view();
                        return false;
                    });
                }
            }
            _enable_keyboard_navigation();
        }

        function _enable_keyboard_navigation() {
            $(document).keydown(function (objEvent) {
                _keyboard_action(objEvent);
            });
        }

        function _disable_keyboard_navigation() {
            $(document).unbind();
        }

        function _keyboard_action(objEvent) {
            if (objEvent == null) {
                keycode = event.keyCode;
                escapeKey = 27;
            } else {
                keycode = objEvent.keyCode;
                escapeKey = objEvent.DOM_VK_ESCAPE;
            }
            key = String.fromCharCode(keycode).toLowerCase();
            if ((key == settings.keyToClose) || (key == 'x') || (keycode == escapeKey)) {
                _finish();
            }
            if ((key == settings.keyToPrev) || (keycode == 37)) {
                if (settings.activeImage != 0) {
                    settings.activeImage = settings.activeImage - 1;
                    _set_image_to_view();
                    _disable_keyboard_navigation();
                }
            }
            if ((key == settings.keyToNext) || (keycode == 39)) {
                if (settings.activeImage != (settings.imageArray.length - 1)) {
                    settings.activeImage = settings.activeImage + 1;
                    _set_image_to_view();
                    _disable_keyboard_navigation();
                }
            }
        }

        function _preload_neighbor_images() {
            if ((settings.imageArray.length - 1) > settings.activeImage) {
                objNext = new Image();
                objNext.src = settings.imageArray[settings.activeImage + 1][0];
            }
            if (settings.activeImage > 0) {
                objPrev = new Image();
                objPrev.src = settings.imageArray[settings.activeImage - 1][0];
            }
        }

        function _finish() {
            $('#jquery-lightbox').remove();
            $('#jquery-overlay').fadeOut(function () {
                $('#jquery-overlay').remove();
            });
            $('embed, object, select').css({
                'visibility': 'visible'
            });
            settings.runOnce = false;
        }

        function ___getPageSize() {
            var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY) {
                xScroll = window.innerWidth + window.scrollMaxX;
                yScroll = window.innerHeight + window.scrollMaxY;
            } else if (document.body.scrollHeight > document.body.offsetHeight) {
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight;
            } else {
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight;
            }
            var windowWidth, windowHeight;
            if (self.innerHeight) {
                if (document.documentElement.clientWidth) {
                    windowWidth = document.documentElement.clientWidth;
                } else {
                    windowWidth = self.innerWidth;
                }
                windowHeight = self.innerHeight;
            } else if (document.documentElement && document.documentElement.clientHeight) {
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else if (document.body) {
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }
            if (yScroll < windowHeight) {
                pageHeight = windowHeight;
            } else {
                pageHeight = yScroll;
            }
            if (xScroll < windowWidth) {
                pageWidth = xScroll;
            } else {
                pageWidth = windowWidth;
            }
            arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
            return arrayPageSize;
        };

        function ___getPageScroll() {
            var xScroll, yScroll;
            if (self.pageYOffset) {
                yScroll = self.pageYOffset;
                xScroll = self.pageXOffset;
            } else if (document.documentElement && document.documentElement.scrollTop) {
                yScroll = document.documentElement.scrollTop;
                xScroll = document.documentElement.scrollLeft;
            } else if (document.body) {
                yScroll = document.body.scrollTop;
                xScroll = document.body.scrollLeft;
            }
            arrayPageScroll = new Array(xScroll, yScroll);
            return arrayPageScroll;
        };

        function ___pause(ms) {
            var date = new Date();
            curDate = null;
            do {
                var curDate = new Date();
            }
            while (curDate - date < ms);
        };
        return this.unbind('click').click(_initialize);
    };
})(jQuery);

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.lightbox.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.wave.js --- */


(function ($) {
    $.fn.wave = function (inc, speed) {
        var timer = inc;
        this.each(function () {
            var obj = $(this);
            setTimeout(function () {
                obj.fadeIn(speed);
            }, timer);
            timer += inc;
        });
    };
})(jQuery);

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.wave.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.flash.min.js --- */

;
(function () {
    var $$;
    $$ = jQuery.fn.flash = function (htmlOptions, pluginOptions, replace, update) {
        var block = replace || $$.replace;
        pluginOptions = $$.copy($$.pluginOptions, pluginOptions);
        if (!$$.hasFlash(pluginOptions.version)) {
            if (pluginOptions.expressInstall && $$.hasFlash(6, 0, 65)) {
                var expressInstallOptions = {
                    flashvars: {
                        MMredirectURL: location,
                        MMplayerType: 'PlugIn',
                        MMdoctitle: jQuery('title').text()
                    }
                };
            } else if (pluginOptions.update) {
                block = update || $$.update;
            } else {
                return this;
            }
        }
        htmlOptions = $$.copy($$.htmlOptions, expressInstallOptions, htmlOptions);
        return this.each(function () {
            block.call(this, $$.copy(htmlOptions));
        });
    };
    $$.copy = function () {
        var options = {},
			flashvars = {};
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg == undefined) continue;
            jQuery.extend(options, arg);
            if (arg.flashvars == undefined) continue;
            jQuery.extend(flashvars, arg.flashvars);
        }
        options.flashvars = flashvars;
        return options;
    };
    $$.hasFlash = function () {
        if (/hasFlash\=true/.test(location)) return true;
        if (/hasFlash\=false/.test(location)) return false;
        var pv = $$.hasFlash.playerVersion().match(/\d+/g);
        var rv = String([arguments[0], arguments[1], arguments[2]]).match(/\d+/g) || String($$.pluginOptions.version).match(/\d+/g);
        for (var i = 0; i < 3; i++) {
            pv[i] = parseInt(pv[i] || 0);
            rv[i] = parseInt(rv[i] || 0);
            if (pv[i] < rv[i]) return false;
            if (pv[i] > rv[i]) return true;
        }
        return true;
    };
    $$.hasFlash.playerVersion = function () {
        try {
            try {
                var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
                try {
                    axo.AllowScriptAccess = 'always';
                } catch (e) {
                    return '6,0,0';
                }
            } catch (e) { }
            return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
        } catch (e) {
            try {
                if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                    return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
                }
            } catch (e) { }
        }
        return '0,0,0';
    };
    $$.htmlOptions = {
        flashvars: {},
        pluginspage: 'http://www.adobe.com/go/getflashplayer',
        src: '#',
        type: 'application/x-shockwave-flash'
    };
    $$.pluginOptions = {
        expressInstall: false,
        update: true,
        version: '6.0.65'
    };
    $$.replace = function (htmlOptions) {
        this.innerHTML = '<div class="alt">' + this.innerHTML + '</div>';
        jQuery(this).addClass('flash-replaced').prepend($$.transform(htmlOptions));
    };
    $$.update = function (htmlOptions) {
        var url = String(location).split('?');
        url.splice(1, 0, '?hasFlash=true&');
        url = url.join('');
        var msg = '<p>This content requires the Flash Player. <a href="http://www.adobe.com/go/getflashplayer">Download Flash Player</a>. Already have Flash Player? <a href="' + url + '">Click here.</a></p>';
        this.innerHTML = '<span class="alt">' + this.innerHTML + '</span>';
        jQuery(this).addClass('flash-update').prepend(msg);
    };

    function toAttributeString() {
        var s = '';
        for (var key in this) if (typeof this[key] != 'function') s += key + '="' + this[key] + '" ';
        return s;
    };

    function toFlashvarsString() {
        var s = '';
        for (var key in this) if (typeof this[key] != 'function') s += key + '=' + encodeURIComponent(this[key]) + '&';
        return s.replace(/&$/, '');
    };
    $$.transform = function (htmlOptions) {
        htmlOptions.toString = toAttributeString;
        if (htmlOptions.flashvars) htmlOptions.flashvars.toString = toFlashvarsString;
        return '<embed ' + String(htmlOptions) + '/>';
    };
    if (window.attachEvent) {
        window.attachEvent("onbeforeunload", function () {
            __flash_unloadHandler = function () { };
            __flash_savedUnloadHandler = function () { };
        });
    }
})();

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.flash.min.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.scrollTo-min.js --- */

;
(function (d) {
    var k = d.scrollTo = function (a, i, e) {
        d(window).scrollTo(a, i, e)
    };
    k.defaults = {
        axis: 'xy',
        duration: parseFloat(d.fn.jquery) >= 1.3 ? 0 : 1
    };
    k.window = function (a) {
        return d(window)._scrollable()
    };
    d.fn._scrollable = function () {
        return this.map(function () {
            var a = this,
				i = !a.nodeName || d.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
            if (!i) return a;
            var e = (a.contentWindow || a).document || a.ownerDocument || a;
            return d.browser.safari || e.compatMode == 'BackCompat' ? e.body : e.documentElement
        })
    };
    d.fn.scrollTo = function (n, j, b) {
        if (typeof j == 'object') {
            b = j;
            j = 0
        }
        if (typeof b == 'function') b = {
            onAfter: b
        };
        if (n == 'max') n = 9e9;
        b = d.extend({}, k.defaults, b);
        j = j || b.speed || b.duration;
        b.queue = b.queue && b.axis.length > 1;
        if (b.queue) j /= 2;
        b.offset = p(b.offset);
        b.over = p(b.over);
        return this._scrollable().each(function () {
            var q = this,
				r = d(q),
				f = n,
				s, g = {},
				u = r.is('html,body');
            switch (typeof f) {
                case 'number':
                case 'string':
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)) {
                        f = p(f);
                        break
                    }
                    f = d(f, this);
                case 'object':
                    if (f.is || f.style) s = (f = d(f)).offset()
            }
            d.each(b.axis.split(''), function (a, i) {
                var e = i == 'x' ? 'Left' : 'Top',
					h = e.toLowerCase(),
					c = 'scroll' + e,
					l = q[c],
					m = k.max(q, i);
                if (s) {
                    g[c] = s[h] + (u ? 0 : l - r.offset()[h]);
                    if (b.margin) {
                        g[c] -= parseInt(f.css('margin' + e)) || 0;
                        g[c] -= parseInt(f.css('border' + e + 'Width')) || 0
                    }
                    g[c] += b.offset[h] || 0;
                    if (b.over[h]) g[c] += f[i == 'x' ? 'width' : 'height']() * b.over[h]
                } else {
                    var o = f[h];
                    g[c] = o.slice && o.slice(-1) == '%' ? parseFloat(o) / 100 * m : o
                }
                if (/^\d+$/.test(g[c])) g[c] = g[c] <= 0 ? 0 : Math.min(g[c], m);
                if (!a && b.queue) {
                    if (l != g[c]) t(b.onAfterFirst);
                    delete g[c]
                }
            });
            t(b.onAfter);

            function t(a) {
                r.animate(g, j, b.easing, a &&
				function () {
				    a.call(this, n, b)
				})
            }
        }).end()
    };
    k.max = function (a, i) {
        var e = i == 'x' ? 'Width' : 'Height',
			h = 'scroll' + e;
        if (!d(a).is('html,body')) return a[h] - d(a)[e.toLowerCase()]();
        var c = 'client' + e,
			l = a.ownerDocument.documentElement,
			m = a.ownerDocument.body;
        return Math.max(l[h], m[h]) - Math.min(l[c], m[c])
    };

    function p(a) {
        return typeof a == 'object' ? a : {
            top: a,
            left: a
        }
    }
})(jQuery);

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.scrollTo-min.js --- */

/* --- CONTENTS OF ./javascripts/jquery/jquery.cycle.js --- */

;
(function ($) {
    var ver = "2.65";
    if ($.support == undefined) {
        $.support = {
            opacity: !($.browser.msie)
        };
    }
    function log() {
        if (window.console && window.console.log) {
            window.console.log("[cycle] " + Array.prototype.join.call(arguments, " "));
        }
    }
    $.fn.cycle = function (options, arg2) {
        var o = {
            s: this.selector,
            c: this.context
        };
        if (this.length == 0 && options != "stop") {
            if (!$.isReady && o.s) {
                log("DOM not ready, queuing slideshow");
                $(function () {
                    $(o.s, o.c).cycle(options, arg2);
                });
                return this;
            }
            log("terminating; zero elements found by selector" + ($.isReady ? "" : " (DOM not ready)"));
            return this;
        }
        return this.each(function () {
            options = handleArguments(this, options, arg2);
            if (options === false) {
                return;
            }
            if (this.cycleTimeout) {
                clearTimeout(this.cycleTimeout);
            }
            this.cycleTimeout = this.cyclePause = 0;
            var $cont = $(this);
            var $slides = options.slideExpr ? $(options.slideExpr, this) : $cont.children();
            var els = $slides.get();
            if (els.length < 2) {
                log("terminating; too few slides: " + els.length);
                return;
            }
            var opts = buildOptions($cont, $slides, els, options, o);
            if (opts === false) {
                return;
            }
            if (opts.timeout || opts.continuous) {
                this.cycleTimeout = setTimeout(function () {
                    go(els, opts, 0, !opts.rev);
                }, opts.continuous ? 10 : opts.timeout + (opts.delay || 0));
            }
        });
    };

    function handleArguments(cont, options, arg2) {
        if (cont.cycleStop == undefined) {
            cont.cycleStop = 0;
        }
        if (options === undefined || options === null) {
            options = {};
        }
        if (options.constructor == String) {
            switch (options) {
                case "stop":
                    cont.cycleStop++;
                    if (cont.cycleTimeout) {
                        clearTimeout(cont.cycleTimeout);
                    }
                    cont.cycleTimeout = 0;
                    $(cont).removeData("cycle.opts");
                    return false;
                case "pause":
                    cont.cyclePause = 1;
                    return false;
                case "resume":
                    cont.cyclePause = 0;
                    if (arg2 === true) {
                        options = $(cont).data("cycle.opts");
                        if (!options) {
                            log("options not found, can not resume");
                            return false;
                        }
                        if (cont.cycleTimeout) {
                            clearTimeout(cont.cycleTimeout);
                            cont.cycleTimeout = 0;
                        }
                        go(options.elements, options, 1, 1);
                    }
                    return false;
                default:
                    options = {
                        fx: options
                    };
            }
        } else {
            if (options.constructor == Number) {
                var num = options;
                options = $(cont).data("cycle.opts");
                if (!options) {
                    log("options not found, can not advance slide");
                    return false;
                }
                if (num < 0 || num >= options.elements.length) {
                    log("invalid slide index: " + num);
                    return false;
                }
                options.nextSlide = num;
                if (cont.cycleTimeout) {
                    clearTimeout(cont.cycleTimeout);
                    cont.cycleTimeout = 0;
                }
                if (typeof arg2 == "string") {
                    options.oneTimeFx = arg2;
                }
                go(options.elements, options, 1, num >= options.currSlide);
                return false;
            }
        }
        return options;
    }
    function removeFilter(el, opts) {
        if (!$.support.opacity && opts.cleartype && el.style.filter) {
            try {
                el.style.removeAttribute("filter");
            } catch (smother) { }
        }
    }
    function buildOptions($cont, $slides, els, options, o) {
        var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
        if (opts.autostop) {
            opts.countdown = opts.autostopCount || els.length;
        }
        var cont = $cont[0];
        $cont.data("cycle.opts", opts);
        opts.$cont = $cont;
        opts.stopCount = cont.cycleStop;
        opts.elements = els;
        opts.before = opts.before ? [opts.before] : [];
        opts.after = opts.after ? [opts.after] : [];
        opts.after.unshift(function () {
            opts.busy = 0;
        });
        if (!$.support.opacity && opts.cleartype) {
            opts.after.push(function () {
                removeFilter(this, opts);
            });
        }
        if (opts.continuous) {
            opts.after.push(function () {
                go(els, opts, 0, !opts.rev);
            });
        }
        saveOriginalOpts(opts);
        if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg) {
            clearTypeFix($slides);
        }
        if ($cont.css("position") == "static") {
            $cont.css("position", "relative");
        }
        if (opts.width) {
            $cont.width(opts.width);
        }
        if (opts.height && opts.height != "auto") {
            $cont.height(opts.height);
        }
        if (opts.startingSlide) {
            opts.startingSlide = parseInt(opts.startingSlide);
        }
        if (opts.random) {
            opts.randomMap = [];
            for (var i = 0; i < els.length; i++) {
                opts.randomMap.push(i);
            }
            opts.randomMap.sort(function (a, b) {
                return Math.random() - 0.5;
            });
            opts.randomIndex = 0;
            opts.startingSlide = opts.randomMap[0];
        } else {
            if (opts.startingSlide >= els.length) {
                opts.startingSlide = 0;
            }
        }
        opts.currSlide = opts.startingSlide = opts.startingSlide || 0;
        var first = opts.startingSlide;
        $slides.css({
            position: "absolute",
            top: 0,
            left: 0
        }).hide().each(function (i) {
            var z = first ? i >= first ? els.length - (i - first) : first - i : els.length - i;
            $(this).css("z-index", z);
        });
        $(els[first]).css("opacity", 1).show();
        removeFilter(els[first], opts);
        if (opts.fit && opts.width) {
            $slides.width(opts.width);
        }
        if (opts.fit && opts.height && opts.height != "auto") {
            $slides.height(opts.height);
        }
        var reshape = opts.containerResize && !$cont.innerHeight();
        if (reshape) {
            var maxw = 0,
				maxh = 0;
            for (var i = 0; i < els.length; i++) {
                var $e = $(els[i]),
					e = $e[0],
					w = $e.outerWidth(),
					h = $e.outerHeight();
                if (!w) {
                    w = e.offsetWidth;
                }
                if (!h) {
                    h = e.offsetHeight;
                }
                maxw = w > maxw ? w : maxw;
                maxh = h > maxh ? h : maxh;
            }
            if (maxw > 0 && maxh > 0) {
                $cont.css({
                    width: maxw + "px",
                    height: maxh + "px"
                });
            }
        }
        if (opts.pause) {
            $cont.hover(function () {
                this.cyclePause++;
            }, function () {
                this.cyclePause--;
            });
        }
        if (supportMultiTransitions(opts) === false) {
            return false;
        }
        if (!opts.multiFx) {
            var init = $.fn.cycle.transitions[opts.fx];
            if ($.isFunction(init)) {
                init($cont, $slides, opts);
            } else {
                if (opts.fx != "custom" && !opts.multiFx) {
                    log("unknown transition: " + opts.fx, "; slideshow terminating");
                    return false;
                }
            }
        }
        var requeue = false;
        options.requeueAttempts = options.requeueAttempts || 0;
        $slides.each(function () {
            var $el = $(this);
            this.cycleH = (opts.fit && opts.height) ? opts.height : $el.height();
            this.cycleW = (opts.fit && opts.width) ? opts.width : $el.width();
            if ($el.is("img")) {
                var loadingIE = ($.browser.msie && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
                var loadingOp = ($.browser.opera && this.cycleW == 42 && this.cycleH == 19 && !this.complete);
                var loadingOther = (this.cycleH == 0 && this.cycleW == 0 && !this.complete);
                if (loadingIE || loadingOp || loadingOther) {
                    if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) {
                        log(options.requeueAttempts, " - img slide not loaded, requeuing slideshow: ", this.src, this.cycleW, this.cycleH);
                        setTimeout(function () {
                            $(o.s, o.c).cycle(options);
                        }, opts.requeueTimeout);
                        requeue = true;
                        return false;
                    } else {
                        log("could not determine size of image: " + this.src, this.cycleW, this.cycleH);
                    }
                }
            }
            return true;
        });
        if (requeue) {
            return false;
        }
        opts.cssBefore = opts.cssBefore || {};
        opts.animIn = opts.animIn || {};
        opts.animOut = opts.animOut || {};
        $slides.not(":eq(" + first + ")").css(opts.cssBefore);
        if (opts.cssFirst) {
            $($slides[first]).css(opts.cssFirst);
        }
        if (opts.timeout) {
            opts.timeout = parseInt(opts.timeout);
            if (opts.speed.constructor == String) {
                opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed);
            }
            if (!opts.sync) {
                opts.speed = opts.speed / 2;
            }
            while ((opts.timeout - opts.speed) < 250) {
                opts.timeout += opts.speed;
            }
        }
        if (opts.easing) {
            opts.easeIn = opts.easeOut = opts.easing;
        }
        if (!opts.speedIn) {
            opts.speedIn = opts.speed;
        }
        if (!opts.speedOut) {
            opts.speedOut = opts.speed;
        }
        opts.slideCount = els.length;
        opts.currSlide = opts.lastSlide = first;
        if (opts.random) {
            opts.nextSlide = opts.currSlide;
            if (++opts.randomIndex == els.length) {
                opts.randomIndex = 0;
            }
            opts.nextSlide = opts.randomMap[opts.randomIndex];
        } else {
            opts.nextSlide = opts.startingSlide >= (els.length - 1) ? 0 : opts.startingSlide + 1;
        }
        var e0 = $slides[first];
        if (opts.before.length) {
            opts.before[0].apply(e0, [e0, e0, opts, true]);
        }
        if (opts.after.length > 1) {
            opts.after[1].apply(e0, [e0, e0, opts, true]);
        }
        if (opts.next) {
            $(opts.next).click(function () {
                return advance(opts, opts.rev ? -1 : 1);
            });
        }
        if (opts.prev) {
            $(opts.prev).click(function () {
                return advance(opts, opts.rev ? 1 : -1);
            });
        }
        if (opts.pager) {
            buildPager(els, opts);
        }
        exposeAddSlide(opts, els);
        return opts;
    }
    function saveOriginalOpts(opts) {
        opts.original = {
            before: [],
            after: []
        };
        opts.original.cssBefore = $.extend({}, opts.cssBefore);
        opts.original.cssAfter = $.extend({}, opts.cssAfter);
        opts.original.animIn = $.extend({}, opts.animIn);
        opts.original.animOut = $.extend({}, opts.animOut);
        $.each(opts.before, function () {
            opts.original.before.push(this);
        });
        $.each(opts.after, function () {
            opts.original.after.push(this);
        });
    }
    function supportMultiTransitions(opts) {
        var txs = $.fn.cycle.transitions;
        if (opts.fx.indexOf(",") > 0) {
            opts.multiFx = true;
            opts.fxs = opts.fx.replace(/\s*/g, "").split(",");
            for (var i = 0; i < opts.fxs.length; i++) {
                var fx = opts.fxs[i];
                var tx = txs[fx];
                if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
                    log("discarding unknown transition: ", fx);
                    opts.fxs.splice(i, 1);
                    i--;
                }
            }
            if (!opts.fxs.length) {
                log("No valid transitions named; slideshow terminating.");
                return false;
            }
        } else {
            if (opts.fx == "all") {
                opts.multiFx = true;
                opts.fxs = [];
                for (p in txs) {
                    var tx = txs[p];
                    if (txs.hasOwnProperty(p) && $.isFunction(tx)) {
                        opts.fxs.push(p);
                    }
                }
            }
        }
        if (opts.multiFx && opts.randomizeEffects) {
            var r1 = Math.floor(Math.random() * 20) + 30;
            for (var i = 0; i < r1; i++) {
                var r2 = Math.floor(Math.random() * opts.fxs.length);
                opts.fxs.push(opts.fxs.splice(r2, 1)[0]);
            }
            log("randomized fx sequence: ", opts.fxs);
        }
        return true;
    }
    function exposeAddSlide(opts, els) {
        opts.addSlide = function (newSlide, prepend) {
            var $s = $(newSlide),
				s = $s[0];
            if (!opts.autostopCount) {
                opts.countdown++;
            }
            els[prepend ? "unshift" : "push"](s);
            if (opts.els) {
                opts.els[prepend ? "unshift" : "push"](s);
            }
            opts.slideCount = els.length;
            $s.css("position", "absolute");
            $s[prepend ? "prependTo" : "appendTo"](opts.$cont);
            if (prepend) {
                opts.currSlide++;
                opts.nextSlide++;
            }
            if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg) {
                clearTypeFix($s);
            }
            if (opts.fit && opts.width) {
                $s.width(opts.width);
            }
            if (opts.fit && opts.height && opts.height != "auto") {
                $slides.height(opts.height);
            }
            s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
            s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();
            $s.css(opts.cssBefore);
            if (opts.pager) {
                $.fn.cycle.createPagerAnchor(els.length - 1, s, $(opts.pager), els, opts);
            }
            if ($.isFunction(opts.onAddSlide)) {
                opts.onAddSlide($s);
            } else {
                $s.hide();
            }
        };
    }
    $.fn.cycle.resetState = function (opts, fx) {
        fx = fx || opts.fx;
        opts.before = [];
        opts.after = [];
        opts.cssBefore = $.extend({}, opts.original.cssBefore);
        opts.cssAfter = $.extend({}, opts.original.cssAfter);
        opts.animIn = $.extend({}, opts.original.animIn);
        opts.animOut = $.extend({}, opts.original.animOut);
        opts.fxFn = null;
        $.each(opts.original.before, function () {
            opts.before.push(this);
        });
        $.each(opts.original.after, function () {
            opts.after.push(this);
        });
        var init = $.fn.cycle.transitions[fx];
        if ($.isFunction(init)) {
            init(opts.$cont, $(opts.elements), opts);
        }
    };

    function go(els, opts, manual, fwd) {
        if (manual && opts.busy && opts.manualTrump) {
            $(els).stop(true, true);
            opts.busy = false;
        }
        if (opts.busy) {
            return;
        }
        var p = opts.$cont[0],
			curr = els[opts.currSlide],
			next = els[opts.nextSlide];
        if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual) {
            return;
        }
        if (!manual && !p.cyclePause && ((opts.autostop && (--opts.countdown <= 0)) || (opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
            if (opts.end) {
                opts.end(opts);
            }
            return;
        }
        if (manual || !p.cyclePause) {
            var fx = opts.fx;
            curr.cycleH = curr.cycleH || $(curr).height();
            curr.cycleW = curr.cycleW || $(curr).width();
            next.cycleH = next.cycleH || $(next).height();
            next.cycleW = next.cycleW || $(next).width();
            if (opts.multiFx) {
                if (opts.lastFx == undefined || ++opts.lastFx >= opts.fxs.length) {
                    opts.lastFx = 0;
                }
                fx = opts.fxs[opts.lastFx];
                opts.currFx = fx;
            }
            if (opts.oneTimeFx) {
                fx = opts.oneTimeFx;
                opts.oneTimeFx = null;
            }
            $.fn.cycle.resetState(opts, fx);
            if (opts.before.length) {
                $.each(opts.before, function (i, o) {
                    if (p.cycleStop != opts.stopCount) {
                        return;
                    }
                    o.apply(next, [curr, next, opts, fwd]);
                });
            }
            var after = function () {
                $.each(opts.after, function (i, o) {
                    if (p.cycleStop != opts.stopCount) {
                        return;
                    }
                    o.apply(next, [curr, next, opts, fwd]);
                });
            };
            if (opts.nextSlide != opts.currSlide) {
                opts.busy = 1;
                if (opts.fxFn) {
                    opts.fxFn(curr, next, opts, after, fwd);
                } else {
                    if ($.isFunction($.fn.cycle[opts.fx])) {
                        $.fn.cycle[opts.fx](curr, next, opts, after);
                    } else {
                        $.fn.cycle.custom(curr, next, opts, after, manual && opts.fastOnEvent);
                    }
                }
            }
            opts.lastSlide = opts.currSlide;
            if (opts.random) {
                opts.currSlide = opts.nextSlide;
                if (++opts.randomIndex == els.length) {
                    opts.randomIndex = 0;
                }
                opts.nextSlide = opts.randomMap[opts.randomIndex];
            } else {
                var roll = (opts.nextSlide + 1) == els.length;
                opts.nextSlide = roll ? 0 : opts.nextSlide + 1;
                opts.currSlide = roll ? els.length - 1 : opts.nextSlide - 1;
            }
            if (opts.pager) {
                $.fn.cycle.updateActivePagerLink(opts.pager, opts.currSlide);
            }
        }
        var ms = 0;
        if (opts.timeout && !opts.continuous) {
            ms = getTimeout(curr, next, opts, fwd);
        } else {
            if (opts.continuous && p.cyclePause) {
                ms = 10;
            }
        }
        if (ms > 0) {
            p.cycleTimeout = setTimeout(function () {
                go(els, opts, 0, !opts.rev);
            }, ms);
        }
    }
    $.fn.cycle.updateActivePagerLink = function (pager, currSlide) {
        $(pager).find("a").removeClass("activeSlide").filter("a:eq(" + currSlide + ")").addClass("activeSlide");
    };

    function getTimeout(curr, next, opts, fwd) {
        if (opts.timeoutFn) {
            var t = opts.timeoutFn(curr, next, opts, fwd);
            if (t !== false) {
                return t;
            }
        }
        return opts.timeout;
    }
    $.fn.cycle.next = function (opts) {
        advance(opts, opts.rev ? -1 : 1);
    };
    $.fn.cycle.prev = function (opts) {
        advance(opts, opts.rev ? 1 : -1);
    };

    function advance(opts, val) {
        var els = opts.elements;
        var p = opts.$cont[0],
			timeout = p.cycleTimeout;
        if (timeout) {
            clearTimeout(timeout);
            p.cycleTimeout = 0;
        }
        if (opts.random && val < 0) {
            opts.randomIndex--;
            if (--opts.randomIndex == -2) {
                opts.randomIndex = els.length - 2;
            } else {
                if (opts.randomIndex == -1) {
                    opts.randomIndex = els.length - 1;
                }
            }
            opts.nextSlide = opts.randomMap[opts.randomIndex];
        } else {
            if (opts.random) {
                if (++opts.randomIndex == els.length) {
                    opts.randomIndex = 0;
                }
                opts.nextSlide = opts.randomMap[opts.randomIndex];
            } else {
                opts.nextSlide = opts.currSlide + val;
                if (opts.nextSlide < 0) {
                    if (opts.nowrap) {
                        return false;
                    }
                    opts.nextSlide = els.length - 1;
                } else {
                    if (opts.nextSlide >= els.length) {
                        if (opts.nowrap) {
                            return false;
                        }
                        opts.nextSlide = 0;
                    }
                }
            }
        }
        if ($.isFunction(opts.prevNextClick)) {
            opts.prevNextClick(val > 0, opts.nextSlide, els[opts.nextSlide]);
        }
        go(els, opts, 1, val >= 0);
        return false;
    }
    function buildPager(els, opts) {
        var $p = $(opts.pager);
        $.each(els, function (i, o) {
            $.fn.cycle.createPagerAnchor(i, o, $p, els, opts);
        });
        $.fn.cycle.updateActivePagerLink(opts.pager, opts.startingSlide);
    }
    $.fn.cycle.createPagerAnchor = function (i, el, $p, els, opts) {
        var a = ($.isFunction(opts.pagerAnchorBuilder)) ? opts.pagerAnchorBuilder(i, el) : '<a href="#">' + (i + 1) + "</a>";
        if (!a) {
            return;
        }
        var $a = $(a);
        if ($a.parents("body").length == 0) {
            var arr = [];
            if ($p.length > 1) {
                $p.each(function () {
                    var $clone = $a.clone(true);
                    $(this).append($clone);
                    arr.push($clone);
                });
                $a = $(arr);
            } else {
                $a.appendTo($p);
            }
        }
        $a.bind(opts.pagerEvent, function () {
            opts.nextSlide = i;
            var p = opts.$cont[0],
				timeout = p.cycleTimeout;
            if (timeout) {
                clearTimeout(timeout);
                p.cycleTimeout = 0;
            }
            if ($.isFunction(opts.pagerClick)) {
                opts.pagerClick(opts.nextSlide, els[opts.nextSlide]);
            }
            go(els, opts, 1, opts.currSlide < i);
            return false;
        });
        if (opts.pauseOnPagerHover) {
            $a.hover(function () {
                opts.$cont[0].cyclePause++;
            }, function () {
                opts.$cont[0].cyclePause--;
            });
        }
    };
    $.fn.cycle.hopsFromLast = function (opts, fwd) {
        var hops, l = opts.lastSlide,
			c = opts.currSlide;
        if (fwd) {
            hops = c > l ? c - l : opts.slideCount - l;
        } else {
            hops = c < l ? l - c : l + opts.slideCount - c;
        }
        return hops;
    };

    function clearTypeFix($slides) {
        function hex(s) {
            s = parseInt(s).toString(16);
            return s.length < 2 ? "0" + s : s;
        }
        function getBg(e) {
            for (; e && e.nodeName.toLowerCase() != "html"; e = e.parentNode) {
                var v = $.css(e, "background-color");
                if (v.indexOf("rgb") >= 0) {
                    var rgb = v.match(/\d+/g);
                    return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
                }
                if (v && v != "transparent") {
                    return v;
                }
            }
            return "#ffffff";
        }
        $slides.each(function () {
            $(this).css("background-color", getBg(this));
        });
    }
    $.fn.cycle.commonReset = function (curr, next, opts, w, h, rev) {
        $(opts.elements).not(curr).hide();
        opts.cssBefore.opacity = 1;
        opts.cssBefore.display = "block";
        if (w !== false && next.cycleW > 0) {
            opts.cssBefore.width = next.cycleW;
        }
        if (h !== false && next.cycleH > 0) {
            opts.cssBefore.height = next.cycleH;
        }
        opts.cssAfter = opts.cssAfter || {};
        opts.cssAfter.display = "none";
        $(curr).css("zIndex", opts.slideCount + (rev === true ? 1 : 0));
        $(next).css("zIndex", opts.slideCount + (rev === true ? 0 : 1));
    };
    $.fn.cycle.custom = function (curr, next, opts, cb, speedOverride) {
        var $l = $(curr),
			$n = $(next);
        var speedIn = opts.speedIn,
			speedOut = opts.speedOut,
			easeIn = opts.easeIn,
			easeOut = opts.easeOut;
        $n.css(opts.cssBefore);
        if (speedOverride) {
            if (typeof speedOverride == "number") {
                speedIn = speedOut = speedOverride;
            } else {
                speedIn = speedOut = 1;
            }
            easeIn = easeOut = null;
        }
        var fn = function () {
            $n.animate(opts.animIn, speedIn, easeIn, cb);
        };
        $l.animate(opts.animOut, speedOut, easeOut, function () {
            if (opts.cssAfter) {
                $l.css(opts.cssAfter);
            }
            if (!opts.sync) {
                fn();
            }
        });
        if (opts.sync) {
            fn();
        }
    };
    $.fn.cycle.transitions = {
        fade: function ($cont, $slides, opts) {
            $slides.not(":eq(" + opts.currSlide + ")").css("opacity", 0);
            opts.before.push(function (curr, next, opts) {
                $.fn.cycle.commonReset(curr, next, opts);
                opts.cssBefore.opacity = 0;
            });
            opts.animIn = {
                opacity: 1
            };
            opts.animOut = {
                opacity: 0
            };
            opts.cssBefore = {
                top: 0,
                left: 0
            };
        }
    };
    $.fn.cycle.ver = function () {
        return ver;
    };
    $.fn.cycle.defaults = {
        fx: "fade",
        timeout: 4000,
        timeoutFn: null,
        continuous: 0,
        speed: 1000,
        speedIn: null,
        speedOut: null,
        next: null,
        prev: null,
        prevNextClick: null,
        pager: null,
        pagerClick: null,
        pagerEvent: "click",
        pagerAnchorBuilder: null,
        before: null,
        after: null,
        end: null,
        easing: null,
        easeIn: null,
        easeOut: null,
        shuffle: null,
        animIn: null,
        animOut: null,
        cssBefore: null,
        cssAfter: null,
        fxFn: null,
        height: "auto",
        startingSlide: 0,
        sync: 1,
        random: 0,
        fit: 0,
        containerResize: 1,
        pause: 0,
        pauseOnPagerHover: 0,
        autostop: 0,
        autostopCount: 0,
        delay: 0,
        slideExpr: null,
        cleartype: !$.support.opacity,
        nowrap: 0,
        fastOnEvent: 0,
        randomizeEffects: 1,
        rev: 0,
        manualTrump: true,
        requeueOnImageNotLoaded: true,
        requeueTimeout: 250
    };
})(jQuery);;
(function ($) {
    $.fn.cycle.transitions.scrollUp = function ($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push($.fn.cycle.commonReset);
        var h = $cont.height();
        opts.cssBefore = {
            top: h,
            left: 0
        };
        opts.cssFirst = {
            top: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            top: -h
        };
    };
    $.fn.cycle.transitions.scrollDown = function ($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push($.fn.cycle.commonReset);
        var h = $cont.height();
        opts.cssFirst = {
            top: 0
        };
        opts.cssBefore = {
            top: -h,
            left: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            top: h
        };
    };
    $.fn.cycle.transitions.scrollLeft = function ($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push($.fn.cycle.commonReset);
        var w = $cont.width();
        opts.cssFirst = {
            left: 0
        };
        opts.cssBefore = {
            left: w,
            top: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: 0 - w
        };
    };
    $.fn.cycle.transitions.scrollRight = function ($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push($.fn.cycle.commonReset);
        var w = $cont.width();
        opts.cssFirst = {
            left: 0
        };
        opts.cssBefore = {
            left: -w,
            top: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: w
        };
    };
    $.fn.cycle.transitions.scrollHorz = function ($cont, $slides, opts) {
        $cont.css("overflow", "hidden").width();
        opts.before.push(function (curr, next, opts, fwd) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.cssBefore.left = fwd ? (next.cycleW - 1) : (1 - next.cycleW);
            opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
        });
        opts.cssFirst = {
            left: 0
        };
        opts.cssBefore = {
            top: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            top: 0
        };
    };
    $.fn.cycle.transitions.scrollVert = function ($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push(function (curr, next, opts, fwd) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.cssBefore.top = fwd ? (1 - next.cycleH) : (next.cycleH - 1);
            opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
        });
        opts.cssFirst = {
            top: 0
        };
        opts.cssBefore = {
            left: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            left: 0
        };
    };
    $.fn.cycle.transitions.slideX = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $(opts.elements).not(curr).hide();
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.animIn.width = next.cycleW;
        });
        opts.cssBefore = {
            left: 0,
            top: 0,
            width: 0
        };
        opts.animIn = {
            width: "show"
        };
        opts.animOut = {
            width: 0
        };
    };
    $.fn.cycle.transitions.slideY = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $(opts.elements).not(curr).hide();
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.animIn.height = next.cycleH;
        });
        opts.cssBefore = {
            left: 0,
            top: 0,
            height: 0
        };
        opts.animIn = {
            height: "show"
        };
        opts.animOut = {
            height: 0
        };
    };
    $.fn.cycle.transitions.shuffle = function ($cont, $slides, opts) {
        var w = $cont.css("overflow", "visible").width();
        $slides.css({
            left: 0,
            top: 0
        });
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
        });
        opts.speed = opts.speed / 2;
        opts.random = 0;
        opts.shuffle = opts.shuffle || {
            left: -w,
            top: 15
        };
        opts.els = [];
        for (var i = 0; i < $slides.length; i++) {
            opts.els.push($slides[i]);
        }
        for (var i = 0; i < opts.currSlide; i++) {
            opts.els.push(opts.els.shift());
        }
        opts.fxFn = function (curr, next, opts, cb, fwd) {
            var $el = fwd ? $(curr) : $(next);
            $(next).css(opts.cssBefore);
            var count = opts.slideCount;
            $el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function () {
                var hops = $.fn.cycle.hopsFromLast(opts, fwd);
                for (var k = 0; k < hops; k++) {
                    fwd ? opts.els.push(opts.els.shift()) : opts.els.unshift(opts.els.pop());
                }
                if (fwd) {
                    for (var i = 0, len = opts.els.length; i < len; i++) {
                        $(opts.els[i]).css("z-index", len - i + count);
                    }
                } else {
                    var z = $(curr).css("z-index");
                    $el.css("z-index", parseInt(z) + 1 + count);
                }
                $el.animate({
                    left: 0,
                    top: 0
                }, opts.speedOut, opts.easeOut, function () {
                    $(fwd ? this : curr).hide();
                    if (cb) {
                        cb();
                    }
                });
            });
        };
        opts.cssBefore = {
            display: "block",
            opacity: 1,
            top: 0,
            left: 0
        };
    };
    $.fn.cycle.transitions.turnUp = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.cssBefore.top = next.cycleH;
            opts.animIn.height = next.cycleH;
        });
        opts.cssFirst = {
            top: 0
        };
        opts.cssBefore = {
            left: 0,
            height: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            height: 0
        };
    };
    $.fn.cycle.transitions.turnDown = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssFirst = {
            top: 0
        };
        opts.cssBefore = {
            left: 0,
            top: 0,
            height: 0
        };
        opts.animOut = {
            height: 0
        };
    };
    $.fn.cycle.transitions.turnLeft = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.cssBefore.left = next.cycleW;
            opts.animIn.width = next.cycleW;
        });
        opts.cssBefore = {
            top: 0,
            width: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            width: 0
        };
    };
    $.fn.cycle.transitions.turnRight = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.animIn.width = next.cycleW;
            opts.animOut.left = curr.cycleW;
        });
        opts.cssBefore = {
            top: 0,
            left: 0,
            width: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            width: 0
        };
    };
    $.fn.cycle.transitions.zoom = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, false, true);
            opts.cssBefore.top = next.cycleH / 2;
            opts.cssBefore.left = next.cycleW / 2;
            opts.animIn = {
                top: 0,
                left: 0,
                width: next.cycleW,
                height: next.cycleH
            };
            opts.animOut = {
                width: 0,
                height: 0,
                top: curr.cycleH / 2,
                left: curr.cycleW / 2
            };
        });
        opts.cssFirst = {
            top: 0,
            left: 0
        };
        opts.cssBefore = {
            width: 0,
            height: 0
        };
    };
    $.fn.cycle.transitions.fadeZoom = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, false);
            opts.cssBefore.left = next.cycleW / 2;
            opts.cssBefore.top = next.cycleH / 2;
            opts.animIn = {
                top: 0,
                left: 0,
                width: next.cycleW,
                height: next.cycleH
            };
        });
        opts.cssBefore = {
            width: 0,
            height: 0
        };
        opts.animOut = {
            opacity: 0
        };
    };
    $.fn.cycle.transitions.blindX = function ($cont, $slides, opts) {
        var w = $cont.css("overflow", "hidden").width();
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.width = next.cycleW;
            opts.animOut.left = curr.cycleW;
        });
        opts.cssBefore = {
            left: w,
            top: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: w
        };
    };
    $.fn.cycle.transitions.blindY = function ($cont, $slides, opts) {
        var h = $cont.css("overflow", "hidden").height();
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssBefore = {
            top: h,
            left: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            top: h
        };
    };
    $.fn.cycle.transitions.blindZ = function ($cont, $slides, opts) {
        var h = $cont.css("overflow", "hidden").height();
        var w = $cont.width();
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssBefore = {
            top: h,
            left: w
        };
        opts.animIn = {
            top: 0,
            left: 0
        };
        opts.animOut = {
            top: h,
            left: w
        };
    };
    $.fn.cycle.transitions.growX = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.cssBefore.left = this.cycleW / 2;
            opts.animIn = {
                left: 0,
                width: this.cycleW
            };
            opts.animOut = {
                left: 0
            };
        });
        opts.cssBefore = {
            width: 0,
            top: 0
        };
    };
    $.fn.cycle.transitions.growY = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.cssBefore.top = this.cycleH / 2;
            opts.animIn = {
                top: 0,
                height: this.cycleH
            };
            opts.animOut = {
                top: 0
            };
        });
        opts.cssBefore = {
            height: 0,
            left: 0
        };
    };
    $.fn.cycle.transitions.curtainX = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true, true);
            opts.cssBefore.left = next.cycleW / 2;
            opts.animIn = {
                left: 0,
                width: this.cycleW
            };
            opts.animOut = {
                left: curr.cycleW / 2,
                width: 0
            };
        });
        opts.cssBefore = {
            top: 0,
            width: 0
        };
    };
    $.fn.cycle.transitions.curtainY = function ($cont, $slides, opts) {
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false, true);
            opts.cssBefore.top = next.cycleH / 2;
            opts.animIn = {
                top: 0,
                height: next.cycleH
            };
            opts.animOut = {
                top: curr.cycleH / 2,
                height: 0
            };
        });
        opts.cssBefore = {
            left: 0,
            height: 0
        };
    };
    $.fn.cycle.transitions.cover = function ($cont, $slides, opts) {
        var d = opts.direction || "left";
        var w = $cont.css("overflow", "hidden").width();
        var h = $cont.height();
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            if (d == "right") {
                opts.cssBefore.left = -w;
            } else {
                if (d == "up") {
                    opts.cssBefore.top = h;
                } else {
                    if (d == "down") {
                        opts.cssBefore.top = -h;
                    } else {
                        opts.cssBefore.left = w;
                    }
                }
            }
        });
        opts.animIn = {
            left: 0,
            top: 0
        };
        opts.animOut = {
            opacity: 1
        };
        opts.cssBefore = {
            top: 0,
            left: 0
        };
    };
    $.fn.cycle.transitions.uncover = function ($cont, $slides, opts) {
        var d = opts.direction || "left";
        var w = $cont.css("overflow", "hidden").width();
        var h = $cont.height();
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
            if (d == "right") {
                opts.animOut.left = w;
            } else {
                if (d == "up") {
                    opts.animOut.top = -h;
                } else {
                    if (d == "down") {
                        opts.animOut.top = h;
                    } else {
                        opts.animOut.left = -w;
                    }
                }
            }
        });
        opts.animIn = {
            left: 0,
            top: 0
        };
        opts.animOut = {
            opacity: 1
        };
        opts.cssBefore = {
            top: 0,
            left: 0
        };
    };
    $.fn.cycle.transitions.toss = function ($cont, $slides, opts) {
        var w = $cont.css("overflow", "visible").width();
        var h = $cont.height();
        opts.before.push(function (curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
            if (!opts.animOut.left && !opts.animOut.top) {
                opts.animOut = {
                    left: w * 2,
                    top: -h / 2,
                    opacity: 0
                };
            } else {
                opts.animOut.opacity = 0;
            }
        });
        opts.cssBefore = {
            left: 0,
            top: 0
        };
        opts.animIn = {
            left: 0
        };
    };
    $.fn.cycle.transitions.wipe = function ($cont, $slides, opts) {
        var w = $cont.css("overflow", "hidden").width();
        var h = $cont.height();
        opts.cssBefore = opts.cssBefore || {};
        var clip;
        if (opts.clip) {
            if (/l2r/.test(opts.clip)) {
                clip = "rect(0px 0px " + h + "px 0px)";
            } else {
                if (/r2l/.test(opts.clip)) {
                    clip = "rect(0px " + w + "px " + h + "px " + w + "px)";
                } else {
                    if (/t2b/.test(opts.clip)) {
                        clip = "rect(0px " + w + "px 0px 0px)";
                    } else {
                        if (/b2t/.test(opts.clip)) {
                            clip = "rect(" + h + "px " + w + "px " + h + "px 0px)";
                        } else {
                            if (/zoom/.test(opts.clip)) {
                                var t = parseInt(h / 2);
                                var l = parseInt(w / 2);
                                clip = "rect(" + t + "px " + l + "px " + t + "px " + l + "px)";
                            }
                        }
                    }
                }
            }
        }
        opts.cssBefore.clip = opts.cssBefore.clip || clip || "rect(0px 0px 0px 0px)";
        var d = opts.cssBefore.clip.match(/(\d+)/g);
        var t = parseInt(d[0]),
			r = parseInt(d[1]),
			b = parseInt(d[2]),
			l = parseInt(d[3]);
        opts.before.push(function (curr, next, opts) {
            if (curr == next) {
                return;
            }
            var $curr = $(curr),
				$next = $(next);
            $.fn.cycle.commonReset(curr, next, opts, true, true, false);
            opts.cssAfter.display = "block";
            var step = 1,
				count = parseInt((opts.speedIn / 13)) - 1;
            (function f() {
                var tt = t ? t - parseInt(step * (t / count)) : 0;
                var ll = l ? l - parseInt(step * (l / count)) : 0;
                var bb = b < h ? b + parseInt(step * ((h - b) / count || 1)) : h;
                var rr = r < w ? r + parseInt(step * ((w - r) / count || 1)) : w;
                $next.css({
                    clip: "rect(" + tt + "px " + rr + "px " + bb + "px " + ll + "px)"
                });
                (step++ <= count) ? setTimeout(f, 13) : $curr.css("display", "none");
            })();
        });
        opts.cssBefore = {
            display: "block",
            opacity: 1,
            top: 0,
            left: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: 0
        };
    };
})(jQuery);

;

/* --- END CONTENTS OF ./javascripts/jquery/jquery.cycle.js --- */

/* --- CONTENTS OF ./javascripts/video.js --- */


(function (window, undefined) {
    var document = window.document;
    (function () {
        var initializing = false,
			fnTest = /xyz/.test(function () {
			    xyz;
			}) ? /\b_super\b/ : /.*/;
        this.JRClass = function () { };
        JRClass.extend = function (prop) {
            var _super = this.prototype;
            initializing = true;
            var prototype = new this();
            initializing = false;
            for (var name in prop) {
                prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function (name, fn) {
                    return function () {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, prop[name]) : prop[name];
            }
            function JRClass() {
                if (!initializing && this.init) this.init.apply(this, arguments);
            }
            JRClass.prototype = prototype;
            JRClass.constructor = JRClass;
            JRClass.extend = arguments.callee;
            return JRClass;
        };
    })();
    var VideoJS = JRClass.extend({
        init: function (element, setOptions) {
            if (typeof element == 'string') {
                this.video = document.getElementById(element);
            } else {
                this.video = element;
            }
            this.video.player = this;
            this.values = {};
            this.elements = {};
            this.options = {
                autoplay: false,
                preload: true,
                useBuiltInControls: false,
                controlsBelow: false,
                controlsAtStart: false,
                controlsHiding: true,
                defaultVolume: 0.85,
                playerFallbackOrder: ["html5", "flash", "links"],
                flashPlayer: "htmlObject",
                flashPlayerVersion: false
            };
            if (typeof VideoJS.options == "object") {
                _V_.merge(this.options, VideoJS.options);
            }
            if (typeof setOptions == "object") {
                _V_.merge(this.options, setOptions);
            }
            if (this.getPreloadAttribute() !== undefined) {
                this.options.preload = this.getPreloadAttribute();
            }
            if (this.getAutoplayAttribute() !== undefined) {
                this.options.autoplay = this.getAutoplayAttribute();
            }
            this.box = this.video.parentNode;
            this.linksFallback = this.getLinksFallback();
            this.hideLinksFallback();
            this.showBigButton = true;
            this.each(this.options.playerFallbackOrder, function (playerType) {
                if (this[playerType + "Supported"]()) {
                    this[playerType + "Init"]();
                    return true;
                }
            });
            this.activateElement(this, "player");
            this.activateElement(this.box, "box");
        },
        behaviors: {},
        newBehavior: function (name, activate, functions) {
            this.behaviors[name] = activate;
            this.extend(functions);
        },
        activateElement: function (element, behavior) {
            if (typeof element == "string") {
                element = document.getElementById(element);
            }
            this.behaviors[behavior].call(this, element);
        },
        errors: [],
        warnings: [],
        warning: function (warning) {
            this.warnings.push(warning);
            this.log(warning);
        },
        history: [],
        log: function (event) {
            if (!event) {
                return;
            }
            if (typeof event == "string") {
                event = {
                    type: event
                };
            }
            if (event.type) {
                this.history.push(event.type);
            }
            if (this.history.length >= 50) {
                this.history.shift();
            }
            try {
                console.log(event.type);
            } catch (e) {
                try {
                    opera.postError(event.type);
                } catch (e) { }
            }
        },
        setLocalStorage: function (key, value) {
            if (!localStorage) {
                return;
            }
            try {
                localStorage[key] = value;
            } catch (e) {
                if (e.code == 22 || e.code == 1014) {
                    this.warning(VideoJS.warnings.localStorageFull);
                }
            }
        },
        getPreloadAttribute: function () {
            if (typeof this.video.hasAttribute == "function" && this.video.hasAttribute("preload")) {
                var preload = this.video.getAttribute("preload");
                if (preload === "" || preload === "true") {
                    return "auto";
                }
                if (preload === "false") {
                    return "none";
                }
                return preload;
            }
        },
        getAutoplayAttribute: function () {
            if (typeof this.video.hasAttribute == "function" && this.video.hasAttribute("autoplay")) {
                var autoplay = this.video.getAttribute("autoplay");
                if (autoplay === "false") {
                    return false;
                }
                return true;
            }
        },
        bufferedPercent: function () {
            return (this.duration()) ? this.buffered()[1] / this.duration() : 0;
        },
        each: function (arr, fn) {
            if (!arr || arr.length === 0) {
                return;
            }
            for (var i = 0, j = arr.length; i < j; i++) {
                if (fn.call(this, arr[i], i)) {
                    break;
                }
            }
        },
        extend: function (obj) {
            for (var attrname in obj) {
                if (obj.hasOwnProperty(attrname)) {
                    this[attrname] = obj[attrname];
                }
            }
        }
    });
    VideoJS.player = VideoJS.prototype;
    VideoJS.player.extend({
        flashSupported: function () {
            if (!this.flashElement) {
                this.flashElement = this.getFlashElement();
            }
            if (this.flashElement && this.flashPlayerVersionSupported()) {
                return true;
            } else {
                return false;
            }
        },
        flashInit: function () {
            this.replaceWithFlash();
            this.element = this.flashElement;
            this.video.src = "";
            var flashPlayerType = VideoJS.flashPlayers[this.options.flashPlayer];
            this.extend(VideoJS.flashPlayers[this.options.flashPlayer].api);
            (flashPlayerType.init.context(this))();
        },
        getFlashElement: function () {
            var children = this.video.children;
            for (var i = 0, j = children.length; i < j; i++) {
                if (children[i].className == "vjs-flash-fallback") {
                    return children[i];
                }
            }
        },
        replaceWithFlash: function () {
            if (this.flashElement) {
                this.box.insertBefore(this.flashElement, this.video);
                this.video.style.display = "none";
                this.showBigButton = false;
            }
        },
        flashPlayerVersionSupported: function () {
            var playerVersion = (this.options.flashPlayerVersion) ? this.options.flashPlayerVersion : VideoJS.flashPlayers[this.options.flashPlayer].flashPlayerVersion;
            return VideoJS.getFlashVersion() >= playerVersion;
        }
    });
    VideoJS.flashPlayers = {};
    VideoJS.flashPlayers.htmlObject = {
        flashPlayerVersion: 9,
        init: function () {
            return true;
        },
        api: {
            width: function (width) {
                if (width !== undefined) {
                    this.element.width = width;
                    this.box.style.width = width + "px";
                    this.triggerResizeListeners();
                    return this;
                }
                return this.element.width;
            },
            height: function (height) {
                if (height !== undefined) {
                    this.element.height = height;
                    this.box.style.height = height + "px";
                    this.triggerResizeListeners();
                    return this;
                }
                return this.element.height;
            }
        }
    };
    VideoJS.player.extend({
        linksSupported: function () {
            return true;
        },
        linksInit: function () {
            this.showLinksFallback();
            this.element = this.video;
        },
        getLinksFallback: function () {
            return this.box.getElementsByTagName("P")[0];
        },
        hideLinksFallback: function () {
            if (this.linksFallback) {
                this.linksFallback.style.display = "none";
            }
        },
        showLinksFallback: function () {
            if (this.linksFallback) {
                this.linksFallback.style.display = "block";
            }
        }
    });
    VideoJS.merge = function (obj1, obj2, safe) {
        for (var attrname in obj2) {
            if (obj2.hasOwnProperty(attrname) && (!safe || !obj1.hasOwnProperty(attrname))) {
                obj1[attrname] = obj2[attrname];
            }
        }
        return obj1;
    };
    VideoJS.extend = function (obj) {
        this.merge(this, obj, true);
    };
    VideoJS.extend({
        setupAllWhenReady: function (options) {
            VideoJS.options = options;
            VideoJS.DOMReady(VideoJS.setup);
        },
        DOMReady: function (fn) {
            VideoJS.addToDOMReady(fn);
        },
        setup: function (videos, options) {
            var returnSingular = false,
				playerList = [],
				videoElement;
            if (!videos || videos == "All") {
                videos = VideoJS.getVideoJSTags();
            } else if (typeof videos != 'object' || videos.nodeType == 1) {
                videos = [videos];
                returnSingular = true;
            }
            for (var i = 0; i < videos.length; i++) {
                if (typeof videos[i] == 'string') {
                    videoElement = document.getElementById(videos[i]);
                } else {
                    videoElement = videos[i];
                }
                playerList.push(new VideoJS(videoElement, options));
            }
            return (returnSingular) ? playerList[0] : playerList;
        },
        getVideoJSTags: function () {
            var videoTags = document.getElementsByTagName("video"),
				videoJSTags = [],
				videoTag;
            for (var i = 0, j = videoTags.length; i < j; i++) {
                videoTag = videoTags[i];
                if (videoTag.className.indexOf("video-js") != -1) {
                    videoJSTags.push(videoTag);
                }
            }
            return videoJSTags;
        },
        browserSupportsVideo: function () {
            if (typeof VideoJS.videoSupport != "undefined") {
                return VideoJS.videoSupport;
            }
            VideoJS.videoSupport = !!document.createElement('video').canPlayType;
            return VideoJS.videoSupport;
        },
        getFlashVersion: function () {
            if (typeof VideoJS.flashVersion != "undefined") {
                return VideoJS.flashVersion;
            }
            var version = 0,
				desc;
            if (typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") {
                desc = navigator.plugins["Shockwave Flash"].description;
                if (desc && !(typeof navigator.mimeTypes != "undefined" && navigator.mimeTypes["application/x-shockwave-flash"] && !navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)) {
                    version = parseInt(desc.match(/^.*\s+([^\s]+)\.[^\s]+\s+[^\s]+$/)[1], 10);
                }
            } else if (typeof window.ActiveXObject != "undefined") {
                try {
                    var testObject = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    if (testObject) {
                        version = parseInt(testObject.GetVariable("$version").match(/^[^\s]+\s(\d+)/)[1], 10);
                    }
                } catch (e) { }
            }
            VideoJS.flashVersion = version;
            return VideoJS.flashVersion;
        },
        isIE: function () {
            return !+"\v1";
        },
        isIPad: function () {
            return navigator.userAgent.match(/iPad/i) !== null;
        },
        isIPhone: function () {
            return navigator.userAgent.match(/iPhone/i) !== null;
        },
        isIOS: function () {
            return VideoJS.isIPhone() || VideoJS.isIPad();
        },
        iOSVersion: function () {
            var match = navigator.userAgent.match(/OS (\d+)_/i);
            if (match && match[1]) {
                return match[1];
            }
        },
        isAndroid: function () {
            return navigator.userAgent.match(/Android/i) !== null;
        },
        androidVersion: function () {
            var match = navigator.userAgent.match(/Android (\d+)\./i);
            if (match && match[1]) {
                return match[1];
            }
        },
        warnings: {
            videoNotReady: "Video is not ready yet (try playing the video first).",
            localStorageFull: "Local Storage is Full"
        }
    });
    if (VideoJS.isIE()) {
        document.createElement("video");
    }
    window.VideoJS = window._V_ = VideoJS;
    VideoJS.player.extend({
        html5Supported: function () {
            if (VideoJS.browserSupportsVideo() && this.canPlaySource()) {
                return true;
            } else {
                return false;
            }
        },
        html5Init: function () {
            this.element = this.video;
            this.fixPreloading();
            this.supportProgressEvents();
            this.volume((localStorage && localStorage.volume) || this.options.defaultVolume);
            if (VideoJS.isIOS()) {
                this.options.useBuiltInControls = true;
                this.iOSInterface();
            } else if (VideoJS.isAndroid()) {
                this.options.useBuiltInControls = true;
                this.androidInterface();
            }
            if (!this.options.useBuiltInControls) {
                this.video.controls = false;
                if (this.options.controlsBelow) {
                    _V_.addClass(this.box, "vjs-controls-below");
                }
                this.activateElement(this.video, "playToggle");
                this.buildStylesCheckDiv();
                this.buildAndActivatePoster();
                this.buildBigPlayButton();
                this.buildAndActivateSpinner();
                this.buildAndActivateControlBar();
                this.loadInterface();
                this.getSubtitles();
            }
        },
        canPlaySource: function () {
            if (this.canPlaySourceResult) {
                return this.canPlaySourceResult;
            }
            var children = this.video.children;
            for (var i = 0, j = children.length; i < j; i++) {
                if (children[i].tagName.toUpperCase() == "SOURCE") {
                    var canPlay = this.video.canPlayType(children[i].type) || this.canPlayExt(children[i].src);
                    if (canPlay == "probably" || canPlay == "maybe") {
                        this.firstPlayableSource = children[i];
                        this.canPlaySourceResult = true;
                        return true;
                    }
                }
            }
            this.canPlaySourceResult = false;
            return false;
        },
        canPlayExt: function (src) {
            if (!src) {
                return "";
            }
            var match = src.match(/\.([^\.]+)$/);
            if (match && match[1]) {
                var ext = match[1].toLowerCase();
                if (VideoJS.isAndroid()) {
                    if (ext == "mp4" || ext == "m4v") {
                        return "maybe";
                    }
                } else if (VideoJS.isIOS()) {
                    if (ext == "m3u8") {
                        return "maybe";
                    }
                }
            }
            return "";
        },
        forceTheSource: function () {
            this.video.src = this.firstPlayableSource.src;
            this.video.load();
        },
        fixPreloading: function () {
            if (typeof this.video.hasAttribute == "function" && this.video.hasAttribute("preload") && this.video.preload != "none") {
                this.video.autobuffer = true;
            } else {
                this.video.autobuffer = false;
                this.video.preload = "none";
            }
        },
        supportProgressEvents: function (e) {
            _V_.addListener(this.video, 'progress', this.playerOnVideoProgress.context(this));
        },
        playerOnVideoProgress: function (event) {
            this.setBufferedFromProgress(event);
        },
        setBufferedFromProgress: function (event) {
            if (event.total > 0) {
                var newBufferEnd = (event.loaded / event.total) * this.duration();
                if (newBufferEnd > this.values.bufferEnd) {
                    this.values.bufferEnd = newBufferEnd;
                }
            }
        },
        iOSInterface: function () {
            if (VideoJS.iOSVersion() < 4) {
                this.forceTheSource();
            }
            if (VideoJS.isIPad()) {
                this.buildAndActivateSpinner();
            }
        },
        androidInterface: function () {
            this.forceTheSource();
            _V_.addListener(this.video, "click", function () {
                this.play();
            });
            this.buildBigPlayButton();
            _V_.addListener(this.bigPlayButton, "click", function () {
                this.play();
            }.context(this));
            this.positionBox();
            this.showBigPlayButtons();
        },
        loadInterface: function () {
            if (!this.stylesHaveLoaded()) {
                if (!this.positionRetries) {
                    this.positionRetries = 1;
                }
                if (this.positionRetries++ < 100) {
                    setTimeout(this.loadInterface.context(this), 10);
                    return;
                }
            }
            this.hideStylesCheckDiv();
            this.showPoster();
            if (this.video.paused !== false) {
                this.showBigPlayButtons();
            }
            if (this.options.controlsAtStart) {
                this.showControlBars();
            }
            this.positionAll();
        },
        buildAndActivateControlBar: function () {
            this.controls = _V_.createElement("div", {
                className: "vjs-controls"
            });
            this.box.appendChild(this.controls);
            this.activateElement(this.controls, "controlBar");
            this.activateElement(this.controls, "mouseOverVideoReporter");
            this.playControl = _V_.createElement("div", {
                className: "vjs-play-control",
                innerHTML: "<span></span>"
            });
            this.controls.appendChild(this.playControl);
            this.activateElement(this.playControl, "playToggle");
            this.progressControl = _V_.createElement("div", {
                className: "vjs-progress-control"
            });
            this.controls.appendChild(this.progressControl);
            this.progressHolder = _V_.createElement("div", {
                className: "vjs-progress-holder"
            });
            this.progressControl.appendChild(this.progressHolder);
            this.activateElement(this.progressHolder, "currentTimeScrubber");
            this.loadProgressBar = _V_.createElement("div", {
                className: "vjs-load-progress"
            });
            this.progressHolder.appendChild(this.loadProgressBar);
            this.activateElement(this.loadProgressBar, "loadProgressBar");
            this.playProgressBar = _V_.createElement("div", {
                className: "vjs-play-progress"
            });
            this.progressHolder.appendChild(this.playProgressBar);
            this.activateElement(this.playProgressBar, "playProgressBar");
            this.timeControl = _V_.createElement("div", {
                className: "vjs-time-control"
            });
            this.controls.appendChild(this.timeControl);
            this.currentTimeDisplay = _V_.createElement("span", {
                className: "vjs-current-time-display",
                innerHTML: "00:00"
            });
            this.timeControl.appendChild(this.currentTimeDisplay);
            this.activateElement(this.currentTimeDisplay, "currentTimeDisplay");
            this.timeSeparator = _V_.createElement("span", {
                innerHTML: " / "
            });
            this.timeControl.appendChild(this.timeSeparator);
            this.durationDisplay = _V_.createElement("span", {
                className: "vjs-duration-display",
                innerHTML: "00:00"
            });
            this.timeControl.appendChild(this.durationDisplay);
            this.activateElement(this.durationDisplay, "durationDisplay");
            this.volumeControl = _V_.createElement("div", {
                className: "vjs-volume-control",
                innerHTML: "<div><span></span><span></span><span></span><span></span><span></span><span></span></div>"
            });
            this.controls.appendChild(this.volumeControl);
            this.activateElement(this.volumeControl, "volumeScrubber");
            this.volumeDisplay = this.volumeControl.children[0];
            this.activateElement(this.volumeDisplay, "volumeDisplay");
            this.fullscreenControl = _V_.createElement("div", {
                className: "vjs-fullscreen-control",
                innerHTML: "<div><span></span><span></span><span></span><span></span></div>"
            });
            this.controls.appendChild(this.fullscreenControl);
            this.activateElement(this.fullscreenControl, "fullscreenToggle");
        },
        buildAndActivatePoster: function () {
            this.updatePosterSource();
            if (this.video.poster) {
                this.poster = document.createElement("img");
                this.box.appendChild(this.poster);
                this.poster.src = this.video.poster;
                this.poster.className = "vjs-poster";
                this.activateElement(this.poster, "poster");
            } else {
                this.poster = false;
            }
        },
        buildBigPlayButton: function () {
            if (this.showBigButton) {
                this.bigPlayButton = _V_.createElement("div", {
                    className: "vjs-big-play-button",
                    innerHTML: "<span></span>"
                });
            }
        },
        buildAndActivateSpinner: function () {
            this.spinner = _V_.createElement("div", {
                className: "vjs-spinner",
                innerHTML: "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>"
            });
            this.box.appendChild(this.spinner);
            this.activateElement(this.spinner, "spinner");
        },
        buildStylesCheckDiv: function () {
            this.stylesCheckDiv = _V_.createElement("div", {
                className: "vjs-styles-check"
            });
            this.stylesCheckDiv.style.position = "absolute";
            this.box.appendChild(this.stylesCheckDiv);
        },
        hideStylesCheckDiv: function () {
            this.stylesCheckDiv.style.display = "none";
        },
        stylesHaveLoaded: function () {
            if (this.stylesCheckDiv.offsetHeight != 5) {
                return false;
            } else {
                return true;
            }
        },
        positionAll: function () {
            this.positionBox();
            this.positionControlBars();
            this.positionPoster();
        },
        positionBox: function () {
            if (this.videoIsFullScreen) {
                this.box.style.width = "";
                this.element.style.height = "";
                if (this.options.controlsBelow) {
                    this.box.style.height = "";
                    this.element.style.height = (this.box.offsetHeight - this.controls.offsetHeight) + "px";
                }
            } else {
                this.box.style.width = this.width() + "px";
                this.element.style.height = this.height() + "px";
                if (this.options.controlsBelow) {
                    this.element.style.height = "";
                }
            }
        },
        getSubtitles: function () {
            var tracks = this.video.getElementsByTagName("TRACK");
            for (var i = 0, j = tracks.length; i < j; i++) {
                if (tracks[i].getAttribute("kind") == "subtitles" && tracks[i].getAttribute("src")) {
                    this.subtitlesSource = tracks[i].getAttribute("src");
                    this.loadSubtitles();
                    this.buildSubtitles();
                }
            }
        },
        loadSubtitles: function () {
            _V_.get(this.subtitlesSource, this.parseSubtitles.context(this));
        },
        parseSubtitles: function (subText) {
            var lines = subText.split("\n"),
				line = "",
				subtitle, time, text;
            this.subtitles = [];
            this.currentSubtitle = false;
            this.lastSubtitleIndex = 0;
            for (var i = 0; i < lines.length; i++) {
                line = _V_.trim(lines[i]);
                if (line) {
                    subtitle = {
                        id: line,
                        index: this.subtitles.length
                    };
                    line = _V_.trim(lines[++i]);
                    time = line.split(" --> ");
                    subtitle.start = this.parseSubtitleTime(time[0]);
                    subtitle.end = this.parseSubtitleTime(time[1]);
                    text = [];
                    for (var j = i; j < lines.length; j++) {
                        line = _V_.trim(lines[++i]);
                        if (!line) {
                            break;
                        }
                        text.push(line);
                    }
                    subtitle.text = text.join('<br/>');
                    this.subtitles.push(subtitle);
                }
            }
        },
        parseSubtitleTime: function (timeText) {
            var parts = timeText.split(':'),
				time = 0;
            time += parseFloat(parts[0]) * 60 * 60;
            time += parseFloat(parts[1]) * 60;
            var seconds = parts[2].split(/\.|,/);
            time += parseFloat(seconds[0]);
            ms = parseFloat(seconds[1]);
            if (ms) {
                time += ms / 1000;
            }
            return time;
        },
        buildSubtitles: function () {
            this.subtitlesDisplay = _V_.createElement("div", {
                className: 'vjs-subtitles'
            });
            this.box.appendChild(this.subtitlesDisplay);
            this.activateElement(this.subtitlesDisplay, "subtitlesDisplay");
        },
        addVideoListener: function (type, fn) {
            _V_.addListener(this.video, type, fn.rEvtContext(this));
        },
        play: function () {
            this.video.play();
            return this;
        },
        onPlay: function (fn) {
            this.addVideoListener("play", fn);
            return this;
        },
        pause: function () {
            this.video.pause();
            return this;
        },
        onPause: function (fn) {
            this.addVideoListener("pause", fn);
            return this;
        },
        paused: function () {
            return this.video.paused;
        },
        currentTime: function (seconds) {
            if (seconds !== undefined) {
                try {
                    this.video.currentTime = seconds;
                } catch (e) {
                    this.warning(VideoJS.warnings.videoNotReady);
                }
                this.values.currentTime = seconds;
                return this;
            }
            return this.video.currentTime;
        },
        onCurrentTimeUpdate: function (fn) {
            this.currentTimeListeners.push(fn);
        },
        duration: function () {
            return this.video.duration;
        },
        buffered: function () {
            if (this.values.bufferStart === undefined) {
                this.values.bufferStart = 0;
                this.values.bufferEnd = 0;
            }
            if (this.video.buffered && this.video.buffered.length > 0) {
                var newEnd = this.video.buffered.end(0);
                if (newEnd > this.values.bufferEnd) {
                    this.values.bufferEnd = newEnd;
                }
            }
            return [this.values.bufferStart, this.values.bufferEnd];
        },
        volume: function (percentAsDecimal) {
            if (percentAsDecimal !== undefined) {
                this.values.volume = Math.max(0, Math.min(1, parseFloat(percentAsDecimal)));
                this.video.volume = this.values.volume;
                this.setLocalStorage("volume", this.values.volume);
                return this;
            }
            if (this.values.volume) {
                return this.values.volume;
            }
            return this.video.volume;
        },
        onVolumeChange: function (fn) {
            _V_.addListener(this.video, 'volumechange', fn.rEvtContext(this));
        },
        width: function (width) {
            if (width !== undefined) {
                this.video.width = width;
                this.box.style.width = width + "px";
                this.triggerResizeListeners();
                return this;
            }
            return this.video.offsetWidth;
        },
        height: function (height) {
            if (height !== undefined) {
                this.video.height = height;
                this.box.style.height = height + "px";
                this.triggerResizeListeners();
                return this;
            }
            return this.video.offsetHeight;
        },
        supportsFullScreen: function () {
            if (typeof this.video.webkitEnterFullScreen == 'function') {
                if (!navigator.userAgent.match("Chrome") && !navigator.userAgent.match("Mac OS X 10.5")) {
                    return true;
                }
            }
            return false;
        },
        html5EnterNativeFullScreen: function () {
            try {
                this.video.webkitEnterFullScreen();
            } catch (e) {
                if (e.code == 11) {
                    this.warning(VideoJS.warnings.videoNotReady);
                }
            }
            return this;
        },
        enterFullScreen: function () {
            if (this.supportsFullScreen()) {
                this.html5EnterNativeFullScreen();
            } else {
                this.enterFullWindow();
            }
        },
        exitFullScreen: function () {
            if (this.supportsFullScreen()) { } else {
                this.exitFullWindow();
            }
        },
        enterFullWindow: function () {
            this.videoIsFullScreen = true;
            this.docOrigOverflow = document.documentElement.style.overflow;
            _V_.addListener(document, "keydown", this.fullscreenOnEscKey.rEvtContext(this));
            _V_.addListener(window, "resize", this.fullscreenOnWindowResize.rEvtContext(this));
            document.documentElement.style.overflow = 'hidden';
            _V_.addClass(this.box, "vjs-fullscreen");
            this.positionAll();
        },
        exitFullWindow: function () {
            this.videoIsFullScreen = false;
            document.removeEventListener("keydown", this.fullscreenOnEscKey, false);
            window.removeEventListener("resize", this.fullscreenOnWindowResize, false);
            document.documentElement.style.overflow = this.docOrigOverflow;
            _V_.removeClass(this.box, "vjs-fullscreen");
            this.positionAll();
        },
        onError: function (fn) {
            this.addVideoListener("error", fn);
            return this;
        },
        onEnded: function (fn) {
            this.addVideoListener("ended", fn);
            return this;
        }
    });
    VideoJS.player.newBehavior("player", function (player) {
        this.onError(this.playerOnVideoError);
        this.onPlay(this.playerOnVideoPlay);
        this.onPlay(this.trackCurrentTime);
        this.onPause(this.playerOnVideoPause);
        this.onPause(this.stopTrackingCurrentTime);
        this.onEnded(this.playerOnVideoEnded);
        this.trackBuffered();
        this.onBufferedUpdate(this.isBufferFull);
    }, {
        playerOnVideoError: function (event) {
            this.log(event);
            this.log(this.video.error);
        },
        playerOnVideoPlay: function (event) {
            this.hasPlayed = true;
        },
        playerOnVideoPause: function (event) { },
        playerOnVideoEnded: function (event) {
            this.currentTime(0);
            this.pause();
        },
        trackBuffered: function () {
            this.bufferedInterval = setInterval(this.triggerBufferedListeners.context(this), 500);
        },
        stopTrackingBuffered: function () {
            clearInterval(this.bufferedInterval);
        },
        bufferedListeners: [],
        onBufferedUpdate: function (fn) {
            this.bufferedListeners.push(fn);
        },
        triggerBufferedListeners: function () {
            this.isBufferFull();
            this.each(this.bufferedListeners, function (listener) {
                (listener.context(this))();
            });
        },
        isBufferFull: function () {
            if (this.bufferedPercent() == 1) {
                this.stopTrackingBuffered();
            }
        },
        trackCurrentTime: function () {
            if (this.currentTimeInterval) {
                clearInterval(this.currentTimeInterval);
            }
            this.currentTimeInterval = setInterval(this.triggerCurrentTimeListeners.context(this), 100);
            this.trackingCurrentTime = true;
        },
        stopTrackingCurrentTime: function () {
            clearInterval(this.currentTimeInterval);
            this.trackingCurrentTime = false;
        },
        currentTimeListeners: [],
        triggerCurrentTimeListeners: function (late, newTime) {
            this.each(this.currentTimeListeners, function (listener) {
                (listener.context(this))(newTime || this.currentTime());
            });
        },
        resizeListeners: [],
        onResize: function (fn) {
            this.resizeListeners.push(fn);
        },
        triggerResizeListeners: function () {
            this.each(this.resizeListeners, function (listener) {
                (listener.context(this))();
            });
        }
    });
    VideoJS.player.newBehavior("mouseOverVideoReporter", function (element) {
        _V_.addListener(element, "mousemove", this.mouseOverVideoReporterOnMouseMove.context(this));
        _V_.addListener(element, "mouseout", this.mouseOverVideoReporterOnMouseOut.context(this));
    }, {
        mouseOverVideoReporterOnMouseMove: function () {
            this.showControlBars();
            clearInterval(this.mouseMoveTimeout);
            this.mouseMoveTimeout = setTimeout(this.hideControlBars.context(this), 4000);
        },
        mouseOverVideoReporterOnMouseOut: function (event) {
            var parent = event.relatedTarget;
            while (parent && parent !== this.box) {
                parent = parent.parentNode;
            }
            if (parent !== this.box) {
                this.hideControlBars();
            }
        }
    });
    VideoJS.player.newBehavior("box", function (element) {
        this.positionBox();
        _V_.addClass(element, "vjs-paused");
        this.activateElement(element, "mouseOverVideoReporter");
        this.onPlay(this.boxOnVideoPlay);
        this.onPause(this.boxOnVideoPause);
    }, {
        boxOnVideoPlay: function () {
            _V_.removeClass(this.box, "vjs-paused");
            _V_.addClass(this.box, "vjs-playing");
        },
        boxOnVideoPause: function () {
            _V_.removeClass(this.box, "vjs-playing");
            _V_.addClass(this.box, "vjs-paused");
        }
    });
    VideoJS.player.newBehavior("poster", function (element) {
        this.activateElement(element, "mouseOverVideoReporter");
        this.activateElement(element, "playButton");
        this.onPlay(this.hidePoster);
        this.onEnded(this.showPoster);
        this.onResize(this.positionPoster);
    }, {
        showPoster: function () {
            if (!this.poster) {
                return;
            }
            this.poster.style.display = "block";
            this.positionPoster();
        },
        positionPoster: function () {
            if (!this.poster || this.poster.style.display == 'none') {
                return;
            }
            this.poster.style.height = this.height() + "px";
            this.poster.style.width = this.width() + "px";
        },
        hidePoster: function () {
            if (!this.poster) {
                return;
            }
            this.poster.style.display = "none";
        },
        updatePosterSource: function () {
            if (!this.video.poster) {
                var images = this.video.getElementsByTagName("img");
                if (images.length > 0) {
                    this.video.poster = images[0].src;
                }
            }
        }
    });
    VideoJS.player.newBehavior("controlBar", function (element) {
        if (!this.controlBars) {
            this.controlBars = [];
            this.onResize(this.positionControlBars);
        }
        this.controlBars.push(element);
        _V_.addListener(element, "mousemove", this.onControlBarsMouseMove.context(this));
        _V_.addListener(element, "mouseout", this.onControlBarsMouseOut.context(this));
    }, {
        showControlBars: function () {
            if (!this.options.controlsAtStart && !this.hasPlayed) {
                return;
            }
            this.each(this.controlBars, function (bar) {
                bar.style.display = "block";
            });
        },
        positionControlBars: function () {
            this.updatePlayProgressBars();
            this.updateLoadProgressBars();
        },
        hideControlBars: function () {
            if (this.options.controlsHiding && !this.mouseIsOverControls) {
                this.each(this.controlBars, function (bar) {
                    bar.style.display = "none";
                });
            }
        },
        onControlBarsMouseMove: function () {
            this.mouseIsOverControls = true;
        },
        onControlBarsMouseOut: function (event) {
            this.mouseIsOverControls = false;
        }
    });
    VideoJS.player.newBehavior("playToggle", function (element) {
        if (!this.elements.playToggles) {
            this.elements.playToggles = [];
            this.onPlay(this.playTogglesOnPlay);
            this.onPause(this.playTogglesOnPause);
        }
        this.elements.playToggles.push(element);
        _V_.addListener(element, "click", this.onPlayToggleClick.context(this));
    }, {
        onPlayToggleClick: function (event) {
            if (this.paused()) {
                this.play();
            } else {
                this.pause();
            }
        },
        playTogglesOnPlay: function (event) {
            this.each(this.elements.playToggles, function (toggle) {
                _V_.removeClass(toggle, "vjs-paused");
                _V_.addClass(toggle, "vjs-playing");
            });
        },
        playTogglesOnPause: function (event) {
            this.each(this.elements.playToggles, function (toggle) {
                _V_.removeClass(toggle, "vjs-playing");
                _V_.addClass(toggle, "vjs-paused");
            });
        }
    });
    VideoJS.player.newBehavior("playButton", function (element) {
        _V_.addListener(element, "click", this.onPlayButtonClick.context(this));
    }, {
        onPlayButtonClick: function (event) {
            this.play();
        }
    });
    VideoJS.player.newBehavior("pauseButton", function (element) {
        _V_.addListener(element, "click", this.onPauseButtonClick.context(this));
    }, {
        onPauseButtonClick: function (event) {
            this.pause();
        }
    });
    VideoJS.player.newBehavior("playProgressBar", function (element) {
        if (!this.playProgressBars) {
            this.playProgressBars = [];
            this.onCurrentTimeUpdate(this.updatePlayProgressBars);
        }
        this.playProgressBars.push(element);
    }, {
        updatePlayProgressBars: function (newTime) {
            var progress = (newTime !== undefined) ? newTime / this.duration() : this.currentTime() / this.duration();
            if (isNaN(progress)) {
                progress = 0;
            }
            this.each(this.playProgressBars, function (bar) {
                if (bar.style) {
                    bar.style.width = _V_.round(progress * 100, 2) + "%";
                }
            });
        }
    });
    VideoJS.player.newBehavior("loadProgressBar", function (element) {
        if (!this.loadProgressBars) {
            this.loadProgressBars = [];
        }
        this.loadProgressBars.push(element);
        this.onBufferedUpdate(this.updateLoadProgressBars);
    }, {
        updateLoadProgressBars: function () {
            this.each(this.loadProgressBars, function (bar) {
                if (bar.style) {
                    bar.style.width = _V_.round(this.bufferedPercent() * 100, 2) + "%";
                }
            });
        }
    });
    VideoJS.player.newBehavior("currentTimeDisplay", function (element) {
        if (!this.currentTimeDisplays) {
            this.currentTimeDisplays = [];
            this.onCurrentTimeUpdate(this.updateCurrentTimeDisplays);
        }
        this.currentTimeDisplays.push(element);
    }, {
        updateCurrentTimeDisplays: function (newTime) {
            if (!this.currentTimeDisplays) {
                return;
            }
            var time = (newTime) ? newTime : this.currentTime();
            this.each(this.currentTimeDisplays, function (dis) {
                dis.innerHTML = _V_.formatTime(time);
            });
        }
    });
    VideoJS.player.newBehavior("durationDisplay", function (element) {
        if (!this.durationDisplays) {
            this.durationDisplays = [];
            this.onCurrentTimeUpdate(this.updateDurationDisplays);
        }
        this.durationDisplays.push(element);
    }, {
        updateDurationDisplays: function () {
            if (!this.durationDisplays) {
                return;
            }
            this.each(this.durationDisplays, function (dis) {
                if (this.duration()) {
                    dis.innerHTML = _V_.formatTime(this.duration());
                }
            });
        }
    });
    VideoJS.player.newBehavior("currentTimeScrubber", function (element) {
        _V_.addListener(element, "mousedown", this.onCurrentTimeScrubberMouseDown.rEvtContext(this));
    }, {
        onCurrentTimeScrubberMouseDown: function (event, scrubber) {
            event.preventDefault();
            this.currentScrubber = scrubber;
            this.stopTrackingCurrentTime();
            this.videoWasPlaying = !this.paused();
            this.pause();
            _V_.blockTextSelection();
            this.setCurrentTimeWithScrubber(event);
            _V_.addListener(document, "mousemove", this.onCurrentTimeScrubberMouseMove.rEvtContext(this));
            _V_.addListener(document, "mouseup", this.onCurrentTimeScrubberMouseUp.rEvtContext(this));
        },
        onCurrentTimeScrubberMouseMove: function (event) {
            this.setCurrentTimeWithScrubber(event);
        },
        onCurrentTimeScrubberMouseUp: function (event) {
            _V_.unblockTextSelection();
            document.removeEventListener("mousemove", this.onCurrentTimeScrubberMouseMove, false);
            document.removeEventListener("mouseup", this.onCurrentTimeScrubberMouseUp, false);
            if (this.videoWasPlaying) {
                this.play();
                this.trackCurrentTime();
            }
        },
        setCurrentTimeWithScrubber: function (event) {
            var newProgress = _V_.getRelativePosition(event.pageX, this.currentScrubber);
            var newTime = newProgress * this.duration();
            this.triggerCurrentTimeListeners(0, newTime);
            if (newTime == this.duration()) {
                newTime = newTime - 0.1;
            }
            this.currentTime(newTime);
        }
    });
    VideoJS.player.newBehavior("volumeDisplay", function (element) {
        if (!this.volumeDisplays) {
            this.volumeDisplays = [];
            this.onVolumeChange(this.updateVolumeDisplays);
        }
        this.volumeDisplays.push(element);
        this.updateVolumeDisplay(element);
    }, {
        updateVolumeDisplays: function () {
            if (!this.volumeDisplays) {
                return;
            }
            this.each(this.volumeDisplays, function (dis) {
                this.updateVolumeDisplay(dis);
            });
        },
        updateVolumeDisplay: function (display) {
            var volNum = Math.ceil(this.volume() * 6);
            this.each(display.children, function (child, num) {
                if (num < volNum) {
                    _V_.addClass(child, "vjs-volume-level-on");
                } else {
                    _V_.removeClass(child, "vjs-volume-level-on");
                }
            });
        }
    });
    VideoJS.player.newBehavior("volumeScrubber", function (element) {
        _V_.addListener(element, "mousedown", this.onVolumeScrubberMouseDown.rEvtContext(this));
    }, {
        onVolumeScrubberMouseDown: function (event, scrubber) {
            _V_.blockTextSelection();
            this.currentScrubber = scrubber;
            this.setVolumeWithScrubber(event);
            _V_.addListener(document, "mousemove", this.onVolumeScrubberMouseMove.rEvtContext(this));
            _V_.addListener(document, "mouseup", this.onVolumeScrubberMouseUp.rEvtContext(this));
        },
        onVolumeScrubberMouseMove: function (event) {
            this.setVolumeWithScrubber(event);
        },
        onVolumeScrubberMouseUp: function (event) {
            this.setVolumeWithScrubber(event);
            _V_.unblockTextSelection();
            document.removeEventListener("mousemove", this.onVolumeScrubberMouseMove, false);
            document.removeEventListener("mouseup", this.onVolumeScrubberMouseUp, false);
        },
        setVolumeWithScrubber: function (event) {
            var newVol = _V_.getRelativePosition(event.pageX, this.currentScrubber);
            this.volume(newVol);
        }
    });
    VideoJS.player.newBehavior("fullscreenToggle", function (element) {
        _V_.addListener(element, "click", this.onFullscreenToggleClick.context(this));
    }, {
        onFullscreenToggleClick: function (event) {
            if (!this.videoIsFullScreen) {
                this.enterFullScreen();
            } else {
                this.exitFullScreen();
            }
        },
        fullscreenOnWindowResize: function (event) {
            this.positionControlBars();
        },
        fullscreenOnEscKey: function (event) {
            if (event.keyCode == 27) {
                this.exitFullScreen();
            }
        }
    });
    VideoJS.player.newBehavior("bigPlayButton", function (element) {
        if (!this.elements.bigPlayButtons) {
            this.elements.bigPlayButtons = [];
            this.onPlay(this.bigPlayButtonsOnPlay);
            this.onEnded(this.bigPlayButtonsOnEnded);
        }
        this.elements.bigPlayButtons.push(element);
        this.activateElement(element, "playButton");
    }, {
        bigPlayButtonsOnPlay: function (event) {
            this.hideBigPlayButtons();
        },
        bigPlayButtonsOnEnded: function (event) {
            this.showBigPlayButtons();
        },
        showBigPlayButtons: function () {
            this.each(this.elements.bigPlayButtons, function (element) {
                element.style.display = "block";
            });
        },
        hideBigPlayButtons: function () {
            this.each(this.elements.bigPlayButtons, function (element) {
                element.style.display = "none";
            });
        }
    });
    VideoJS.player.newBehavior("spinner", function (element) {
        if (!this.spinners) {
            this.spinners = [];
            _V_.addListener(this.video, "loadeddata", this.spinnersOnVideoLoadedData.context(this));
            _V_.addListener(this.video, "loadstart", this.spinnersOnVideoLoadStart.context(this));
            _V_.addListener(this.video, "seeking", this.spinnersOnVideoSeeking.context(this));
            _V_.addListener(this.video, "seeked", this.spinnersOnVideoSeeked.context(this));
            _V_.addListener(this.video, "canplay", this.spinnersOnVideoCanPlay.context(this));
            _V_.addListener(this.video, "canplaythrough", this.spinnersOnVideoCanPlayThrough.context(this));
            _V_.addListener(this.video, "waiting", this.spinnersOnVideoWaiting.context(this));
            _V_.addListener(this.video, "stalled", this.spinnersOnVideoStalled.context(this));
            _V_.addListener(this.video, "suspend", this.spinnersOnVideoSuspend.context(this));
            _V_.addListener(this.video, "playing", this.spinnersOnVideoPlaying.context(this));
            _V_.addListener(this.video, "timeupdate", this.spinnersOnVideoTimeUpdate.context(this));
        }
        this.spinners.push(element);
    }, {
        showSpinners: function () {
            this.each(this.spinners, function (spinner) {
                spinner.style.display = "block";
            });
            clearInterval(this.spinnerInterval);
            this.spinnerInterval = setInterval(this.rotateSpinners.context(this), 100);
        },
        hideSpinners: function () {
            this.each(this.spinners, function (spinner) {
                spinner.style.display = "none";
            });
            clearInterval(this.spinnerInterval);
        },
        spinnersRotated: 0,
        rotateSpinners: function () {
            this.each(this.spinners, function (spinner) {
                spinner.style.WebkitTransform = 'scale(0.5) rotate(' + this.spinnersRotated + 'deg)';
                spinner.style.MozTransform = 'scale(0.5) rotate(' + this.spinnersRotated + 'deg)';
            });
            if (this.spinnersRotated == 360) {
                this.spinnersRotated = 0;
            }
            this.spinnersRotated += 45;
        },
        spinnersOnVideoLoadedData: function (event) {
            this.hideSpinners();
        },
        spinnersOnVideoLoadStart: function (event) {
            this.showSpinners();
        },
        spinnersOnVideoSeeking: function (event) { },
        spinnersOnVideoSeeked: function (event) { },
        spinnersOnVideoCanPlay: function (event) { },
        spinnersOnVideoCanPlayThrough: function (event) {
            this.hideSpinners();
        },
        spinnersOnVideoWaiting: function (event) {
            this.showSpinners();
        },
        spinnersOnVideoStalled: function (event) { },
        spinnersOnVideoSuspend: function (event) { },
        spinnersOnVideoPlaying: function (event) {
            this.hideSpinners();
        },
        spinnersOnVideoTimeUpdate: function (event) {
            if (this.spinner.style.display == "block") {
                this.hideSpinners();
            }
        }
    });
    VideoJS.player.newBehavior("subtitlesDisplay", function (element) {
        if (!this.subtitleDisplays) {
            this.subtitleDisplays = [];
            this.onCurrentTimeUpdate(this.subtitleDisplaysOnVideoTimeUpdate);
            this.onEnded(function () {
                this.lastSubtitleIndex = 0;
            }.context(this));
        }
        this.subtitleDisplays.push(element);
    }, {
        subtitleDisplaysOnVideoTimeUpdate: function (time) {
            if (this.subtitles) {
                if (!this.currentSubtitle || this.currentSubtitle.start >= time || this.currentSubtitle.end < time) {
                    var newSubIndex = false,
						reverse = (this.subtitles[this.lastSubtitleIndex].start > time),
						i = this.lastSubtitleIndex - (reverse) ? 1 : 0;
                    while (true) {
                        if (reverse) {
                            if (i < 0 || this.subtitles[i].end < time) {
                                break;
                            }
                            if (this.subtitles[i].start < time) {
                                newSubIndex = i;
                                break;
                            }
                            i--;
                        } else {
                            if (i >= this.subtitles.length || this.subtitles[i].start > time) {
                                break;
                            }
                            if (this.subtitles[i].end > time) {
                                newSubIndex = i;
                                break;
                            }
                            i++;
                        }
                    }
                    if (newSubIndex !== false) {
                        this.currentSubtitle = this.subtitles[newSubIndex];
                        this.lastSubtitleIndex = newSubIndex;
                        this.updateSubtitleDisplays(this.currentSubtitle.text);
                    } else if (this.currentSubtitle) {
                        this.currentSubtitle = false;
                        this.updateSubtitleDisplays("");
                    }
                }
            }
        },
        updateSubtitleDisplays: function (val) {
            this.each(this.subtitleDisplays, function (disp) {
                disp.innerHTML = val;
            });
        }
    });
    VideoJS.extend({
        addClass: function (element, classToAdd) {
            if ((" " + element.className + " ").indexOf(" " + classToAdd + " ") == -1) {
                element.className = element.className === "" ? classToAdd : element.className + " " + classToAdd;
            }
        },
        removeClass: function (element, classToRemove) {
            if (element.className.indexOf(classToRemove) == -1) {
                return;
            }
            var classNames = element.className.split(/\s+/);
            classNames.splice(classNames.lastIndexOf(classToRemove), 1);
            element.className = classNames.join(" ");
        },
        createElement: function (tagName, attributes) {
            return this.merge(document.createElement(tagName), attributes);
        },
        blockTextSelection: function () {
            document.body.focus();
            document.onselectstart = function () {
                return false;
            };
        },
        unblockTextSelection: function () {
            document.onselectstart = function () {
                return true;
            };
        },
        formatTime: function (secs) {
            var seconds = Math.round(secs);
            var minutes = Math.floor(seconds / 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
            seconds = Math.floor(seconds % 60);
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            return minutes + ":" + seconds;
        },
        getRelativePosition: function (x, relativeElement) {
            return Math.max(0, Math.min(1, (x - this.findPosX(relativeElement)) / relativeElement.offsetWidth));
        },
        findPosX: function (obj) {
            var curleft = obj.offsetLeft;
            while (obj = obj.offsetParent) {
                curleft += obj.offsetLeft;
            }
            return curleft;
        },
        getComputedStyleValue: function (element, style) {
            return window.getComputedStyle(element, null).getPropertyValue(style);
        },
        round: function (num, dec) {
            if (!dec) {
                dec = 0;
            }
            return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
        },
        addListener: function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            }
        },
        removeListener: function (element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.detachEvent("on" + type, handler);
            }
        },
        get: function (url, onSuccess) {
            if (typeof XMLHttpRequest == "undefined") {
                XMLHttpRequest = function () {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                    } catch (e) { }
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                    } catch (f) { }
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (g) { }
                    throw new Error("This browser does not support XMLHttpRequest.");
                };
            }
            var request = new XMLHttpRequest();
            request.open("GET", url);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    onSuccess(request.responseText);
                }
            }.context(this);
            request.send();
        },
        trim: function (string) {
            return string.toString().replace(/^\s+/, "").replace(/\s+$/, "");
        },
        bindDOMReady: function () {
            if (document.readyState === "complete") {
                return VideoJS.onDOMReady();
            }
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", VideoJS.DOMContentLoaded, false);
                window.addEventListener("load", VideoJS.onDOMReady, false);
            } else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", VideoJS.DOMContentLoaded);
                window.attachEvent("onload", VideoJS.onDOMReady);
            }
        },
        DOMContentLoaded: function () {
            if (document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", VideoJS.DOMContentLoaded, false);
                VideoJS.onDOMReady();
            } else if (document.attachEvent) {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", VideoJS.DOMContentLoaded);
                    VideoJS.onDOMReady();
                }
            }
        },
        DOMReadyList: [],
        addToDOMReady: function (fn) {
            if (VideoJS.DOMIsReady) {
                fn.call(document);
            } else {
                VideoJS.DOMReadyList.push(fn);
            }
        },
        DOMIsReady: false,
        onDOMReady: function () {
            if (VideoJS.DOMIsReady) {
                return;
            }
            if (!document.body) {
                return setTimeout(VideoJS.onDOMReady, 13);
            }
            VideoJS.DOMIsReady = true;
            if (VideoJS.DOMReadyList) {
                for (var i = 0; i < VideoJS.DOMReadyList.length; i++) {
                    VideoJS.DOMReadyList[i].call(document);
                }
                VideoJS.DOMReadyList = null;
            }
        }
    });
    VideoJS.bindDOMReady();
    Function.prototype.context = function (obj) {
        var method = this,
			temp = function () {
			    return method.apply(obj, arguments);
			};
        return temp;
    };
    Function.prototype.evtContext = function (obj) {
        var method = this,
			temp = function () {
			    var origContext = this;
			    return method.call(obj, arguments[0], origContext);
			};
        return temp;
    };
    Function.prototype.rEvtContext = function (obj, funcParent) {
        if (this.hasContext === true) {
            return this;
        }
        if (!funcParent) {
            funcParent = obj;
        }
        for (var attrname in funcParent) {
            if (funcParent[attrname] == this) {
                funcParent[attrname] = this.evtContext(obj);
                funcParent[attrname].hasContext = true;
                return funcParent[attrname];
            }
        }
        return this.evtContext(obj);
    };
    if (window.jQuery) {
        (function ($) {
            $.fn.VideoJS = function (options) {
                this.each(function () {
                    VideoJS.setup(this, options);
                });
                return this;
            };
            $.fn.player = function () {
                return this[0].player;
            };
        })(jQuery);
    }
    window.VideoJS = window._V_ = VideoJS;
})(window);

;

/* --- END CONTENTS OF ./javascripts/video.js --- */

/* --- CONTENTS OF ./javascripts/global.js --- */


var column_width = 190;
var row_height = 130;
var gutter = 10;
var pad_edge = 10;
var min_columns = 5;
var force_browser = true;
var submitting = false;
var newsletter_response = "";
var last_focus = '';
var resizing = false;
var init_masonry = false;
var last_height = 0;
var main_height = 0;
var browser_width = 0;
var browser_height = 0;
var chrome_height = 0;
var chrome = 0;
var html_height = 0;
var scroll_top = 0;
var cur_rows = 0;
var cur_cols = 0;
var last_cols = 0;
var last_rows = 0;
$(document).ready(function () {
    isiPad = navigator.userAgent.match(/iPad/i) != null || navigator.userAgent.match(/iPhone/i) != null;
    $(window).resize(resize_grid);
});

function set_jquery() {
    if ($('.blank a').length) {
        $('.blank a').attr('target', '_blank');
        $('.blank a').addClass('blank');
    }
    if ($('.textBox').length) {
        $('.textBox').unbind('focus');
        $('.textBox').focus(function () {
            last_focus = $(this).attr('value');
            $(this).attr('value', '');
        });
        $('.textBox').unbind('blur');
        $('.textBox').blur(function () {
            if ($(this).attr('value') == '') {
                $(this).attr('value', last_focus);
            }
        });
    }
    if (newsletter_response != "") {
        $('#newsletter_content').html(newsletter_response);
    } else {
        $('#newsletter_form').submit(function (ev) {
            ev.preventDefault();
            if ($(this).valid() && !submitting === true) {
                submitting = true;
                var postdata = {};
                if (console && console.log) {
                    console.log($('#newsletter_content').html());
                    console.log('INPUTS:' + $('#newsletter_content').find('input').length);
                }
                $(this).find('input').each(function () {
                    postdata[$(this).attr('name')] = $(this).attr('value');
                });
                var action = '/form/process/';
                if (console && console.log) {
                    console.log('POSTDATA:' + postdata);
                }
                if (console && console.log) {
                    console.log('ACTION:' + action);
                }
                $('#newsletter_content').html('<p>Please wait...</p>');
                $.post(action, postdata, function (data) {
                    if (console && console.log) {
                        console.log('DATA:' + data);
                    }
                    $('#newsletter_content').html('Thanks!');
                    submitting = false;
                    newsletter_response = $('#newsletter_content').html();
                });
            }
        });
    }
    if ($('.image-maximise').length) {
        $('.image-maximise').lightBox();
    }
    if ($('#meta_title').length) {
        document.title = ('Rosie Lee - ' + $('#meta_title').text());
    }
    VideoJS.setupAllWhenReady({
        controlsBelow: false,
        controlsHiding: true,
        defaultVolume: 0.85,
        flashVersion: 9,
        linksHiding: true,
        playerFallbackOrder: ["flash", "html5", "links"]
    });
    VideoJS.setup("All");
    if ($('.text-unit a').length) { }
    if ($('.work-unit').length || $('.news-unit').length) {
        $('.work-unit,.news-unit.related,.news-item-list .news-unit').hover(function () {
            if (!$(this).hasClass('featured')) {
                if (!$.browser.msie) $(this).find('.unit-summary').stop(true, true).fadeIn();
                else $(this).find('.unit-summary').show();
                $(this).find('.unit-image img:not(.title)').stop(true, true).fadeTo('', 0.2);
                if (isiPad) {
                    var $l = $(this).find('a').first();
                    setTimeout(function () {
                        $l.click();
                    }, 400);
                }
            }
        }, function () {
            if (!$.browser.msie) $(this).find('.unit-summary').stop(true, true).fadeOut();
            else $(this).find('.unit-summary').hide();
            $(this).find('.unit-image img:not(.title)').stop(true, true).fadeTo('', 1);
        });
    }
    if ($('a.image-maximise').length) {
        $('a.image-maximise').hover(function () {
            $(this).find('.icon-maximise, .image-caption').stop(true, true).fadeIn();
        }, function () {
            $(this).find('.icon-maximise, .image-caption').stop(true, true).fadeOut();
        });
    }
    if ($('a.image-switcher').length) {
        $('a.image-switcher').hover(function (ev) {
            $(this).find('.image-active').stop(true, true).fadeIn();
        }, function () {
            $(this).find('.image-active').stop(true, true).fadeOut();
        });
    }
    if ($('.unit-title h3 a').length) {
        $('.unit-title h3 a').hover(function () {
            if (!$.browser.msie) $(this).find('img').stop(true, true).fadeTo(50, 0.5);
        }, function () {
            if (!$.browser.msie) $(this).find('img').stop(true, true).fadeTo(50, 1);
        });
    }
    if ($('.unit-slide-panel').length) {
        $playing = $('.unit-slide-panel').first();
        $activeTab = $('.unit-slide-title').first();
        $('.unit-slide-title').each(function () {
            var $img = $(this).find('img');
            $img.fadeOut(20, function () {
                $img.fadeIn();
            });
            $(this).hover(function () {
                $(this).addClass('over');
            }, function () {
                $(this).removeClass('over');
            });
            $(this).click(function () {
                var id = $(this).attr('id').replace('title-', 'anim-');
                var $anim = $('#' + id);
                $playing.fadeOut(300, function () {
                    $(this).removeClass('playing');
                    $anim.find('img').hide();
                    $anim.fadeIn(300, function () {
                        $(this).addClass('playing');
                        $playing = $(this);
                        clearInterval(slideTimer);
                        about_slideshow();
                    })
                });
                $('.unit-slide-title').removeClass('playing');
                $(this).addClass('playing');
            });
        });
        about_slideshow();
    }
    if ($('.tag-unit a,.unit-tags a').length) {
        tagSelected = $('.tag-unit a.selected').hasClass('all') ? false : ctag;
        $('.tag-unit a,.unit-tags a').click(function (e) {
            var type = $('.work-item-list').length ? '.work-unit' : '.news-unit';
            var colour = $('.work-item-list').length ? 'green' : 'blue';
            if (!$('.work-item-list').length && !$('.news-item-list').length) { } else e.preventDefault();
            if (do_ajaxify) ajaxify.set_visible_uri($(this).attr('href'));
            if ($(this).hasClass('selected')) return 0;
            var cls = $(this).attr('class');
            cls = cls.replace('first ', '');
            cls = cls.replace('last ', '');
            $('.tag-unit a img').each(function () {
                $(this).attr('src', ($(this).attr('src').replace('black', colour)));
            });
            $('.tag-unit a').removeClass('selected');
            if ($(this).find('img').length) $(this).find('img').attr('src', ($(this).find('img').attr('src').replace(colour, 'black')));
            else {
                var cls = $(this).attr('class');
                cls = cls.replace('first ', '');
                cls = cls.replace('last ', '');
                var $img = $('p.image-tags a.' + cls);
                if ($img.length) {
                    $img.find('img').attr('src', ($img.find('img').attr('src').replace(colour, 'black')));
                    $img.addClass('selected');
                }
            }
            $(this).addClass('selected');
            if ($(this).hasClass('all')) {
                $(type).removeClass('inactive');
                do_masonry('.unit');
                setTimeout(function () {
                    $(type + ':not(.' + cls + ')').fadeIn();
                }, 600);
            } else {
                if (!tagSelected) {
                    $(type + ':not(.' + cls + ')').addClass('inactive').fadeOut('');
                    setTimeout(function () {
                        do_masonry('.unit');
                    }, 300);
                    tagSelected = cls;
                } else {
                    $(type + '.' + cls).removeClass('inactive');
                    $(type + ':not(.' + cls + ')').addClass('inactive').fadeOut('');
                    do_masonry('.unit');
                    setTimeout(function () {
                        $(type + '.' + cls).fadeIn();
                    }, 300);
                    tagSelected = cls;
                }
            }
        });
    }
    if ($('.quotes').length) {
        $('.quotes .unit:first').fadeIn();
        $('.quotes').cycle({
            timeout: 13000
        });
    }
    if ($('a.top').length) {
        $('a.top').click(function (e) {
            e.preventDefault();
            $(window).scrollTo(0, {
                duration: 800,
                easing: 'easeOutExpo'
            });
        });
    }
    if ($('#page_share').length) {
        $('#footer_share').html($('#page_share').html());
    }
}
var video_fs = function (info) {
    var videoWidth = 780;
    var ratio = videoWidth / info.videoWidth;
    var videoHeight = Math.round(info.videoHeight * ratio);
    var w = $(window).width();
    var h = $(window).height();
    var left = (w - videoWidth) / 2;
    var top = (h - videoHeight) / 2;
    var auto = 1;
    var flash = '<object id="flash_fallback_1" class="vjs-flash-fallback" width="' + videoWidth + '" height="' + videoHeight + '" type="application/x-shockwave-flash" data="/video/video.swf">';
    flash += '<param name="movie" value="/video/video.swf" />'
    flash += '<param name="allowfullscreen" value="true" />'
    flash += '<param name="flashvars" value="fs=1&autoplay=1&startAt=' + info.time + '&poster=&videoPath=' + info.file + '&captionText=' + info.caption + '" />';
    flash += '</object>'
    $('body').append('<div id="fs-video-bg"></div><div id="fs-video-player">' + flash + '</div>');
    $('#fs-video-player').css({
        'top': top + 'px',
        'left': left + 'px'
    });
    $('#fs-video-bg,#fs-video-player').fadeIn();
}
var close_video_fs = function () {
    $('#fs-video-bg,#fs-video-player').fadeOut('', function () {
        $(this).remove();
    });
}

function quotes_slideshow() {
    $currentQuote = $('.quotes .unit').first();
    var running = 0;
    $currentQuote.fadeIn(1000);
    qTimer = setInterval(function () {
        $currentQuote.fadeOut(1000, function () {
            var $n = $currentQuote.next();
            if (!$n.length) {
                $n = $('.quotes .unit').first();
            }
            $n.fadeIn(1000, function () {
                $currentQuote = $n;
                running = 1;
            })
        });
    }, 9000);
}

function about_slideshow() {
    var $images = $playing.find('img');
    var $active = $images.first();
    var running = 0;
    slideTimer = setInterval(function () {
        $active.fadeOut('', function () {
            var $n = running ? $active.next() : $active;
            if (!$n.length) {
                $n = $images.first();
            }
            $n.fadeIn('', function () {
                $active = $n;
                running = 1;
            });
        });
    }, 2000);
}

function do_masonry(selector) {
    var o = $('.work-item').length ? true : false;
    if (!init_masonry) {
        resize_grid();
        init_masonry = true;
        do_masonry(selector);
    } else {
        $('#main').masonry({
            itemSelector: selector,
            columnWidth: 200,
            isAnimated: true,
            animationOptions: {
                duration: 500,
                easing: 'easeInOutExpo',
                queue: false
            },
            ignore: 'lock',
            callback: function () { },
            maintainOrder: o,
            callback: function () {
                resize_grid();
            },
            onHeightSet: function (height) {
                reset_height(height);
            },
            isResizable: false
        });
    }
}

function fix_header() {
    var scroll_top = $(document).scrollTop();
    $("#head").css("top", scroll_top);
}

function set_dimensions(callback) {
    browser_width = $(window).width();
    browser_height = $(window).height();
    chrome_height = window.outerHeight;
    chrome = chrome_height - browser_height;
    html_height = $(document).height();
    scroll_top = $(document).scrollTop();
    callback();
}

function resize_grid() {
    set_dimensions(function () {
        set_columns();
        set_rows();
    });
}

function reset_height(height) {
    if (height > 0) {
        last_height = main_height;
        main_height = height;
    }
}

function set_columns() {
    if ($('.template.work-item').length) min_columns = 6;
    else min_columns = 5;
    min_columns = 6;
    var column_plus_gutter = column_width + gutter;
    var columns = Math.floor(((browser_width - (2 * pad_edge) - gutter) / column_plus_gutter));
    columns = (columns < min_columns) ? min_columns : columns;
    var fixed_width = (columns * column_plus_gutter);
    if (columns > min_columns) {
        fixed_width += gutter;
    } else {
        fixed_width += gutter;
    }
    if (cur_cols != columns) {
        cur_cols = columns;
        $('#page').width(fixed_width);
        if (init_masonry) {
            $('#main').data('masonry').resize();
        }
    }
    if ($('#news_article').length) {
        $('#news_article').css('left', ((fixed_width + gutter + (pad_edge)) - 410) + 'px');
    }
}

function set_rows() {
    position_footer();
    if ($('.aside').length && !($('#map').length) && !($('#news_article').length)) {
        var last = 0;
        var aside_height = 0;
        $('.aside').children().each(function () {
            last = (main_height >= (last + $(this).outerHeight())) ? (last + $(this).outerHeight()) : last;
        });
        $('.aside').height(last);
    }
}

function position_footer() {
    var template_padding = parseInt($('.template').css('padding-bottom'));
    if (template_padding < 0) template_padding = 0;
    if ($('#map').length && main_height <= 580) template_padding = 0;
    var template_height = main_height + template_padding;
    var footer_height = 150;
    var content_height = (main_height + template_padding + footer_height + pad_edge)
    if (content_height <= browser_height) {
        var max_extra_rows = Math.floor((browser_height - content_height) / 145);
        var extra_height = (max_extra_rows) * 145;
        $('#main').stop().height(main_height + extra_height);
        var fdiff = (browser_height - (content_height + extra_height));
        fdiff = (fdiff - 5);
        var new_footer_height = footer_height + fdiff;
        $('#foot').height(new_footer_height);
    } else {
        $('#main').stop().height(main_height);
        $('#foot').height(150);
    }
}
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function init_map() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var myOptions = {
        zoom: 14,
        panControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': addr
    }, function (results, status) {
        if ($('#map').length) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        }
    });
    directionsDisplay.setMap(map);
}

function calcRoute() {
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}
var dragging = false;
var ctag = '';
jQuery(document).ready(function ($) {
    if (do_ajaxify) {
        show_loader();
        $('#page').hide();
        ajaxify.setup({
            homepage: 'home',
            strip_script: true,
            filter_response: false,
            default_load_into: '#data',
            selectors: ['#main_navigation a'],
            exclude: ['.foot .blank a,.template.work-item-list .tag-unit a,.template.work-item-list .unit-tags a,.template.news-item-list .tag-unit a,.template.news-item-list .unit-tags a,.unit-image.fs a,a.top,a.blank']
        });
        ajaxify.ready(function () {
            $('#data').hide();
            $('#foot').hide();
            $('#main_logo').hide();
            $('#main_address').hide();
            $('#main_navigation').hide();
            $('#page').show();
            $('#main_logo').fadeIn();
            $('#main_address').fadeIn();
            $('#main_navigation').fadeIn();
        });
        ajaxify.on_before_ajax(function (target) {
            show_loader();
            $('#main_navigation .selected').removeClass('selected');
            var seg = ajaxify.segment(0);
            if (seg != 'admin') $('#main_navigation a[href^="/' + seg + '"]').parent().addClass('selected');
            if (!ajaxify.requests) {
                target.hide();
                ajaxify.load_url();
            } else {
                if ($('#map').length) {
                    google.maps.Unload;
                    $('.aside').fadeOut('fast', function () {
                        $('.aside').remove()
                    });
                }
                $('#foot').fadeOut();
                if ($('#wallpaper').length) {
                    setTimeout(function () {
                        $('body').removeClass('dark');
                    }, 250);
                    $('#wallpaper').fadeOut(function () {
                        $('#wallpaper').hide();
                        $('#main_logo').removeClass('trans');
                        $('#main_logo_image').attr('src', '/images/logo.png');
                    });
                    $('.unit-title').animate({
                        'color': '#000000'
                    });
                    $('.unit-body, .unit-body li,#main_address').animate({
                        'color': '#464646'
                    });
                    $('#foot').animate({
                        'background-color': '#ECECEC'
                    });
                    $('img[src^="/images/titles"]').each(function () {
                        var dark_version = $(this).attr('src').replace('colour=white', 'colour=dark');
                        $(this).attr('src', dark_version);
                    });
                }
                if (ajaxify.segment(0) == 'news' && $('#news_article').length) {
                    $('#news_article').hide();
                    ajaxify.post(ajaxify.url, function (response) {
                        hide_loader();
                        response = jQuery("<div>").append(response).find('#news_article').html();
                        $('#news_article').html(response);
                        $('#news_article').fadeIn();
                        $('#foot').fadeIn();
                        set_jquery();
                    });
                    $('.news-unit.featured').removeClass('featured');
                    ajaxify.current_links().each(function () {
                        $(this).closest('.unit').addClass('featured');
                    });
                } else {
                    target.fadeOut(function () {
                        ajaxify.load_url();
                    });
                }
                if (pageTracker !== null && pageTracker !== undefined) {
                    var async_ga_url = ajaxify.url;
                    pageTracker._trackPageview(async_ga_url);
                }
            }
        });
        var preloaded_news = 0;
        ajaxify.on_after_ajax = function (target) {
            var ajaxify = this;
            if (ajaxify.segment(0) == 'news' && $('#news_article').length && !preloaded_news) {
                ajaxify.preload('#data .news-unit');
                preloaded_news = 1;
            }
            target.css({
                'display': 'block',
                'visibility': 'hidden'
            });
            $('.unit-auto-row').gridular(200, 145);
            do_masonry('.unit');
            set_jquery();
            $('#data .unit').hide();
            target.css({
                'display': 'none',
                'visibility': 'visible'
            });
            if ($('#background_image').length) {
                var new_bg = $('#background_image').attr('href');
                $('body').addClass('special').prepend('<div id="wallpaper"><img id="wallpaper_image" src="' + new_bg + '" /></div>');
                $('#wallpaper').hide();
                var tmp = new Image();
                tmp.onload = function () {
                    setTimeout(function () {
                        $('body').addClass('dark');
                    }, 250);
                    $('#wallpaper').fadeIn(function () { });
                    $('#main_logo').addClass('trans');
                    $('#main_logo_image').attr('src', '/images/logo_light.png');
                    $('.unit-title,.unit-title a,.unit-tags,.unit-tags a').animate({
                        'color': '#FFFFFF'
                    });
                    $('.unit-body, .unit-body li, #main_address').animate({
                        'color': '#F5F5F5'
                    });
                    $('#foot').animate({
                        'background-color': '#2E2E2E'
                    });
                    $('img[src^="/images/titles"]').each(function () {
                        var white_version = $(this).attr('src').replace('colour=dark', 'colour=white');
                        $(this).attr('src', white_version);
                    });
                }
                tmp.src = new_bg;
            } else $('body').removeClass('special');
            target.fadeIn(function () {
                $('#data .unit:not(.hidden,.inactive)').wave(70, 700);
                $('#foot').fadeIn();
                if ($('#map').length) {
                   setTimeout('init_map()', 1000);
                }
                hide_loader();
            });
            ajaxify.add_new_click_events(target);
        }
        ajaxify.start();
    } else {
        do_ajax_fallback();
    }
});

function do_ajax_fallback() {
    $('html').css('padding-bottom', 10);
    $('#foot').hide();
    $('#data').css({
        'display': 'block',
        'visibility': 'hidden'
    });
    $('.unit-auto-row').gridular(200, 145);
    do_masonry('.unit');
    set_jquery();
    $('#data .unit').hide();
    $('#data').css({
        'display': 'none',
        'visibility': 'visible'
    });
    if ($('#background_image').length) {
        var new_bg = $('#background_image').attr('href');
        $('body').addClass('special').prepend('<div id="wallpaper"><img id="wallpaper_image" src="' + new_bg + '" /></div>');
        $('#wallpaper').hide();
        var tmp = new Image();
        tmp.onload = function () {
            setTimeout(function () {
                $('body').addClass('dark');
            }, 250);
            $('#wallpaper').fadeIn(function () { });
            $('#main_logo').addClass('trans');
            $('#main_logo_image').attr('src', '/images/logo_light.png');
            $('.unit-title,.unit-title a,.unit-tags,.unit-tags a').animate({
                'color': '#FFFFFF'
            });
            $('.unit-body, .unit-body li, #main_address').animate({
                'color': '#F5F5F5'
            });
            $('#foot').animate({
                'background-color': '#2E2E2E'
            });
            $('img[data-src^="/images/titles"]').each(function () {
                var white_version = $(this).attr('data-src').replace('colour=dark', 'colour=white');
                $(this).attr('src', white_version);
            });
        }
        tmp.src = new_bg;
    } else $('body').removeClass('special');
    $('#data').fadeIn(function () {
        $('#data .unit:not(.hidden,.inactive)').wave(70, 700);
        $('#foot').fadeIn();
        hide_loader();
        if ($('#map').length) {
            setTimeout('init_map()', 1000);
        }
    });
    if ($('#news_article').length) {
        $('.news-unit a').click(function (ev) {
            show_loader();
            $('#news_article').fadeOut();
            $('#foot').hide();
            ev.preventDefault();
            $.post($(this).attr('href'), {
                ajax: true
            }, function (response) {
                response = jQuery("<div>").append(response).find('#news_article').html();
                $('#news_article').html(response);
                $('#news_article').fadeIn();
                $('#foot').fadeIn();
                hide_loader();
                set_jquery();
            });
        });
    }
}

;

/* --- END CONTENTS OF ./javascripts/global.js --- */