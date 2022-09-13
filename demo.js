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
    console.log(`):- DOC `, result.value);
    const questionDocument = new DOMParser().parseFromString(
      result.value,
      "text/html"
    );

    console.log(`):- questionDocument `, questionDocument.body);

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
        let qu = "";
        q.childNodes.forEach((child) => {
          if (["ol", "ul"].includes(child.nodeName.toLowerCase())) return;
          // console.log("child ", child);
          // console.log("nodeValue ", child.nodeValue);
          // console.log(`innerHTML `, child.innerHTML);
          // console.log(`textContent `, child.textContent);
          // // console.log("getTag ", getTag(child));
          const isHTMLtag = child.tagName?.toLowerCase();
          // console.log(`isHTMLtag `, isHTMLtag);
          if (isHTMLtag == "img") {
            let img = "<img";
            for (var i = 0; i < child?.attributes?.length; i++) {
              var attrib = child.attributes[i];
              img += ` ${attrib.name}="${attrib.value}" `;
              // img += " " + attrib.name + "=" + attrib.value;
            }
            // child.attributes.forEach((attrib) => {
            //   img += ` ${attrib.name}=${attrib.value}`;
            // });
            // img+=child.attributes
            // console.log("child img", child.attributes);
            img += "/>";
            qu += img;
            return;
          }
          if (isHTMLtag) {
            let ch = `<${isHTMLtag}>${child.textContent}</${isHTMLtag}>`;
            qu += ch;
            return;
          }

          qu += child.textContent;
        });
        console.log(`question `, qu);
        // const question = q.childNodes[0].textContent;
        const question = qu;

        let optionsULorOL = q.querySelector(":scope > ol");

        if (!optionsULorOL) optionsULorOL = q.querySelector(":scope > ul");
        // No options provided
        if (!optionsULorOL) {
          // return;
        }

        let optionsDOM = optionsULorOL?.querySelectorAll?.(":scope > li");
        if (!optionsDOM?.length) {
          // return;
        }
        let options = [];
        optionsDOM?.forEach((op) => {
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
