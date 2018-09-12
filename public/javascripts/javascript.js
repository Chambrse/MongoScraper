$(document).ready(function () {

    $(".commentButton").on("click", function(e) {
        e.preventDefault();
        let selector = "#" + $(this).attr("id") + ".row.commentForm";
        $(selector).toggle();
    });

});