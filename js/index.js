const gallery = document.getElementById("gallery");
const entryTemplate = document.getElementById("entry-template");

const toViewShader = (event) => {
    sessionStorage.setItem("shaderIndex", event.currentTarget.id);
    document.location = event.currentTarget.href;
}

for(let i = 0; i < data.length; i++){
    let entry = entryTemplate.cloneNode(true);
    entry.id = i;
    entry.href = data[i].link;
    entry.onclick = toViewShader;
    let title = entry.querySelector("h2");
    title.innerText = data[i].name;

    let img = entry.querySelector('img');
    img.src = data[i].preview;

    gallery.appendChild(entry);
}