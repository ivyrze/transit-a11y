const showCard = (selector, toggle = false) => {
    $(".sidebar-card").not(selector).addClass("hidden");
    (toggle) ?
        $(selector).toggleClass("hidden") :
        $(selector).removeClass("hidden");
};

const showError = () => showCard(".error-card");

var i18n = {};
$.getJSON("/js/i18n-strings.json")
    .done(data => i18n = data)
    .fail(showError);

$("h1.title > a").click(function () {
    showCard(".about-card", true);
});

$("#search-container input").on('input', function () {
    const query = $("#search-container input").val();
    
    if (query.trim().length > 1) {
        const { lng: longitude, lat: latitude } = map.getCenter();
        
        $.ajax({
            url: "/api/search",
            type: "post",
            dataType: "json",
            encode: true,
            data: { query, longitude, latitude }
        }).done(showSearchResults);
    } else {
        $("#search-results-container > li").remove();
    }
});

$("form#search-container").on('submit', function (event) {
    $("#search-results-container .search-result").eq(0).click();
    event.preventDefault();
});

$(".card-close, .form-cancel").click(function () {
    $(this).parents(".sidebar-card").addClass("hidden");
});

$(".review-drawer-toggle").click(function () {
    const expanded = $(this).attr("aria-expanded") === 'true';
    $("#review-drawer").toggleClass("hidden");
    $(this).attr("aria-expanded", !expanded);
    this.childNodes[0].nodeValue =
        i18n.reviewsToggleStates[expanded ? 'show' : 'hide'];
});

$(".review-contribute").click(function () {
    $(".review-form-card h2").text($(".stop-details-card h2").text());
    $(".review-form-card .subtitle").text($(".stop-details-card .subtitle").text());
    showCard(".review-form-card");
});

const prefersLightScheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
};

const showSearchResults = data => {
    $("#search-results-container > li").remove();
    data.results.forEach(result => {
        let button = $("<button>")
            .addClass("search-result")
            .attr("data-stop-id", result.id)
            .text(result.name)
            .click(openSearchResult);
        
        result.routes.forEach(route => {
            var icon = $("<span>")
                .addClass("route-icon")
                .attr("aria-label", route.name)
                .text(route.number);
                
            (route.color.startsWith("#")) ?
                icon.css("background-color", route.color) :
                icon.addClass("route-" + route.color);
            
            button.append(icon);
        });
        
        $("#search-results-container").append(
            $("<li>").append(button)
        );
    });
};

const openSearchResult = event => {
    $("#search-results-container > li").remove();
    openStop($(event.currentTarget).attr("data-stop-id"));
};

const openStop = id => {
    $.ajax({
        url: "/api/stop-details",
        type: "post",
        dataType: "json",
        encode: true,
        data: { id },
    }).done(function (data) {
        const state = (data.alert) ? 'warning' :
            (parseInt(data.accessibility) == 1) ? 'accessible' :
            'inaccessible';
        
        $(".stop-accessibility-state")
            .attr("class", "stop-accessibility-state state-" + state)
            .text(i18n.accessibilityStates[state].heading)
            .prepend(
                $("<span>")
                    .addClass("icon icon-" + state)
                    .attr("aria-hidden", "true")
            );
        
        $(".stop-tags-container > .stop-tag").remove();
        
        if (data.tags) {
            for (const tag of data.tags) {
                $(".stop-tags-container").append(
                    $("<li>")
                        .addClass("stop-tag")
                        .text(i18n.tagLabels[tag])
                        .prepend(
                            $("<span>").addClass("icon icon-" + tag)
                        )
                )
            }
        }
        
        if (data.alert && data.alert.url) {
            $(".stop-alert-link").attr("href", data.alert.url);
            $(".stop-alert-link.hidden").removeClass("hidden");
            $(".stop-details-card .source-link").addClass("hidden");
        } else {
            $(".stop-alert-link").addClass("hidden");
            $(".stop-details-card .source-link.hidden").removeClass("hidden");
        }
        
        if (data.reviews) {
            $("#review-drawer .review-single").remove();
            
            for (const review of data.reviews) {
                constructReviewSingle(review).insertBefore(".review-contribute");
            }
            $("#review-drawer time").timeago();
            
            if (!data.reviews.length) {
                $("#review-drawer").removeClass("hidden");
                $(".review-drawer-toggle").addClass("hidden");
            } else {
                $("#review-drawer").addClass("hidden");
                $(".review-drawer-toggle")
                    .removeClass("hidden")
                    .attr("aria-expanded", "false")
                $(".review-drawer-toggle")[0].childNodes[0].nodeValue =
                    i18n.reviewsToggleStates["show"];
            }
            
            $(".review-container").removeClass("hidden");
            $(".stop-details-card .source-link").addClass("hidden");
        } else {
            $(".review-container").addClass("hidden");
            $(".stop-details-card .source-link").removeClass("hidden");
        }
        
        $(".stop-accessibility-info").text(
            (state == 'warning') ? data.alert.description :
                (data.description) ? data.description :
                i18n.accessibilityStates[state].description
        );
        $(".stop-details-card h2").text(data.name);
        $(".stop-details-card .subtitle").text(i18n.stopSubheadings[data.agency.vehicle]);
        
        $(".review-form-card input[name=\"stop\"]").val(id);
        
        showCard(".stop-details-card");
        
        $(".stop-details-card .source-link > a")
            .attr("href", data.agency.url)
            .text(data.agency.name);
        
        flyToStop([
            data.coordinates.longitude,
            data.coordinates.latitude
        ]);
    }).fail(showError);
};

const constructReviewSingle = review => {
    const single = $("<article>")
        .addClass("review-single")
        .append(
            $("<div>")
                .addClass("review-header")
                .append(
                    $("<img>")
                        .addClass("profile-picture")
                        .attr("src", review.author.avatar)
                        .attr("alt", "Profile picture")
                )
                .append(
                    $("<span>")
                        .addClass("review-author")
                        .text(review.author.username)
                )
                .append(
                    $("<time>")
                        .addClass("review-timestamp")
                        .attr("datetime", review.timestamp)
                )
        ).append(
            $("<div>")
                .attr("class", "review-accessibility-state state-" + review.state)
                .text(i18n.accessibilityStates[review.state].heading)
                .prepend(
                    $("<span>")
                        .addClass("icon icon-" + review.state)
                        .attr("aria-hidden", "true")
                )
        );
        
    if (review.comments) {
        single.append(
            $("<p>").text(review.comments)
        );
    }
    
    return single;
};