from flask import Flask, send_from_directory

class config:
    # Obviously, you'd want to put the secret key in an .env file for production
    # put for the sake of ease when testing the app, it is hard coded here
    SECRET_KEY = "asdfseinrisen3827"

app = Flask(__name__)
app.config.from_object(config)

@app.route("/")
def sendPage():
    return send_from_directory("./", "page.html")