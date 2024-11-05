import config
from flask import render_template
from models import Person
import people
from flask_cors import CORS

app = config.connex_app
CORS(app.app)

app.add_api(config.basedir / "swagger.yml")

@app.route("/")
def home():
    people = Person.query.all()
    return render_template("home.html", people=people)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)