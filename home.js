//Global variables
var commandList = ['cat', 'clear', 'continue', 'help', 'ls', 'man', 'ps', 'reverse'];
var ls = 'list all files in the current directory.';
var help = 'list possible terminal commands.';
var cat = 'cat [filename] will print the contents of that file.';
//Not too worried about this conflicting with the built-in continue, since I do not use it.
this['continue'] = 'advance to the next section of the page.';
var clear = 'clear all text in the terminal.';
var reverse = 'reverse to the previous section of the page.';
var man = 'describe a file, but you know that already don\'t you?';
var ps = 'list the current processes';
this['hobbies.txt'] = 'I have many hobbies, in these next few sections you will find a couple.';
this['projects.txt'] = 'Here is a list of some pretty fun projects, more can be found on github.';
var files = ['hobbies.txt', 'projects.txt']
var user = 'root@jakereynolds:~$';
var commandHistory = [];
var pageIndex = 0;
var backgroundColorList = ['#141414', '#7F2F2A', '#66CC76', '#5E2957', '#52A7FF', '#CCC045'];
var commandIndex = -1;

//Detect the current browser for the 'ps' command
var currentBrowser = function () {
    var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
    var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
    if ((is_chrome) && (is_safari)) {
        is_safari = false;
    }
    if ((is_chrome) && (is_opera)) {
        is_chrome = false;
    }
    if (is_chrome) {
        return 'Chrome';
    } else if (is_explorer) {
        return 'Internet Explorer';
    } else if (is_firefox) {
        return 'Firefox';
    } else if (is_safari) {
        return 'Safari';
    } else if (is_opera) {
        return 'Opera';
    } else {
        return 'Browser';
    }
}

