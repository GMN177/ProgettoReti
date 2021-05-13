var doing = false;

function doSlot() {
    if (doing) {
        return null
    };
    doing = true;
    var numChanges = randomInt(1, 4) * 4;
    var numbSlot1 = numChanges + randomInt(1, 4);
    var numbSlot2 = numChanges + 2 * 4 + randomInt(1, 4);
    var numbSlot3 = numChanges + 4 * 4 + randomInt(1, 4);
    var i1 = 0;
    var i2 = 0;
    var i3 = 0;
    slot1 = setInterval(spin1, 70);
    slot2 = setInterval(spin2, 70);
    slot3 = setInterval(spin3, 70);

    function spin1() {
        i1++;
        slotTile = document.getElementById("slot1");
        if (i1 >= numbSlot1) {
            if (document.getElementById("btncheck3").checked == true) {
                slotTile.className = "a2";
            }
            clearInterval(slot1);
            return null;
        }

        if (slotTile.className == "a4") {
            slotTile.className = "a0";
        }
        slotTile.className = "a" + (parseInt(slotTile.className.substring(1)) + 1);
    }

    function spin2() {
        i2++;
        slotTile = document.getElementById("slot2");
        if (i2 >= numbSlot2) {
            if (document.getElementById("btncheck3").checked == true) {
                slotTile.className = "a2";
            }
            clearInterval(slot2);
            return null;
        }
        if (slotTile.className == "a4") {
            slotTile.className = "a0";
        }

        slotTile.className = "a" + (parseInt(slotTile.className.substring(1)) + 1);
    }

    function spin3() {
        i3++;
        slotTile = document.getElementById("slot3");
        if (i3 >= numbSlot3) {
            if (document.getElementById("btncheck3").checked == true) {
                slotTile.className = "a2";
            }
            clearInterval(slot3);
            return null;
        }

        if (slotTile.className == "a4") {
            slotTile.className = "a0";
        }
        slotTile.className = "a" + (parseInt(slotTile.className.substring(1)) + 1);
    }

}

function randomInt(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}