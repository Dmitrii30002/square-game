function login() {
    const authBlock = document.getElementById('authBlock')
    const menu = document.getElementById('menu')
    const usernameBlock = document.getElementById('username')
    username = usernameBlock.value
    if(username != "") {
        authBlock.style.display = 'none'
        menu.style.display = 'inline'
    }
    else{
        alert("Введите имя")
    }
}

function showRating() {
    const authBlock = document.getElementById('authBlock')
    authBlock.style.display = 'none'
}