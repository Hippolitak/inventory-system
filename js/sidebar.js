const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");
const toggleBtn = document.getElementById("sidebarToggle");

toggleBtn?.addEventListener("click", () => {

    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
        mainContent.style.marginLeft = "100px";
    } else {
        mainContent.style.marginLeft = "260px";
    }
});