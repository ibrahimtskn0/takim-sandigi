export function initMenu() {
    const sidebar = document.querySelector("#sidebar");
    const button = document.querySelector("#menu-toggle");

    function isOpen() {
        return sidebar.classList.contains("is-open");
    }

    function setOpen(open) {
        sidebar.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    }

    button.addEventListener("click", () => {
        setOpen(!isOpen());
    });
    // 86804
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen()) {
            setOpen(false);
            button.focus();
        }
    });

    document.addEventListener("click", (e) => {
        const clickedOutside =
            !sidebar.contains(e.target) && !button.contains(e.target);
        const clickedLink = e.target.closest("#sidebar a");

        if (clickedOutside || clickedLink) {
            setOpen(false)
        }
    });
}