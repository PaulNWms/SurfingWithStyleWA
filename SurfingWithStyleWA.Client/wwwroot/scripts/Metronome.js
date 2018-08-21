"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var Metronome;
(function (Metronome_1) {
    var TimerState;
    (function (TimerState) {
        TimerState[TimerState["stopped"] = 0] = "stopped";
        TimerState[TimerState["running"] = 1] = "running";
        TimerState[TimerState["paused"] = 2] = "paused";
        TimerState[TimerState["continuing"] = 3] = "continuing";
        TimerState[TimerState["settling"] = 4] = "settling";
    })(TimerState || (TimerState = {}));
    ;
    var Step = /** @class */ (function () {
        function Step(tempo, endTempo, durationSec, exercise, graph, isEndPoint) {
            this.tempo = tempo;
            this.endTempo = endTempo;
            this.durationSec = durationSec;
            this.exercise = exercise;
            this.graph = graph;
            this.isEndPoint = isEndPoint;
        }
        return Step;
    }());
    var Metronome = /** @class */ (function () {
        function Metronome() {
            this.rotation = 40;
            this.initrotation = this.rotation;
            this.downbeatClick = $(".downbeat-click")[0];
            this.startatcentre = true;
            this.startButton = $(".metronome-start");
            this.pendulumParent = $('.pendulum-parent');
            this.tempoDecrement = $(".tempo-decrement");
            this.tempoIncrement = $(".tempo-increment");
            this.tempoSlider = $(".tempo-slider");
        }
        Metronome.prototype.initialize = function () {
            var _this = this;
            this.startButton.click(function () {
                metronome.startButtonClick();
            });
            this.pendulumParent.animate({ rotate: this.initrotation }, 0, function () {
                _this.pendulumParent.css("display", "block");
                _this.stopPendulum();
            });
            this.tempoSlider.change(function () {
                if (metronome.isRunning) {
                    metronome.pendulumParent.stop();
                }
                tempo.current = parseInt(this.innerText);
                tempo.tempoDisplay.text(tempo.current);
                metronome.swingtime = 60000 / tempo.current;
                if (metronome.isRunning) {
                    metronome.pendulumParent.animate({ rotate: metronome.rotation }, metronome.swingtime, "swing", function () {
                        metronome.pendulumParent.css("display", "block");
                        metronome.swingPendulum();
                    });
                }
            });
            this.tempoDecrement.click(function () {
                metronome.tempoSlider.val(metronome.tempoSlider.val() * 1 - 1);
                metronome.tempoSlider.trigger("change");
            });
            this.tempoIncrement.click(function () {
                metronome.tempoSlider.val(metronome.tempoSlider.val() * 1 + 1);
                metronome.tempoSlider.trigger("change");
            });
        };
        Metronome.prototype.startButtonClick = function () {
            var _this = this;
            this.isRunning = !this.isRunning;
            if (this.isRunning) {
                this.startButton.html('<span class="glyphicon glyphicon-pause" />');
                this.pendulumParent.animate({ rotate: this.initrotation }, 0, function () {
                    _this.pendulumParent.css("display", "block");
                    _this.downbeatClick.play();
                    _this.swingPendulum();
                });
            }
            else {
                this.startButton.html('<span class="glyphicon glyphicon-play" />');
                this.pendulumParent.stop();
            }
        };
        Metronome.prototype.swingPendulum = function () {
            if (schedule.currentStep.tempo != schedule.currentStep.endTempo) {
                var change = schedule.currentStep.endTempo - schedule.currentStep.tempo;
                var elapsed = moment.now() - schedule.currentStep.startTime;
                var dur = schedule.currentStep.durationSec * 1000;
                tempo.current = schedule.currentStep.tempo + change * elapsed / dur;
                this.swingtime = 60000 / tempo.current;
            }
            this.pendulumParent.animate({ rotate: metronome.rotation }, this.swingtime, "swing", function () {
                metronome.rotation *= -1;
                if (metronome.isRunning) {
                    metronome.swingPendulum();
                    metronome.downbeatClick.play();
                }
                else {
                    metronome.stopPendulum();
                }
            });
        };
        Metronome.prototype.stopPendulum = function () {
            this.pendulumParent.animate({ rotate: 0 }, (this.swingtime / 1.5), "swing");
        };
        return Metronome;
    }());
    Metronome_1.Metronome = Metronome;
    var Schedule = /** @class */ (function () {
        function Schedule() {
            this.body = $("body");
            this.currentStep = new Step(120, 120, 365 * 24 * 60 * 60, "", -1, true);
            this.endExerciseBell = $(".end-exercise-bell")[0];
            this.endRoutineBell = $(".end-routine-bell")[0];
            this.endWithBell = $(".end-with-bell");
            this.exerciseDisplay = $(".exercise-display");
            this.startWithRest = $(".start-with-rest");
        }
        Schedule.prototype.applyFilters = function () {
            $("input[type=text]").off("focus");
            $(".add-form-row").off("click");
            $(".add-accelerating-row").off("click");
            $(".delete-form-row").off("click");
            $(".digit-filter").off("keydown");
            $(".time-filter").off("keydown");
            $(".time-filter").off("keypress");
            $(".time-filter").off("blur");
            $(".preset-1").off("click");
            $(".preset-2").off("click");
            $(".preset-3").off("click");
            $(".preset-4").off("click");
            $(".preset-5").off("click");
            $(".preset-6").off("click");
            $(".preset-7").off("click");
            $(".preset-8").off("click");
            $(".preset-9").off("click");
            $("input[type=text]").focus(function () {
                $(this).select();
            });
            $(".add-form-row").click(function () {
                $(this).parent().parent().after("                        <tr>\n                            <td>\n                                <button type=\"button\" class=\"btn btn-primary delete-form-row\" style=\"margin-top:0.2em;margin-right:0.2em\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n                            </td>\n                            <td>\n                                <input type=\"text\" style=\"width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em\" class=\"form-control digit-filter tempo tempo-0\" id=\"tempo-0\" placeholder=\"Tempo\" autocomplete=\"off\" value=\"120\" />\n                            </td> \n                            <td>\n                                <input type=\"text\" style=\"width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em\" class=\"form-control time-filter midpoint-0\" id=\"midpoint-0\" placeholder=\"Duration\" autocomplete=\"off\" value=\"2:00\" />\n                                <input type=\"hidden\"class=\"midpoint-0-sec\" />\n                            </td> \n                            <td>\n                                <input type=\"text\" style=\"margin-top:0.2em;margin-right:0.2em\" class=\"form-control exercise\" id=\"exercise\" placeholder=\"Exercise\"/>\n                            </td>\n                            <td>\n                                <button type=\"button\" class=\"btn btn-primary add-form-row\" style=\"margin-top:0.2em\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n                            </td>\n                        </tr>");
                schedule.applyFilters();
                $(this).parent().parent().next().children().children(".tempo").focus();
            });
            $(".add-accelerating-row").click(function () {
                $(this).parent().parent().after("                <div class=\"group form-group col-xs-9\">\n                    <h3>\n                        <input autocomplete=\"off\" class=\"form-control digit-filter tempo tempo-0\" placeholder=\"T1\" style=\"width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em\" type=\"text\" />\n                        <input type=\"text\" style=\"width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em\" class=\"form-control time-filter midpoint-0\" id=\"midpoint-0\" placeholder=\"D1\" autocomplete=\"off\" />\n                        <input class=\"midpoint-0-sec\" type=\"hidden\" />\n                    </h3>\n                    <div>\n                        <div>\n                            <svg viewBox=\"-30 0 520 250\" preserveAspectRatio=\"none\">\n                                <rect x=\"-30\" y=\"0\" width=\"520\" height=\"250\" style=\"stroke: black; fill: black;\" />\n\n                                <text x=\"110\" y=\"240\">30</text>\n                                <text x=\"230\" y=\"240\">60</text>\n                                <text x=\"350\" y=\"240\">90</text>\n                                <text x=\"455\" y=\"240\">120</text>\n\n                                <text class=\"text-mm\" x=\"-30\" y=\"213\">40</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"193\">60</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"173\">80</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"153\">100</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"133\">120</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"113\">140</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"93\">160</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"73\">180</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"53\">200</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"33\">220</text>\n                                <text class=\"text-mm\" x=\"-30\" y=\"13\">240</text>\n\n                                <g transform=\"translate(0,250) scale(1,-1)\">\n                                    <line class=\"axis-line\" x1=\"0\" y1=\"30\" x2=\"480\" y2=\"30\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"40\" x2=\"480\" y2=\"40\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"50\" x2=\"480\" y2=\"50\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"60\" x2=\"480\" y2=\"60\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"70\" x2=\"480\" y2=\"70\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"80\" x2=\"480\" y2=\"80\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"90\" x2=\"480\" y2=\"90\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"100\" x2=\"480\" y2=\"100\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"110\" x2=\"480\" y2=\"110\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"120\" x2=\"480\" y2=\"120\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"130\" x2=\"480\" y2=\"130\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"140\" x2=\"480\" y2=\"140\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"150\" x2=\"480\" y2=\"150\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"160\" x2=\"480\" y2=\"160\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"170\" x2=\"480\" y2=\"170\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"180\" x2=\"480\" y2=\"180\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"190\" x2=\"480\" y2=\"190\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"200\" x2=\"480\" y2=\"200\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"210\" x2=\"480\" y2=\"210\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"220\" x2=\"480\" y2=\"220\"></line>\n                                    <line class=\"grid-line\" x1=\"0\" y1=\"230\" x2=\"480\" y2=\"230\"></line>\n                                    <line class=\"grid-line\" x1=\"-1\" y1=\"240\" x2=\"480\" y2=\"240\"></line>\n\n                                    <line class=\"axis-line\" x1=\"0\" y1=\"30\" x2=\"0\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"40\" y1=\"28\" x2=\"40\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"80\" y1=\"28\" x2=\"80\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"120\" y1=\"28\" x2=\"120\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"160\" y1=\"28\" x2=\"160\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"200\" y1=\"28\" x2=\"200\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"240\" y1=\"28\" x2=\"240\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"280\" y1=\"28\" x2=\"280\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"320\" y1=\"28\" x2=\"320\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"360\" y1=\"28\" x2=\"360\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"400\" y1=\"28\" x2=\"400\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"440\" y1=\"28\" x2=\"440\" y2=\"240\"></line>\n                                    <line class=\"grid-line\" x1=\"480\" y1=\"28\" x2=\"480\" y2=\"240\"></line>\n                                </g>\n                            </svg>\n                        </div>\n                        <input autocomplete=\"off\" class=\"form-control digit-filter tempo tempo-0\" placeholder=\"T1\" style=\"width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em\" type=\"text\" />\n                        <input type=\"text\" style=\"width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em\" class=\"form-control time-filter midpoint-0\" id=\"midpoint-0\" placeholder=\"D1\" autocomplete=\"off\" />\n                        <input class=\"midpoint-0-sec\" type=\"hidden\" />\n\n                        <input autocomplete=\"off\" class=\"form-control digit-filter tempo tempo-1\" placeholder=\"T1\" style=\"width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em\" type=\"text\" />\n                        <input type=\"text\" style=\"width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em\" class=\"form-control time-filter midpoint-1\" id=\"midpoint-1\" placeholder=\"D1\" autocomplete=\"off\" />\n                        <input class=\"midpoint-1-sec\" type=\"hidden\" />\n\n                        <input autocomplete=\"off\" class=\"form-control digit-filter tempo tempo-2\" placeholder=\"T2\" style=\"width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em\" type=\"text\" />\n                        <input type=\"text\" style=\"width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em\" class=\"form-control time-filter midpoint-2\" id=\"midpoint-2\" placeholder=\"D2\" autocomplete=\"off\" />\n                        <input class=\"midpoint-2-sec\" type=\"hidden\" />\n\n                        <input autocomplete=\"off\" class=\"form-control digit-filter tempo tempo-3\" placeholder=\"T3\" style=\"width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em\" type=\"text\" />\n                        <input type=\"text\" style=\"width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em\" class=\"form-control time-filter midpoint-3\" id=\"midpoint-3\" placeholder=\"D3\" autocomplete=\"off\" />\n                        <input class=\"midpoint-3-sec\" type=\"hidden\" />\n\n                        <input autocomplete=\"off\" class=\"form-control digit-filter tempo tempo-4\" placeholder=\"T4\" style=\"width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em\" type=\"text\" />\n                        <input type=\"text\" style=\"width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em\" class=\"form-control time-filter midpoint-4\" id=\"midpoint-4\" placeholder=\"D4\" autocomplete=\"off\" />\n                        <input class=\"midpoint-4-sec\" type=\"hidden\" />\n                    </div>\n                </div>");
                $(this).parent().parent().parent().accordion("refresh");
                schedule.applyFilters();
                $(this).parent().parent().next().children().children(".tempo").focus();
            });
            $(".preset-4").click(schedule.preset4Button);
            $(".preset-5").click(schedule.preset5Button);
            $(".preset-6").click(schedule.preset6Button);
            $(".delete-form-row").click(function () {
                $(this).parent().parent().remove();
            });
            $(".digit-filter").keydown(function (e) {
                if (e.which < 32 && e.which != 13) {
                    return;
                }
                if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                    return;
                }
                switch (e.keyCode) {
                    case 37:
                    case 39:
                        return;
                    default:
                        e.preventDefault();
                        break;
                }
            });
            $(".time-filter").keydown(function (e) {
                if (e.which < 32 && e.which != 13) {
                    return;
                }
                if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                    return;
                }
                switch (e.keyCode) {
                    case 37:
                    case 39:
                    case 186:
                        return;
                    default:
                        e.preventDefault();
                        break;
                }
            });
            $(".time-filter").blur(function (e) {
                var self = $(e.target);
                var id = self.attr("id");
                var input = self.val();
                var parts = input.split(":");
                var h = "0";
                var m = "0";
                var s = "0";
                if (parts.length > 0) {
                    s = parts.pop();
                }
                if (parts.length > 0) {
                    m = parts.pop();
                }
                if (parts.length > 0) {
                    h = parts.pop();
                }
                var seconds = moment.duration(h + ":" + m + ":" + s).asSeconds();
                self.siblings("." + id + "-sec").val(seconds);
            });
        };
        Schedule.prototype.applyPreset = function (row, w, x, y, z) {
            var midpoint1 = row.children().children(".midpoint-1");
            var midpoint1sec = row.children().children(".midpoint-1-sec");
            var midpoint2 = row.children().children(".midpoint-2");
            var midpoint2sec = row.children().children(".midpoint-2-sec");
            var midpoint3 = row.children().children(".midpoint-3");
            var midpoint3sec = row.children().children(".midpoint-3-sec");
            var midpoint4 = row.children().children(".midpoint-4");
            var midpoint4sec = row.children().children(".midpoint-4-sec");
            midpoint1sec.val(w);
            midpoint1.val(timer.secondsToDisplay(w));
            midpoint2sec.val(x);
            midpoint2.val(timer.secondsToDisplay(x));
            midpoint3sec.val(y);
            midpoint3.val(timer.secondsToDisplay(y));
            midpoint4sec.val(z);
            midpoint4.val(timer.secondsToDisplay(z));
        };
        Schedule.prototype.drawChart = function (rowIndex) {
            var chartElement = $(".linechart_material");
            if (rowIndex < 0) {
                chartElement.children().detach();
                return;
            }
            var schedule = $(".schedule");
            var row = schedule.children().eq(rowIndex);
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Time');
            data.addColumn('number', 'Tempo');
            var x1 = 0;
            var y1 = parseInt(row.children().children(".tempo-0").val());
            for (var i = 0; i <= 5; i++) {
                data.addRow([x1, y1]);
                var dur = parseInt(row.children().children(".midpoint-" + i + "-sec").val());
                var x2 = x1 + dur;
                var y2 = parseInt(row.children().children(".tempo-" + (i + 1)).val());
                y2 = y2 > 0 ? y2 : y1;
                x1 = x2;
                y1 = y2;
            }
            var options = {
                chart: {
                    title: 'Tempo',
                    subtitle: '',
                },
                width: "100%",
                height: 250
            };
            var chart = new google.charts.Line(chartElement[0]);
            chart.draw(data, options);
        };
        Schedule.prototype.drawFirstChart = function () {
            schedule.drawChart(0);
        };
        Schedule.prototype.getUrlParameter = function (key) {
            var query = window.location.search.substring(1);
            var keyVal = query.split('&');
            for (var i = 0; i < keyVal.length; i++) {
                var sParameterName = keyVal[i].split('=');
                if (sParameterName[0] == key) {
                    return sParameterName[1];
                }
            }
        };
        Schedule.prototype.lineComplete = function () {
            timer.display.html("0:00");
            if (timeline.length > 0) {
                if (schedule.endWithBell.is(":checked") && (metronome.isRunning || timeline[0].tempo == 0)) {
                    schedule.endExerciseBell.play();
                }
                metronome.isRunning = false;
                timerStatus = TimerState.continuing;
                this.startMetronome();
            }
            else {
                this.scheduleComplete();
            }
        };
        Schedule.prototype.parseForm = function () {
            var tempo0 = $(".tempo-0");
            var tempo1 = $(".tempo-1");
            var tempo2 = $(".tempo-2");
            var tempo3 = $(".tempo-3");
            var tempo4 = $(".tempo-4");
            var tempo5 = $(".tempo-5");
            var midpoint0 = $(".midpoint-0-sec");
            var midpoint1 = $(".midpoint-1-sec");
            var midpoint2 = $(".midpoint-2-sec");
            var midpoint3 = $(".midpoint-3-sec");
            var midpoint4 = $(".midpoint-4-sec");
            var midpoint5 = $(".midpoint-5-sec");
            var exercise = $(".exercise");
            var steps = [];
            var rest = parseInt($(".rest").val());
            var timeline = [];
            var restStep = new Step(0, 0, rest, "Resting...", -1, true);
            for (var i = 0; i < tempo0.length; i++) {
                var e = exercise.eq(i).val();
                var t0 = parseInt(tempo0.eq(i).val());
                var d0 = parseInt(midpoint0.eq(i).val());
                var t1 = 0;
                var d1 = 0;
                var t2 = 0;
                var d2 = 0;
                var t3 = 0;
                var d3 = 0;
                var t4 = 0;
                var d4 = 0;
                var t5 = 0;
                var d5 = 0;
                if (tempo1.eq(i).val()) {
                    t1 = parseInt(tempo1.eq(i).val());
                }
                if (midpoint1.eq(i).val()) {
                    d1 = parseInt(midpoint1.eq(i).val());
                }
                if (tempo2.eq(i).val()) {
                    t2 = parseInt(tempo2.eq(i).val());
                }
                if (midpoint2.eq(i).val()) {
                    d2 = parseInt(midpoint2.eq(i).val());
                }
                if (tempo3.eq(i).val()) {
                    t3 = parseInt(tempo3.eq(i).val());
                }
                if (midpoint3.eq(i).val()) {
                    d3 = parseInt(midpoint3.eq(i).val());
                }
                if (tempo4.eq(i).val()) {
                    t4 = parseInt(tempo4.eq(i).val());
                }
                if (midpoint4.eq(i).val()) {
                    d4 = parseInt(midpoint4.eq(i).val());
                }
                if (tempo5.eq(i).val()) {
                    t5 = parseInt(tempo5.eq(i).val());
                }
                if (midpoint5.eq(i).val()) {
                    d5 = parseInt(midpoint5.eq(i).val());
                }
                {
                    var step = new Step(t0, (t1 ? t1 : t0), d0, e, i, false);
                    steps.push(step);
                }
                if (t1 && d1) {
                    var step = new Step(t1, (t2 ? t2 : t1), d1, e, i, false);
                    steps.push(step);
                }
                if (t2 && d2) {
                    var step = new Step(t2, (t3 ? t3 : t2), d2, e, i, false);
                    steps.push(step);
                }
                if (t3 && d3) {
                    var step = new Step(t3, (t4 ? t4 : t3), d3, e, i, false);
                    steps.push(step);
                }
                if (t4 && d4) {
                    var step = new Step(t4, (t5 ? t5 : t4), d4, e, i, false);
                    steps.push(step);
                }
                if (t5 && d5) {
                    var step = new Step(t5, t5, d5, e, i, false);
                    steps.push(step);
                }
                var last = steps.pop();
                last.isEndPoint = true;
                steps.push(last);
            }
            if (steps.length > 0 && rest > 0 && schedule.startWithRest.is(":checked")) {
                timeline.push(restStep);
            }
            for (var i = 0; i < steps.length; i++) {
                timeline.push(steps[i]);
                if (i < steps.length - 1 && rest > 0 && steps[i].isEndPoint) {
                    timeline.push(restStep);
                }
            }
            return timeline;
        };
        Schedule.prototype.parseQuery = function () {
            var schedule = $(".schedule");
            var t = this.getUrlParameter("t");
            var d = this.getUrlParameter("d");
            var e = this.getUrlParameter("e");
            if (t && d) {
                var tr = t.split("-");
                var dr = d.split("-");
                var er = e.split("-");
                for (var r = 0; r < tr.length; r++) {
                    var row = schedule.children().eq(r);
                    var tempos = tr[r].split(".");
                    var durations = dr[r].split(".");
                    var x1 = 0;
                    var y1 = parseInt(tempos[0]);
                    er[r] = decodeURIComponent(er[r]);
                    er[r] = er[r].replace(/%26/g, '&');
                    er[r] = er[r].replace(/%2D/g, '-');
                    row.children().children(".exercise").val(er[r]);
                    for (var i = 0; i <= tempos.length; i++) {
                        row.children().children(".tempo-" + i).val(tempos[i]);
                        row.children().children(".midpoint-" + i + "-sec").val(durations[i]);
                        var durationSec = parseInt(durations[i]);
                        var m = Math.floor(durationSec / 60).toString().slice(-1);
                        var s = (durationSec % 60).toString();
                        if (s.length < 2) {
                            s = "0" + s;
                        }
                        row.children().children(".midpoint-" + i).val(m + ":" + s);
                        var dur = parseInt(durations[i]);
                        var x2 = x1 + dur;
                        var y2 = parseInt(tempos[i + 1]);
                        y2 = y2 > 0 ? y2 : y1;
                        x1 = x2;
                        y1 = y2;
                    }
                }
                if (location.pathname.indexOf("accelerating-metronome") >= 0) {
                    google.charts.load('current', { 'packages': ['line'] });
                    google.charts.setOnLoadCallback(this.drawFirstChart);
                }
            }
        };
        Schedule.prototype.preset4Button = function () {
            var row = this.body.parent().parent();
            var s = row.children().children(".duration-sec").val();
            schedule.applyPreset(row, 5, (s - 5), s, s);
        };
        Schedule.prototype.preset5Button = function () {
            var row = this.body.parent().parent();
            var s = row.children().children(".duration-sec").val();
            schedule.applyPreset(row, 5, (s / 2 - 5), (s / 2 + 5), (s - 5));
        };
        Schedule.prototype.preset6Button = function () {
            var row = this.body.parent().parent();
            var s = row.children().children(".duration-sec").val();
            schedule.applyPreset(row, 0, 0, 5, (s - 5));
        };
        Schedule.prototype.scheduleComplete = function () {
            metronome.isRunning = false;
            window.clearInterval(tempo.intervalId);
            timer.stop();
            timer.display.html("0:00");
            tempo.tempoDisplay.html(this.currentStep.endTempo.toString());
            this.exerciseDisplay.text("Done!");
            schedule.body.css({ "background-color": "#001912", "color": "#009871" });
            if (schedule.endWithBell.is(":checked")) {
                schedule.endRoutineBell.play();
            }
            timer.updateButton(TimerState.stopped);
        };
        Schedule.prototype.setQuery = function () {
            var startWithRest = $(".start-with-rest");
            var endWithBell = $(".end-with-bell");
            var tempo0 = $(".tempo-0");
            var tempo1 = $(".tempo-1");
            var tempo2 = $(".tempo-2");
            var tempo3 = $(".tempo-3");
            var tempo4 = $(".tempo-4");
            var tempo5 = $(".tempo-5");
            var midpoint0 = $(".midpoint-0-sec");
            var midpoint1 = $(".midpoint-1-sec");
            var midpoint2 = $(".midpoint-2-sec");
            var midpoint3 = $(".midpoint-3-sec");
            var midpoint4 = $(".midpoint-4-sec");
            var midpoint5 = $(".midpoint-5-sec");
            var exercise = $(".exercise");
            var q = $("#rest").val();
            q += "&" + startWithRest.is(":checked");
            q += "&" + endWithBell.is(":checked");
            q += "&";
            for (var i = 0; i < tempo0.length; i++) {
                if (i > 0) {
                    q += "-";
                }
                q += tempo0.eq(i).val();
                if (tempo1.eq(i).val()) {
                    q += "." + tempo1.eq(i).val();
                }
                if (tempo2.eq(i).val()) {
                    q += "." + tempo2.eq(i).val();
                }
                if (tempo3.eq(i).val()) {
                    q += "." + tempo3.eq(i).val();
                }
                if (tempo4.eq(i).val()) {
                    q += "." + tempo4.eq(i).val();
                }
                if (tempo5.eq(i).val()) {
                    q += "." + tempo5.eq(i).val();
                }
            }
            q += "&";
            for (var i = 0; i < midpoint0.length; i++) {
                if (i > 0) {
                    q += "-";
                }
                q += midpoint0.eq(i).val();
                if (midpoint1.eq(i).val()) {
                    q += "." + midpoint1.eq(i).val();
                }
                if (midpoint2.eq(i).val()) {
                    q += "." + midpoint2.eq(i).val();
                }
                if (midpoint3.eq(i).val()) {
                    q += "." + midpoint3.eq(i).val();
                }
                if (midpoint4.eq(i).val()) {
                    q += "." + midpoint4.eq(i).val();
                }
                if (midpoint5.eq(i).val()) {
                    q += "." + midpoint5.eq(i).val();
                }
            }
            q += "&";
            for (var i = 0, tot = exercise.length; i < tot; i++) {
                var e = exercise.eq(i).val();
                e = e.replace(/&/g, '%26');
                e = e.replace(/-/g, '%2D');
                if (i > 0) {
                    q += "-";
                }
                q += e;
            }
            $(".query").val(q);
        };
        Schedule.prototype.startMetronome = function () {
            switch (timerStatus) {
                case TimerState.stopped:
                    if (timeline.length == 0) {
                        timeline = schedule.parseForm();
                        if (timeline.length == 0) {
                            return;
                        }
                    }
                    timerStatus = TimerState.continuing;
                    schedule.startMetronome();
                    break;
                case TimerState.continuing:
                    schedule.lastStep = schedule.currentStep;
                    schedule.currentStep = timeline.shift();
                    if (location.pathname.indexOf("accelerating-metronome") >= 0) {
                        if (schedule.lastStep == null || schedule.currentStep.graph != schedule.lastStep.graph) {
                            schedule.drawChart(schedule.currentStep.graph);
                        }
                    }
                    schedule.currentStep.startTime = moment.now();
                    timer.timeLeft = schedule.currentStep.durationSec;
                    timer.setDisplay();
                    timer.play();
                    tempo.setTempoDisplay();
                    schedule.body.css({ "background-color": "", "color": "" });
                    schedule.exerciseDisplay.text(schedule.currentStep.exercise);
                    metronome.isRunning = tempo.current > 0;
                    if (metronome.isRunning) {
                        metronome.swingtime = 60000 / tempo.current;
                        if (schedule.lastStep == null || schedule.lastStep.isEndPoint) {
                            metronome.pendulumParent.animate({ rotate: metronome.initrotation }, 0, function () {
                                metronome.pendulumParent.css("display", "block");
                                metronome.downbeatClick.play();
                                metronome.swingPendulum();
                            });
                        }
                        timerStatus = TimerState.running;
                    }
                    else {
                        metronome.stopPendulum();
                        timerStatus = TimerState.settling;
                    }
                    break;
                case TimerState.settling:
                    metronome.swingtime = 60000 / tempo.current;
                    timerStatus = TimerState.running;
                    break;
                case TimerState.paused:
                    timer.updateButton(TimerState.running);
                    timer.play();
                    metronome.isRunning = tempo.current > 0;
                    if (metronome.isRunning) {
                        metronome.pendulumParent.animate({ rotate: metronome.initrotation }, 0, function () {
                            metronome.pendulumParent.css("display", "block");
                            metronome.downbeatClick.play();
                            metronome.swingPendulum();
                        });
                    }
                    break;
                case TimerState.running:
                    timer.updateButton(TimerState.paused);
                    timer.pause();
                    metronome.isRunning = false;
                    metronome.pendulumParent.stop();
                    break;
                default:
                    break;
            }
        };
        return Schedule;
    }());
    var Tempo = /** @class */ (function () {
        function Tempo() {
            this.current = 120;
            this.tempoDisplay = $(".tempo-display");
        }
        Tempo.prototype.setTempoDisplay = function () {
            this.current = schedule.currentStep.tempo;
            tempo.tempoDisplay.text(this.current);
            if (schedule.currentStep.endTempo == schedule.currentStep.tempo) {
                window.clearInterval(this.intervalId);
            }
            else {
                var delta = Math.abs(schedule.currentStep.endTempo - schedule.currentStep.tempo);
                var period = schedule.currentStep.durationSec / delta;
                this.intervalId = window.setInterval(tempo.tempoCallback, 1000 * period);
            }
        };
        Tempo.prototype.tempoCallback = function () {
            var change = schedule.currentStep.endTempo - schedule.currentStep.tempo;
            var elapsed = moment.now() - schedule.currentStep.startTime;
            var dur = schedule.currentStep.durationSec * 1000;
            tempo.current = schedule.currentStep.tempo + change * elapsed / dur;
            tempo.tempoDisplay.text(Math.round(tempo.current));
        };
        return Tempo;
    }());
    var Timer = /** @class */ (function () {
        function Timer() {
            this.display = $(".timer-display");
            this.startButton = $(".timer-start");
            this.timeLeft = 0;
        }
        Timer.prototype.initialize = function () {
            if (this.display.length > 0) {
                schedule.applyFilters();
                this.timerPlugin = createTimer(timer.callback);
            }
            this.startButton.click(schedule.startMetronome);
        };
        Timer.prototype.setDisplay = function () {
            if (schedule.currentStep.isEndPoint) {
                this.display.html(this.secondsToDisplay(this.timeLeft));
            }
            else {
                var timeLeftInLine = this.timeLeft;
                for (var i = 0; i < timeline.length; i++) {
                    timeLeftInLine += timeline[i].durationSec;
                    if (timeline[i].isEndPoint) {
                        break;
                    }
                }
                this.display.html(this.secondsToDisplay(timeLeftInLine));
            }
        };
        Timer.prototype.callback = function () {
            timer.timeLeft--;
            if (timer.timeLeft > 0) {
                timer.setDisplay();
                if (timerStatus == TimerState.settling) {
                    schedule.startMetronome();
                }
            }
            else if (schedule.currentStep.isEndPoint) {
                schedule.lineComplete();
            }
            else {
                timerStatus = TimerState.continuing;
                schedule.startMetronome();
            }
        };
        Timer.prototype.play = function () {
            this.timerPlugin.play();
        };
        Timer.prototype.pause = function () {
            this.timerPlugin.pause();
        };
        Timer.prototype.stop = function () {
            this.timerPlugin.stop();
        };
        Timer.prototype.secondsToDisplay = function (seconds) {
            var timeSpan = moment.duration(seconds, 'seconds');
            return moment.utc(timeSpan.asMilliseconds()).format("m:ss");
        };
        Timer.prototype.updateButton = function (state) {
            timerStatus = state;
            switch (timerStatus) {
                case TimerState.stopped:
                case TimerState.paused:
                    timer.startButton.html('<span class="glyphicon glyphicon-play"></span>');
                    break;
                case TimerState.running:
                    timer.startButton.html('<span class="glyphicon glyphicon-pause"></span>');
                    break;
            }
        };
        return Timer;
    }());
    var metronome;
    var schedule;
    var tempo;
    var timeline = [];
    var timer;
    var timerStatus = TimerState.stopped;
    $(function () {
        if (jQuery.ui) {
            $("#accordion")
                .accordion({
                header: "> div > h3",
                activate: function (event, ui) {
                    schedule.drawChart(ui.newHeader.parent().index());
                }
            })
                .sortable({
                axis: "y",
                handle: "h3",
                stop: function (event, ui) {
                    // IE doesn't register the blur when sorting
                    // so trigger focusout handlers to remove .ui-state-focus
                    ui.item.children("h3").triggerHandler("focusout");
                    // Refresh accordion to handle new order
                    $(this).accordion("refresh");
                }
            });
        }
    });
    $(document).ready(function () {
        metronome = new Metronome();
        schedule = new Schedule();
        tempo = new Tempo();
        timer = new Timer();
        if (metronome.startatcentre == true) {
            metronome.initrotation = 0;
        }
        $("form").submit(function (event) {
            event.preventDefault();
            schedule.setQuery();
            var self = this;
            self.submit();
        });
        $(".preset-4").click(schedule.preset4Button);
        $(".preset-5").click(schedule.preset5Button);
        $(".preset-6").click(schedule.preset6Button);
        schedule.parseQuery();
        metronome.initialize();
        metronome.swingtime = 60000 / tempo.current;
        timer.initialize();
        $(".timer-start").removeAttr("disabled");
    });
})(Metronome || (Metronome = {}));
//# sourceMappingURL=Metronome.js.map