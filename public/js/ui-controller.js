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
         if (data.alert) {
            var state = 'state-warning';
            var heading = "Service disruption";
            var description = data.alert.description;
        } else if (parseInt(data.accessibility)) {
            var state = 'state-accessible';
            var heading = "Likely accessible";
            var description = "This station is equipped with elevators or has at-grade, platform-level boarding.";
        } else {
            var state = 'state-inaccessible';
            var heading = "Not accessible";
            var description = "This station has significant access barriers and is not equipped with alternative entryways.";
        }
        
        $(".stop-accessibility-state")
            .attr("class", "stop-accessibility-state " + state)
            .text(heading);
        
        if (data.alert && data.alert.url) {
            $(".stop-alert-link").attr("href", data.alert.url);
            $(".stop-alert-link.hidden").removeClass("hidden");
            $(".stop-details-card .source-link").addClass("hidden");
        } else {
            $(".stop-alert-link").addClass("hidden");
            $(".stop-details-card .source-link.hidden").removeClass("hidden");
        }
        
        $(".stop-accessibility-info").text(description);
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