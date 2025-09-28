async function fetchCookieFile(fileName) {
    const res = await fetch(chrome.runtime.getURL(`cookies/${fileName}`));
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    const text = await res.text();
    return JSON.parse(text);
}

async function handleUse(fileName) {
    try {
        const cookies = await fetchCookieFile(fileName);

        if (!Array.isArray(cookies)) {
            throw new Error("Cookie data is not an array");
        }

        await Promise.all(
            cookies.map(c =>
                chrome.cookies.set({
                    url: "https://" + c.domain.replace(/^\./, ""),
                    name: c.name,
                    value: c.value,
                    domain: c.domain,
                    path: c.path || "/"
                })
            )
        );

        chrome.tabs.create({ url: "https://" + cookies[0].domain.replace(/^\./, "") });

        console.log("✅ Cookies set successfully from", fileName);
    } catch (err) {
        console.error("❌ Error:", err);
        alert("Error: " + err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("use-x").addEventListener("click", () => {
        handleUse("x.com.json");
    });
});
