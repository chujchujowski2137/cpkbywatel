// Selektor płci
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    selector.classList.toggle("selector_open");
});

var sex = "m";
document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    });
});

// Upload zdjęcia
var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    });
});

upload.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', () => {
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];
    var data = new FormData();
    data.append("image", file);

    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID ed8084f33622e6c'
        },
        body: data
    })
    .then(result => result.json())
    .then(response => {
        var url = response.data.link;
        upload.classList.remove("error_shown");
        upload.setAttribute("selected", url);
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");

        var img = upload.querySelector(".upload_uploaded");
        if (img) {
            img.src = url;
        }
    })
    .catch(err => {
        console.error("Błąd uploadu:", err);
        upload.classList.remove("upload_loading");
        upload.classList.add("error_shown");
    });
});

// Formularz i walidacja
document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();
    params.set("sex", sex);

    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        params.set("image", upload.getAttribute("selected"));
    }

    // Data urodzenia
    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday += "." + element.value;
        if (isEmpty(element.value)) dateEmpty = true;
    });
    birthday = birthday.substring(1);

    if (dateEmpty) {
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday);
    }

    // Inne inputy
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value);
        }
    });

    if (empty.length > 0) {
        empty[0].scrollIntoView({ behavior: "smooth" });
    } else {
        forwardToId(params);
    }
});

// Funkcje pomocnicze
function isEmpty(value) {
    return /^\s*$/.test(value);
}

function forwardToId(params){
    location.href = "/FistaszjoObywatel/id?" + params.toString();
}

// Guide
var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});

