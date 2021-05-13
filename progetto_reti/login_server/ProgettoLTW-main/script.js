function allButtons(s) {
    var b = "btncheck";
    var a = "";
    for (var i = 1; i < 15; i++) {
        a = b + String(i);
        document.getElementById(a).checked = s.checked;
    }
    return true;
}

function moodFun() {
    var b = "btncheck";
    var s = "";
    for (var i = 0; i < 15; i++) {
        s = b + String(i);
        document.getElementById(s).disabled = true;
    }
    var b = "btnradio";
    var s = "";
    for (var i = 1; i < 7; i++) {
        s = b + String(i);
        document.getElementById(s).disabled = false;
    }
    return true;
}

function genreFun() {
    var b = "btnradio";
    var s = "";
    for (var i = 1; i < 7; i++) {
        s = b + String(i);
        document.getElementById(s).disabled = true;
    }
    var b = "btncheck";
    var s = "";
    for (var i = 0; i < 15; i++) {
        s = b + String(i);
        document.getElementById(s).disabled = false;
    }
    return true;
}

function vediFilm() {
    var moods = ["happy", "sad", "lonely", "romantic", "angry", "demotivated"]
    var s = "";
    var url = "localhost/movie";
    var gom = "";
    var mog = 0;
    if (document.getElementById("option1").checked) {
        var b = "btncheck";
        gom = '%5B';
        mog = 1;
        for (var i = 1; i < 15; i++) {
            s = b + String(i);
            var temp = document.getElementById(s);
            if (temp.checked) {
                gom += '%22' + temp.name + '%22';
                gom += '%2C';
            }
        }
        gom = gom.substring(0, gom.length - 1);
        gom += "%5D";
        url += "/genres";
        url += "?genres=" + gom;
    } else {
        var b = "btnradio";
        for (var i = 1; i < 7; i++) {
            s = b + String(i);
            var temp = document.getElementById(s);
            if (temp.checked) gom += moods[i - 1];
        }
        url += "/mood";
        url += "?mood=" + gom;
    }
    console.log(gom);
    console.log(url);
    
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = gestisciResponse;
    httpRequest.open("POST", url, true);
    httpRequest.send();
    
}

function gestisciResponse(e) {
    if (e.target.readyState == XMLHttpRequest.DONE && e.target.status == 200) {
        console.log("Ridposta ricevuta");
    }
}

function loginFunction(e) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = gestisciResponse;
    httpRequest.open("GET", "localhost:80/", true);
    httpRequest.send();
}

function getCookie(cname) {
    var name = cname + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1)
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length)
    }
    return ''
}
