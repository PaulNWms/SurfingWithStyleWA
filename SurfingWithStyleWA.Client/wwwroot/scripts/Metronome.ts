import * as moment from 'moment';

declare namespace google {
    namespace visualization {
        export class DataTable {
            constructor(data?: any, version?: any);
            addColumn(type: string, label?: string, id?: string): number;
            //            addColumn(descriptionObject: DataTableColumnDescription): number;
            //            addRow(cellObject: DataObjectCell): number;
            addRow(cellArray?: any[]): number;
            addRows(numberOfEmptyRows: number): number;
            //            addRows(rows: DataObjectCell[][]): number;
            addRows(rows: any[][]): number;
            clone(): DataTable;
            getColumnId(columnIndex: number): string;
            getColumnLabel(columnIndex: number): string;
            getColumnPattern(columnIndex: number): string;
            //            getColumnProperties(columnIndex: number): Properties;
            getColumnProperty(columnIndex: number, name: string): any;
            getColumnRange(columnIndex: number): { min: any; max: any };
            getColumnRole(columnIndex: string): string;
            getColumnType(columnIndex: number): string;
            getDistinctValues(columnIndex: number): any[];
            //            getFilteredRows(filters: DataTableCellFilter[]): number[];
            getFormattedValue(rowIndex: number, columnIndex: number): string;
            getNumberOfColumns(): number;
            getNumberOfRows(): number;
            getProperty(rowIndex: number, columnIndex: number, name: string): any;
            //            getProperties(rowIndex: number, columnIndex: number): Properties;
            //            getRowProperties(rowIndex: number): Properties;
            //            getRowProperty(rowIndex: number, name: string): Properties;
            getSortedRows(sortColumn: number): number[];
            //            getSortedRows(sortColumn: SortByColumn): number[];
            getSortedRows(sortColumns: number[]): number[];
            //            getSortedRows(sortColumns: SortByColumn[]): number[];
            //            getTableProperties(): Properties;
            getTableProperty(name: string): any;
            getValue(rowIndex: number, columnIndex: number): any;
            insertColumn(columnIndex: number, type: string, label?: string, id?: string): void;
            insertRows(rowIndex: number, numberOfEmptyRows: number): void;
            //            insertRows(rowIndex: number, rows: DataObjectCell[][]): void;
            insertRows(rowIndex: number, rows: any[][]): void;
            removeColumn(columnIndex: number): void;
            removeColumns(columnIndex: number, numberOfColumns: number): void;
            removeRow(rowIndex: number): void;
            removeRows(rowIndex: number, numberOfRows: number): void;
            //            setCell(rowIndex: number, columnIndex: number, value?: any, formattedValue?: string, properties?: Properties): void;
            setColumnLabel(columnIndex: number, label: string): void;
            setColumnProperty(columnIndex: number, name: string, value: any): void;
            //            setColumnProperties(columnIndex: number, properties: Properties): void;
            setFormattedValue(rowIndex: number, columnIndex: number, formattedValue: string): void;
            setProperty(rowIndex: number, columnIndex: number, name: string, value: any): void;
            //            setProperties(rowIndex: number, columnIndex: number, properties: Properties): void;
            setRowProperty(rowIndex: number, name: string, value: any): void;
            //            setRowProperties(rowIndex: number, properties: Properties): void;
            setTableProperty(name: string, value: any): void;
            //            setTableProperties(properties: Properties): void;
            setValue(rowIndex: number, columnIndex: number, value: any): void;
            sort(sortColumn: number): number[];
            //            sort(sortColumn: SortByColumn): number[];
            sort(sortColumns: number[]): number[];
            //            sort(sortColumns: SortByColumn[]): number[];
            toJSON(): string;
        }
    }

    namespace charts {
        function load(version: string, packages: any): void;
        function setOnLoadCallback(handler: Function): void;
        function setOnLoadCallback(handler: () => void): void;
        export interface LineChartOptions {
        }
        export class Line {
            constructor(element: Element);
            draw(data: visualization.DataTable, options: LineChartOptions): void;
        }
    }
}

module Metronome {
    declare function myRedraw(element);
    declare function createTimer(callback);

    enum TimerState { stopped, running, paused, continuing, settling };

