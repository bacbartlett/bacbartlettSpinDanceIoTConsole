const devices = []

const checkDevices = async () => {
    for(let i = 0; i < devices.length; i++){
        try{
            const res = await fetch(devices[i].ip + "/ping")
            if(res.ok){
                devices[i].statusNode.innerHTML = "Connected"
                devices[i].statusNode.parentNode.classList.remove("Disconnected")
                devices[i].statusNode.parentNode.classList.add("Connected")
                continue
            }
        }catch{
            devices[i].statusNode.innerHTML = "Disconnected"
        }
    }
}

const addDevice = () => {
    const newDevice = {
        ip: document.getElementById("newdeviceIP").value,
        name: document.getElementById("newdeviceName").value,
        status: "Connecting..."
    }
    if(!newDevice.ip.startsWith("http://")){
        newDevice.ip = "http://" + newDevice.ip
    }
    while(newDevice.ip.endsWith("/")){
        let temp = newDevice.ip.split("")
        temp.pop()
        newDevice.ip = temp.join("")
    }
    devices.push(newDevice)
    const displayDiv = document.createElement("div")
    displayDiv.classList.add("displayNode")

    const title = document.createElement("h4")
    title.innerHTML = newDevice.name
    const ip = document.createElement("h4")
    ip.innerHTML = newDevice.ip
    const status = document.createElement("h4")
    status.innerHTML = newDevice.status

    displayDiv.appendChild(title)
    displayDiv.appendChild(ip)
    displayDiv.appendChild(status)

    newDevice.statusNode = status

    document.getElementById("deviceList").appendChild(displayDiv)

    document.getElementById("newdeviceIP").value = ""
    document.getElementById("newdeviceName").value = ""

    checkDevices()
    
}





const whenLoaded = () => {
    document.getElementById("addDevice").addEventListener("click", addDevice)
    setInterval(checkDevices, 5000)
}






window.addEventListener('DOMContentLoaded', whenLoaded)