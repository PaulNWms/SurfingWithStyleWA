function colorBody() { $("body").css({ "background-color": "#001912", "color": "#009871" }); }

function uncolorBody() { $("body").css({ "background-color": "", "color": "" }); }

function playAudio(selector) { $(selector)[0].play(); }

function setTitle(title) { document.title = title; }

function registerListener(selector, dotnetHelper) {
    var element = $(".pendulum-parent");
    var audio = $(selector)[0];
    element.on("animationstart", function () { audio.play(); });
    element.on("animationiteration", function () {
        audio.play();
        if (element.css("animation-name") === "starting") {
            dotnetHelper.invokeMethodAsync("SetAnimationToRunning");
        }
    });
}

function registerScheduled(selector, dotnetHelper) {
    var element = $(".pendulum-parent");
    var audio = $(selector)[0];
    element.on("animationstart", function () { audio.play(); });
    element.on("animationiteration", function () {
        switch (element[0].getAttribute("data-metronome-state")) {
            case "starting":
                audio.play();
                dotnetHelper.invokeMethodAsync("SetAnimationToRunning");
                break;
            case "running":
                audio.play();
                dotnetHelper.invokeMethodAsync("SetAnimationToRunning");
                break;
            case "makeitstop":
                dotnetHelper.invokeMethodAsync("SetAnimationToStopping");
                break;
            case "stopping":
            case "stopped":
                dotnetHelper.invokeMethodAsync("SetAnimationToStopped");
                break;
            default:
                alert("metronome-state invalid");
                break;
        }
    });
}

function registerFormRowListener(html) {
    $(".add-schedule-row").off("click");
    $(".delete-schedule-row").off("click");
    $(".add-schedule-row").click(function () {
        $(this).parent().parent().after(html);
        registerFormRowListener(html);
        $(this).parent().parent().next().children().children(".tempo").focus();
    });
    $(".delete-schedule-row").click(function () {
        var row = $(this).parent().parent();
        if (row.siblings().length > 0) {
            row.remove();
        }
    });
}

function getExerciseValues() {
    var tempos = [];
    var durations = [];
    var exercises = [];
    $(".tempo-0").each(function () { tempos.push($(this).val()); });
    $(".midpoint-0").each(function () { durations.push($(this).val()); });
    $(".exercise").each(function () { exercises.push($(this).val()); });
    return [tempos, durations, exercises];
}
