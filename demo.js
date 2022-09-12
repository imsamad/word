(function () {
  document
    .getElementById("document")
    .addEventListener("change", handleFileSelect, false);

  function handleFileSelect(event) {
    readFileInputEventAsArrayBuffer(event, function (arrayBuffer) {
      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then(displayResult)
        .done();
    });
  }

  function displayResult(result) {
    const outputBox = document.getElementById("output");

    const questionDocument = new DOMParser().parseFromString(
      result.value,
      "text/html"
    );

    console.log(`questionDocument `, questionDocument.body);

    let questionSets = questionDocument
      .querySelector("body")
      .querySelectorAll(":scope > ol");
    if (!questionSets.length)
      questionSets = questionDocument
        .querySelector("body")
        .querySelectorAll(":scope > ul");

    if (!questionSets.length) return;

    let questions = [];

    questionSets.forEach((questionSet) => {
      let allQuestions = questionSet.querySelectorAll(":scope > li");

      allQuestions.forEach((q) => {
        const question = q.childNodes[0].textContent;

        let optionsULorOL = q.querySelector(":scope > ol");

        if (!optionsULorOL) optionsULorOL = q.querySelector(":scope > ul");
        // No options provided
        if (!optionsULorOL) return;

        let optionsDOM = optionsULorOL.querySelectorAll(":scope > li");
        if (!optionsDOM.length) return;
        let options = [];
        optionsDOM.forEach((op) => {
          options.push(op.textContent);
        });

        questions.push({ question, options });
      });
    });
    console.log("questions ", questions);
    const quest = questions
      .map((q) => {
        const options = q.options
          .map((opt) => {
            const singleOption = `<li>${opt}</li>`;
            return singleOption;
          })
          .join("    ");
        return `<li>${q.question}<ol>${options}</ol></li>`;
      })
      .join(" ");

    outputBox.innerHTML = `<ol>${quest}</ol>`;
  }

  function readFileInputEventAsArrayBuffer(event, callback) {
    var file = event.target.files[0];

    var reader = new FileReader();

    reader.onload = function (loadEvent) {
      var arrayBuffer = loadEvent.target.result;
      callback(arrayBuffer);
    };

    reader.readAsArrayBuffer(file);
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
