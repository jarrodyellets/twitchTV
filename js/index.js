$(document).ready(function() {
  var channels = [
    "esl_sc2",
    "ogamingsc2",
    "cretetion",
    "freecodecamp",
    "imaqtpie",
    "habathcx",
    "robotcaleb",
    "noobs2ninjas"
  ];

  $("#searchDiv").hide();

  // Button click events
  $("#all").click(function() {
    $(".online").show();
    $(".offline").show();
    $(".online").addClass("selected");
    $(".offline").addClass("selected");
    $(".searchBar").val("");
  });

  $("#online").click(function() {
    $(".online").show();
    $(".online").addClass("selected");
    $(".offline").hide();
    $(".offline").removeClass("selected");
    $(".searchBar").val("");
  });

  $("#offline").click(function() {
    $(".online").hide();
    $(".online").removeClass("selected");
    $(".offline").show();
    $(".offline").addClass("selected");
    $(".searchBar").val("");
  });

  $("#search").click(function() {
    $("#searchDiv").slideToggle();
  });

  // Search for channels
  $("#searchBar").keyup(function(e) {
    for (var i = 0; i < channels.length; i++) {
      if (
        channels[i].indexOf(
          $("#searchBar")
            .val()
            .toLowerCase()
        ) < 0
      ) {
        $("#" + channels[i]).hide();
      }
      if (e.which === 8) {
        if (channels[i].indexOf($("#searchBar").val()) > -1) {
          $("#" + channels[i]+".selected").show();
        }
      }
    }
  });

  // Initialize data
  channels.forEach(function(e) {
    getInfo(e, "streams");
  });

  // Get info from API
  function getInfo(channel, option) {
    $.ajax({
      type: "GET",
      url: "https://wind-bow.glitch.me/twitch-api/" + option + "/" + channel,
      datatype: "json",
      success: function(val) {
        if (!("stream" in val)) {
          streamNull(val, channel);
        } else if (val.stream === null) {
          getInfo(channel, "users");
        } else {
          streamOn(val);
        }
      }
    });
  }

  // Display channels currently streaming
  function streamOn(val) {
    $("#results").append(
      "<div class='channelResults online selected' id='" +
        val.stream.channel.name +
        "'><a href=" +
        val.stream.channel.url +
        " target='_blank'><div class='active'><img class='logo' src=" +
        val.stream.channel.logo +
        " ><h4 class='displayName'>" +
        val.stream.channel.display_name +
        "</h4><p class='status'>" +
        val.stream.game +
        "</p></div></a><div class='led-green'></div></div>"
    );
  }

  // Display channels currently offline
  function streamNull(val, channel) {
    $("#results").append(
      "<div class='channelResults offline selected' id='" +
        val.name +
        "'><a href='https://www.twitch.tv/" +
        val.name +
        "' target='_blank'><div class='opacity'><img class='logo' src=" +
        val.logo +
        " ><h4 class='displayName'>" +
        val.display_name +
        "</h4><p class='status'>Offline</p></div></a><div class='led-red'></div></div>"
    );
  }
});