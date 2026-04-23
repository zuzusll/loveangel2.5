from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# Полная синхронизация текста
LYRICS_DATA = [
    {"time": 0, "text": "Всё было так, будто бы написано небом..."},
    {"time": 6, "text": "Я и ты — будто бы рисунок мелом"},
    {"time": 10, "text": "И что сотрут, я в это уже не верил"},
    {"time": 14, "text": "Но всё же на доске остались мокрым следом"},
    {"time": 17, "text": "Разрушено всё, к чему шли годами"},
    {"time": 21, "text": "А помнишь дни за закрытыми стенами?"},
    {"time": 25, "text": "В своей комнате бесконечными слезами..."},
    {"time": 28, "text": "До сих пор это вижу закрытыми глазами"},
    {"time": 32, "text": "Рассказ о жизни нашей — Ад, правда слаще"},
    {"time": 36, "text": "И снова боли в сердце, и ритм чаще"},
    {"time": 39, "text": "Не покидайте меня, мысли, о том, что было"},
    {"time": 43, "text": "Я помню: я любил и она любила"},
    {"time": 47, "text": "Растерзайте душу мою, но её не троньте"},
    {"time": 51, "text": "Раздели меня на тысячи частей, Боже"},
    {"time": 54, "text": "Останови в венах кровь мою, ты же слышишь"},
    {"time": 58, "text": "Но молю тебя, пускай она дальше дышит"},
    {"time": 61, "text": "Дыши, слышишь? Умоляю, только дыши"},
    {"time": 65, "text": "Я уйду, но останусь в глубине души"},
    {"time": 69, "text": "Дыши, слышишь? Умоляю, только дыши"},
    {"time": 72, "text": "Дай послушать твой голос мёртвой глуши"},
    {"time": 159, "text": "Меня накажи, а её не тронь, слышишь?"},
    {"time": 163, "text": "Пускай она живёт, пускай дальше дышит"},
    {"time": 177, "text": 'И на асфальте белым мелом слово "дыши"'},
    {"time": 181, "text": "Дыши... только дыши ❤️"}
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/get_lyrics')
def get_lyrics():
    return jsonify(LYRICS_DATA)

@app.route('/save', methods=['POST'])
def save_message():
    data = request.get_json()
    msg = data.get('message')
    if msg:
        with open("messages.txt", "a", encoding="utf-8") as f:
            f.write(f"От неё: {msg}\n---\n")
        return jsonify({"status": "ok"})
    return jsonify({"status": "error"}), 400

@app.route('/send_admin', methods=['POST'])
def send_admin():
    data = request.get_json()
    msg = data.get('message')
    if msg:
        with open("admin_messages.txt", "w", encoding="utf-8") as f:
            f.write(msg)
        return jsonify({"status": "ok"})
    return jsonify({"status": "error"}), 400

@app.route('/get_admin_msg')
def get_admin_msg():
    if os.path.exists("admin_messages.txt"):
        with open("admin_messages.txt", "r", encoding="utf-8") as f:
            return jsonify({"message": f.read()})
    return jsonify({"message": ""})

if __name__ == '__main__':
    app.run(debug=True)