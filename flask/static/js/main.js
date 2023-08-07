$(function() {
    $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        stepsOrientation: "vertical",
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate: '<div class="title">#title#</div>',
        labels: {
            previous: '<i class="zmdi zmdi-arrow-right"></i>',
            next: '<i class="zmdi zmdi-arrow-right"></i>',
            finish: '<i class="zmdi zmdi-check"></i>',
            current: ''
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex === 1 && newIndex === 2) {
                // Before going to the third step, trigger the toggleWebcam function
                toggleWebcam();
            }
            return true; // Return true to allow navigation to the next step
        },
        onFinishing: function (event, currentIndex) {
            // Before finishing the form, submit it programmatically
            $(".form-register").submit();
            return true; // Return true to allow form submission
        }
    });
});
