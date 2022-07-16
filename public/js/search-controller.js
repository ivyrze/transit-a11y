$(document).ready(function () {
    $("#search-container input").on('input', function (event) {
        const query = $("#search-container input").val();
        
        if (query.trim().length > 1) {
            $.ajax({
                type: $("form#search-container").attr("method"),
                url: $("form#search-container").attr("action"),
                data: { query: query },
                dataType: "json",
                encode: true,
            }).done(function (data) {
                $("#search-results-container .search-result").remove();
                data.results.forEach(result => {
                    $("#search-results-container").append(
                        $("<button>")
                            .addClass("search-result")
                            .attr("data-stop-id", result.id)
                            .text(result.value.name)
                    );
                });
            });
        } else {
            $("#search-results-container .search-result").remove();
        }
    });
    
    $("form#search-container").on('submit', function (event) {
        event.preventDefault();
    });
});