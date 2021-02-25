const devices = []

const makeGraphs = (readings, diagnostics) => {
    console.log("here")
}

const checkDevices = async () => {
    for(let i = 0; i < devices.length; i++){
        try{
            const res = await fetch(devices[i].ip + "/ping")
            console.log("Setting to connected")
            devices[i].statusNode.innerHTML = "Connected"
            const section = devices[i].statusNode.parentNode
            section.classList.remove("Disconnected")
            section.classList.add("Connected")

            document.getElementById(devices[i].name + "-windowSize").disabled = false
            document.getElementById(devices[i].name + "-intervalSize").disabled = false
            document.getElementById(devices[i].name + "-filePath").disabled = false
            document.getElementById(devices[i].name + "-queryButton").disabled = false
            
            continue
        }catch(e){
            console.log(e)
            devices[i].statusNode.innerHTML = "Disconnected"
            document.getElementById(devices[i].name + "-windowSize").disabled = true
            document.getElementById(devices[i].name + "-intervalSize").disabled = true
            document.getElementById(devices[i].name + "-filePath").disabled = true
            document.getElementById(devices[i].name + "-queryButton").disabled = true
        }
    }
}

const sendQuery = async (e) => {
    const name = e.target.parentNode.id
    const ip = e.target.parentNode.ip
    console.log(name + "-windowSize")
    const window = document.getElementById(name + "-windowSize").value
    const interval = document.getElementById(name + "-intervalSize").value
    let filePath = document.getElementById(name + "-filePath").value
    filePath = filePath.split("/").join("%2F")
    let queryString = ip + "/" + window.toString() + "/"
    queryString += interval.toString()
    queryString += "?file-location=" + filePath
    const res = await fetch(queryString)
    
    const data = await res.json()

    if(data.msg){
        alert(data.msg)
    } else if(data.readings && data.diagnostics){
        makeGraphs(data.readings, data.diagnostics)
    } else{
        alert("Error")
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
    displayDiv.id = newDevice.name
    displayDiv.ip = newDevice.ip

    const title = document.createElement("h4")
    title.innerHTML = newDevice.name
    const ip = document.createElement("h4")
    ip.innerHTML = newDevice.ip
    const status = document.createElement("h4")
    status.innerHTML = newDevice.status

    const windowSizeDiv = document.createElement("div")
    windowSizeDiv.classList.add("deviceControlDiv")
    const intervalSizeDiv = document.createElement("div")
    intervalSizeDiv.classList.add("deviceControlDiv")
    const windowSizeLabel = document.createElement("label")
    windowSizeLabel.innerHTML = "Window Size"
    const windowSize = document.createElement("input")
    windowSize.type = "number"
    windowSize.disabled = true
    windowSize.id = newDevice.name + "-windowSize"
    windowSizeDiv.appendChild(windowSizeLabel)
    windowSizeDiv.appendChild(windowSize)
    windowSize.classList.add("deviceControlInput")
    const intervalSizeLabel = document.createElement("label")
    intervalSizeLabel.innerHTML = "Interval Size"
    const intervalSize = document.createElement("input")
    intervalSize.type = "number"
    intervalSize.disabled = true
    intervalSize.id = newDevice.name + "-intervalSize"
    intervalSize.classList.add("deviceControlInput")
    intervalSizeDiv.appendChild(intervalSizeLabel)
    intervalSizeDiv.appendChild(intervalSize)
    const fileNameDiv = document.createElement("div")
    fileNameDiv.classList.add("deviceControlDiv")
    const fileNameLabel = document.createElement("label")
    fileNameLabel.innerHTML = "Path to file"
    const filePath = document.createElement("input")
    filePath.id = newDevice.name + "-filePath"
    filePath.disabled = true
    filePath.classList.add("deviceControlInput")
    fileNameDiv.appendChild(fileNameLabel)
    fileNameDiv.appendChild(filePath)

    const queryButton = document.createElement("button")
    queryButton.id = newDevice.name + "-queryButton"
    queryButton.innerHTML = "Send Query"
    queryButton.disabled = true
    queryButton.addEventListener("click", sendQuery)

    displayDiv.appendChild(title)
    displayDiv.appendChild(ip)
    displayDiv.appendChild(status)
    displayDiv.appendChild(windowSizeDiv)
    displayDiv.appendChild(intervalSizeDiv)
    displayDiv.appendChild(fileNameDiv)
    displayDiv.appendChild(queryButton)


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