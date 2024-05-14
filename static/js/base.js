// Call Search 
document.getElementById('search').addEventListener("keydown",function(e){
    if(e.key === "Enter"){
        let toSearch = document.getElementById('search').value
        window.location.href = `/search?value=${toSearch}`
    }
})