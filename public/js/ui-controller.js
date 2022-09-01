var i18n = {};
$.getJSON("/js/i18n-strings.json").done(data => i18n = data);

$("h1.title > a").click(function () {
    $(".sidebar-card").not(".about-card").addClass("hidden");
    $(".about-card").toggleClass("hidden");
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
        $("#search-results-container .search-result").remove();
    }
});

$("form#search-container").on('submit', function (event) {
    $("#search-results-container .search-result").eq(0).click();
    event.preventDefault();
});

$(".card-close").click(function () {
    $(this).parents(".sidebar-card").addClass("hidden");
});

const prefersLightScheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
};

const showSearchResults = data => {
    $("#search-results-container .search-result").remove();
    data.results.forEach(result => {
        let button = $("<button>")
            .addClass("search-result")
            .attr("data-stop-id", result.id)
            .text(result.name)
            .click(openSearchResult);
        
        result.routes.forEach(route => {
            var icon = $("<span>")
                .addClass("route-icon")
                .addClass("route-" + route.color)
                .attr("aria-label", route.name)
                .text(route.name.charAt(0))
            button.append(icon);
        });
        
        $("#search-results-container").append(button);
    });
};

const openSearchResult = event => {
    $("#search-results-container .search-result").remove();
    openStop($(event.target).attr("data-stop-id"));
};

const openStop = id => {
    $.ajax({
        url: "/api/stop-details",
        type: "post",
        dataType: "json",
        encode: true,
        data: { id },
    }).done(function (data) {
        const state = (data.alert) ? 'state-warning' :
            (parseInt(data.accessibility)) ? 'state-accessible' :
            'state-inaccessible';
        
        $(".stop-accessibility-state")
            .attr("class", "stop-accessibility-state " + state)
            .text(i18n.accessibilityStates[state].heading);
        
        $(".stop-tags-container > .stop-tag").remove();
        
        if (data.tags) {
            for (const tag of data.tags) {
                $(".stop-tags-container").append(
                    $("<li>")
                        .addClass("stop-tag")
                        .addClass("tag-" + tag)
                        .text(i18n.tagLabels[tag])
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
        
        $(".stop-accessibility-info").text(
            (state == 'state-warning') ?
                data.alert.description : i18n.accessibilityStates[state].description
        );
        $(".stop-details-card h2").text(data.name);
        
        $(".sidebar-card").not(".stop-details-card").addClass("hidden");
        $(".stop-details-card.hidden").removeClass("hidden");
        
        $(".stop-details-card .source-link > a")
            .attr("href", data.agency.url)
            .text(data.agency.name);
        
        flyToStop([
            data.coordinates.longitude,
            data.coordinates.latitude
        ]);
    });
};

const getAlerts = () => {
    $.get("/api/list-alerts").done(function (data) {
        updateMapAlerts(data.alerts);
    });
};