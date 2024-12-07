async function getSampleQuizzes(errorElement) {
    const sampleQuizUrl = "/samplequizzes.json"
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
        errorElement.innerText = "Error fetching resource, check network connection";
        return 0;
    }
}