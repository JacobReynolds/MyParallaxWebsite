var commandList = ['ls', 'help', 'cat', 'continue', 'clear'];

this['about.txt'] = 'This is about me';

var files = ['about.txt']

var user = 'root@jakereynolds:~$';

var commandHistory = [];

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
        $('#parallax-bg-1').css('top', (0 - (scrolled * .25)) + 'px');
        $('#parallax-bg-2').css('top', (0 - (scrolled * .5)) + 'px');
        $('#parallax-bg-3').css('top', (0 - (scrolled * .6)) + 'px');
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
            printFile(input);
            break;
        case 'continue':
            scrollDown();
            replaceInput();
            addInput();
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
        var offset = $('#heightHolder').height();
        $('body').animate({
            scrollTop: offset * 3,
            backgroundColor: '#341311'
        }, 1000);
        $('#terminal').animate({
            top: offset * 3 + 400,
            left: -($(window).width()) / 4
        }, 1000);
    }

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
            }
        });
    }

    function autoCompleteInput() {
        var command = $("#terminalInput").val();
        var input = $("#terminalInput").val().split(' ')[1];
        files.forEach(function (file) {
            if (file.substring(0, input.length) === input) {
                $("#terminalInput").val(
                    command +
                    file.substring(input.length, file.length));
            }
        })
    }

});