    interface IMetronome {
        downbeatClick: HTMLMediaElement;
        initrotation: number;
        isRunning: boolean;
        rotation: number;
        swingtime: number;
        startatcentre: boolean;

        initialize();
        startButtonClick();
        swingPendulum();
        stopPendulum();
    }

    interface ISchedule {
        body: JQuery;
        currentStep: Step;
        lastStep: Step;
        endExerciseBell: HTMLMediaElement;
        endRoutineBell: HTMLMediaElement;
        endWithBell: JQuery;
        exerciseDisplay: JQuery;
        startWithRest: JQuery;

        applyFilters();
        applyPreset(row: JQuery, w: number, x: number, y: number, z: number);
        drawChart(chartIndex: number);
        parseForm();
        parseQuery();
        preset4Button();
        preset5Button();
        preset6Button();
        lineComplete();
        scheduleComplete();
        setQuery();
        startMetronome();
    }

    interface ITempo {
        current: number;
        intervalId: number;
        tempoDisplay: JQuery;

        setTempoDisplay();
        tempoCallback();
    }

    interface ITimer {
        startButton: JQuery;
        display: JQuery;
        timeLeft: number;

        initialize();
        setDisplay();
        play();
        pause();
        stop();
        secondsToDisplay(seconds: number): string;
        callback();
        updateButton(state: TimerState);
    }

    class Step {
        tempo: number;
        endTempo: number;
        durationSec: number;
        exercise: string;
        graph: number;
        startTime: number;
        isEndPoint: boolean;

        constructor(tempo: number, endTempo: number, durationSec: number, exercise: string, graph: number, isEndPoint: boolean) {
            this.tempo = tempo;
            this.endTempo = endTempo;
            this.durationSec = durationSec;
            this.exercise = exercise;
            this.graph = graph;
            this.isEndPoint = isEndPoint;
        }
    }

    export class Metronome implements IMetronome {
        public isRunning: boolean;

        constructor() {
            this.rotation = 40;
            this.initrotation = this.rotation;
            this.downbeatClick = <HTMLMediaElement>$(".downbeat-click")[0];
            this.startatcentre = true;
            this.startButton = $(".metronome-start");
            this.pendulumParent = $('.pendulum-parent');
            this.tempoDecrement = $(".tempo-decrement")
            this.tempoIncrement = $(".tempo-increment")
            this.tempoSlider = $(".tempo-slider");
        }

        public initialize() {
            this.startButton.click(() => {
                metronome.startButtonClick();
            });

            this.pendulumParent.animate({ rotate: this.initrotation }, 0, () => {
                this.pendulumParent.css("display", "block");
                this.stopPendulum();
            });

            this.tempoSlider.change(function () {
                if (metronome.isRunning) {
                    metronome.pendulumParent.stop();
                }

                tempo.current = parseInt(this.innerText);
                tempo.tempoDisplay.text(tempo.current);
                metronome.swingtime = 60000 / tempo.current;

                if (metronome.isRunning) {
                    metronome.pendulumParent.animate({ rotate: metronome.rotation }, metronome.swingtime, "swing", () => {
                        metronome.pendulumParent.css("display", "block");
                        metronome.swingPendulum();
                    });
                }
            });

            this.tempoDecrement.click(() => {
                metronome.tempoSlider.val((<number>metronome.tempoSlider.val()) * 1 - 1);
                metronome.tempoSlider.trigger("change");
            });

            this.tempoIncrement.click(() => {
                metronome.tempoSlider.val((<number>metronome.tempoSlider.val()) * 1 + 1);
                metronome.tempoSlider.trigger("change");
            });
        }

        public startButtonClick() {
            this.isRunning = !this.isRunning;

            if (this.isRunning) {
                this.startButton.html('<span class="glyphicon glyphicon-pause" />');
                this.pendulumParent.animate({ rotate: this.initrotation }, 0, () => {
                    this.pendulumParent.css("display", "block");
                    this.downbeatClick.play();
                    this.swingPendulum();
                });
            }
            else {
                this.startButton.html('<span class="glyphicon glyphicon-play" />');
                this.pendulumParent.stop();
            }
        }