jQuery(document).ready(function () {
    $(window).scroll(function (e) {
        parallaxScroll();
    });

    //Check if there is a mobile browser, redirect to mobile page if so
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#mobileWarning').css('display', 'block');
        $('#screenSizeWarning').css('display', 'none');
        $('#fullPage').css('display', 'none');
    }

    //Firefox has issues reloding scrollTop, this forces it.
    $("html,body").animate({
        scrollTop: 0
    }, 10);

    //Add the terminal input
    addInput();

    //Make it more realistic, anywhere they click in the terminal will focus the text field.
    $("#terminal").click(function () {
        $("#terminalInput").focus();
    })

    //Give a little bit of 3D to the rubik's cube
    function parallaxScroll() {
        var scrolled = $(window).scrollTop();
        $('#cube-parallax').css('top', (0 - (scrolled * .9)) + 'px');
        $('#cube2-parallax').css('top', (0 - (scrolled * .8)) + 'px');
        $('#cube3-parallax').css('top', (0 - (scrolled * .7)) + 'px');
    }

    //Parse and execute a command from the terminal
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
        case 'ps':
            //The input has issues with multiple spaces, so we use &nbsp;
            replaceInput();
            $("#terminalOutput").append("PID TTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME CMD<br>" +
                '6258 pts/1&nbsp;&nbsp;    00:00:00 bash<br>' +
                '7334 pts/1&nbsp;&nbsp;    00:00:00 ps<br>' +
                '8942 pts/1&nbsp;&nbsp;    00:00:00 ' + currentBrowser() + '<br>');
            addInput();

            break;
        }
    }

    //Print out the description of a command
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

    //Clear the terminal
    function clear() {
        replaceInput();
        $("#terminalOutput").empty();
        addInput();
    }

    //Flash the terminal, to give the user a little notification to look at it.
    function flashTerminal() {
        setTimeout(function () {
            $('#terminal').animate({
                opacity: 0.6
            }, 600);
            $('#terminal').animate({
                opacity: 1
            }, 600);
        }, 1000);
    }

    //Scroll down the page
    //Execute page specific commands
    function scrollDown(command) {
        switch (pageIndex) {
        case 0:
            flashTerminal();
            setTimeout(function () {
                shake($('#cube'));
            }, 5000);
            printFile('hobbies.txt');
            break;
        case 1:
            setTimeout(function () {
                $('#motorcycle').animate({
                    opacity: 1
                }, 1000)
            }, 1000)
            break;
        case 2:
            var top = $('#diveText').offset();
            setTimeout(function () {
                $('#diveText').animate({
                        top: -320,
                    }, 2000),
                    $('#diveText2').animate({
                        top: -70,
                    }, 2000),
                    $('#diveText3').animate({
                        top: -120,
                    }, 2000)
            }, 1000)
            break;
        case 3:
            flashTerminal();
            printFile('projects.txt');
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
            scrollTop: offset * (pageIndex)
        }, 1000);

        $('#terminal').animate({
            top: offset * (pageIndex) + 450,
            left: pageIndex % 2 ? -$(window).width() / 4 : $(window).width() / 4
        }, 1000);

        //Some of the calls in the switch statement already replace the input
        //if they did the input would be empty.
        if ($('#terminalInput').val() != '') {
            replaceInput();
            addInput();
        }
    }

    function scrollUp() {
        var top = $('body').scrollTop();
        var offset = $('#heightHolder').height();
        if (pageIndex === 0) {
            replaceInput();
            $("#terminalOutput").append('You are at the top of the page.<br>Type "continue" to make your way down.<br>');
            addInput();
            return;
        }

        pageIndex--;
        $('html, body').animate({
            scrollTop: offset * pageIndex,
            backgroundColor: backgroundColorList[pageIndex]
        }, 1000);

        //If we are going to the first page, center it again on the page
        switch (pageIndex) {
        case 0:
            $('#terminal').animate({
                top: 300,
                left: 0
            }, 1000);
            break;
        default:
            $('#terminal').animate({
                top: 0 + offset * pageIndex + 400,
                left: pageIndex % 2 ? -$(window).width() / 4 : $(window).width() / 4
            }, 1000);
            break;
        }
        replaceInput();
        addInput();

    }

    //Shake the given element
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

    //Print the given file, usually used with "cat"
    function printFile(file) {
        if (this[file]) {
            replaceInput();
            $("#terminalOutput").append(this[file] + '<br>');
            addInput();
        } else {
            replaceInput();
            $("#terminalOutput").append('"' + file + '"' + ' is an invalid file name.  Try typing "ls".<br>');
            addInput();
        }
    }

    //Used for "help", prints the valid terminal commands
    function printList(list) {
        replaceInput();
        list.forEach(function (result) {
            $("#terminalOutput").append(result + '<br>');
        })
        addInput();
    }

    //Used for "ls", prints the files in the current directory
    function printFiles() {
        replaceInput();
        files.forEach(function (file) {
            $("#terminalOutput").append(file + '  ');
        })
        $("#terminalOutput").append('<br>');
        addInput();
    }

    //Remove the input and add the input value to the output field
    function replaceInput() {
        var value = $("#terminalInput").val();
        $("#terminalInput").remove();
        $("#terminalOutput").append(value + '<br>');
    }

    //Add a new input to the terminal
    function addInput() {
        $("#terminalOutput").append(user + ' <input id="terminalInput" spellcheck="false"></input>');
        $("#terminalInput").focus();
        $("#terminalInput").keydown(function (e) {
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

    //Used for tabbing, will complete the valid command
    function autoCompleteInput(command) {
        var command = $("#terminalInput").val();
        var input = $("#terminalInput").val().split(' ');
        var validList = [];
        var fileList = input[0] === 'man' ? commandList : files
        if (input.length === 2 && input[1] != "") {
            fileList.forEach(function (file) {
                if (file.substring(0, input[1].length) === input[1]) {
                    validList.push(file);
                }
            })
            if (validList.length > 1) {
                replaceInput();
                validList.forEach(function (option) {
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
            commandList.forEach(function (option) {
                if (option.substring(0, input[0].length) === input[0]) {
                    validList.push(option);
                }
            })
            if (validList.length > 1) {
                replaceInput();
                validList.forEach(function (option) {
                    $('#terminalOutput').append(option + '   ');
                })
                $('#terminalOutput').append('<br>');
                addInput();
                $("#terminalInput").val(command);
            } else {
                $("#terminalInput").val(
                    command +
                    validList[0].substring(input[0].length, validList[0].length));
            }
        }
    }

});


//Shows the mobile/small screen page
function showPage() {
    $('#mobileWarning').css('display', 'none');
    $('#screenSizeWarning').css('display', 'none');
    $('#mobilePage').css('display', 'block');
    $('html').css('backgroundColor', '#7f2f2a');
    $('html').css('overflow', 'auto');
    $('body').css('height', 'auto');
}