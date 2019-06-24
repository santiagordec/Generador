import Handlebars from "handlebars";
import { default as $ } from "jquery";
import activities from "./templates/activities.hbs";
import activity_entry from "./templates/activity_entry.hbs";
import link_entry from "./templates/link_entry.hbs";
import result from "./templates/result.hbs";
import table from "./templates/table.hbs";
import code from "./templates/code.hbs";
Handlebars.registerPartial("activity_entry", activity_entry);
Handlebars.registerPartial("link_entry", link_entry);
Handlebars.registerPartial("table", table);

loadPage();

function addActivity() {
  const template = Handlebars.compile(activity_entry);
  const new_activity = template({ links: [""] });
  const newNode = $(new_activity);
  $("#activities_list").append(newNode);
  newNode.find(".remove_activity").click(removeActivity);
  newNode.find(".add_link").click(addLink);
  newNode.find(".remove_link").click(removeLink);
}

function addLink() {
  const template = Handlebars.compile(link_entry);
  const new_link = template();
  const newNode = $(new_link);
  const links_list = $(this)
    .parent()
    .find(".links_list");
  links_list.append(newNode);
  newNode.find(".remove_link").click(removeLink);
}

function removeActivity() {
  $(this)
    .closest(".activity_entry")
    .remove();
}

function removeLink() {
  $(this)
    .closest(".link_entry")
    .remove();
}

function loadPage() {
  const template = Handlebars.compile(activities);
  const data = {
    activities: [{ links: [""] }]
  };
  const html = template(data);
  $("#activities").html(html);
  $("#add_activity").click(addActivity);
  $(".remove_activity").click(removeActivity);
  $(".add_link").click(addLink);
  $(".remove_link").click(removeLink);

  $("#done").click(loadResult);
}

function loadResult() {
  const data = {
    activities: []
  };
  $(".activity_entry").each(function() {
    const new_activity = {};
    new_activity.visible = $(this)
      .find(".visible_field")
      .prop("checked");
    new_activity.name = $(this)
      .find(".name_field")
      .val();
    new_activity.duration = $(this)
      .find(".duration_field")
      .val();
    new_activity.participants = $(this)
      .find(".participants_field")
      .val();
    new_activity.instructions = $(this)
      .find(".instructions_field")
      .val();
    new_activity.answers = $(this)
      .find(".answers_field")
      .val();
    new_activity.links = [];
    $(this)
      .find(".link_entry")
      .each(function() {
        const link = $(this)
          .find(".link_field")
          .val();
        new_activity.links.push(link);
      });
    data.activities.push(new_activity);
  });

  const code_template = Handlebars.compile(code);
  const codebox = code_template({ ...data, json: JSON.stringify(data) });

  data.code = codebox;

  const template = Handlebars.compile(result);
  const html = template(data);
  $("#result").html(html);
}
