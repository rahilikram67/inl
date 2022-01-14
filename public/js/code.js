function showTime(seconds) {
    let d = new Date(seconds * 1000).toISOString().substring(11, 19);
    let el = document.getElementById("MyClockDisplay")
    el.innerHTML = d;
    seconds -= 1
    if (seconds <= 0) {
        setTimeout(() => {
            el.innerHTML = ""
            window.location.href = window.location.origin + "/tokens"
        }, 1000)
    }
    else setTimeout(showTime, 1000, seconds);
}
window.onload = async () => {

    let payload = await fetch("/status").then(res => res.json())
    let account = document.cookie.split("=")[1]

    try {
        let time = payload[account].send.time
        let newtime = new Date(time)
        newtime.setDate(newtime.getDate() + 1)
        let seconds = newtime.getTime() - (new Date()).getTime()
        showTime(seconds / 1000)
    } catch (error) {
        alert(error)
    }
    let data = await fetch("https://data.ripple.com/v2/exchange_rates/INL+rsARtxd6M1RBoGKwoGh4ujCQ9A6iDYEu4s/XRP").then(res => res.json())
    //document.querySelector("#users").innerHTML = data.users
    document.querySelector("#tokens").innerHTML = Number(data.rate).toFixed(1) + " INL/XRP"

}