const down = document.getElementById("arrow-down");
const up = document.getElementById("arrow-up");
const data_container = document.querySelectorAll(".data-container");

let visible = 0;

down.addEventListener("click", (event)=>{
    down.disabled = true;
    up.classList.remove("hidden");
    if(visible+1 == data_container.length-1){
        down.classList.add("hidden");
    }
    data_container.item(visible).classList.add("hidden");
    data_container.item(visible+1).classList.add("fade-in-down");
    data_container.item(visible+1).classList.remove("hidden");
    setTimeout(()=>{
        data_container.item(visible+1).classList.remove("fade-in-down");
        visible++;
        down.disabled = false;
    },100);
    
});

up.addEventListener("click", (event)=>{
    up.disabled = true;
    down.classList.remove("hidden");
    if(visible-1 == 0){
        up.classList.add("hidden");
    }
    data_container.item(visible).classList.add("hidden");
    data_container.item(visible-1).classList.add("fade-in-up");
    data_container.item(visible-1).classList.remove("hidden");
    setTimeout(()=>{
        data_container.item(visible-1).classList.remove("fade-in-up");
        visible--;
        up.disabled = false;
    },100);
})