window.onload = async function() {
    var playingElement = document.getElementById("playing");
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);
    var quizName = params.get("name");
    if (quizName) {
        if (play(quizName) === 0) {
            playingElement.innerText = "invalid quiz name";
        }
    } else {
        playingElement.innerText = "no quiz specified";
        // window.location.href = "/";
    }
}

var quizObject;
async function play(quizName) {
    var quizzesObject = await getSampleQuizzes();
    quizzesObject.quizzes.forEach(function(quizParam) {
        if (quizName === quizParam.name) {
            quizObject = quizParam;
            document.getElementById("playing").innerText = "Playing Quiz - " + quizObject.name;
            var quizContainer = document.getElementById("quizContainer");
            var blackBackground = 1,
                backgroundColor, color;
            quizObject.questions.forEach(function(questionObject, i) {
                let questionCard = document.createElement("span");
                questionCard.setAttribute("class", "questionCard");
                backgroundColor = blackBackground ? "black-background" : "white-background";
                color = blackBackground ? (blackBackground--, "white-background") : (blackBackground++, "black-background");
                questionCard.classList.add(backgroundColor);

                let questionElement = document.createElement("span");
                questionElement.setAttribute("class", "questionElement");
                questionElement.innerText = "Q" + (i + 1) + ". " + questionObject.question;
                questionCard.appendChild(questionElement);

                questionObject.options.forEach(function(option, j) {
                    let optionContainer = document.createElement("div");
                    optionContainer.setAttribute("class", "optionContainer");

                    let optionElement = document.createElement("input");
                    optionElement.setAttribute("type", "radio");
                    optionElement.setAttribute("name", "question" + (i + 1));
                    optionElement.setAttribute("class", "optionRadio");
                    optionElement.setAttribute("id", "question" + i + "option" + j)
                    optionElement.setAttribute("value", j);
                    optionElement.classList.add(color);
                    // optionElement.style.borderColor = questionCard.style.color;
                    optionContainer.appendChild(optionElement);

                    let textElement = document.createElement("span");
                    textElement.setAttribute("class", "optionLabel");
                    // textElement.setAttribute("for", "question" + i + "option" + j);
                    if (option.includes("<sup>") && option.includes("</sup")) {
                        option = option.split("<sup>");
                        option.forEach(function(string) {
                            if (string.includes("</sup>")) {
                                string = string.split("</sup>");
                                tempString = "<sup>"
                                tempString += string[0];
                                tempString += "</sup>";
                                tempString += string[1];
                                textElement.innerHTML += tempString;
                            } else {
                                textElement.innerHTML += string;
                            }
                        })
                    } else {
                        textElement.innerText = option;
                    }
                    optionContainer.appendChild(textElement);

                    optionContainer.addEventListener("click", (event) => {
                        event.currentTarget.children[0].checked = true;
                    })
                    questionCard.appendChild(optionContainer);
                    // questionCard.appendChild(document.createElement("br"));
                });

                quizContainer.appendChild(questionCard);

            });
            let questionCard = document.createElement("span");
            questionCard.setAttribute("class", "questionCard");
            questionCard.classList.add(color);
            questionCard.setAttribute("id", "lastCard");

            let submitButton = document.createElement("button");
            submitButton.setAttribute("class", backgroundColor)
            submitButton.setAttribute("id", "submitButton");
            submitButton.setAttribute("type", "submit");
            submitButton.innerText = "Submit";
            document.getElementById("form").addEventListener("submit", evaluateScore);
            questionCard.appendChild(submitButton);
            quizContainer.appendChild(questionCard);
            return;
        }
    });
    return 0;
}

function evaluateScore(submitEvent) {
    submitEvent.preventDefault();
    var score = 0;
    correctMarking = quizObject.defaultCorrectMarking;
    incorrectMarking = quizObject.defaultIncorrectMarking;
    var formdata = new FormData(document.getElementById("form"));
    for (let i = 0; i < quizObject.questions.length; i++) {
        if (formdata.has("question" + (i + 1))) {
            if (formdata.get("question" + (i + 1)) == quizObject.questions[i].correct) {
                score += correctMarking;
            } else {
                score += incorrectMarking;
            }
        }
    }
    document.getElementById("lastCard").innerText = "You Scored: " + score + "\n" + "Maximum possible: " + correctMarking * quizObject.questions.length;

    // console.log(score);
}