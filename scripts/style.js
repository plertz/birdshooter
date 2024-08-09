var item1 = document.getElementsByClassName("item1")[0];
var item2 = document.getElementsByClassName("item2")[0];
var item3 = document.getElementsByClassName("item3")[0];
var transparent = document.getElementsByClassName("transparent");
var select = document.getElementsByClassName("select");

item1.addEventListener("mouseover", () => {
    transparent[0].style.height = "100%";
});

item1.addEventListener("mouseout", () => {
    transparent[0].style.height = "0%";
});

item2.addEventListener("mouseover", () => {
    transparent[1].style.height = "100%";
});

item2.addEventListener("mouseout", () => {
    transparent[1].style.height = "0%";
});

item3.addEventListener("mouseover", () => {
    transparent[2].style.height = "100%";
});

item3.addEventListener("mouseout", () => {
    transparent[2].style.height = "0%";
});

function selectInner() {
    let backgroundName = localStorage.map.replace("assets/", "");
    switch (backgroundName) {
        case "blueSky_background.png":
            select[0].innerHTML = "Selected";
            select[1].innerHTML = "Select";
            select[2].innerHTML = "select";
            break;
        case "greenForest_background.png":
            select[1].innerHTML = "Selected";
            select[0].innerHTML = "Select";
            select[2].innerHTML = "Select";
           break;
        case "mountain.jpg":
            select[2].innerHTML = "Selected";
            select[0].innerHTML = "Select";
            select[1].innerHTML = "Select"; 
            break;
        case undefined:
            select[1].innerHTML = "Selected";
            select[0].innerHTML = "Select";
            select[2].innerHTML = "Select";
            break;
        default:
            select[1].innerHtml = "Selected";
            select[0].innerHtml = "Select";
            select[2].innerHtml = "Select";
            break;
    }
}

function selectMap(number) {
    let link;
    switch (number) {
        case 1:
            link = "blueSky_background.png"
            break;
        case 2:
            link = "greenForest_background.png";
            break;
        case 3:
            link = "mountain.jpg";
            break;
        case 4:
            link = localStorage.map
        default:
            link = "greenForest_background.png";
    }
    if (link == undefined) {
        link = "greenForest_background.png";
    }

    link = "assets/" + link;
    localStorage.setItem("map", link);
    selectInner();
}

function toStart() {
    location.reload()
    return
};
