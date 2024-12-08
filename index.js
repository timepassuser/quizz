var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};


window.onload = async function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid black}";
    document.body.appendChild(css);


    var quizzesDisplay = document.getElementById("quizzesDisplay");
    var quizzesObject = await getSampleQuizzes();
    // console.log(quizzesObject);

    quizzesObject.quizzes.forEach(function(quiz) {
        let quizCard = document.createElement("span");
        quizCard.setAttribute("class", "quizCard");

        if (quiz.image) {
            let image = document.createElement("image");
            image.src = quiz.image;
            quizCard.appendChild(image);
        }

        let quizNameElement = document.createElement("h3");
        quizNameElement.innerText = quiz.name;
        quizNameElement.setAttribute("class", "quizName");
        quizCard.appendChild(quizNameElement);

        let quizLengthElement = document.createElement("p");
        quizLengthElement.innerText = "No. of questions: " + quiz.noOfQuestions;
        if (quiz.timeLimit) {
            quizLengthElement.innerText += "\nTime Limit: " + quiz.timeLimit + " minutes";
        }
        quizLengthElement.setAttribute("class", "quizLength");
        quizCard.appendChild(quizLengthElement);

        let quizDescElement = document.createElement("p");
        quizDescElement.innerText = quiz.description;
        quizDescElement.setAttribute("class", "quizDesc");
        quizCard.appendChild(quizDescElement);

        let quizPlayButton = document.createElement("button");
        quizPlayButton.innerText = "Play Quiz";
        quizPlayButton.setAttribute("class", "quizPlayButton");
        quizPlayButton.addEventListener("click", (event) => {
            let quizName = event.currentTarget.parentElement.querySelector("h3.quizName").innerText;
            window.location.href = "play.html?name=" + quizName;
        })
        quizCard.appendChild(quizPlayButton);

        quizzesDisplay.appendChild(quizCard);
    })
}