        public swingPendulum() {
            if (schedule.currentStep.tempo != schedule.currentStep.endTempo) {
                let change: number = schedule.currentStep.endTempo - schedule.currentStep.tempo;
                let elapsed: number = moment.now() - schedule.currentStep.startTime;
                let dur: number = schedule.currentStep.durationSec * 1000;
                tempo.current = schedule.currentStep.tempo + change * elapsed / dur;
                this.swingtime = 60000 / tempo.current;
            }

            this.pendulumParent.animate({ rotate: metronome.rotation }, this.swingtime, "swing", function () {
                metronome.rotation *= -1;

                if (metronome.isRunning) {
                    metronome.swingPendulum();
                    metronome.downbeatClick.play();
                } else {
                    metronome.stopPendulum();
                }
            });
        }

        public stopPendulum() {
            this.pendulumParent.animate({ rotate: 0 }, (this.swingtime / 1.5), "swing");
        }

        public downbeatClick: HTMLMediaElement;
        public initrotation: number;
        public pendulumParent: JQuery;
        public rotation: number;
        public startatcentre: boolean;
        public swingtime: number;
        private startButton: JQuery;
        private tempoDecrement: JQuery;
        private tempoIncrement: JQuery;
        private tempoSlider: JQuery;
    }

    class Schedule implements ISchedule {
        constructor() {
            this.body = $("body");
            this.currentStep = new Step(120, 120, 365 * 24 * 60 * 60, "", -1, true);
            this.endExerciseBell = <HTMLMediaElement>$(".end-exercise-bell")[0];
            this.endRoutineBell = <HTMLMediaElement>$(".end-routine-bell")[0];
            this.endWithBell = $(".end-with-bell");
            this.exerciseDisplay = $(".exercise-display");
            this.startWithRest = $(".start-with-rest");
        }

        public applyFilters() {
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
                $(this).parent().parent().after(
                    `                        <tr>
                            <td>
                                <button type="button" class="btn btn-primary delete-form-row" style="margin-top:0.2em;margin-right:0.2em"><span class="glyphicon glyphicon-remove"></span></button>
                            </td>
                            <td>
                                <input type="text" style="width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em" class="form-control digit-filter tempo tempo-0" id="tempo-0" placeholder="Tempo" autocomplete="off" value="120" />
                            </td> 
                            <td>
                                <input type="text" style="width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em" class="form-control time-filter midpoint-0" id="midpoint-0" placeholder="Duration" autocomplete="off" value="2:00" />
                                <input type="hidden"class="midpoint-0-sec" />
                            </td> 
                            <td>
                                <input type="text" style="margin-top:0.2em;margin-right:0.2em" class="form-control exercise" id="exercise" placeholder="Exercise"/>
                            </td>
                            <td>
                                <button type="button" class="btn btn-primary add-form-row" style="margin-top:0.2em"><span class="glyphicon glyphicon-plus"></span></button>
                            </td>
                        </tr>`);
                schedule.applyFilters();
                $(this).parent().parent().next().children().children(".tempo").focus();
            });

