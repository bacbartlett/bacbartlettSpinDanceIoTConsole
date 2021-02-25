//global to keep track of active devices
const devices = []

// function to generate the graphs for incoming data
const makeGraphs = (readings, diagnostics) => {
    const graphdiv = document.getElementById("graphContainers")

    const graphGroup = document.createElement("div")
    graphdiv.prepend(graphGroup)

    const readingsTable = document.createElement("table")
    const readingHeader = document.createElement("tr")
    readingsTable.appendChild(readingHeader)
    readingHeader.innerHTML = "<td>Timestamp</td><td>Temperature</td><td>Humidity</td><td>Pressure</td>"

    for(let i = 0; i < readings.length; i++){
        const row = document.createElement("tr")
        const data = readings[i]
        row.innerHTML = `<td>${data.timestamp}</td><td>${data.temperature}</td><td>${data.humidity}</td><td>${data.pressure}</td>`
        readingsTable.appendChild(row)
    }

    graphGroup.appendChild(readingsTable)

    const diagnosticsTable = document.createElement("table")
    const diagnosticsHeader = document.createElement("tr")
    diagnosticsTable.appendChild(diagnosticsHeader)
    diagnosticsHeader.innerHTML = "<td>Timestamp</td><td>Min-Temperature</td><td>Max-Temperature</td><td>Avg-Temperature</td><td>Min-Humidity</td><td>Max-Humidity</td><td>Avg-Humidity</td><td>Min-Pressure</td><td>Max-Pressure</td><td>Avg-Pressure</td>"

    for(let i = 0; i < diagnostics.length; i++){
        const row = document.createElement("tr")
        const data = diagnostics[i]
        row.innerHTML = `<td>${data.timestamp}</td><td>${data["min-temperature"]}</td><td>${data["max-temperature"]}</td><td>${data["avg-temperature"]}</td><td>${data["min-humidity"]}</td><td>${data["max-humidity"]}</td><td>${data["avg-humidity"]}</td><td>${data["min-pressure"]}</td><td>${data["max-pressure"]}</td><td>${data["avg-pressure"]}</td>`
        diagnosticsTable.append(row)
    }

    graphGroup.prepend(diagnosticsTable)


}

//this function is run on a constant interval to establish which devices are currently connected
//it then toggles the controls to be sure only active devices are interacted with
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

//sends query to device
const sendQuery = async (e) => {
    //attributes kept in div properties for fetching
    const name = e.target.parentNode.id
    const ip = e.target.parentNode.ip
    const window = document.getElementById(name + "-windowSize").value
    const interval = document.getElementById(name + "-intervalSize").value
    let filePath = document.getElementById(name + "-filePath").value
    //url encodes the filepath
    filePath = filePath.split("/").join("%2F")
    let queryString = ip + "/" + window.toString() + "/"
    queryString += interval.toString()
    queryString += "?file-location=" + filePath
    const res = await fetch(queryString)
    
    const data = await res.json()

    //displays basic error
    if(data.msg){
        alert(data.msg)
    } else if(data.readings && data.diagnostics){
        makeGraphs(data.readings, data.diagnostics)
    } else{
        alert("Error")
    }
}

//this function adds each new device and hooks up the inputs correctly
//it also made me appreciate React more!
const addDevice = () => {
    const newDevice = {
        ip: document.getElementById("newdeviceIP").value,
        name: document.getElementById("newdeviceName").value,
        status: "Connecting..."
    }
    if(newDevice.ip === "" || newDevice.name === ""){
        return
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