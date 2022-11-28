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
        } else if (window.location.pathname.includes('account')) {
            window.location.pathname = '/';
        } else {
            $(".review-form-card").addClass("hidden");
            $(".review-form-card form")[0].reset();
        }
    }).fail(({ errors, status }) => {
        if (status == 401) {
            window.location.pathname = '/account/login';
        } else if (status != 200 && !errors) {
            showError();
        }
        
        showErrors(errors ?? {});
    }).always(() => {
        enabled = true;
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
};