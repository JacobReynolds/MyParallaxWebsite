var commandList = [ 'cat', 'clear', 'continue', 'help',  'ls', 'man', 'reverse'];

this['ls'] = 'List all files in the current directory.';
this['help'] = 'List possible terminal commands.';
this['cat'] = 'cat [filename] will print the contents of that file.';
this['continue'] = 'Will advanced to the next section of the page.';
this['clear'] = 'Will clear all text in the terminal.';
this['reverse'] = 'Will reverse to the previous section of the page.';
this['man'] = 'Will describe a file, but you know that already don\'t you?';

this['about.txt'] = 'This is about me';

var files = ['about.txt', 'apple.txt']

var user = 'root@jakereynolds:~$';

var commandHistory = [];

var pageIndex = 0;

var backgroundColorList = ['#141414', '#7F2F2A', '#66CC76', '#5E2957', '#52A7FF', '#CCC045'];

var commandIndex = -1;
jQuery(document).ready(function() {
    $(window).scroll(function(e) {
        parallaxScroll();
    });

    addInput();

    $("#terminal").click(function() {
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
                scrollDown(command);
                break;
            case 'reverse':
                scrollUp();
                break;
            case 'help':
                printList(commandList);
                break;
            case 'clear':
                clear();
                break;
            case 'man':
                man(input);
                break;
        }
    }
    
    function man(input) {
        if (commandList.indexOf(input) > -1) {
                    replaceInput();
            $("#terminalOutput").append('"' + input + '"' + '  ' + this[input] + '<br>');
            addInput();
        } else {
                                replaceInput();
            $("#terminalOutput").append('"' + input + '"' + '  is not a valid command, try typing "help" for options.<br>');
            addInput();
        }
    }

    function clear() {
        replaceInput();
        $("#terminalOutput").empty();
        addInput();
    }

    function scrollDown(command) {
        switch (pageIndex) {
            case 0:
                setTimeout(function() {
                    shake($('#cube'));
                }, 2000);
                break;
            case 1:
                break;
            case 2:
                var top = $('#diveText').offset();
                setTimeout(function() {
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
            case 5:
                replaceInput();
                $("#terminalOutput").append('You have reached the bottom of the page.<br>Type "reverse" to make your way back up.<br>');
                addInput();
                return;
        }
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

        replaceInput();
        addInput();
    }

    function scrollUp() {
        var top = $('body').scrollTop();
        var offset = $('#heightHolder').height();
        switch (pageIndex) {
            case 0:
                replaceInput();
                $("#terminalOutput").append('You are at the top of the page.<br>Type "continue" to make your way down.<br>');
                addInput();
                return;
        }
        pageIndex--;
        $('html, body').animate({
            scrollTop: 0 + offset * (pageIndex * 3),
            backgroundColor: backgroundColorList[pageIndex]
        }, 1000);
        $('#terminal').animate({
            top: 0 + offset * (pageIndex * 3) + 400,
            left: pageIndex % 2 ? -$(window).width() / 4 : $(window).width() / 4
        }, 1000);
        replaceInput();
        addInput();

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
        list.forEach(function(result) {
            $("#terminalOutput").append(result + '<br>');
        })
        addInput();
    }

    function printFiles() {
        replaceInput();
        files.forEach(function(file) {
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
        $("#terminalInput").keydown(function(e) {
            var command = $("#terminalInput").val();
            if (e.keyCode == 13) {
                sendCommand(command);
                commandHistory.unshift(command);
                commandIndex = -1;
            } else if (e.keyCode == 9) {
                e.preventDefault();
                autoCompleteInput(command);
            } else if (e.keyCode == 38 && commandIndex != commandHistory.length - 1) {
                e.preventDefault();
                commandIndex++;
                $("#terminalInput").val(commandHistory[commandIndex]);
            } else if (e.keyCode == 40 && commandIndex > -1) {
                e.preventDefault();
                $("#terminalInput").val(commandHistory[commandIndex]);
                commandIndex--;
            } else if (e.keyCode == 67 && e.ctrlKey) {
                $("#terminalInput").val(command + '^C');
                replaceInput();
                addInput();
            }
        });
    }

    function autoCompleteInput(command) {
        var command = $("#terminalInput").val();
        var input = $("#terminalInput").val().split(' ');
        var validList = [];
        if (input.length === 2 && input[1] != "") {
            files.forEach(function(file) {
                if (file.substring(0, input[1].length) === input[1]) {
                    validList.push(file);
                }
            })
            if (validList.length > 1) {
                replaceInput();
                validList.forEach(function(option) {
                    $('#terminalOutput').append(option + '   ');
                })
                $('#terminalOutput').append('<br>');
                addInput();
                $("#terminalInput").val(command);
            } else {
                $("#terminalInput").val(
                    command +
                    validList[0].substring(input[1].length, validList[0].length));
            }
        } else if (command.length) {
            commandList.forEach(function(option) {
                if (option.substring(0, input[0].length) === input[0]) {
                    validList.push(option);
                }
            })
            if (validList.length > 1) {
                replaceInput();
                validList.forEach(function(option) {
                    $('#terminalOutput').append(option + '   ');
                })
                $('#terminalOutput').append('<br>');
                addInput();
                $("#terminalInput").val(command);
            }  else {
                $("#terminalInput").val(
                    command +
                    validList[0].substring(input[0].length, validList[0].length));
            }
        }
    }

});

function showPage() {
    $('#mediaWarning').css('display', 'none');
    $('#mobilePage').css('display', 'block');
}