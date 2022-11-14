let enabled = true;
$("form").submit(function (event) {
    event.preventDefault();
    
    if (!enabled) { return; }
    enabled = false;
    
    const form = $(this);
    $.ajax({
        url: form.attr("action"),
        type: form.attr("method"),
        dataType: "json",
        encode: true,
        data: form.serializeArray()
    }).done(({ errors }) => {
        if (errors) {
            showErrors(errors);
        } else {
            window.location.pathname = '/';
        }
    }).fail(({ errors }) => {
        showErrors(errors ?? {});
    });
});

$("input, select, textarea").on("invalid", function () {
    $(this).parents("form").addClass("form-submitted");
}).on("input", function () {
    this.setCustomValidity('');
});

const showErrors = errors => {
    Object.keys(errors).forEach(id => {
        const element = $("[name=\"" + id + "\"]")[0];
        element.setCustomValidity(errors[id]);
        element.reportValidity();
    });
    enabled = true;
};