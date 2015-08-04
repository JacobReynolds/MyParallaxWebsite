//Global variables
var commandList = ['cat', 'clear', 'help', 'ls', 'man', 'ps', 'reverse'];
var ls = 'list all files in the current directory.';
var help = 'list possible terminal commands.';
var cat = 'cat [filename] will print the contents of that file.';
var clear = 'clear all text in the terminal.';
var reverse = 'reverse to the previous section of the page.';
var man = 'describe a file, but you know that already don\'t you?';
var ps = 'list the current processes';
this['hobbies.txt'] = 'I have many hobbies, in these next few sections you will find a couple.';
this['projects.txt'] = 'A couple sections below is a list of some pretty fun projects, more can be found on github.';
this['.unlock.txt'] = 'Type "continue" to unlock the page';
var files = ['hobbies.txt', 'projects.txt']
var allFiles = ['.unlock.txt', 'hobbies.txt', 'projects.txt']
var user = 'root@jakereynolds:~$';
var commandHistory = [];
var pageIndex = 0;
var backgroundColorList = ['#141414', '#7F2F2A', '#66CC76', '#5E2957', '#52A7FF', '#CCC045'];
var commandIndex = -1;

var pageLoad;
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

function goUp() {
    if (!allowClick)
        return;
    allowClick = false;
    pageIndex--;
    if (pageIndex === 0) {
        $('#upArrow').animate({
            opacity: 0
        }, 300)
    } else if (pageIndex === 4) {
        $('#downArrow').animate({
            opacity: 1
        }, 300)
    }
    var height = $('#heightHolder').height();
    var top = $('body').scrollTop();
    $('html, body').animate({
        scrollTop: top - height
    }, 750);
    //If they're in such a hurry to click
    //they can wait a bit
    setTimeout(function () {
        allowClick = true;
    }, 1500)

}
var allowClick = true;

function goDown() {
    if (!allowClick)
        return;
    allowClick = false;
    pageIndex++
    if (pageIndex === 5) {
        $('#downArrow').animate({
            opacity: 0
        }, 300)
    } else if (pageIndex === 1) {
        $('#upArrow').css('opacity', '0');
        $('#upArrow').css('display', 'block');
        $('#upArrow').animate({
            opacity: 1
        })
    }
    var height = $('#heightHolder').height();
    var top = $('body').scrollTop();
    $('html, body').animate({
        scrollTop: top + height
    }, 750);
    //If they're in such a hurry to click
    //they can wait a bit
    setTimeout(function () {
        allowClick = true;
    }, 1500)
}

window.onload = function () {
    if (currentBrowser() === 'Firefox' || 'Internet Explorer') {
        scrollTo(0, 0);
    }
}

$(document).ready(function () {
    $(window).scroll(function (e) {
        parallaxScroll();
    });

    addInput();

    //IE sucks and shows the input even though it's opacity 0
    $("#terminalInput").blur();

    pageLoad = true;
    $("#cubeWrapper").waypoint(function (event) {
        if (event === 'down' && !pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[1]
            }, 1000);
            setTimeout(function () {
                shake($('#cube'));
            }, 1000);
        } else if (!pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[0]
            }, 1000)
        }
    });

    $("#motorcycleWrapper").waypoint(function (event) {
        if (event === 'down' && !pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[2]
            }, 1000);
            setTimeout(function () {
                $('#motorcycle').animate({
                    opacity: 1
                }, 1000)
            }, 1000)
        } else if (!pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[1]
            }, 1000);
            setTimeout(function () {
                $('#motorcycle').animate({
                    opacity: 0
                }, 1000)
            }, 1000)
        }
    });

    $("#divingWrapper").waypoint(function (event) {
        if (event === 'down' && !pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[3]
            }, 1000);
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
        } else if (!pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[2]
            }, 1000)
            setTimeout(function () {
                $('#diveText').animate({
                        top: 0,
                    }, 2000),
                    $('#diveText2').animate({
                        top: 0,
                    }, 2000),
                    $('#diveText3').animate({
                        top: 0,
                    }, 2000)
            }, 1000)
        }
    });

    $("#projectWrapper").waypoint(function (event) {
        if (event === 'down' && !pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[4]
            }, 1000);
        } else if (!pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[3]
            }, 1000)
        }
    });

    $("#thankYouWrapper").waypoint(function (event) {
        if (event === 'down' && !pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[5]
            }, 1000);
        } else if (!pageLoad) {
            $("body").animate({
                backgroundColor: backgroundColorList[4]
            }, 1000)
        }
    });

    //Check if there is a mobile browser, redirect to mobile page if so
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#screenSizeWarning').css('display', 'none');
        $('#mobileWarning').css('display', 'block');
        $('#experience').remove();
        $('#fullPage').remove();

    }

    //Add the terminal input

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
        var secondary = input.split(' ')[1];
        if ((commandList.indexOf(command) === -1 && command != "continue") && command) {
            replaceInput();
            $("#terminalOutput").append('Invalid command \"' + command + '"<br>type "help" for more options<br>');
            addInput();
        }
        if (input === 'ls -la' || input === 'ls -a' || input === 'ls -all') {
            printAllFiles();
            return;
        }
        switch (command) {
        case 'ls':
            printFiles();
            break;
        case 'cat':
            if (!secondary)
                break;
            printFile(secondary);
            break;
        case 'continue':
            unlockPage();
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
            if (secondary)
                man(secondary);
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

    function unlockPage() {
        $('#downArrow').css('opacity', '0');
        $('#downArrow').css('display', 'block');
        $('#downArrow').animate({
            opacity: 1
        })
        replaceInput();
        addInput();
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
            $("#terminalOutput").append(file + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        })
        $("#terminalOutput").append('<br>');
        addInput();
    }

    function printAllFiles() {
        replaceInput();
        allFiles.forEach(function (file) {
            $("#terminalOutput").append(file + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
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
        var fileList = input[0] === 'man' ? commandList : allFiles
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
            } else if (validList.length === 1) {
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
            } else if (validList.length === 1) {
                $("#terminalInput").val(
                    command +
                    validList[0].substring(input[0].length, validList[0].length));
            }
        }
    }

});


//Shows the mobile/small screen page
function showProgrammer() {
    $('#experience').animate({
        opacity: 0
    }, 300);
    setTimeout(function () {
        $('#fullPage').css('opacity', '1');
        $('body').css('height', '650vh');
        $('#experience').remove();
        $("#terminalInput").focus();
        $('#mobilePage').remove();
        $('#mobileWarning').remove();
    }, 300)
    pageLoad = false;

}

function showSimplified() {
    $('#mobileWarning').css('display', 'none');
    $('#screenSizeWarning').css('display', 'none');
    $('#experience').animate({
        opacity: 0
    }, 300);
    setTimeout(function () {
        $('#experience').remove();
        $('#mobilePage').css('display', 'block');
        $('#mobilePage').css('opacity', '1');
    }, 300)
    $('#fullPage').remove();
    $('body').css('height', 'auto');
    $('body').css('overflow', 'auto');
    $('body').animate({
        backgroundColor: '#7f2f2a'
    });
}