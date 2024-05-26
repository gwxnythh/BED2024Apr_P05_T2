// Upload Profile Picture

// if (document.getElementById("input-file")) {
//     document.getElementById("input-file").addEventListener("change", function() {
//         var input = this;
//         if (input.files && input.files[0]) {
//             var reader = new FileReader();
//             reader.onload = function (e) {
//                 document.getElementById("profile-pic").src = e.target.result;
//             };
//             reader.readAsDataURL(input.files[0]);
//         }
//     });
// }

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".user-img").addEventListener("click", function() {
        document.getElementById("input-file").click();
    });

    document.getElementById("input-file").addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("profile-pic").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});