            $(".add-accelerating-row").click(function () {
                $(this).parent().parent().after(
                    `                <div class="group form-group col-xs-9">
                    <h3>
                        <input autocomplete="off" class="form-control digit-filter tempo tempo-0" placeholder="T1" style="width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em" type="text" />
                        <input type="text" style="width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em" class="form-control time-filter midpoint-0" id="midpoint-0" placeholder="D1" autocomplete="off" />
                        <input class="midpoint-0-sec" type="hidden" />
                    </h3>
                    <div>
                        <div>
                            <svg viewBox="-30 0 520 250" preserveAspectRatio="none">
                                <rect x="-30" y="0" width="520" height="250" style="stroke: black; fill: black;" />

                                <text x="110" y="240">30</text>
                                <text x="230" y="240">60</text>
                                <text x="350" y="240">90</text>
                                <text x="455" y="240">120</text>

                                <text class="text-mm" x="-30" y="213">40</text>
                                <text class="text-mm" x="-30" y="193">60</text>
                                <text class="text-mm" x="-30" y="173">80</text>
                                <text class="text-mm" x="-30" y="153">100</text>
                                <text class="text-mm" x="-30" y="133">120</text>
                                <text class="text-mm" x="-30" y="113">140</text>
                                <text class="text-mm" x="-30" y="93">160</text>
                                <text class="text-mm" x="-30" y="73">180</text>
                                <text class="text-mm" x="-30" y="53">200</text>
                                <text class="text-mm" x="-30" y="33">220</text>
                                <text class="text-mm" x="-30" y="13">240</text>

                                <g transform="translate(0,250) scale(1,-1)">
                                    <line class="axis-line" x1="0" y1="30" x2="480" y2="30"></line>
                                    <line class="grid-line" x1="-1" y1="40" x2="480" y2="40"></line>
                                    <line class="grid-line" x1="0" y1="50" x2="480" y2="50"></line>
                                    <line class="grid-line" x1="-1" y1="60" x2="480" y2="60"></line>
                                    <line class="grid-line" x1="0" y1="70" x2="480" y2="70"></line>
                                    <line class="grid-line" x1="-1" y1="80" x2="480" y2="80"></line>
                                    <line class="grid-line" x1="0" y1="90" x2="480" y2="90"></line>
                                    <line class="grid-line" x1="-1" y1="100" x2="480" y2="100"></line>
                                    <line class="grid-line" x1="0" y1="110" x2="480" y2="110"></line>
                                    <line class="grid-line" x1="-1" y1="120" x2="480" y2="120"></line>
                                    <line class="grid-line" x1="0" y1="130" x2="480" y2="130"></line>
                                    <line class="grid-line" x1="-1" y1="140" x2="480" y2="140"></line>
                                    <line class="grid-line" x1="0" y1="150" x2="480" y2="150"></line>
                                    <line class="grid-line" x1="-1" y1="160" x2="480" y2="160"></line>
                                    <line class="grid-line" x1="0" y1="170" x2="480" y2="170"></line>
                                    <line class="grid-line" x1="-1" y1="180" x2="480" y2="180"></line>
                                    <line class="grid-line" x1="0" y1="190" x2="480" y2="190"></line>
                                    <line class="grid-line" x1="-1" y1="200" x2="480" y2="200"></line>
                                    <line class="grid-line" x1="0" y1="210" x2="480" y2="210"></line>
                                    <line class="grid-line" x1="-1" y1="220" x2="480" y2="220"></line>
                                    <line class="grid-line" x1="0" y1="230" x2="480" y2="230"></line>
                                    <line class="grid-line" x1="-1" y1="240" x2="480" y2="240"></line>

                                    <line class="axis-line" x1="0" y1="30" x2="0" y2="240"></line>
                                    <line class="grid-line" x1="40" y1="28" x2="40" y2="240"></line>
                                    <line class="grid-line" x1="80" y1="28" x2="80" y2="240"></line>
                                    <line class="grid-line" x1="120" y1="28" x2="120" y2="240"></line>
                                    <line class="grid-line" x1="160" y1="28" x2="160" y2="240"></line>
                                    <line class="grid-line" x1="200" y1="28" x2="200" y2="240"></line>
                                    <line class="grid-line" x1="240" y1="28" x2="240" y2="240"></line>
                                    <line class="grid-line" x1="280" y1="28" x2="280" y2="240"></line>
                                    <line class="grid-line" x1="320" y1="28" x2="320" y2="240"></line>
                                    <line class="grid-line" x1="360" y1="28" x2="360" y2="240"></line>
                                    <line class="grid-line" x1="400" y1="28" x2="400" y2="240"></line>
                                    <line class="grid-line" x1="440" y1="28" x2="440" y2="240"></line>
                                    <line class="grid-line" x1="480" y1="28" x2="480" y2="240"></line>
                                </g>
                            </svg>
                        </div>
                        <input autocomplete="off" class="form-control digit-filter tempo tempo-0" placeholder="T1" style="width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em" type="text" />
                        <input type="text" style="width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em" class="form-control time-filter midpoint-0" id="midpoint-0" placeholder="D1" autocomplete="off" />
                        <input class="midpoint-0-sec" type="hidden" />

                        <input autocomplete="off" class="form-control digit-filter tempo tempo-1" placeholder="T1" style="width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em" type="text" />
                        <input type="text" style="width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em" class="form-control time-filter midpoint-1" id="midpoint-1" placeholder="D1" autocomplete="off" />
                        <input class="midpoint-1-sec" type="hidden" />

                        <input autocomplete="off" class="form-control digit-filter tempo tempo-2" placeholder="T2" style="width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em" type="text" />
                        <input type="text" style="width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em" class="form-control time-filter midpoint-2" id="midpoint-2" placeholder="D2" autocomplete="off" />
                        <input class="midpoint-2-sec" type="hidden" />

                        <input autocomplete="off" class="form-control digit-filter tempo tempo-3" placeholder="T3" style="width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em" type="text" />
                        <input type="text" style="width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em" class="form-control time-filter midpoint-3" id="midpoint-3" placeholder="D3" autocomplete="off" />
                        <input class="midpoint-3-sec" type="hidden" />

                        <input autocomplete="off" class="form-control digit-filter tempo tempo-4" placeholder="T4" style="width:3em;margin-top:0.2em;margin-right:0.2em;padding-left:0.3em;padding-right:0.3em" type="text" />
                        <input type="text" style="width:3.5em;margin-top:0.2em;margin-right:0.2em;padding-left:0.5em;padding-right:0.5em" class="form-control time-filter midpoint-4" id="midpoint-4" placeholder="D4" autocomplete="off" />
                        <input class="midpoint-4-sec" type="hidden" />
                    </div>
                </div>`);
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

            $(".digit-filter").keydown(e => {
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

            $(".time-filter").keydown(e => {
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

            $(".time-filter").blur(e => {
                let self = $(e.target);
                let id = self.attr("id");
                let input: string = <string>self.val();
                let parts: string[] = input.split(":");
                let h: string = "0";
                let m: string = "0";
                let s: string = "0";

                if (parts.length > 0) {
                    s = parts.pop();
                }

                if (parts.length > 0) {
                    m = parts.pop();
                }

                if (parts.length > 0) {
                    h = parts.pop();
                }

                let seconds = moment.duration(h + ":" + m + ":" + s).asSeconds();
                self.siblings("." + id + "-sec").val(seconds);
            });
        }

        public applyPreset(row: JQuery, w: number, x: number, y: number, z: number) {
            let midpoint1 = row.children().children(".midpoint-1");
            let midpoint1sec = row.children().children(".midpoint-1-sec");
            let midpoint2 = row.children().children(".midpoint-2");
            let midpoint2sec = row.children().children(".midpoint-2-sec");
            let midpoint3 = row.children().children(".midpoint-3");
            let midpoint3sec = row.children().children(".midpoint-3-sec");
            let midpoint4 = row.children().children(".midpoint-4");
            let midpoint4sec = row.children().children(".midpoint-4-sec");
            midpoint1sec.val(w);
            midpoint1.val(timer.secondsToDisplay(w));
            midpoint2sec.val(x);
            midpoint2.val(timer.secondsToDisplay(x));
            midpoint3sec.val(y);
            midpoint3.val(timer.secondsToDisplay(y));
            midpoint4sec.val(z);
            midpoint4.val(timer.secondsToDisplay(z));
        }

        public drawChart(rowIndex: number) {
            let chartElement: JQuery = $(".linechart_material");

            if (rowIndex < 0) {
                chartElement.children().detach();
                return;
            }

            let schedule: JQuery = $(".schedule");
            let row: JQuery = schedule.children().eq(rowIndex);
            let data = new google.visualization.DataTable();
            data.addColumn('number', 'Time');
            data.addColumn('number', 'Tempo');
            let x1: number = 0;
            let y1: number = parseInt(<string>row.children().children(".tempo-0").val());

            for (let i = 0; i <= 5; i++) {
                data.addRow([x1, y1]);
                let dur: number = parseInt(<string>row.children().children(".midpoint-" + i + "-sec").val());
                let x2 = x1 + dur;
                let y2: number = parseInt(<string>row.children().children(".tempo-" + (i + 1)).val());
                y2 = y2 > 0 ? y2 : y1;
                x1 = x2;
                y1 = y2;
            }

            let options = {
                chart: {
                    title: 'Tempo',
                    subtitle: '',
                },
                width: "100%",
                height: 250
            };

            let chart = new google.charts.Line(chartElement[0]);
            chart.draw(data, options);
        }

        private drawFirstChart() {
            schedule.drawChart(0);
        }

        private getUrlParameter(key: string): string {
            let query: string = window.location.search.substring(1);
            let keyVal: string[] = query.split('&');

            for (let i = 0; i < keyVal.length; i++) {
                let sParameterName = keyVal[i].split('=');
                if (sParameterName[0] == key) {
                    return sParameterName[1];
                }
            }
        }

        public lineComplete() {
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
        }

        public parseForm() {
            let tempo0: JQuery = $(".tempo-0");
            let tempo1: JQuery = $(".tempo-1");
            let tempo2: JQuery = $(".tempo-2");
            let tempo3: JQuery = $(".tempo-3");
            let tempo4: JQuery = $(".tempo-4");
            let tempo5: JQuery = $(".tempo-5");
            let midpoint0: JQuery = $(".midpoint-0-sec");
            let midpoint1: JQuery = $(".midpoint-1-sec");
            let midpoint2: JQuery = $(".midpoint-2-sec");
            let midpoint3: JQuery = $(".midpoint-3-sec");
            let midpoint4: JQuery = $(".midpoint-4-sec");
            let midpoint5: JQuery = $(".midpoint-5-sec");
            let exercise: JQuery = $(".exercise")
            let steps: Array<Step> = [];
            let rest: number = parseInt(<string>$(".rest").val());
            let timeline = [];

            let restStep = new Step(0, 0, rest, "Resting...", -1, true);

            for (let i = 0; i < tempo0.length; i++) {
                let e: string = <string>exercise.eq(i).val();
                let t0: number = parseInt(<string>tempo0.eq(i).val());
                let d0: number = parseInt(<string>midpoint0.eq(i).val());
                let t1: number = 0;
                let d1: number = 0;
                let t2: number = 0;
                let d2: number = 0;
                let t3: number = 0;
                let d3: number = 0;
                let t4: number = 0;
                let d4: number = 0;
                let t5: number = 0;
                let d5: number = 0;

                if (tempo1.eq(i).val()) { t1 = parseInt(<string>tempo1.eq(i).val()); }
                if (midpoint1.eq(i).val()) { d1 = parseInt(<string>midpoint1.eq(i).val()); }
                if (tempo2.eq(i).val()) { t2 = parseInt(<string>tempo2.eq(i).val()); }
                if (midpoint2.eq(i).val()) { d2 = parseInt(<string>midpoint2.eq(i).val()); }
                if (tempo3.eq(i).val()) { t3 = parseInt(<string>tempo3.eq(i).val()); }
                if (midpoint3.eq(i).val()) { d3 = parseInt(<string>midpoint3.eq(i).val()); }
                if (tempo4.eq(i).val()) { t4 = parseInt(<string>tempo4.eq(i).val()); }
                if (midpoint4.eq(i).val()) { d4 = parseInt(<string>midpoint4.eq(i).val()); }
                if (tempo5.eq(i).val()) { t5 = parseInt(<string>tempo5.eq(i).val()); }
                if (midpoint5.eq(i).val()) { d5 = parseInt(<string>midpoint5.eq(i).val()); }

                {
                    let step = new Step(t0, (t1 ? t1 : t0), d0, e, i, false);
                    steps.push(step);
                }

                if (t1 && d1) {
                    let step = new Step(t1, (t2 ? t2 : t1), d1, e, i, false);
                    steps.push(step);
                }

                if (t2 && d2) {
                    let step = new Step(t2, (t3 ? t3 : t2), d2, e, i, false);
                    steps.push(step);
                }

                if (t3 && d3) {
                    let step = new Step(t3, (t4 ? t4 : t3), d3, e, i, false);
                    steps.push(step);
                }

                if (t4 && d4) {
                    let step = new Step(t4, (t5 ? t5 : t4), d4, e, i, false);
                    steps.push(step);
                }

                if (t5 && d5) {
                    let step = new Step(t5, t5, d5, e, i, false);
                    steps.push(step);
                }

                let last: Step = steps.pop();
                last.isEndPoint = true;
                steps.push(last);
            }

            if (steps.length > 0 && rest > 0 && schedule.startWithRest.is(":checked")) {
                timeline.push(restStep);
            }

            for (let i = 0; i < steps.length; i++) {
                timeline.push(steps[i]);

                if (i < steps.length - 1 && rest > 0 && steps[i].isEndPoint) {
                    timeline.push(restStep);
                }
            }

            return timeline;
        }

        public parseQuery() {
            let schedule: JQuery<HTMLElement> = $(".schedule");
            let t: string = this.getUrlParameter("t");
            let d: string = this.getUrlParameter("d");
            let e: string = this.getUrlParameter("e");

            if (t && d) {
                let tr: string[] = t.split("-");
                let dr: string[] = d.split("-");
                let er: string[] = e.split("-");

                for (let r = 0; r < tr.length; r++) {
                    let row: JQuery = schedule.children().eq(r);
                    let tempos: string[] = tr[r].split(".");
                    let durations: string[] = dr[r].split(".");
                    let x1: number = 0;
                    let y1: number = parseInt(tempos[0]);

                    er[r] = decodeURIComponent(er[r]);
                    er[r] = er[r].replace(/%26/g, '&');
                    er[r] = er[r].replace(/%2D/g, '-');
                    row.children().children(".exercise").val(er[r]);

                    for (let i = 0; i <= tempos.length; i++) {
                        row.children().children(".tempo-" + i).val(tempos[i]);
                        row.children().children(".midpoint-" + i + "-sec").val(durations[i]);
                        let durationSec: number = parseInt(durations[i]);
                        let m: string = Math.floor(durationSec / 60).toString().slice(-1);
                        let s: string = (durationSec % 60).toString();

                        if (s.length < 2) {
                            s = "0" + s;
                        }

                        row.children().children(".midpoint-" + i).val(m + ":" + s);
                        let dur: number = parseInt(durations[i]);
                        let x2 = x1 + dur;
                        let y2: number = parseInt(tempos[i + 1]);
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
        }

        public preset4Button() {
            let row: JQuery<HTMLElement> = this.body.parent().parent();
            let s: number = <number>row.children().children(".duration-sec").val();
            schedule.applyPreset(row, 5, (s - 5), s, s);
        }

        public preset5Button() {
            let row: JQuery<HTMLElement> = this.body.parent().parent();
            let s: number = <number>row.children().children(".duration-sec").val();
            schedule.applyPreset(row, 5, (s / 2 - 5), (s / 2 + 5), (s - 5));
        }

        public preset6Button() {
            let row: JQuery<HTMLElement> = this.body.parent().parent();
            let s: number = <number>row.children().children(".duration-sec").val();
            schedule.applyPreset(row, 0, 0, 5, (s - 5));
        }

        public scheduleComplete() {
            metronome.isRunning = false;
            window.clearInterval(tempo.intervalId);
            timer.stop()
            timer.display.html("0:00");
            tempo.tempoDisplay.html(this.currentStep.endTempo.toString());
            this.exerciseDisplay.text("Done!");
            schedule.body.css({ "background-color": "#001912", "color": "#009871" });

            if (schedule.endWithBell.is(":checked")) {
                schedule.endRoutineBell.play();
            }

            timer.updateButton(TimerState.stopped);
        }

        public setQuery() {
            let startWithRest: JQuery = $(".start-with-rest");
            let endWithBell: JQuery = $(".end-with-bell");
            let tempo0: JQuery = $(".tempo-0");
            let tempo1: JQuery = $(".tempo-1");
            let tempo2: JQuery = $(".tempo-2");
            let tempo3: JQuery = $(".tempo-3");
            let tempo4: JQuery = $(".tempo-4");
            let tempo5: JQuery = $(".tempo-5");
            let midpoint0: JQuery = $(".midpoint-0-sec");
            let midpoint1: JQuery = $(".midpoint-1-sec");
            let midpoint2: JQuery = $(".midpoint-2-sec");
            let midpoint3: JQuery = $(".midpoint-3-sec");
            let midpoint4: JQuery = $(".midpoint-4-sec");
            let midpoint5: JQuery = $(".midpoint-5-sec");
            let exercise: JQuery = $(".exercise");

            let q = $("#rest").val();
            q += "&" + startWithRest.is(":checked");
            q += "&" + endWithBell.is(":checked");

            q += "&";
            for (let i = 0; i < tempo0.length; i++) {
                if (i > 0) { q += "-" }
                q += <string>tempo0.eq(i).val();

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
            for (let i = 0; i < midpoint0.length; i++) {
                if (i > 0) { q += "-" }
                q += <string>midpoint0.eq(i).val();

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
            for (let i = 0, tot = exercise.length; i < tot; i++) {
                let e: string = <string>exercise.eq(i).val();
                e = e.replace(/&/g, '%26');
                e = e.replace(/-/g, '%2D');
                if (i > 0) { q += "-" }
                q += e;
            }

            $(".query").val(q);
        }

        public startMetronome() {
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
                            metronome.pendulumParent.animate({ rotate: metronome.initrotation }, 0, () => {
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
                        metronome.pendulumParent.animate({ rotate: metronome.initrotation }, 0, () => {
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
        }

        public body: JQuery;
        public currentStep: Step;
        public lastStep: Step;
        public endExerciseBell: HTMLMediaElement;
        public endRoutineBell: HTMLMediaElement;
        public endWithBell: JQuery;
        public exerciseDisplay: JQuery;
        public startWithRest: JQuery;
    }

    class Tempo implements ITempo {
        constructor() {
            this.current = 120;
            this.tempoDisplay = $(".tempo-display");
        }

        public setTempoDisplay() {
            this.current = schedule.currentStep.tempo;
            tempo.tempoDisplay.text(this.current);

            if (schedule.currentStep.endTempo == schedule.currentStep.tempo) {
                window.clearInterval(this.intervalId);
            } else {
                let delta: number = Math.abs(schedule.currentStep.endTempo - schedule.currentStep.tempo);
                let period: number = schedule.currentStep.durationSec / delta;
                this.intervalId = window.setInterval(tempo.tempoCallback, 1000 * period);
            }
        }

        public tempoCallback() {
            let change: number = schedule.currentStep.endTempo - schedule.currentStep.tempo;
            let elapsed: number = moment.now() - schedule.currentStep.startTime;
            let dur: number = schedule.currentStep.durationSec * 1000;
            tempo.current = schedule.currentStep.tempo + change * elapsed / dur;
            tempo.tempoDisplay.text(Math.round(tempo.current));
        }

        public current: number;
        public intervalId: number;
        public tempoDisplay: JQuery;
    }

    class Timer implements ITimer {
        constructor() {
            this.display = $(".timer-display");
            this.startButton = $(".timer-start");
            this.timeLeft = 0;
        }

        public initialize() {
            if (this.display.length > 0) {
                schedule.applyFilters();
                this.timerPlugin = createTimer(timer.callback);
            }

            this.startButton.click(schedule.startMetronome);
        }

        public setDisplay() {
            if (schedule.currentStep.isEndPoint) {
                this.display.html(this.secondsToDisplay(this.timeLeft));
            }
            else {
                let timeLeftInLine = this.timeLeft;

                for (let i = 0; i < timeline.length; i++) {
                    timeLeftInLine += timeline[i].durationSec;

                    if (timeline[i].isEndPoint) {
                        break;
                    }
                }

                this.display.html(this.secondsToDisplay(timeLeftInLine));
            }
        }

        public callback() {
            timer.timeLeft--;
            if (timer.timeLeft > 0) {
                timer.setDisplay();

                if (timerStatus == TimerState.settling) {
                    schedule.startMetronome();
                }
            } else if (schedule.currentStep.isEndPoint) {
                schedule.lineComplete();
            } else {
                timerStatus = TimerState.continuing;
                schedule.startMetronome();
            }
        }

        public play() {
            this.timerPlugin.play();
        }

        public pause() {
            this.timerPlugin.pause();
        }

        public stop() {
            this.timerPlugin.stop();
        }

        public secondsToDisplay(seconds: number): string {
            let timeSpan: moment.Duration = moment.duration(seconds, 'seconds');
            return moment.utc(timeSpan.asMilliseconds()).format("m:ss");
        }

        public updateButton(state: TimerState) {
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
        }

        public startButton: JQuery;
        public display: JQuery;
        public timeLeft: number;
        private timerPlugin: any;
    }

    let metronome: Metronome;
    let schedule: ISchedule;
    let tempo: ITempo;
    let timeline: Step[] = [];
    let timer: ITimer;
    let timerStatus = TimerState.stopped;

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

    $(document).ready(() => {
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
            let self: HTMLFormElement = <HTMLFormElement>this;
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
}