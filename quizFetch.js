async function getSampleQuizzes(errorElement) {
    const sampleQuizUrl = window.location.href + "/samplequizzes.json";
    try {
        let response = await fetch(sampleQuizUrl);
        if (!response.ok) {
            errorElement.innerText = `Response from server was ${response.status}`;
            return 0;
        } else {
            quizzesObject = await response.json();
            return quizzesObject;
        }
    } catch {
        console.log("Error fetching resource");
        return 0;
    }
}