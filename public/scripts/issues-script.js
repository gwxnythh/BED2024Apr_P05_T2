let currentRow;
let currentIssueId;
fetch("http://localhost:3000/issues")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(function (issues) {
        let placeholder = document.querySelector("#data-output");
        let out = "";
        for (let issue of issues) {
            out += `
                <tr class="issue-row" data-id = "${issue.id}" data-message="${issue.message}" data-email="${issue.email}" data-name="${issue.name}" data-date="${issue.date}">
                    <td>${issue.id}</td>
                    <td>${issue.message}</td>
                    <td>${issue.email}</td>
                    <td>${issue.name}</td>
                    <td>${new Date(issue.date).toLocaleString()}</td>
                </tr>
            `;
        }
        placeholder.innerHTML = out;

        // Add event listeners to each row
        document.querySelectorAll(".issue-row").forEach(row => {
            row.addEventListener("click", function () {
                openPopup(this);
                document.getElementById("messageDisplay").textContent = `Message: ${this.dataset.message}`;
            });
        });
    })
    .catch(function (error) {
        console.error("Fetch error:", error);
    });

function openPopup(row) {
    currentRow = row;
    currentIssueId = row.dataset.id;
    popup.classList.add("open-popup");
}

function closePopup() {
    popup.classList.remove("open-popup");
    window.location.reload();
}

document.getElementById("issues-submitButton1").addEventListener("click", function () {
    if (currentRow && currentIssueId) {
        fetch(`http://localhost:3000/issues/${currentIssueId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                currentRow.remove();
                closePopup();
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    }
});

document.querySelector(".contactus-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;
    const date = new Date().toISOString();

    const issueData = {
        name: name,
        email: email,
        message: message,
        date: date
    };

    fetch("http://localhost:3000/issues", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(issueData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Issue created with ID:", data.id);
            document.querySelector(".contactus-form").reset();
            alert("Message sent successfully!");
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
});