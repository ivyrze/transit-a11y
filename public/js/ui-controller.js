$("#search-container input").on('input', function (event) {
    const query = $("#search-container input").val();
    
    if (query.trim().length > 1) {
        const { lng: longitude, lat: latitude } = map.getCenter();
        
        $.ajax({
            url: "/api/search",
            type: "post",
            dataType: "json",
            encode: true,
            data: { query, longitude, latitude }
        }).done(function (data) {
            $("#search-results-container .search-result").remove();
            data.results.forEach(result => {
                $("#search-results-container").append(
                    $("<button>")
                        .addClass("search-result")
                        .attr("data-stop-id", result.id)
                        .text(result.name)
                        .click(openSearchResult)
                );
            });
        });
    } else {
        $("#search-results-container .search-result").remove();
    }
});

$("form#search-container").on('submit', function (event) {
    $("#search-results-container .search-result").eq(0).click();
    event.preventDefault();
});

$(".card-close").click(function () {
    $(this).parents(".stop-details-card").addClass("hidden");
});

const openSearchResult = event => {
    $("#search-results-container .search-result").remove();
    openStop($(event.target).attr("data-stop-id"));
}

const openStop = id => {
    $.ajax({
        url: "/api/stop-details",
        type: "post",
        dataType: "json",
        encode: true,
        data: { id },
    }).done(function (data) {
        if (parseInt(data.accessibility)) {
            $(".stop-accessibility-state")
                .removeClass("state-inaccessible")
                .addClass("state-accessible")
                .text("Likely accessible");
            $(".stop-accessibility-info")
                .text("This station is equipped with elevators or has at-grade, platform-level boarding.");
        } else {
            $(".stop-accessibility-state")
                .removeClass("state-accessible")
                .addClass("state-inaccessible")
                .text("Not accessible");
            $(".stop-accessibility-info")
                .text("This station has significant access barriers and is not equipped with alternative entryways.");
        }
        
        $(".stop-details-card h2").text(data.name);
        $(".stop-details-card.hidden").removeClass("hidden");
        
        flyToStop([
            data.coordinates.longitude,
            data.coordinates.latitude
        ]);
    });
};