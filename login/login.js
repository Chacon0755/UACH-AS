document.getElementById("loginForm").addEventListener("submit", function (event) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    setTimeout(function () {
        window.location.href = homePage/indexedDB.html;
    }, 2000);
});