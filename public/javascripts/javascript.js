$(document).ready(function () {

    // When a comment button is clicked, the comment from is displayed.
    $(".commentButton").on("click", function(e) {
        e.preventDefault();
        let selector = "#" + $(this).attr("id") + ".row.commentForm";
        $(selector).toggle();
    });

    // When a delete button is clicked, a delete request is sent to the server with the corresponding comments id.
    $(".deleteButton").on("click", function (e) {

        $.ajax({
            url: "/delete/" + $(this).attr("id"),
            type: "DELETE",
            success: function (data) {
                document.location.reload(true);
            }
        });

    });

});