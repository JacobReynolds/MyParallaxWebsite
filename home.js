var commandList = ['ls', 'help', 'cat', 'continue', 'clear', 'reverse'];

this['about.txt'] = 'This is about me';

var files = ['about.txt']

var user = 'root@jakereynolds:~$';

var commandHistory = [];

var pageIndex = 0;

var backgroundColorList = ['#141414', '#7F2F2A', '#66CC76', '#5E2957', '#52A7FF', '#CCC045'];

var commandIndex = -1;
jQuery(document).ready(function () {
    $(window).scroll(function (e) {
        parallaxScroll();
    });

    addInput();

    $("#terminal").click(function () {
        $("#terminalInput").focus();
    })

    function parallaxScroll() {
        var scrolled = $(window).scrollTop();
        $('.parallax-bg-1').css('top', (0 - (scrolled * .25)) + 'px');
        $('.parallax-bg-2').css('top', (0 - (scrolled * .4)) + 'px');
        $('.parallax-bg-3').css('top', (0 - (scrolled * .6)) + 'px');
    }

    function sendCommand(input) {
        var command = input.split(' ')[0];
        var input = input.split(' ')[1];
        if (commandList.indexOf(command) === -1 && command) {
            replaceInput();
            $("#terminalOutput").append('Invalid command \"' + command + '"<br>type "help" for more options<br>');
            addInput();
        }
        switch (command) {
        case 'ls':
            printFiles();
            break;
        case 'cat':
            if (!input)
                break;
            printFile(input);
            break;
        case 'continue':
            scrollDown();
            replaceInput();
            addInput();
            break;
        case 'reverse':
            if (pageIndex) {
                scrollUp();
                replaceInput();
                addInput();
            }
            break;
        case 'help':
            printList(commandList);
            break;
        case 'clear':
            clear();
            break;
        }
    }

    function clear() {
        replaceInput();
        $("#terminalOutput").empty();
        addInput();
    }

    function scrollDown() {
        pageIndex++;
        var offset = $('#heightHolder').height();
        $('html, body').animate({
            backgroundColor: backgroundColorList[pageIndex],
            scrollTop: offset * (pageIndex * 3)
        }, 1000);

        $('#terminal').animate({
            top: offset * (pageIndex * 3) + 500,
            left: pageIndex % 2 ? -$(window).width() / 4 : $(window).width() / 4
        }, 1000);

        switch (pageIndex) {
        case 1:
            setTimeout(function () {
                shake($('#cube'));
            }, 2000);
            break;
        case 2:
            break;
        case 3:
            var top = $('#diveText').offset();
            setTimeout(function () {
                $('#diveText').animate({
                        top: -320

                    }, 2000),
                    $('#diveText2').animate({
                        top: -70,
                        opacity: 0.5

                    }, 2000),
                    $('#diveText3').animate({
                        top: -120

                    }, 2000)
            }, 1000)
            break;
        }
    }

    function scrollUp() {
        var top = $('body').scrollTop();
        var offset = $('#heightHolder').height();
        pageIndex--;
        $('html, body').animate({
            scrollTop: 0 + offset * (pageIndex * 3),
            backgroundColor: backgroundColorList[pageIndex]
        }, 1000);
        $('#terminal').animate({
            top: 0 + offset * (pageIndex * 3) + 400,
            left: pageIndex % 2 ? -$(window).width() / 4 : $(window).width() / 4
        }, 1000);

    }

    function shake(div) {
            var interval = 100;
            var distance = 10;
            var times = 4;
            var left = div.offset();
            left = left.left;
            for (var iter = 0; iter < (times + 1); iter++) {
                $(div).animate({
                    left: ((iter % 2 == 0 ? left + distance : left - distance))
                }, interval);
            } //for                                                                                                              

            $(div).animate({
                left: left
            }, interval);

        } //shake        

    function printFile(file) {
        replaceInput();
        $("#terminalOutput").append(this[file] + '<br>');
        addInput();
    }

    function printList(list) {
        replaceInput();
        list.forEach(function (result) {
            $("#terminalOutput").append(result + '<br>');
        })
        addInput();
    }

    function printFiles() {
        replaceInput();
        files.forEach(function (file) {
            $("#terminalOutput").append(file + '<br>');
        })
        addInput();
    }

    function replaceInput() {
        var value = $("#terminalInput").val();
        $("#terminalInput").remove();
        $("#terminalOutput").append(value + '<br>');
    }

    function addInput() {
        $("#terminalOutput").append(user + ' <input id="terminalInput"></input>');
        $("#terminalInput").focus();
        $("#terminalInput").keydown(function (e) {
            var command = $("#terminalInput").val();
            if (e.keyCode == 13) {
                sendCommand(command);
                commandHistory.unshift(command);
                commandIndex = -1;
            } else if (e.keyCode == 9) {
                e.preventDefault();
                autoCompleteInput();
            } else if (e.keyCode == 38 && commandIndex != commandHistory.length - 1) {
                e.preventDefault();
                commandIndex++;
                $("#terminalInput").val(commandHistory[commandIndex]);
            } else if (e.keyCode == 40 && commandIndex > -1) {
                e.preventDefault();
                $("#terminalInput").val(commandHistory[commandIndex]);
                commandIndex--;
            } else if (e.keyCode == 67 && e.ctrlKey) {
                $("#terminalInput").val('^C');
                replaceInput();
                addInput();
            }
        });
    }

    function autoCompleteInput() {
        var command = $("#terminalInput").val();
        var input = $("#terminalInput").val().split(' ');
        if (input.length === 2 && input[1] != "") {
            files.forEach(function (file) {
                if (file.substring(0, input[1].length) === input[1]) {
                    $("#terminalInput").val(
                        command +
                        file.substring(input[1].length, file.length));
                }
            })
        } else if (command.length) {
            commandList.forEach(function (option) {
                if (option.substring(0, input[0].length) === input[0]) {
                    $("#terminalInput").val(
                        command +
                        option.substring(input[0].length, option.length));
                }
            })
        }
    }

});

function showPage() {
    $('#mediaWarning').css('display', 'none');
    $('#fullPage').css('display', 'block');
    $('body').css('overflow', 'auto');
}