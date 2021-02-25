# Instructions for use of Demo Console
To show the functions of the web portion of my solution to the SpinDance coding challenge, I built a small application that functions as a console.

Assuming you have python3, pip, and pipenv installed, clone this repo and run "pipenv shell" followed by "pipenv install" to configure all the packages. Then start the server with "flask run -p [port number]". Go to this port on a web browser and follow the instructions.

## Notes
There is a delay when requesting data from the weather nodes and it showing up on screen as the nodes are currently set to prioritize communication with AWS. After all data is uploaded, using the slower but safer MQTT Quality of Service Level 1, then the json is sent to the console.