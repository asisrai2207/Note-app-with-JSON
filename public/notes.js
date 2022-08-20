var notesTemplate = Handlebars.compile(
  `
  {{#each notes}}
  <div class="note">
      <span class="input"><textarea id={{id}}>{{content}}</textarea></span>

      <button class="remove btn btn-xs" id={{id}}><i class="fa fa-trash" aria-hidden="true"></i></button>
  </div>
  {{/each}}
        `
);

// This function is responsible of re-rendering the page every time we update our notes. It recieves the array of notes and then forces each note (each element within the array) into the notes template, which iterates through the array rendering all the notes to the DOM in the same format.
const reloadNotes = (notes) => {
  $("#notes").html(notesTemplate({ notes: notes }));
};

// This function is used and defined to make a message appear on the dom when saving our note.
const beginSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").show();
};

// This function is used and defined to make a message disappear on the dom after saving our note.
const endSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").hide();
};

$(() => {
  $("#add").submit((e) => {
    beginSaving();
    e.preventDefault();
    console.log("add pressed");
    const value = $("#add-note").val();
    if (value === "") {
      return;
    }
    $("#add-note").val("");
    axios
      .post("/api/notes", {
        note : value,
      })
      .then((res) => {
        reloadNotes(res.data);
        console.log(data);
      });
      setTimeout(endSaving,1000);
  });

  $("#notes").on("blur", "textarea", (event) => {
    beginSaving();
    axios
      .put("/api/notes/" + $(event.currentTarget).attr("id"), {
        note: $(event.currentTarget).val(),
      })
      .then((res) => {
        reloadNotes(res.data);
        console.log(data);
      });
      setTimeout(endSaving,1000);
  });

  //Remove notes
  $("#notes").on("click", ".remove", (event) => {
    axios
      .delete("/api/notes/" + $(event.currentTarget).attr("id"))
      .then((res) => {
        reloadNotes(res.data);
      });
  });
});
